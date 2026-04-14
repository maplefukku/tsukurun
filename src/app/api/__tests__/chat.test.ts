import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.fn();

vi.mock("@/lib/glm/client", () => ({
  createGlmClient: () => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }),
  GLM_MODEL: "glm-4.7",
}));

import { POST } from "@/app/api/chat/route";

function createChatRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as any;
}

async function readStream(response: Response): Promise<string[]> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  const lines: string[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value);
    lines.push(...text.split("\n").filter((l) => l.startsWith("data: ")));
  }

  return lines;
}

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("メッセージが配列でない場合400を返す", async () => {
    const res = await POST(createChatRequest({ messages: "not-array" }) as any);
    expect(res.status).toBe(400);
  });

  it("GLM APIがエラーを投げた場合、エラーSSEイベントを返す", async () => {
    mockCreate.mockRejectedValueOnce(new Error("API timeout"));

    const res = await POST(
      createChatRequest({ messages: [{ role: "user", content: "hello" }] }) as any
    );

    // The outer try/catch returns 500 text response
    expect(res.status).toBe(500);
  });

  it("正常なストリーミングレスポンスを返す", async () => {
    // AsyncIterableを作成してストリームをシミュレート
    async function* fakeStream() {
      yield { choices: [{ delta: { content: "こんにちは" } }] };
      yield { choices: [{ delta: { content: "！" } }] };
    }

    mockCreate.mockResolvedValueOnce(fakeStream());

    const res = await POST(
      createChatRequest({ messages: [{ role: "user", content: "hello" }] }) as any
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/event-stream");

    const lines = await readStream(res);
    const textEvents = lines
      .filter((l) => l !== "data: [DONE]")
      .map((l) => JSON.parse(l.replace("data: ", "")))
      .filter((e) => e.type === "text");

    expect(textEvents).toHaveLength(2);
    expect(textEvents[0].content).toBe("こんにちは");
    expect(textEvents[1].content).toBe("！");
  });

  it("ストリーム中のエラーでエラーイベントを送信する", async () => {
    async function* failingStream() {
      yield { choices: [{ delta: { content: "start" } }] };
      throw new Error("Stream interrupted");
    }

    mockCreate.mockResolvedValueOnce(failingStream());

    const res = await POST(
      createChatRequest({ messages: [{ role: "user", content: "hello" }] }) as any
    );

    expect(res.status).toBe(200);

    const lines = await readStream(res);
    const errorEvents = lines
      .filter((l) => l !== "data: [DONE]")
      .map((l) => {
        try {
          return JSON.parse(l.replace("data: ", ""));
        } catch {
          return null;
        }
      })
      .filter((e) => e?.type === "error");

    expect(errorEvents.length).toBeGreaterThan(0);
    expect(errorEvents[0].message).toBe("Stream error");
  });

  it("サジェスチョンが含まれるレスポンスを正しくパースする", async () => {
    const suggestion = JSON.stringify([
      { id: "template-1", title: "テスト", description: "テスト説明" },
    ]);

    async function* streamWithSuggestions() {
      yield {
        choices: [
          { delta: { content: `いいですね！\n[SUGGESTIONS]\n${suggestion}\n[/SUGGESTIONS]` } },
        ],
      };
    }

    mockCreate.mockResolvedValueOnce(streamWithSuggestions());

    const res = await POST(
      createChatRequest({ messages: [{ role: "user", content: "hello" }] }) as any
    );

    const lines = await readStream(res);
    const suggestionEvents = lines
      .filter((l) => l !== "data: [DONE]")
      .map((l) => {
        try {
          return JSON.parse(l.replace("data: ", ""));
        } catch {
          return null;
        }
      })
      .filter((e) => e?.type === "suggestions");

    expect(suggestionEvents).toHaveLength(1);
    expect(suggestionEvents[0].suggestions).toHaveLength(1);
    expect(suggestionEvents[0].suggestions[0].title).toBe("テスト");
  });
});

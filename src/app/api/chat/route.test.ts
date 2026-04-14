import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

// Mock the GLM client module
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

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function readStream(response: Response): Promise<string> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }
  return result;
}

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when messages is not an array", async () => {
    const response = await POST(makeRequest({ messages: "not-array" }));
    expect(response.status).toBe(400);
  });

  it("returns 400 when messages is missing", async () => {
    const response = await POST(makeRequest({}));
    expect(response.status).toBe(400);
  });

  it("returns a streaming response with correct headers", async () => {
    // Create an async iterable to simulate the OpenAI stream
    async function* fakeStream() {
      yield { choices: [{ delta: { content: "Hello" } }] };
      yield { choices: [{ delta: { content: " world" } }] };
    }
    mockCreate.mockResolvedValue(fakeStream());

    const response = await POST(
      makeRequest({ messages: [{ role: "user", content: "Hi" }] })
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/event-stream");
    expect(response.headers.get("Cache-Control")).toBe("no-cache");

    const text = await readStream(response);
    expect(text).toContain('"type":"text"');
    expect(text).toContain('"content":"Hello"');
    expect(text).toContain('"content":" world"');
    expect(text).toContain("[DONE]");
  });

  it("calls glm.chat.completions.create with correct params", async () => {
    async function* fakeStream() {
      yield { choices: [{ delta: { content: "ok" } }] };
    }
    mockCreate.mockResolvedValue(fakeStream());

    const messages = [{ role: "user", content: "test" }];
    await POST(makeRequest({ messages }));

    // Drain the stream to ensure create was called
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "glm-4.7",
        stream: true,
        messages: expect.arrayContaining([
          expect.objectContaining({ role: "system" }),
          { role: "user", content: "test" },
        ]),
      })
    );
  });

  it("extracts suggestions from the stream content", async () => {
    const suggestionsJson = JSON.stringify([
      { id: "t1", title: "Tool", description: "A tool" },
    ]);
    async function* fakeStream() {
      yield {
        choices: [
          {
            delta: {
              content: `Here's a suggestion!\n[SUGGESTIONS]\n${suggestionsJson}\n[/SUGGESTIONS]`,
            },
          },
        ],
      };
    }
    mockCreate.mockResolvedValue(fakeStream());

    const response = await POST(
      makeRequest({ messages: [{ role: "user", content: "suggest" }] })
    );

    const text = await readStream(response);
    expect(text).toContain('"type":"suggestions"');
  });

  it("returns 500 on unexpected error", async () => {
    // Make request.json() fail by sending invalid JSON indirectly
    const badRequest = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });

    const response = await POST(badRequest);
    expect(response.status).toBe(500);
  });
});

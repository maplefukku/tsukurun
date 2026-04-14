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

import { POST } from "@/app/api/generate/route";

function createRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/generate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when body is not valid JSON", async () => {
    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      body: "not json",
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("returns 400 when templateId is missing", async () => {
    const res = await POST(createRequest({}) as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("テンプレートID");
  });

  it("returns 404 when template does not exist", async () => {
    const res = await POST(createRequest({ templateId: "nonexistent" }) as any);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toContain("見つからない");
  });

  it("returns html directly for templates without placeholders", async () => {
    const res = await POST(createRequest({ templateId: "calculator" }) as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.html).toContain("計算ツール");
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("calls GLM and replaces placeholders for templates with variables", async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({ title: "夏祭り", date: "2026-08-15" }),
          },
        },
      ],
    });

    const res = await POST(
      createRequest({
        templateId: "countdown",
        config: "夏祭りまでのカウントダウンを作って",
      }) as any,
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.html).toContain("夏祭り");
    expect(data.html).toContain("2026-08-15");
    expect(data.html).not.toContain("{{title}}");
    expect(data.html).not.toContain("{{date}}");
    expect(mockCreate).toHaveBeenCalledOnce();
  });

  it("handles GLM response wrapped in markdown code block", async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: '```json\n{"title": "太郎のメニュー", "items": "<div>カレー 800円</div>"}\n```',
          },
        },
      ],
    });

    const res = await POST(
      createRequest({ templateId: "menu-board", config: "太郎のメニュー" }) as any,
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.html).toContain("太郎のメニュー");
    expect(data.html).toContain("カレー 800円");
  });

  it("returns 500 when GLM returns unparseable content", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: "これはJSONじゃない" } }],
    });

    const res = await POST(
      createRequest({ templateId: "countdown", config: "test" }) as any,
    );

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain("解析");
  });

  it("returns 500 when GLM returns empty content", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: null } }],
    });

    const res = await POST(
      createRequest({ templateId: "countdown", config: "test" }) as any,
    );

    expect(res.status).toBe(500);
  });

  it("returns 502 when GLM API call fails", async () => {
    mockCreate.mockRejectedValue(new Error("network error"));

    const res = await POST(
      createRequest({ templateId: "countdown", config: "test" }) as any,
    );

    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.error).toContain("通信");
  });
});

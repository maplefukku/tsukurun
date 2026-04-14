import { describe, it, expect, vi, beforeEach } from "vitest";

// crypto.randomUUID のモック
vi.stubGlobal("crypto", {
  ...crypto,
  randomUUID: () => "12345678-abcd-efgh-ijkl-mnopqrstuvwx",
});

// NextRequest / NextResponse のモック
vi.mock("next/server", () => {
  return {
    NextRequest: class NextRequest extends Request {
      constructor(input: string | URL, init?: RequestInit) {
        super(input, init);
      }
    },
    NextResponse: {
      json: (body: unknown, init?: ResponseInit) => {
        return new Response(JSON.stringify(body), {
          ...init,
          headers: { "Content-Type": "application/json", ...init?.headers },
        });
      },
    },
  };
});

import { POST } from "@/app/api/publish/route";

function createRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/publish", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("有効な入力でurlとsiteIdを返す", async () => {
    const res = await POST(createRequest({ templateId: "menu-board", config: {} }) as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.url).toBeDefined();
    expect(data.siteId).toBeDefined();
  });

  it("siteIdは8文字である", async () => {
    const res = await POST(createRequest({ templateId: "menu-board", config: {} }) as any);
    const data = await res.json();

    expect(data.siteId).toHaveLength(8);
  });

  it("URLにsiteIdが含まれる", async () => {
    const res = await POST(createRequest({ templateId: "menu-board", config: {} }) as any);
    const data = await res.json();

    expect(data.url).toContain(data.siteId);
  });

  it("templateIdが未指定の場合400を返す", async () => {
    const res = await POST(createRequest({ config: {} }) as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("不正なJSONの場合500を返す", async () => {
    const req = new Request("http://localhost/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "invalid json",
    });

    const res = await POST(req as any);
    expect(res.status).toBe(500);
  });
});

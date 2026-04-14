import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: () => mockGetUser() },
    from: (...args: unknown[]) => mockFrom(...args),
  }),
}));

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

function setupAuthenticatedUser() {
  mockGetUser.mockResolvedValue({
    data: { user: { id: "user-123" } },
    error: null,
  });

  mockFrom.mockImplementation((table: string) => {
    if (table === "projects") {
      return {
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi
              .fn()
              .mockResolvedValue({ data: { id: "proj-1" }, error: null }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      };
    }
    if (table === "published_sites") {
      return {
        insert: vi.fn().mockResolvedValue({ error: null }),
      };
    }
    return {};
  });
}

const validBody = {
  templateId: "menu-board",
  config: { title: "テストメニュー" },
  generatedHtml: "<html><body>テスト</body></html>",
};

describe("POST /api/publish", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("有効な入力でurlとslugを返す", async () => {
    setupAuthenticatedUser();
    const res = await POST(createRequest(validBody) as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.url).toBeDefined();
    expect(data.slug).toBeDefined();
  });

  it("slugは8文字である", async () => {
    setupAuthenticatedUser();
    const res = await POST(createRequest(validBody) as any);
    const data = await res.json();

    expect(data.slug).toHaveLength(8);
  });

  it("URLにslugが含まれる", async () => {
    setupAuthenticatedUser();
    const res = await POST(createRequest(validBody) as any);
    const data = await res.json();

    expect(data.url).toContain(data.slug);
  });

  it("templateIdが未指定の場合400を返す", async () => {
    const res = await POST(
      createRequest({ config: {}, generatedHtml: "<html></html>" }) as any
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("generatedHtmlが未指定の場合400を返す", async () => {
    const res = await POST(
      createRequest({ templateId: "menu-board", config: {} }) as any
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("HTML");
  });

  it("未認証の場合401を返す", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: "not authenticated" },
    });

    const res = await POST(createRequest(validBody) as any);
    expect(res.status).toBe(401);
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

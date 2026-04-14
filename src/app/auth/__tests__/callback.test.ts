import { describe, it, expect, vi, beforeEach } from "vitest";

const mockExchangeCodeForSession = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(
    (
      _url: string,
      _key: string,
      _options: Record<string, unknown>
    ) => ({
      auth: { exchangeCodeForSession: mockExchangeCodeForSession },
    })
  ),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: () => [],
    set: vi.fn(),
  }),
}));

const mockRedirect = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => {
    mockRedirect(...args);
    throw new Error("NEXT_REDIRECT");
  },
}));

describe("GET /auth/callback", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
    vi.clearAllMocks();
  });

  function createMockRequest(url: string) {
    const parsedUrl = new URL(url);
    return {
      nextUrl: parsedUrl,
    };
  }

  it("codeがある場合セッション交換してdashboardにリダイレクトする", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null });

    const { GET } = await import("@/app/auth/callback/route");
    const request = createMockRequest("http://localhost/auth/callback?code=test-code");

    const response = await GET(request as any);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("test-code");
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/dashboard");
  });

  it("codeがない場合loginにリダイレクトする", async () => {
    const { GET } = await import("@/app/auth/callback/route");
    const request = createMockRequest("http://localhost/auth/callback");

    const response = await GET(request as any);

    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/login");
  });

  it("セッション交換エラー時loginにリダイレクトする", async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      error: { message: "invalid code" },
    });

    const { GET } = await import("@/app/auth/callback/route");
    const request = createMockRequest("http://localhost/auth/callback?code=bad-code");

    const response = await GET(request as any);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/login");
  });
});

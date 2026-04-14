import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetUser = vi.fn(() => Promise.resolve({ data: { user: null }, error: null }));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn((_url: string, _key: string, options: { cookies: { getAll: () => { name: string; value: string }[]; setAll: (cookies: { name: string; value: string; options: Record<string, unknown> }[]) => void } }) => {
    options.cookies.getAll();
    return {
      auth: { getUser: mockGetUser },
    };
  }),
}));

const mockNextResponse = {
  next: vi.fn(() => ({
    cookies: {
      set: vi.fn(),
    },
  })),
};

vi.mock("next/server", () => ({
  NextResponse: mockNextResponse,
}));

describe("updateSession (middleware)", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
    vi.clearAllMocks();
  });

  it("セッショントークンをリフレッシュするために getUser を呼ぶ", async () => {
    const { updateSession } = await import("../middleware");

    const mockRequest = {
      nextUrl: new URL("http://localhost/"),
      cookies: {
        getAll: () => [{ name: "sb-test", value: "token" }],
        set: vi.fn(),
      },
    };

    await updateSession(mockRequest as unknown as Parameters<typeof updateSession>[0]);

    expect(mockGetUser).toHaveBeenCalled();
  });

  it("NextResponse を返す", async () => {
    const { updateSession } = await import("../middleware");

    const mockRequest = {
      nextUrl: new URL("http://localhost/"),
      cookies: {
        getAll: () => [],
        set: vi.fn(),
      },
    };

    const response = await updateSession(mockRequest as unknown as Parameters<typeof updateSession>[0]);

    expect(response).toBeDefined();
    expect(mockNextResponse.next).toHaveBeenCalled();
  });
});

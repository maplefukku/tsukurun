import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetUser = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(
    (
      _url: string,
      _key: string,
      options: {
        cookies: {
          getAll: () => { name: string; value: string }[];
          setAll: (
            cookies: {
              name: string;
              value: string;
              options: Record<string, unknown>;
            }[]
          ) => void;
        };
      }
    ) => {
      options.cookies.getAll();
      return {
        auth: { getUser: mockGetUser },
      };
    }
  ),
}));

let capturedRedirectUrl: string | null = null;
const mockNextResponseRedirect = vi.fn((url: URL) => ({
  cookies: { set: vi.fn() },
  _redirectUrl: url.toString(),
}));

const mockNextResponse = {
  next: vi.fn(() => ({
    cookies: { set: vi.fn() },
  })),
  redirect: mockNextResponseRedirect,
};

vi.mock("next/server", () => ({
  NextResponse: mockNextResponse,
}));

function createMockRequest(pathname: string) {
  const url = `http://localhost${pathname}`;
  return {
    nextUrl: new URL(url),
    url,
    cookies: {
      getAll: () => [{ name: "sb-test", value: "token" }],
      set: vi.fn(),
    },
  };
}

describe("updateSession 認証ガード", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
    vi.clearAllMocks();
    capturedRedirectUrl = null;
  });

  it("未認証ユーザーが /dashboard にアクセスすると /login にリダイレクトする", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: "not authenticated" },
    });

    const { updateSession } = await import("../middleware");
    const req = createMockRequest("/dashboard");

    await updateSession(req as any);

    expect(mockNextResponseRedirect).toHaveBeenCalled();
    const redirectUrl = mockNextResponseRedirect.mock.calls[0][0] as URL;
    expect(redirectUrl.pathname).toBe("/login");
  });

  it("未認証ユーザーが /create にアクセスすると /login にリダイレクトする", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: "not authenticated" },
    });

    const { updateSession } = await import("../middleware");
    const req = createMockRequest("/create");

    await updateSession(req as any);

    expect(mockNextResponseRedirect).toHaveBeenCalled();
  });

  it("未認証ユーザーが /project/123 にアクセスすると /login にリダイレクトする", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: "not authenticated" },
    });

    const { updateSession } = await import("../middleware");
    const req = createMockRequest("/project/123");

    await updateSession(req as any);

    expect(mockNextResponseRedirect).toHaveBeenCalled();
  });

  it("認証済みユーザーは保護ルートに通過できる", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });

    const { updateSession } = await import("../middleware");
    const req = createMockRequest("/dashboard");

    await updateSession(req as any);

    expect(mockNextResponseRedirect).not.toHaveBeenCalled();
    expect(mockNextResponse.next).toHaveBeenCalled();
  });

  it("公開ルート / は未認証でもリダイレクトしない", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { updateSession } = await import("../middleware");
    const req = createMockRequest("/");

    await updateSession(req as any);

    expect(mockNextResponseRedirect).not.toHaveBeenCalled();
  });

  it("公開ルート /s/abc は未認証でもリダイレクトしない", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { updateSession } = await import("../middleware");
    const req = createMockRequest("/s/abc12345");

    await updateSession(req as any);

    expect(mockNextResponseRedirect).not.toHaveBeenCalled();
  });

  it("公開ルート /auth/callback は未認証でもリダイレクトしない", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { updateSession } = await import("../middleware");
    const req = createMockRequest("/auth/callback");

    await updateSession(req as any);

    expect(mockNextResponseRedirect).not.toHaveBeenCalled();
  });

  it("公開ルート /api/chat は未認証でもリダイレクトしない", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { updateSession } = await import("../middleware");
    const req = createMockRequest("/api/chat");

    await updateSession(req as any);

    expect(mockNextResponseRedirect).not.toHaveBeenCalled();
  });

  it("/login は未認証でもリダイレクトしない", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { updateSession } = await import("../middleware");
    const req = createMockRequest("/login");

    await updateSession(req as any);

    expect(mockNextResponseRedirect).not.toHaveBeenCalled();
  });

  it("/signup は未認証でもリダイレクトしない", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { updateSession } = await import("../middleware");
    const req = createMockRequest("/signup");

    await updateSession(req as any);

    expect(mockNextResponseRedirect).not.toHaveBeenCalled();
  });
});

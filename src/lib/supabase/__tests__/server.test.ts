import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCookieStore = {
  getAll: vi.fn(() => [{ name: "sb-test", value: "token-value" }]),
  set: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn((_url: string, _key: string, options: { cookies: { getAll: () => { name: string; value: string }[]; setAll: (cookies: { name: string; value: string; options: Record<string, unknown> }[]) => void } }) => {
    options.cookies.getAll();
    options.cookies.setAll([
      { name: "sb-test", value: "new-value", options: {} },
    ]);
    return {
      auth: { getUser: vi.fn() },
      from: vi.fn(),
    };
  }),
}));

describe("createClient (server)", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
    vi.clearAllMocks();
  });

  it("createServerClient を正しい URL と Key で呼び出す", async () => {
    const { createServerClient } = await import("@supabase/ssr");
    const { createClient } = await import("../server");

    await createClient();

    expect(createServerClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "test-anon-key",
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      })
    );
  });

  it("cookies の getAll を委譲する", async () => {
    const { createClient } = await import("../server");
    await createClient();

    expect(mockCookieStore.getAll).toHaveBeenCalled();
  });

  it("cookies の setAll を委譲する", async () => {
    const { createClient } = await import("../server");
    await createClient();

    expect(mockCookieStore.set).toHaveBeenCalledWith("sb-test", "new-value", {});
  });
});

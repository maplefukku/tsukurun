import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: vi.fn(() => ({
    auth: { getUser: vi.fn(), signInWithOAuth: vi.fn(), signOut: vi.fn() },
    from: vi.fn(),
  })),
}));

describe("createClient (browser)", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
  });

  it("createBrowserClient を正しい引数で呼び出す", async () => {
    const { createBrowserClient } = await import("@supabase/ssr");
    const { createClient } = await import("../client");

    createClient();

    expect(createBrowserClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "test-anon-key"
    );
  });

  it("Supabase クライアントインスタンスを返す", async () => {
    const { createClient } = await import("../client");
    const client = createClient();

    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
    expect(client.from).toBeDefined();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: () => mockGetUser() },
    from: (...args: unknown[]) => mockFrom(...args),
  }),
}));

import { POST } from "./route";

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function mockChain(data: unknown, error: unknown = null) {
  return {
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data, error }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  };
}

function setupMocks(options?: { projectError?: boolean; siteError?: boolean }) {
  mockGetUser.mockResolvedValue({
    data: { user: { id: "user-123" } },
    error: null,
  });

  const projectsChain = options?.projectError
    ? mockChain(null, { message: "project error" })
    : mockChain({ id: "project-456" });

  const sitesChain = options?.siteError
    ? {
        insert: vi.fn().mockResolvedValue({ error: { message: "site error" } }),
      }
    : {
        insert: vi.fn().mockResolvedValue({ error: null }),
      };

  mockFrom.mockImplementation((table: string) => {
    if (table === "projects") return projectsChain;
    if (table === "published_sites") return sitesChain;
    return mockChain(null);
  });
}

const validBody = {
  templateId: "menu-board",
  config: { title: "My Menu" },
  generatedHtml: "<html><body>Hello</body></html>",
};

describe("POST /api/publish", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns slug and url on successful publish", async () => {
    setupMocks();
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.slug).toBeDefined();
    expect(typeof data.slug).toBe("string");
    expect(data.slug.length).toBe(8);
    expect(data.url).toBe(`https://tsukurun.vercel.app/s/${data.slug}`);
  });

  it("returns 400 when templateId is missing", async () => {
    const response = await POST(
      makeRequest({ config: {}, generatedHtml: "<html></html>" })
    );
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe("テンプレートIDが必要です");
  });

  it("returns 400 when templateId is empty string", async () => {
    const response = await POST(
      makeRequest({ templateId: "", generatedHtml: "<html></html>" })
    );
    expect(response.status).toBe(400);
  });

  it("returns 400 when generatedHtml is missing", async () => {
    const response = await POST(
      makeRequest({ templateId: "menu-board", config: {} })
    );
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe("HTMLが必要です");
  });

  it("returns 401 when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: "not authenticated" },
    });

    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.error).toBe("認証が必要です");
  });

  it("returns 500 when project creation fails", async () => {
    setupMocks({ projectError: true });
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data.error).toBe("プロジェクトの作成に失敗しました");
  });

  it("returns 500 when published_sites insert fails", async () => {
    setupMocks({ siteError: true });
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data.error).toBe("公開に失敗しました");
  });

  it("returns 500 on invalid JSON", async () => {
    const badRequest = new NextRequest("http://localhost:3000/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "invalid json",
    });

    const response = await POST(badRequest);
    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data.error).toBe("公開に失敗しました");
  });

  it("uses config.title for project title", async () => {
    setupMocks();
    await POST(makeRequest(validBody));

    const projectsCall = mockFrom.mock.calls.find(
      (c: unknown[]) => c[0] === "projects"
    );
    expect(projectsCall).toBeDefined();
  });

  it("generates unique slugs for different requests", async () => {
    setupMocks();
    const response1 = await POST(makeRequest(validBody));
    setupMocks();
    const response2 = await POST(makeRequest(validBody));

    const data1 = await response1.json();
    const data2 = await response2.json();

    expect(data1.slug).not.toBe(data2.slug);
  });
});

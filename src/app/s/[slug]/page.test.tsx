import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: (...args: unknown[]) => mockFrom(...args),
  }),
}));

const mockNotFound = vi.fn();
vi.mock("next/navigation", () => ({
  notFound: () => {
    mockNotFound();
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import PublishedSitePage, { generateMetadata } from "./page";

function setupSiteFound(html: string = "<html><body>Test</body></html>") {
  mockFrom.mockImplementation((table: string) => {
    if (table === "published_sites") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                html_snapshot: html,
                slug: "abc12345",
                project_id: "proj-1",
              },
              error: null,
            }),
          }),
        }),
      };
    }
    if (table === "projects") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { title: "テストサイト" },
              error: null,
            }),
          }),
        }),
      };
    }
    return {};
  });
}

function setupSiteNotFound() {
  mockFrom.mockImplementation(() => ({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    }),
  }));
}

describe("/s/[slug] page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateMetadata", () => {
    it("returns project title as metadata when site exists", async () => {
      setupSiteFound();
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: "abc12345" }),
      });

      expect(metadata.title).toBe("テストサイト");
      expect(metadata.openGraph).toBeDefined();
    });

    it("returns fallback metadata when site not found", async () => {
      setupSiteNotFound();
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: "notfound1" }),
      });

      expect(metadata.title).toBe("ページが見つかりません");
    });
  });

  describe("PublishedSitePage", () => {
    it("renders iframe with html_snapshot when site exists", async () => {
      const testHtml = "<html><body>My Site</body></html>";
      setupSiteFound(testHtml);

      const result = await PublishedSitePage({
        params: Promise.resolve({ slug: "abc12345" }),
      });

      expect(result).toBeDefined();
      expect(result.props.srcDoc).toBe(testHtml);
      expect(result.props.sandbox).toBe("allow-scripts allow-same-origin");
    });

    it("calls notFound when site does not exist", async () => {
      setupSiteNotFound();

      await expect(
        PublishedSitePage({
          params: Promise.resolve({ slug: "notfound1" }),
        })
      ).rejects.toThrow("NEXT_NOT_FOUND");

      expect(mockNotFound).toHaveBeenCalled();
    });
  });
});

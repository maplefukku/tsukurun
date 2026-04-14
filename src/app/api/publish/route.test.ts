import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/publish", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns siteId and url when templateId is provided", async () => {
    const response = await POST(
      makeRequest({ templateId: "menu-board", config: { title: "My Menu" } })
    );
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.siteId).toBeDefined();
    expect(typeof data.siteId).toBe("string");
    expect(data.siteId.length).toBe(8);
    expect(data.url).toBe(`https://tsukurun.vercel.app/s/${data.siteId}`);
  });

  it("returns 400 when templateId is missing", async () => {
    const response = await POST(makeRequest({ config: {} }));
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe("テンプレートIDが必要です");
  });

  it("returns 400 when templateId is empty string", async () => {
    const response = await POST(makeRequest({ templateId: "" }));
    expect(response.status).toBe(400);
  });

  it("returns 500 on unexpected error", async () => {
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

  it("generates unique siteIds for different requests", async () => {
    const response1 = await POST(makeRequest({ templateId: "todo-list" }));
    const response2 = await POST(makeRequest({ templateId: "todo-list" }));

    const data1 = await response1.json();
    const data2 = await response2.json();

    // UUIDs should differ (extremely unlikely to collide)
    expect(data1.siteId).not.toBe(data2.siteId);
  });
});

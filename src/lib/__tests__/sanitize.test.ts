import { describe, it, expect } from "vitest";
import { sanitizeHtml } from "../sanitize";

describe("sanitizeHtml", () => {
  it("scriptタグを除去する", () => {
    const input = '<div>Hello</div><script>alert("xss")</script>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<script");
    expect(result).not.toContain("</script>");
    expect(result).toContain("<div>Hello</div>");
  });

  it("onclickなどのイベントハンドラを除去する", () => {
    const input = '<button onclick="alert(1)">Click</button>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("onclick");
    expect(result).toContain("<button");
    expect(result).toContain("Click</button>");
  });

  it("javascript: URLを無効化する", () => {
    const input = '<a href="javascript:alert(1)">Link</a>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("javascript:");
    expect(result).toContain('href=""');
  });

  it("安全なHTMLはそのまま保持する", () => {
    const input =
      '<div class="container"><h1>Title</h1><p>Paragraph</p><a href="https://example.com">Link</a></div>';
    const result = sanitizeHtml(input);
    expect(result).toBe(input);
  });

  it("ネストされたscriptタグを除去する", () => {
    const input =
      '<div><script>var a = "<script>nested</script>";</script></div>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("<script");
  });

  it("複数のイベントハンドラを全て除去する", () => {
    const input =
      '<div onmouseover="alert(1)" onmouseout="alert(2)"><img onerror="alert(3)" src="x"></div>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("onmouseover");
    expect(result).not.toContain("onmouseout");
    expect(result).not.toContain("onerror");
  });
});

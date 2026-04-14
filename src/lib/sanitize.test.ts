import { describe, it, expect } from "vitest";
import { sanitizeHtml } from "./sanitize";

describe("sanitizeHtml", () => {
  it("removes script tags", () => {
    const input = '<div>Hello</div><script>alert("xss")</script><p>World</p>';
    expect(sanitizeHtml(input)).toBe("<div>Hello</div><p>World</p>");
  });

  it("removes script tags with attributes", () => {
    const input = '<script type="text/javascript">evil()</script>';
    expect(sanitizeHtml(input)).toBe("");
  });

  it("removes event handlers (onclick)", () => {
    const input = '<button onclick="alert(1)">Click</button>';
    expect(sanitizeHtml(input)).toBe("<button>Click</button>");
  });

  it("removes event handlers (onmouseover)", () => {
    const input = '<div onmouseover="hack()">hover</div>';
    expect(sanitizeHtml(input)).toBe("<div>hover</div>");
  });

  it("removes event handlers (onerror)", () => {
    const input = '<img onerror="alert(1)" src="x">';
    expect(sanitizeHtml(input)).toBe('<img src="x">');
  });

  it("removes javascript: URLs", () => {
    const input = '<a href="javascript:alert(1)">link</a>';
    expect(sanitizeHtml(input)).toBe('<a href="">link</a>');
  });

  it("preserves safe HTML", () => {
    const input =
      '<div class="container"><h1>Title</h1><p>Paragraph</p><a href="https://example.com">Link</a></div>';
    expect(sanitizeHtml(input)).toBe(input);
  });

  it("preserves inline styles", () => {
    const input = '<div style="color: red;">styled</div>';
    expect(sanitizeHtml(input)).toBe(input);
  });

  it("handles empty string", () => {
    expect(sanitizeHtml("")).toBe("");
  });

  it("handles multiple dangerous elements at once", () => {
    const input =
      '<div onclick="x"><script>y</script><a href="javascript:z">link</a></div>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain("script");
    expect(result).not.toContain("onclick");
    expect(result).not.toContain("javascript:");
  });
});

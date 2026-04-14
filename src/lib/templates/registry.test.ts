import { describe, it, expect } from "vitest";
import { templates, getTemplateById, getTemplatesByCategory } from "./registry";

describe("templates", () => {
  it("has at least one template", () => {
    expect(templates.length).toBeGreaterThan(0);
  });

  it("contains the menu-board template", () => {
    expect(templates.some((t) => t.id === "menu-board")).toBe(true);
  });

  it("contains the todo-list template", () => {
    expect(templates.some((t) => t.id === "todo-list")).toBe(true);
  });

  it("every template has required fields", () => {
    for (const t of templates) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(t.category).toBeTruthy();
      expect(t.icon).toBeTruthy();
      expect(t.htmlTemplate).toBeTruthy();
    }
  });
});

describe("getTemplateById", () => {
  it("returns the correct template for a known id", () => {
    const result = getTemplateById("menu-board");
    expect(result).toBeDefined();
    expect(result!.id).toBe("menu-board");
    expect(result!.name).toBe("メニューボード");
  });

  it("returns undefined for an unknown id", () => {
    expect(getTemplateById("nonexistent")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(getTemplateById("")).toBeUndefined();
  });
});

describe("getTemplatesByCategory", () => {
  it("returns templates filtered by category", () => {
    const diagTemplates = getTemplatesByCategory("診断");
    expect(diagTemplates.length).toBeGreaterThan(0);
    for (const t of diagTemplates) {
      expect(t.category).toBe("診断");
    }
  });

  it("returns empty array for unknown category", () => {
    expect(getTemplatesByCategory("存在しない")).toEqual([]);
  });

  it("returns multiple templates when category has many", () => {
    const diagTemplates = getTemplatesByCategory("診断");
    expect(diagTemplates.length).toBeGreaterThanOrEqual(2);
  });
});

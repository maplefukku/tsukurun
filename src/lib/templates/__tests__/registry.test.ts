import { describe, it, expect } from "vitest";
import {
  templates,
  getTemplateById,
  getTemplatesByCategory,
  type Template,
} from "../registry";

describe("テンプレートレジストリ", () => {
  const expectedIds = [
    "menu-board",
    "todo-list",
    "countdown",
    "poll",
    "calculator",
    "personality-quiz",
    "love-compatibility",
    "skill-check",
    "mood-analyzer",
    "fortune",
  ];

  const requiredFields: (keyof Template)[] = [
    "id",
    "name",
    "description",
    "category",
    "icon",
    "htmlTemplate",
  ];

  it("テンプレートが10件登録されている", () => {
    expect(templates).toHaveLength(10);
  });

  it.each(requiredFields)(
    "各テンプレートに必須フィールド「%s」が存在する",
    (field) => {
      for (const t of templates) {
        expect(t[field]).toBeDefined();
        expect(typeof t[field]).toBe("string");
        expect((t[field] as string).length).toBeGreaterThan(0);
      }
    }
  );

  it("期待する10件のIDが全て存在する", () => {
    const ids = templates.map((t) => t.id);
    for (const id of expectedIds) {
      expect(ids).toContain(id);
    }
  });

  describe("getTemplateById", () => {
    it("存在するIDで正しいテンプレートを返す", () => {
      const result = getTemplateById("menu-board");
      expect(result).toBeDefined();
      expect(result!.id).toBe("menu-board");
      expect(result!.name).toBe("メニューボード");
    });

    it("存在しないIDでundefinedを返す", () => {
      const result = getTemplateById("nonexistent-id");
      expect(result).toBeUndefined();
    });
  });

  describe("getTemplatesByCategory", () => {
    it("カテゴリでテンプレートを絞り込める", () => {
      const diagnostic = getTemplatesByCategory("診断");
      expect(diagnostic.length).toBeGreaterThan(0);
      for (const t of diagnostic) {
        expect(t.category).toBe("診断");
      }
    });

    it("診断カテゴリに5件含まれる", () => {
      const diagnostic = getTemplatesByCategory("診断");
      expect(diagnostic).toHaveLength(5);
    });

    it("存在しないカテゴリで空配列を返す", () => {
      const result = getTemplatesByCategory("存在しないカテゴリ");
      expect(result).toEqual([]);
    });
  });
});

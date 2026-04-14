import { describe, it, expectTypeOf } from "vitest";
import type { Database } from "../types";

describe("Database types", () => {
  it("profiles テーブルの型が正しい", () => {
    type Profile = Database["public"]["Tables"]["profiles"]["Row"];
    expectTypeOf<Profile>().toHaveProperty("id");
    expectTypeOf<Profile>().toHaveProperty("display_name");
    expectTypeOf<Profile>().toHaveProperty("avatar_url");
    expectTypeOf<Profile>().toHaveProperty("line_user_id");
    expectTypeOf<Profile>().toHaveProperty("created_at");
    expectTypeOf<Profile>().toHaveProperty("updated_at");
  });

  it("projects テーブルに user_id と published_slug がある", () => {
    type Project = Database["public"]["Tables"]["projects"]["Row"];
    expectTypeOf<Project>().toHaveProperty("id");
    expectTypeOf<Project>().toHaveProperty("user_id");
    expectTypeOf<Project>().toHaveProperty("title");
    expectTypeOf<Project>().toHaveProperty("template_id");
    expectTypeOf<Project>().toHaveProperty("status");
    expectTypeOf<Project>().toHaveProperty("published_slug");
    expectTypeOf<Project>().toHaveProperty("created_at");
  });

  it("messages テーブルの role が user | assistant", () => {
    type Message = Database["public"]["Tables"]["messages"]["Row"];
    expectTypeOf<Message["role"]>().toEqualTypeOf<"user" | "assistant">();
  });

  it("published_sites テーブルに view_count がある", () => {
    type Site = Database["public"]["Tables"]["published_sites"]["Row"];
    expectTypeOf<Site>().toHaveProperty("slug");
    expectTypeOf<Site>().toHaveProperty("html_snapshot");
    expectTypeOf<Site>().toHaveProperty("view_count");
  });

  it("templates テーブルに base_config がある", () => {
    type Template = Database["public"]["Tables"]["templates"]["Row"];
    expectTypeOf<Template>().toHaveProperty("base_config");
    expectTypeOf<Template>().toHaveProperty("html_template");
  });

  it("conversations テーブルに project_id がある", () => {
    type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
    expectTypeOf<Conversation>().toHaveProperty("project_id");
    expectTypeOf<Conversation>().toHaveProperty("created_at");
  });
});

import { describe, it, expectTypeOf } from "vitest";
import type { Message, Suggestion } from "./types";

describe("Message type", () => {
  it("has the correct shape", () => {
    expectTypeOf<Message>().toHaveProperty("id");
    expectTypeOf<Message>().toHaveProperty("role");
    expectTypeOf<Message>().toHaveProperty("content");
  });

  it("id is a string", () => {
    expectTypeOf<Message["id"]>().toBeString();
  });

  it("role is limited to user or assistant", () => {
    expectTypeOf<"user">().toMatchTypeOf<Message["role"]>();
    expectTypeOf<"assistant">().toMatchTypeOf<Message["role"]>();
    expectTypeOf<"system">().not.toMatchTypeOf<Message["role"]>();
  });

  it("content is a string", () => {
    expectTypeOf<Message["content"]>().toBeString();
  });
});

describe("Suggestion type", () => {
  it("has the correct shape", () => {
    expectTypeOf<Suggestion>().toHaveProperty("id");
    expectTypeOf<Suggestion>().toHaveProperty("title");
    expectTypeOf<Suggestion>().toHaveProperty("description");
  });

  it("all fields are strings", () => {
    expectTypeOf<Suggestion["id"]>().toBeString();
    expectTypeOf<Suggestion["title"]>().toBeString();
    expectTypeOf<Suggestion["description"]>().toBeString();
  });
});

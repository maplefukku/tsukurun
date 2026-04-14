import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock openai module before importing client
vi.mock("openai", () => {
  const MockOpenAI = vi.fn();
  return { default: MockOpenAI };
});

import OpenAI from "openai";
import { createGlmClient, GLM_MODEL } from "./client";

describe("createGlmClient", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("creates an OpenAI client with default baseURL when env is not set", () => {
    delete process.env.GLM_API_KEY;
    delete process.env.GLM_BASE_URL;

    createGlmClient();

    expect(OpenAI).toHaveBeenCalledWith({
      apiKey: "",
      baseURL: "https://api.z.ai/api/coding/paas/v4/",
    });
  });

  it("uses GLM_API_KEY from environment", () => {
    process.env.GLM_API_KEY = "test-key-123";
    delete process.env.GLM_BASE_URL;

    createGlmClient();

    expect(OpenAI).toHaveBeenCalledWith({
      apiKey: "test-key-123",
      baseURL: "https://api.z.ai/api/coding/paas/v4/",
    });
  });

  it("uses GLM_BASE_URL from environment", () => {
    process.env.GLM_BASE_URL = "https://custom.api.example.com/v1/";
    process.env.GLM_API_KEY = "key";

    createGlmClient();

    expect(OpenAI).toHaveBeenCalledWith({
      apiKey: "key",
      baseURL: "https://custom.api.example.com/v1/",
    });
  });
});

describe("GLM_MODEL", () => {
  it("exports the expected model name", () => {
    expect(GLM_MODEL).toBe("glm-4.7");
  });
});

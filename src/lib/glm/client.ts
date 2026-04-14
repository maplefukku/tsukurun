import OpenAI from "openai";

export function createGlmClient() {
  return new OpenAI({
    apiKey: process.env.GLM_API_KEY ?? "",
    baseURL: process.env.GLM_BASE_URL ?? "https://api.z.ai/api/coding/paas/v4/",
  });
}

export const GLM_MODEL = "glm-4.7";

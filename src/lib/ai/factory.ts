import { AIProviderAdapter, AIProviderName } from "./types";
import { GeminiProvider } from "./gemini";
import { OpenAIProvider } from "./openai";
import { MockAIProvider } from "./mock";

export function getAIProvider(overrideProvider?: AIProviderName, apiKey?: string, model?: string): AIProviderAdapter {
  const providerName = (overrideProvider || process.env.AI_PROVIDER || "gemini").toLowerCase() as AIProviderName;

  switch (providerName) {
    case "gemini":
      return new GeminiProvider(apiKey, model);
    case "openai":
      return new OpenAIProvider(apiKey, model);
    case "mock":
    default:
      return new MockAIProvider();
  }
}

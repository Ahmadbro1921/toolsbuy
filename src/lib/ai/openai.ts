import { AIProviderAdapter, AIGenerateMetadataInput, AIGeneratedMetadataOutput } from "./types";

export class OpenAIProvider implements AIProviderAdapter {
  name: "openai" = "openai";
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || process.env.AI_API_KEY || "";
    this.model = model || process.env.AI_MODEL_NAME || "gpt-4o-mini";
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().startsWith("sk-"));
  }

  async testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    if (!this.isConfigured()) {
      return { success: false, message: "OpenAI API key is not configured or invalid." };
    }

    const start = Date.now();
    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        signal: AbortSignal.timeout(8000),
      });

      const latencyMs = Date.now() - start;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: `OpenAI API error (${response.status}): ${errorData?.error?.message || response.statusText}`,
          latencyMs,
        };
      }

      return { success: true, message: `Connected to OpenAI API successfully.`, latencyMs };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, message: `OpenAI connection failed: ${msg}`, latencyMs: Date.now() - start };
    }
  }

  async generateToolMetadata(input: AIGenerateMetadataInput): Promise<AIGeneratedMetadataOutput> {
    if (!this.isConfigured()) {
      throw new Error("OpenAI API key is not configured. Please configure it in Admin Settings.");
    }

    const prompt = `Analyze this AI tool and generate structured metadata in JSON:
Tool Name: "${input.toolName}"
Official Website: "${input.websiteUrl}"
${input.rawText ? `Extracted Context: ${input.rawText}` : ""}

Return ONLY JSON:
{
  "description": "Engaging 2-3 sentence overview.",
  "suggestedCategory": "One of: Text & LLMs, Image & Art, Code & Dev, Audio & Speech, Video Generation, Productivity, Research & Data",
  "tags": ["tag1", "tag2", "tag3"],
  "features": ["feature 1", "feature 2", "feature 3"],
  "useCases": ["use case 1", "use case 2"],
  "seoTitle": "Title under 60 chars",
  "seoDescription": "Description under 155 chars",
  "confidenceScore": 0.95
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`OpenAI generation failed: ${err?.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);

    return {
      description: parsed.description || "",
      suggestedCategory: parsed.suggestedCategory || "Productivity",
      tags: parsed.tags || [],
      features: parsed.features || [],
      useCases: parsed.useCases || [],
      seoTitle: parsed.seoTitle || `${input.toolName} Review`,
      seoDescription: parsed.seoDescription || "",
      confidenceScore: parsed.confidenceScore || 0.9,
    };
  }
}

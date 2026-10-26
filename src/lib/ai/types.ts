export type AIProviderName = "gemini" | "openai" | "mock";

export interface AIGenerateMetadataInput {
  toolName: string;
  websiteUrl: string;
  categoryHint?: string;
  rawText?: string;
}

export interface AIGeneratedMetadataOutput {
  description: string;
  suggestedCategory: string;
  tags: string[];
  features: string[];
  useCases: string[];
  seoTitle: string;
  seoDescription: string;
  confidenceScore: number;
}

export interface AIProviderStatus {
  provider: AIProviderName;
  isConfigured: boolean;
  model: string;
  message?: string;
}

export interface AIProviderAdapter {
  name: AIProviderName;
  generateToolMetadata(input: AIGenerateMetadataInput): Promise<AIGeneratedMetadataOutput>;
  testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }>;
  isConfigured(): boolean;
}

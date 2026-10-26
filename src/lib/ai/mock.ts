import { AIProviderAdapter, AIGenerateMetadataInput, AIGeneratedMetadataOutput } from "./types";

export class MockAIProvider implements AIProviderAdapter {
  name: "mock" = "mock";

  isConfigured(): boolean {
    return true;
  }

  async testConnection(): Promise<{ success: boolean; message: string; latencyMs: number }> {
    return {
      success: true,
      message: "Mock AI Provider is operational (Local simulation mode).",
      latencyMs: 45,
    };
  }

  async generateToolMetadata(input: AIGenerateMetadataInput): Promise<AIGeneratedMetadataOutput> {
    const name = input.toolName.trim();
    const lower = name.toLowerCase();

    let cat = "Productivity";
    let tags = ["AI", "Automation", "Workflow"];
    let features = ["Smart contextual assistance", "Real-time processing", "Export and collaboration"];
    let useCases = ["Accelerating repetitive tasks", "Team productivity enhancement"];

    if (lower.includes("code") || lower.includes("dev") || lower.includes("git") || lower.includes("script")) {
      cat = "Code & Dev";
      tags = ["Developer Tools", "Coding", "IDE", "Refactoring"];
      features = ["Intelligent syntax completion", "Multi-file context analysis", "Bug diagnostics"];
      useCases = ["Rapid feature prototyping", "Debugging complex software codebases"];
    } else if (lower.includes("image") || lower.includes("art") || lower.includes("photo") || lower.includes("paint")) {
      cat = "Image & Art";
      tags = ["Generative Art", "Creative", "Design", "Diffusion"];
      features = ["High-fidelity rendering", "Prompt weight controls", "Multiple visual styles"];
      useCases = ["Marketing graphics creation", "Concept art ideation"];
    } else if (lower.includes("voice") || lower.includes("audio") || lower.includes("speech") || lower.includes("sound")) {
      cat = "Audio & Speech";
      tags = ["Voice Synthesis", "Audio", "Speech-to-Text", "Podcast"];
      features = ["Natural vocal intonation", "Multi-lingual voice synthesis", "Audio mastering"];
      useCases = ["Video narration and voiceovers", "Podcast post-production"];
    } else if (lower.includes("video") || lower.includes("movie") || lower.includes("clip") || lower.includes("anim")) {
      cat = "Video Generation";
      tags = ["Video", "Generative Video", "VFX", "Animation"];
      features = ["Text-to-video synthesis", "Camera trajectory controls", "High definition rendering"];
      useCases = ["Social media video ads", "Dynamic visual storytelling"];
    } else if (lower.includes("search") || lower.includes("research") || lower.includes("data") || lower.includes("paper")) {
      cat = "Research & Data";
      tags = ["Search", "Research", "Data Analysis", "Citations"];
      features = ["Verified source citations", "Multi-source synthesis", "Deep question breakdown"];
      useCases = ["Academic literature reviews", "Competitive intelligence gathering"];
    }

    return {
      description: `${name} is an advanced artificial intelligence solution engineered to streamline ${cat.toLowerCase()} workflows with high precision and speed.`,
      suggestedCategory: cat,
      tags,
      features,
      useCases,
      seoTitle: `${name} — AI Tools Directory Review & Features`,
      seoDescription: `Explore ${name}: official features, pricing breakdown, user ratings, and verified alternatives on AI Hub.`,
      confidenceScore: 0.88,
    };
  }
}

import { cookies } from "next/headers";
import {
  Category,
  Tool,
  SiteSettings,
  AuditLog,
  ActivationRequest,
  UserSession,
  Profile,
  AccountStatus,
  UserRole,
} from "@/types";
import { createServerSupabaseClient } from "./server";
import { createAdminClient } from "./admin";

// ==============================================================================
// In-Memory Seed Store (Zero-Config Development & Fallback)
// ==============================================================================

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "c1000000-0000-0000-0000-000000000001",
    name: "Text & LLMs",
    slug: "text-llms",
    description: "Large language models, writing assistants, and reasoning engines.",
    icon: "Bot",
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "c1000000-0000-0000-0000-000000000002",
    name: "Image & Art",
    slug: "image-art",
    description: "Generative art, photo manipulation, and AI design tools.",
    icon: "Image",
    created_at: new Date(Date.now() - 86400000 * 28).toISOString(),
  },
  {
    id: "c1000000-0000-0000-0000-000000000003",
    name: "Code & Dev",
    slug: "code-dev",
    description: "Code completion, pair programming, debugging, and AI IDEs.",
    icon: "Code",
    created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
  },
  {
    id: "c1000000-0000-0000-0000-000000000004",
    name: "Audio & Speech",
    slug: "audio-speech",
    description: "Voice synthesis, music generation, and audio mastering.",
    icon: "Headphones",
    created_at: new Date(Date.now() - 86400000 * 22).toISOString(),
  },
  {
    id: "c1000000-0000-0000-0000-000000000005",
    name: "Video Generation",
    slug: "video-generation",
    description: "Text-to-video, avatar animation, and video editing suites.",
    icon: "Video",
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: "c1000000-0000-0000-0000-000000000006",
    name: "Productivity",
    slug: "productivity",
    description: "Workflow automation, summarization, and agentic workflows.",
    icon: "Zap",
    created_at: new Date(Date.now() - 86400000 * 18).toISOString(),
  },
  {
    id: "c1000000-0000-0000-0000-000000000007",
    name: "Research & Data",
    slug: "research-data",
    description: "Scientific literature search, paper summarization, and data extraction.",
    icon: "Search",
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

const INITIAL_TOOLS: Tool[] = [
  {
    id: "t1000000-0000-0000-0000-000000000001",
    name: "ChatGPT",
    slug: "chatgpt",
    description: "Versatile conversational AI developed by OpenAI, capable of complex reasoning, coding, writing, and creative generation.",
    logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80",
    official_url: "https://chatgpt.com",
    category_id: "c1000000-0000-0000-0000-000000000001",
    pricing_type: "Freemium",
    tags: ["LLM", "Writing", "Chatbot", "Multimodal"],
    is_featured: true,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Advanced data analysis", "Web browsing capabilities", "Custom GPT ecosystem", "Image generation via DALL-E"],
    useCases: ["Drafting essays & emails", "Debugging code snippets", "Brainstorming project concepts"],
    created_at: new Date(Date.now() - 86400000 * 29).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 1420,
    click_count: 8520,
  },
  {
    id: "t1000000-0000-0000-0000-000000000002",
    name: "Claude",
    slug: "claude",
    description: "Next-generation AI assistant built by Anthropic with a focus on safety, exceptional long-context comprehension, and nuanced coding.",
    logo_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=128&auto=format&fit=crop&q=80",
    official_url: "https://claude.ai",
    category_id: "c1000000-0000-0000-0000-000000000001",
    pricing_type: "Freemium",
    tags: ["LLM", "Reasoning", "Code", "Long Context"],
    is_featured: true,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["200k token context window", "Artifacts interactive preview", "High precision technical writing", "Vision analysis"],
    useCases: ["Full codebase refactoring", "Legal document analysis", "Technical documentation synthesis"],
    created_at: new Date(Date.now() - 86400000 * 27).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 980,
    click_count: 6310,
  },
  {
    id: "t1000000-0000-0000-0000-000000000003",
    name: "Cursor",
    slug: "cursor",
    description: "An intelligent, AI-first code editor built on VS Code, engineered to pair program across multi-file codebases seamlessly.",
    logo_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=128&auto=format&fit=crop&q=80",
    official_url: "https://cursor.com",
    category_id: "c1000000-0000-0000-0000-000000000003",
    pricing_type: "Freemium",
    tags: ["IDE", "Developer Tools", "Code Completion", "AI Pair Programmer"],
    is_featured: true,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Multi-file codebase indexing", "Inline diff editing", "Chat with your whole repository", "Custom model selection"],
    useCases: ["Accelerated software engineering", "Instant bug fixing across modules", "Rapid prototyping"],
    created_at: new Date(Date.now() - 86400000 * 24).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 870,
    click_count: 5120,
  },
  {
    id: "t1000000-0000-0000-0000-000000000004",
    name: "Midjourney",
    slug: "midjourney",
    description: "Industry-leading generative image engine creating photorealistic art, concept designs, and creative imagery from text prompts.",
    logo_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=128&auto=format&fit=crop&q=80",
    official_url: "https://midjourney.com",
    category_id: "c1000000-0000-0000-0000-000000000002",
    pricing_type: "Paid",
    tags: ["Art", "Image Generation", "Design", "Creative"],
    is_featured: true,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Hyper-realistic textures", "Inpainting and outpainting", "Style reference tuning", "Web editor interface"],
    useCases: ["Concept art creation", "Marketing visual assets", "Fashion & product rendering"],
    created_at: new Date(Date.now() - 86400000 * 21).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 1140,
    click_count: 7420,
  },
  {
    id: "t1000000-0000-0000-0000-000000000005",
    name: "ElevenLabs",
    slug: "elevenlabs",
    description: "Premier generative voice AI platform providing lifelike speech synthesis, voice cloning, and dubbing in dozens of languages.",
    logo_url: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=128&auto=format&fit=crop&q=80",
    official_url: "https://elevenlabs.io",
    category_id: "c1000000-0000-0000-0000-000000000004",
    pricing_type: "Freemium",
    tags: ["Voice", "Text-to-Speech", "Audio", "Dubbing"],
    is_featured: true,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Emotion-rich voice generation", "Zero-shot voice cloning", "Automated video dubbing", "Developer API"],
    useCases: ["Audiobook narration", "Video game character voiceover", "Localization & translation"],
    created_at: new Date(Date.now() - 86400000 * 19).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 650,
    click_count: 4210,
  },
  {
    id: "t1000000-0000-0000-0000-000000000006",
    name: "Runway Gen-3",
    slug: "runway-gen-3",
    description: "Cutting-edge generative video platform creating cinematic video clips with precise motion control and camera dynamics.",
    logo_url: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=128&auto=format&fit=crop&q=80",
    official_url: "https://runwayml.com",
    category_id: "c1000000-0000-0000-0000-000000000005",
    pricing_type: "Freemium",
    tags: ["Video", "Generative Video", "VFX", "Animation"],
    is_featured: true,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Text-to-video & image-to-video", "Motion brush manipulation", "Camera trajectory controls", "High definition export"],
    useCases: ["Commercial video production", "Music video VFX", "Social media creative content"],
    created_at: new Date(Date.now() - 86400000 * 16).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 530,
    click_count: 3890,
  },
  {
    id: "t1000000-0000-0000-0000-000000000007",
    name: "Perplexity AI",
    slug: "perplexity-ai",
    description: "AI-powered conversational search engine delivering cited, real-time answers with source attribution and follow-up exploration.",
    logo_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=128&auto=format&fit=crop&q=80",
    official_url: "https://perplexity.ai",
    category_id: "c1000000-0000-0000-0000-000000000007",
    pricing_type: "Freemium",
    tags: ["Search", "Research", "Citations", "Knowledge"],
    is_featured: true,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: false,
    features: ["Inline academic and web citations", "Pro Search multi-step research", "File & data analysis", "Collections sharing"],
    useCases: ["Market research", "Academic literature discovery", "Current events verification"],
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 810,
    click_count: 5940,
  },
  {
    id: "t1000000-0000-0000-0000-000000000008",
    name: "v0 by Vercel",
    slug: "v0-dev",
    description: "Generative UI system powered by AI that turns natural language descriptions into production-ready React and Tailwind components.",
    logo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80",
    official_url: "https://v0.dev",
    category_id: "c1000000-0000-0000-0000-000000000003",
    pricing_type: "Freemium",
    tags: ["Frontend", "UI Design", "React", "Tailwind"],
    is_featured: false,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Instant React & Tailwind code generation", "Interactive preview sandbox", "Figma copy-paste export", "Iterative refinements"],
    useCases: ["Dashboard wireframing", "Landing page prototyping", "Component library acceleration"],
    created_at: new Date(Date.now() - 86400000 * 11).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 420,
    click_count: 3100,
  },
  {
    id: "t1000000-0000-0000-0000-000000000009",
    name: "Stable Diffusion",
    slug: "stable-diffusion",
    description: "Open-weight text-to-image synthesis model enabling flexible on-premise and local creative image generation pipelines.",
    logo_url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=128&auto=format&fit=crop&q=80",
    official_url: "https://stability.ai",
    category_id: "c1000000-0000-0000-0000-000000000002",
    pricing_type: "Open Source",
    tags: ["Open Source", "Image Generation", "LoRA", "Local AI"],
    is_featured: false,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: false,
    features: ["Full weights downloadable", "ControlNet integration", "LoRA fine-tuning support", "ComfyUI node workflows"],
    useCases: ["Custom model fine-tuning", "Private on-premise visual generation", "Creative exploration"],
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 730,
    click_count: 4800,
  },
  {
    id: "t1000000-0000-0000-0000-000000000010",
    name: "Notion AI",
    slug: "notion-ai",
    description: "Connected AI workspace assistant that drafts, brainstorms, summarizes meetings, and answers questions across team notes.",
    logo_url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=128&auto=format&fit=crop&q=80",
    official_url: "https://notion.so",
    category_id: "c1000000-0000-0000-0000-000000000006",
    pricing_type: "Paid",
    tags: ["Productivity", "Notes", "Team Collaboration", "Knowledge Base"],
    is_featured: false,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Workspace-wide Q&A", "Automated meeting summaries", "Content translation", "Tone editing"],
    useCases: ["Team knowledge management", "Sprint retrospectives", "Meeting notes distillation"],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 390,
    click_count: 2650,
  },
];

// In-Memory store singletons
const globalStore = {
  categories: [...INITIAL_CATEGORIES],
  tools: [...INITIAL_TOOLS],
  favorites: new Map<string, Set<string>>([
    ["demo_user_id", new Set(["t1000000-0000-0000-0000-000000000001", "t1000000-0000-0000-0000-000000000003"])],
  ]),
  clicks: [
    {
      id: "ev-1",
      tool_id: "t1000000-0000-0000-0000-000000000001",
      user_id: "demo_user_id" as string | null,
      event_type: "click" as const,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "ev-2",
      tool_id: "t1000000-0000-0000-0000-000000000002",
      user_id: "demo_user_id" as string | null,
      event_type: "click" as const,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ] as { id: string; tool_id: string; user_id: string | null; event_type: "click" | "outbound" | "favorite"; created_at: string; }[],
  activationRequests: [
    {
      id: "req-1",
      user_id: "user_pending_1",
      status: "pending" as const,
      note: "Data scientist evaluating AI tools for team enterprise procurement.",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      user_email: "elena.rostova@example.com",
      display_name: "Elena Rostova",
    },
    {
      id: "req-2",
      user_id: "user_pending_2",
      status: "pending" as const,
      note: "Full-stack engineer building AI wrappers.",
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      user_email: "marcus.vance@example.com",
      display_name: "Marcus Vance",
    },
  ] as ActivationRequest[],
  users: [
    {
      id: "admin_user_id",
      email: "admin@aihub.local",
      display_name: "Lead Administrator",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      account_status: "active" as AccountStatus,
      role: "admin" as UserRole,
      created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
    },
    {
      id: "demo_user_id",
      email: "user@aihub.local",
      display_name: "Alex Developer",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      account_status: "active" as AccountStatus,
      role: "user" as UserRole,
      created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
    {
      id: "user_pending_1",
      email: "elena.rostova@example.com",
      display_name: "Elena Rostova",
      avatar_url: null,
      account_status: "pending" as AccountStatus,
      role: "user" as UserRole,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "user_pending_2",
      email: "marcus.vance@example.com",
      display_name: "Marcus Vance",
      avatar_url: null,
      account_status: "pending" as AccountStatus,
      role: "user" as UserRole,
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
  ] as { id: string; email: string; display_name: string; avatar_url: string | null; account_status: AccountStatus; role: UserRole; created_at: string; }[],
  siteSettings: {
    branding: {
      name: "AI Hub",
      tagline: "Discover the Best AI Tools",
      description: "Curated, verified directory of cutting-edge artificial intelligence tools, platforms, and models.",
    },
    features: {
      allowRegistration: true,
      requireManualApproval: false,
      enableReviews: false,
      showAffiliateDisclosures: true,
      maintenanceMode: false,
    },
    contact: {
      email: "support@aihub.local",
      adminNotificationEmail: "admin@aihub.local",
      twitter: "@aihub",
      github: "aihub",
    },
    seo: {
      defaultTitle: "AI Hub — Premier AI Tools Directory & Platform",
      defaultDescription: "Discover, filter, compare, and bookmark verified AI tools, LLMs, developer assistants, and generative engines.",
    },
  } as SiteSettings,
  auditLogs: [
    {
      id: "log-1",
      actor_user_id: "admin_user_id",
      actor_email: "admin@aihub.local",
      action: "site_initialized",
      target_type: "system",
      target_id: "ai-hub-core",
      details: { version: "1.0.0", mode: "production_ready" },
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
  ] as AuditLog[],
};

// ==============================================================================
// Session Helpers
// ==============================================================================

export async function getCurrentUserSession(): Promise<UserSession | null> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("ai_hub_session")?.value;

  if (sessionToken) {
    try {
      const decoded = JSON.parse(Buffer.from(sessionToken, "base64").toString("utf8"));
      const user = globalStore.users.find((u) => u.id === decoded.id);
      if (user) {
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          account_status: user.account_status,
          display_name: user.display_name,
        };
      }
    } catch {
      // invalid token
    }
  }

  // Also check Supabase Auth if live client configured
  const supabase = createServerSupabaseClient();
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        const { data: roleRecord } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        return {
          id: user.id,
          email: user.email || "",
          role: (roleRecord?.role as "admin" | "user") || "user",
          account_status: profile?.account_status || "active",
          display_name: profile?.display_name || user.email?.split("@")[0] || "User",
        };
      }
    } catch {
      // Supabase unreachable
    }
  }

  return null;
}

// ==============================================================================
// Category Queries & Mutations
// ==============================================================================

export async function getCategories(): Promise<Category[]> {
  const supabase = createServerSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*, tools(count)")
        .order("name", { ascending: true });
      if (!error && data) {
        return data.map((c: any) => ({
          ...c,
          tool_count: c.tools?.[0]?.count || 0,
        }));
      }
    } catch {
      // fallback
    }
  }

  return globalStore.categories.map((c) => ({
    ...c,
    tool_count: globalStore.tools.filter((t) => t.category_id === c.id && t.is_published).length,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function createCategory(input: {
  name: string;
  slug: string;
  description: string;
  icon: string;
}): Promise<Category> {
  const newCat: Category = {
    id: `c1000000-${Math.random().toString(36).substring(2, 6)}-0000-0000-${Date.now()}`,
    name: input.name,
    slug: input.slug,
    description: input.description,
    icon: input.icon || "Sparkles",
    created_at: new Date().toISOString(),
  };

  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      const { data, error } = await adminClient.from("categories").insert(newCat).select().single();
      if (!error && data) return data;
    } catch {
      // fallback
    }
  }

  globalStore.categories.push(newCat);
  return newCat;
}

export async function updateCategory(
  id: string,
  input: { name?: string; slug?: string; description?: string; icon?: string }
): Promise<Category | null> {
  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      const { data, error } = await adminClient
        .from("categories")
        .update(input)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) return data;
    } catch {
      // fallback
    }
  }

  const cat = globalStore.categories.find((c) => c.id === id);
  if (!cat) return null;
  if (input.name) cat.name = input.name;
  if (input.slug) cat.slug = input.slug;
  if (input.description !== undefined) cat.description = input.description;
  if (input.icon) cat.icon = input.icon;
  return cat;
}

export async function deleteCategory(id: string, reassignCategoryId?: string): Promise<boolean> {
  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      if (reassignCategoryId) {
        await adminClient.from("tools").update({ category_id: reassignCategoryId }).eq("category_id", id);
      }
      const { error } = await adminClient.from("categories").delete().eq("id", id);
      if (!error) return true;
    } catch {
      // fallback
    }
  }

  if (reassignCategoryId) {
    globalStore.tools.forEach((t) => {
      if (t.category_id === id) {
        t.category_id = reassignCategoryId;
      }
    });
  }
  const idx = globalStore.categories.findIndex((c) => c.id === id);
  if (idx !== -1) {
    globalStore.categories.splice(idx, 1);
    return true;
  }
  return false;
}

// ==============================================================================
// Tool Queries & Mutations
// ==============================================================================

export interface ToolFilters {
  query?: string;
  categorySlug?: string;
  categoryId?: string;
  pricingType?: string;
  isFeatured?: boolean;
  publishedOnly?: boolean;
  sortBy?: "popularity" | "newest" | "name";
  limit?: number;
  offset?: number;
}

export async function getTools(filters: ToolFilters = {}): Promise<{ tools: Tool[]; total: number }> {
  const categories = await getCategories();
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  let list = [...globalStore.tools];

  if (filters.publishedOnly !== false) {
    list = list.filter((t) => t.is_published);
  }

  if (filters.isFeatured !== undefined) {
    list = list.filter((t) => t.is_featured === filters.isFeatured);
  }

  if (filters.categoryId) {
    list = list.filter((t) => t.category_id === filters.categoryId);
  }

  if (filters.categorySlug) {
    const targetCat = categories.find((c) => c.slug.toLowerCase() === filters.categorySlug?.toLowerCase());
    if (targetCat) {
      list = list.filter((t) => t.category_id === targetCat.id);
    }
  }

  if (filters.pricingType && filters.pricingType !== "all") {
    list = list.filter((t) => t.pricing_type.toLowerCase() === filters.pricingType?.toLowerCase());
  }

  if (filters.query && filters.query.trim()) {
    const q = filters.query.toLowerCase().trim();
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  // Sort
  if (filters.sortBy === "newest") {
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (filters.sortBy === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // popularity default
    list.sort((a, b) => (b.click_count || 0) + (b.favorite_count || 0) * 3 - ((a.click_count || 0) + (a.favorite_count || 0) * 3));
  }

  const total = list.length;
  const offset = filters.offset || 0;
  const limit = filters.limit || 50;
  const paginated = list.slice(offset, offset + limit).map((t) => ({
    ...t,
    category: categoryMap.get(t.category_id),
  }));

  return { tools: paginated, total };
}

export async function getToolBySlug(slug: string, userId?: string): Promise<Tool | null> {
  const categories = await getCategories();
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const tool = globalStore.tools.find((t) => t.slug.toLowerCase() === slug.toLowerCase());
  if (!tool) return null;

  const isFavorited = userId ? globalStore.favorites.get(userId)?.has(tool.id) || false : false;

  return {
    ...tool,
    category: categoryMap.get(tool.category_id),
    is_favorited: isFavorited,
  };
}

export async function getToolById(id: string): Promise<Tool | null> {
  const categories = await getCategories();
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const tool = globalStore.tools.find((t) => t.id === id);
  if (!tool) return null;

  return {
    ...tool,
    category: categoryMap.get(tool.category_id),
  };
}

export async function createTool(input: Omit<Tool, "id" | "created_at" | "updated_at">): Promise<Tool> {
  const newTool: Tool = {
    ...input,
    id: `t1000000-${Math.random().toString(36).substring(2, 6)}-0000-0000-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 0,
    click_count: 0,
  };

  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      const { data, error } = await adminClient.from("tools").insert(newTool).select().single();
      if (!error && data) return data;
    } catch {
      // fallback
    }
  }

  globalStore.tools.unshift(newTool);
  return newTool;
}

export async function updateTool(id: string, input: Partial<Tool>): Promise<Tool | null> {
  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      const { data, error } = await adminClient
        .from("tools")
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (!error && data) return data;
    } catch {
      // fallback
    }
  }

  const tool = globalStore.tools.find((t) => t.id === id);
  if (!tool) return null;
  Object.assign(tool, input, { updated_at: new Date().toISOString() });
  return tool;
}

export async function deleteTool(id: string): Promise<boolean> {
  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      const { error } = await adminClient.from("tools").delete().eq("id", id);
      if (!error) return true;
    } catch {
      // fallback
    }
  }

  const idx = globalStore.tools.findIndex((t) => t.id === id);
  if (idx !== -1) {
    globalStore.tools.splice(idx, 1);
    return true;
  }
  return false;
}

// ==============================================================================
// Favorites & Outbound Clicks
// ==============================================================================

export async function toggleFavorite(userId: string, toolId: string): Promise<{ isFavorited: boolean; count: number }> {
  let userFavs = globalStore.favorites.get(userId);
  if (!userFavs) {
    userFavs = new Set();
    globalStore.favorites.set(userId, userFavs);
  }

  let isFavorited: boolean;
  const tool = globalStore.tools.find((t) => t.id === toolId);

  if (userFavs.has(toolId)) {
    userFavs.delete(toolId);
    isFavorited = false;
    if (tool && tool.favorite_count && tool.favorite_count > 0) {
      tool.favorite_count -= 1;
    }
  } else {
    userFavs.add(toolId);
    isFavorited = true;
    if (tool) {
      tool.favorite_count = (tool.favorite_count || 0) + 1;
    }
  }

  return { isFavorited, count: tool?.favorite_count || 0 };
}

export async function getUserFavorites(userId: string): Promise<Tool[]> {
  const userFavs = globalStore.favorites.get(userId) || new Set();
  const categories = await getCategories();
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  return globalStore.tools
    .filter((t) => userFavs.has(t.id))
    .map((t) => ({
      ...t,
      category: categoryMap.get(t.category_id),
      is_favorited: true,
    }));
}

export async function recordToolClick(toolId: string, userId?: string, ipHash?: string): Promise<void> {
  const tool = globalStore.tools.find((t) => t.id === toolId);
  if (tool) {
    tool.click_count = (tool.click_count || 0) + 1;
  }

  globalStore.clicks.unshift({
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    tool_id: toolId,
    user_id: userId || null,
    event_type: "click",
    created_at: new Date().toISOString(),
  });
}

export async function getUserHistory(userId: string): Promise<{ tool: Tool; clickedAt: string }[]> {
  const categories = await getCategories();
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const userClicks = globalStore.clicks.filter((c) => c.user_id === userId);
  const result: { tool: Tool; clickedAt: string }[] = [];

  for (const c of userClicks) {
    const tool = globalStore.tools.find((t) => t.id === c.tool_id);
    if (tool) {
      result.push({
        tool: { ...tool, category: categoryMap.get(tool.category_id) },
        clickedAt: c.created_at,
      });
    }
  }

  return result;
}

// ==============================================================================
// Admin Metrics & User Management
// ==============================================================================

export async function getAdminMetrics() {
  const totalUsers = globalStore.users.length;
  const activeUsers = globalStore.users.filter((u) => u.account_status === "active").length;
  const pendingUsers = globalStore.users.filter((u) => u.account_status === "pending").length;
  const suspendedUsers = globalStore.users.filter((u) => u.account_status === "suspended").length;

  const totalTools = globalStore.tools.length;
  const publishedTools = globalStore.tools.filter((t) => t.is_published).length;
  const totalCategories = globalStore.categories.length;

  const mostClicked = [...globalStore.tools]
    .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
    .slice(0, 5);

  const pendingActivations = globalStore.activationRequests.filter((r) => r.status === "pending");

  return {
    totalUsers,
    activeUsers,
    pendingUsers,
    suspendedUsers,
    totalTools,
    publishedTools,
    totalCategories,
    mostClicked,
    pendingActivationsCount: pendingActivations.length,
    recentAuditLogs: globalStore.auditLogs.slice(0, 8),
  };
}

export async function getUsersList() {
  return globalStore.users.map((u) => ({
    ...u,
    hasPendingActivation: globalStore.activationRequests.some(
      (r) => r.user_id === u.id && r.status === "pending"
    ),
  }));
}

export async function updateUserStatus(
  userId: string,
  status: "active" | "pending" | "suspended",
  actorId?: string
) {
  const user = globalStore.users.find((u) => u.id === userId);
  if (!user) return false;

  const oldStatus = user.account_status;
  user.account_status = status;

  // Log audit
  await createAuditLog(actorId || "system", "update_user_status", "user", userId, {
    oldStatus,
    newStatus: status,
    userEmail: user.email,
  });

  return true;
}

export async function getActivationRequests(): Promise<ActivationRequest[]> {
  return [...globalStore.activationRequests];
}

export async function updateActivationRequest(
  requestId: string,
  status: "approved" | "rejected",
  reviewerId: string
) {
  const req = globalStore.activationRequests.find((r) => r.id === requestId);
  if (!req) return false;

  req.status = status;
  req.reviewed_by = reviewerId;
  req.reviewed_at = new Date().toISOString();

  // If approved, activate user
  if (status === "approved") {
    await updateUserStatus(req.user_id, "active", reviewerId);
  }

  await createAuditLog(reviewerId, `activation_request_${status}`, "activation_request", requestId, {
    targetUserId: req.user_id,
    targetEmail: req.user_email,
  });

  return true;
}

// ==============================================================================
// Site Settings & Audit Logs
// ==============================================================================

export async function getSiteSettings(): Promise<SiteSettings> {
  return globalStore.siteSettings;
}

export async function updateSiteSettings(
  section: keyof SiteSettings,
  value: any,
  actorId?: string
): Promise<SiteSettings> {
  globalStore.siteSettings[section] = {
    ...globalStore.siteSettings[section],
    ...value,
  };

  await createAuditLog(actorId || "system", "update_site_settings", "site_settings", section, {
    updatedSection: section,
  });

  return globalStore.siteSettings;
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  return [...globalStore.auditLogs].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function createAuditLog(
  actorUserId: string | null,
  action: string,
  targetType: string,
  targetId?: string | null,
  details?: Record<string, unknown>
): Promise<AuditLog> {
  const actor = globalStore.users.find((u) => u.id === actorUserId);
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    actor_user_id: actorUserId,
    actor_email: actor?.email || "system",
    action,
    target_type: targetType,
    target_id: targetId || null,
    details: details || {},
    created_at: new Date().toISOString(),
  };

  globalStore.auditLogs.unshift(log);
  return log;
}

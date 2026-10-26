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
  Package,
  Order,
  OrderItem,
  Subscription,
  SupportTicket,
  TicketMessage,
  ReferralRecord,
  OrderStatus,
  SubscriptionStatus,
  TicketStatus,
  PaymentAccountConfig,
} from "@/types";
import { createServerSupabaseClient } from "./server";
import { createAdminClient } from "./admin";

// ==============================================================================
// In-Memory Seed Store (Zero-Config Development & Fallback)
// ==============================================================================

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-ecommerce",
    name: "Amazon & E-Commerce",
    slug: "ecommerce",
    description: "Product hunting, keyword tracking, supplier analysis, and FBA optimization tools.",
    icon: "ShoppingBag",
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "cat-ai",
    name: "AI Tools & LLMs",
    slug: "ai-tools",
    description: "Cutting-edge large language models, reasoning engines, and AI writing assistants.",
    icon: "Bot",
    created_at: new Date(Date.now() - 86400000 * 28).toISOString(),
  },
  {
    id: "cat-seo",
    name: "SEO & Digital Marketing",
    slug: "seo-marketing",
    description: "Backlink checkers, site audit suites, competitor intelligence, and ranking monitors.",
    icon: "TrendingUp",
    created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
  },
  {
    id: "cat-design",
    name: "Design & Video Creation",
    slug: "design-video",
    description: "Generative art, thumbnail editing, video renderers, and digital asset suites.",
    icon: "Image",
    created_at: new Date(Date.now() - 86400000 * 22).toISOString(),
  },
  {
    id: "cat-education",
    name: "Education & Learning",
    slug: "education",
    description: "Professional certification portals, courses, and digital masterclasses.",
    icon: "GraduationCap",
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: "cat-entertainment",
    name: "Entertainment & Streaming",
    slug: "entertainment",
    description: "High-definition streaming platforms and ad-free entertainment services.",
    icon: "Film",
    created_at: new Date(Date.now() - 86400000 * 18).toISOString(),
  },
];

const INITIAL_TOOLS: Tool[] = [
  {
    id: "tool-helium10",
    name: "Helium 10 Diamond",
    slug: "helium-10",
    description: "The all-in-one software suite for Amazon and Walmart sellers. Features Cerebro keyword research, Black Box product finder, and Xray chrome extension.",
    logo_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=128&auto=format&fit=crop&q=80",
    official_url: "https://www.helium10.com",
    category_id: "cat-ecommerce",
    pricing_type: "Paid",
    price_pkr: 2500,
    tags: ["Amazon FBA", "Product Hunting", "Cerebro", "Black Box"],
    is_featured: true,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Cerebro Reverse ASIN Lookup", "Black Box Product Database", "Xray Chrome Extension Access", "Frankenstein Keyword Processor"],
    useCases: ["FBA Product Research", "Listing Optimization", "Competitor Keyword Spying"],
    access_instructions: "Click 'Launch Tool' to access Helium 10 through our secure web portal session. Ensure your ToolsBuy session is active.",
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 2420,
    click_count: 14520,
  },
  {
    id: "tool-junglescout",
    name: "Jungle Scout",
    slug: "jungle-scout",
    description: "Leading Amazon intelligence platform providing accurate sales estimations, Opportunity Finder, Supplier Database, and keyword scouting.",
    logo_url: "https://images.unsplash.com/photo-1557821552-17105176677c?w=128&auto=format&fit=crop&q=80",
    official_url: "https://www.junglescout.com",
    category_id: "cat-ecommerce",
    pricing_type: "Paid",
    price_pkr: 2500,
    tags: ["Amazon", "Sales Estimator", "FBA", "Supplier Finder"],
    is_featured: true,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Opportunity Finder", "Accurate Sales Estimates", "Supplier Database", "Chrome Extension"],
    useCases: ["Finding high-demand low-competition niches", "Auditing verified factories"],
    access_instructions: "Launch directly from your ToolsBuy Dashboard to log into the shared enterprise portal.",
    created_at: new Date(Date.now() - 86400000 * 28).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 1850,
    click_count: 11200,
  },
  {
    id: "tool-keepa",
    name: "Keepa Pro",
    slug: "keepa-pro",
    description: "Detailed price history charts, sales rank history, Buy Box statistics, and lightning deal alerts for over 4 billion Amazon products.",
    logo_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80",
    official_url: "https://keepa.com",
    category_id: "cat-ecommerce",
    pricing_type: "Paid",
    price_pkr: 2000,
    tags: ["Price Tracking", "Sales Rank", "Buy Box", "Historical Charts"],
    is_featured: true,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Comprehensive Price History", "Sales Rank Graphs", "Buy Box Statistics", "Data Export"],
    useCases: ["Online Arbitrage Analysis", "Wholesale Brand Vetting"],
    access_instructions: "Open Keepa charts directly via our 1-click cloud session.",
    created_at: new Date(Date.now() - 86400000 * 26).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 1640,
    click_count: 9840,
  },
  {
    id: "tool-chatgpt",
    name: "ChatGPT Plus",
    slug: "chatgpt-plus",
    description: "OpenAI's flagship conversational model powered by GPT-4o, with web search, Canvas code workspace, advanced data analysis, and DALL-E image generation.",
    logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80",
    official_url: "https://chatgpt.com",
    category_id: "cat-ai",
    pricing_type: "Paid",
    price_pkr: 1500,
    tags: ["GPT-4o", "OpenAI", "Reasoning", "Multimodal"],
    is_featured: true,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["GPT-4o priority access", "Canvas code editing", "DALL-E 3 image generation", "Custom GPTs"],
    useCases: ["Product description drafting", "Code generation", "Copywriting & research"],
    access_instructions: "Launch through our authenticated web session without needing individual phone verification.",
    created_at: new Date(Date.now() - 86400000 * 29).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 3120,
    click_count: 22400,
  },
  {
    id: "tool-claude",
    name: "Claude Pro",
    slug: "claude-pro",
    description: "Anthropic's premier AI model featuring Claude 3.5 Sonnet, known for state-of-the-art coding, long context comprehension, and Artifacts visual sandbox.",
    logo_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=128&auto=format&fit=crop&q=80",
    official_url: "https://claude.ai",
    category_id: "cat-ai",
    pricing_type: "Paid",
    price_pkr: 2500,
    tags: ["Claude 3.5 Sonnet", "Anthropic", "Code", "Artifacts"],
    is_featured: true,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Claude 3.5 Sonnet Engine", "200k Token Context", "Artifacts Interactive Sandbox", "Vision Analysis"],
    useCases: ["Complex engineering tasks", "Document analysis", "Long-form drafting"],
    access_instructions: "1-click direct browser session provided via ToolsBuy dashboard.",
    created_at: new Date(Date.now() - 86400000 * 27).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 2190,
    click_count: 14200,
  },
  {
    id: "tool-midjourney",
    name: "Midjourney",
    slug: "midjourney",
    description: "The pinnacle of generative image creation. Generates photorealistic product renders, digital art, social media visuals, and mockups.",
    logo_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=128&auto=format&fit=crop&q=80",
    official_url: "https://midjourney.com",
    category_id: "cat-ai",
    pricing_type: "Paid",
    price_pkr: 1500,
    tags: ["Image Gen", "Photorealistic", "Art", "Design"],
    is_featured: true,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Fast GPU Hours", "Web Editor & Alpha Access", "Inpainting / Outpainting", "Commercial Usage Rights"],
    useCases: ["Amazon product lifestyle photography", "Social media banners", "Creative design"],
    access_instructions: "Access our dedicated Discord channel / Web interface session.",
    created_at: new Date(Date.now() - 86400000 * 24).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 1780,
    click_count: 12300,
  },
  {
    id: "tool-perplexity",
    name: "Perplexity Pro",
    slug: "perplexity-pro",
    description: "AI-powered conversational search engine delivering cited, real-time answers with source attribution and deep multi-step research.",
    logo_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=128&auto=format&fit=crop&q=80",
    official_url: "https://perplexity.ai",
    category_id: "cat-ai",
    pricing_type: "Paid",
    price_pkr: 1500,
    tags: ["Search", "Research", "Citations", "Pro Search"],
    is_featured: true,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Pro Search Multi-step Reasoning", "GPT-4o & Claude 3.5 Sonnet Switcher", "File Upload Analysis", "Direct Web Citations"],
    useCases: ["Competitor market research", "Academic literature verification"],
    access_instructions: "Launch directly from user dashboard.",
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 1230,
    click_count: 7900,
  },
  {
    id: "tool-semrush",
    name: "Semrush Guru",
    slug: "semrush",
    description: "Industry-standard SEO, content marketing, competitor research, PPC and social media marketing platform all-in-one.",
    logo_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=128&auto=format&fit=crop&q=80",
    official_url: "https://www.semrush.com",
    category_id: "cat-seo",
    pricing_type: "Paid",
    price_pkr: 1000,
    tags: ["SEO", "Backlinks", "Keyword Magic Tool", "Site Audit"],
    is_featured: true,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Keyword Magic Tool", "Domain Overview & Backlink Analytics", "Site Audit Diagnostics", "Position Tracker"],
    useCases: ["Search Engine Optimization", "Competitor Traffic Spying", "PPC Keyword Research"],
    access_instructions: "Click Launch Tool to open shared Semrush Guru session.",
    created_at: new Date(Date.now() - 86400000 * 18).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 1980,
    click_count: 13900,
  },
  {
    id: "tool-canva",
    name: "Canva Pro",
    slug: "canva-pro",
    description: "Effortless graphic design suite with millions of premium templates, Magic Studio AI tools, transparent background removal, and brand kits.",
    logo_url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=128&auto=format&fit=crop&q=80",
    official_url: "https://www.canva.com",
    category_id: "cat-design",
    pricing_type: "Paid",
    price_pkr: 500,
    tags: ["Graphics", "Templates", "Background Remover", "Brand Kit"],
    is_featured: true,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["100M+ Premium Stock Assets", "Magic Background Remover", "Magic Resize", "Team Brand Kit"],
    useCases: ["Amazon product infographics", "Social media banners", "YouTube thumbnails"],
    access_instructions: "Instant team invite link provided upon subscription activation.",
    created_at: new Date(Date.now() - 86400000 * 16).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 2890,
    click_count: 18400,
  },
  {
    id: "tool-capcut",
    name: "CapCut Pro",
    slug: "capcut-pro",
    description: "The ultimate video editing suite for creators, TikTokers, and e-commerce video ads with AI auto-captions, keyframes, and sound effects.",
    logo_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=128&auto=format&fit=crop&q=80",
    official_url: "https://www.capcut.com",
    category_id: "cat-design",
    pricing_type: "Paid",
    price_pkr: 1000,
    tags: ["Video Editing", "Reels", "TikTok", "Auto Captions"],
    is_featured: false,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["AI Auto Captions", "Commercial Cloud Assets", "Pro Video Effects & Transitions", "4K 60FPS Export"],
    useCases: ["TikTok & Instagram Reels Ads", "Product Showcase Videos"],
    access_instructions: "Launch through our authenticated web portal.",
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 1120,
    click_count: 7300,
  },
  {
    id: "tool-coursera",
    name: "Coursera Plus",
    slug: "coursera-plus",
    description: "Unlimited access to 7,000+ world-class courses, hands-on projects, and job-ready certificates from Google, IBM, Meta, and top universities.",
    logo_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80",
    official_url: "https://www.coursera.org",
    category_id: "cat-education",
    pricing_type: "Paid",
    price_pkr: 1500,
    tags: ["Certificates", "Google", "University Courses", "Data Science"],
    is_featured: false,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Unlimited Course Enrollment", "Shareable Professional Certificates", "Hands-on Guided Projects"],
    useCases: ["Up-skilling in Tech & E-Commerce", "Earning recognized credentials"],
    access_instructions: "Access granted through enterprise seat allocation.",
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 940,
    click_count: 5800,
  },
  {
    id: "tool-udemy",
    name: "Udemy Business",
    slug: "udemy-business",
    description: "Access a curated collection of thousands of top-rated Udemy courses covering programming, digital marketing, Amazon FBA, and design.",
    logo_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=128&auto=format&fit=crop&q=80",
    official_url: "https://www.udemy.com",
    category_id: "cat-education",
    pricing_type: "Paid",
    price_pkr: 1000,
    tags: ["Courses", "Coding", "Marketing", "Business"],
    is_featured: false,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Ad-free Course Streaming", "Downloadable Resource Files", "Certificate of Completion"],
    useCases: ["Learning Amazon wholesale", "Mastering full-stack programming"],
    access_instructions: "Launch through authenticated portal.",
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 810,
    click_count: 4900,
  },
  {
    id: "tool-netflix",
    name: "Netflix 4K Ultra HD",
    slug: "netflix",
    description: "Stream award-winning films, original TV series, documentaries, and entertainment in 4K Ultra HD with spatial audio.",
    logo_url: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=128&auto=format&fit=crop&q=80",
    official_url: "https://www.netflix.com",
    category_id: "cat-entertainment",
    pricing_type: "Paid",
    price_pkr: 500,
    tags: ["Streaming", "4K Ultra HD", "Movies", "TV Shows"],
    is_featured: false,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["4K HDR Streaming", "Multi-profile support", "Ad-free experience"],
    useCases: ["Personal entertainment & relaxation"],
    access_instructions: "Profile pin and access link provided in your active subscription view.",
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 3200,
    click_count: 24100,
  },
  {
    id: "tool-primevideo",
    name: "Amazon Prime Video",
    slug: "prime-video",
    description: "Amazon's streaming entertainment service featuring Prime Originals, movies, and blockbuster series.",
    logo_url: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=128&auto=format&fit=crop&q=80",
    official_url: "https://www.primevideo.com",
    category_id: "cat-entertainment",
    pricing_type: "Paid",
    price_pkr: 500,
    tags: ["Streaming", "Prime Originals", "HD Movies"],
    is_featured: false,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["HD Streaming", "X-Ray Movie Trivia Integration", "Ad-free playback"],
    useCases: ["Streaming entertainment"],
    access_instructions: "One-click launch through user dashboard.",
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 1450,
    click_count: 8900,
  },
  {
    id: "tool-grammarly",
    name: "Grammarly Premium",
    slug: "grammarly",
    description: "Advanced AI writing assistant that improves clarity, grammar, tone, and plagiarism detection across all browser fields and documents.",
    logo_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=128&auto=format&fit=crop&q=80",
    official_url: "https://www.grammarly.com",
    category_id: "cat-ai",
    pricing_type: "Paid",
    price_pkr: 1000,
    tags: ["Writing", "Grammar", "Plagiarism", "Tone Adjuster"],
    is_featured: false,
    is_published: true,
    integration_mode: "external_link",
    external_account_required: true,
    features: ["Full sentence rewrites", "Plagiarism checker", "Vocabulary enhancements", "Tone tone suggestions"],
    useCases: ["Client communication", "Professional email writing", "Product listing polish"],
    access_instructions: "Launch through browser session.",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date().toISOString(),
    favorite_count: 1390,
    click_count: 9400,
  },
];

const INITIAL_PACKAGES: Package[] = [
  {
    id: "pkg-basic",
    name: "Basic Bundle V2",
    slug: "basic-bundle-v2",
    badge: "Starter",
    description: "The essential package for Amazon beginners and content creators wanting core tools.",
    price_pkr: 3500,
    price_usd: 13,
    duration_days: 30,
    is_active: true,
    is_popular: false,
    tools_included: [
      "Helium 10 Diamond",
      "H10 Freedom Ticket",
      "ChatGPT Plus",
      "Canva Pro",
      "Netflix",
    ],
    features: [
      "Helium 10 Diamond (Cerebro + Black Box)",
      "ChatGPT Plus (GPT-4o)",
      "Canva Pro (All Templates + Magic AI)",
      "Netflix 4K Ultra HD",
      "1-Click Direct Browser Launch",
      "24/7 Dedicated WhatsApp Support",
      "Cloud Browser Based — No Virus / Malware",
    ],
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "pkg-standard",
    name: "Standard Bundle V2",
    slug: "standard-bundle-v2",
    badge: "Most Popular",
    description: "Our top-selling package for growing Amazon FBA sellers, copywriters, and marketers.",
    price_pkr: 4000,
    price_usd: 15,
    duration_days: 30,
    is_active: true,
    is_popular: true,
    tools_included: [
      "Helium 10 Diamond",
      "H10 Freedom Ticket",
      "Jungle Scout",
      "ChatGPT Plus",
      "Canva Pro",
      "Netflix",
      "Prime Video",
      "Claude Pro",
    ],
    features: [
      "Helium 10 Diamond (Full Suite)",
      "Jungle Scout (Opportunity Finder + Sales Estimator)",
      "ChatGPT Plus (GPT-4o & Canvas)",
      "Claude Pro (Claude 3.5 Sonnet)",
      "Canva Pro Brand Suite",
      "Netflix 4K & Amazon Prime Video",
      "Instant 1-Click Launch Station",
      "24/7 Priority WhatsApp & Ticket Support",
    ],
    created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
  },
  {
    id: "pkg-premium",
    name: "Premium Bundle V2",
    slug: "premium-bundle-v2",
    badge: "Best Value",
    description: "The complete power-suite with everything included: Amazon hunting, Top AI models, SEO, Design & Education.",
    price_pkr: 5000,
    price_usd: 19,
    duration_days: 30,
    is_active: true,
    is_popular: false,
    tools_included: [
      "Helium 10 Diamond",
      "H10 Freedom Ticket",
      "Jungle Scout",
      "Keepa Pro",
      "ChatGPT Plus",
      "Claude Pro",
      "Midjourney",
      "Semrush",
      "Canva Pro",
      "Coursera",
      "Netflix",
      "Prime Video",
    ],
    features: [
      "Helium 10 Diamond + Keepa Pro + Jungle Scout",
      "ChatGPT Plus + Claude Pro + Midjourney",
      "Semrush Guru (Keyword Magic + Backlinks)",
      "Coursera Plus Professional Courses",
      "Canva Pro + Netflix + Prime Video",
      "VIP Dedicated Support & Instant Replacement Guarantee",
      "Guaranteed 99.9% Uptime with Cloud Isolation",
    ],
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
];

const INITIAL_SETTINGS: SiteSettings = {
  branding: {
    name: "ToolsBuy",
    tagline: "Direct 1-Click Access to All Premium AI & E-Commerce Tools",
    description: "We provide direct logins of all premium Amazon product hunting tools, AI models, and digital suites at the most affordable prices with instant activation.",
    whatsapp_number: "+923127462475",
    announcement_banner: "🔥 Special Discount: Get up to 40% OFF on all bundles this week! Instant WhatsApp activation.",
  },
  payments: {
    bank_name: "Meezan Bank Limited",
    account_title: "ToolsBuy Official",
    account_number: "01020304050607",
    iban: "PK00MEZN0001020304050607",
    easypaisa_title: "ToolsBuy Official",
    easypaisa_number: "0312-7462475",
    jazzcash_title: "ToolsBuy Official",
    jazzcash_number: "0312-7462475",
    usdt_address: "TYdCqV9Xp7z8WbK1mN2qR4tY6uI8oP0sLa",
  },
  features: {
    allowRegistration: true,
    requireManualApproval: false,
    enableReferrals: true,
    enableCustomBundles: true,
    maintenanceMode: false,
  },
  contact: {
    email: "support@toolsbuy.com",
    adminNotificationEmail: "admin@aihub.local",
    phone: "+92 312 7462475",
    whatsapp: "https://wa.me/923127462475",
  },
  seo: {
    defaultTitle: "ToolsBuy — Amazon Tools, ChatGPT Plus, Helium 10 & Digital Services",
    defaultDescription: "Join ToolsBuy and get instant direct access to Helium 10, Keepa, Jungle Scout, ChatGPT Plus, Midjourney, and Canva Pro at affordable prices.",
  },
};

// Global In-Memory state for local execution and serverless hot runtime
const globalStore = {
  categories: [...INITIAL_CATEGORIES],
  tools: [...INITIAL_TOOLS],
  packages: [...INITIAL_PACKAGES],
  orders: [
    {
      id: "ord-1",
      order_number: "ORD-9281",
      user_id: "demo_user_id",
      user_email: "user@aihub.local",
      customer_name: "Alex Developer",
      customer_phone: "+92 300 1234567",
      type: "package" as const,
      package_id: "pkg-standard",
      package_name: "Standard Bundle V2",
      total_amount_pkr: 4000,
      currency: "PKR",
      payment_method: "easypaisa" as const,
      transaction_id: "TRX8829104",
      payment_proof_note: "Paid via EasyPaisa 03001234567",
      status: "verified" as OrderStatus,
      verified_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      verified_by: "admin_user_id",
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: "ord-2",
      order_number: "ORD-9304",
      user_id: "user_pending_1",
      user_email: "elena.rostova@example.com",
      customer_name: "Elena Rostova",
      customer_phone: "+92 312 9988776",
      type: "package" as const,
      package_id: "pkg-premium",
      package_name: "Premium Bundle V2",
      total_amount_pkr: 5000,
      currency: "PKR",
      payment_method: "jazzcash" as const,
      transaction_id: "JC99102837",
      payment_proof_note: "Sent through JazzCash app at 4:30 PM",
      status: "pending" as OrderStatus,
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
  ] as Order[],
  subscriptions: [
    {
      id: "sub-1",
      user_id: "demo_user_id",
      user_email: "user@aihub.local",
      order_id: "ord-1",
      package_name: "Standard Bundle V2",
      tools_included: [
        "Helium 10 Diamond",
        "H10 Freedom Ticket",
        "Jungle Scout",
        "ChatGPT Plus",
        "Canva Pro",
        "Netflix",
        "Prime Video",
        "Claude Pro",
      ],
      status: "active" as SubscriptionStatus,
      starts_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      expires_at: new Date(Date.now() + 86400000 * 28).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ] as Subscription[],
  supportTickets: [
    {
      id: "tck-1",
      ticket_number: "TCK-4102",
      user_id: "demo_user_id",
      user_email: "user@aihub.local",
      subject: "How do I install the browser extension?",
      category: "general" as const,
      status: "open" as TicketStatus,
      messages: [
        {
          id: "msg-1",
          sender: "user" as const,
          sender_name: "Alex Developer",
          message: "Hi, I just got the Standard Bundle and want to know how to install the 1-click launcher extension.",
          created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          id: "msg-2",
          sender: "admin" as const,
          sender_name: "ToolsBuy Support",
          message: "Hello Alex! You can click any tool directly on your Dashboard to launch it instantly in your browser without requiring extra software.",
          created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ],
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ] as SupportTicket[],
  referrals: [
    {
      id: "ref-1",
      referrer_user_id: "demo_user_id",
      referrer_email: "user@aihub.local",
      referred_user_id: "user_pending_1",
      referred_email: "elena.rostova@example.com",
      referral_code: "TB-ALEX99",
      status: "converted" as const,
      commission_pkr: 500,
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
  ] as ReferralRecord[],
  favorites: [
    { user_id: "demo_user_id", tool_id: "tool-helium10", created_at: new Date().toISOString() },
    { user_id: "demo_user_id", tool_id: "tool-chatgpt", created_at: new Date().toISOString() },
  ] as { user_id: string; tool_id: string; created_at: string }[],
  users: [
    {
      id: "admin_user_id",
      email: "admin@aihub.local",
      display_name: "Lead Administrator",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      account_status: "active" as AccountStatus,
      role: "admin" as UserRole,
      phone: "+92 312 7462475",
      referral_code: "TB-ADMIN",
      created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
    },
    {
      id: "demo_user_id",
      email: "user@aihub.local",
      display_name: "Alex Developer",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      account_status: "active" as AccountStatus,
      role: "user" as UserRole,
      phone: "+92 300 1234567",
      referral_code: "TB-ALEX99",
      created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
  ] as (Profile & { role: UserRole })[],
  siteSettings: { ...INITIAL_SETTINGS },
  auditLogs: [
    {
      id: "log-1",
      actor_user_id: "admin_user_id",
      actor_email: "admin@aihub.local",
      action: "site_initialized",
      target_type: "system",
      target_id: "toolsbuy-core",
      details: { version: "2.0.0", platform: "ToolsBuy Live" },
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
  ] as AuditLog[],
  activationRequests: [] as ActivationRequest[],
};

// ==============================================================================
// User & Authentication Helpers
// ==============================================================================

export async function getCurrentUserSession(): Promise<UserSession | null> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("ai_hub_session")?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const raw = Buffer.from(sessionToken, "base64").toString("utf8");
    const parsed = JSON.parse(raw) as UserSession;
    return parsed;
  } catch (error) {
    return null;
  }
}

// ==============================================================================
// Packages & Custom Bundle Queries
// ==============================================================================

export async function getPackages(): Promise<Package[]> {
  return [...globalStore.packages].filter((p) => p.is_active);
}

export async function getAllPackages(): Promise<Package[]> {
  return [...globalStore.packages];
}

export async function getPackageById(id: string): Promise<Package | null> {
  return globalStore.packages.find((p) => p.id === id) || null;
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  return globalStore.packages.find((p) => p.slug === slug) || null;
}

export async function savePackage(pkg: Partial<Package> & { name: string; price_pkr: number }): Promise<Package> {
  const existingIndex = globalStore.packages.findIndex((p) => p.id === pkg.id);
  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    const updated = {
      ...globalStore.packages[existingIndex],
      ...pkg,
      updated_at: now,
    };
    globalStore.packages[existingIndex] = updated as Package;
    return updated as Package;
  }

  const newPkg: Package = {
    id: pkg.id || `pkg-${Date.now()}`,
    name: pkg.name,
    slug: pkg.slug || pkg.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    badge: pkg.badge || "",
    description: pkg.description || "",
    price_pkr: pkg.price_pkr,
    price_usd: pkg.price_usd || Math.round(pkg.price_pkr / 278),
    duration_days: pkg.duration_days || 30,
    is_active: pkg.is_active !== undefined ? pkg.is_active : true,
    is_popular: Boolean(pkg.is_popular),
    tools_included: pkg.tools_included || [],
    features: pkg.features || [],
    created_at: now,
  };

  globalStore.packages.push(newPkg);
  return newPkg;
}

export async function deletePackage(id: string): Promise<boolean> {
  const index = globalStore.packages.findIndex((p) => p.id === id);
  if (index >= 0) {
    globalStore.packages.splice(index, 1);
    return true;
  }
  return false;
}

// ==============================================================================
// Orders & Payments Management
// ==============================================================================

export async function getOrders(filters?: { userId?: string; status?: OrderStatus }): Promise<Order[]> {
  let list = [...globalStore.orders];
  if (filters?.userId) {
    list = list.filter((o) => o.user_id === filters.userId);
  }
  if (filters?.status) {
    list = list.filter((o) => o.status === filters.status);
  }
  return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getOrderById(id: string): Promise<Order | null> {
  return globalStore.orders.find((o) => o.id === id || o.order_number === id) || null;
}

export async function createOrder(data: {
  userId: string;
  userEmail: string;
  customerName: string;
  customerPhone: string;
  type: "package" | "custom";
  packageId?: string;
  packageName?: string;
  customTools?: OrderItem[];
  totalAmountPkr: number;
  paymentMethod: "bank_transfer" | "easypaisa" | "jazzcash" | "usdt";
  transactionId: string;
  paymentProofNote?: string;
}): Promise<Order> {
  const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    order_number: orderNumber,
    user_id: data.userId,
    user_email: data.userEmail,
    customer_name: data.customerName,
    customer_phone: data.customerPhone,
    type: data.type,
    package_id: data.packageId,
    package_name: data.packageName,
    custom_tools: data.customTools,
    total_amount_pkr: data.totalAmountPkr,
    currency: "PKR",
    payment_method: data.paymentMethod,
    transaction_id: data.transactionId,
    payment_proof_note: data.paymentProofNote,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  globalStore.orders.unshift(newOrder);

  await createAuditLog(data.userId, "create_order", "order", newOrder.id, {
    order_number: orderNumber,
    total: data.totalAmountPkr,
    method: data.paymentMethod,
  });

  return newOrder;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  actorId?: string,
  rejectionReason?: string
): Promise<Order | null> {
  const order = globalStore.orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.status = status;
  if (status === "verified") {
    order.verified_at = new Date().toISOString();
    order.verified_by = actorId || "admin";

    // Instant automatic activation of subscription
    const tools: string[] = [];
    if (order.type === "package" && order.package_id) {
      const pkg = await getPackageById(order.package_id);
      if (pkg) {
        tools.push(...pkg.tools_included);
      }
    } else if (order.custom_tools) {
      tools.push(...order.custom_tools.map((t) => t.name));
    }

    await createOrUpdateSubscription({
      userId: order.user_id,
      userEmail: order.user_email,
      orderId: order.id,
      packageName: order.package_name || (order.type === "custom" ? "Custom Bundle" : "Standard Bundle"),
      toolsIncluded: tools.length > 0 ? tools : ["Helium 10 Diamond", "ChatGPT Plus", "Canva Pro"],
      durationDays: 30,
    });
  } else if (status === "rejected") {
    order.rejection_reason = rejectionReason || "Invalid transaction details or verification failed.";
  }

  await createAuditLog(actorId || "system", `order_${status}`, "order", order.id, {
    orderNumber: order.order_number,
    status,
    rejectionReason,
  });

  return order;
}

// ==============================================================================
// Subscriptions Management
// ==============================================================================

export async function getSubscriptions(userId?: string): Promise<Subscription[]> {
  let list = [...globalStore.subscriptions];
  if (userId) {
    list = list.filter((s) => s.user_id === userId);
  }
  return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getActiveSubscription(userId: string): Promise<Subscription | null> {
  const now = new Date().getTime();
  const sub = globalStore.subscriptions.find(
    (s) => s.user_id === userId && s.status === "active" && new Date(s.expires_at).getTime() > now
  );
  return sub || null;
}

export async function createOrUpdateSubscription(data: {
  userId: string;
  userEmail: string;
  orderId?: string;
  packageName: string;
  toolsIncluded: string[];
  durationDays?: number;
}): Promise<Subscription> {
  const days = data.durationDays || 30;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 86400000 * days);

  // Check if user already has an active subscription; if so, extend it
  const existing = await getActiveSubscription(data.userId);
  if (existing) {
    const currentExpiry = new Date(existing.expires_at).getTime();
    const newExpiry = new Date(Math.max(currentExpiry, now.getTime()) + 86400000 * days);
    existing.expires_at = newExpiry.toISOString();
    // Merge tools
    const combined = Array.from(new Set([...existing.tools_included, ...data.toolsIncluded]));
    existing.tools_included = combined;
    return existing;
  }

  const newSub: Subscription = {
    id: `sub-${Date.now()}`,
    user_id: data.userId,
    user_email: data.userEmail,
    order_id: data.orderId,
    package_name: data.packageName,
    tools_included: data.toolsIncluded,
    status: "active",
    starts_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    created_at: now.toISOString(),
  };

  globalStore.subscriptions.unshift(newSub);
  return newSub;
}

export async function extendSubscription(subId: string, daysToAdd: number): Promise<Subscription | null> {
  const sub = globalStore.subscriptions.find((s) => s.id === subId);
  if (!sub) return null;

  const currentExpiry = new Date(sub.expires_at).getTime();
  const now = Date.now();
  const baseTime = Math.max(currentExpiry, now);
  sub.expires_at = new Date(baseTime + 86400000 * daysToAdd).toISOString();
  sub.status = "active";
  return sub;
}

// ==============================================================================
// Support Tickets System
// ==============================================================================

export async function getSupportTickets(userId?: string): Promise<SupportTicket[]> {
  let list = [...globalStore.supportTickets];
  if (userId) {
    list = list.filter((t) => t.user_id === userId);
  }
  return list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
}

export async function getSupportTicketById(id: string): Promise<SupportTicket | null> {
  return globalStore.supportTickets.find((t) => t.id === id || t.ticket_number === id) || null;
}

export async function createSupportTicket(data: {
  userId: string;
  userEmail: string;
  subject: string;
  category: "access_issue" | "payment_issue" | "tool_request" | "general";
  initialMessage: string;
}): Promise<SupportTicket> {
  const ticketNumber = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const ticket: SupportTicket = {
    id: `tck-${Date.now()}`,
    ticket_number: ticketNumber,
    user_id: data.userId,
    user_email: data.userEmail,
    subject: data.subject,
    category: data.category,
    status: "open",
    messages: [
      {
        id: `msg-${Date.now()}`,
        sender: "user",
        sender_name: data.userEmail.split("@")[0],
        message: data.initialMessage,
        created_at: now,
      },
    ],
    created_at: now,
    updated_at: now,
  };

  globalStore.supportTickets.unshift(ticket);
  return ticket;
}

export async function addTicketMessage(
  ticketId: string,
  message: {
    sender: "user" | "admin";
    sender_name: string;
    message: string;
  }
): Promise<SupportTicket | null> {
  const ticket = globalStore.supportTickets.find((t) => t.id === ticketId);
  if (!ticket) return null;

  const now = new Date().toISOString();
  ticket.messages.push({
    id: `msg-${Date.now()}`,
    sender: message.sender,
    sender_name: message.sender_name,
    message: message.message,
    created_at: now,
  });
  ticket.updated_at = now;
  if (message.sender === "admin" && ticket.status === "open") {
    ticket.status = "in_progress";
  }
  return ticket;
}

export async function updateTicketStatus(ticketId: string, status: TicketStatus): Promise<boolean> {
  const ticket = globalStore.supportTickets.find((t) => t.id === ticketId);
  if (!ticket) return false;
  ticket.status = status;
  ticket.updated_at = new Date().toISOString();
  return true;
}

// ==============================================================================
// Referral System
// ==============================================================================

export async function getReferrals(referrerUserId?: string): Promise<ReferralRecord[]> {
  let list = [...globalStore.referrals];
  if (referrerUserId) {
    list = list.filter((r) => r.referrer_user_id === referrerUserId);
  }
  return list;
}

export async function createReferral(data: {
  referrerUserId: string;
  referrerEmail: string;
  referredUserId: string;
  referredEmail: string;
  referralCode: string;
}): Promise<ReferralRecord> {
  const record: ReferralRecord = {
    id: `ref-${Date.now()}`,
    referrer_user_id: data.referrerUserId,
    referrer_email: data.referrerEmail,
    referred_user_id: data.referredUserId,
    referred_email: data.referredEmail,
    referral_code: data.referralCode,
    status: "registered",
    commission_pkr: 0,
    created_at: new Date().toISOString(),
  };

  globalStore.referrals.unshift(record);
  return record;
}

// ==============================================================================
// Categories & Tools Queries
// ==============================================================================

export async function getCategories(): Promise<Category[]> {
  return globalStore.categories.map((c) => ({
    ...c,
    tool_count: globalStore.tools.filter((t) => t.category_id === c.id && t.is_published).length,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cat = globalStore.categories.find((c) => c.slug === slug);
  if (!cat) return null;
  return {
    ...cat,
    tool_count: globalStore.tools.filter((t) => t.category_id === cat.id && t.is_published).length,
  };
}

export async function createCategory(cat: Omit<Category, "id" | "created_at">): Promise<Category> {
  const newCat: Category = {
    ...cat,
    id: `cat-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  globalStore.categories.push(newCat);
  return newCat;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  const index = globalStore.categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  globalStore.categories[index] = { ...globalStore.categories[index], ...updates };
  return globalStore.categories[index];
}

export async function deleteCategory(id: string, reassignCategoryId?: string): Promise<boolean> {
  const index = globalStore.categories.findIndex((c) => c.id === id);
  if (index === -1) return false;
  if (reassignCategoryId) {
    for (const tool of globalStore.tools) {
      if (tool.category_id === id) {
        tool.category_id = reassignCategoryId;
      }
    }
  }
  globalStore.categories.splice(index, 1);
  return true;
}


export async function getTools(options?: {
  categoryId?: string;
  search?: string;
  sortBy?: "popular" | "newest" | "name";
  limit?: number;
  offset?: number;
  publishedOnly?: boolean;
  isFeatured?: boolean;
  userId?: string;
}): Promise<{ tools: Tool[]; total: number }> {
  let items = [...globalStore.tools];

  if (options?.publishedOnly !== false) {
    items = items.filter((t) => t.is_published);
  }

  if (options?.isFeatured) {
    items = items.filter((t) => t.is_featured);
  }

  if (options?.categoryId) {
    items = items.filter((t) => t.category_id === options.categoryId);
  }

  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    items = items.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  // Populate category info
  items = items.map((t) => ({
    ...t,
    category: globalStore.categories.find((c) => c.id === t.category_id),
    is_favorited: options?.userId
      ? globalStore.favorites.some((f) => f.user_id === options.userId && f.tool_id === t.id)
      : false,
  }));

  // Sort
  if (options?.sortBy === "newest") {
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (options?.sortBy === "name") {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // popular default
    items.sort((a, b) => (b.click_count || 0) + (b.favorite_count || 0) - ((a.click_count || 0) + (a.favorite_count || 0)));
  }

  const total = items.length;
  if (options?.offset) {
    items = items.slice(options.offset);
  }
  if (options?.limit) {
    items = items.slice(0, options.limit);
  }

  return { tools: items, total };
}

export async function getToolBySlug(slug: string, userId?: string): Promise<Tool | null> {
  const tool = globalStore.tools.find((t) => t.slug === slug);
  if (!tool) return null;

  return {
    ...tool,
    category: globalStore.categories.find((c) => c.id === tool.category_id),
    is_favorited: userId
      ? globalStore.favorites.some((f) => f.user_id === userId && f.tool_id === tool.id)
      : false,
  };
}

export async function getToolById(id: string): Promise<Tool | null> {
  const tool = globalStore.tools.find((t) => t.id === id);
  if (!tool) return null;
  return {
    ...tool,
    category: globalStore.categories.find((c) => c.id === tool.category_id),
  };
}

export async function createTool(toolData: any): Promise<Tool> {
  return saveTool(toolData);
}

export async function updateTool(id: string, updates: any): Promise<Tool | null> {
  return saveTool({ ...updates, id });
}

export async function saveTool(toolData: Partial<Tool> & { name: string; category_id: string }): Promise<Tool> {
  const existingIndex = globalStore.tools.findIndex((t) => t.id === toolData.id);
  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    const updated = {
      ...globalStore.tools[existingIndex],
      ...toolData,
      updated_at: now,
    };
    globalStore.tools[existingIndex] = updated as Tool;
    return updated as Tool;
  }

  const newTool: Tool = {
    id: toolData.id || `tool-${Date.now()}`,
    name: toolData.name,
    slug: toolData.slug || toolData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description: toolData.description || "",
    logo_url: toolData.logo_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80",
    official_url: toolData.official_url || "https://toolsbuy.vercel.app",
    category_id: toolData.category_id,
    pricing_type: toolData.pricing_type || "Paid",
    price_pkr: toolData.price_pkr || 1000,
    tags: toolData.tags || ["Productivity"],
    is_featured: Boolean(toolData.is_featured),
    is_published: toolData.is_published !== undefined ? toolData.is_published : true,
    integration_mode: toolData.integration_mode || "external_link",
    external_account_required: Boolean(toolData.external_account_required),
    features: toolData.features || [],
    useCases: toolData.useCases || [],
    access_instructions: toolData.access_instructions || "Direct access via ToolsBuy Dashboard.",
    created_at: now,
    updated_at: now,
    favorite_count: 0,
    click_count: 0,
  };

  globalStore.tools.unshift(newTool);
  return newTool;
}

export async function deleteTool(id: string): Promise<boolean> {
  const index = globalStore.tools.findIndex((t) => t.id === id);
  if (index >= 0) {
    globalStore.tools.splice(index, 1);
    return true;
  }
  return false;
}

export async function recordToolClick(toolId: string, userId?: string | null): Promise<void> {
  const tool = globalStore.tools.find((t) => t.id === toolId);
  if (tool) {
    tool.click_count = (tool.click_count || 0) + 1;
  }
}

export async function toggleFavorite(userId: string, toolId: string): Promise<{ isFavorited: boolean; count: number }> {
  const index = globalStore.favorites.findIndex((f) => f.user_id === userId && f.tool_id === toolId);
  const tool = globalStore.tools.find((t) => t.id === toolId);

  if (index >= 0) {
    globalStore.favorites.splice(index, 1);
    if (tool && tool.favorite_count && tool.favorite_count > 0) {
      tool.favorite_count -= 1;
    }
    return { isFavorited: false, count: tool?.favorite_count || 0 };
  } else {
    globalStore.favorites.push({ user_id: userId, tool_id: toolId, created_at: new Date().toISOString() });
    if (tool) {
      tool.favorite_count = (tool.favorite_count || 0) + 1;
    }
    return { isFavorited: true, count: tool?.favorite_count || 1 };
  }
}

export async function getUserFavorites(userId: string): Promise<Tool[]> {
  const userFavs = globalStore.favorites.filter((f) => f.user_id === userId);
  const toolIds = new Set(userFavs.map((f) => f.tool_id));
  return globalStore.tools
    .filter((t) => toolIds.has(t.id))
    .map((t) => ({ ...t, is_favorited: true, category: globalStore.categories.find((c) => c.id === t.category_id) }));
}

// ==============================================================================
// Users Management
// ==============================================================================

export async function getUsers(): Promise<(Profile & { role: UserRole })[]> {
  return [...globalStore.users];
}

export const getUsersList = getUsers;

export async function getUserHistory(userId: string): Promise<{ tool: Tool; clickedAt: string }[]> {
  const logs = globalStore.auditLogs.filter((l) => l.actor_user_id === userId && l.target_type === "tool");
  const result: { tool: Tool; clickedAt: string }[] = [];
  for (const log of logs) {
    const tool = globalStore.tools.find((t) => t.id === log.target_id);
    if (tool) {
      result.push({ tool, clickedAt: log.created_at });
    }
  }
  if (result.length === 0) {
    return globalStore.tools.slice(0, 4).map((tool, idx) => ({
      tool,
      clickedAt: new Date(Date.now() - 3600000 * (idx + 1) * 3).toISOString(),
    }));
  }
  return result;
}


export async function updateUserStatus(userId: string, status: AccountStatus, actorId?: string): Promise<boolean> {
  const user = globalStore.users.find((u) => u.id === userId);
  if (!user) return false;

  user.account_status = status;
  await createAuditLog(actorId || "system", `user_status_${status}`, "user", userId, { targetEmail: user.email });
  return true;
}

export async function updateUserRole(userId: string, role: UserRole, actorId?: string): Promise<boolean> {
  const user = globalStore.users.find((u) => u.id === userId);
  if (!user) return false;

  user.role = role;
  await createAuditLog(actorId || "system", `user_role_${role}`, "user", userId, { targetEmail: user.email });
  return true;
}

// ==============================================================================
// Site Settings & Payment Config
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

  await createAuditLog(actorId || "system", "update_site_settings", "site_settings", section as string, {
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

  if (status === "approved") {
    await updateUserStatus(req.user_id, "active", reviewerId);
  }

  await createAuditLog(reviewerId, `activation_request_${status}`, "activation_request", requestId, {
    targetUserId: req.user_id,
    targetEmail: req.user_email,
  });

  return true;
}

export async function getAdminMetrics() {
  const verifiedOrders = globalStore.orders.filter((o) => o.status === "verified");
  const totalRevenuePkr = verifiedOrders.reduce((sum, o) => sum + (o.total_amount_pkr || 0), 0);
  const pendingOrders = globalStore.orders.filter((o) => o.status === "pending");
  const activeSubs = globalStore.subscriptions.filter((s) => s.status === "active");
  const openTickets = globalStore.supportTickets.filter(
    (t) => t.status === "open" || t.status === "in_progress"
  );

  const sortedTools = [...globalStore.tools].sort(
    (a, b) => (b.click_count || 0) - (a.click_count || 0)
  );

  return {
    totalOrders: globalStore.orders.length,
    pendingOrdersCount: pendingOrders.length,
    verifiedOrdersCount: verifiedOrders.length,
    totalRevenuePkr,
    activeSubscriptionsCount: activeSubs.length,
    openTicketsCount: openTickets.length,
    totalUsers: globalStore.users.length,
    activeUsers: globalStore.users.filter((u) => u.account_status === "active").length,
    pendingUsers: globalStore.users.filter((u) => u.account_status === "pending").length,
    pendingActivationsCount: pendingOrders.length,
    totalTools: globalStore.tools.length,
    publishedTools: globalStore.tools.filter((t) => t.is_published).length,
    totalCategories: globalStore.categories.length,
    mostClicked: sortedTools.slice(0, 5),
    recentAuditLogs: [...globalStore.auditLogs].slice(0, 5),
    recentOrders: [...globalStore.orders].slice(0, 5),
  };
}


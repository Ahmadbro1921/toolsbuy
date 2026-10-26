import Link from "next/link";
import { getTools, getCategories, getCurrentUserSession } from "@/lib/supabase/store";
import { ToolCard } from "@/components/tool-card";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Search,
  CheckCircle2,
  Zap,
  Shield,
  Layers,
  Star,
  ExternalLink,
  Code,
  Bot,
  Image as ImageIcon,
  Headphones,
  Video,
} from "lucide-react";

export default async function HomePage() {
  const session = await getCurrentUserSession();
  const categories = await getCategories();
  const { tools: featuredTools } = await getTools({ isFeatured: true, limit: 6 });
  const { tools: recentTools } = await getTools({ sortBy: "newest", limit: 6 });

  const categoryIcons: Record<string, any> = {
    Bot,
    Image: ImageIcon,
    Code,
    Headphones,
    Video,
    Zap,
    Search,
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-glow pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6">
        <div className="container max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Over 1,200+ Verified AI Tools & Models</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance">
            Discover the Best <span className="gradient-text">AI Tools</span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            The definitive SaaS directory for exploring, benchmarking, and integrating cutting-edge artificial intelligence into your personal and engineering workflows.
          </p>

          {/* Instant Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <form action="/tools" method="GET" className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                name="q"
                placeholder="Search by keyword, task, or model (e.g., Code, Voice, Claude, LLM)..."
                className="w-full pl-12 pr-32 py-4 rounded-2xl bg-card border border-border/80 shadow-2xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <button
                type="submit"
                className="absolute right-2.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-all hover:scale-[1.02]"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-muted-foreground">
              <span>Popular searches:</span>
              {["ChatGPT", "Cursor", "Claude", "Runway", "Midjourney", "ElevenLabs"].map((term) => (
                <Link
                  key={term}
                  href={`/tools?q=${encodeURIComponent(term)}`}
                  className="px-2.5 py-1 rounded-md bg-muted/70 hover:bg-muted text-foreground transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="py-14 border-y border-border/60 bg-muted/10 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Browse By Domain</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                Explore Popular Categories
              </h2>
            </div>
            <Link
              href="/categories"
              className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              All Categories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3.5">
            {categories.map((cat) => {
              const IconComp = categoryIcons[cat.icon] || Sparkles;
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group rounded-2xl border border-border/80 bg-card p-4 hover:border-primary/50 hover:shadow-lg transition-all flex flex-col items-center text-center space-y-2.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-xs tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{cat.tool_count || 0} tools</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured AI Tools */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Hand-Picked</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                Featured AI Tools
              </h2>
            </div>
            <Link
              href="/tools"
              className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View Full Directory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                viewMode="grid"
                isSignedIn={Boolean(session)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trending & Recently Added */}
      <section className="py-16 bg-muted/10 border-t border-border/60 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-500">Recently Added</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                Freshly Indexed AI Tools
              </h2>
            </div>
            <Link
              href="/tools?sort=newest"
              className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              See All Recent <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                viewMode="grid"
                isSignedIn={Boolean(session)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & How It Works */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container max-w-6xl mx-auto space-y-12 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Why AI Hub?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Engineered for Modern Engineers & Creators
            </h2>
            <p className="text-sm text-muted-foreground">
              We cut through the AI marketing hype to deliver honest capabilities, clear pricing models, and tested workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Unbiased Verification</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No paid-for inflated rankings. Every tool card clearly specifies whether the service requires an external account, pricing limits, and key capabilities.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Instant Live Discovery</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Filter by open source, free trials, multimodal capabilities, and technical stacks with zero page lag.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Smart Bookmarks & History</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Create a free account to track tools you frequently launch, organize favorites into your dashboard, and stay on top of updates.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 shadow-md shadow-primary/25 hover:scale-[1.02] transition-all"
            >
              Join AI Hub Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

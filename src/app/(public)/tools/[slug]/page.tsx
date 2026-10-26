import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getToolBySlug, getTools, getCurrentUserSession } from "@/lib/supabase/store";
import { FavoriteButton } from "@/components/favorite-button";
import { ToolCard } from "@/components/tool-card";
import {
  ExternalLink,
  Star,
  CheckCircle,
  AlertCircle,
  Layers,
  Sparkles,
  ArrowLeft,
  Calendar,
  Globe,
  Tag,
  ShieldCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ToolPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const tool = await getToolBySlug(params.slug);
  if (!tool) {
    return { title: "Tool Not Found" };
  }

  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aihub.local";
  const baseUrl = rawUrl.replace(/\/+$/, "");
  const canonicalUrl = `${baseUrl}/tools/${tool.slug}`;

  return {
    title: `${tool.name} — AI Tool Review, Features & Pricing`,
    description: tool.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${tool.name} — AI Tool Review & Pricing | AI Hub`,
      description: tool.description,
      url: canonicalUrl,
      images: tool.logo_url ? [{ url: tool.logo_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} — AI Hub`,
      description: tool.description,
      images: tool.logo_url ? [tool.logo_url] : [],
    },
  };
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const session = await getCurrentUserSession();
  const tool = await getToolBySlug(params.slug, session?.id);

  if (!tool) {
    notFound();
  }

  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aihub.local";
  const baseUrl = rawUrl.replace(/\/+$/, "");

  // Get related tools in the same category
  const { tools: categoryTools } = await getTools({
    categoryId: tool.category_id,
    limit: 4,
    publishedOnly: true,
  });
  const relatedTools = categoryTools.filter((t) => t.id !== tool.id).slice(0, 3);

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: tool.name,
        description: tool.description,
        applicationCategory: tool.category?.name || "Artificial Intelligence",
        operatingSystem: "Web",
        image: tool.logo_url,
        offers: {
          "@type": "Offer",
          price: tool.pricing_type === "Free" || tool.pricing_type === "Open Source" ? "0" : undefined,
          priceCurrency: "USD",
          category: tool.pricing_type,
        },
        url: tool.official_url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tools",
            item: `${baseUrl}/tools`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: tool.name,
            item: `${baseUrl}/tools/${tool.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* JSON-LD for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back button */}
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
      </Link>

      {/* Tool Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border shrink-0 bg-muted/40 shadow-sm">
              <img
                src={tool.logo_url}
                alt={tool.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {tool.name}
                </h1>
                {tool.is_featured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Star className="w-3 h-3 fill-amber-500" /> Featured
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {tool.pricing_type}
                </span>
              </div>
              {tool.category && (
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>Category:</span>
                  <Link
                    href={`/categories/${tool.category.slug}`}
                    className="font-medium text-foreground hover:text-primary transition-colors underline"
                  >
                    {tool.category.name}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
            <FavoriteButton
              toolId={tool.id}
              initialFavorited={tool.is_favorited}
              initialCount={tool.favorite_count}
              isSignedIn={Boolean(session)}
              className="py-2.5 px-3.5 text-sm"
            />
            <a
              href={`/api/tools/click?id=${tool.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 shadow-md shadow-primary/25 hover:scale-[1.02] transition-all"
            >
              Open Tool <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Clear Notice when Tool Requires External Account */}
        {tool.external_account_required && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Account Notice:</strong> Using {tool.name} requires an external account or subscription on their official platform. AI Hub is an independent discovery directory and does not collect your third-party credentials.
            </p>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description, Features, Use Cases */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3">
            <h2 className="text-lg font-bold">About {tool.name}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {tool.description}
            </p>
          </div>

          {/* Key Features */}
          {tool.features && tool.features.length > 0 && (
            <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Key Capabilities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tool.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/50 text-xs text-foreground"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practical Use Cases */}
          {((tool.useCases && tool.useCases.length > 0) || (tool.use_cases && tool.use_cases.length > 0)) && (
            <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" /> Recommended Use Cases
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {(tool.useCases || tool.use_cases || []).map((useCase, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Sidebar: Meta Details */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-4 text-xs">
            <h3 className="font-bold text-sm border-b border-border pb-2.5">
              Listing Metadata
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Official URL
                </span>
                <a
                  href={`/api/tools/click?id=${tool.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium truncate max-w-[150px]"
                >
                  {new URL(tool.official_url).hostname}
                </a>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Integration Mode</span>
                <span className="font-medium capitalize">{tool.integration_mode.replace("_", " ")}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Pricing Tier</span>
                <span className="font-medium">{tool.pricing_type}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Indexed On
                </span>
                <span className="font-medium">{formatDate(tool.created_at)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Directory Status
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Verified Safe</span>
              </div>
            </div>

            {/* Tags */}
            {tool.tags && tool.tags.length > 0 && (
              <div className="pt-3 border-t border-border space-y-2">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Tag className="w-3.5 h-3.5" /> Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tool.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-[11px] font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="pt-8 border-t border-border space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Related Alternatives</span>
            <h2 className="text-2xl font-bold tracking-tight mt-1">
              More AI Tools in {tool.category?.name || "this category"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedTools.map((rel) => (
              <ToolCard
                key={rel.id}
                tool={rel}
                isSignedIn={Boolean(session)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

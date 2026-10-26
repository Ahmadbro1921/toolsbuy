import Link from "next/link";
import Image from "next/image";
import { Tool } from "@/types";
import { FavoriteButton } from "./favorite-button";
import { ExternalLink, Star, Sparkles, ShieldCheck } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
  viewMode?: "grid" | "list";
  isSignedIn?: boolean;
}

export function ToolCard({ tool, viewMode = "grid", isSignedIn = false }: ToolCardProps) {
  const pricingColors: Record<string, string> = {
    Free: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Freemium: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Paid: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "Free Trial": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "Open Source": "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  };

  const badgeStyle = pricingColors[tool.pricing_type] || "bg-muted text-muted-foreground border-border";

  if (viewMode === "list") {
    return (
      <div className="group relative rounded-xl border border-border/70 bg-card p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border shrink-0 bg-muted/50">
            {tool.logo_url ? (
              <img
                src={tool.logo_url}
                alt={tool.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                {tool.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/tools/${tool.slug}`} className="font-semibold hover:text-primary transition-colors text-base">
                {tool.name}
              </Link>
              {tool.is_featured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Star className="w-3 h-3 fill-amber-500" />
                  Featured
                </span>
              )}
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${badgeStyle}`}>
                {tool.pricing_type}
              </span>
              {tool.category && (
                <span className="text-xs text-muted-foreground">in {tool.category.name}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1 max-w-xl">{tool.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
          <FavoriteButton
            toolId={tool.id}
            initialFavorited={tool.is_favorited}
            initialCount={tool.favorite_count}
            isSignedIn={isSignedIn}
          />
          <Link
            href={`/tools/${tool.slug}`}
            className="px-3.5 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-medium transition-colors"
          >
            Details
          </Link>
          <a
            href={`/api/tools/click?id=${tool.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
          >
            Visit <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-2xl border border-border/80 bg-card p-5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border shrink-0 bg-muted/40">
            {tool.logo_url ? (
              <img
                src={tool.logo_url}
                alt={tool.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                {tool.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle}`}>
              {tool.pricing_type}
            </span>
            <FavoriteButton
              toolId={tool.id}
              initialFavorited={tool.is_favorited}
              initialCount={tool.favorite_count}
              isSignedIn={isSignedIn}
            />
          </div>
        </div>

        {/* Title & Category */}
        <div className="mb-2">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/tools/${tool.slug}`}
              className="font-bold text-base tracking-tight hover:text-primary transition-colors line-clamp-1"
            >
              {tool.name}
            </Link>
            {tool.is_featured && (
              <span title="Featured Tool">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              </span>
            )}
          </div>
          {tool.category && (
            <Link
              href={`/categories/${tool.category.slug}`}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {tool.category.name}
            </Link>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
          {tool.description}
        </p>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {tool.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground text-[11px] font-medium"
              >
                #{tag}
              </span>
            ))}
            {tool.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground self-center">+{tool.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
        <Link
          href={`/tools/${tool.slug}`}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          View Details →
        </Link>
        <a
          href={`/api/tools/click?id=${tool.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-sm transition-all group-hover:scale-105"
        >
          Open Tool <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

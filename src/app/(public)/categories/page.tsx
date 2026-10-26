import { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/supabase/store";
import {
  FolderTree,
  Bot,
  Image as ImageIcon,
  Code,
  Headphones,
  Video,
  Zap,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Tool Categories — Explore by Domain",
  description: "Browse categorized collections of artificial intelligence tools from LLMs to Computer Vision and Developer Tooling.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  const iconMap: Record<string, any> = {
    Bot,
    Image: ImageIcon,
    Code,
    Headphones,
    Video,
    Zap,
    Search,
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <FolderTree className="w-3.5 h-3.5" />
          <span>Taxonomy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          AI Tool Categories
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Browse verified AI tools grouped by practical domain, use case, and industry application.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const IconComp = iconMap[cat.icon] || Sparkles;
          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group p-6 rounded-2xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <IconComp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {cat.description || "Collection of specialized tools and APIs."}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{cat.tool_count || 0} tools indexed</span>
                <span className="text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

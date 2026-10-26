import { Metadata } from "next";
import { getTools, getCategories, getCurrentUserSession } from "@/lib/supabase/store";
import { DirectoryFilter } from "@/components/directory-filter";
import { Sparkles, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Tools Directory — Discover & Benchmark AI Tools",
  description: "Browse the curated directory of artificial intelligence tools, models, developer IDEs, video editors, and audio generators.",
};

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getCurrentUserSession();
  const categories = await getCategories();
  const { tools } = await getTools({ limit: 500, publishedOnly: true });

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Curated Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Explore AI Tools
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Search, filter, and compare {tools.length} verified AI applications and developer assistants across categories and pricing structures.
        </p>
      </div>

      {/* Directory Filter Component with live state */}
      <DirectoryFilter
        initialTools={tools}
        categories={categories}
        isSignedIn={Boolean(session)}
      />
    </div>
  );
}

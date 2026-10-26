import Link from "next/link";
import { getCurrentUserSession, getUserFavorites } from "@/lib/supabase/store";
import { ToolCard } from "@/components/tool-card";
import { Heart, Compass, ArrowRight } from "lucide-react";

export default async function DashboardFavoritesPage() {
  const session = await getCurrentUserSession();
  if (!session) return null;

  const favorites = await getUserFavorites(session.id);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
          <span>My Collection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Saved Favorites</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {favorites.length} AI tools bookmarked for quick access and workflow tracking.
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isSignedIn={true}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-muted/20 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base">No saved favorites yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Click the heart icon on any tool card in the directory to save it to your private dashboard.
          </p>
          <div className="pt-2">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90"
            >
              <Compass className="w-4 h-4" /> Browse All Tools
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

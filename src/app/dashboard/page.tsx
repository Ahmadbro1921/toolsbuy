import Link from "next/link";
import { getCurrentUserSession, getUserFavorites, getUserHistory } from "@/lib/supabase/store";
import {
  Heart,
  Clock,
  Sparkles,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

export default async function DashboardOverviewPage() {
  const session = await getCurrentUserSession();
  if (!session) return null;

  const favorites = await getUserFavorites(session.id);
  const history = await getUserHistory(session.id);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-violet-600/15 via-indigo-600/10 to-transparent border border-border/80 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Member Dashboard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Welcome back, {session.display_name}!
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
          Track your bookmarked AI tools, review outbound clicks, and manage your account credentials.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Saved Favorites</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold">{favorites.length}</div>
          <Link
            href="/dashboard/favorites"
            className="text-[11px] text-primary hover:underline font-medium inline-block pt-1"
          >
            Manage bookmarks →
          </Link>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Tools Opened</span>
            <Clock className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-extrabold">{history.length}</div>
          <Link
            href="/dashboard/history"
            className="text-[11px] text-primary hover:underline font-medium inline-block pt-1"
          >
            View click timeline →
          </Link>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Account Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold capitalize text-emerald-600 dark:text-emerald-400">
            {session.account_status}
          </div>
          <span className="text-[11px] text-muted-foreground inline-block pt-1">
            Role: <strong className="capitalize">{session.role}</strong>
          </span>
        </div>
      </div>

      {/* Quick Launch & Recent History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Favorites */}
        <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" /> Saved Favorites
            </h3>
            <Link href="/dashboard/favorites" className="text-xs text-primary hover:underline">
              View all ({favorites.length})
            </Link>
          </div>

          {favorites.length > 0 ? (
            <div className="space-y-2.5">
              {favorites.slice(0, 4).map((tool) => (
                <div
                  key={tool.id}
                  className="p-3 rounded-xl border border-border/60 hover:border-primary/40 bg-muted/20 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={tool.logo_url}
                      alt={tool.name}
                      className="w-9 h-9 rounded-lg object-cover"
                    />
                    <div>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="font-semibold text-xs hover:text-primary transition-colors"
                      >
                        {tool.name}
                      </Link>
                      <p className="text-[11px] text-muted-foreground">{tool.pricing_type}</p>
                    </div>
                  </div>
                  <a
                    href={`/api/tools/click?id=${tool.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors"
                    title="Open official site"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-muted-foreground">
              <p>You haven't favorited any AI tools yet.</p>
              <Link
                href="/tools"
                className="mt-2 inline-flex items-center gap-1 text-primary font-semibold hover:underline"
              >
                Explore directory <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Recently Launched */}
        <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-500" /> Recently Launched
            </h3>
            <Link href="/dashboard/history" className="text-xs text-primary hover:underline">
              View all ({history.length})
            </Link>
          </div>

          {history.length > 0 ? (
            <div className="space-y-2.5">
              {history.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.tool.logo_url}
                      alt={item.tool.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <Link
                        href={`/tools/${item.tool.slug}`}
                        className="font-semibold hover:text-primary transition-colors"
                      >
                        {item.tool.name}
                      </Link>
                      <p className="text-[10px] text-muted-foreground">
                        Opened {formatTimeAgo(item.clickedAt)}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/api/tools/click?id=${item.tool.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                  >
                    Launch <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-muted-foreground">
              <p>No recent tool launches recorded.</p>
              <Link
                href="/tools"
                className="mt-2 inline-flex items-center gap-1 text-primary font-semibold hover:underline"
              >
                Browse AI tools <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

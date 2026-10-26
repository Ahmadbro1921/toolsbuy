import Link from "next/link";
import { getCurrentUserSession, getUserHistory } from "@/lib/supabase/store";
import { Clock, ExternalLink, Compass } from "lucide-react";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export default async function DashboardHistoryPage() {
  const session = await getCurrentUserSession();
  if (!session) return null;

  const history = await getUserHistory(session.id);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-cyan-500 font-bold text-xs uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span>Activity Timeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Launch History</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          A secure chronological record of the AI tools you have visited and opened.
        </p>
      </div>

      {history.length > 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
          <div className="divide-y divide-border/60">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.tool.logo_url}
                    alt={item.tool.name}
                    className="w-11 h-11 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/tools/${item.tool.slug}`}
                        className="font-bold text-sm hover:text-primary transition-colors"
                      >
                        {item.tool.name}
                      </Link>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border">
                        {item.tool.pricing_type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-md">
                      {item.tool.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="block font-medium text-foreground">
                      {formatTimeAgo(item.clickedAt)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDate(item.clickedAt)}
                    </span>
                  </div>
                  <a
                    href={`/api/tools/click?id=${item.tool.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white font-semibold transition-colors"
                  >
                    Open <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-muted/20 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base">No launch history yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            When you launch tools from the AI Hub directory, your private interaction history will be organized here.
          </p>
          <div className="pt-2">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90"
            >
              <Compass className="w-4 h-4" /> Discover Tools
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

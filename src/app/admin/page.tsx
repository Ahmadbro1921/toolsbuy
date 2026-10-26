import Link from "next/link";
import { getAdminMetrics } from "@/lib/supabase/store";
import {
  Users,
  Wrench,
  FolderTree,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  History,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const metrics = await getAdminMetrics();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Admin Overview</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time platform metrics, user access requests, and directory status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/tools/new"
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all"
          >
            + Add New AI Tool
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Total Registered</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold">{metrics.totalUsers}</div>
          <div className="text-[11px] text-muted-foreground">
            <span className="text-emerald-500 font-semibold">{metrics.activeUsers} active</span> · {metrics.pendingUsers} pending
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Pending Approvals</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {metrics.pendingActivationsCount}
          </div>
          <Link href="/admin/users" className="text-[11px] text-primary hover:underline font-medium">
            Review requests →
          </Link>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Indexed Tools</span>
            <Wrench className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-extrabold">{metrics.totalTools}</div>
          <div className="text-[11px] text-muted-foreground">
            {metrics.publishedTools} published live
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Categories</span>
            <FolderTree className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold">{metrics.totalCategories}</div>
          <Link href="/admin/categories" className="text-[11px] text-primary hover:underline font-medium">
            Manage domains →
          </Link>
        </div>
      </div>

      {/* Grid: Most Clicked Tools & Recent Security Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Clicked Tools */}
        <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Most Launched AI Tools
            </h3>
            <Link href="/admin/tools" className="text-xs text-primary hover:underline">
              Manage tools
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {metrics.mostClicked.map((tool, idx) => (
              <div key={tool.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-muted-foreground font-bold w-4">{idx + 1}</span>
                  <img
                    src={tool.logo_url}
                    alt={tool.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div>
                    <span className="font-semibold">{tool.name}</span>
                    <span className="text-[11px] text-muted-foreground block">{tool.pricing_type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-foreground">{tool.click_count || 0}</span>
                  <span className="text-[10px] text-muted-foreground block">launches</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-rose-500" /> Recent Security & Audit Logs
            </h3>
            <Link href="/admin/audit-logs" className="text-xs text-primary hover:underline">
              Full audit trail
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {metrics.recentAuditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-semibold text-foreground font-mono">{log.action}</span>
                  <span className="text-[11px] text-muted-foreground block">
                    by {log.actor_email || "system"} on {log.target_type}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {formatTimeAgo(log.created_at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

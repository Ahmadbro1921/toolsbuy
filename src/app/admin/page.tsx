import Link from "next/link";
import { getAdminMetrics } from "@/lib/supabase/store";
import {
  Users,
  Wrench,
  AlertCircle,
  TrendingUp,
  History,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export const metadata = {
  title: "Admin Dashboard - ToolsBuy",
  description: "Platform metrics, revenue, pending orders, and system audit trail.",
};

export default async function AdminOverviewPage() {
  const metrics = await getAdminMetrics();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Admin Overview</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time platform metrics, manual payment verifications, and subscription activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-glow flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Verify Orders</span>
          </Link>
          <Link
            href="/admin/packages"
            className="px-3.5 py-2 rounded-xl bg-card border border-border/80 text-foreground text-xs font-semibold hover:bg-muted transition-all"
          >
            Manage Packages
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Verified Revenue</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">
            PKR {metrics.totalRevenuePkr.toLocaleString()}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {metrics.verifiedOrdersCount} orders verified & active
          </div>
        </div>

        {/* Pending Orders Alert */}
        <div className={`p-5 rounded-2xl border bg-card space-y-1 ${
          metrics.pendingOrdersCount > 0 ? "border-amber-500/50 bg-amber-500/5" : "border-border/80"
        }`}>
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Pending Verifications</span>
            <AlertCircle className={`w-4 h-4 ${metrics.pendingOrdersCount > 0 ? "text-amber-500 animate-bounce" : "text-muted-foreground"}`} />
          </div>
          <div className="text-2xl font-extrabold text-amber-500">
            {metrics.pendingOrdersCount}
          </div>
          <Link href="/admin/orders" className="text-[11px] text-primary hover:underline font-medium block">
            Review & activate subscriptions →
          </Link>
        </div>

        {/* Active Subscriptions */}
        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Active Subscriptions</span>
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">
            {metrics.activeSubscriptionsCount}
          </div>
          <div className="text-[11px] text-muted-foreground">
            1-Click Cloud Access Enabled
          </div>
        </div>

        {/* Support Tickets */}
        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Open Tickets</span>
            <MessageSquare className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">
            {metrics.openTicketsCount}
          </div>
          <Link href="/admin/tickets" className="text-[11px] text-primary hover:underline font-medium block">
            Open help desk →
          </Link>
        </div>
      </div>

      {/* Pending Orders Callout if any */}
      {metrics.pendingOrdersCount > 0 && (
        <div className="p-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">
                {metrics.pendingOrdersCount} Order{metrics.pendingOrdersCount > 1 ? "s" : ""} Awaiting Manual Payment Verification
              </h4>
              <p className="text-xs text-muted-foreground">
                EasyPaisa, JazzCash, or Bank transfer submitted. Confirm transaction ID and activate tools for customer.
              </p>
            </div>
          </div>
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-all shadow-md shrink-0"
          >
            Go to Orders Desk →
          </Link>
        </div>
      )}

      {/* Grid: Recent Orders & Most Launched Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table */}
        <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> Recent Orders & Transactions
            </h3>
            <Link href="/admin/orders" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {metrics.recentOrders.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">No orders recorded yet.</div>
            ) : (
              metrics.recentOrders.map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-foreground">{ord.order_number}</span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {ord.payment_method}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                      {ord.customer_name} ({ord.customer_phone})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-foreground block">
                      PKR {ord.total_amount_pkr.toLocaleString()}
                    </span>
                    <span className={`text-[10px] font-semibold ${
                      ord.status === "verified" ? "text-emerald-400" : ord.status === "rejected" ? "text-rose-400" : "text-amber-400"
                    }`}>
                      {ord.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Most Clicked Tools */}
        <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Most Launched Tools
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
                    <span className="font-semibold text-foreground">{tool.name}</span>
                    <span className="text-[11px] text-muted-foreground block">
                      PKR {tool.price_pkr?.toLocaleString() || "500"}/mo
                    </span>
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
      </div>

      {/* Security & System Audits */}
      <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <History className="w-4 h-4 text-rose-500" /> Recent Security & Operation Logs
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
  );
}

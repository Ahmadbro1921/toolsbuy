import Link from "next/link";
import {
  getCurrentUserSession,
  getActiveSubscription,
  getTools,
  getOrders,
  getSupportTickets,
  getReferrals,
} from "@/lib/supabase/store";
import { ToolLauncherGrid } from "@/components/tool-launcher-grid";
import { DashboardTicketWidget } from "@/components/dashboard-ticket-widget";
import {
  Zap,
  ShoppingBag,
  Users,
  ShieldCheck,
  Package,
  Calendar,
  Clock,
  ArrowRight,
  Copy,
  ExternalLink,
  PhoneCall,
  CheckCircle,
} from "lucide-react";

export default async function DashboardOverviewPage() {
  const session = await getCurrentUserSession();
  if (!session) return null;

  const subscription = await getActiveSubscription(session.id);
  const { tools } = await getTools({ limit: 100, publishedOnly: true });
  const orders = await getOrders({ userId: session.id });
  const tickets = await getSupportTickets(session.id);
  const referrals = await getReferrals(session.id);

  // Calculate days remaining
  let daysRemaining = 0;
  if (subscription) {
    const diffTime = new Date(subscription.expires_at).getTime() - Date.now();
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  const referralCode = session.referral_code || "TB-ALEX99";
  const referralLink = `https://toolsbuy.vercel.app/signup?ref=${referralCode}`;

  return (
    <div className="space-y-10">
      {/* 1. Subscription & Account Status Header */}
      {subscription ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-emerald-900/30 to-card border border-emerald-500/40 shadow-glow space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Subscription · All Tools Unlocked</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {subscription.package_name}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Your direct 1-click cloud access is running smoothly. All systems operational.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-card/60 p-4 rounded-2xl border border-border shrink-0">
              <Calendar className="w-8 h-8 text-emerald-500" />
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Remaining Time
                </span>
                <span className="text-xl font-extrabold text-foreground">
                  {daysRemaining} Days Left
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-muted/40 to-card border border-amber-500/30 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/30">
                <Clock className="w-3.5 h-3.5" />
                No Active Plan
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Unlock 1-Click Access to 20+ Premium Tools
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                Get direct logins to Helium 10 Diamond, Jungle Scout, Keepa Pro, ChatGPT Plus, Claude, Midjourney, and Canva Pro with instant activation.
              </p>
            </div>

            <Link
              href="/plans"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-95 shrink-0"
            >
              <Package className="w-4 h-4" />
              <span>Browse Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* 2. 1-Click Tool Launch Station */}
      <section>
        <ToolLauncherGrid tools={tools} subscription={subscription} />
      </section>

      {/* 3. My Orders Section */}
      <section id="orders" className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <span>My Orders & Transactions</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Review your purchase history, payment status, and verification receipts.
            </p>
          </div>

          <Link
            href="/plans"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>+ New Order</span>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-2xl space-y-2">
            <ShoppingBag className="w-8 h-8 text-muted-foreground/40 mx-auto" />
            <p className="text-xs text-muted-foreground">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border text-muted-foreground uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Package / Details</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Payment Method</th>
                  <th className="pb-3">Transaction ID</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30">
                    <td className="py-3.5 font-mono font-bold text-foreground">{order.order_number}</td>
                    <td className="py-3.5 font-medium text-foreground">{order.package_name || "Custom Bundle"}</td>
                    <td className="py-3.5 font-bold text-foreground">PKR {order.total_amount_pkr.toLocaleString()}</td>
                    <td className="py-3.5 capitalize font-medium text-muted-foreground">
                      {order.payment_method.replace("_", " ")}
                    </td>
                    <td className="py-3.5 font-mono text-[11px] text-muted-foreground">{order.transaction_id}</td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          order.status === "verified"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : order.status === "rejected"
                            ? "bg-destructive/15 text-destructive border border-destructive/30"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {order.status === "verified" ? "Active / Verified" : order.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 4. Referral Program Station */}
      <section id="referral" className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-500" />
              <span>Referral Program & Rewards</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Invite friends to ToolsBuy and earn PKR 500 for every verified package subscription!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-muted/50 px-4 py-2.5 rounded-2xl border border-border">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Total Referred
              </span>
              <strong className="text-base text-foreground">{referrals.length} Users</strong>
            </div>
            <div className="border-l border-border pl-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Total Earned
              </span>
              <strong className="text-base text-emerald-600">
                PKR {referrals.reduce((acc, r) => acc + (r.commission_pkr || 0), 0).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
          <span className="text-xs font-semibold text-muted-foreground block">Your Unique Referral Link:</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-foreground focus:outline-none"
            />
            <button
              onClick={() => navigator.clipboard.writeText(referralLink)}
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:opacity-90 transition-opacity shrink-0 flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. Support Tickets System */}
      <section>
        <DashboardTicketWidget tickets={tickets} userEmail={session.email} />
      </section>
    </div>
  );
}

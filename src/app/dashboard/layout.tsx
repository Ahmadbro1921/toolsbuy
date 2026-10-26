import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserSession, getActiveSubscription } from "@/lib/supabase/store";
import {
  LayoutDashboard,
  Package,
  Wrench,
  ShoppingBag,
  Heart,
  Users,
  LifeBuoy,
  User,
  ShieldCheck,
  LogOut,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentUserSession();

  if (!session) {
    redirect("/login?redirect=dashboard");
  }

  const activeSub = await getActiveSubscription(session.id);

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
      {/* Dashboard Sidebar */}
      <aside className="w-full md:w-64 border-r border-border bg-card/70 backdrop-blur-md p-4 sm:p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* User mini badge */}
          <div className="p-3.5 rounded-2xl bg-muted/50 border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              {session.display_name.slice(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden min-w-0">
              <h4 className="font-bold text-xs truncate text-foreground">{session.display_name}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeSub ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                <span className="text-[11px] text-muted-foreground truncate">
                  {activeSub ? "Subscribed Plan" : "Free Member"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-500" />
              <span>Launch Station</span>
            </Link>

            <Link
              href="/dashboard#orders"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span>My Orders</span>
            </Link>

            <Link
              href="/dashboard/favorites"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Saved Tools</span>
            </Link>

            <Link
              href="/dashboard#referral"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Users className="w-4 h-4 text-cyan-500" />
              <span>Referral Program</span>
            </Link>

            <Link
              href="/dashboard#support"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <LifeBuoy className="w-4 h-4 text-amber-500" />
              <span>Support Tickets</span>
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <User className="w-4 h-4 text-indigo-500" />
              <span>Profile Settings</span>
            </Link>

            <div className="pt-4 border-t border-border space-y-1">
              <Link
                href="/plans"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
              >
                <span className="flex items-center gap-2 font-bold">
                  <Package className="w-4 h-4" />
                  Upgrade Plan
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500 text-white">
                  Buy
                </span>
              </Link>

              {session.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors font-bold mt-1"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Control Center</span>
                </Link>
              )}
            </div>
          </nav>
        </div>

        {/* Logout button */}
        <div className="pt-4 border-t border-border">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Dashboard Content Area */}
      <section className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto space-y-8">
        {children}
      </section>
    </div>
  );
}

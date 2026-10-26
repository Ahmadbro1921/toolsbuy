import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserSession } from "@/lib/supabase/store";
import {
  LayoutDashboard,
  Heart,
  Clock,
  User,
  ShieldCheck,
  Compass,
  LogOut,
  AlertTriangle,
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

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      {/* Dashboard Sidebar */}
      <aside className="w-full md:w-64 border-r border-border/80 bg-card/60 backdrop-blur-md p-4 sm:p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* User mini badge */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              {session.display_name.slice(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-xs truncate">{session.display_name}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    session.account_status === "active"
                      ? "bg-emerald-500"
                      : session.account_status === "pending"
                      ? "bg-amber-500"
                      : "bg-destructive"
                  }`}
                />
                <span className="text-[11px] text-muted-foreground capitalize">
                  {session.account_status} account
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span>Overview</span>
            </Link>
            <Link
              href="/dashboard/favorites"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Saved Favorites</span>
            </Link>
            <Link
              href="/dashboard/history"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Clock className="w-4 h-4 text-cyan-500" />
              <span>Launch History</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <User className="w-4 h-4 text-indigo-500" />
              <span>Profile Settings</span>
            </Link>

            <div className="pt-4 border-t border-border/60">
              <Link
                href="/tools"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <Compass className="w-4 h-4 text-emerald-500" />
                <span>Explore Directory</span>
              </Link>

              {session.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors mt-1"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          </nav>
        </div>

        {/* Logout button */}
        <div className="pt-4 border-t border-border/60">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Dashboard Content Area */}
      <section className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto space-y-6">
        {session.account_status === "pending" && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">Account Activation Pending Review</h4>
              <p className="mt-0.5 leading-relaxed">
                Your account is currently queued for administrator approval according to current site registration policies. You can browse tools and save bookmarks in read-only mode while approval is processed.
              </p>
            </div>
          </div>
        )}
        {children}
      </section>
    </div>
  );
}

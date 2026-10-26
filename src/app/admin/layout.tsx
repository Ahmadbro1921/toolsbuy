import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserSession } from "@/lib/supabase/store";
import {
  LayoutDashboard,
  Wrench,
  FolderTree,
  Users,
  Settings,
  ShieldCheck,
  History,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentUserSession();

  if (!session) {
    redirect("/login?redirect=admin");
  }

  // Strict server-side role enforcement
  if (session.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 border-r border-border/80 bg-card/70 backdrop-blur-md p-4 sm:p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-amber-600 dark:text-amber-400">
                Administration Panel
              </h4>
              <span className="text-[10px] text-muted-foreground block">
                Privileged Access
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-500" />
              <span>Admin Overview</span>
            </Link>
            <Link
              href="/admin/tools"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Wrench className="w-4 h-4 text-primary" />
              <span>Tool Management</span>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <FolderTree className="w-4 h-4 text-cyan-500" />
              <span>Category Manager</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Users className="w-4 h-4 text-indigo-500" />
              <span>Users & Activations</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Settings className="w-4 h-4 text-emerald-500" />
              <span>Site & AI Settings</span>
            </Link>
            <Link
              href="/admin/audit-logs"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <History className="w-4 h-4 text-rose-500" />
              <span>Security Audit Logs</span>
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-border/60">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to User Mode
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <section className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto space-y-8">
        {children}
      </section>
    </div>
  );
}

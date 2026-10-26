import { getCurrentUserSession } from "@/lib/supabase/store";
import { User, ShieldCheck, Mail, Calendar, Key, AlertCircle } from "lucide-react";

export default async function DashboardProfilePage() {
  const session = await getCurrentUserSession();
  if (!session) return null;

  return (
    <div className="max-w-3xl space-y-8">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-wider">
          <User className="w-3.5 h-3.5" />
          <span>Account Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Profile & Preferences</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage your personal account details, activation status, and security credentials.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card space-y-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
            {session.display_name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-lg">{session.display_name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {session.email}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                  session.account_status === "active"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : session.account_status === "pending"
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    : "bg-destructive/10 text-destructive border-destructive/20"
                }`}
              >
                Status: {session.account_status}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-muted border border-border">
                Role: {session.role}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60">
            <span className="text-muted-foreground block mb-1">User Identifier (UUID)</span>
            <code className="text-foreground font-mono text-[11px]">{session.id}</code>
          </div>
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60">
            <span className="text-muted-foreground block mb-1">Authentication Provider</span>
            <span className="text-foreground font-medium">Supabase Auth (Argon2 / Session JWT)</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card space-y-4">
        <h3 className="font-bold text-base">Edit Display Information</h3>
        <form className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Display Name</label>
            <input
              type="text"
              defaultValue={session.display_name}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Account Email (Verified)</label>
            <input
              type="email"
              disabled
              defaultValue={session.email}
              className="w-full px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border text-sm text-muted-foreground cursor-not-allowed"
            />
            <span className="text-[10px] text-muted-foreground mt-1 block">
              Contact an administrator to change your verified email address.
            </span>
          </div>

          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

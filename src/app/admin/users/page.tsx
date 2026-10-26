import { getUsersList, getActivationRequests } from "@/lib/supabase/store";
import {
  updateUserStatusAction,
  reviewActivationRequestAction,
} from "@/lib/actions/users";
import {
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
  UserX,
  UserCheck,
  Clock,
  Mail,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const users = await getUsersList();
  const activationRequests = await getActivationRequests();

  const pendingRequests = activationRequests.filter((r) => r.status === "pending");

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" />
          <span>Access Control</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
          User & Activation Management
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Review manual activation requests, manage member privileges, and suspend or restore accounts.
        </p>
      </div>

      {/* Section 1: Pending Activation Requests */}
      <div className="rounded-2xl border border-amber-500/30 bg-card overflow-hidden shadow-sm">
        <div className="p-4 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-amber-700 dark:text-amber-400">
            <Clock className="w-4 h-4" />
            <span>Pending Account Activation Requests ({pendingRequests.length})</span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Manual Approval Policy Active
          </span>
        </div>

        {pendingRequests.length > 0 ? (
          <div className="divide-y divide-border/60">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{req.display_name}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {req.user_email}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      Pending Approval
                    </span>
                  </div>
                  {req.note && (
                    <p className="text-xs text-muted-foreground italic bg-muted/40 p-2 rounded-lg border border-border/50 max-w-xl">
                      "{req.note}"
                    </p>
                  )}
                  <span className="text-[10px] text-muted-foreground block">
                    Submitted: {formatDate(req.created_at)}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <form
                    action={async () => {
                      "use server";
                      await reviewActivationRequestAction(
                        req.id,
                        req.user_id,
                        req.user_email || "",
                        req.display_name || "User",
                        "approved"
                      );
                    }}
                  >
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve & Activate
                    </button>
                  </form>

                  <form
                    action={async () => {
                      "use server";
                      await reviewActivationRequestAction(
                        req.id,
                        req.user_id,
                        req.user_email || "",
                        req.display_name || "User",
                        "rejected"
                      );
                    }}
                  >
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 font-semibold text-xs transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No pending activation requests. All registered users are approved or verified.
          </div>
        )}
      </div>

      {/* Section 2: All Registered Users Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        <div className="p-4 bg-muted/40 border-b border-border flex items-center justify-between">
          <span className="font-bold text-xs text-foreground">Registered User Directory ({users.length})</span>
          <span className="text-[11px] text-muted-foreground">Passwords Managed Privately via Supabase Auth</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/30 border-b border-border/60 text-muted-foreground font-semibold">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Registered</th>
                <th className="p-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {user.display_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-foreground block">{user.display_name}</span>
                        <span className="text-[11px] text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                        user.role === "admin"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        user.account_status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : user.account_status === "pending"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                      }`}
                    >
                      {user.account_status}
                    </span>
                  </td>

                  <td className="p-4 text-muted-foreground">
                    {formatDate(user.created_at)}
                  </td>

                  <td className="p-4 text-right">
                    {user.role !== "admin" ? (
                      <div className="flex items-center justify-end gap-2">
                        {user.account_status === "active" ? (
                          <form
                            action={async () => {
                              "use server";
                              await updateUserStatusAction(user.id, "suspended", "Administrative suspension");
                            }}
                          >
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-destructive/20 text-destructive hover:bg-destructive/10 text-[11px] font-medium"
                              title="Suspend user access"
                            >
                              <UserX className="w-3 h-3" /> Suspend
                            </button>
                          </form>
                        ) : (
                          <form
                            action={async () => {
                              "use server";
                              await updateUserStatusAction(user.id, "active");
                            }}
                          >
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-medium"
                              title="Activate user"
                            >
                              <UserCheck className="w-3 h-3" /> Activate
                            </button>
                          </form>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">Protected Administrator</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

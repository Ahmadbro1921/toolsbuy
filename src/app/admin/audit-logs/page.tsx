import { getAuditLogs } from "@/lib/supabase/store";
import { History, Shield, Clock } from "lucide-react";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export default async function AdminAuditLogsPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider">
          <History className="w-3.5 h-3.5" />
          <span>Security & Compliance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
          Security Audit Logs
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Immutable audit trail recording administrative modifications, role actions, and security events.
        </p>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground font-semibold">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Type</th>
                <th className="p-4">Target ID</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 whitespace-nowrap text-muted-foreground">
                    <span className="font-medium text-foreground block">
                      {formatTimeAgo(log.created_at)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDate(log.created_at)}
                    </span>
                  </td>

                  <td className="p-4 font-medium">
                    <span className="text-foreground">{log.actor_email || "System"}</span>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono font-semibold text-[11px]">
                      {log.action}
                    </span>
                  </td>

                  <td className="p-4 capitalize text-muted-foreground">
                    {log.target_type}
                  </td>

                  <td className="p-4 font-mono text-[11px] text-muted-foreground truncate max-w-[120px]">
                    {log.target_id || "—"}
                  </td>

                  <td className="p-4 font-mono text-[10px] text-muted-foreground max-w-xs truncate">
                    {JSON.stringify(log.details)}
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

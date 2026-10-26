"use client";

import { useState } from "react";
import { UserSession } from "@/types";
import { switchDemoRoleAction } from "@/lib/actions/auth";
import { ShieldCheck, UserCheck, Clock, Users, X } from "lucide-react";

interface DemoRoleBannerProps {
  session: UserSession | null;
}

export function DemoRoleBanner({ session }: DemoRoleBannerProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-4 right-4 z-50 p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-all text-xs font-semibold flex items-center gap-1.5"
        title="Open Role Switcher"
      >
        <Users className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 p-3 rounded-2xl glass-panel shadow-2xl border border-primary/20 max-w-xs text-xs animate-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-bold flex items-center gap-1 text-primary">
          <Users className="w-3.5 h-3.5" /> Quick Role Switcher
        </span>
        <button
          onClick={() => setCollapsed(true)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Minimize"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground mb-2.5">
        Current Role: <strong className="text-foreground capitalize">{session?.role || "Guest"}</strong>{" "}
        ({session?.account_status || "none"})
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        <button
          onClick={() => switchDemoRoleAction("admin")}
          className={`px-2 py-1.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
            session?.role === "admin"
              ? "bg-amber-500 text-white border-amber-600 font-bold"
              : "bg-muted hover:bg-muted/80 text-foreground"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
        <button
          onClick={() => switchDemoRoleAction("user")}
          className={`px-2 py-1.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
            session?.role === "user" && session?.account_status === "active"
              ? "bg-blue-600 text-white border-blue-700 font-bold"
              : "bg-muted hover:bg-muted/80 text-foreground"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Active User</span>
        </button>
        <button
          onClick={() => switchDemoRoleAction("pending")}
          className={`px-2 py-1.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
            session?.account_status === "pending"
              ? "bg-amber-600 text-white border-amber-700 font-bold"
              : "bg-muted hover:bg-muted/80 text-foreground"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending</span>
        </button>
      </div>
    </div>
  );
}

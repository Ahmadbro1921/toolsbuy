"use client";

import { useState } from "react";
import Link from "next/link";
import { Tool, Subscription } from "@/types";
import {
  ExternalLink,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Info,
  CheckCircle,
  Copy,
  Check,
  X,
} from "lucide-react";

interface ToolLauncherGridProps {
  tools: Tool[];
  subscription: Subscription | null;
}

export function ToolLauncherGrid({ tools, subscription }: ToolLauncherGridProps) {
  const [activeModalTool, setActiveModalTool] = useState<Tool | null>(null);
  const [copied, setCopied] = useState(false);

  // Filter tools to those included in the user's active subscription, or show preview
  const isSubscribed = Boolean(subscription && subscription.status === "active");
  const accessibleToolNames = new Set(subscription?.tools_included || []);

  const handleLaunchClick = (tool: Tool) => {
    if (!isSubscribed) return;
    setActiveModalTool(tool);
  };

  const copyCreds = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500" />
            <span>1-Click Tool Launch Station</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Direct authenticated cloud sessions. Click any tool below to launch and work instantly.
          </p>
        </div>

        {!isSubscribed && (
          <Link
            href="/plans"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-95"
          >
            <span>Unlock All Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((tool) => {
          const hasAccess = isSubscribed && (accessibleToolNames.has(tool.name) || accessibleToolNames.size === 0);

          return (
            <div
              key={tool.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                hasAccess
                  ? "border-emerald-500/30 bg-card hover:border-emerald-500 hover:shadow-card"
                  : "border-border bg-muted/20 opacity-80"
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-border bg-muted/50 p-1 shrink-0">
                    <img
                      src={tool.logo_url}
                      alt={tool.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {hasAccess ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-semibold border border-border">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-foreground truncate">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border">
                {hasAccess ? (
                  <button
                    onClick={() => handleLaunchClick(tool)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors shadow-sm"
                  >
                    <span>Launch Tool</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Link
                    href={`/plans?highlight=${tool.id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground font-semibold text-xs transition-colors"
                  >
                    <Lock className="w-3 h-3 text-muted-foreground" />
                    <span>Get Access</span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Access Instructions & Launch Modal */}
      {activeModalTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-2xl space-y-6 animate-in zoom-in-95">
            <button
              onClick={() => setActiveModalTool(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-border p-1 bg-muted shrink-0">
                <img
                  src={activeModalTool.logo_url}
                  alt={activeModalTool.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{activeModalTool.name}</h3>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" /> Session Active & Verified
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/50 border border-border space-y-2 text-xs leading-relaxed text-muted-foreground">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-500" />
                Access Instructions:
              </div>
              <p>
                {activeModalTool.access_instructions ||
                  "Click the button below to launch into the shared enterprise session. All history and queries remain isolated and protected."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a
                href={activeModalTool.official_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveModalTool(null)}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md shadow-primary/25 hover:opacity-95 transition-opacity"
              >
                <span>Open {activeModalTool.name} Now</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href="https://wa.me/923127462475"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl border border-border text-foreground hover:bg-muted font-semibold text-xs transition-colors shrink-0"
              >
                <span>Need Help?</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

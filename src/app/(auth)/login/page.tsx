"use client";

import Link from "next/link";
import { useState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { Sparkles, Loader2, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await loginAction(null, formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-xl tracking-tight">AI Hub</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Sign In to Your Account</h1>
          <p className="text-xs text-muted-foreground">
            Access your saved favorites, tool click history, and personal dashboard.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card shadow-xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue="admin@aihub.local"
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold" htmlFor="password">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                defaultValue="AdminPassword2026!"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border">
            <span>Don't have an account? </span>
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        {/* Demo Credentials Helper Box */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs space-y-1.5 text-muted-foreground">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Evaluation Quick Credentials
          </div>
          <div>
            <strong>Administrator:</strong> <code className="text-foreground">admin@aihub.local</code> (Full Admin panel & CRUD)
          </div>
          <div>
            <strong>Standard User:</strong> <code className="text-foreground">user@aihub.local</code> (Favorites & History)
          </div>
        </div>
      </div>
    </div>
  );
}

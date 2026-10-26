"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Heart, CheckCircle2, Shield, ArrowRight } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;
    setSubscribed(true);
  };

  return (
    <footer className="border-t border-border/70 bg-card/40 backdrop-blur-md">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl tracking-tight">AI Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Discover, compare, and leverage the most powerful AI tools, models, and platforms. Curated with unbiased testing and transparent categorization.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Independent & Community Verified</span>
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Directory</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/tools" className="hover:text-foreground transition-colors">
                  All AI Tools
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-foreground transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link href="/categories/text-llms" className="hover:text-foreground transition-colors">
                  LLMs & Writing
                </Link>
              </li>
              <li>
                <Link href="/categories/code-dev" className="hover:text-foreground transition-colors">
                  Code & Developer Tools
                </Link>
              </li>
              <li>
                <Link href="/categories/image-art" className="hover:text-foreground transition-colors">
                  Image & Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About AI Hub
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/affiliate-disclosure" className="hover:text-foreground transition-colors">
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup with explicit consent */}
          <div>
            <h4 className="font-semibold text-sm mb-3">AI Weekly Digest</h4>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Get the latest curated AI breakthroughs, launches, and workflows delivered to your inbox.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! You are subscribed to AI Weekly.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={!consent}
                    className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium disabled:opacity-50 transition-opacity"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <label className="flex items-start gap-2 text-[11px] text-muted-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span>I agree to receive weekly updates and accept the privacy policy.</span>
                </label>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} AI Hub Directory. Engineered for precision and transparency.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/affiliate-disclosure" className="hover:text-foreground">
              Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { getPackages, getTools, getCategories } from "@/lib/supabase/store";
import { CustomPackageBuilder } from "@/components/custom-package-builder";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  PhoneCall,
  HelpCircle,
  PackageCheck,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Packages & Pricing — ToolsBuy",
  description: "Affordable shared packages for Helium 10, ChatGPT Plus, Jungle Scout, Keepa, Claude Pro, and Midjourney with 1-click cloud access.",
};

export default async function PlansPage() {
  const packages = await getPackages();
  const { tools } = await getTools({ limit: 100, publishedOnly: true });
  const categories = await getCategories();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-slate-950 px-4 sm:px-6 py-20 md:py-28 text-center text-white">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl"></div>
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-emerald-600/15 blur-3xl"></div>

        <div className="relative max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs font-semibold text-emerald-400 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Pick a bundle · Build your own · 24/7 activation
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Choose Your Plan
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Start with our popular ready-made packages, or hand-pick specific AI and Amazon tools for a personalized bundle. Instant cloud access with zero hassle.
          </p>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-20">
        {/* Help Banner */}
        <div className="p-7 sm:p-9 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-card to-card shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-foreground">Not sure which bundle is right for you?</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Message us on WhatsApp. Our support team will guide you to select the best tools for your business or set up custom team licenses at discounted rates.
            </p>
          </div>

          <a
            href="https://wa.me/923127462475"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 text-white dark:bg-emerald-600 dark:text-white font-bold text-sm shadow-sm hover:opacity-90 transition-opacity shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Ready-made Packages */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Curated Bundles
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Ready-Made Packages
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Tested combinations featuring our most requested e-commerce, writing, and design tools at maximum discounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {packages.map((pkg) => {
              const isPopular = pkg.is_popular;
              return (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col rounded-3xl border bg-card p-7 transition-all hover:-translate-y-1 ${
                    isPopular
                      ? "border-emerald-500 shadow-glow ring-2 ring-emerald-500/30"
                      : "border-border shadow-card hover:border-emerald-500/40"
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-600 px-4 py-1 text-xs font-bold text-white shadow-md">
                      Most Popular Choice
                    </span>
                  )}

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-muted-foreground min-h-[32px]">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="mt-5 pb-5 border-b border-border flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-muted-foreground">PKR</span>
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                      {pkg.price_pkr.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">/month</span>
                  </div>

                  {/* Tools List */}
                  <div className="mt-6 flex-1 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Included Tools:
                    </div>
                    {pkg.tools_included.map((toolName, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-sm text-foreground">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="font-medium">{toolName}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Button */}
                  <div className="mt-8 pt-4">
                    <Link
                      href={`/order/checkout?packageId=${pkg.id}&total=${pkg.price_pkr}`}
                      className={`w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm transition-all shadow-sm ${
                        isPopular
                          ? "bg-primary text-primary-foreground hover:opacity-95 shadow-md shadow-primary/25"
                          : "border border-border bg-muted/40 hover:bg-muted text-foreground"
                      }`}
                    >
                      <span>Order Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Custom Package Builder */}
        <section className="pt-8 border-t border-border">
          <CustomPackageBuilder tools={tools} categories={categories} />
        </section>
      </div>
    </div>
  );
}

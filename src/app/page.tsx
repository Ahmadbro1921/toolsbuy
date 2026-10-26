import Link from "next/link";
import { getPackages, getTools, getCurrentUserSession } from "@/lib/supabase/store";
import { HomeFAQ } from "@/components/home-faq";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Clock,
  Headphones,
  SlidersHorizontal,
  ExternalLink,
  MessageCircle,
  Flame,
  Layers,
  Lock,
  Globe2,
} from "lucide-react";

export const metadata = {
  title: "ToolsBuy - All Premium Amazon, AI & SEO Tools in One Subscription",
  description:
    "Get instant 1-click cloud access to Helium 10 Diamond, Jungle Scout, Keepa Pro, ChatGPT Plus, Claude 3.5 Sonnet, Midjourney, Semrush & Canva Pro. Packages starting at PKR 3,500/month with EasyPaisa, JazzCash, Meezan Bank & USDT.",
};

const TOP_TOOLS = [
  { name: "Helium 10 Diamond", cat: "Amazon FBA", badge: "Seller Favorite" },
  { name: "ChatGPT Plus 4o", cat: "AI Superpowers", badge: "GPT-4o & Canvas" },
  { name: "Claude 3.5 Sonnet", cat: "AI Coding & Writing", badge: "Artifacts" },
  { name: "Midjourney v6", cat: "Image Generation", badge: "Fast Hours" },
  { name: "Keepa Pro", cat: "Price Tracking", badge: "Realtime BSR" },
  { name: "Jungle Scout", cat: "Product Research", badge: "Accurate Sales" },
  { name: "Semrush Guru", cat: "SEO & Backlinks", badge: "Competitive Intel" },
  { name: "Canva Pro", cat: "Design & Graphics", badge: "Full Access" },
  { name: "Perplexity Pro", cat: "Research & Citations", badge: "Claude & Sonar" },
  { name: "Freepik Premium", cat: "Assets & Vectors", badge: "Unlimited" },
];

const FEATURES = [
  {
    icon: Zap,
    title: "1-Click Direct Cloud Launch",
    description:
      "Say goodbye to complicated browser extensions and shared passwords. Launch your tools directly from your personal dashboard with isolated session tokens.",
  },
  {
    icon: Clock,
    title: "99.9% Monitored Uptime",
    description:
      "Our automated session guards verify login cookies 24/7 so your work never halts during vital product research, client meetings, or listing launches.",
  },
  {
    icon: Headphones,
    title: "24/7 WhatsApp & Ticket Support",
    description:
      "Our Lahore-based technical support team is available round-the-clock on WhatsApp (+92 312 7462475) and via internal dashboard tickets.",
  },
  {
    icon: ShieldCheck,
    title: "Safe, Private & Virus-Free",
    description:
      "100% clean browser-based sessions. We never require you to download risky executable files, cracked software, or third-party patchers.",
  },
  {
    icon: Lock,
    title: "Easy Local Payment Gateways",
    description:
      "Pay securely using EasyPaisa, JazzCash, Meezan Bank / Raast, or USDT (TRC-20) with automated receipt generation and fast 15-minute activation.",
  },
  {
    icon: Globe2,
    title: "Fair Use & Replacement Guarantee",
    description:
      "We guarantee active access throughout your entire 30-day cycle. If any tool encounters downtime exceeding 24 hours, you receive instant replacement credit.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Choose or Build Your Bundle",
    description:
      "Pick from our best-selling Basic, Standard, or Premium bundles, or use our interactive Custom Builder to pick exact tools.",
  },
  {
    step: "02",
    title: "Pay via EasyPaisa / JazzCash / Bank",
    description:
      "Send payment to our verified business accounts, copy the Transaction ID (TID), and submit your order in under 60 seconds.",
  },
  {
    step: "03",
    title: "1-Click Launch from Dashboard",
    description:
      "Your dashboard unlocks within 10-30 minutes. Click 'Launch Tool' to immediately start using Helium 10, ChatGPT Plus, and more!",
  },
];

export default async function HomePage() {
  const session = await getCurrentUserSession();
  const packages = await getPackages();

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-background hero-glow pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6">
        <div className="container max-w-5xl mx-auto text-center space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold shadow-glow">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Cloud Access · 24/7 WhatsApp Support · 99.9% Uptime</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance">
            All Your Premium <span className="gradient-text">Amazon, AI & SEO Tools</span> In One Subscription
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            Stop paying thousands of dollars every month for Helium 10 Diamond, ChatGPT Plus, Claude 3.5 Sonnet, Midjourney, and Keepa Pro. Get seamless 1-click cloud access starting from just <span className="text-foreground font-bold">PKR 3,500/month</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              href="/plans"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all shadow-glow hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              View Packages (From PKR 3,500)
            </Link>

            <Link
              href="/plans#custom-builder"
              className="w-full sm:w-auto px-7 py-4 rounded-xl border border-border bg-card/80 hover:bg-card text-foreground font-semibold text-base transition-all hover:border-primary/50 flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              Build Custom Bundle
            </Link>

            <a
              href="https://wa.me/923127462475?text=Hello%20ToolsBuy!%20I%20want%20to%20order%20a%20tools%20package."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/25 font-semibold text-base transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Live Chat
            </a>
          </div>

          {/* Trust Highlights Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-border/50 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-card/60 border border-border/60">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">20+</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">Premium Tools Active</div>
            </div>
            <div className="p-4 rounded-2xl bg-card/60 border border-border/60">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">99.9%</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">Guaranteed Uptime</div>
            </div>
            <div className="p-4 rounded-2xl bg-card/60 border border-border/60">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">1-Click</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">Instant Cloud Launch</div>
            </div>
            <div className="p-4 rounded-2xl bg-card/60 border border-border/60">
              <div className="text-2xl sm:text-3xl font-extrabold text-foreground">5,000+</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">Pakistani Sellers & Pros</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Top Tools Running Strip */}
      <section className="py-8 border-y border-border/60 bg-card/40 overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 mb-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Featured in our all-in-one cloud subscriptions
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 sm:px-6 py-2 max-w-7xl mx-auto">
          {TOP_TOOLS.map((tool, idx) => (
            <div
              key={idx}
              className="shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border border-border/70 bg-card hover:border-primary/50 transition-colors shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                {tool.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                  {tool.name}
                </div>
                <div className="text-[11px] text-muted-foreground">{tool.cat}</div>
              </div>
              <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {tool.badge}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Curated Pricing Packages Section */}
      <section className="py-20 px-4 sm:px-6 bg-background relative">
        <div className="container max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Pre-Made Bundles</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Simple, Transparent Pricing in PKR
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Choose the package tailored to your exact business workflow. All plans include 30-day unlimited access, 1-click cloud launch, and 24/7 WhatsApp support.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                  pkg.is_popular
                    ? "border-2 border-primary bg-card shadow-2xl shadow-primary/10 scale-[1.03] z-10"
                    : "border border-border/80 bg-card/60 hover:border-border"
                }`}
              >
                {pkg.is_popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{pkg.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-6 pb-6 border-b border-border/60">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-muted-foreground">PKR</span>
                      <span className="text-4xl font-extrabold text-foreground tracking-tight">
                        {pkg.price_pkr.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">/ month</span>
                    </div>
                    <div className="text-[11px] text-primary font-medium mt-1">
                      Zero hidden charges · 30 Days Full Validity
                    </div>
                  </div>

                  {/* Feature List */}
                  <div className="mt-6 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Included Tools & Benefits:
                    </div>
                    {pkg.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-8 pt-4">
                  <Link
                    href={`/order/checkout?package=${pkg.id}`}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      pkg.is_popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                  >
                    <span>Order {pkg.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <p className="text-[11px] text-center text-muted-foreground mt-2">
                    EasyPaisa · JazzCash · Bank · USDT
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Package Builder Callout */}
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-card p-8 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Need Specific Tools Only?</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                Build Your Own Custom Tool Bundle
              </h3>
              <p className="text-sm text-muted-foreground max-w-xl">
                Choose only the tools you want (e.g. Helium 10 + ChatGPT Plus). Real-time price calculation starting from PKR 700 with automatic combo discounts.
              </p>
            </div>
            <Link
              href="/plans#custom-builder"
              className="shrink-0 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all shadow-glow flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Open Custom Builder
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Why Choose ToolsBuy (Features Grid) */}
      <section className="py-20 px-4 sm:px-6 bg-card/30 border-y border-border/60">
        <div className="container max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">The ToolsBuy Advantage</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Why 5,000+ Pakistani Sellers & Creatives Choose Us
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Engineered for seamless reliability, bank-grade account security, and zero disruption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/70 bg-card p-6 space-y-3 hover:border-primary/40 transition-colors shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. How It Works (3 Steps) */}
      <section className="py-20 px-4 sm:px-6 bg-background">
        <div className="container max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Get Started in 3 Easy Steps
            </h2>
            <p className="text-sm text-muted-foreground">
              From checkout to cloud tool launch in less than 15 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-border/70 bg-card p-6 space-y-4"
              >
                <div className="text-4xl font-black text-primary/30 tracking-tight">{s.step}</div>
                <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/plans"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all shadow-glow"
            >
              <span>Explore Packages & Start</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Interactive FAQ Accordion */}
      <section className="py-20 px-4 sm:px-6 bg-card/20 border-t border-border/60">
        <div className="container max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Got Questions?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Everything you need to know about our subscriptions, 1-click cloud access, and payment verification.
            </p>
          </div>

          <HomeFAQ />

          <div className="text-center pt-4 text-xs sm:text-sm text-muted-foreground">
            Still have questions?{" "}
            <a
              href="https://wa.me/923127462475"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              Chat directly with our Lahore support team on WhatsApp (+92 312 7462475)
            </a>
          </div>
        </div>
      </section>

      {/* 7. Bottom High-Converting WhatsApp CTA Banner */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-card to-background border-t border-border/60">
        <div className="container max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Ready to Supercharge Your Business with ToolsBuy?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Join thousands of Amazon FBA sellers, digital agencies, and AI developers saving thousands of dollars every month. Instant activation available 24/7.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/plans"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm sm:text-base hover:bg-primary/90 transition-all shadow-glow"
            >
              Order Online Now
            </Link>
            <a
              href="https://wa.me/923127462475?text=Hello%20ToolsBuy!%20I%20want%20to%20order%20now."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold text-sm sm:text-base hover:bg-emerald-500 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Order via WhatsApp (+92 312 7462475)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

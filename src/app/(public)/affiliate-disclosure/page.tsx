import { Metadata } from "next";
import { Info, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Affiliate & Advertising Disclosure — AI Hub",
  description: "Transparency statement regarding affiliate links, sponsorships, and monetization policy on AI Hub.",
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-sm">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Transparency Policy</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Affiliate Disclosure</h1>
        <p className="text-xs text-muted-foreground">Compliance with FTC Guidelines & Directory Integrity</p>
      </div>

      <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex items-start gap-3 text-xs leading-relaxed">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p>
          At AI Hub, transparency is paramount. We believe in providing clear, uncompromised information to our community of developers, creators, and researchers.
        </p>
      </div>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Affiliate Links</h2>
          <p>
            Some of the external links on AI Hub may be affiliate referral links. This means that if you click on a link and subsequently sign up for or purchase a paid subscription with that third-party software provider, AI Hub may receive a referral commission at no additional cost to you.
          </p>
          <p>
            Our editorial ratings, categories, and technical descriptions are determined independently by our team and our objective criteria, never influenced by affiliate partnerships.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. Sponsored Placements</h2>
          <p>
            If a tool or service is featured as a result of a promotional or sponsored arrangement, it will always be explicitly labeled with a "Sponsored" tag. We do not disguise paid advertising as organic recommendations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. Free-First Architecture</h2>
          <p>
            AI Hub is completely free to search, browse, and bookmark. We do not gate essential directory features behind paywalls or require users to purchase premium subscriptions to find the best AI tools.
          </p>
        </section>
      </div>
    </div>
  );
}

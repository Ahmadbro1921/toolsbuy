import { Metadata } from "next";
import { getTools, getCategories } from "@/lib/supabase/store";
import { PricingPlansSection } from "@/components/pricing-plans";
import { CustomPackageBuilder } from "@/components/custom-package-builder";
import {
  PhoneCall,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Packages & Pricing — ToolsBuy",
  description: "Affordable shared packages for Helium 10, ChatGPT Plus, Jungle Scout, Keepa, Claude Pro, and Midjourney with 1-click cloud access.",
};

export default async function PlansPage() {
  const { tools } = await getTools({ limit: 100, publishedOnly: true });
  const categories = await getCategories();

  return (
    <div className="flex flex-col min-h-screen">
      {/* User's Exact Pricing Plans Component with Monthly/Yearly Toggle */}
      <PricingPlansSection />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 pb-20 space-y-16">
        {/* Help Banner */}
        <div className="p-7 sm:p-9 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-card to-card shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-foreground">Not sure which bundle is right for you?</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Message us on WhatsApp. Our support team will guide you to select the best tools for your business or set up custom team licenses at discounted rates.
            </p>
          </div>

          <a
            href="https://wa.me/923127462475?text=Hello%20ToolsBuy!%20I%20need%20help%20choosing%20a%20plan."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Chat on WhatsApp (+92 312 7462475)</span>
          </a>
        </div>

        {/* Custom Package Builder */}
        <section id="custom-builder" className="pt-8 border-t border-border">
          <CustomPackageBuilder tools={tools} categories={categories} />
        </section>
      </div>
    </div>
  );
}

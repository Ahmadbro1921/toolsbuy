import { Metadata } from "next";
import { Sparkles, Shield, Target, Users, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About AI Hub — Mission, Standards & Architecture",
  description: "Learn how AI Hub independently evaluates, reviews, and indexes artificial intelligence tools and models.",
};

export default function AboutPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">About AI Hub</h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          AI Hub was created to bring clarity, transparency, and engineering rigor to the explosive growth of artificial intelligence software.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg">Our Mission</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            To provide builders, creators, and teams with an unbiased, transparent repository of AI solutions, preventing vendor lock-in and identifying genuinely effective models.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg">No Fabricated Metrics</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We never fabricate user reviews, synthetic star ratings, or popularity metrics. Listings reflect verified provider specifications and authentic community engagement.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl border border-border/80 bg-card space-y-4">
        <h2 className="text-xl font-bold">Review Methodology</h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Every tool indexed in AI Hub undergoes a review-before-publish workflow. Administrators inspect official URLs, verify API and pricing limitations, document external account requirements, and assign objective technical tags.
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          External tool listings explicitly distinguish external web links from direct API integrations, ensuring users always know exactly how their tools connect.
        </p>
      </div>
    </div>
  );
}

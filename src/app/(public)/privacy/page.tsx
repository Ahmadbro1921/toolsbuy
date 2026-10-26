import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — AI Hub",
  description: "Learn how AI Hub handles user information, bookmarks, outbound clicks, and analytics transparently.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-sm">
      <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
      <p className="text-xs text-muted-foreground">Effective Date: October 2026</p>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Information We Collect</h2>
          <p>
            When you register for an account on AI Hub, we store your email address, display name, and optional avatar URL securely in our authentication database. We do not store plain-text passwords.
          </p>
          <p>
            When you interact with directory listings, we record anonymized click events to calculate aggregated popularity metrics. We do not sell or expose your private tool browsing history to third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. External Links & Third-Party Services</h2>
          <p>
            AI Hub indexes external third-party software products. When you click "Open Tool" or "Visit Website", you are directed to that provider's official domain. Third-party sites are governed by their respective privacy policies and terms of service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. AI Provider Usage</h2>
          <p>
            AI Hub integrates modular artificial intelligence provider adapters (e.g. Google Gemini, OpenAI) strictly for editorial content generation (such as tool description drafts and tag proposals). User personal data is never transmitted to AI model providers without express notice.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">4. Cookies & Security</h2>
          <p>
            We use secure HTTP-only cookies solely for session maintenance and authentication state. You can revoke your session at any time by logging out.
          </p>
        </section>
      </div>
    </div>
  );
}

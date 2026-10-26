import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — AI Hub",
  description: "Terms and conditions governing the use of the AI Hub platform and directory.",
};

export default function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-sm">
      <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
      <p className="text-xs text-muted-foreground">Effective Date: October 2026</p>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using AI Hub, you agree to comply with and be bound by these Terms of Service. If you do not agree, you must discontinue use immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. Directory Content & Accuracy</h2>
          <p>
            AI Hub operates as a discovery catalog. While we strive to verify pricing tiers, capabilities, and website links, third-party software vendors may update their pricing, terms, or availability without notice. AI Hub does not warrant the continuous accuracy of external listings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. User Conduct</h2>
          <p>
            You agree not to abuse directory endpoints, execute distributed denial-of-service attempts, attempt unauthorized privilege escalation to administrator roles, or scrape content in violation of rate limits.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">4. Account Status & Termination</h2>
          <p>
            Administrators reserve the right to suspend or terminate accounts that violate community safety rules or engage in abuse.
          </p>
        </section>
      </div>
    </div>
  );
}

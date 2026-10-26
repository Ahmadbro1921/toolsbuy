import { Metadata } from "next";
import { Mail, MessageSquare, ShieldAlert } from "lucide-react";
import { getSiteSettings } from "@/lib/supabase/store";

export const metadata: Metadata = {
  title: "Contact AI Hub — Support & Tool Submission Inquiries",
  description: "Get in touch with the AI Hub editorial team, submit a new tool for review, or report an outdated listing.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="container max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Contact Us</h1>
        <p className="text-sm text-muted-foreground">
          Have an inquiry, feedback, or a question about a listed AI tool? Reach out to our directory team.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-2">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-sm">Direct Email</h3>
          <p className="text-xs text-muted-foreground">General support and platform operations:</p>
          <a
            href={`mailto:${settings.contact.email}`}
            className="text-xs font-semibold text-primary hover:underline block pt-1"
          >
            {settings.contact.email}
          </a>
        </div>

        <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-sm">Listing Corrections</h3>
          <p className="text-xs text-muted-foreground">Notice outdated pricing or URL changes?</p>
          <span className="text-xs text-foreground font-medium block pt-1">
            corrections@aihub.local
          </span>
        </div>
      </div>

      <div className="p-8 rounded-3xl border border-border/80 bg-card space-y-4">
        <h2 className="text-lg font-bold">Submitting a Tool</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          If you are an AI developer or product team looking to have your tool reviewed, please verify that your service has a working public endpoint, accurate pricing documentation, and functional documentation. AI Hub will never charge to review legitimate applications.
        </p>
      </div>
    </div>
  );
}

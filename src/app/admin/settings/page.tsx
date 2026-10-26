import { getSiteSettings } from "@/lib/supabase/store";
import {
  updateBrandingSettingsAction,
  updateFeatureSettingsAction,
  updateContactSettingsAction,
  updateSeoSettingsAction,
} from "@/lib/actions/settings";
import {
  Settings,
  Sparkles,
  Mail,
  Shield,
  Key,
  Globe,
  Sliders,
  CheckCircle,
} from "lucide-react";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider">
          <Settings className="w-3.5 h-3.5" />
          <span>Platform Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
          Site & Integration Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Configure branding, administrator alert emails, AI provider connectivity, and policy switches.
        </p>
      </div>

      {/* Security Architecture Notice */}
      <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex items-start gap-3 text-xs leading-relaxed">
        <Key className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-muted-foreground">
          <strong>Security Architecture:</strong> Persistent API keys (Gemini, OpenAI, Resend, Supabase Service Role) are loaded strictly via server-side environment configurations (<code className="text-foreground">.env.local</code> / hosting env) to prevent secret leakage in public database settings.
        </p>
      </div>

      {/* Section 1: Branding */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card space-y-4 shadow-sm">
        <h3 className="font-bold text-base flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" /> Website Name & Branding
        </h3>

        <form action={updateBrandingSettingsAction} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Site Name</label>
              <input
                type="text"
                name="name"
                defaultValue={settings.branding.name}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Tagline</label>
              <input
                type="text"
                name="tagline"
                defaultValue={settings.branding.tagline}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Meta Description</label>
            <textarea
              name="description"
              rows={2}
              defaultValue={settings.branding.description}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90"
            >
              Save Branding
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Contact & Administrator Alerts */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card space-y-4 shadow-sm">
        <h3 className="font-bold text-base flex items-center gap-2">
          <Mail className="w-4 h-4 text-cyan-500" /> Notifications & Communications
        </h3>

        <form action={updateContactSettingsAction} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Public Support Email</label>
              <input
                type="email"
                name="email"
                defaultValue={settings.contact.email}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Admin Notification Email *</label>
              <input
                type="email"
                name="adminNotificationEmail"
                required
                defaultValue={settings.contact.adminNotificationEmail}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Receives pending user activation requests and security notifications.
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90"
            >
              Save Notification Addresses
            </button>
          </div>
        </form>
      </div>

      {/* Section 3: Feature Switches & Policies */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card space-y-4 shadow-sm">
        <h3 className="font-bold text-base flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-500" /> Platform Policies & Feature Toggles
        </h3>

        <form action={updateFeatureSettingsAction} className="space-y-4 text-xs">
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border cursor-pointer select-none">
              <input
                type="checkbox"
                name="requireManualApproval"
                value="true"
                defaultChecked={settings.features.requireManualApproval}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <div>
                <span className="font-bold block text-foreground">Require Manual Administrator Approval for Signups</span>
                <span className="text-muted-foreground text-[11px] leading-relaxed">
                  When enabled, verified email users remain in 'pending' status until reviewed in /admin/users. An alert is emailed to the admin.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border cursor-pointer select-none">
              <input
                type="checkbox"
                name="allowRegistration"
                value="true"
                defaultChecked={settings.features.allowRegistration}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <div>
                <span className="font-bold block text-foreground">Allow Public Member Registration</span>
                <span className="text-muted-foreground text-[11px] leading-relaxed">
                  Enables public visitors to create personal bookmarks and track history.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border cursor-pointer select-none">
              <input
                type="checkbox"
                name="showAffiliateDisclosures"
                value="true"
                defaultChecked={settings.features.showAffiliateDisclosures}
                className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <div>
                <span className="font-bold block text-foreground">Display Visible Affiliate Disclosures</span>
                <span className="text-muted-foreground text-[11px] leading-relaxed">
                  Ensures FTC compliance and directory transparency on all outbound listings.
                </span>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90"
            >
              Update Policy Toggles
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

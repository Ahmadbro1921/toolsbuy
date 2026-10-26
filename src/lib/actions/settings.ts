"use server";

import { revalidatePath } from "next/cache";
import {
  updateSiteSettings,
  getCurrentUserSession,
} from "@/lib/supabase/store";

async function assertAdmin() {
  const session = await getCurrentUserSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized: Administrator permissions required.");
  }
  return session;
}

export async function updateBrandingSettingsAction(formData: FormData): Promise<void> {
  const admin = await assertAdmin();

  const branding = {
    name: (formData.get("name") as string) || "AI Hub",
    tagline: (formData.get("tagline") as string) || "Discover the Best AI Tools",
    description: (formData.get("description") as string) || "",
    logo_url: (formData.get("logo_url") as string) || "",
  };

  await updateSiteSettings("branding", branding, admin.id);
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function updateFeatureSettingsAction(formData: FormData): Promise<void> {
  const admin = await assertAdmin();

  const features = {
    allowRegistration: formData.get("allowRegistration") === "true",
    requireManualApproval: formData.get("requireManualApproval") === "true",
    enableReviews: formData.get("enableReviews") === "true",
    showAffiliateDisclosures: formData.get("showAffiliateDisclosures") === "true",
    maintenanceMode: formData.get("maintenanceMode") === "true",
  };

  await updateSiteSettings("features", features, admin.id);
  revalidatePath("/admin/settings");
}

export async function updateContactSettingsAction(formData: FormData): Promise<void> {
  const admin = await assertAdmin();

  const contact = {
    email: (formData.get("email") as string) || "support@aihub.local",
    adminNotificationEmail: (formData.get("adminNotificationEmail") as string) || "admin@aihub.local",
    twitter: (formData.get("twitter") as string) || "",
    github: (formData.get("github") as string) || "",
  };

  await updateSiteSettings("contact", contact, admin.id);
  revalidatePath("/admin/settings");
}

export async function updateSeoSettingsAction(formData: FormData): Promise<void> {
  const admin = await assertAdmin();

  const seo = {
    defaultTitle: (formData.get("defaultTitle") as string) || "AI Hub — Premier AI Tools Directory",
    defaultDescription: (formData.get("defaultDescription") as string) || "",
  };

  await updateSiteSettings("seo", seo, admin.id);
  revalidatePath("/admin/settings");
}

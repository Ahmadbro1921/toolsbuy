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
    defaultTitle: (formData.get("defaultTitle") as string) || "ToolsBuy — Amazon & AI Tools",
    defaultDescription: (formData.get("defaultDescription") as string) || "",
  };

  await updateSiteSettings("seo", seo, admin.id);
  revalidatePath("/admin/settings");
}

export async function updatePaymentSettingsAction(formData: FormData): Promise<void> {
  const admin = await assertAdmin();

  const payments = {
    bank_name: (formData.get("bank_name") as string)?.trim() || "Meezan Bank Limited",
    account_title: (formData.get("account_title") as string)?.trim() || "ToolsBuy Official",
    account_number: (formData.get("account_number") as string)?.trim() || "",
    iban: (formData.get("iban") as string)?.trim() || "",
    easypaisa_title: (formData.get("easypaisa_title") as string)?.trim() || "ToolsBuy Official",
    easypaisa_number: (formData.get("easypaisa_number") as string)?.trim() || "",
    jazzcash_title: (formData.get("jazzcash_title") as string)?.trim() || "ToolsBuy Official",
    jazzcash_number: (formData.get("jazzcash_number") as string)?.trim() || "",
    usdt_address: (formData.get("usdt_address") as string)?.trim() || "",
  };

  await updateSiteSettings("payments", payments, admin.id);
  revalidatePath("/admin/settings");
  revalidatePath("/order/checkout");
}


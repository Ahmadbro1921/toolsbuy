"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserSession, savePackage, deletePackage, extendSubscription } from "@/lib/supabase/store";
import { Package } from "@/types";

export async function savePackageAction(formData: FormData) {
  const session = await getCurrentUserSession();
  if (session?.role !== "admin") {
    return { error: "Unauthorized." };
  }

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const badge = (formData.get("badge") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const pricePkr = parseInt(formData.get("pricePkr") as string, 10);
  const durationDays = parseInt(formData.get("durationDays") as string, 10) || 30;
  const isPopular = formData.get("isPopular") === "true" || formData.get("isPopular") === "on";
  const isActive = formData.get("isActive") !== "false";
  const toolsIncludedRaw = (formData.get("toolsIncluded") as string)?.trim() || "";
  const featuresRaw = (formData.get("features") as string)?.trim() || "";

  if (!name || isNaN(pricePkr)) {
    return { error: "Name and valid PKR price are required." };
  }

  const toolsIncluded = toolsIncludedRaw
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);

  const features = featuresRaw
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);

  await savePackage({
    id: id || undefined,
    name,
    badge,
    description,
    price_pkr: pricePkr,
    duration_days: durationDays,
    is_popular: isPopular,
    is_active: isActive,
    tools_included: toolsIncluded,
    features,
  });

  revalidatePath("/plans");
  revalidatePath("/pricing");
  revalidatePath("/admin/packages");
  revalidatePath("/");

  return { success: true };
}

export async function deletePackageAction(id: string) {
  const session = await getCurrentUserSession();
  if (session?.role !== "admin") {
    return { error: "Unauthorized." };
  }

  await deletePackage(id);
  revalidatePath("/plans");
  revalidatePath("/admin/packages");
  return { success: true };
}

export async function extendSubscriptionAction(subscriptionId: string, daysToAdd: number) {
  const session = await getCurrentUserSession();
  if (session?.role !== "admin") {
    return { error: "Unauthorized." };
  }

  await extendSubscription(subscriptionId, daysToAdd);
  revalidatePath("/admin/subscriptions");
  revalidatePath("/dashboard");
  return { success: true };
}

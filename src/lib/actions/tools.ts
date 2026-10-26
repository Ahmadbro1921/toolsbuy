"use server";

import { revalidatePath } from "next/cache";
import { toolSchema } from "@/lib/validations/tool";
import {
  createTool,
  updateTool,
  deleteTool,
  getCurrentUserSession,
  createAuditLog,
} from "@/lib/supabase/store";
import { validateSafeUrl } from "@/lib/security/ssrf";

async function assertAdmin() {
  const session = await getCurrentUserSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized: Administrator permissions required.");
  }
  return session;
}

export async function createToolAction(prevState: any, formData: FormData) {
  const admin = await assertAdmin();

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    logo_url: formData.get("logo_url") as string,
    official_url: formData.get("official_url") as string,
    category_id: formData.get("category_id") as string,
    pricing_type: formData.get("pricing_type") as any,
    tags: ((formData.get("tags") as string) || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    is_featured: formData.get("is_featured") === "true",
    is_published: formData.get("is_published") === "true",
    integration_mode: (formData.get("integration_mode") as any) || "external_link",
    external_account_required: formData.get("external_account_required") === "true",
    features: ((formData.get("features") as string) || "")
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean),
    use_cases: ((formData.get("use_cases") as string) || "")
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean),
  };

  // SSRF check on official URL
  const ssrfCheck = validateSafeUrl(raw.official_url);
  if (!ssrfCheck.isValid) {
    return { error: `Invalid official URL: ${ssrfCheck.reason}` };
  }

  const validated = toolSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Validation failed." };
  }

  const newTool = await createTool(validated.data as any);
  await createAuditLog(admin.id, "tool_created", "tool", newTool.id, {
    toolName: newTool.name,
    slug: newTool.slug,
  });

  revalidatePath("/tools");
  revalidatePath("/admin/tools");
  return { success: true, tool: newTool };
}

export async function updateToolAction(id: string, prevState: any, formData: FormData) {
  const admin = await assertAdmin();

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    logo_url: formData.get("logo_url") as string,
    official_url: formData.get("official_url") as string,
    category_id: formData.get("category_id") as string,
    pricing_type: formData.get("pricing_type") as any,
    tags: ((formData.get("tags") as string) || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    is_featured: formData.get("is_featured") === "true",
    is_published: formData.get("is_published") === "true",
    integration_mode: (formData.get("integration_mode") as any) || "external_link",
    external_account_required: formData.get("external_account_required") === "true",
    features: ((formData.get("features") as string) || "")
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean),
    use_cases: ((formData.get("use_cases") as string) || "")
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean),
  };

  const ssrfCheck = validateSafeUrl(raw.official_url);
  if (!ssrfCheck.isValid) {
    return { error: `Invalid official URL: ${ssrfCheck.reason}` };
  }

  const validated = toolSchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Validation failed." };
  }

  const updated = await updateTool(id, validated.data as any);
  await createAuditLog(admin.id, "tool_updated", "tool", id, { toolName: updated?.name });

  revalidatePath("/tools");
  revalidatePath("/admin/tools");
  return { success: true, tool: updated };
}

export async function deleteToolAction(id: string) {
  const admin = await assertAdmin();
  await deleteTool(id);
  await createAuditLog(admin.id, "tool_deleted", "tool", id);

  revalidatePath("/tools");
  revalidatePath("/admin/tools");
  return { success: true };
}

export async function toggleToolPublishedAction(id: string, isPublished: boolean) {
  const admin = await assertAdmin();
  await updateTool(id, { is_published: isPublished });
  await createAuditLog(admin.id, "tool_publish_toggle", "tool", id, { is_published: isPublished });

  revalidatePath("/tools");
  revalidatePath("/admin/tools");
  return { success: true };
}

export async function toggleToolFeaturedAction(id: string, isFeatured: boolean) {
  const admin = await assertAdmin();
  await updateTool(id, { is_featured: isFeatured });
  await createAuditLog(admin.id, "tool_featured_toggle", "tool", id, { is_featured: isFeatured });

  revalidatePath("/tools");
  revalidatePath("/admin/tools");
  return { success: true };
}

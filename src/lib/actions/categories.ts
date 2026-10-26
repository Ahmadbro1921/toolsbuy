"use server";

import { revalidatePath } from "next/cache";
import { categorySchema } from "@/lib/validations/category";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCurrentUserSession,
  createAuditLog,
} from "@/lib/supabase/store";

async function assertAdmin() {
  const session = await getCurrentUserSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized: Administrator permissions required.");
  }
  return session;
}

export async function createCategoryAction(prevState: any, formData: FormData) {
  const admin = await assertAdmin();

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || "",
    icon: (formData.get("icon") as string) || "Sparkles",
  };

  const validated = categorySchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Validation failed." };
  }

  const newCat = await createCategory(validated.data);
  await createAuditLog(admin.id, "category_created", "category", newCat.id, {
    categoryName: newCat.name,
    slug: newCat.slug,
  });

  revalidatePath("/categories");
  revalidatePath("/admin/categories");
  return { success: true, category: newCat };
}

export async function updateCategoryAction(id: string, prevState: any, formData: FormData) {
  const admin = await assertAdmin();

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || "",
    icon: (formData.get("icon") as string) || "Sparkles",
  };

  const validated = categorySchema.safeParse(raw);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Validation failed." };
  }

  const updated = await updateCategory(id, validated.data);
  await createAuditLog(admin.id, "category_updated", "category", id, { categoryName: updated?.name });

  revalidatePath("/categories");
  revalidatePath("/admin/categories");
  return { success: true, category: updated };
}

export async function deleteCategoryAction(id: string, reassignCategoryId?: string) {
  const admin = await assertAdmin();
  await deleteCategory(id, reassignCategoryId);
  await createAuditLog(admin.id, "category_deleted", "category", id, { reassignCategoryId });

  revalidatePath("/categories");
  revalidatePath("/admin/categories");
  return { success: true };
}

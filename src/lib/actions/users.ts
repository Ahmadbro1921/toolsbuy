"use server";

import { revalidatePath } from "next/cache";
import {
  updateUserStatus,
  updateActivationRequest,
  getCurrentUserSession,
  getUsersList,
  createAuditLog,
} from "@/lib/supabase/store";
import { getEmailProvider } from "@/lib/email/factory";
import {
  getAccountApprovedEmailHtml,
  getAccountSuspendedEmailHtml,
} from "@/lib/email/templates";

async function assertAdmin() {
  const session = await getCurrentUserSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized: Administrator permissions required.");
  }
  return session;
}

export async function updateUserStatusAction(userId: string, newStatus: "active" | "pending" | "suspended", reason?: string) {
  const admin = await assertAdmin();
  const success = await updateUserStatus(userId, newStatus, admin.id);
  if (!success) {
    return { error: "User not found or status update failed." };
  }

  // Find user to notify
  const users = await getUsersList();
  const target = users.find((u) => u.id === userId);

  if (target && target.email) {
    const emailService = getEmailProvider();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (newStatus === "active") {
      await emailService.sendEmail({
        to: target.email,
        subject: "[AI Hub] Your account has been activated!",
        html: getAccountApprovedEmailHtml(target.display_name, appUrl),
      });
    } else if (newStatus === "suspended") {
      await emailService.sendEmail({
        to: target.email,
        subject: "[AI Hub] Account status alert: Suspended",
        html: getAccountSuspendedEmailHtml(target.display_name, reason),
      });
    }
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function reviewActivationRequestAction(
  requestId: string,
  targetUserId: string,
  targetEmail: string,
  targetName: string,
  decision: "approved" | "rejected"
) {
  const admin = await assertAdmin();
  const success = await updateActivationRequest(requestId, decision, admin.id);
  if (!success) {
    return { error: "Failed to process activation request." };
  }

  const emailService = getEmailProvider();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (decision === "approved") {
    await emailService.sendEmail({
      to: targetEmail,
      subject: "[AI Hub] Your Account Has Been Approved!",
      html: getAccountApprovedEmailHtml(targetName, appUrl),
    });
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { success: true };
}

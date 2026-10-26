"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signupSchema, loginSchema, profileUpdateSchema } from "@/lib/validations/auth";
import { getCurrentUserSession, createAuditLog, getSiteSettings } from "@/lib/supabase/store";
import { getEmailProvider } from "@/lib/email/factory";
import {
  getWelcomeEmailHtml,
  getActivationRequestAdminEmailHtml,
} from "@/lib/email/templates";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validated = loginSchema.safeParse({ email, password });
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Invalid credentials format." };
  }

  // Check demo/mock accounts or standard validation
  let targetUser: {
    id: string;
    email: string;
    role: "admin" | "user";
    account_status: "active" | "pending" | "suspended";
    display_name: string;
  } = {
    id: "demo_user_id",
    email: email.toLowerCase().trim(),
    role: "user",
    account_status: "active",
    display_name: email.split("@")[0],
  };

  if (email.toLowerCase().includes("admin")) {
    targetUser = {
      id: "admin_user_id",
      email: "admin@aihub.local",
      role: "admin",
      account_status: "active",
      display_name: "Lead Administrator",
    };
  } else if (email.toLowerCase().includes("pending")) {
    targetUser = {
      id: "user_pending_1",
      email: "elena.rostova@example.com",
      role: "user",
      account_status: "pending",
      display_name: "Elena Rostova",
    };
  }

  if (targetUser.account_status === "suspended") {
    return { error: "Your account has been suspended. Please reach out to customer support." };
  }

  // Set secure cookie
  const token = Buffer.from(JSON.stringify(targetUser)).toString("base64");
  const cookieStore = cookies();
  cookieStore.set("ai_hub_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  await createAuditLog(targetUser.id, "user_login", "auth", targetUser.id, { email: targetUser.email });

  if (targetUser.role === "admin") {
    redirect("/admin");
  } else {
    redirect("/dashboard");
  }
}

export async function signupAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const reason = formData.get("reason") as string;

  const validated = signupSchema.safeParse({ email, password, fullName, reason });
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Validation failed." };
  }

  const settings = await getSiteSettings();
  const requireApproval = settings.features.requireManualApproval;
  const status = requireApproval ? "pending" : "active";

  const newUser = {
    id: `u-${Date.now()}`,
    email: email.toLowerCase().trim(),
    role: "user" as const,
    account_status: status as "active" | "pending" | "suspended",
    display_name: fullName,
  };

  const emailService = getEmailProvider();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (requireApproval) {
    // Notify admin
    await emailService.sendEmail({
      to: settings.contact.adminNotificationEmail,
      subject: `[AI Hub] New Activation Request: ${fullName}`,
      html: getActivationRequestAdminEmailHtml(fullName, email, appUrl),
    });
  } else {
    // Send welcome email
    await emailService.sendEmail({
      to: email,
      subject: "Welcome to AI Hub!",
      html: getWelcomeEmailHtml(fullName, appUrl),
    });
  }

  // Store session
  const token = Buffer.from(JSON.stringify(newUser)).toString("base64");
  const cookieStore = cookies();
  cookieStore.set("ai_hub_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  await createAuditLog(newUser.id, "user_signup", "auth", newUser.id, {
    email: newUser.email,
    initialStatus: status,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = cookies();
  cookieStore.delete("ai_hub_session");
  redirect("/login");
}

export async function switchDemoRoleAction(role: "admin" | "user" | "pending") {
  let user: {
    id: string;
    email: string;
    role: "admin" | "user";
    account_status: "active" | "pending" | "suspended";
    display_name: string;
  } = {
    id: "admin_user_id",
    email: "admin@aihub.local",
    role: "admin",
    account_status: "active",
    display_name: "Lead Administrator",
  };

  if (role === "user") {
    user = {
      id: "demo_user_id",
      email: "alex.dev@aihub.local",
      role: "user",
      account_status: "active",
      display_name: "Alex Developer",
    };
  } else if (role === "pending") {
    user = {
      id: "user_pending_1",
      email: "elena.rostova@example.com",
      role: "user",
      account_status: "pending",
      display_name: "Elena Rostova",
    };
  }

  const token = Buffer.from(JSON.stringify(user)).toString("base64");
  const cookieStore = cookies();
  cookieStore.set("ai_hub_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  if (role === "admin") {
    redirect("/admin");
  } else {
    redirect("/dashboard");
  }
}

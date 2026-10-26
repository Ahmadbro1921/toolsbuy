"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserSession, createSupportTicket, addTicketMessage, updateTicketStatus } from "@/lib/supabase/store";
import { TicketCategory, TicketStatus } from "@/types";

export async function createTicketAction(formData: FormData) {
  const session = await getCurrentUserSession();
  const subject = (formData.get("subject") as string)?.trim();
  const category = (formData.get("category") as TicketCategory) || "general";
  const message = (formData.get("message") as string)?.trim();
  const email = (formData.get("email") as string)?.trim() || session?.email || "guest@toolsbuy.com";

  if (!subject || !message) {
    return { error: "Subject and message are required." };
  }

  const userId = session?.id || `guest-${Date.now()}`;
  const ticket = await createSupportTicket({
    userId,
    userEmail: email,
    subject,
    category,
    initialMessage: message,
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin/tickets");

  return { success: true, ticketNumber: ticket.ticket_number };
}

export async function replyTicketAction(ticketId: string, message: string) {
  const session = await getCurrentUserSession();
  if (!message?.trim()) {
    return { error: "Message cannot be empty." };
  }

  const sender: "user" | "admin" = session?.role === "admin" ? "admin" : "user";
  const senderName = session?.display_name || (sender === "admin" ? "ToolsBuy Support" : "User");

  const ticket = await addTicketMessage(ticketId, {
    sender,
    sender_name: senderName,
    message: message.trim(),
  });

  if (!ticket) {
    return { error: "Ticket not found." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin/tickets");

  return { success: true };
}

export async function updateTicketStatusAction(ticketId: string, status: TicketStatus) {
  const session = await getCurrentUserSession();
  if (session?.role !== "admin") {
    return { error: "Unauthorized." };
  }

  await updateTicketStatus(ticketId, status);
  revalidatePath("/admin/tickets");
  revalidatePath("/dashboard");

  return { success: true };
}

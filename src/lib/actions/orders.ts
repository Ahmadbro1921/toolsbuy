"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserSession, createOrder, updateOrderStatus, getOrderById } from "@/lib/supabase/store";
import { OrderStatus, PaymentMethod } from "@/types";

export async function placeOrderAction(formData: FormData) {
  const session = await getCurrentUserSession();
  
  const customerName = (formData.get("customerName") as string)?.trim();
  const customerPhone = (formData.get("customerPhone") as string)?.trim();
  const customerEmail = (formData.get("customerEmail") as string)?.trim() || session?.email;
  const orderType = (formData.get("type") as "package" | "custom") || "package";
  const packageId = formData.get("packageId") as string;
  const packageName = formData.get("packageName") as string;
  const paymentMethod = (formData.get("paymentMethod") as PaymentMethod) || "easypaisa";
  const transactionId = (formData.get("transactionId") as string)?.trim();
  const paymentProofNote = (formData.get("paymentProofNote") as string)?.trim();
  const totalAmountPkr = parseInt(formData.get("totalAmountPkr") as string, 10);
  const customToolsRaw = formData.get("customToolsJson") as string;

  if (!customerName || !customerPhone || !customerEmail) {
    return { error: "Please fill in your name, phone/WhatsApp number, and email address." };
  }

  if (!transactionId) {
    return { error: "Please enter the Transaction ID / Reference code from your payment." };
  }

  if (isNaN(totalAmountPkr) || totalAmountPkr <= 0) {
    return { error: "Invalid order amount." };
  }

  let customTools = undefined;
  if (customToolsRaw) {
    try {
      customTools = JSON.parse(customToolsRaw);
    } catch (e) {
      // ignore
    }
  }

  const userId = session?.id || `guest-${Date.now()}`;

  const order = await createOrder({
    userId,
    userEmail: customerEmail,
    customerName,
    customerPhone,
    type: orderType,
    packageId: packageId || undefined,
    packageName: packageName || (orderType === "custom" ? "Custom Selected Bundle" : undefined),
    customTools,
    totalAmountPkr,
    paymentMethod,
    transactionId,
    paymentProofNote,
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin/orders");
  revalidatePath("/admin");

  return { success: true, orderNumber: order.order_number, orderId: order.id };
}

export async function verifyOrderAction(orderId: string) {
  const session = await getCurrentUserSession();
  if (session?.role !== "admin") {
    return { error: "Unauthorized. Admin privileges required." };
  }

  const updated = await updateOrderStatus(orderId, "verified", session.id);
  if (!updated) {
    return { error: "Order not found." };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  revalidatePath("/dashboard");

  return { success: true, message: `Order #${updated.order_number} verified and subscription activated!` };
}

export async function rejectOrderAction(orderId: string, reason: string) {
  const session = await getCurrentUserSession();
  if (session?.role !== "admin") {
    return { error: "Unauthorized. Admin privileges required." };
  }

  const updated = await updateOrderStatus(orderId, "rejected", session.id, reason);
  if (!updated) {
    return { error: "Order not found." };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  revalidatePath("/dashboard");

  return { success: true, message: `Order #${updated.order_number} rejected.` };
}

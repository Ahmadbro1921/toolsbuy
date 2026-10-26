import { getOrders } from "@/lib/supabase/store";
import { OrdersClient } from "./orders-client";
import { CreditCard, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Orders & Payments Verification - ToolsBuy Admin",
  description: "Verify EasyPaisa, JazzCash, Meezan Bank, and USDT payments and activate subscriptions.",
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-primary" />
            Orders & Payment Verifications
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review incoming manual payments (EasyPaisa, JazzCash, Meezan Bank, USDT). One click verifies the payment and instantly activates the user's 30-day subscription.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 animate-bounce" />
            <span>{pendingCount} Pending Payment{pendingCount > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      <OrdersClient initialOrders={orders} />
    </div>
  );
}

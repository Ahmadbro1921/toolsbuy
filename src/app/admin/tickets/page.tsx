import { getSupportTickets } from "@/lib/supabase/store";
import { AdminTicketsClient } from "./tickets-client";
import { MessageSquare } from "lucide-react";

export const metadata = {
  title: "Support Tickets - ToolsBuy Admin",
  description: "Reply to customer support tickets, resolve tool session issues, and manage inquiries.",
};

export default async function AdminTicketsPage() {
  const tickets = await getSupportTickets();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
          <MessageSquare className="w-7 h-7 text-primary" />
          Customer Support Tickets
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Respond to customer questions, assist with 1-click cloud tool access, handle payment verification inquiries, and track resolution.
        </p>
      </div>

      <AdminTicketsClient initialTickets={tickets} />
    </div>
  );
}

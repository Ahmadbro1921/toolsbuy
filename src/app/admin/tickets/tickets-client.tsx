"use client";

import { useState } from "react";
import { SupportTicket, TicketStatus } from "@/types";
import { replyTicketAction, updateTicketStatusAction } from "@/lib/actions/tickets";
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Shield,
  Search,
} from "lucide-react";
import { formatDate, formatTimeAgo } from "@/lib/utils";

export function AdminTicketsClient({ initialTickets }: { initialTickets: SupportTicket[] }) {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    initialTickets[0]?.id || ""
  );
  const [filter, setFilter] = useState<TicketStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const filteredTickets = tickets.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.ticket_number.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.user_email.toLowerCase().includes(q)
    );
  });

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    setSubmitting(true);
    try {
      const res = await replyTicketAction(selectedTicket.id, replyText);
      if (res.success) {
        const newMessage = {
          id: `msg-${Date.now()}`,
          sender: "admin" as const,
          sender_name: "ToolsBuy Support Admin",
          message: replyText.trim(),
          created_at: new Date().toISOString(),
        };

        setTickets((prev) =>
          prev.map((t) =>
            t.id === selectedTicket.id
              ? {
                  ...t,
                  messages: [...t.messages, newMessage],
                  updated_at: new Date().toISOString(),
                }
              : t
          )
        );
        setReplyText("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: TicketStatus) => {
    const res = await updateTicketStatusAction(ticketId, newStatus);
    if (res.success) {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
    }
  };

  const getStatusBadge = (s: TicketStatus) => {
    switch (s) {
      case "resolved":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Resolved</span>;
      case "in_progress":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">In Progress</span>;
      case "closed":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground border border-border">Closed</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">Open</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
      {/* Tickets List Column */}
      <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-card p-4 space-y-4 flex flex-col">
        {/* Search & Status Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticket #, subject, email..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border/80 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(["all", "open", "in_progress", "resolved", "closed"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize shrink-0 transition-colors ${
                  filter === st
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets Scroll List */}
        <div className="flex-1 divide-y divide-border/60 overflow-y-auto max-h-[550px] pr-1">
          {filteredTickets.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No tickets found.
            </div>
          ) : (
            filteredTickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`w-full text-left py-3.5 px-3 rounded-xl transition-all cursor-pointer ${
                    isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">
                      {t.ticket_number}
                    </span>
                    {getStatusBadge(t.status)}
                  </div>
                  <div className="font-semibold text-xs text-foreground mt-1 line-clamp-1">
                    {t.subject}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                    <span className="truncate max-w-[150px]">{t.user_email}</span>
                    <span>{formatTimeAgo(t.updated_at)}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Ticket Details & Thread Column */}
      <div className="lg:col-span-7 rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between space-y-6">
        {selectedTicket ? (
          <>
            <div className="space-y-4 border-b border-border/60 pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      {selectedTicket.ticket_number}
                    </span>
                    {getStatusBadge(selectedTicket.status)}
                    <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                      {selectedTicket.category.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-foreground mt-1.5">
                    {selectedTicket.subject}
                  </h3>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    User: {selectedTicket.user_email} · Created {formatDate(selectedTicket.created_at)}
                  </div>
                </div>

                {/* Status Switcher Dropdown */}
                <select
                  value={selectedTicket.status}
                  onChange={(e) =>
                    handleStatusChange(selectedTicket.id, e.target.value as TicketStatus)
                  }
                  className="px-3 py-1.5 rounded-xl bg-background border border-border/80 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="open">Mark Open</option>
                  <option value="in_progress">Mark In Progress</option>
                  <option value="resolved">Mark Resolved</option>
                  <option value="closed">Mark Closed</option>
                </select>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[380px] pr-2">
              {selectedTicket.messages.map((m) => {
                const isAdmin = m.sender === "admin";
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                      {isAdmin ? (
                        <>
                          <span>{m.sender_name}</span>
                          <Shield className="w-3 h-3 text-primary" />
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3" />
                          <span>{m.sender_name}</span>
                        </>
                      )}
                      <span>· {formatTimeAgo(m.created_at)}</span>
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                        isAdmin
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted text-foreground rounded-tl-none border border-border/60"
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Admin Reply Input */}
            <form onSubmit={handleSendReply} className="pt-4 border-t border-border/60 space-y-2">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type official reply to customer..."
                  className="w-full pl-4 pr-24 py-3 rounded-xl bg-background border border-border/80 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={submitting || !replyText.trim()}
                  className="absolute right-2 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-24 text-center text-xs text-muted-foreground">
            Select a ticket from the left column to view messages and respond.
          </div>
        )}
      </div>
    </div>
  );
}

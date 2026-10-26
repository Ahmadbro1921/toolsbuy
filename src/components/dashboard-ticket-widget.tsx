"use client";

import { useState, useTransition } from "react";
import { SupportTicket } from "@/types";
import { createTicketAction, replyTicketAction } from "@/lib/actions/tickets";
import { LifeBuoy, Send, MessageSquare, CheckCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface DashboardTicketWidgetProps {
  tickets: SupportTicket[];
  userEmail: string;
}

export function DashboardTicketWidget({ tickets, userEmail }: DashboardTicketWidgetProps) {
  const [isPending, startTransition] = useTransition();
  const [showNewForm, setShowNewForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<any>("general");
  const [message, setMessage] = useState("");
  const [activeTicketId, setActiveTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [replyMessage, setReplyMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("category", category);
    formData.append("message", message);
    formData.append("email", userEmail);

    startTransition(async () => {
      const res = await createTicketAction(formData);
      if (res.success) {
        setStatusMessage(`Ticket #${res.ticketNumber} created successfully! Our team will reply shortly.`);
        setShowNewForm(false);
        setSubject("");
        setMessage("");
      }
    });
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicketId || !replyMessage.trim()) return;

    startTransition(async () => {
      const res = await replyTicketAction(activeTicketId, replyMessage);
      if (res.success) {
        setReplyMessage("");
      }
    });
  };

  const activeTicket = tickets.find((t) => t.id === activeTicketId);

  return (
    <div id="support" className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-amber-500" />
            <span>Support & Help Tickets</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Submit a question or issue and communicate directly with our technical support team.
          </p>
        </div>

        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-95 transition-opacity self-start"
        >
          {showNewForm ? "Cancel Ticket" : "+ Open New Ticket"}
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* New Ticket Form */}
      {showNewForm && (
        <form onSubmit={handleCreate} className="p-5 rounded-2xl bg-muted/40 border border-border space-y-4 animate-in slide-in-from-top-2">
          <h3 className="text-sm font-bold text-foreground">Create Support Ticket</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Subject / Issue Summary *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Need help accessing Helium 10"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="access_issue">Tool Access & Session</option>
                <option value="payment_issue">Order & Payment Verification</option>
                <option value="tool_request">Request a New Tool</option>
                <option value="general">General Support</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Message Details *</label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue or question in detail..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm disabled:opacity-50"
          >
            {isPending ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      )}

      {/* Existing Tickets List & Thread Viewer */}
      {tickets.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border rounded-2xl space-y-2">
          <MessageSquare className="w-8 h-8 text-muted-foreground/40 mx-auto" />
          <p className="text-xs text-muted-foreground">No support tickets submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Ticket list */}
          <div className="lg:col-span-5 space-y-2 max-h-80 overflow-y-auto pr-1">
            {tickets.map((t) => {
              const isActive = t.id === activeTicketId;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setActiveTicketId(t.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all space-y-1.5 ${
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[11px] text-primary">{t.ticket_number}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        t.status === "resolved"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : t.status === "in_progress"
                          ? "bg-cyan-500/10 text-cyan-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {t.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-foreground truncate">{t.subject}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center justify-between">
                    <span>{new Date(t.created_at).toLocaleDateString()}</span>
                    <span>{t.messages.length} messages</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Conversation Thread */}
          {activeTicket && (
            <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl border border-border bg-muted/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h4 className="font-bold text-sm text-foreground">{activeTicket.subject}</h4>
                  <span className="text-[11px] text-muted-foreground">
                    Ticket ID: {activeTicket.ticket_number} · Category: {activeTicket.category}
                  </span>
                </div>
              </div>

              {/* Messages list */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {activeTicket.messages.map((m) => {
                  const isAdmin = m.sender === "admin";
                  return (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-2xl text-xs space-y-1 max-w-[85%] ${
                        isAdmin
                          ? "bg-emerald-500/15 border border-emerald-500/30 ml-auto"
                          : "bg-card border border-border mr-auto"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] text-muted-foreground">
                        <strong className={isAdmin ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}>
                          {m.sender_name}
                        </strong>
                        <span>{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">{m.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Reply form */}
              {activeTicket.status !== "resolved" && (
                <form onSubmit={handleReply} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your message reply..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={isPending || !replyMessage.trim()}
                    className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition-opacity"
                    title="Send Reply"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Order, OrderStatus } from "@/types";
import { verifyOrderAction, rejectOrderAction } from "@/lib/actions/orders";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [copiedTid, setCopiedTid] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.user_email.toLowerCase().includes(q) ||
      o.customer_phone.toLowerCase().includes(q) ||
      o.transaction_id.toLowerCase().includes(q)
    );
  });

  const handleCopyTid = (tid: string) => {
    navigator.clipboard.writeText(tid);
    setCopiedTid(tid);
    setTimeout(() => setCopiedTid(null), 2000);
  };

  const handleApprove = async (orderId: string) => {
    if (!confirm("Are you sure you want to approve this order? This will instantly activate a 30-day subscription for the customer.")) {
      return;
    }

    setProcessingId(orderId);
    setMessage(null);

    try {
      const res = await verifyOrderAction(orderId);
      if (res.error) {
        setMessage({ text: res.error, type: "error" });
      } else {
        setMessage({ text: res.message || "Order verified and subscription activated!", type: "success" });
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, status: "verified", verified_at: new Date().toISOString() }
              : o
          )
        );
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to approve order", type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (orderId: string) => {
    const reason = prompt("Enter rejection reason (e.g. 'Invalid transaction ID', 'Payment not received in account'):");
    if (!reason) return;

    setProcessingId(orderId);
    setMessage(null);

    try {
      const res = await rejectOrderAction(orderId, reason);
      if (res.error) {
        setMessage({ text: res.error, type: "error" });
      } else {
        setMessage({ text: res.message || "Order rejected", type: "success" });
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, status: "rejected", rejection_reason: reason }
              : o
          )
        );
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to reject order", type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const getMethodBadge = (m: string) => {
    switch (m) {
      case "easypaisa":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">EasyPaisa</span>;
      case "jazzcash":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">JazzCash</span>;
      case "bank_transfer":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/30">Meezan Bank</span>;
      case "usdt":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-500 border border-purple-500/30">USDT TRC20</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground">{m}</span>;
    }
  };

  const getStatusBadge = (s: OrderStatus) => {
    switch (s) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified & Active
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            Pending Verification
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(["all", "pending", "verified", "rejected"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
                filter === st
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {st === "all" ? `All (${orders.length})` : `${st} (${orders.filter((o) => o.status === st).length})`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, phone, TID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-card border border-border/80 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-border/60 bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="py-3.5 px-4">Order / Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Package / Items</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment & TID</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground text-xs">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const isProcessing = processingId === ord.id;
                  const cleanPhone = ord.customer_phone.replace(/[^0-9]/g, "");
                  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${ord.customer_name}! Regarding your ToolsBuy order #${ord.order_number}...`
                  )}`;

                  return (
                    <tr key={ord.id} className="hover:bg-muted/20 transition-colors">
                      {/* Order / Date */}
                      <td className="py-4 px-4 font-mono">
                        <div className="font-bold text-foreground">{ord.order_number}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {formatDate(ord.created_at)}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-foreground">{ord.customer_name}</div>
                        <div className="text-[11px] text-muted-foreground">{ord.user_email}</div>
                        <div className="text-[11px] text-primary flex items-center gap-1 mt-0.5">
                          <span>{ord.customer_phone}</span>
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-primary/10 rounded transition-colors text-emerald-400"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* Package / Items */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-foreground">
                          {ord.package_name || "Custom Bundle"}
                        </div>
                        {ord.custom_tools && ord.custom_tools.length > 0 && (
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {ord.custom_tools.length} custom tools selected
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 font-bold text-foreground">
                        PKR {ord.total_amount_pkr.toLocaleString()}
                      </td>

                      {/* Payment & TID */}
                      <td className="py-4 px-4 space-y-1">
                        <div>{getMethodBadge(ord.payment_method)}</div>
                        <div className="flex items-center gap-1.5 font-mono text-xs text-foreground bg-muted/60 px-2 py-0.5 rounded w-fit">
                          <span>{ord.transaction_id}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyTid(ord.transaction_id)}
                            className="text-muted-foreground hover:text-foreground"
                            title="Copy TID"
                          >
                            {copiedTid === ord.transaction_id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        {ord.payment_proof_note && (
                          <p className="text-[11px] text-muted-foreground italic max-w-xs truncate">
                            Note: {ord.payment_proof_note}
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(ord.status)}
                        {ord.rejection_reason && (
                          <div className="text-[11px] text-rose-400 mt-1">
                            {ord.rejection_reason}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right space-x-2">
                        {ord.status === "pending" ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleApprove(ord.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-sm disabled:opacity-50"
                            >
                              {isProcessing ? "Processing..." : "Approve & Activate"}
                            </button>
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleReject(ord.id)}
                              className="px-2.5 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-semibold text-xs transition-all disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : ord.status === "verified" ? (
                          <span className="text-xs text-emerald-400 font-medium">Activated</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Closed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { placeOrderAction } from "@/lib/actions/orders";
import {
  CreditCard,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  ArrowRight,
  PhoneCall,
  AlertCircle,
  PackageCheck,
  Building,
  Smartphone,
  Coins,
} from "lucide-react";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const type = searchParams.get("type") || "package";
  const packageId = searchParams.get("packageId") || "pkg-standard";
  const queryTotal = parseInt(searchParams.get("total") || "4000", 10);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"easypaisa" | "jazzcash" | "bank_transfer" | "usdt">("easypaisa");
  const [transactionId, setTransactionId] = useState("");
  const [proofNote, setProofNote] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Custom tools bundle if applicable
  const [customTools, setCustomTools] = useState<{ id: string; name: string; price_pkr: number }[]>([]);

  useEffect(() => {
    if (type === "custom") {
      try {
        const stored = sessionStorage.getItem("toolsbuy_custom_bundle");
        if (stored) {
          setCustomTools(JSON.parse(stored));
        }
      } catch (e) {}
    }
  }, [type]);

  // Package title detection
  const getPackageTitle = () => {
    if (type === "custom") return "Custom Selected Bundle";
    if (packageId === "pkg-basic") return "Basic Bundle V2";
    if (packageId === "pkg-premium") return "Premium Bundle V2";
    return "Standard Bundle V2 (Most Popular)";
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("customerName", customerName);
    formData.append("customerEmail", customerEmail);
    formData.append("customerPhone", customerPhone);
    formData.append("type", type);
    formData.append("packageId", packageId);
    formData.append("packageName", getPackageTitle());
    formData.append("totalAmountPkr", queryTotal.toString());
    formData.append("paymentMethod", paymentMethod);
    formData.append("transactionId", transactionId);
    formData.append("paymentProofNote", proofNote);

    if (customTools.length > 0) {
      formData.append("customToolsJson", JSON.stringify(customTools));
    }

    startTransition(async () => {
      const result = await placeOrderAction(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        router.push(`/order/success?orderNumber=${result.orderNumber}`);
      }
    });
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Secure Checkout
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Confirm Order & Complete Payment
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Follow the payment instructions below, submit your transaction ID, and our team will verify and activate your tools in under 5 minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Payment & Order Form */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Contact Details */}
            <div className="p-6 sm:p-7 rounded-3xl border border-border bg-card shadow-sm space-y-5">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">
                  1
                </span>
                Your Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Muhammad Ali"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="ali@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* 2. Choose Payment Method & View Accounts */}
            <div className="p-6 sm:p-7 rounded-3xl border border-border bg-card shadow-sm space-y-6">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">
                  2
                </span>
                Select Payment Method
              </h2>

              {/* Methods Switcher */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "easypaisa", label: "EasyPaisa", icon: Smartphone },
                  { id: "jazzcash", label: "JazzCash", icon: Smartphone },
                  { id: "bank_transfer", label: "Bank Transfer", icon: Building },
                  { id: "usdt", label: "USDT / Crypto", icon: Coins },
                ].map((item) => {
                  const isSelected = paymentMethod === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setPaymentMethod(item.id as any)}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm"
                          : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Payment Instruction Card */}
              <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3.5">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Send Exactly PKR {queryTotal.toLocaleString()} to:</span>
                  <span className="text-emerald-600 font-semibold">Instant Verification</span>
                </div>

                {paymentMethod === "easypaisa" && (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border">
                      <div>
                        <span className="text-xs text-muted-foreground block">EasyPaisa Account:</span>
                        <strong className="text-foreground text-base">0312-7462475</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("03127462475", "ep")}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {copiedKey === "ep" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === "ep" ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Account Title: <strong>ToolsBuy Official</strong></p>
                  </div>
                )}

                {paymentMethod === "jazzcash" && (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border">
                      <div>
                        <span className="text-xs text-muted-foreground block">JazzCash Account:</span>
                        <strong className="text-foreground text-base">0312-7462475</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("03127462475", "jc")}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {copiedKey === "jc" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === "jc" ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Account Title: <strong>ToolsBuy Official</strong></p>
                  </div>
                )}

                {paymentMethod === "bank_transfer" && (
                  <div className="space-y-2 text-sm">
                    <div className="bg-card p-4 rounded-xl border border-border space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Bank Name:</span>
                        <strong className="text-foreground">Meezan Bank Limited</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Account Title:</span>
                        <strong className="text-foreground">ToolsBuy Official</strong>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">Account Number:</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-foreground">01020304050607</strong>
                          <button
                            type="button"
                            onClick={() => copyToClipboard("01020304050607", "bank")}
                            className="text-xs text-emerald-600 hover:text-emerald-700"
                          >
                            {copiedKey === "bank" ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "usdt" && (
                  <div className="space-y-2 text-sm">
                    <div className="bg-card p-3 rounded-xl border border-border space-y-1">
                      <span className="text-xs text-muted-foreground block">USDT (TRC-20) Address:</span>
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-xs font-mono break-all text-foreground">TYdCqV9Xp7z8WbK1mN2qR4tY6uI8oP0sLa</code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("TYdCqV9Xp7z8WbK1mN2qR4tY6uI8oP0sLa", "usdt")}
                          className="shrink-0 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-md"
                        >
                          {copiedKey === "usdt" ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Equivalent: ~${Math.round(queryTotal / 278)} USDT</p>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Transaction Proof Submission */}
            <div className="p-6 sm:p-7 rounded-3xl border border-border bg-card shadow-sm space-y-5">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">
                  3
                </span>
                Payment Verification Details
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Transaction ID / Reference Code / TID *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 8493019284 or Bank Ref #..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    This is found in the SMS or confirmation receipt sent by your bank/EasyPaisa/JazzCash.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Sender Account Name or Remarks (Optional)
                  </label>
                  <input
                    type="text"
                    value={proofNote}
                    onChange={(e) => setProofNote(e.target.value)}
                    placeholder="e.g. Sent from Muhammad Ali EasyPaisa"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-black text-base shadow-lg shadow-primary/25 hover:opacity-95 transition-all disabled:opacity-50"
            >
              <span>{isPending ? "Submitting Order..." : "Confirm & Place Order"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl border border-border bg-card shadow-card space-y-6 sticky top-24">
            <h3 className="font-bold text-base text-foreground pb-4 border-b border-border">
              Order Summary
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{getPackageTitle()}</span>
                <span className="text-sm font-bold text-foreground">PKR {queryTotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Duration</span>
                <span>30 Days (1 Month)</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Access Type</span>
                <span className="text-emerald-600 font-semibold">1-Click Cloud Launch</span>
              </div>
            </div>

            {/* If custom tools */}
            {type === "custom" && customTools.length > 0 && (
              <div className="pt-3 border-t border-border space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Selected Tools ({customTools.length}):
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {customTools.map((t) => (
                    <div key={t.id} className="flex justify-between items-center text-xs">
                      <span className="text-foreground truncate max-w-[180px]">{t.name}</span>
                      <span className="text-muted-foreground">PKR {t.price_pkr.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border flex items-baseline justify-between">
              <span className="text-base font-bold text-foreground">Total Payable</span>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  PKR {queryTotal.toLocaleString()}
                </span>
                <span className="block text-[11px] text-muted-foreground">No extra fees or hidden taxes</span>
              </div>
            </div>

            {/* Trust Points */}
            <div className="pt-5 border-t border-border space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Guaranteed working tools with 24/7 replacement</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Fast manual payment verification in 5-15 minutes</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <PhoneCall className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Direct WhatsApp support helpline: +92 312 7462475</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

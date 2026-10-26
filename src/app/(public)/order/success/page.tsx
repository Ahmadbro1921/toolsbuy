import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, PhoneCall, LayoutDashboard, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Submitted Successfully — ToolsBuy",
  description: "Your order has been recorded. Our team will verify the payment and activate your subscription.",
};

interface OrderSuccessProps {
  searchParams: { orderNumber?: string };
}

export default function OrderSuccessPage({ searchParams }: OrderSuccessProps) {
  const orderNumber = searchParams.orderNumber || "ORD-RECENT";

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
          <Clock className="w-3.5 h-3.5" /> Pending Verification
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Order Received Successfully!
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Thank you for choosing ToolsBuy. Your order has been placed with reference code:
        </p>
        <div className="inline-block px-5 py-2.5 rounded-2xl bg-muted border border-border font-mono font-bold text-lg text-foreground tracking-wider">
          {orderNumber}
        </div>
      </div>

      {/* Activation Steps */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm text-left space-y-4">
        <h2 className="font-bold text-base text-foreground flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          What Happens Next?
        </h2>
        <ol className="space-y-3 text-xs sm:text-sm text-muted-foreground list-decimal list-inside leading-relaxed">
          <li>
            <strong className="text-foreground">Payment Review:</strong> Our administrative team verifies your transaction ID against the banking records.
          </li>
          <li>
            <strong className="text-foreground">Instant Subscription Activation:</strong> Upon approval, your account dashboard automatically unlocks the 1-click tool launch station.
          </li>
          <li>
            <strong className="text-foreground">Instant Speedup (Optional):</strong> Send a quick screenshot of your payment receipt to our WhatsApp support team at <strong className="text-emerald-600">+92 312 7462475</strong> for activation within 2 minutes.
          </li>
        </ol>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          href="/dashboard"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-md shadow-primary/25 hover:opacity-95 transition-all"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to User Dashboard</span>
        </Link>

        <a
          href={`https://wa.me/923127462475?text=Hi%20ToolsBuy,%20I%20just%20submitted%20order%20${orderNumber}.%20Please%20verify%20and%20activate%20my%20tools.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-sm transition-colors"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Notify on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

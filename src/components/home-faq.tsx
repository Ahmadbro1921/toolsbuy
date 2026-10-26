"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does ToolsBuy work and what is 1-Click Access?",
    answer:
      "ToolsBuy provides shared cloud session access to premium Amazon FBA, AI, and SEO platforms. Instead of paying $200-$500/month for each tool individually, you access them through our high-speed secure cloud dashboard with a single click—no complicated extensions, no passwords leaking, and 99.9% uptime guaranteed.",
  },
  {
    question: "How quickly is my subscription activated after payment?",
    answer:
      "Once you submit your EasyPaisa, JazzCash, Meezan Bank, or USDT transaction ID (TID) at checkout, our team verifies it within 10 to 30 minutes. You can also send your order ID directly to our WhatsApp support (+92 312 7462475) for instant priority activation.",
  },
  {
    question: "Which payment methods are accepted in Pakistan and internationally?",
    answer:
      "We accept EasyPaisa, JazzCash, Meezan Bank / Raast instant transfers, and USDT (TRC-20) for international clients. All account details are clearly displayed during checkout with one-click copy buttons.",
  },
  {
    question: "Can I choose only the specific tools I need?",
    answer:
      "Yes! You can use our Custom Package Builder to select only the tools you require (e.g. Helium 10 + ChatGPT Plus + Canva Pro). The price is dynamically calculated in PKR, and picking 3 or more tools automatically applies an instant bundle discount.",
  },
  {
    question: "What happens if a tool session expires or asks for a verification code?",
    answer:
      "Our automated session managers refresh auth cookies around the clock. If you ever encounter a session prompt, simply click the 'Report' button in your dashboard or ping our 24/7 WhatsApp support. We resolve 95% of session refreshes in under 5 minutes.",
  },
  {
    question: "Is there a replacement or refund guarantee?",
    answer:
      "Yes, we provide a 24-hour initial replacement guarantee. If a tool included in your plan is non-functional and our support cannot restore access within 24 hours, you receive a prorated credit or replacement tool of your choice.",
  },
];

export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3.5 max-w-3xl mx-auto">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
              isOpen
                ? "border-primary/40 bg-card shadow-md shadow-primary/5"
                : "border-border/70 bg-card/60 hover:border-border"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold text-foreground text-sm sm:text-base cursor-pointer select-none"
            >
              <span className="flex items-center gap-3">
                <HelpCircle
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isOpen ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span>{faq.question}</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/40 mt-1 pl-12">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

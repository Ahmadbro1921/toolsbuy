"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tool, Category } from "@/types";
import { Check, ShoppingBag, ArrowRight, Sparkles, Sliders } from "lucide-react";

interface CustomPackageBuilderProps {
  tools: Tool[];
  categories: Category[];
}

export function CustomPackageBuilder({ tools, categories }: CustomPackageBuilderProps) {
  const router = useRouter();
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([
    "tool-helium10",
    "tool-chatgpt",
  ]);

  const toggleTool = (id: string) => {
    setSelectedToolIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedTools = tools.filter((t) => selectedToolIds.includes(t.id));
  const rawTotal = selectedTools.reduce((acc, t) => acc + (t.price_pkr || 1000), 0);
  
  // Custom bundle bundle discount logic (10% off for 4+ tools)
  const discount = selectedTools.length >= 4 ? Math.round(rawTotal * 0.1) : 0;
  const finalTotal = rawTotal - discount;

  const handleProceed = () => {
    if (selectedTools.length === 0) return;
    const items = selectedTools.map((t) => ({
      id: t.id,
      name: t.name,
      price_pkr: t.price_pkr || 1000,
    }));
    sessionStorage.setItem("toolsbuy_custom_bundle", JSON.stringify(items));
    router.push(`/order/checkout?type=custom&total=${finalTotal}`);
  };

  return (
    <div id="custom-builder" className="scroll-mt-24 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
          <Sliders className="w-3.5 h-3.5" />
          <span>Interactive Bundle Builder</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Build Your Custom Package
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Select only the specific tools you need. Pick from our catalog of verified Amazon, AI, SEO, and Design services with instant pricing calculation.
        </p>
      </div>

      {/* Categories and Tools List */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const catTools = tools.filter((t) => t.category_id === cat.id);
          if (catTools.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {cat.name}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {catTools.map((tool) => {
                  const isChecked = selectedToolIds.includes(tool.id);
                  const price = tool.price_pkr || 1000;

                  return (
                    <label
                      key={tool.id}
                      onClick={() => toggleTool(tool.id)}
                      className={`relative flex items-center gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                          : "border-border bg-card hover:border-emerald-500/40 hover:bg-muted/30"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="sr-only"
                      />

                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-muted-foreground/30 bg-background text-transparent"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm text-foreground truncate">
                          {tool.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          PKR {price.toLocaleString()} /mo
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Floating Total Bar */}
      <div className="sticky bottom-4 z-30 flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-border bg-card/95 shadow-glow backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {selectedTools.length} {selectedTools.length === 1 ? "tool" : "tools"} selected
              {discount > 0 && (
                <span className="ml-2 text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  10% Combo Savings
                </span>
              )}
            </div>
            <div className="text-2xl font-black tracking-tight text-foreground">
              PKR {finalTotal.toLocaleString()}{" "}
              <span className="text-xs font-normal text-muted-foreground">/month</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleProceed}
          disabled={selectedTools.length === 0}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md shadow-primary/25 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <span>Order Custom Bundle</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check, AlertCircle, X } from "lucide-react";
import { AIGeneratedMetadataOutput } from "@/lib/ai/types";

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: AIGeneratedMetadataOutput) => void;
  defaultName?: string;
  defaultUrl?: string;
}

export function AIGenerateModal({
  isOpen,
  onClose,
  onApply,
  defaultName = "",
  defaultUrl = "",
}: AIGenerateModalProps) {
  const [toolName, setToolName] = useState(defaultName);
  const [websiteUrl, setWebsiteUrl] = useState(defaultUrl);
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIGeneratedMetadataOutput | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolName, websiteUrl, rawText }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || "AI generation failed.");
      } else {
        setResult(data.metadata);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyResult = () => {
    if (result) {
      onApply(result);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Sparkles className="w-5 h-5" />
            <span>AI Tool Metadata Generator</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!result ? (
          <form onSubmit={handleGenerate} className="space-y-4 text-sm">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enter the official tool details below. Our modular AI assistant will analyze the name, URL, and context to generate descriptions, tags, features, and SEO metadata for your review before publishing.
            </p>

            <div>
              <label className="block text-xs font-semibold mb-1">Tool Name *</label>
              <input
                type="text"
                required
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                placeholder="e.g. Cursor, Claude, Midjourney"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Official Website URL *</label>
              <input
                type="url"
                required
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://cursor.com"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Optional Feature Snippets or Notes</label>
              <textarea
                rows={3}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste extra details, pricing notes, or key capabilities to guide the AI..."
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !toolName || !websiteUrl}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Generating Metadata...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate Metadata
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Review Results */
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-foreground space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-primary flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Generated Review Proposal
                </span>
                <span className="text-[10px] text-muted-foreground">Confidence: {Math.round(result.confidenceScore * 100)}%</span>
              </div>
              <p className="text-muted-foreground">{result.description}</p>
              <div>
                <strong>Suggested Category:</strong> {result.suggestedCategory}
              </div>
              <div>
                <strong>Tags:</strong> {result.tags.join(", ")}
              </div>
              <div>
                <strong>SEO Title:</strong> {result.seoTitle}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResult(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={handleApplyResult}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
              >
                Apply to Form
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

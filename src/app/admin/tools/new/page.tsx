"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createToolAction } from "@/lib/actions/tools";
import { AIGenerateModal } from "@/components/ai-generate-modal";
import { AIGeneratedMetadataOutput } from "@/lib/ai/types";
import { Category } from "@/types";
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  Check,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { slugify } from "@/lib/utils";

export default function NewToolPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [officialUrl, setOfficialUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80");
  const [categoryId, setCategoryId] = useState("");
  const [pricingType, setPricingType] = useState("Freemium");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [features, setFeatures] = useState("");
  const [useCases, setUseCases] = useState("");
  const [integrationMode, setIntegrationMode] = useState("external_link");
  const [externalAccountRequired, setExternalAccountRequired] = useState(true);
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    // Fetch categories for dropdown
    fetch("/api/sitemap") // simple ping or fetch categories
      .then(() => {
        // Fallback or default categories list
        setCategories([
          { id: "c1000000-0000-0000-0000-000000000001", name: "Text & LLMs", slug: "text-llms", description: "", icon: "Bot", created_at: "" },
          { id: "c1000000-0000-0000-0000-000000000002", name: "Image & Art", slug: "image-art", description: "", icon: "Image", created_at: "" },
          { id: "c1000000-0000-0000-0000-000000000003", name: "Code & Dev", slug: "code-dev", description: "", icon: "Code", created_at: "" },
          { id: "c1000000-0000-0000-0000-000000000004", name: "Audio & Speech", slug: "audio-speech", description: "", icon: "Headphones", created_at: "" },
          { id: "c1000000-0000-0000-0000-000000000005", name: "Video Generation", slug: "video-generation", description: "", icon: "Video", created_at: "" },
          { id: "c1000000-0000-0000-0000-000000000006", name: "Productivity", slug: "productivity", description: "", icon: "Zap", created_at: "" },
          { id: "c1000000-0000-0000-0000-000000000007", name: "Research & Data", slug: "research-data", description: "", icon: "Search", created_at: "" },
        ]);
        setCategoryId("c1000000-0000-0000-0000-000000000001");
      });
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(val));
    }
  };

  const handleApplyAiMetadata = (aiData: AIGeneratedMetadataOutput) => {
    setDescription(aiData.description);
    setTags(aiData.tags.join(", "));
    setFeatures(aiData.features.join("\n"));
    setUseCases(aiData.useCases.join("\n"));

    // match category
    const matched = categories.find(
      (c) => c.name.toLowerCase() === aiData.suggestedCategory.toLowerCase()
    );
    if (matched) {
      setCategoryId(matched.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("official_url", officialUrl);
    formData.set("logo_url", logoUrl);
    formData.set("category_id", categoryId);
    formData.set("pricing_type", pricingType);
    formData.set("description", description);
    formData.set("tags", tags);
    formData.set("features", features);
    formData.set("use_cases", useCases);
    formData.set("integration_mode", integrationMode);
    formData.set("external_account_required", String(externalAccountRequired));
    formData.set("is_published", String(isPublished));
    formData.set("is_featured", String(isFeatured));

    const res = await createToolAction(null, formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/admin/tools");
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* AI Generate Modal */}
      <AIGenerateModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onApply={handleApplyAiMetadata}
        defaultName={name}
        defaultUrl={officialUrl}
      />

      <div className="flex items-center justify-between">
        <Link
          href="/admin/tools"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Tools
        </Link>

        {/* AI Assistant Button */}
        <button
          type="button"
          onClick={() => setAiModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-xs shadow-md shadow-violet-500/20 hover:scale-[1.02] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Metadata Assistant</span>
        </button>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New AI Tool Listing</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Publish verified AI tools with capabilities, tags, and transparent access rules.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Row 1: Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Tool Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Cursor, Claude, Midjourney"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">URL Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="cursor-ai"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Row 2: Official URL & Logo URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Official Website URL *</label>
              <input
                type="url"
                required
                value={officialUrl}
                onChange={(e) => setOfficialUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Logo URL *</label>
              <input
                type="url"
                required
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Row 3: Category & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Pricing Model *</label>
              <select
                value={pricingType}
                onChange={(e) => setPricingType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Paid">Paid</option>
                <option value="Free Trial">Free Trial</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Integration Mode</label>
              <select
                value={integrationMode}
                onChange={(e) => setIntegrationMode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="external_link">External Link (Mode A)</option>
                <option value="oauth">Official OAuth (Mode B)</option>
                <option value="api">Official API (Mode C)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-1">Editorial Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Objective 2-3 sentence overview of what the tool accomplishes..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="LLM, Code Assistant, Vision, Multimodal"
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Features & Use Cases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Features (One per line)</label>
              <textarea
                rows={3}
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="200k token context window&#10;Multi-file indexing&#10;Inline diff editing"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Use Cases (One per line)</label>
              <textarea
                rows={3}
                value={useCases}
                onChange={(e) => setUseCases(e.target.value)}
                placeholder="Full codebase refactoring&#10;Documentation generation&#10;Accelerated feature delivery"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border flex flex-wrap items-center justify-between gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={externalAccountRequired}
                onChange={(e) => setExternalAccountRequired(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <span className="font-medium">External account / login required</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <span className="font-medium text-amber-500">Feature on homepage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <span className="font-semibold text-emerald-500">Publish Listing Live</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link
              href="/admin/tools"
              className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Listing...
                </>
              ) : (
                "Save & Publish Listing"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

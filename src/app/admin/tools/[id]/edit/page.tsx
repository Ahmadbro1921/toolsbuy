import Link from "next/link";
import { notFound } from "next/navigation";
import { getToolById, getCategories } from "@/lib/supabase/store";
import { updateToolAction } from "@/lib/actions/tools";
import { ArrowLeft } from "lucide-react";

export default async function EditToolPage({
  params,
}: {
  params: { id: string };
}) {
  const tool = await getToolById(params.id);
  const categories = await getCategories();

  if (!tool) {
    notFound();
  }

  const updateWithId = updateToolAction.bind(null, tool.id);

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/admin/tools"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Tools
      </Link>

      <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit AI Tool: {tool.name}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Update specifications, URLs, category mappings, and directory visibility.
          </p>
        </div>

        <form
          action={async (formData) => {
            "use server";
            await updateToolAction(tool.id, null, formData);
          }}
          className="space-y-5 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Tool Name *</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={tool.name}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">URL Slug *</label>
              <input
                type="text"
                name="slug"
                required
                defaultValue={tool.slug}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Official Website URL *</label>
              <input
                type="url"
                name="official_url"
                required
                defaultValue={tool.official_url}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Logo URL *</label>
              <input
                type="url"
                name="logo_url"
                required
                defaultValue={tool.logo_url}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">Category *</label>
              <select
                name="category_id"
                defaultValue={tool.category_id}
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
              <label className="block font-semibold mb-1">Pricing Tier *</label>
              <select
                name="pricing_type"
                defaultValue={tool.pricing_type}
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
                name="integration_mode"
                defaultValue={tool.integration_mode}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="external_link">External Link</option>
                <option value="oauth">Official OAuth</option>
                <option value="api">Official API</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Editorial Description *</label>
            <textarea
              name="description"
              rows={3}
              required
              defaultValue={tool.description}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              name="tags"
              defaultValue={tool.tags?.join(", ")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Features (One per line)</label>
              <textarea
                name="features"
                rows={3}
                defaultValue={tool.features?.join("\n")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Use Cases (One per line)</label>
              <textarea
                name="use_cases"
                rows={3}
                defaultValue={(tool.useCases || tool.use_cases || []).join("\n")}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30 border border-border flex flex-wrap items-center justify-between gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="external_account_required"
                value="true"
                defaultChecked={tool.external_account_required}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <span className="font-medium">External account required</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="is_featured"
                value="true"
                defaultChecked={tool.is_featured}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <span className="font-medium text-amber-500">Feature on homepage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="is_published"
                value="true"
                defaultChecked={tool.is_published}
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
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90"
            >
              Update Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { getCategories } from "@/lib/supabase/store";
import {
  createCategoryAction,
  deleteCategoryAction,
} from "@/lib/actions/categories";
import { FolderTree, Plus, Trash2, Layers, AlertCircle } from "lucide-react";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-cyan-500 font-bold text-xs uppercase tracking-wider">
          <FolderTree className="w-3.5 h-3.5" />
          <span>Taxonomy Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
          Category Manager
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage AI domains, taxonomy slugs, and safe tool reassignment workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Category */}
        <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-4 shadow-sm h-fit">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" /> Create New Category
          </h3>

          <form
            action={async (formData) => {
              "use server";
              await createCategoryAction(null, formData);
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-semibold mb-1">Category Name *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. 3D & Spatial AI"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Taxonomy Slug *</label>
              <input
                type="text"
                name="slug"
                required
                placeholder="3d-spatial-ai"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Icon (Lucide Icon Name)</label>
              <select
                name="icon"
                defaultValue="Sparkles"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Bot">Bot (LLMs & Chat)</option>
                <option value="Image">Image (Art & Diffusion)</option>
                <option value="Code">Code (IDE & Dev)</option>
                <option value="Headphones">Headphones (Audio & Voice)</option>
                <option value="Video">Video (Generative Video)</option>
                <option value="Zap">Zap (Productivity)</option>
                <option value="Search">Search (Research & Data)</option>
                <option value="Sparkles">Sparkles (General AI)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                name="description"
                rows={2}
                placeholder="Brief summary of what tools belong in this domain..."
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90"
            >
              Add Category
            </button>
          </form>
        </div>

        {/* Right Column: Existing Categories List */}
        <div className="lg:col-span-2 rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
          <div className="p-4 bg-muted/40 border-b border-border font-semibold text-xs text-muted-foreground flex items-center justify-between">
            <span>Existing Taxonomy Categories ({categories.length})</span>
            <span className="text-[11px]">Safe Reassignment Guard Enabled</span>
          </div>

          <div className="divide-y divide-border/60">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{cat.name}</span>
                    <code className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                      /{cat.slug}
                    </code>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                      {cat.tool_count || 0} tools
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{cat.description || "No description provided."}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <form
                    action={async (formData) => {
                      "use server";
                      const reassignTo = formData.get("reassign_id") as string;
                      await deleteCategoryAction(cat.id, reassignTo || undefined);
                    }}
                    className="flex items-center gap-2"
                  >
                    {cat.tool_count && cat.tool_count > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <select
                          name="reassign_id"
                          className="px-2 py-1 rounded-lg border border-border bg-background text-[11px]"
                          title="Select replacement category for existing tools"
                        >
                          <option value="">Reassign tools to...</option>
                          {categories
                            .filter((c) => c.id !== cat.id)
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                        </select>
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg border border-destructive/20 text-destructive hover:bg-destructive/10 text-xs"
                          title="Safely reassign and delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs"
                        title="Delete empty category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

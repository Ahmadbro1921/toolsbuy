import Link from "next/link";
import { getTools, getCategories } from "@/lib/supabase/store";
import {
  Wrench,
  Plus,
  Star,
  ExternalLink,
  Edit,
  Trash2,
  Check,
  X,
} from "lucide-react";
import {
  deleteToolAction,
  toggleToolPublishedAction,
  toggleToolFeaturedAction,
} from "@/lib/actions/tools";

export default async function AdminToolsPage() {
  const { tools } = await getTools({ limit: 100, publishedOnly: false });
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Wrench className="w-3.5 h-3.5" />
            <span>Listing Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Manage AI Tools
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Create, review, edit, and toggle visibility of directory listings.
          </p>
        </div>

        <Link
          href="/admin/tools/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Tool
        </Link>
      </div>

      {/* Tools Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border/80 text-muted-foreground font-semibold">
              <tr>
                <th className="p-4">Tool</th>
                <th className="p-4">Category</th>
                <th className="p-4">Pricing</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4">Launches</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {tools.map((tool) => (
                <tr key={tool.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={tool.logo_url}
                        alt={tool.name}
                        className="w-8 h-8 rounded-lg object-cover border border-border"
                      />
                      <div>
                        <span className="font-bold text-foreground block">{tool.name}</span>
                        <a
                          href={tool.official_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1"
                        >
                          {new URL(tool.official_url).hostname} <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-muted-foreground font-medium">
                    {tool.category?.name || "Unassigned"}
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-muted border border-border text-[11px] font-medium">
                      {tool.pricing_type}
                    </span>
                  </td>

                  <td className="p-4">
                    <form
                      action={async () => {
                        "use server";
                        await toggleToolFeaturedAction(tool.id, !tool.is_featured);
                      }}
                    >
                      <button
                        type="submit"
                        className={`p-1.5 rounded-lg border transition-colors ${
                          tool.is_featured
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                            : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                        }`}
                        title={tool.is_featured ? "Featured on homepage" : "Not featured"}
                      >
                        <Star className={`w-3.5 h-3.5 ${tool.is_featured ? "fill-amber-500" : ""}`} />
                      </button>
                    </form>
                  </td>

                  <td className="p-4">
                    <form
                      action={async () => {
                        "use server";
                        await toggleToolPublishedAction(tool.id, !tool.is_published);
                      }}
                    >
                      <button
                        type="submit"
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                          tool.is_published
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {tool.is_published ? "Published" : "Draft"}
                      </button>
                    </form>
                  </td>

                  <td className="p-4 font-mono font-semibold">
                    {tool.click_count || 0}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/tools/${tool.id}/edit`}
                        className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                        title="Edit tool"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>

                      <form
                        action={async () => {
                          "use server";
                          await deleteToolAction(tool.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete tool"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

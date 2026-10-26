"use client";

import { useState } from "react";
import { Package } from "@/types";
import { savePackageAction, deletePackageAction } from "@/lib/actions/packages";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Flame,
  CheckCircle2,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

export function PackagesClient({ initialPackages }: { initialPackages: Package[] }) {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleEdit = (pkg: Package) => {
    setEditingPkg(pkg);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingPkg({
      id: "",
      name: "",
      slug: "",
      badge: "Popular",
      description: "",
      price_pkr: 3500,
      price_usd: 13,
      duration_days: 30,
      is_active: true,
      is_popular: false,
      tools_included: ["Helium 10 Diamond", "ChatGPT Plus", "Canva Pro"],
      features: ["Instant Cloud Access", "24/7 WhatsApp Support"],
      created_at: new Date().toISOString(),
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setLoading(true);
    try {
      const res = await deletePackageAction(id);
      if (res.error) {
        setMessage({ text: res.error, type: "error" });
      } else {
        setPackages((prev) => prev.filter((p) => p.id !== id));
        setMessage({ text: "Package removed.", type: "success" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to delete package", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await savePackageAction(formData);
      if (res.error) {
        setMessage({ text: res.error, type: "error" });
      } else {
        setMessage({ text: "Package saved successfully!", type: "success" });
        setEditingPkg(null);
        setIsCreating(false);
        // Refresh local view
        window.location.reload();
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to save package", type: "error" });
    } finally {
      setLoading(false);
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
          <button onClick={() => setMessage(null)} className="text-xs opacity-70">
            Dismiss
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-foreground">Active Packages & Bundles</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition-all shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Package Form Modal / Inline Editor */}
      {editingPkg && (
        <div className="p-6 rounded-2xl border border-primary/40 bg-card shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              {isCreating ? "Create New Package" : `Edit Package: ${editingPkg.name}`}
            </h3>
            <button
              onClick={() => {
                setEditingPkg(null);
                setIsCreating(false);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <input type="hidden" name="id" value={editingPkg.id} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Package Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingPkg.name}
                  required
                  placeholder="e.g. Standard Bundle V3"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Price (PKR)</label>
                <input
                  type="number"
                  name="pricePkr"
                  defaultValue={editingPkg.price_pkr}
                  required
                  min={1}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Badge Text (Optional)</label>
                <input
                  type="text"
                  name="badge"
                  defaultValue={editingPkg.badge || ""}
                  placeholder="e.g. Most Popular, Best Value"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Description</label>
              <input
                type="text"
                name="description"
                defaultValue={editingPkg.description}
                placeholder="Brief summary of target audience..."
                className="w-full px-3 py-2 rounded-xl bg-background border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">
                  Included Tools (1 per line)
                </label>
                <textarea
                  name="toolsIncluded"
                  rows={4}
                  defaultValue={editingPkg.tools_included.join("\n")}
                  placeholder="Helium 10 Diamond&#10;ChatGPT Plus&#10;Canva Pro"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border/80 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">
                  Marketing Features (1 per line)
                </label>
                <textarea
                  name="features"
                  rows={4}
                  defaultValue={editingPkg.features.join("\n")}
                  placeholder="Instant 1-Click Launch&#10;24/7 WhatsApp Support&#10;99.9% Uptime"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border/80 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  name="isPopular"
                  value="true"
                  defaultChecked={editingPkg.is_popular}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span>Mark as "Most Popular" Card</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  name="isActive"
                  value="true"
                  defaultChecked={editingPkg.is_active}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span>Active (Visible on public site)</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={() => {
                  setEditingPkg(null);
                  setIsCreating(false);
                }}
                className="px-4 py-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all shadow-glow disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Package"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`rounded-2xl border p-5 bg-card flex flex-col justify-between space-y-4 ${
              pkg.is_popular ? "border-primary/60 shadow-lg shadow-primary/5" : "border-border/80"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-base text-foreground flex items-center gap-1.5">
                    {pkg.name}
                    {pkg.is_popular && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-current" />
                        Popular
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{pkg.description}</p>
                </div>
              </div>

              <div className="text-xl font-extrabold text-foreground">
                PKR {pkg.price_pkr.toLocaleString()}
                <span className="text-xs font-normal text-muted-foreground"> / month</span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Included ({pkg.tools_included.length} tools):
                </span>
                <div className="flex flex-wrap gap-1">
                  {pkg.tools_included.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-muted text-foreground text-[10px] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
              <button
                type="button"
                onClick={() => handleEdit(pkg)}
                className="px-3 py-1.5 rounded-lg border border-border/70 hover:border-primary/40 text-foreground font-semibold text-xs flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5 text-primary" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(pkg.id, pkg.name)}
                className="px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 font-semibold text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

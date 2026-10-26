"use client";

import { useState, useMemo } from "react";
import { Tool, Category } from "@/types";
import { ToolCard } from "./tool-card";
import {
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Sparkles,
  X,
  Filter,
} from "lucide-react";

interface DirectoryFilterProps {
  initialTools: Tool[];
  categories: Category[];
  isSignedIn?: boolean;
}

export function DirectoryFilter({
  initialTools,
  categories,
  isSignedIn = false,
}: DirectoryFilterProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPricing, setSelectedPricing] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"popularity" | "newest" | "name">("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filtering & Sorting
  const filteredTools = useMemo(() => {
    let list = [...initialTools];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "all") {
      list = list.filter((t) => t.category_id === selectedCategory);
    }

    if (selectedPricing !== "all") {
      list = list.filter((t) => t.pricing_type.toLowerCase() === selectedPricing.toLowerCase());
    }

    if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // popularity
      list.sort(
        (a, b) =>
          (b.click_count || 0) + (b.favorite_count || 0) * 3 -
          ((a.click_count || 0) + (a.favorite_count || 0) * 3)
      );
    }

    return list;
  }, [initialTools, search, selectedCategory, selectedPricing, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedPricing("all");
    setSortBy("popularity");
  };

  const hasActiveFilters = search || selectedCategory !== "all" || selectedPricing !== "all";

  return (
    <div className="space-y-6">
      {/* Top Search & Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-border/80">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search AI tools by name, description, or tags (e.g. LLM, Code, Video)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode & Sorter */}
        <div className="flex items-center gap-2.5">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-background border border-border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="popularity">Sort by: Popularity</option>
            <option value="newest">Sort by: Newest</option>
            <option value="name">Sort by: Name (A-Z)</option>
          </select>

          <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              title="List view"
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-col gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            All Categories ({initialTools.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Pricing Pills */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Pricing:
            </span>
            {["all", "Free", "Freemium", "Paid", "Free Trial", "Open Source"].map((price) => (
              <button
                key={price}
                onClick={() => setSelectedPricing(price)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedPricing.toLowerCase() === price.toLowerCase()
                    ? "bg-foreground text-background"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {price === "all" ? "Any Pricing" : price}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-primary hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{filteredTools.length}</strong> of {initialTools.length} tools
        </span>
      </div>

      {/* Tools Display */}
      {filteredTools.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              : "space-y-3"
          }
        >
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              viewMode={viewMode}
              isSignedIn={isSignedIn}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border/80 bg-muted/20">
          <div className="w-12 h-12 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-1">No AI tools matched your filters</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
            Try adjusting your search query, selecting "All Categories", or removing pricing restrictions.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  toolId: string;
  initialFavorited?: boolean;
  initialCount?: number;
  isSignedIn?: boolean;
  className?: string;
}

export function FavoriteButton({
  toolId,
  initialFavorited = false,
  initialCount = 0,
  isSignedIn = false,
  className = "",
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      router.push("/login?redirect=tools");
      return;
    }

    if (loading) return;
    setLoading(true);

    // Optimistic update
    const nextState = !favorited;
    setFavorited(nextState);
    setCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await fetch("/api/tools/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId }),
      });

      if (!res.ok) {
        // Rollback
        setFavorited(!nextState);
        setCount((prev) => (nextState ? Math.max(0, prev - 1) : prev + 1));
      } else {
        const data = await res.json();
        setFavorited(data.isFavorited);
        setCount(data.count);
      }
    } catch {
      // Rollback on network error
      setFavorited(!nextState);
      setCount((prev) => (nextState ? Math.max(0, prev - 1) : prev + 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
        favorited
          ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
          : "bg-background/80 border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/80"
      } ${className}`}
      title={favorited ? "Remove from favorites" : "Save to favorites"}
      aria-label="Favorite tool"
    >
      <Heart
        className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
          favorited ? "fill-rose-500 text-rose-500" : ""
        }`}
      />
      <span>{count}</span>
    </button>
  );
}

import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI Hub — Modern AI Tools Directory",
    short_name: "AI Hub",
    description: "Discover, compare, and benchmark the best artificial intelligence tools, models, and workflows.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0d14",
    theme_color: "#6366f1",
  };
}

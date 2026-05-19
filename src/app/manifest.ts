import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Karen Alexandra",
    short_name: "Karen Alexandra",
    description: "A correspondence on the quiet luxuries. Fashion, travel and brand strategy.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4ee",
    theme_color: "#6d28d9",
    orientation: "portrait-primary",
    categories: ["lifestyle", "fashion", "travel"],
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
    ],
  };
}

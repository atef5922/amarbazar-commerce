import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function nextConfig(phase: string): NextConfig {
  return {
    // Keep development output isolated so running `next build` cannot corrupt
    // a live dev server's chunk graph.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    images: {
      remotePatterns: [
        { protocol: "https", hostname: "images.unsplash.com" },
        { protocol: "https", hostname: "images.pexels.com" },
        { protocol: "https", hostname: "dummyimage.com" }
      ]
    }
  };
}

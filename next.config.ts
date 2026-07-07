import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root (multiple lockfiles exist on this machine).
  turbopack: {
    root: import.meta.dirname,
  },
  // Uploaded media is served from Vercel Blob (prod) or /public/uploads (local).
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root (multiple lockfiles exist on this machine).
  turbopack: {
    root: import.meta.dirname,
  },
  // better-sqlite3 is a native module; keep it out of the bundler.
  serverExternalPackages: ["better-sqlite3"],
  // Uploaded product media lives under /public/uploads and is served locally.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray lockfile elsewhere doesn't confuse Turbopack.
  turbopack: { root: import.meta.dirname },
  // Allow loading dev resources (HMR, RSC) over 127.0.0.1 as well as localhost,
  // so the editor hydrates when opened via 127.0.0.1 (used to dodge other apps' cookies).
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;

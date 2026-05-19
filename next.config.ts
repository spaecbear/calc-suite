import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — required for Capacitor iOS/Android packaging
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true, // required for static export
  },
};

export default nextConfig;

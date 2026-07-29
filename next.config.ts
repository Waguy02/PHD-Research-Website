import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === "production" ? "/PHD-Research-Website" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/PHD-Research-Website/" : "",
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === "production" ? "/PHD-Research-Website" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/PHD-Research-Website/" : "",
};

export default nextConfig;

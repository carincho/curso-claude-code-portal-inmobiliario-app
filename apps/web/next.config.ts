import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@portal-inmobiliario/shared-types"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;

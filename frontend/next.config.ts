import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/v1/gallery/asset/**',
      },
      {
        protocol: 'https',
        hostname: 'https://visionaryblob.blob.core.windows.net/',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
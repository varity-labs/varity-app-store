import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Required for 4everland/IPFS deployment
  trailingSlash: true,
  images: {
    unoptimized: true,
    // Define remote patterns for external images (screenshots from Unsplash)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Enable compression (for non-static deployments)
  compress: true,
  // Optimize production builds - disable source maps for smaller bundles
  productionBrowserSourceMaps: false,
  // PoweredByHeader removal for security
  poweredByHeader: false,
  // Strict mode for React - helps catch issues early
  reactStrictMode: true,
  // Experimental performance optimizations
  experimental: {
    // Optimize package imports for tree-shaking - reduces bundle size
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },
  // Note: headers, rewrites, and redirects don't work with static export
  // For IPFS/4everland deployment, configure these at the CDN/hosting level
};

export default nextConfig;

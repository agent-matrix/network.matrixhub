/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimization
  reactStrictMode: true,

  // Enable SWC minification for better performance
  swcMinify: true,

  // Image optimization
  images: {
    domains: ['api.dicebear.com', 'picsum.photos'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  },

  // TypeScript and ESLint config
  typescript: {
    // Allow production builds to complete even if there are type errors
    ignoreBuildErrors: false,
  },
  eslint: {
    // Allow production builds to complete even if there are ESLint errors
    ignoreDuringBuilds: false,
  },

  // Rewrites for API proxy
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

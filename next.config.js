/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure allowed dev origins to fix CORS warnings  
  experimental: {
    allowedRevalidateHeaderKeys: ['x-revalidate']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
    ],
    // Fallback for older Next.js versions
    domains: ["image.tmdb.org"],
    // Disable image optimization on error for better development experience
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Configure development indicators
  devIndicators: {
    position: 'bottom-right',
  },
};

module.exports = nextConfig;

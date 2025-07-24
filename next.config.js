/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    allowedRevalidateHeaderKeys: ['x-revalidate'],
  },
  allowedDevOrigins: ['127.0.0.1', 'localhost', '*.replit.dev', '*.replit.co'],
  eslint: {
    ignoreDuringBuilds: true,
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
    domains: ["image.tmdb.org"],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  devIndicators: {
    position: 'bottom-right',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' *.youtube.com *.googleapis.com *.replit.dev;
              style-src 'self' 'unsafe-inline' fonts.googleapis.com;
              img-src 'self' data: blob: https: image.tmdb.org;
              font-src 'self' fonts.gstatic.com;
              connect-src 'self' *.themoviedb.org *.googleapis.com *.firebase.com *.firebaseapp.com *.replit.dev;
              frame-src 'self' *.youtube.com *.youtu.be;
              media-src 'self' *.youtube.com;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;

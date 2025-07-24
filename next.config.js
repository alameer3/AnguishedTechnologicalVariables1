/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    allowedRevalidateHeaderKeys: ['x-revalidate'],
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
              default-src 'self' 'unsafe-eval' 'unsafe-inline';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' *.youtube.com *.googleapis.com;
              style-src 'self' 'unsafe-inline' fonts.googleapis.com;
              img-src 'self' data: blob: https: image.tmdb.org rb.gy;
              font-src 'self' fonts.gstatic.com;
              connect-src 'self' *.themoviedb.org *.googleapis.com *.firebase.com *.firebaseapp.com;
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

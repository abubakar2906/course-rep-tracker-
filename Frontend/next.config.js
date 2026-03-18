/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.RAILWAY_API_URL + '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
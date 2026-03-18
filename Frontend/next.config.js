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
```

**2. Update** `Frontend/.env.production` (Vercel):
```
NEXT_PUBLIC_API_URL=
RAILWAY_API_URL=https://course-rep-production.up.railway.app
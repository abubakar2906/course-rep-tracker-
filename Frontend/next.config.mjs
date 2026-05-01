/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // Determine the backend URL.
    // If NEXT_PUBLIC_API_URL is set, use it (removing trailing slash if any).
    // Otherwise fallback to http://localhost:5000/api
    const destination = process.env.NEXT_PUBLIC_API_URL 
      ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/:path*`
      : 'http://localhost:5000/api/:path*';
      
    return [
      {
        source: '/api/:path*',
        destination,
      },
    ];
  },
}

export default nextConfig

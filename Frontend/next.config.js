module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://course-rep-production.up.railway.app/api/:path*',
      },
    ];
  },
};
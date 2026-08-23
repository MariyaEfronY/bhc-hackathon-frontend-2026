/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "https://bhc-hackathon-2026.vercel.app"}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

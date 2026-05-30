/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TypeScript errors caught locally; skip during Vercel production build.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['logo.clearbit.com'],
  },

  // Prevent ESLint warnings from breaking `next build` in Cloud Build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;   // ← For ESM, change to:  export default nextConfig;
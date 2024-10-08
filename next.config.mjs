/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    remotePatterns: [
      { hostname: 'source.unsplash.com' },
      { hostname: 'replicate.delivery' },
    ],
  },
}

export default nextConfig

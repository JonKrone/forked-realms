/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'source.unsplash.com' },
      { hostname: 'replicate.delivery' },
    ],
  },
}

export default nextConfig

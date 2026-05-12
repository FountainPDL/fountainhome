/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    qualities: [75, 85],
  },
 
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig

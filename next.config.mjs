/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",   // static export for Cloudflare Pages
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

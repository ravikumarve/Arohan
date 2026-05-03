/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@arohan/shared'],
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;

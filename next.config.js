const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: isProd ? '/feib' : '',
  assetPrefix: isProd ? '/feib' : '',
  images: {
    unoptimized: true,
  },
};

module.exports = withPWA(nextConfig);

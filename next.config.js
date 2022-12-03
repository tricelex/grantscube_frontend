/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.infura.io', 'infura-ipfs.io', 'grantscube.infura-ipfs.io'],
  },
  swcMinify: true,
};

module.exports = nextConfig;

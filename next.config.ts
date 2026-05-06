import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // eslint ignore is handled differently in Next 16, but we keep this for now or remove if it causes errors
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  experimental: {
    turbopack: {
      resolveAlias: {
        async_hooks: false,
      }
    }
  }
};

export default nextConfig;

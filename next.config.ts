/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Optimize MUI package imports (requires Next.js 13.4+ and MUI 5.13+)
  optimizePackageImports: ['@mui/material', '@mui/icons-material'],

  experimental: {
    esmExternals: 'loose', // Enables better support for ESM packages
  },

 webpack: (config:any) => {
    config.experiments = { ...config.experiments, topLevelAwait: true }
    return config
  },
};

module.exports = nextConfig;

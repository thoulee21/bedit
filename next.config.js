const StylexPlugin = require('@stylexjs/webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // StyleX plugin
    config.plugins.push(
      new StylexPlugin({
        filename: 'stylex-bundle.css',
        get: (prop) => {
          // 这里可以添加自定义的主题变量
          return prop;
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig; 
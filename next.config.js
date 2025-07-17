const { merchants, deploy } = require('./merchants.config');

const merchant = merchants[deploy];
const customDomain = merchant?.url && !merchant.url.includes('github.io');

// This is only needed for subfolder hosting (GitHub Pages default)
const subfolder = !customDomain && merchant?.name ? `/${merchant.name}` : '';

console.log('[next.config.js] DEPLOY_TARGET:', process.env.DEPLOY_TARGET);
console.log('[next.config.js] MERCHANT:', merchant?.name || 'undefined');
console.log('[next.config.js] basePath:', subfolder || '(root)');
console.log('[next.config.js] customDomain:', customDomain);

const nextConfig = {
  reactStrictMode: true,
  output: 'export',

  ...(subfolder && {
    basePath: subfolder,
    assetPrefix: subfolder + '/',
  }),

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  env: {
    SITE_URL: merchant?.url || '',
  },

  allowedDevOrigins: [
    'local.tiktok.soy',
    'http://localhost:3000',
    'https://tiktok.soy',
    'https://tiktok.soy:3000',
  ],

  webpack: (config, { defaultLoaders, isServer }) => {
    config.module.rules.push({
      test: /\.s?css$/,
      oneOf: [
        {
          resourceQuery: /raw/,
          use: ['style-loader', 'css-loader'],
        },
        {
          use: [
            defaultLoaders.babel,
            {
              loader: require('styled-jsx/webpack').loader,
              options: { type: 'scoped' },
            },
          ],
        },
      ],
    });

    if (!isServer) {
      config.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
        include: /node_modules/,
      });
    }

    return config;
  },
};

module.exports = nextConfig;

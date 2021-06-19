const path = require('path')
const withImages = require('next-images')

module.exports = withImages()

module.exports = {
  async headers() {
    return [
      {
        source: '/index',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          }
        ],
      },
    ]
  },
  trailingSlash: true,
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }

    return config
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  future: {
    webpack5: true,
  },
  webpack: function (config, options) {
    console.log('test webpack:', options.webpack.version);
    config.experiments = {};
    return config;
  },
}

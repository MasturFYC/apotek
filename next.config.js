// next.config.js
//const path = require('path')
const withImages = require('next-images')
/*
module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}
*/
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
}
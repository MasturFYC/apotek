const { createServer } = require('http')
const { URL } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const baseUrl = req.protocol + '://' + req.headers.host + '/';
    const parsedUrl = new URL(req.url, baseUrl); //, true)
    const { pathname, query } = parsedUrl

    //console.log(pathname, query)

    if (pathname === '/a') {
      app.render(req, res, '/a', query)
    } else if (pathname === '/category') {
      app.render(req, res, '/category', query)
      console.log(pathname)
    } else {
      handle(req, res, pathname); // parsedUrl)
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

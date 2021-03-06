const http = require('http');
const httpProxy = require('http-proxy');
const config = require('./config');
const proxy = httpProxy.createProxyServer({});

// Custom server redirect logic before proxying requests.
function redirectOrProxy(request, response) {
  if (config.proxyRoutesConfig.hasOwnProperty(request.headers.host)) {
    proxy.web(request, response, {
      target: config.proxyRoutesConfig[request.headers.host]
    });
  } else {
    // Redirect other domains to olegskl.com:
    response.writeHead(302, {Location: 'http://olegskl.com'});
    response.end('Redirecting to http://olegskl.com ...');
  }
}

// Establish the proxy server with given options,
// and export it for clustering purposes:
module.exports = http
  .createServer(redirectOrProxy)
  .listen(config.proxyPort);

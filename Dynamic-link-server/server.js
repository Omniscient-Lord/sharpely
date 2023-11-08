const express = require('express');
const app = express();
const config = require('./config.json');

const defaultRouteHandler = (req, res) => {
  const route = findRoute(req.path, req.method);
  if (route) {
    const redirectUrl = isAppInstalled(req) ? route.appRedirect : route.defaultRedirect;
    res.redirect(redirectUrl);
  } else {
    res.send('Server is running.');
  }
};

function isAppInstalled(req) {
  const userAgent = req.headers['user-agent'];
  return /iOS|Android/i.test(userAgent); //used very basic simulation
}

const port = config.port || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function findRoute(path, method) {
  return config.routes.find((route) => route.path === path && route.method === method);
}

config.routes.forEach((route) => {
  const { path, method } = route;
  app[method.toLowerCase()](path, defaultRouteHandler);
});

require('babel-core/register');

const http = require('http');
const bootstrapApp = require('./src');

bootstrapApp().then(function(app) {
  http.createServer(app.callback()).listen(process.env.PORT);
});

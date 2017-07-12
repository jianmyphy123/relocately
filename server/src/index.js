require('dotenv').config({
  path: `${__dirname}/../config`
});

const Koa = require('koa');
const logger = require('koa-logger');
const cors = require('kcors');
const serve = require('koa-static');
const mount = require('koa-mount');

function bootstrapApp() {
  const runMigrations = require('./db/migrations');

  return runMigrations().then(function() {
    const db = require('./db');
    const routes = require('./routes');

    const app = new Koa();

    app.context.db = db;
    app.use(logger());
    app.use(cors());

    app.use(mount('/docs', serve(`${__dirname}/docs`)));

    app.use(async function(ctx, next) {
      ctx.set('Content-Type', 'application/json');
      ctx.set('Cache-Control', 'private, no-cache, no-store, must-revalidate, proxy-revalidate');
      ctx.set('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT');
      ctx.set('Pragma', 'no-cache');
      ctx.set('Surrogate-Control', 'no-store');

      await next();
    });

    app.use(routes);

    app.use(ctx => {
      ctx.body = {
        details: 'Not found'
      };
      ctx.status = 404;
    });

    return app;
  })
}

module.exports = bootstrapApp;

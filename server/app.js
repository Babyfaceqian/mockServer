import Koa from 'koa';
import path from 'path';
const app = new Koa();
import webpack from 'webpack';
import koaWebpack from 'koa-webpack';
import webpackConfig from '../webpack/config.common';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import cors from 'koa-cors';

async function start() {
  try {
    let compiler = webpack(webpackConfig);
    const middleware = await koaWebpack({ compiler });

    app.use(middleware);

    app.use(async (ctx, next) => {
      // console.log('ctx', ctx);
      if (ctx.url === '/') {
        const filename = path.resolve(webpackConfig.output.path, 'index.html')
        ctx.response.type = 'html'
        ctx.response.body = middleware.devMiddleware.fileSystem.createReadStream(filename)
      }
      await next();
    });

    app.use(cors({
      origin: function (ctx) {
        return ""; // 替换域名
      },
      // exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
      // maxAge: 5,
      credentials: true, // 如果客户端开启 credential，则要设置为 true
      // allowMethods: ['GET', 'POST', 'DELETE'],
      // allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    }))
    app.use(logger())
    app.use(bodyParser());
    const router = require('./router/router')()
    app.use(router.routes())
      .use(router.allowedMethods());

    app.listen(3000);
  } catch (e) {
    console.log(e)
  }
}
start();
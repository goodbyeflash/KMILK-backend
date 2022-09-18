require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import https from 'https';
import fs from 'fs';

import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';

// 비구조화 할당을 통해 process.env 내부 값에 대한 레퍼런스 만들기
const { PORT, MONGO_URI, SSL_PATH } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((e) => {
    console.error(e);
  });

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes()); // api 라우트 적용

app.use(async (ctx, next) => {
  const corsWhitelist = [
    'http://localhost:8080',
    //'http://www.publicdesign.co.kr',
  ];
  if (corsWhitelist.indexOf(ctx.request.headers.origin) !== -1) {
    ctx.set('Access-Control-Allow-Origin', ctx.request.headers.origin);
    ctx.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Set-Cookie, Last-Page',
    );
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, DELETE, PATCH');
    ctx.set('Access-Control-Allow-Credentials', true);
    ctx.set('Access-Control-Expose-Headers', 'Last-Page');
  }
  await next();
});

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

// // PORT가 지정되어 있지 않다면 4000을 사용
const port = PORT || 4000;

if (SSL_PATH) {
  const option = {
    key: fs.readFileSync(`${SSL_PATH}/kmilk_com.key`),
    cert: fs.readFileSync(`${SSL_PATH}/kmilk__crt.pem`),
    ca: fs.readFileSync(`${SSL_PATH}/kmilk__ca.pem`),
  };
  // Https 적용
  let serverCallback = app.callback();
  try {
    var httpsServer = https.createServer(option, serverCallback);
    httpsServer.listen(port, (err) => {
      if (err) {
        console.error('HTTPS server FAIL: ', err, err && err.stack);
      } else {
        console.log(`HTTPS server OK!`);
      }
    });
  } catch (ex) {
    console.error('Failed to start HTTPS server\n', ex, ex && ex.stack);
  }
} else {
  app.listen(port, () => {
    console.log('📋 Listening to port %d', port);
  });
}

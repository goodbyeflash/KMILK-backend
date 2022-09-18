import Router from 'koa-router';
import admin from './admin';
import excel from './excel';

const api = new Router();

api.use('/admin', admin.routes());
api.use('/excel', excel.routes());

// 라우터를 내보냅니다.
export default api;

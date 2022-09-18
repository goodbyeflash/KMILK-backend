import Router from 'koa-router';
import admin from './admin';
import excel from './excel';
import event1 from './event1';
import event2 from './event2';

const api = new Router();

api.use('/admin', admin.routes());
api.use('/excel', excel.routes());
api.use('/event1', event1.routes());
api.use('/event2', event2.routes());

// 라우터를 내보냅니다.
export default api;

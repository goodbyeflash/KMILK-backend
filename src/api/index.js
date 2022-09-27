import Router from 'koa-router';
import admin from './admin';
import excel from './excel';
import event1 from './event1';
import event2 from './event2';
import visitant from './visitant';
import view from './view';

const api = new Router();

api.use('/admin', admin.routes());
api.use('/excel', excel.routes());
api.use('/event1', event1.routes());
api.use('/event2', event2.routes());
api.use('/visitant', visitant.routes());
api.use('/view', view.routes());

// 라우터를 내보냅니다.
export default api;

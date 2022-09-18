import Router from 'koa-router';
import * as adminCtrl from './admin.ctrl';

const admins = new Router();

// Auth
admins.post('/register', adminCtrl.register);
admins.post('/login', adminCtrl.login);
admins.get('/check', adminCtrl.check);
admins.post('/logout', adminCtrl.logout);

export default admins;

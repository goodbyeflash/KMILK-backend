import Router from 'koa-router';
import * as viewCtrl from './view.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const view = new Router();

view.post('/', checkLoggedIn, viewCtrl.list);
view.get('/', viewCtrl.write);

export default view;

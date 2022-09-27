import Router from 'koa-router';
import * as visitantCtrl from './visitant.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const visitant = new Router();

visitant.post('/', checkLoggedIn, visitantCtrl.list);
visitant.get('/', visitantCtrl.write);

export default visitant;

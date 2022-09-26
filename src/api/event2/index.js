import Router from 'koa-router';
import * as event2Ctrl from './event2.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const event2 = new Router();

event2.get('/', checkLoggedIn, event2Ctrl.list);
event2.post('/', event2Ctrl.write);
event2.post('/find', checkLoggedIn, event2Ctrl.find);
event2.delete('/:_id', checkLoggedIn, event2Ctrl.remove);
event2.get('/count', event2Ctrl.count);

export default event2;

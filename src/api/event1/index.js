import Router from 'koa-router';
import * as event1Ctrl from './event1.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const event1 = new Router();

event1.get('/', checkLoggedIn, event1Ctrl.list);
event1.post('/', event1Ctrl.write);
event1.post('/find', checkLoggedIn, event1Ctrl.find);
event1.delete('/:_id', checkLoggedIn, event1Ctrl.remove);

export default event1;

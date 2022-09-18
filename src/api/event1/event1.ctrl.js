import Event1 from '../../models/event1';
import Joi from '@hapi/joi';
import requsetIp from 'request-ip';

/*
  GET /api/event1?page=
*/
export const list = async (ctx) => {
  // query는 문자열이기 때문에 숫자로 변환해 주어야 합니다.
  // 값이 주어지지 않았다면 1을 기본으로 사용합니다.
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const event1 = await Event1.find({})
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec();
    const count = await Event1.countDocuments({}).exec();
    ctx.set('Last-Page', Math.ceil(count / 10));
    ctx.body = event1.map((event1) => event1.toJSON());
  } catch (error) {
    ctx.throw(500, error);
  }
};
/*
  POST /api/event1
  {
    "name" : "홍길동",
    "hp" : "01011112222",
    "address" : "서울시 중랑구",
    "url" : "www.google.com",
    "privacy" : "동의"
  }
 */
export const write = async (ctx) => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    name: Joi.string().required(), // required()가 있으면 필수 항목
    hp: Joi.string().alphanum().min(10).max(11).required(),
    address: Joi.string().required(),
    url: Joi.string().required(),
    privacy: Joi.string().required(),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  const { name, hp, address, url, privacy } = ctx.request.body;

  try {
    // hp가 이미 존재하는지 확인
    const exists = await Event1.findByHp(hp);
    if (exists) {
      ctx.status = 409; // Confict
      return;
    }

    const ip = requsetIp.getClientIp(ctx.request);

    const event1 = new Event1({
      name,
      hp,
      address,
      url,
      privacy,
      ip,
    });

    await event1.save();
    ctx.body = event1;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  POST /api/event1/find?page=
  {
    "name" : "김"
  }
*/
export const find = async (ctx) => {
  const body = ctx.request.body || {};
  if (Object.keys(body).length > 0) {
    const key = Object.keys(body)[0];
    body[key] = { $regex: '.*' + body[key] + '.*' };
  }
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const event1 = await Event1.find(body)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec();
    const count = await Event1.countDocuments(body).exec();
    ctx.set('Last-Page', Math.ceil(count / 10));
    ctx.body = event1.map((event1) => event1.toJSON());
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  DELETE /api/event1/:_id
*/
export const remove = async (ctx) => {
  const { _id } = ctx.params;
  try {
    await Event1.findByIdAndRemove(_id).exec();
    ctx.status = 204; // No Content (성공하기는 했지만 응답할 데이터는 없음)
  } catch (error) {
    ctx.throw(500, error);
  }
};

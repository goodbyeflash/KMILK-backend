import Visitant from '../../models/visitant';
import requsetIp from 'request-ip';
import moment from 'moment';

/*
  POST /api/visitant
  {
    "dateGte" : "2022-09-01",
    "dateLte" : "2022-09-30"
  }
*/
export const list = async (ctx) => {
  const body = ctx.request.body || {};

  try {
    const aggregate = await Visitant.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(body.dateGte),
            $lte: new Date(body.dateLte),
          },
        },
      },
      {
        $group: {
          _id: '$date',
          count: {
            $sum: 1,
          },
        },
      },
    ]);
    ctx.body = aggregate;
  } catch (error) {
    ctx.throw(500, error);
  }
};

/*
  GET /api/visitant
 */
export const write = async (ctx) => {
  try {
    let ip = requsetIp.getClientIp(ctx.request);
    const date = moment().format('YYYY-MM-DD');

    if (ip.indexOf('::ffff:') > -1) {
      ip = ip.replace('::ffff:', '');
    }

    // 날짜,IP가 이미 존재하는지 확인
    const exists = await Visitant.find({
      date: date,
      ip: ip,
    });

    if (exists.length > 0) {
      ctx.status = 409; // Confict
      return;
    }

    const visitant = new Visitant({
      ip,
      date,
    });

    await visitant.save();
    ctx.body = visitant;
  } catch (error) {
    ctx.throw(500, error);
  }
};

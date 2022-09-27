import View from '../../models/view';
import moment from 'moment';

/*
  POST /api/view
  {
    "dateGte" : "2022-09-01",
    "dateLte" : "2022-09-30"
  }
*/
export const list = async (ctx) => {
  const body = ctx.request.body || {};

  try {
    const aggregate = await View.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(body.dateGte),
            $lte: new Date(body.dateLte),
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
  GET /api/view
 */
export const write = async (ctx) => {
  try {
    let count = 1;
    const date = moment().format('YYYY-MM-DD');

    // 날짜 기준 카운트 조회 이미 존재하는지 확인
    const exists = await View.find({
      date: date,
    });

    if (exists.length > 0) {
      count = parseInt(exists[0].count) + 1;
      const updateContent = await View.findByIdAndUpdate(
        exists[0].id,
        {
          count,
          date,
        },
        {
          new: true, // 이 값을 설정하면 업데이트된 데이터를 반환합니다.
          // false일 때는 업데이트되기 전의 데이터를 반환합니다.
        },
      ).exec();
      if (!updateContent) {
        ctx.status = 404;
        return;
      }
      ctx.body = updateContent;
      return;
    }

    count = count.toString();

    const view = new View({
      count,
      date,
    });

    await view.save();
    ctx.body = view;
  } catch (error) {
    ctx.throw(500, error);
  }
};

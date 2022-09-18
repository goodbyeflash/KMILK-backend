import mongoose, { Schema } from 'mongoose';
import moment from 'moment';

const event1Schema = new Schema({
  name: String,
  hp: String,
  address: String,
  url: String,
  privacy: String,
  ip: String,
  publishedDate: {
    type: Date,
    default: moment().format(),
  },
});

event1Schema.statics.findByHp = function (hp) {
  return this.findOne({ hp });
};

const Event1 = mongoose.model('Event1', event1Schema);
export default Event1;

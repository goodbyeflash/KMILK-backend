import mongoose, { Schema } from 'mongoose';
import moment from 'moment';

const event2Schema = new Schema({
  name: String,
  hp: String,
  privacy: String,
  ip: String,
  publishedDate: {
    type: Date,
    default: moment().format(),
  },
});

event2Schema.statics.findByHp = function (hp) {
  return this.findOne({ hp });
};

const Event2 = mongoose.model('Event2', event2Schema);
export default Event2;

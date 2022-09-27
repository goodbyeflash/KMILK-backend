import mongoose, { Schema } from 'mongoose';

const viewSchema = new Schema({
  count: String,
  date: Date,
});

const View = mongoose.model('view', viewSchema);
export default View;

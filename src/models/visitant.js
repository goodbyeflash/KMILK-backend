import mongoose, { Schema } from 'mongoose';

const visitantSchema = new Schema({
  ip: String,
  date: Date,
});

const Visitant = mongoose.model('visitant', visitantSchema);
export default Visitant;

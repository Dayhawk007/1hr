import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatarUrl: { type: String },
  type: { type: String, enum: ['admin', 'client', 'sub-vendor'], required: true },
});

export default mongoose.model('User', userSchema);

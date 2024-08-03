import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  avatarUrl: String,
});

export default mongoose.model('Clients', clientSchema);

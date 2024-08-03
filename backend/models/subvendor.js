import mongoose from 'mongoose';

const subVendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  servicesOffered: [{ type: String, required: true }],
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, // Reference to Client model
});

export default mongoose.model('SubVendor', subVendorSchema);

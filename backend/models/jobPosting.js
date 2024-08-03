import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, // Reference to Client model
  location: { type: String, required: true },
  applicationDeadline: { type: Date, required: true },
  compensationStart: { type: Number, required: true },
  compensationEnd: { type: Number, required: true },
  
});

export default mongoose.model('JobPosting', jobApplicationSchema);

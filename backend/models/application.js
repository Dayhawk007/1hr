import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Clients' }, // Reference to Client model
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting' }, // Reference to Job model
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  status: { type: String, required: true, enum: ['pre-screen', 'screen', 'pre-interview' ,'round 1', 'round 2', 'round 3', 'hired', 'rejected']},
  currentCTC: { type: Number, required: true },
  expectedCTC: { type: Number, required: true },
  totalExperience: { type: String, required: true },
  relevantExperience: { type: String, required: true },
  noticePeriod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Application', applicationSchema);

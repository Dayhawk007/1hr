import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ['text', 'checkbox', 'radio', 'select'], required: true },
  answers: [{ type: String }],
  multiple: { type: Boolean, default: false },
});

const jobPostingQuestionsSchema = new mongoose.Schema({
  jobPosting: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting', required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
});

export default mongoose.model('JobPostingQuestions', jobPostingQuestionsSchema);

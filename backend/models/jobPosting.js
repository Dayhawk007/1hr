import mongoose from 'mongoose';

const jobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  clientReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  applicationDeadline: {
    type: Date,
    required: true,
  },
  compensationStart: {
    type: Number,
    required: true,
  },
  compensationEnd: {
    type: Number,
    required: true,
  },
  experienceRange: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true,
      },
      questionType: {
        type: String,
        enum: ['text', 'multiple-choice'],
        required: true,
      },
      options: [
        {
          type: String,
          required: function() {
            return this.questionType === 'multiple-choice';
          },
        },
      ],
    },
  ],
});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

export default JobPosting

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
  mode:{
    type: String,
    enum: ['Hybrid', 'WFO', 'WFH'],
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
  rounds: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        stage: {
          type: String,
          enum: ['stage 1', 'stage 2', 'hired', 'rejected'],
          required: true,
        },
      },
    ],
    default: [
      { name: 'pre-screen', stage: 'stage 1' },
      { name: 'pre-screen-rejected', stage: 'stage 1' },
      { name: 'pre-interview', stage: 'stage 1' },
      { name: 'hired', stage: 'hired' },
      { name: 'rejected', stage: 'rejected' },
    ],
  },
});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

export default JobPosting

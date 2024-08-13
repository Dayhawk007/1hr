import express from 'express';
import { body, validationResult } from 'express-validator';
import JobPosting from '../models/jobPosting.js';

const router = express.Router();

// GET all job postings
router.get('/', async (req, res) => {
  try {
    const jobPostings = await JobPosting.find().populate('clientReference');
    res.json(jobPostings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job postings', error: error.message });
  }
});

// GET a single job posting by ID
router.get('/:id', async (req, res) => {
  try {
    const jobPosting = await JobPosting.findById(req.params.id).populate('clientReference');
    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    res.json(jobPosting);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job posting', error });
  }
});

// POST a new job posting with validation
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('clientReference').notEmpty().withMessage('Client Reference is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('applicationDeadline').isDate().withMessage('Application deadline must be a valid date'),
    body('compensationStart').isNumeric().withMessage('Compensation start must be a number'),
    body('compensationEnd').isNumeric().withMessage('Compensation end must be a number'),
    // Validation for questions
    body('questions').optional().isArray().withMessage('Questions must be an array'),
    body('questions.*.questionText').notEmpty().withMessage('Question text is required'),
    body('questions.*.questionType').isIn(['text', 'multiple-choice']).withMessage('Invalid question type'),
    body('questions.*.options').optional().isArray().withMessage('Options must be an array'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const jobPosting = new JobPosting(req.body);
      await jobPosting.save();
      res.status(201).json(jobPosting);
    } catch (error) {
      res.status(500).json({ message: 'Error creating job posting', error });
    }
  }
);

// PATCH (update) an existing job posting
router.patch(
  '/:id',
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('client').optional().notEmpty().withMessage('Client cannot be empty'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty'),
    body('applicationDeadline').optional().isDate().withMessage('Application deadline must be a valid date'),
    body('compensationStart').optional().isNumeric().withMessage('Compensation start must be a number'),
    body('compensationEnd').optional().isNumeric().withMessage('Compensation end must be a number'),
    // Validation for questions
    body('questions').optional().isArray().withMessage('Questions must be an array'),
    body('questions.*.questionText').optional().notEmpty().withMessage('Question text is required'),
    body('questions.*.questionType').optional().isIn(['text', 'multiple-choice']).withMessage('Invalid question type'),
    body('questions.*.options').optional().isArray().withMessage('Options must be an array'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const jobPosting = await JobPosting.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!jobPosting) {
        return res.status(404).json({ message: 'Job posting not found' });
      }
      res.json(jobPosting);
    } catch (error) {
      res.status(500).json({ message: 'Error updating job posting', error });
    }
  }
);

// DELETE a job posting
router.delete('/:id', async (req, res) => {
  try {
    const jobPosting = await JobPosting.findByIdAndDelete(req.params.id);
    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    res.json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job posting', error });
  }
});

export { router as jobPostingRouter };
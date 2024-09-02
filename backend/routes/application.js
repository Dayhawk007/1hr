import express from 'express';
import Application from '../models/application.js';

const router = express.Router();


// GET all applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().populate('job');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// GET a single application by ID
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application', error });
  }
});

// POST a new application
router.post('/', async (req, res) => {
  try {
    const application = new Application({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      pincode: req.body.pincode,
      resumeUrl: req.body.resumeUrl,
      status: req.body.status,
      currentCTC: req.body.currentCTC,
      expectedCTC: req.body.expectedCTC,
      totalExperience: req.body.totalExperience,
      relevantExperience: req.body.relevantExperience,
      noticePeriod: req.body.noticePeriod,
      job: req.body.job,
    });
    const newApplication = await application.save();
    res.status(201).json(newApplication);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE an application
router.patch('/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error updating application', error });
  }
});

// DELETE an application
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting application', error });
  }
});


export { router as applicationRouter };
import express from 'express';
import { auth ,checkUserType} from '../auth/auth.js';
import Client from '../models/client.js';
import SubVendor from '../models/subvendor.js';
import JobPosting from '../models/jobPosting.js';

const router = express.Router();

router.post('/addClient', auth,checkUserType, async (req, res) => {
  try {
    const client = new Client({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      avatarUrl: req.body.avatarUrl,
    });
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/addJobPosting', auth, checkUserType, async (req, res) => {
  try {
    const job = new JobPosting({
      title: req.body.title,
      description: req.body.description,
      client: req.body.client,
      location: req.body.location,
      applicationDeadline: req.body.applicationDeadline,
      compensationStart: req.body.compensationStart,
      compensationEnd: req.body.compensationEnd,
    });
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/addSubVendor', auth, async (req, res) => {
  try {
    const subVendor = new SubVendor({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      avatarUrl: req.body.avatarUrl,
    });
    const newSubVendor = await subVendor.save();
    res.status(201).json(newSubVendor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export { router as adminRouter };

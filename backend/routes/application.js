import express from "express";
import Application from "../models/application.js";

const router = express.Router();

// GET all applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().populate("job");
    res.json(applications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching applications", error: error.message });
  }
});

// GET a single application by ID
router.get("/:id", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("client");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Error fetching application", error });
  }
});

// POST a new application
router.post("/", async (req, res) => {
  // Define required fields
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'city',
    'state',
    'country',
    'pincode',
    'job'
  ];

  // Check for missing required fields
  const missingFields = requiredFields.filter(field => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  // Check if an application with the same email already exists
  const existingApplication = await Application.findOne({
    email: req.body.email,
  });

  try {
    if (existingApplication) {
      return res.status(201).json({ message: "duplicate" });
    }

    const application = new Application({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      pincode: req.body.pincode,
      resumeUrl: req.body.resumeUrl || null,
      portfolioUrl: req.body.portfolioUrl || null,
      status: req.body.status || 'new',
      currentCTC: req.body.currentCTC || null,
      expectedCTC: req.body.expectedCTC || null,
      totalExperience: req.body.totalExperience || null,
      relevantExperience: req.body.relevantExperience || null,
      noticePeriod: req.body.noticePeriod || null,
      job: req.body.job,
      client: req.body.client || null,
      subVendor: req.body.subVendor || null,
    });
    const newApplication = await application.save();
    res.status(201).json(newApplication);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    // Extract feedback and status from req.body
    const { feedback, status, oldStatus, ...updateFields } = req.body;

    // Create the new feedback object
    const newFeedback = {
      round: oldStatus,
      feedbackText: feedback,
    };

    // Find the application and update all fields except feedback
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        ...updateFields,
        status: status, // ensure status is updated
      },
      { new: true }
    );

    // If no application found
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if feedback for the round already exists
    const existingFeedbackIndex = application.feedback.findIndex(
      (f) => f.round === status
    );

    if (existingFeedbackIndex !== -1) {
      // Update the existing feedback for the round
      application.feedback[existingFeedbackIndex].feedbackText = feedback;
    } else {
      // Append the new feedback if no existing feedback is found
      application.feedback.push(newFeedback);
    }

    // Save the updated application
    await application.save();

    // Return the updated application with feedback changes
    res.json(application);
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Error updating application", error });
  }
});

// DELETE an application
router.delete("/:id", async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json({ message: "Application deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting application", error });
  }
});

export { router as applicationRouter };

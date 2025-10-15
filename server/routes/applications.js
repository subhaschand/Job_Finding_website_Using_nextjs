const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const Job = require('../models/Job'); // Add this line
const { protect, candidate, employer } = require('../middleware/authMiddleware');

// --- Multer Configuration for file uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this 'uploads' directory exists
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid conflicts
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });
// ---------------------------------------------

// POST /api/applications/:jobId/apply (Protected, Candidate only)
router.post('/:jobId/apply', protect, upload.single('resume'), async (req, res) => {
  if (req.user.role !== 'candidate') {
    return res.status(403).json({ message: 'Access denied. Candidates only.' });
  }

  try {
    const newApplication = new Application({
      job: req.params.jobId,
      candidate: req.user.id,
      resume: req.file.path, // Save the path to the uploaded file
    });

    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/applications/my-apps (Protected, Candidate only)
router.get('/my-apps', protect, candidate, async (req, res) => {
    try {
        const applications = await Application.find({ candidate: req.user.id }).populate('job', 'title company');
        res.json(applications);
    } catch (error) {
        console.error(error); // Make sure you are logging the error
        res.status(500).json({ message: 'Server Error' });
    }
});

// NOTE: Routes for GETTING applications would also use the 'protect' middleware
// and check roles to ensure candidates only see their apps and employers only
// see applicants for their jobs.

// @desc    Get all applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private/Employer
router.get('/job/:jobId', protect, employer, async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Ensure the person requesting is the one who posted the job
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate('candidate', 'name email'); // Populate candidate info

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
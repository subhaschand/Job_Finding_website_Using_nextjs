const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');

// POST /api/jobs (Protected, Employer only)
router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Access denied. Employers only.' });
  }

  const { title, company, description, location, salary } = req.body;

  try {
    const newJob = new Job({
      title,
      company,
      description,
      location,
      salary,
      postedBy: req.user.id, // Link the job to the logged-in employer
    });

    const job = await newJob.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/jobs (Public)
router.get('/', async (req, res) => {
  try {
    const { keyword, location } = req.query;
    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    // .populate() fetches the employer's name from the User collection
    const jobs = await Job.find(query).populate('postedBy', 'name');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/jobs/:id (Public)
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Employer
router.put('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Make sure user is the owner of the job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Employer
router.delete('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Make sure user is the owner of the job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await job.deleteOne();

    res.json({ message: 'Job removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
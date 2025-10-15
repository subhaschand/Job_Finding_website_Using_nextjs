// server/models/Job.js

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
  },
  companyLogo: { type: String },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId, // This is a foreign key
    ref: 'User', // It references the 'User' model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the creation date
  },
});

module.exports = mongoose.model('Job', jobSchema);
// New index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); // <-- ADD THIS LINE

// --- Import your route files ---
const authRoutes = require('./routes/auth'); // <-- ADD THIS LINE
const jobRoutes = require('./routes/jobs'); // <-- ADD THIS LINE
const applicationRoutes = require('./routes/applications'); // <-- ADD THIS LINE

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- Connect your routes to the app ---
app.use('/api/auth', authRoutes); // <-- ADD THIS LINE
app.use('/api/jobs', jobRoutes); // <-- ADD THIS LINE
app.use('/api/applications', applicationRoutes); // <-- ADD THIS LINE

// Make the 'uploads' folder publicly accessible for resumes
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // <-- ADD THIS LINE

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
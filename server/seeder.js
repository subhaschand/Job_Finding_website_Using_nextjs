const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { users, jobs } = require('./data/dummyData');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();
    try {
        // Clear existing data
        await User.deleteMany();
        await Job.deleteMany();
        await Application.deleteMany();

        // Insert users and get the employer's ID
        const createdUsers = await User.insertMany(users);
        const employerUser = createdUsers.find(user => user.role === 'employer');

        // Assign the employer's ID to each job
        const sampleJobs = jobs.map(job => {
            return { ...job, postedBy: employerUser._id };
        });

        // Insert jobs
        await Job.insertMany(sampleJobs);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    await connectDB();
    try {
        await User.deleteMany();
        await Job.deleteMany();
        await Application.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
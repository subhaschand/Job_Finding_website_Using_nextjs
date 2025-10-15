const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync('123456', salt);

const users = [
    {
        name: 'Tech Corp HR',
        email: 'employer@example.com',
        password: hashedPassword,
        role: 'employer',
        avatar: 'https://i.pravatar.cc/150?u=employer@example.com', // Added avatar
    },
    {
        name: 'Jane Doe',
        email: 'candidate1@example.com',
        password: hashedPassword,
        role: 'candidate',
        avatar: 'https://i.pravatar.cc/150?u=candidate1@example.com', // Added avatar
    },
    {
        name: 'John Smith',
        email: 'candidate2@example.com',
        password: hashedPassword,
        role: 'candidate',
        avatar: 'https://i.pravatar.cc/150?u=candidate2@example.com', // Added avatar
    },
];

const jobs = [
    {
        title: 'Full Stack Developer',
        company: 'Innovate Tech',
        description: 'Seeking a skilled full stack developer proficient in the MERN stack.',
        location: 'Remote',
        salary: 120000,
        companyLogo: 'https://picsum.photos/seed/innovate/200', // Added logo
    },
    {
        title: 'UX/UI Designer',
        company: 'Creative Minds',
        description: 'Creative Minds is looking for a talented designer to create amazing user experiences.',
        location: 'Mumbai, India',
        salary: 95000,
        companyLogo: 'https://picsum.photos/seed/creative/200', // Added logo
    },
    {
        title: 'Data Scientist',
        company: 'Quantum Analytics',
        description: 'Join our team to analyze large datasets and build predictive models.',
        location: 'Bengaluru, India',
        salary: 140000,
        companyLogo: 'https://picsum.photos/seed/quantum/200', // Added logo
    }
];

module.exports = { users, jobs };
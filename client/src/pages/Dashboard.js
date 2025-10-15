import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/Modal'; // Import the Modal component
import '../components/Modal.css'; // Import the Modal CSS

const EmployerDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [formData, setFormData] = useState({ title: '', company: '', description: '', location: '', salary: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const token = localStorage.getItem('token');

    const fetchPostedJobs = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/jobs');
            const user = jwtDecode(token);
            setJobs(res.data.filter(job => job.postedBy._id === user.id));
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    }, [token]);

    useEffect(() => {
        if (token) fetchPostedJobs();
    }, [token, fetchPostedJobs]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/jobs', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchPostedJobs();
            setFormData({ title: '', company: '', description: '', location: '', salary: '' });
        } catch (error) {
            console.error("Error posting job:", error);
        }
    };

    const viewApplicants = async (job) => {
        setSelectedJob(job);
        try {
            const { data } = await axios.get(`http://localhost:5000/api/applications/job/${job._id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setApplicants(data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching applicants:", error);
        }
    };

    return (
        <div>
            <div className="form-container card">
                <h2>Post a New Job</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group"><input type="text" name="title" value={formData.title} onChange={onChange} placeholder="Job Title" required /></div>
                    <div className="form-group"><input type="text" name="company" value={formData.company} onChange={onChange} placeholder="Company Name" required /></div>
                    <div className="form-group"><textarea name="description" value={formData.description} onChange={onChange} placeholder="Job Description" required></textarea></div>
                    <div className="form-group"><input type="text" name="location" value={formData.location} onChange={onChange} placeholder="Location" required /></div>
                    <div className="form-group"><input type="number" name="salary" value={formData.salary} onChange={onChange} placeholder="Salary (Optional)" /></div>
                    <button type="submit" className="btn btn-block">Post Job</button>
                </form>
            </div>

            <h2>Your Posted Jobs</h2>
            {jobs.map(job => (
                <div key={job._id} className="card">
                    <h3>{job.title}</h3>
                    <p>{job.company} - {job.location}</p>
                    <button onClick={() => viewApplicants(job)} className="btn">View Applicants</button>
                </div>
            ))}

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {selectedJob && (
                    <>
                        <h2>Applicants for {selectedJob.title}</h2>
                        {applicants.length > 0 ? (
                            applicants.map(app => (
                                <div key={app._id} className="applicant-card">
                                    <p><strong>Candidate:</strong> {app.candidate.name} ({app.candidate.email})</p>
                                    <p><strong>Applied At:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                                    <a href={`http://localhost:5000/${app.resume}`} target="_blank" rel="noopener noreferrer" className="btn">View Resume</a>
                                </div>
                            ))
                        ) : (
                            <p>No applicants yet.</p>
                        )}
                    </>
                )}
            </Modal>
        </div>
    );
};

const CandidateDashboard = () => {
    const [applications, setApplications] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const fetchApps = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/applications/my-apps', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setApplications(res.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    }, [token, navigate]);

    useEffect(() => {
        if (token) {
            fetchApps();
        } else {
            navigate('/login');
        }
    }, [token, fetchApps, navigate]);

    return (
        <div>
            <h2>Your Applications</h2>
            {applications.length > 0 ? (
                applications.map(app => (
                    <div key={app._id} className="card">
                        <h3>{app.job.title}</h3>
                        <p><strong>Company:</strong> {app.job.company}</p>
                        <p><strong>Status:</strong> <span className={`status status-${app.status}`}>{app.status}</span></p>
                        <p><strong>Applied On:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                ))
            ) : (
                <p>You haven't applied to any jobs yet.</p>
            )}
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const user = jwtDecode(token);
                setUserRole(user.role);
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('token');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="container">
            <h1>Dashboard</h1>
            {userRole === 'employer' && <EmployerDashboard />}
            {userRole === 'candidate' && <CandidateDashboard />}
        </div>
    );
};

export default Dashboard;
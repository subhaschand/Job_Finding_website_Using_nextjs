import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const JobDetailPage = () => {
    const [job, setJob] = useState(null);
    const [resume, setResume] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
            setJob(res.data);
        };
        fetchJob();
    }, [id]);

    const handleFileChange = e => setResume(e.target.files[0]);

    const handleApply = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to apply.');
            navigate('/login');
            return;
        }

        const user = jwtDecode(token);
        if (user.role !== 'candidate') {
            alert('Only candidates can apply for jobs.');
            return;
        }
        
        if (!resume) {
            alert('Please upload a resume.');
            return;
        }

        const formData = new FormData();
        formData.append('resume', resume);

        try {
            await axios.post(`http://localhost:5000/api/applications/${id}/apply`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            alert('Applied successfully!');
        } catch (error) {
            console.error(error.response.data);
            alert('Failed to apply.');
        }
    };

    if (!job) return <div>Loading...</div>;

    return (
        <div className="container">
           <div className="card">
                <div className="card-header">
                    <img src={job.companyLogo} alt={`${job.company} logo`} className="company-logo" />
                    <div>
                        <h1>{job.title}</h1>
                        <h2>{job.company}</h2>
                    </div>
                </div>
                <p><strong>Location:</strong> {job.location}</p>
                {job.salary && <p><strong>Salary:</strong> ${job.salary.toLocaleString()}</p>}
                <p>{job.description}</p>
            </div>
            <div className="card">
                <h3>Apply for this Job</h3>
                <div className="form-group">
                    <label>Upload Resume</label>
                    <input type="file" onChange={handleFileChange} required />
                </div>
                <button onClick={handleApply} className="btn">Submit Application</button>
            </div>
        </div>
    );
};

export default JobDetailPage;
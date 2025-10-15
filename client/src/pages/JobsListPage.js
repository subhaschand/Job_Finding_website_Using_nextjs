import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const JobsListPage = () => {
    const [jobs, setJobs] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();
    const loc = useLocation();

    useEffect(() => {
        const fetchJobs = async () => {
            const params = new URLSearchParams(loc.search);
            const keywordQuery = params.get('keyword') || '';
            const locationQuery = params.get('location') || '';
            
            setKeyword(keywordQuery);
            setLocation(locationQuery);

            const { data } = await axios.get(`http://localhost:5000/api/jobs?keyword=${keywordQuery}&location=${locationQuery}`);
            setJobs(data);
        };
        fetchJobs();
    }, [loc.search]);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/jobs?keyword=${keyword}&location=${location}`);
    };

    return (
        <div className="container">
            <h1>All Job Listings</h1>

            <form onSubmit={handleSearch} className="search-form card">
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Keyword (e.g., 'React Developer')"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Location (e.g., 'New York')"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn">Search</button>
            </form>

            {jobs.length > 0 ? (
                jobs.map(job => (
                    <div key={job._id} className="card">
                        <div className="card-header">
                            <img src={job.companyLogo || '/default-logo.png'} alt={`${job.company} logo`} className="company-logo" />
                            <div>
                                <h2>{job.title}</h2>
                                <p><strong>Company:</strong> {job.company}</p>
                            </div>
                        </div>
                        <p><strong>Location:</strong> {job.location}</p>
                        <Link to={`/jobs/${job._id}`} className="btn">View Details</Link>
                    </div>
                ))
            ) : (
                <p>No jobs found.</p>
            )}
        </div>
    );
};

export default JobsListPage;
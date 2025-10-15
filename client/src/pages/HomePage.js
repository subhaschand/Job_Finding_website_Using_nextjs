import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeaturedJobs = async () => {
            try {
                // Fetch a few jobs to feature, e.g., the 3 most recent
                const { data } = await axios.get('http://localhost:5000/api/jobs?limit=3');
                setFeaturedJobs(data);
            } catch (error) {
                console.error("Error fetching featured jobs:", error);
            }
        };
        fetchFeaturedJobs();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim() || location.trim()) {
            navigate(`/jobs?keyword=${keyword}&location=${location}`);
        }
    };

    return (
        <div>
            <div className="hero-section">
                <div className="container">
                    <h1>Find Your Dream Job Today</h1>
                    <p>The best place to find and post job opportunities.</p>
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Job title or keyword"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="City or state"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <button type="submit" className="btn">Search</button>
                    </form>
                </div>
            </div>

            <div className="container featured-jobs">
                <h2>Featured Job Listings</h2>
                <div className="job-listings">
                    {featuredJobs.length > 0 ? (
                        featuredJobs.map(job => (
                            <div key={job._id} className="card">
                                <div className="card-header">
                                    <img src={job.companyLogo || '/default-logo.png'} alt={`${job.company} logo`} className="company-logo" />
                                    <div>
                                        <h3>{job.title}</h3>
                                        <p>{job.company}</p>
                                    </div>
                                </div>
                                <p><strong>Location:</strong> {job.location}</p>
                                <Link to={`/jobs/${job._id}`} className="btn">View Details</Link>
                            </div>
                        ))
                    ) : (
                        <p>No featured jobs available right now.</p>
                    )}
                </div>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link to="/jobs" className="btn">Browse All Jobs</Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
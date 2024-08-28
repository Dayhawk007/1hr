import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from '../contexts/UserContext';
import { Navigate, useNavigate } from 'react-router-dom';

const JobPostingList = () => {
  const { user, loading } = useUserContext();
  const [jobPostings, setJobPostings] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobPostingsResponse = await axios.get('http://127.0.0.1:5000/api/jobPosting');
        setJobPostings(jobPostingsResponse.data);
        setDataReady(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleShowApplications = (id) => {
    navigate(`/job-posting/${id}/applications`);
  };

  const formatCompensation = (value) => {
    return value.toLocaleString();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  if (!dataReady) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-6xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Job Postings</h1>
        <table className="table-auto w-full bg-gray-700 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Application Deadline</th>
              <th className="px-4 py-2">Compensation Range</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobPostings.map((job) => (
              <tr key={job._id} className="text-gray-400 border-b border-gray-600 text-center">
                <td className="px-4 py-2">{job.title}</td>
                <td className="px-4 py-2">
                  {job.clientReference !== undefined ? job.clientReference.name : "Not Available"}
                </td>
                <td className="px-4 py-2">{job.location}</td>
                <td className="px-4 py-2">{new Date(job.applicationDeadline).toLocaleDateString()}</td>
                <td className="px-4 py-2">₹{formatCompensation(job.compensationStart)} - ₹{formatCompensation(job.compensationEnd)}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleShowApplications(job._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Show Applications
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobPostingList;

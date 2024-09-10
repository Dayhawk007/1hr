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

  const handleAddJob = () => {
    navigate('/job-posting/create');
  };

  const handleEditJob = (id) => {
    navigate(`/job-posting/create`, { state: jobPostings.find(job => job._id === id) });
  };

  const handleDeleteJob = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/jobPosting/${id}`);
      setJobPostings(jobPostings.filter(job => job._id !== id));
    } catch (error) {
      console.error('Error deleting job posting:', error);
    }
  };

  const formatCompensation = (value) => {
    return value.toLocaleString();
  };
  
  const truncateDescription = (description) => {
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  };

  if (loading) {
    return <div className="text-gray-800">Loading...</div>;
  }

  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  if (!dataReady) {
    return <div className="text-gray-800">Loading data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-8">Job Posting Management</h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 bg-primary">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Job Postings</h2>
              <button
                onClick={handleAddJob}
                className="bg-white text-primary px-4 py-2 rounded-full font-medium hover:bg-purple-100 transition duration-300 ease-in-out"
              >
                Add New Job Posting
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Application Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Compensation Range</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobPostings.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {job.clientReference !== undefined ? job.clientReference.name : "Not Available"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{job.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{new Date(job.applicationDeadline).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">₹{formatCompensation(job.compensationStart)} - ₹{formatCompensation(job.compensationEnd)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEditJob(job._id)}
                        className="text-primary hover:text-purple-700 font-medium mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingList;

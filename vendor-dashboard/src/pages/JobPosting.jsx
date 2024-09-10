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

  const handleAddApplicant = (jobId) => {
    navigate(`/job-posting/${jobId}/add-applicant`);
  };

  const handleShowApplicants = (jobId) => {
    navigate(`/job-posting/${jobId}/show-applicants`);
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
        <h1 className="text-3xl font-bold text-primary mb-8">Job Postings</h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center
                   text-xs font-medium text-gray-700 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-center
                   text-xs font-medium text-gray-700 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-center
                   text-xs font-medium text-gray-700 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-center
                   text-xs font-medium text-gray-700 uppercase tracking-wider">Application Deadline</th>
                  <th className="px-6 py-3 text-center
                   text-xs font-medium text-gray-700 uppercase tracking-wider">Compensation Range</th>
                  <th className="px-6 py-3 text-center
                   text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-center">
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
                        onClick={() => handleAddApplicant(job._id)}
                        className="bg-primary text-white px-4 py-2 rounded-full font-medium hover:bg-purple-700 transition duration-300 ease-in-out mr-2"
                      >
                        Add Applicant
                      </button>
                      <button
                        onClick={() => handleShowApplicants(job._id)}
                        className="bg-purple-700 text-white px-4 py-2 rounded-full font-medium hover:bg-purple-800 transition duration-300 ease-in-out"
                      >
                        Show Applicants
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

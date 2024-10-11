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
      if (user && user.user && user.user._id) { // Ensure user ID is available
        try {
          const jobPostingsResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/client/${user.user._id}/job-posting`
          );

          setJobPostings(jobPostingsResponse.data);
          setDataReady(true);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [user]);

  const handleShowApplications = (id) => {
    navigate(`/job-posting/${id}/applications`);
  };

  const formatCompensation = (value) => {
    return value.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-800 text-xl">Loading...</div>
      </div>
    );
  }

  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  if (!dataReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-800 text-xl">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-8">Job Postings</h1>

        {/* Job Postings Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Application Deadline
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Compensation Range
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-center">
                {jobPostings.length > 0 ? (
                  jobPostings.map((job) => (
                    <tr
                      key={job._id}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {job.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {job.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {new Date(job.applicationDeadline).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        ₹{formatCompensation(job.compensationStart)} - ₹
                        {formatCompensation(job.compensationEnd)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleShowApplications(job._id)}
                          className="bg-primary text-white px-4 py-2 rounded-full font-medium hover:bg-purple-700 transition duration-300 ease-in-out"
                        >
                          Show Applications
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-gray-800 text-center"
                    >
                      No job postings available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingList;

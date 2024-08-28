import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import { Navigate } from 'react-router-dom';

const ApplicationList = () => {
  const { user, loading } = useUserContext();
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/job/${jobId}/applications`);
        setApplications(response.data);
        setDataReady(true);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, [jobId]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  // if (!dataReady) {
  //   return <div>Loading data...</div>;
  // }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-6xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Applications for Job ID: {jobId}</h1>
        <table className="table-auto w-full bg-gray-700 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Resume</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application._id} className="text-gray-400 border-b border-gray-600 text-center">
                <td className="px-4 py-2">{application.firstName} {application.lastName}</td>
                <td className="px-4 py-2">{application.email}</td>
                <td className="px-4 py-2">{application.phone}</td>
                <td className="px-4 py-2">{application.city}, {application.state}, {application.country}</td>
                <td className="px-4 py-2">{application.status}</td>
                <td className="px-4 py-2">
                  <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    View Resume
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationList;

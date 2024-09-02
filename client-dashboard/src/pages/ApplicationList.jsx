import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';


const ApplicationList = () => {
  const { user, loading } = useUserContext();
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [dataReady, setDataReady] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/jobPosting/${jobId}/applications`);
        setApplications(response.data);
        setDataReady(true);
      } catch (error) {
        alert('Error fetching applications:', error.message);
        navigate("/job-posting");
      }
    };

    fetchApplications();
  }, [jobId]);

  const updateApplication = async (id, application) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:5000/api/application/${id}`, application);
      const updatedApplications = applications.map(app => {
        if (app._id === id) {
          return response.data;
        }
        return app;
      });
      setApplications(updatedApplications);
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user && !loading) {
    navigate("/login");
  }

  if (!dataReady) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-primary">
      <div className="w-full mx-auto bg-gray-200 shadow-lg rounded-lg p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Applications</h1>
        <table className="table-auto w-full text-sm bg-gray-300 text-black rounded-lg shadow-lg">
          <thead>
            <tr className="text-primary">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Location</th>
              <th className='px-4 py-2'>Current CTC</th>
              <th className='px-4 py-2'>Expected CTC</th>
              <th className="px-4 py-2">Experience</th>
              <th className='px-4 py-2'>Relevant Experience</th>
              <th className='px-4 py-2'>Notice Period</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Resume</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application._id} className="hover:bg-gray-200 text-center">
                <td className="px-4 py-2">{application.firstName} {application.lastName}</td>
                <td className="px-4 py-2">{application.email}</td>
                <td className="px-4 py-2">{application.phone}</td>
                <td className="px-4 py-2">{application.city}, {application.state}, {application.country}</td>
                <td className="px-4 py-2">{application.currentCTC}</td>
                <td className="px-4 py-2">{application.expectedCTC}</td>
                <td className="px-4 py-2">{application.totalExperience}</td>
                <td className="px-4 py-2">{application.relevantExperience}</td>
                <td className="px-4 py-2">{application.noticePeriod}</td>
                <td className="px-4 py-2">
                  {['round 1','round 2', 'round 3', 'hired', 'rejected'].includes(application.status) ? (
                    <select value={application.status} onChange={e => updateApplication(application._id, { status: e.target.value })} className="bg-gray-400 text-black px-4 py-2 rounded-md">
                      <option value="round 1">Round 1</option>
                      <option value="round 2">Round 2</option>
                      <option value="round 3">Round 3</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  ) : (
                    <span>{application.status}</span>
                  )}
                </td>
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

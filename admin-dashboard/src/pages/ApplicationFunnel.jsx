import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const HiringFunnel = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [jobDetails, setJobDetails] = useState(null);
  
  const stages = ['Pre-Screen', 'Pre-Interview', 'Round 1', 'Round 2', 'Round 3', 'Hired'];

  // Fetch applications and job details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicationsRes, jobRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/jobPosting/${jobId}/applications`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/jobPosting/${jobId}`)
        ]);
        setApplications(applicationsRes.data);
        setJobDetails(jobRes.data);
        calculateStatistics(applicationsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [jobId]);

  // Calculate statistics for each stage
  const calculateStatistics = (applications) => {
    const stats = stages.reduce((acc, stage) => {
      const count = applications.filter(app => app.status.toLowerCase() === stage.toLowerCase()).length;
      const passRate = (count / applications.length) * 100;
      acc[stage] = { count, passRate: passRate.toFixed(1) };
      return acc;
    }, {});
    setStatistics(stats);
  };

  // Display loading state
  if (!statistics || !jobDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-800 text-xl">Loading...</div>
      </div>
    );
  }

  // Get color for each stage for a distinctive look
  const getStageColor = (index) => {
    const colors = ['bg-blue-200', 'bg-purple-200', 'bg-yellow-200', 'bg-indigo-200', 'bg-green-200', 'bg-gray-200'];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">{jobDetails.title}</h1>
        <div className="mt-2 text-gray-600">
          <p className="text-lg">{jobDetails.department}</p>
          <p className="text-sm mt-1">{jobDetails.location}</p>
          <p className="text-sm mt-1">Total Applications: {applications.length}</p>
        </div>
      </div>
      
      <div className="flex flex-col items-center w-full max-w-2xl">
        {stages.map((stage, index) => (
          <div
            key={stage}
            className={`group relative ${getStageColor(index)} w-full p-4 flex flex-col justify-center items-center text-gray-700 rounded-t-none`}
            style={{ width: `${100 - index * 10}%`, minHeight: '80px' }}
          >
            <div className="text-lg font-semibold mb-2">{stage}</div>
            <div className="text-sm">
              <span className="font-medium">{statistics[stage]?.count || 0}</span> applicants
              {statistics[stage]?.count > 0 && (
                <span className="ml-2">({statistics[stage]?.passRate}%)</span>
              )}
            </div>
            
            <div className="absolute bottom-full mb-2 hidden group-hover:flex w-48 p-2 text-white bg-gray-800 rounded-md shadow-lg transform transition duration-200 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105 text-sm">
              <p className="text-center w-full">
                Stage Details:
                <br />
                {`${statistics[stage]?.count || 0} applicants`}
                <br />
                {`${statistics[stage]?.passRate}% pass rate`}
                <br />
                {`${applications.filter(app => app.status.toLowerCase() === stage.toLowerCase()).length} current`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HiringFunnel;

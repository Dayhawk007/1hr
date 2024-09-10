import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import { Navigate } from 'react-router-dom';

const ShowApplicants = () => {
  const { user, loading } = useUserContext();
  const [applicants, setApplicants] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const { jobId } = useParams();
  const [draggedApplicant, setDraggedApplicant] = useState(null);

  const columns = ['pre-screen', 'screen', 'pre-interview' ,'round 1', 'round 2', 'round 3', 'hired', 'rejected'];

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/jobPosting/${jobId}/applications`);
        setApplicants(response.data);
        setDataReady(true);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const getApplicantsByStatus = (status) => {
    return applicants.filter(applicant => applicant.status === status);
  };

  const handleDragStart = (applicant) => {
    setDraggedApplicant(applicant);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (newStatus) => {
    if (draggedApplicant) {
      try {
        await axios.patch(`http://127.0.0.1:5000/api/application/${draggedApplicant._id}`, {
          status: newStatus
        });
        
        setApplicants(applicants.map(app => 
          app._id === draggedApplicant._id ? { ...app, status: newStatus } : app
        ));
      } catch (error) {
        console.error('Error updating applicant status:', error);
      }
      setDraggedApplicant(null);
    }
  };

  if (loading) {
    return <div className="text-gray-800">Loading...</div>;
  }

  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  if (!dataReady) {
    return <div className="text-gray-800">Loading applicants...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-8">Applicants Board</h1>
        <div className="flex space-x-4 overflow-x-auto pb-8">
          {columns.map(column => (
            <div 
              key={column} 
              className="flex-shrink-0 w-52"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column)}
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-4">{column}</h2>
              <div className="bg-white shadow-lg rounded-lg p-4 space-y-4">
                {getApplicantsByStatus(column).map(applicant => (
                  <div 
                    key={applicant._id} 
                    className="bg-gray-50 p-4 rounded-lg shadow cursor-move"
                    draggable
                    onDragStart={() => handleDragStart(applicant)}
                  >
                    <h3 className="font-semibold text-gray-800 truncate">{`${applicant.firstName} ${applicant.lastName}`}</h3>
                    <p className="text-sm text-gray-600 truncate">{applicant.email}</p>
                    <p className="text-sm text-gray-600 truncate">{applicant.phone}</p>
                    <div className="mt-2">
                      <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full truncate">
                        {applicant.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowApplicants;
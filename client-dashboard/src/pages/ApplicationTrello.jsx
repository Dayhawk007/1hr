import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';

const ShowApplicants = () => {
  const { user, loading } = useUserContext();
  const [applicants, setApplicants] = useState([]);
  const [jobRounds, setJobRounds] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const { jobId } = useParams();
  const [draggedApplicant, setDraggedApplicant] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const columnRefs = useRef({});

  // Define allowed stages for client users
  const clientAllowedStages = ['stage 2'];

  const getColumnColor = (stage) => {
    switch (stage.toLowerCase()) {
      case 'hired':
        return 'bg-green-100';
      case 'rejected':
        return 'bg-red-100';
      case 'stage 2':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  };

  const canMoveCard = (userType, newStatus) => {
    if (userType === 'sub-vendor') return false;
    if (userType === 'client') {
      return clientAllowedStages.includes(newStatus.toLowerCase());
    }
    return true; // Admin can move cards anywhere
  };

  const sortRounds = (rounds) => {
    const stageOrder = ['stage 2', 'hired', 'rejected'];
    return rounds
      .filter(round => stageOrder.includes(round.stage.toLowerCase())) // Only include specified stages
      .sort((a, b) => stageOrder.indexOf(a.stage.toLowerCase()) - stageOrder.indexOf(b.stage.toLowerCase()));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicantsResponse, jobResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/jobPosting/${jobId}/applications`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/jobPosting/${jobId}`)
        ]);
        setApplicants(applicantsResponse.data);
        setJobRounds(sortRounds(jobResponse.data.rounds)); // Filter to only include specified stages
        setDataReady(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch applicants or job rounds. Please try again later.');
        setDataReady(true); // Even on error, set dataReady to prevent infinite loading
      }
    };

    fetchData();
  }, [jobId]);

  const getApplicantsByRound = (roundName) => {
    return applicants.filter(
      (application) => application.status.toLowerCase() === roundName.toLowerCase()
    ).map((application) => {
      const currentFeedback = application.feedback.find(
        (feedback) => feedback.round.toLowerCase() === roundName.toLowerCase()
      );
      return { ...application, currentFeedback };
    });
  };

  const handleDragStart = (applicant) => {
    if (user.type !== 'sub-vendor') {
      setDraggedApplicant(applicant);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (newStatus) => {
    if (draggedApplicant && canMoveCard(user.type, newStatus)) {
      // Show confirmation dialog using native window.confirm
      const confirmMove = window.confirm(`Are you sure you want to move ${draggedApplicant.firstName} ${draggedApplicant.lastName} to "${newStatus}" stage?`);
      
      if (confirmMove) {

        const feedbackInput = prompt('Please provide your feedback for the applicant:');
        if(feedbackInput) {
    
          try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/api/application/${draggedApplicant._id}`, {
              status: newStatus,
              oldStatus: draggedApplicant.status,
              feedback: feedbackInput,
            });

            setApplicants(applicants.map(app => 
              app._id === draggedApplicant._id ? { ...app, status: newStatus } : app
            ));
            setSuccessMessage(`Applicant moved to "${newStatus}" stage successfully.`);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
          } catch (error) {
            console.error('Error updating applicant status:', error);
            setError('Failed to update applicant status. Please try again.');

            // Clear error message after 5 seconds
            setTimeout(() => setError(''), 5000);
          }
        }
        else{
          alert('Feedback is required.');
        }
      }
      setDraggedApplicant(null);
    } else if (draggedApplicant) {
      // Provide feedback if the move is not allowed
      setWarningMessage('You are not authorized to move applicants to this stage.');

      // Clear warning message after 3 seconds
      setTimeout(() => setWarningMessage(''), 3000);
      setDraggedApplicant(null);
    }
  };

  const scrollToStage = (stageName) => {
    const column = columnRefs.current[stageName];
    if (column) {
      column.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
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
        <div className="text-gray-800 text-xl">Loading applicants...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 flex-grow flex flex-col">
        <h1 className="text-3xl font-bold text-primary mb-8">Applicants Board</h1>

        {/* Display Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
            {successMessage}
          </div>
        )}

        {/* Display Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}

        {/* Display Warning Message */}
        {warningMessage && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
            {warningMessage}
          </div>
        )}

        {/* Check if there are job rounds */}
        {jobRounds.length === 0 ? (
          <div className="text-center text-gray-600 mt-10">
            <p>No job stages defined for this position.</p>
          </div>
        ) : (
          <div className="flex-grow flex flex-col">
            {/* Check if there are applicants */}
            {applicants.length === 0 ? (
              <div className="text-center text-gray-600 mt-10">
                <p>No applicants found for this job posting.</p>
              </div>
            ) : (
              <div className="flex-grow flex space-x-4 overflow-x-auto">
                {jobRounds.map(round => (
                  <div 
                    key={round.name} 
                    className={`flex-shrink-0 w-72 ${getColumnColor(round.stage)} p-4 rounded-lg overflow-y-auto`}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(round.name)}
                    ref={el => columnRefs.current[round.stage] = el}
                  >
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">{round.name.charAt(0).toUpperCase() + round.name.slice(1)}</h2>
                    <div className="space-y-4">
                      {getApplicantsByRound(round.name).length === 0 ? (
                        <p className="text-gray-500">No applicants in this stage.</p>
                      ) : (
                        getApplicantsByRound(round.name).map(applicant => (
                          <div key={applicant._id}>
                            <div 
                              className={`bg-white p-4 rounded-lg shadow ${user.type !== 'sub-vendor' ? 'cursor-move' : ''} hover:shadow-md transition-shadow`}
                              draggable={user.type !== 'sub-vendor'}
                              onDragStart={(e) => {
                                if (user.type !== 'sub-vendor') {
                                  handleDragStart(applicant);
                                } else {
                                  e.preventDefault();
                                }
                              }}
                              onClick={() => {
                                // Optional: You can navigate or show more details on click
                              }}
                            >
                              <Link to={`/applicant/${applicant._id}`}>
                                <h3 className="font-semibold text-gray-800 truncate">{`${applicant.firstName} ${applicant.lastName}`}</h3>
                              </Link>
                              <p className="text-sm text-gray-600 truncate">{applicant.email}</p>
                              <p className="text-sm text-gray-600 truncate">{applicant.phone}</p>
                              <p className="text-sm text-gray-600 truncate"><strong>Sub Vendor:</strong> {applicant.subVendor!==undefined ? applicant.subVendor.name : 'N/A'}</p>
                              <div className="mt-2">
                                <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full truncate">
                                  {applicant.status}
                                </span>
                              </div>
                              <div className="mt-2">
                              <p className="text-sm text-gray-700">
                                <strong>Feedback for {round.name}:</strong> {applicant.currentFeedback && applicant.currentFeedback.feedbackText || 'N/A'}
                              </p>
                            </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowApplicants;

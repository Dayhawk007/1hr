import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';

const ApplicationTrello = () => {
  const { user, loading } = useUserContext();
  const [applications, setApplications] = useState([]);
  const [jobRounds, setJobRounds] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const { jobId } = useParams();
  const [draggedApplication, setDraggedApplication] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const columnRefs = useRef({});
  const [currentFeedback, setCurrentFeedback] = useState(null);
  // Define allowed stages for client users
  const clientAllowedStages = ['stage 2'];

  // Function to get column color based on stage
  const getColumnColor = (stage) => {
    switch (stage.toLowerCase()) {
      case 'stage 1':
        return 'bg-blue-100';
      case 'stage 2':
        return 'bg-yellow-100';
      case 'hired':
        return 'bg-green-100';
      case 'rejected':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  // Function to determine if a user can move a card to a new status
  const canMoveCard = (userType, newStatus) => {
    if (userType === 'sub-vendor') return false;
    if (userType === 'client') {
      return clientAllowedStages.includes(newStatus.toLowerCase());
    }
    return true; // Admin can move cards anywhere
  };

  // Function to sort and filter job rounds
  const sortRounds = (rounds) => {
    const stageOrder = ['stage 1', 'stage 2', 'hired', 'rejected'];
    return rounds
      .filter((round) => stageOrder.includes(round.stage.toLowerCase())) // Only include specified stages
      .sort(
        (a, b) =>
          stageOrder.indexOf(a.stage.toLowerCase()) - stageOrder.indexOf(b.stage.toLowerCase())
      );
  };

  // Fetch applications and job rounds data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicationsResponse, jobResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/jobPosting/${jobId}/applications`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/jobPosting/${jobId}`)
        ]);
        setApplications(applicationsResponse.data);
        setJobRounds(sortRounds(jobResponse.data.rounds));
        setDataReady(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch applications or job rounds. Please try again later.');
        setDataReady(true); // Prevent infinite loading
      }
    };

    fetchData();
  }, [jobId]);

  // Get applications filtered by round
  const getApplicationsByRound = (roundName) => {
    return applications.filter(
      (application) => application.status.toLowerCase() === roundName.toLowerCase()
    );
  };

  // Handle drag start
  const handleDragStart = (application) => {
    if (user.type !== 'sub-vendor') {
      setDraggedApplication(application);
    }
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = async (newStatus) => {
    
    if (draggedApplication && canMoveCard(user.type, newStatus)) {
      // Show confirmation dialog using native window.confirm
      const confirmMove = window.confirm(
        `Are you sure you want to move ${draggedApplication.firstName} ${draggedApplication.lastName} to "${newStatus}" stage?`
      );

      if (confirmMove) {
        const feedbackInput = prompt('Please provide your feedback for the applicant:');
        if(feedbackInput) {
         
        
        try {
          await axios.patch(`${process.env.REACT_APP_API_URL}/api/application/${draggedApplication._id}`, {
            status: newStatus,
            oldStatus: draggedApplication.status,
            feedback: feedbackInput,
          }); 

          setApplications(
            applications.map((app) =>
              app._id === draggedApplication._id ? { ...app, status: newStatus } : app
            )
          );
          setSuccessMessage(`Application moved to "${newStatus}" stage successfully.`);

          // Clear success message after 3 seconds
          setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
          console.error('Error updating application status:', error);
          setError('Failed to update application status. Please try again.');

          // Clear error message after 5 seconds
          setTimeout(() => setError(''), 5000);
        }
      }
      else{
        alert('Feedback is required.');
      }
      }
      setDraggedApplication(null);
    } else if (draggedApplication) {
      // Provide feedback if the move is not allowed
      setWarningMessage('You are not authorized to move applications to this stage.');

      // Clear warning message after 3 seconds
      setTimeout(() => setWarningMessage(''), 3000);
      setDraggedApplication(null);
    }
  };

  // Scroll to a specific stage
  const scrollToStage = (stageName) => {
    const column = columnRefs.current[stageName];
    if (column) {
      column.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  };

  // Redirect to login if user is not authenticated
  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  // Display loading state
  if (loading || !dataReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-800 text-xl">
          {loading ? 'Loading...' : 'Loading applications...'}
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 flex-grow flex flex-col">
        <h1 className="text-3xl font-bold text-primary mb-8">Applications Board</h1>

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
            {/* Check if there are applications */}
            {applications.length === 0 ? (
              <div className="text-center text-gray-600 mt-10">
                <p>No applications found for this job posting.</p>
              </div>
            ) : (
              <div className="flex-grow flex space-x-4 overflow-x-auto">
                {jobRounds.map((round) => (
                  <div
                    key={round.name}
                    className={`flex-shrink-0 w-72 ${getColumnColor(round.stage)} p-4 rounded-lg overflow-y-auto`}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(round.name)}
                    ref={(el) => (columnRefs.current[round.stage] = el)}
                  >
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                      {round.name.charAt(0).toUpperCase() + round.name.slice(1)}
                    </h2>
                    <div className="space-y-4">
                      {getApplicationsByRound(round.name).length === 0 ? (
                        <p className="text-gray-500">No applications in this stage.</p>
                      ) : (
                        getApplicationsByRound(round.name).map((application) => {
                          const currentFeedback = application.feedback.find(
                            (feedback) => feedback.round.toLowerCase() === round.name.toLowerCase()
                          );
                          
                          console.log(currentFeedback);
                          return (
                             <div key={application._id}>
                            <div
                              className={`bg-white p-4 rounded-lg shadow ${
                                user.type !== 'sub-vendor' ? 'cursor-move' : ''
                              } hover:shadow-md transition-shadow`}
                              draggable={user.type !== 'sub-vendor'}
                              onDragStart={(e) => {
                                if (user.type !== 'sub-vendor') {
                                  handleDragStart(application);
                                } else {
                                  e.preventDefault();
                                }
                              }}
                              onClick={() => {
                                // Optional: Navigate or show more details on click
                              }}
                            >
                              <Link to={`/applications/${application._id}`}>
                                <h3 className="font-semibold text-gray-800 truncate">
                                  {`${application.firstName} ${application.lastName}`}
                                </h3>
                              </Link>
                              <p className="text-sm text-gray-600 truncate">{application.email}</p>
                              <p className="text-sm text-gray-600 truncate">{application.phone}</p>
                              <p className="text-sm text-gray-600 truncate">
                                <strong>Sub Vendor:</strong>{' '}
                                {application.subVendor !== undefined
                                  ? application.subVendor.name
                                  : 'N/A'}
                              </p>
                              <div className="mt-2">
                                <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full truncate">
                                  {application.status}
                                </span>
                              </div>
                              
                                  <div className="mt-2">
                                    <p className="text-sm text-gray-700">
                                      <strong>Feedback for {round.name}:</strong> {currentFeedback && currentFeedback.feedbackText || 'N/A'}
                                    </p>
                                  </div>
                                
                            </div>
                          </div>
                        )})
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Scroll to Stage Buttons */}
        {jobRounds.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 px-4">
              {jobRounds.map((round) => (
                <button
                  key={round.name}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getColumnColor(
                    round.stage
                  )} text-gray-800`}
                  onClick={() => scrollToStage(round.name)}
                >
                  {round.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTrello;


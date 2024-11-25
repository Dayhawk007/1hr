import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, Link, Navigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

const ShowApplicants = () => {
  const { user, loading } = useUserContext();
  const [applicants, setApplicants] = useState([]);
  const [jobRounds, setJobRounds] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const { jobId } = useParams();
  const [draggedApplicant, setDraggedApplicant] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const columnRefs = useRef({});

  // Define allowed stages for client users
  const clientAllowedStages = ["round 1", "round 2", "round 3"];

  /**
   * Function to determine the background color based on the stage
   * @param {string} stage - The stage name
   * @returns {string} - Tailwind CSS class for background color
   */
  const getColumnColor = (stage) => {
    switch (stage.toLowerCase()) {
      case "stage 1":
        return "bg-blue-100";
      case "stage 2":
        return "bg-yellow-100";
      case "hired":
        return "bg-green-100";
      case "rejected":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  /**
   * Function to determine if the user can move the card to a new status
   * @param {string} userType - The type of the user ('sub-vendor', 'client', 'admin')
   * @param {string} newStatus - The new status to move the applicant to
   * @returns {boolean} - Whether the user is authorized to move the card
   */
  const canMoveCard = (userType, newStatus) => {
    if (userType === "sub-vendor") return false;
    if (userType === "client") {
      return clientAllowedStages.includes(newStatus.toLowerCase());
    }
    return true; // Admin can move cards anywhere
  };

  /**
   * Function to sort and filter job rounds based on user type
   * @param {Array} rounds - Array of job round objects
   * @param {string} userType - The type of the user ('sub-vendor', 'client', 'admin')
   * @returns {Array} - Sorted and filtered array of job rounds
   */
  const sortRounds = (rounds, userType) => {
    const stageOrder = ["stage 1", "stage 2", "hired", "rejected"];
    let filteredRounds = rounds.filter((round) =>
      stageOrder.includes(round.stage.toLowerCase())
    );

    // If user is a sub-vendor, exclude 'stage 1'
    if (userType === "sub-vendor") {
      filteredRounds = filteredRounds.filter(
        (round) => round.stage.toLowerCase() !== "stage 1"
      );
    }

    return filteredRounds.sort(
      (a, b) =>
        stageOrder.indexOf(a.stage.toLowerCase()) -
        stageOrder.indexOf(b.stage.toLowerCase())
    );
  };

  // Fetch applicants and job rounds data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ensure user is available before fetching rounds
        if (user && user.user && user.user.type) {
          const [applicantsResponse, jobResponse] = await Promise.all([
            axios.get(
              `${process.env.REACT_APP_API_URL}/api/jobPosting/${jobId}/applications`,
              {
                params: {
                  subVendorId: user?.user?._id || "",
                },
              }
            ),
            axios.get(
              `${process.env.REACT_APP_API_URL}/api/jobPosting/${jobId}`
            ),
          ]);
          setApplicants(applicantsResponse.data);
          setJobRounds(sortRounds(jobResponse.data.rounds, user.user.type));
          setDataReady(true);
        } else {
          // If user data is not available, set data as ready to prevent infinite loading
          setDataReady(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "Failed to fetch applicants or job rounds. Please try again later."
        );
        setDataReady(true); // Prevent infinite loading
      }
    };

    fetchData();
  }, [jobId, user]);

  /**
   * Function to get applicants filtered by round
   * @param {string} roundName - The name of the round
   * @returns {Array} - Array of applicants in the specified round
   */
  const getApplicantsByRound = (roundName) => {
    return applicants.filter(
      (applicant) => applicant.status.toLowerCase() === roundName.toLowerCase()
    );
  };

  /**
   * Handle the start of a drag event
   * @param {Object} applicant - The applicant being dragged
   */
  const handleDragStart = (applicant) => {
    if (canMoveCard(getUserType(), applicant.status)) {
      setDraggedApplicant(applicant);
    }
  };

  /**
   * Allow dropping by preventing default behavior
   * @param {Event} e - The drag over event
   */
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  /**
   * Handle the drop event
   * @param {string} newStatus - The new status to drop the applicant into
   */
  const handleDrop = async (newStatus) => {
    if (draggedApplicant && canMoveCard(user.type, newStatus)) {
      const confirmMove = window.confirm(
        `Are you sure you want to move ${draggedApplicant.firstName} ${draggedApplicant.lastName} to "${newStatus}" stage?`
      );

      if (confirmMove) {
        const feedbackInput = prompt(
          "Please provide your feedback for the applicant:"
        );
        if (feedbackInput) {
          try {
            await axios.patch(
              `${process.env.REACT_APP_API_URL}/api/application/${draggedApplicant._id}`,
              {
                status: newStatus,
                feedback: feedbackInput,
              }
            );

            setApplicants(
              applicants.map((app) =>
                app._id === draggedApplicant._id
                  ? { ...app, status: newStatus, feedback: feedbackInput }
                  : app
              )
            );
            setSuccessMessage(
              `Application moved to "${newStatus}" stage successfully.`
            );
          } catch (error) {
            console.error("Error updating application status:", error);
            setError("Failed to update application status. Please try again.");
          }
        } else {
          alert("Feedback is required.");
        }
      }
      setDraggedApplicant(null);
    } else if (draggedApplicant) {
      setWarningMessage(
        "You are not authorized to move applications to this stage."
      );
      setTimeout(() => setWarningMessage(""), 3000);
      setDraggedApplicant(null);
    }
  };

  /**
   * Function to determine the user type safely
   * @returns {string|null} - The user type ('sub-vendor', 'client', 'admin') or null if unavailable
   */
  const getUserType = () => {
    return user && user.user && user.user.type ? user.user.type : null;
  };

  /**
   * Scroll to a specific stage/round
   * @param {string} stageName - The name of the stage to scroll to
   */
  const scrollToStage = (stageName) => {
    const column = columnRefs.current[stageName];
    if (column) {
      column.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
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
          {loading ? "Loading..." : "Loading applicants..."}
        </div>
      </div>
    );
  }

  // If user type is unavailable after data is ready
  if (getUserType() === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-800 text-xl">
          User information is unavailable.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 flex-grow flex flex-col">
        <h1 className="text-3xl font-bold text-primary mb-8">
          Applicants Board
        </h1>

        {/* <div className="text-black">{JSON.stringify(user.user, null, 8)}</div> */}
        {/* Display Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
            {successMessage}
          </div>
        )}

        {/* Display Error Message */}
        {/* {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )} */}

        {/* Display Warning Message */}
        {/* {warningMessage && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
            {warningMessage}
          </div>
        )} */}

        {/* Check if there are job rounds */}
        {jobRounds.length === 0 ? (
          <div className="text-center text-lg text-gray-600 mt-10">
            <p>No applicants found</p>
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
                {jobRounds.map((round) => (
                  <div
                    key={round.name}
                    className={`flex-shrink-0 w-72 ${getColumnColor(
                      round.stage
                    )} p-4 rounded-lg overflow-y-auto`}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(round.name)}
                    ref={(el) => (columnRefs.current[round.stage] = el)}
                  >
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                      {round.name.charAt(0).toUpperCase() + round.name.slice(1)}
                    </h2>
                    <div className="space-y-4">
                      {getApplicantsByRound(round.name).length === 0 ? (
                        <p className="text-gray-500">
                          No applicants in this stage.
                        </p>
                      ) : (
                        getApplicantsByRound(round.name).map((applicant) => {
                          const currentFeedback = applicant.feedback.find(
                            (feedback) =>
                              feedback.round.toLowerCase() ===
                              round.name.toLowerCase()
                          );

                          console.log(currentFeedback);
                          return (
                            <div key={applicant._id}>
                              <div
                                className={`bg-white p-4 rounded-lg shadow ${
                                  canMoveCard(getUserType(), applicant.status)
                                    ? "cursor-move"
                                    : ""
                                } hover:shadow-md transition-shadow`}
                                draggable={canMoveCard(
                                  getUserType(),
                                  applicant.status
                                )}
                                onDragStart={(e) => {
                                  if (
                                    canMoveCard(getUserType(), applicant.status)
                                  ) {
                                    handleDragStart(applicant);
                                  } else {
                                    e.preventDefault();
                                  }
                                }}
                              >
                                <Link to={`/applicant/${applicant._id}`}>
                                  <h3 className="font-semibold text-gray-800 underline truncate">
                                    {`${applicant.firstName} ${applicant.lastName}`}
                                  </h3>
                                </Link>
                                <p className="text-sm text-gray-600 truncate">
                                  {applicant.email}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                  {applicant.phone}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                  <strong>Sub Vendor:</strong>{" "}
                                  {applicant.subVendor !== undefined
                                    ? applicant.subVendor.name
                                    : "N/A"}
                                </p>
                                <div className="mt-2">
                                  <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full truncate">
                                    {applicant.status}
                                  </span>
                                </div>
                                <div className="mt-2">
                                  <p className="text-sm text-gray-700">
                                    <strong>Feedback for {round.name}:</strong>{" "}
                                    {(currentFeedback &&
                                      currentFeedback.feedbackText) ||
                                      "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })
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

export default ShowApplicants;

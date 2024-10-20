import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Navigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';

const ApplicantDetails = () => {
  const { user, loading } = useUserContext();
  const [applicant, setApplicant] = useState(null);
  const { applicantId } = useParams();

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/application/${applicantId}`);
        setApplicant(response.data);
      } catch (error) {
        console.error('Error fetching applicant details:', error);
      }
    };

    fetchApplicantDetails();
  }, [applicantId]);

  if (loading) {
    return <div className="text-gray-800">Loading...</div>;
  }

  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  if (!applicant) {
    return <div className="text-gray-800">Loading applicant details...</div>;
  }

  const getStatusColor = (status) => {
    if (['pre-screen', 'pre-interview'].includes(status)) {
      return 'bg-blue-100';
    } else if (['round 1', 'round 2', 'round 3'].includes(status)) {
      return 'bg-green-100';
    } else if (['hired', 'rejected'].includes(status)) {
      return 'bg-yellow-100';
    }
    return 'bg-white';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-8">Applicant Details</h1>
        <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${getStatusColor(applicant.status)}`}>
          <div className="p-6">
            {/* Applicant Name */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {`${applicant.firstName} ${applicant.lastName}`}
            </h2>

            {/* Status Badge */}
            <div className="mb-6">
              <span className={`inline-block px-3 py-1 text-sm font-semibold text-gray-700 rounded-full ${getStatusColor(applicant.status)}`}>
                {applicant.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>

            {/* Applicant Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-800">{applicant.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-800">{applicant.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">City</p>
                    <p className="text-gray-800">{applicant.city}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">State</p>
                    <p className="text-gray-800">{applicant.state}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Country</p>
                    <p className="text-gray-800">{applicant.country}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pincode</p>
                    <p className="text-gray-800">{applicant.pincode}</p>
                  </div>
                </div>
              </div>

              {/* Job & Compensation Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">Job & Compensation</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Job Applied For</p>
                    <p className="text-gray-800">{applicant.job?.title || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Current CTC</p>
                    <p className="text-gray-800">₹{applicant.currentCTC.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Expected CTC</p>
                    <p className="text-gray-800">₹{applicant.expectedCTC.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Experience & Notice Period */}
              <div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">Experience</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Experience</p>
                    <p className="text-gray-800">{applicant.totalExperience}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Relevant Experience</p>
                    <p className="text-gray-800">{applicant.relevantExperience}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Notice Period</p>
                    <p className="text-gray-800">{applicant.noticePeriod}</p>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">Additional Details</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Client</p>
                    <p className="text-gray-800">{applicant.client?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Application Date</p>
                    <p className="text-gray-800">{new Date(applicant.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Resume</p>
                    {applicant.resumeUrl ? (
                      <a
                        href={applicant.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Resume
                      </a>
                    ) : (
                      <p className="text-gray-800">Not provided</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default ApplicantDetails;

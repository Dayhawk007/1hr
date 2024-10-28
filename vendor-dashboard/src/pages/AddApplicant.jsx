import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';

function AddApplicant() {
  const [jobDetails, setJobDetails] = useState(null);
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useUserContext();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    resumeUrl: '',
    currentCTC: '',
    expectedCTC: '',
    totalExperience: '',
    relevantExperience: '',
    noticePeriod: '',
    status: 'pre-screen',
    answers: [],
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobPosting/${jobId}`);
        setJobDetails(response.data);
        setFormData(prevData => ({
          ...prevData,
          answers: new Array(response.data.questions?.length || 0).fill(''),
        }));
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleAnswerChange = (index, value) => {
    setFormData(prevData => {
      const newAnswers = [...prevData.answers];
      newAnswers[index] = value;
      return { ...prevData, answers: newAnswers };
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/upload-resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      setFormData(prevData => ({ ...prevData, resumeUrl: response.data.fileUrl }));
      alert('Resume uploaded successfully!');
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Error uploading resume. Please try again.');
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/application`, { ...formData, job: jobDetails?._id,subVendor:user.user?._id });
      alert('Application submitted successfully!');
      navigate(`/job-posting/`);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    }
  };

  if (!jobDetails) return <div className="text-gray-800">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-8">Apply for {jobDetails.title || 'Job'}</h1>
        
        {/* Job Details Section */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600"><span className="font-medium">Client:</span> {jobDetails.clientReference?.name || 'Not Available'}</p>
                <p className="text-gray-600"><span className="font-medium">Location:</span> {jobDetails.location || 'Not Specified'}</p>
                <p className="text-gray-600"><span className="font-medium">Application Deadline:</span> {jobDetails.applicationDeadline ? new Date(jobDetails.applicationDeadline).toLocaleDateString() : 'Not Specified'}</p>
              </div>
              <div>
                <p className="text-gray-600"><span className="font-medium">Compensation Range:</span> {jobDetails.compensationStart && jobDetails.compensationEnd ? `₹${jobDetails.compensationStart.toLocaleString('en-IN')} - ₹${jobDetails.compensationEnd.toLocaleString('en-IN')}` : 'Not Specified'}</p>
                <p className="text-gray-600"><span className="font-medium">Experience Range:</span> {jobDetails.experienceRange?.min && jobDetails.experienceRange?.max ? `${jobDetails.experienceRange.min} - ${jobDetails.experienceRange.max} years` : 'Not Specified'}</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Job Description</h3>
              <p className="text-gray-600">{jobDetails.description || 'No description available'}</p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Application Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="city">
                    City
                  </label>
                  <input
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="state">
                    State
                  </label>
                  <input
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="country">
                    Country
                  </label>
                  <input
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="country"
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="pincode">
                    Pincode
                  </label>
                  <input
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="pincode"
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="resumeUpload">
                    Upload Resume
                  </label>
                  <input
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="resumeUpload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    required
                  />
                  {uploadProgress > 0 && (
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{width: `${uploadProgress}%`}}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{uploadProgress}% uploaded</p>
                    </div>
                  )}
                  {formData.resumeUrl && (
                    <p className="text-sm text-gray-600 mt-2">
                      Resume uploaded: <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Resume</a>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="currentCTC">
                    Current CTC
                  </label>
                  <input
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="currentCTC"
                    type="number"
                    name="currentCTC"
                    value={formData.currentCTC}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="expectedCTC">
                    Expected CTC
                  </label>
                  <input
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="expectedCTC"
                    type="number"
                    name="expectedCTC"
                    placeholder='Enter expected CTC, eg: 4,50,000'
                    value={formData.expectedCTC}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="totalExperience">
                    Total Experience
                  </label>
                  <input
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="totalExperience"
                    type="text"
                    name="totalExperience"
                    placeholder='Enter total experience in years'
                    value={formData.totalExperience}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="relevantExperience">
                    Relevant Experience
                  </label>
                  <input
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="relevantExperience"
                    type="text"
                    name="relevantExperience"
                    placeholder='Enter relevant experience in years'
                    value={formData.relevantExperience}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="noticePeriod">
                    Notice Period
                  </label>
                  <input
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="noticePeriod"
                    type="text"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    placeholder='Enter notice period in days'
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Job-specific Questions</h3>
              {(jobDetails.questions || []).map((question, index) => (
                <div key={index} className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor={`question-${index}`}>
                    {question.questionText}
                  </label>
                  {question.questionType === 'multiple-choice' ? (
                    <div className="flex flex-row space-x-4">
                      {(question.options || []).map((option, optionIndex) => (
                        <div key={optionIndex} className="flex text-gray-700 text-sm items-center">
                          <input
                            type="radio"
                            id={`question-${index}-option-${optionIndex}`}
                            name={`question-${index}`}
                            value={option}
                            checked={formData.answers[index] === option}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            className="mr-2"
                            required
                          />
                          <label htmlFor={`question-${index}-option-${optionIndex}`}>{option}</label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id={`question-${index}`}
                      value={formData.answers[index] || ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      required
                    />
                  )}
                </div>
              ))}

              <div className="flex items-center justify-end mt-8">
                <button
                  className="bg-primary text-white px-4 py-2 rounded-full font-medium hover:bg-purple-700 transition duration-300 ease-in-out"
                  type="submit"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddApplicant;
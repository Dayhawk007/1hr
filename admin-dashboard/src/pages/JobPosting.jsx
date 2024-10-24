import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from '../contexts/UserContext';
import { Navigate, useNavigate } from 'react-router-dom';

const JobPostingList = () => {
  const { user, loading } = useUserContext();
  const [jobPostings, setJobPostings] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const navigate = useNavigate();
  const [isSorting, setIsSorting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New state variables for filtering, sorting, and pagination
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    minCompensation: '',
    maxCompensation: '',
    minExperience: '',
    maxExperience: '',
  });
  const [sort, setSort] = useState('compensationStart:desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [filters, sort, page, limit]);

  const fetchData = async () => {
    if (!isSorting) {
      setIsLoading(true);
    }
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        sort,
        limit,
        page,
      });
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobPosting?${queryParams}`);
      setJobPostings(response.data.jobPostings);
      setTotalPages(response.data.totalPages);
      
      setDataReady(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally {
      setIsLoading(false);
      setIsSorting(false);
    }
  };
  const OverlayLoader = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    </div>
  );

  const handleAddJob = () => {
    navigate('/job-posting/create');
  };

  const handleEditJob = (id) => {
    navigate(`/job-posting/create`, { state: jobPostings.find(job => job._id === id) });
  };

  const handleDeleteJob = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/jobPosting/${id}`);
      setJobPostings(jobPostings.filter(job => job._id !== id));
    } catch (error) {
      console.error('Error deleting job posting:', error);
    }finally{
      setIsLoading(false);
    }
  };

  const formatCompensation = (value) => {
    return value.toLocaleString();
  };
  
  const truncateDescription = (description) => {
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  };

  const handleFilterChange = (e) => {
    setIsLoading(true);
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filters change
    setIsLoading(false);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1); // Reset to first page when sort changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
    fetchData();
  };

  const handleViewApplicants = (jobId) => {
    navigate(`/application-trello/${jobId}`);
  };

  if (loading || isLoading) {
    return <OverlayLoader />;
  }

  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  if (!dataReady) {
    return <OverlayLoader/>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-purple-800 mb-8">Job Posting Management</h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
          <div className="p-6 bg-primary">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Job Postings</h2>
              <button
                onClick={handleAddJob}
                className="bg-white text-primary px-4 py-2 rounded-full font-medium hover:bg-purple-100 transition duration-300 ease-in-out"
              >
                Add New Job Posting
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={filters.title}
                onChange={handleFilterChange}
                className="border border-purple-300 p-2 rounded text-primary"
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={filters.location}
                onChange={handleFilterChange}
                className="border border-purple-300 p-2 rounded text-primary"
              />
              <input
                type="number"
                name="minCompensation"
                placeholder="Min Compensation"
                value={filters.minCompensation}
                onChange={handleFilterChange}
                className="border border-purple-300 p-2 rounded text-primary"
              />
              <input
                type="number"
                name="maxCompensation"
                placeholder="Max Compensation"
                value={filters.maxCompensation}
                onChange={handleFilterChange}
                className="border border-purple-300 p-2 rounded text-primary"
              />
              <input
                type="number"
                name="minExperience"
                placeholder="Min Experience"
                value={filters.minExperience}
                onChange={handleFilterChange}
                className="border border-purple-300 p-2 rounded text-primary"
              />
              <input
                type="number"
                name="maxExperience"
                placeholder="Max Experience"
                value={filters.maxExperience}
                onChange={handleFilterChange}
                className="border border-purple-300 p-2 rounded text-primary"
              />
            </div>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleSearch}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-purple-800 transition duration-300 ease-in-out"
              >
                Search
              </button>
            </div>
            <div className="flex justify-between items-center mb-4">
              <select
                value={sort}
                onChange={handleSortChange}
                className="border bg-primary border-white p-2 rounded text-white cursor-pointer"
              >
                <option value="compensationStart:desc" className="bg-primary text-white hover:bg-white hover:text-primary">Highest Compensation</option>
                <option value="compensationStart:asc" className="bg-primary text-white hover:bg-white hover:text-primary">Lowest Compensation</option>
                <option value="applicationDeadline:asc" className="bg-primary text-white hover:bg-white hover:text-primary">Earliest Deadline</option>
                <option value="applicationDeadline:desc" className="bg-primary text-white hover:bg-white hover:text-primary">Latest Deadline</option>
                <option value="applicantCount:asc" className="bg-primary text-white hover:bg-white hover:text-primary">Lowest Number of New Applicants</option>
                <option value="applicantCount:desc" className="bg-primary text-white hover:bg-white hover:text-primary">Highest Number of New Applicants</option>
              </select>
              <div>
                <span className="text-purple-700">Show </span>
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="border bg-primary border-white p-2 rounded text-white cursor-pointer "
                >
                  <option value="10" className="bg-primary text-white hover:bg-white hover:text-primary">10</option>
                  <option value="20" className="bg-primary text-white hover:bg-white hover:text-primary">20</option>
                  <option value="50" className="bg-primary text-white hover:bg-white hover:text-primary">50</option>
                </select>
                <span className="text-purple-700"> per page</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Application Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Compensation Range</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">New Applicants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-200">
                {jobPostings.map((job) => (
                  <tr key={job._id} className="hover:bg-purple-50 transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {job.clientReference !== undefined ? job.clientReference.name : "Not Available"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{job.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{job.mode ?? "Not Available"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{new Date(job.applicationDeadline).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">₹{formatCompensation(job.compensationStart)} - ₹{formatCompensation(job.compensationEnd)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{job.applicantCount}</td>
                    <td className="px-6 py-4 flex items-center whitespace-nowrap">
                      <div className="relative group">
                        <button
                          onClick={() => handleViewApplicants(job._id)}
                          className="text-blue-600 hover:text-blue-800 font-medium mr-2"
                          aria-label="View Applicants"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          View Applicants
                        </span>
                      </div>
                      <div className="relative group">
                        <button
                          onClick={() => handleEditJob(job._id)}
                          className="text-primary hover:text-purple-700 transition duration-300 ease-in-out mr-2"
                          aria-label="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Edit Job
                        </span>
                      </div>
                      <div className="relative group">
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                          aria-label="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Delete Job
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-white hover:text-primary transition duration-300 ease-in-out"
            >
              Previous
            </button>
            <span className="text-purple-700">Page {page} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-white hover:text-primary transition duration-300 ease-in-out"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingList;


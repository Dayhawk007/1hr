import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from '../contexts/UserContext';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';

const JobPostingList = () => {
  const { user, loading } = useUserContext();
  const [jobPostings, setJobPostings] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    title: '',
    location: '',
    minCompensation: '',
    maxCompensation: '',
    minExperience: '',
    maxExperience: '',
  });
  const [sortBy, setSortBy] = useState('compensationStart');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newFilters = {
      title: queryParams.get('title') || '',
      location: queryParams.get('location') || '',
      minCompensation: queryParams.get('minCompensation') || '',
      maxCompensation: queryParams.get('maxCompensation') || '',
      minExperience: queryParams.get('minExperience') || '',
      maxExperience: queryParams.get('maxExperience') || '',
    };
    setFilters(newFilters);

    const sort = queryParams.get('sort') || 'compensationStart:desc';
    const [sortField, sortDirection] = sort.split(':');
    setSortBy(sortField);
    setSortOrder(sortDirection);

    setCurrentPage(parseInt(queryParams.get('page') || '1', 10));

    fetchData(newFilters, sortField, sortDirection, queryParams.get('page') || '1');
  }, [location.search]);

  const fetchData = async (filters, sortBy, sortOrder, page) => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        sort: `${sortBy}:${sortOrder}`,
        page,
        limit: '20',
      });
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobPosting?${queryParams}`);
      setJobPostings(response.data.jobPostings);
      setTotalPages(response.data.totalPages);
      setDataReady(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddApplicant = (jobId) => {
    navigate(`/job-posting/${jobId}/add-applicant`);
  };

  const handleShowApplicants = (jobId) => {
    navigate(`/job-posting/${jobId}/show-applicants`);
  };

  const formatCompensation = (value) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const truncateDescription = (description) => {
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split(':');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    fetchData(filters, newSortBy, newSortOrder, currentPage);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchData(filters, sortBy, sortOrder, newPage);
  };
  const OverlayLoader = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    </div>
  );

  if (loading) {
    return <OverlayLoader />;
  }

  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  if (!dataReady) {
    return <OverlayLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-8">Job Postings</h1>
        
        {/* Filters */}
        <div className="mb-4 grid grid-cols-3 gap-4">
          <input
            type="text"
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
            placeholder="Job Title"
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Location"
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="minCompensation"
            value={filters.minCompensation}
            onChange={handleFilterChange}
            placeholder="Min Compensation"
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="maxCompensation"
            value={filters.maxCompensation}
            onChange={handleFilterChange}
            placeholder="Max Compensation"
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="minExperience"
            value={filters.minExperience}
            onChange={handleFilterChange}
            placeholder="Min Experience"
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="maxExperience"
            value={filters.maxExperience}
            onChange={handleFilterChange}
            placeholder="Max Experience"
            className="p-2 border rounded"
          />
        </div>

        {/* Sort */}
        <div className="mb-4">
          <select
            value={`${sortBy}:${sortOrder}`}
            onChange={handleSortChange}
            className="p-2 border border-purple-300 rounded text-gray-700 bg-white hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150 ease-in-out"
          >
            <option value="compensationStart:desc">Compensation (High to Low)</option>
            <option value="compensationStart:asc">Compensation (Low to High)</option>
            <option value="applicationDeadline:asc">Application Deadline (Earliest)</option>
            <option value="applicationDeadline:desc">Application Deadline (Latest)</option>
          </select>
        </div>

        {/* Job Postings Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center
                   text-xs font-medium text-gray-700 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-center
                   text-xs font-medium text-gray-700 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-center
                   text-xs font-medium text-gray-700 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-center
                   text-xs font-medium text-gray-700 uppercase tracking-wider">Application Deadline</th>
                  <th className="px-6 py-3 text-center
                   text-xs font-medium text-gray-700 uppercase tracking-wider">Compensation Range</th>
                  <th className="px-6 py-3 text-center
                   text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-center">
                {jobPostings.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {job.clientReference !== undefined ? job.clientReference.name : "Not Available"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{job.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{new Date(job.applicationDeadline).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">₹{formatCompensation(job.compensationStart)} - ₹{formatCompensation(job.compensationEnd)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleAddApplicant(job._id)}
                        className="bg-primary text-white px-4 py-2 rounded-full font-medium hover:bg-purple-700 transition duration-300 ease-in-out mr-2"
                      >
                        Add Applicant
                      </button>
                      <button
                        onClick={() => handleShowApplicants(job._id)}
                        className="bg-purple-700 text-white px-4 py-2 rounded-full font-medium hover:bg-purple-800 transition duration-300 ease-in-out"
                      >
                        Show Applicants
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === page ? 'bg-primary text-white' : 'bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobPostingList;

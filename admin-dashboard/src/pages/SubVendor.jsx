import React, { useState, useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <p className="text-gray-800 text-lg mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded font-medium text-gray-600 hover:bg-gray-100 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded font-medium bg-red-500 text-white hover:bg-red-600 transition duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const SubVendorList = () => {
  const { user, loading: userLoading } = useUserContext();
  const [subVendors, setSubVendors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubVendor, setCurrentSubVendor] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSorting, setIsSorting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, id: null });

  // Pagination and sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');

  const OverlayLoader = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    </div>
  );

  const fetchSubVendors = async () => {
    if (!isSorting) {
      setIsLoading(true);
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/sub-vendor`, {
        params: {
          page: currentPage,
          limit: 10,
          sortBy,
          sortOrder,
          name: nameFilter,
          email: emailFilter
        }
      });
      setSubVendors(response.data.subVendors);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching sub-vendors:', error);
      alert('Failed to fetch sub-vendors');
    } finally {
      setIsLoading(false);
      setIsSorting(false);
    }
  };

  useEffect(() => {
    fetchSubVendors();
  }, [currentPage, sortBy, sortOrder, nameFilter, emailFilter]);

  const handleSort = (field) => {
    setIsSorting(true);
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleAddSubVendor = () => {
    setCurrentSubVendor({ name: '', email: '', password: '' });
    setIsModalOpen(true);
  };

  const handleEditSubVendor = (index) => {
    if (index >= 0 && index < subVendors.length) {
      setCurrentSubVendor({ ...subVendors[index], index });
      setIsModalOpen(true);
    } else {
      console.error('Invalid sub-vendor index:', index);
      alert('Error opening edit modal');
    }
  };

  const handleDeleteSubVendor = async (id) => {
    if (!id) return;
    
    setDeleteConfirmation({ show: false, id: null });
    setIsLoading(true);
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/user/${id}`, {
        data: { type: 'sub-vendor' }
      });
      setSubVendors(subVendors.filter(subVendor => subVendor._id !== id));
      
      // Show success message as an overlay that automatically disappears
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-500 ease-in-out';
      successMessage.textContent = 'Sub-vendor deleted successfully';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        successMessage.style.transform = 'translateX(150%)';
        setTimeout(() => document.body.removeChild(successMessage), 500);
      }, 2000);
      
    } catch (error) {
      console.error('Error deleting sub-vendor:', error);
      // Show error message as an overlay
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg';
      errorMessage.textContent = 'Failed to delete sub-vendor';
      document.body.appendChild(errorMessage);
      
      setTimeout(() => document.body.removeChild(errorMessage), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSubVendor = async () => {
    setIsLoading(true);
    try {
      if (currentSubVendor.index !== undefined) {
        // Update existing sub-vendor
        const subVendorId = subVendors[currentSubVendor.index]?._id;
        if (!subVendorId) {
          throw new Error('Sub-vendor ID not found');
        }
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/user/${subVendorId}`, {
          name: currentSubVendor.name,
          email: currentSubVendor.email,
          type: 'sub-vendor'
        });
        setSubVendors(prevSubVendors => {
          const updatedSubVendors = [...prevSubVendors];
          updatedSubVendors[currentSubVendor.index] = response.data.user;
          return updatedSubVendors;
        });
        
        // Show success message overlay
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-500 ease-in-out';
        successMessage.textContent = 'Sub-vendor updated successfully';
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
          successMessage.style.transform = 'translateX(150%)';
          setTimeout(() => document.body.removeChild(successMessage), 500);
        }, 2000);
        
      } else {
        // Add new sub-vendor
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/signup`, {
          ...currentSubVendor,
          type: 'sub-vendor'
        });
        const newUser = response.data.user;
        if (newUser && newUser._id) {
          setSubVendors(prevSubVendors => [...prevSubVendors, newUser]);
          
          // Show success message overlay
          const successMessage = document.createElement('div');
          successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-500 ease-in-out';
          successMessage.textContent = 'New sub-vendor added successfully';
          document.body.appendChild(successMessage);
          
          setTimeout(() => {
            successMessage.style.transform = 'translateX(150%)';
            setTimeout(() => document.body.removeChild(successMessage), 500);
          }, 2000);
          
        } else {
          throw new Error('Incomplete user data received from server');
        }
      }
      setIsModalOpen(false);
      setCurrentSubVendor(null);
      await fetchSubVendors(); // Refresh the sub-vendor list
    } catch (error) {
      console.error('Error saving sub-vendor:', error);
      
      // Show error message overlay
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-500 ease-in-out';
      errorMessage.textContent = error.message || 'Failed to save sub-vendor';
      document.body.appendChild(errorMessage);
      
      setTimeout(() => {
        errorMessage.style.transform = 'translateX(150%)';
        setTimeout(() => document.body.removeChild(errorMessage), 500);
      }, 3000);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    setIsPasswordModalOpen(true);
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    setIsLoading(true);
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/user/update-password/${subVendors[currentSubVendor.index]._id}`, {
        newPassword: newPassword,
        type: 'sub-vendor'
      });
      setIsPasswordModalOpen(false);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      alert('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('Failed to update password');
      alert('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  if ((userLoading || isLoading) && !isSorting) {
    return <OverlayLoader />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-8">Sub-Vendor Management</h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 bg-primary">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Sub-Vendor List</h2>
              <button
                onClick={handleAddSubVendor}
                className="bg-white text-primary px-4 py-2 rounded-full font-medium hover:bg-purple-100 transition duration-300 ease-in-out"
              >
                Add New Sub-Vendor
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="flex mb-4 space-x-4">
              <input
                type="text"
                placeholder="Filter by name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Filter by email"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className="border p-2 rounded"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-100">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      Name {sortBy === 'name' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('email')}
                    >
                      Email {sortBy === 'email' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-purple-200">
                  {subVendors.map((subVendor, index) => (
                    <tr key={subVendor._id} className="hover:bg-purple-50 transition duration-150 ease-in-out">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subVendor.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subVendor.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center">
                          <div className="relative group">
                            <button
                              onClick={() => handleEditSubVendor(index)}
                              className="text-primary hover:text-purple-700 transition duration-300 ease-in-out mr-2"
                              aria-label="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Edit Sub-Vendor
                            </span>
                          </div>
                          <div className="relative group">
                            <button
                              onClick={() => setDeleteConfirmation({ show: true, id: subVendor._id })}
                              className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                              aria-label="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Delete Sub-Vendor
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* Modal for adding/editing sub-vendor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-primary">
              {currentSubVendor.index !== undefined ? 'Edit Sub-Vendor' : 'Add New Sub-Vendor'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Name</label>
                <input
                  type="text"
                  value={currentSubVendor.name}
                  onChange={(e) =>
                    setCurrentSubVendor({ ...currentSubVendor, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Email</label>
                <input
                  type="email"
                  value={currentSubVendor.email}
                  onChange={(e) =>
                    setCurrentSubVendor({ ...currentSubVendor, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
                />
              </div>
              {currentSubVendor.index === undefined && (
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={currentSubVendor.password}
                      onChange={(e) =>
                        setCurrentSubVendor({ ...currentSubVendor, password: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded font-medium text-gray-600 hover:bg-gray-100 transition duration-300 ease-in-out"
              >
                Cancel
              </button>
              {currentSubVendor.index !== undefined && (
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 rounded font-medium bg-primary text-white hover:bg-purple-700 transition duration-300 ease-in-out"
                >
                  Change Password
                </button>
              )}
              <button
                onClick={handleSaveSubVendor}
                className="px-4 py-2 rounded font-medium bg-primary text-white hover:bg-purple-700 transition duration-300 ease-in-out"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for changing password */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-primary">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
                />
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError('');
                }}
                className="px-4 py-2 rounded font-medium text-gray-600 hover:bg-gray-100 transition duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePassword}
                className="px-4 py-2 rounded font-medium bg-primary text-white hover:bg-purple-700 transition duration-300 ease-in-out"
              >
                Save Password
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={deleteConfirmation.show}
        onClose={() => setDeleteConfirmation({ show: false, id: null })}
        onConfirm={() => handleDeleteSubVendor(deleteConfirmation.id)}
        message="Are you sure you want to delete this sub-vendor?"
      />
    </div>
  );
};

export default SubVendorList;

import React, { useState, useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const SubVendorList = () => {
  const { user, loading } = useUserContext();
  const [subVendors, setSubVendors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubVendor, setCurrentSubVendor] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch sub-vendors from API on component mount
  useEffect(() => {
    const fetchSubVendors = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/sub-vendor`); // Adjust the API endpoint as needed
        setSubVendors(response.data);
      } catch (error) {
        console.error('Error fetching sub-vendors:', error);
      }
    };
    fetchSubVendors();
  }, []);

  const handleAddSubVendor = () => {
    setCurrentSubVendor({ name: '', email: '', password: '' });
    setIsModalOpen(true);
  };

  const handleEditSubVendor = (index) => {
    setCurrentSubVendor({ ...subVendors[index], index });
    setIsModalOpen(true);
  };

  const handleDeleteSubVendor = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/sub-vendor/${id}`);
      setSubVendors(subVendors.filter(subVendor => subVendor._id !== id));
    } catch (error) {
      console.error('Error deleting sub-vendor:', error);
    }
  };

  const handleSaveSubVendor = async () => {
    if (currentSubVendor.index !== undefined) {
      // Update existing sub-vendor
      try {
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/sub-vendor/${subVendors[currentSubVendor.index]._id}`, currentSubVendor);
        const updatedSubVendors = [...subVendors];
        updatedSubVendors[currentSubVendor.index] = response.data;
        setSubVendors(updatedSubVendors);
      } catch (error) {
        console.error('Error updating sub-vendor:', error);
      }
    } else {
      // Add new sub-vendor
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/sub-vendor`, currentSubVendor);
        setSubVendors([...subVendors, response.data]);
      } catch (error) {
        console.error('Error adding sub-vendor:', error);
      }
    }
    setIsModalOpen(false);
    setCurrentSubVendor(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user && !loading) {
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
          <ul className="divide-y divide-gray-200">
            {subVendors.map((subVendor, index) => (
              <li key={index} className="flex items-center justify-between p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{subVendor.name}</h3>
                  <p className="text-gray-600">{subVendor.email}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEditSubVendor(index)}
                    className="text-primary hover:text-purple-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSubVendor(subVendor._id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

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
                      <svg className="h-6 w-6 text-gray-700" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 text-gray-700" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded font-medium text-gray-600 hover:bg-gray-100 transition duration-300 ease-in-out"
              >
                Cancel
              </button>
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
    </div>
  );
};

export default SubVendorList;

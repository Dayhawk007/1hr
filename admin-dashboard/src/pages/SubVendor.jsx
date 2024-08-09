import React, { useState, useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const SubVendorList = () => {
  const { user, loading } = useUserContext();
  const [subVendors, setSubVendors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubVendor, setCurrentSubVendor] = useState(null);

  // Fetch sub-vendors from API on component mount
  useEffect(() => {
    const fetchSubVendors = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/sub-vendor'); // Adjust the API endpoint as needed
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
      await axios.delete(`http://127.0.0.1:5000/api/sub-vendor/${id}`);
      setSubVendors(subVendors.filter(subVendor => subVendor._id !== id));
    } catch (error) {
      console.error('Error deleting sub-vendor:', error);
    }
  };

  const handleSaveSubVendor = async () => {
    if (currentSubVendor.index !== undefined) {
      // Update existing sub-vendor
      try {
        const response = await axios.patch(`http://127.0.0.1:5000/api/sub-vendor/${subVendors[currentSubVendor.index]._id}`, currentSubVendor);
        const updatedSubVendors = [...subVendors];
        updatedSubVendors[currentSubVendor.index] = response.data;
        setSubVendors(updatedSubVendors);
      } catch (error) {
        console.error('Error updating sub-vendor:', error);
      }
    } else {
      // Add new sub-vendor
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/sub-vendor', currentSubVendor);
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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Sub-Vendor List</h1>
        <button
          onClick={handleAddSubVendor}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
        >
          Add Sub-Vendor
        </button>
        <ul>
          {subVendors.map((subVendor, index) => (
            <li
              key={index}
              className="flex items-center space-x-4 p-4 border-b border-gray-700 last:border-b-0"
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-200">
                  {subVendor.name}
                </h2>
                <p className="text-gray-400">{subVendor.email}</p>
              </div>
              <button
                onClick={() => handleEditSubVendor(index)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteSubVendor(subVendor._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              {currentSubVendor.index !== undefined ? 'Edit Sub-Vendor' : 'Add Sub-Vendor'}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={currentSubVendor.name}
                onChange={(e) =>
                  setCurrentSubVendor({ ...currentSubVendor, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:bg-gray-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={currentSubVendor.email}
                onChange={(e) =>
                  setCurrentSubVendor({ ...currentSubVendor, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:bg-gray-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={currentSubVendor.password}
                onChange={(e) =>
                  setCurrentSubVendor({ ...currentSubVendor, password: e.target.value })
                }
                className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:bg-gray-600"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSubVendor}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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

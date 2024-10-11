import React, { useState, useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ClientList = () => {
  const { user, loading } = useUserContext();
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);

  // Fetch clients from API on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/client`); // Adjust the API endpoint as needed
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    fetchClients();
  }, []);

  const handleAddClient = () => {
    setCurrentClient({ name: '', email: '', password: '' });
    setIsModalOpen(true);
  };

  const handleEditClient = (index) => {
    setCurrentClient({ ...clients[index], index });
    setIsModalOpen(true);
  };

  const handleDeleteClient = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/client/${id}`);
      setClients(clients.filter(client => client._id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleSaveClient = async () => {
    if (currentClient.index !== undefined) {
      // Update existing client
      try {
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/client/${clients[currentClient.index]._id}`, currentClient);
        const updatedClients = [...clients];
        updatedClients[currentClient.index] = response.data;
        setClients(updatedClients);
      } catch (error) {
        console.error('Error updating client:', error);
      }
    } else {
      // Add new client
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/client`, currentClient);
        setClients([...clients, response.data]);
      } catch (error) {
        console.error('Error adding client:', error);
      }
    }
    setIsModalOpen(false);
    setCurrentClient(null);
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
        <h1 className="text-2xl font-bold mb-4">Client List</h1>
        <button
          onClick={handleAddClient}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
        >
          Add Client
        </button>
        <ul>
          {clients.map((client, index) => (
            <li
              key={index}
              className="flex items-center space-x-4 p-4 border-b border-gray-700 last:border-b-0"
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-200">
                  {client.name}
                </h2>
                <p className="text-gray-400">{client.email}</p>
              </div>
              <button
                onClick={() => handleEditClient(index)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClient(client._id)}
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
              {currentClient.index !== undefined ? 'Edit Client' : 'Add Client'}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={currentClient.name}
                onChange={(e) =>
                  setCurrentClient({ ...currentClient, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:bg-gray-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={currentClient.email}
                onChange={(e) =>
                  setCurrentClient({ ...currentClient, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:bg-gray-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={currentClient.password}
                onChange={(e) =>
                  setCurrentClient({ ...currentClient, password: e.target.value })
                }
                className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:bg-gray-600"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClient}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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

export default ClientList;

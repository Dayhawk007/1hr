import React, { useState } from 'react';

const initialClients = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

const ClientList = () => {
  const [clients, setClients] = useState(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);

  const handleAddClient = () => {
    setCurrentClient({ name: '', email: '', avatar: '' });
    setIsModalOpen(true);
  };

  const handleEditClient = (index) => {
    setCurrentClient({ ...clients[index], index });
    setIsModalOpen(true);
  };

  const handleSaveClient = () => {
    if (currentClient.index !== undefined) {
      const updatedClients = [...clients];
      updatedClients[currentClient.index] = currentClient;
      setClients(updatedClients);
    } else {
      setClients([...clients, currentClient]);
    }
    setIsModalOpen(false);
    setCurrentClient(null);
  };

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
              <img
                className="w-12 h-12 rounded-full"
                src={client.avatar}
                alt={client.name}
              />
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
              <label className="block text-gray-400 mb-1">Avatar URL</label>
              <input
                type="text"
                value={currentClient.avatar}
                onChange={(e) =>
                  setCurrentClient({ ...currentClient, avatar: e.target.value })
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

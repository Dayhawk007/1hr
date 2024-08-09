import React from 'react';
import { useUserContext } from '../contexts/UserContext';
import { Navigate } from 'react-router-dom';

function Dashboard() {
  

  const { user,loading } = useUserContext();

  console.log("User ",user);
  console.log("Loading ",loading);  

  if(loading) {
    return <div>Loading...</div>;
  }

  if(!user && !loading) {
    return <Navigate to="/login" />;
  }

  

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <h1 className="text-6xl font-bold animate-fade-in">1HR ATS ADMIN</h1>
  </div>
  );
}

export default Dashboard;

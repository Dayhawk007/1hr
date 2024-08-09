// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {loginUser} = useUserContext();
  const handleLogin = async() => {
    if(email === '' || password === '') {
      alert('Please enter email and password');
    }
    else {
      const status=await loginUser({email, password});
      console.log("Status ",status);
      if(status===true) {
        navigate('/');
      }
      else {
        alert('Invalid credentials or something went wrong');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="w-full max-w-md mx-auto bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">1HR</h1>
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:bg-gray-600"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:bg-gray-600"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;

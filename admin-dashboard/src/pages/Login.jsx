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
    <div className="min-h-screen bg-white flex items-center justify-center text-primary">
      <div className="w-full max-w-md mx-auto bg-primary shadow-lg rounded-lg p-6">
        <h1 className="text-4xl text-white font-bold mb-6 text-center">1HR</h1>
        <div className="mb-4">
          <label className="block text-white mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none focus:bg-white"
          />
        </div>
        <div className="mb-6">
          <label className="block text-white mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none focus:bg-white"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-white text-primary px-4 py-2 rounded-xl
           shadow-lg font-bold hover:bg-purple-700 hover:text-white ease-in-out duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;

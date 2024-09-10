// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        <div className="mb-6 relative">
          <label className="block text-white mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none focus:bg-white pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
          >
            {showPassword ? (
              <svg className="h-6 w-6 text-gray-700" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z">
                </path>
              </svg>
            ) : (
              <svg className="h-6 w-6 text-gray-700" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <path fill="currentColor" d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z">
                </path>
              </svg>
            )}
          </button>
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

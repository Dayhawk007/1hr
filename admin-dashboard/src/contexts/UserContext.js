import React, { useState, useEffect, createContext, useContext } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = Cookies.get('user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = async (userData) => {
    if (!userData) {
      alert("User data is required.");
      return false;
    }

    if (!userData.email || !userData.password) {
      alert("Please enter both email and password.");
      return false;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/admin/login`, userData);
      
      if (response.status === 200) {
        const userData = response.data;
        setUser(userData);
        Cookies.set('user', JSON.stringify(userData), { expires: 7 });
        setLoading(false);
        return true;
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Invalid credentials. Please check your email and password.");
      } else {
        alert("Something went wrong. Please try again later.");
      }
      setLoading(false);
      return false;
    }
  };

  const logoutUser = () => {
    setUser(null);
    Cookies.remove('user');
    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export { UserContext, UserProvider, useUserContext };

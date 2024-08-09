import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ClientList from './pages/Clients';
import SubVendorList from './pages/SubVendor';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/client" element={<Layout><ClientList /></Layout>} />
        <Route path="/sub-vendor" element={<Layout><SubVendorList /></Layout>} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;

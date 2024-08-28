import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ClientList from './pages/Clients';
import SubVendorList from './pages/SubVendor';
import JobPostingList from './pages/JobPosting';
import JobForm from './pages/CreateJobPosting';
import ApplicationList from './pages/ApplicationList';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/job-posting" element={<Layout><JobPostingList /></Layout>} />
        <Route path="/job-posting/create" element={<Layout><JobForm/></Layout>} />
        <Route path="/job-posting/:jobId/applications" element={<ApplicationList />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;

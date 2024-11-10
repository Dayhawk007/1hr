import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ClientList from './pages/Clients';
import SubVendorList from './pages/SubVendor';
import JobPostingList from './pages/JobPosting';
import JobForm from './pages/CreateJobPosting';
import { UserProvider } from './contexts/UserContext';
import ApplicationTrello from './pages/ApplicationTrello';
import ApplicantDetails from './pages/ApplicantDetails';
import HiringFunnel from './pages/ApplicationFunnel';

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/client" element={<Layout><ClientList /></Layout>} />
        <Route path="/sub-vendor" element={<Layout><SubVendorList /></Layout>} />
        <Route path="/job-posting" element={<Layout><JobPostingList /></Layout>} />
        <Route path="/job-posting/create" element={<Layout><JobForm/></Layout>} />
        <Route path="/application-trello/:jobId" element={<Layout><ApplicationTrello /></Layout>} />
        <Route path="/applications/:applicantId" element={<Layout><ApplicantDetails /></Layout>} />
        <Route path="/application-funnel/:jobId" element={<Layout><HiringFunnel /></Layout>} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;

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
import ShowApplicants from './pages/ApplicationTrello';
import { UserProvider } from './contexts/UserContext';
import ApplicantDetails from './pages/ApplicantDetails';

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/job-posting" element={<Layout><JobPostingList /></Layout>} />
        <Route path="/job-posting/create" element={<Layout><JobForm/></Layout>} />
        <Route path="/job-posting/:jobId/applications" element={<Layout><ShowApplicants /></Layout>} />
        <Route path="/applicant/:applicantId" element={<Layout><ApplicantDetails /></Layout>} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;

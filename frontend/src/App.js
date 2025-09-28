import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import ApplicantDetails from './pages/ApplicantDetails';
import GeneralInformation from './pages/GeneralInformation';
import JobDetails from './pages/JobDetails';
import SiteAddress from './pages/SiteAddress';
import LoadDetails from './pages/LoadDetails';
import OtherContact from './pages/OtherContact';
import ClickQuote from './pages/ClickQuote';
import ProjectDetails from './pages/ProjectDetails';
import AutoQuoteEligibility from './pages/AutoQuoteEligibility';
import UploadDocs from './pages/UploadDocs';
import Summary from './pages/Summary';
import Submitted from './pages/Submitted';
import { ApplicationProvider } from './context/ApplicationContext';
import './App.css';

function AppContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const location = useLocation();
  
  const steps = [
    'Applicant Details',
    'General Information',
    'Job Details',
    'Site Address',
    'Load Details',
    'Other Contact',
    'Project Details',
    'Auto Quote Eligibility',
    'Upload Docs',
    'Click & Quote',
    'Summary',
    'Submitted'
  ];

  // Update current step based on route
  useEffect(() => {
    const pathToStepMap = {
      '/': 0,
      '/general-information': 1,
      '/job-details': 2,
      '/site-address': 3,
      '/load-details': 4,
      '/other-contact': 5,
      '/project-details': 6,
      '/auto-quote-eligibility': 7,
      '/upload-docs': 8,
      '/click-quote': 9,
      '/summary': 10,
      '/submitted': 11
    };
    
    const step = pathToStepMap[location.pathname] || 0;
    setCurrentStep(step);
  }, [location.pathname]);

    return (
      <div className="app">
        <Header />
        <ProgressBar steps={steps} currentStep={currentStep} />
        <main className="main-content">
        <Routes>
          <Route path="/" element={<ApplicantDetails onNext={() => setCurrentStep(1)} />} />
          <Route path="/general-information" element={<GeneralInformation onNext={() => setCurrentStep(2)} />} />
          <Route path="/job-details" element={<JobDetails onNext={() => setCurrentStep(3)} />} />
          <Route path="/site-address" element={<SiteAddress onNext={() => setCurrentStep(4)} />} />
          <Route path="/load-details" element={<LoadDetails onNext={() => setCurrentStep(5)} />} />
          <Route path="/other-contact" element={<OtherContact onNext={() => setCurrentStep(6)} />} />
          <Route path="/project-details" element={<ProjectDetails onNext={() => setCurrentStep(7)} />} />
          <Route path="/auto-quote-eligibility" element={<AutoQuoteEligibility onNext={() => setCurrentStep(8)} />} />
          <Route path="/upload-docs" element={<UploadDocs onNext={() => setCurrentStep(9)} />} />
          <Route path="/click-quote" element={<ClickQuote onNext={() => setCurrentStep(10)} />} />
          <Route path="/summary" element={<Summary onNext={() => setCurrentStep(11)} />} />
          <Route path="/submitted" element={<Submitted />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ApplicationProvider>
      <Router>
        <AppContent />
      </Router>
    </ApplicationProvider>
  );
}

export default App;

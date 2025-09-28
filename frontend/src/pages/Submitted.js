import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

const Submitted = () => {
  const navigate = useNavigate();
  const { applicationData, applicationId } = useApplication();
  const [applicationNumber, setApplicationNumber] = useState('');

  useEffect(() => {
    // Generate application number
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    setApplicationNumber(`UKPN-${year}${month}${day}-${randomNum}`);
  }, []);

  const handleNewApplication = () => {
    navigate('/');
  };

  const handleViewStatus = () => {
    // Navigate to application status page (if implemented)
    console.log('View application status');
  };

  return (
    <div className="form-container">
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        
        <h1 className="form-title" style={{ color: '#28a745', marginBottom: '1rem' }}>
          Application Submitted Successfully!
        </h1>
        
        <div style={{ backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Application Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left' }}>
            <div><strong>Application Number:</strong> {applicationNumber}</div>
            <div><strong>Application ID:</strong> {applicationId || 'N/A'}</div>
            <div><strong>Submitted Date:</strong> {new Date().toLocaleDateString()}</div>
            <div><strong>Submitted Time:</strong> {new Date().toLocaleTimeString()}</div>
            <div><strong>Status:</strong> <span style={{ color: '#28a745', fontWeight: 'bold' }}>Submitted</span></div>
            <div><strong>Quote Method:</strong> {applicationData.applicant_details?.quoteMethod || 'N/A'}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#e7f3ff', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'left' }}>
          <h3 style={{ marginBottom: '1rem', color: '#0066cc' }}>What happens next?</h3>
          <ol style={{ marginLeft: '1rem', color: '#333' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Confirmation Email:</strong> You will receive a confirmation email within 24 hours with your application reference number.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Initial Review:</strong> Our team will review your application and may contact you for additional information if needed.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Site Survey:</strong> If required, we will arrange a site survey to assess the connection requirements.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Quote Generation:</strong> We will generate your quote based on the information provided and site assessment.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Quote Delivery:</strong> Your quote will be delivered via your preferred method within 10-15 working days.
            </li>
          </ol>
        </div>

        <div style={{ backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'left' }}>
          <h3 style={{ marginBottom: '1rem', color: '#856404' }}>Important Information</h3>
          <ul style={{ marginLeft: '1rem', color: '#333' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              Please keep your application reference number safe as you will need it for future correspondence.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              If you need to make any changes to your application, please contact us as soon as possible.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Quotes are valid for 90 days from the date of issue.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              For any queries, please contact our customer service team.
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleViewStatus}>
            View Application Status
          </button>
          <button className="btn btn-outline" onClick={handleNewApplication}>
            Start New Application
          </button>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Need Help?</h4>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>
            If you have any questions about your application, please contact us:
          </p>
          <div style={{ color: '#666' }}>
            <div>📧 Email: applications@ukpowernetworks.co.uk</div>
            <div>📞 Phone: 0800 029 4285</div>
            <div>🕒 Hours: Monday to Friday, 8am to 6pm</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submitted;

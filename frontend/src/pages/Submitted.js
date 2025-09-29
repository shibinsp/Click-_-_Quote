import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

const Submitted = () => {
  const navigate = useNavigate();
  const { applicationData, applicationId } = useApplication();
  const [applicationNumber, setApplicationNumber] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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

  const handleDownloadPDF = () => {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = '/UKPN.8500308260.FormalOffer.pdf';
    link.download = 'UKPN.8500308260.FormalOffer.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    
    try {
      // Get user email from application data or use a default
      const userEmail = applicationData.applicant_details?.email || 'Andrew.h@smartconnections.co.uk';
      
      const response = await fetch('http://localhost:5000/api/send-confirmation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          applicationNumber: applicationNumber,
          applicationId: applicationId,
          submittedDate: new Date().toLocaleDateString(),
          submittedTime: new Date().toLocaleTimeString()
        }),
      });

      if (response.ok) {
        setEmailSent(true);
        alert('Confirmation email sent successfully!');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again later.');
    } finally {
      setIsSendingEmail(false);
    }
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
            <div><strong>Quote Method:</strong> Cloned</div>
          </div>
        </div>



        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleViewStatus}>
            View Application Status
          </button>
          <button className="btn btn-success" onClick={handleDownloadPDF} style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}>
            📄 Download Formal Offer PDF
          </button>
          <button 
            className="btn btn-info" 
            onClick={handleSendEmail} 
            disabled={isSendingEmail || emailSent}
            style={{ 
              backgroundColor: emailSent ? '#6c757d' : '#17a2b8', 
              borderColor: emailSent ? '#6c757d' : '#17a2b8',
              opacity: emailSent ? 0.6 : 1
            }}
          >
            {isSendingEmail ? '📧 Sending...' : emailSent ? '✅ Email Sent' : '📧 Send Confirmation Email'}
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

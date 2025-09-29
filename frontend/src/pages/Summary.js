import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

const Summary = ({ onNext }) => {
  const navigate = useNavigate();
  const { applicationData, loadItems, updateApplication } = useApplication();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateApplication('summary', { 
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      });
      navigate('/submitted');
      onNext();
    } catch (error) {
      console.error('Error submitting application:', error);
      setIsSubmitting(false);
    }
  };

  // Static data - no need for dynamic calculation

  return (
    <div className="form-container">
      <h1 className="form-title">Application Summary</h1>
      
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Please review your application details before submitting:</h3>
        </div>

        {/* Applicant Details */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Applicant Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><strong>Are you applying on behalf of a company OR as an individual?:</strong> Company</div>
            <div><strong>Company Name:</strong> Smart Connections</div>
            <div><strong>Title:</strong> Mr.</div>
            <div><strong>First Name:</strong> Andrew</div>
            <div><strong>Last Name:</strong> Hamilton</div>
            <div><strong>Email:</strong> Andrew.h@smartconnections.co.uk</div>
            <div><strong>Mobile:</strong> 07555544444</div>
            <div><strong>Street:</strong> 12</div>
            <div><strong>Street 2:</strong> Ormsby</div>
            <div><strong>Street 3:</strong> Stanley Road</div>
            <div><strong>City:</strong> Sutton</div>
            <div><strong>Postcode:</strong> SM2 6TJ</div>
            <div><strong>State:</strong> Surrey</div>
            <div><strong>Country:</strong> United Kingdom</div>
            <div><strong>Is the site address the same as the correspondence address above?:</strong> No</div>
            <div><strong>Is the invoice address the same as the correspondence address above?:</strong> Yes</div>
          </div>
        </div>

        {/* General Information */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>General Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><strong>Are you a customer of our Highways Services team:</strong> No</div>
            <div><strong>Which of the following you require:</strong> Formal Quote</div>
            <div><strong>Which services you are looking for:</strong> New Connection</div>
            <div><strong>What is the main use of the property:</strong> Commercial</div>
            <div><strong>How many meters do you need at the property?:</strong> More than one meter</div>
          </div>
        </div>

        {/* Job Details */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Job Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><strong>Do you have a grid reference:</strong> No</div>
            <div><strong>Are you applying on behalf of someone else?:</strong> No</div>
            <div><strong>When would you like your power connected?:</strong> 21.11.2025</div>
          </div>
        </div>

        {/* Site Address */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Site Address</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><strong>Street:</strong> 102 Field Road</div>
            <div><strong>Street 2:</strong> (empty)</div>
            <div><strong>Street 3:</strong> (empty)</div>
            <div><strong>City:</strong> Feltham</div>
            <div><strong>Postcode:</strong> TW14 0BJ</div>
            <div><strong>Country:</strong> United Kingdom</div>
          </div>
        </div>

        {/* Load Details */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Load Details</h3>
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#555' }}>Commercial Load Table</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><strong>Type of connection:</strong> Demand</div>
              <div><strong>What are you Connecting?:</strong> Commercial</div>
              <div><strong>How many phases is the connection:</strong> Three</div>
              <div><strong>If a property, how will it be heated?:</strong> Electric</div>
              <div><strong>How many are you connecting?***:</strong> 2</div>
              <div><strong>Load per installation type (kVA)***:</strong> 200</div>
              <div><strong>Summed load per installation type (kVA)***:</strong> 400</div>
              <div><strong>Total Combined Load (kVa):</strong> 400</div>
            </div>
          </div>
        </div>

        {/* Other Contacts */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Other Contacts</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><strong>Do you have an Authorised Representative?:</strong> No</div>
            <div><strong>Principal Contractor Details:</strong> No</div>
            <div><strong>Principal Designer Details:</strong> No</div>
          </div>
        </div>

        {/* Click & Quote Data */}
        {applicationData.click_quote_data && (
          <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Click & Quote Information</h3>
            
            {/* Map Data Summary */}
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#555' }}>Map Planning Data:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div><strong>Site Boundary:</strong> {applicationData.click_quote_data?.siteBoundary?.length > 0 ? `${applicationData.click_quote_data.siteBoundary.length} points defined` : 'Not defined'}</div>
                <div><strong>Substation:</strong> {applicationData.click_quote_data?.substationPremise ? 'Location marked' : 'Not marked'}</div>
                <div><strong>Cable Route:</strong> {applicationData.click_quote_data?.cableRoute?.length > 0 ? `${applicationData.click_quote_data.cableRoute.length} points defined` : 'Not defined'}</div>
              </div>
            </div>

            {/* Selected Quote */}
            {applicationData.click_quote_data?.selectedQuote && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                backgroundColor: '#cce5ff', 
                border: '1px solid #99ccff', 
                borderRadius: '6px',
                color: '#004080'
              }}>
                <h4 style={{ marginBottom: '0.5rem', color: '#004080' }}>✅ Selected Quote (Proceeding with Existing):</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div><strong>Quote ID:</strong> {applicationData.click_quote_data.selectedQuote.quoteId}</div>
                  <div><strong>Customer:</strong> {applicationData.click_quote_data.selectedQuote.customerName}</div>
                  <div><strong>Project Type:</strong> {applicationData.click_quote_data.selectedQuote.projectType}</div>
                  <div><strong>Connection Type:</strong> {applicationData.click_quote_data.selectedQuote.connectionType}</div>
                  <div><strong>Load Requirement:</strong> {applicationData.click_quote_data.selectedQuote.loadRequirement}</div>
                  <div><strong>Estimated Cost:</strong> £{applicationData.click_quote_data.selectedQuote.estimatedCost.toLocaleString()}</div>
                  <div><strong>Valid Until:</strong> {applicationData.click_quote_data.selectedQuote.validUntil}</div>
                  <div><strong>Selection Date:</strong> {applicationData.click_quote_data.quoteSelectionDate}</div>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  <strong>Threshold Criteria Accepted:</strong> {applicationData.click_quote_data.thresholdCriteriaAccepted ? 'Yes - User confirmed acceptance of discrepancies' : 'No'}
                </div>
              </div>
            )}

            {/* Cloned Quotation */}
            {applicationData.click_quote_data?.clonedQuotation && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                backgroundColor: '#d4edda', 
                border: '1px solid #c3e6cb', 
                borderRadius: '6px',
                color: '#155724'
              }}>
                <h4 style={{ marginBottom: '0.5rem', color: '#155724' }}>📋 Cloned Quotation Details:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div><strong>Quote ID:</strong> {applicationData.click_quote_data.clonedQuotation.quoteId}</div>
                  <div><strong>Customer:</strong> {applicationData.click_quote_data.clonedQuotation.customerName}</div>
                  <div><strong>Project Type:</strong> {applicationData.click_quote_data.clonedQuotation.projectType}</div>
                  <div><strong>Connection Type:</strong> {applicationData.click_quote_data.clonedQuotation.connectionType}</div>
                  <div><strong>Load Requirement:</strong> {applicationData.click_quote_data.clonedQuotation.loadRequirement}</div>
                  <div><strong>Estimated Cost:</strong> £{applicationData.click_quote_data.clonedQuotation.estimatedCost.toLocaleString()}</div>
                  <div><strong>Valid Until:</strong> {applicationData.click_quote_data.clonedQuotation.validUntil}</div>
                  <div><strong>Quote Date:</strong> {applicationData.click_quote_data.clonedQuotation.quoteDate}</div>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  <strong>Description:</strong> {applicationData.click_quote_data.clonedQuotation.description}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Project Details */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Project Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><strong>What type of connection would you like?:</strong> Flexible</div>
            <div><strong>What level of security of supply would you like?:</strong> Single Circuit</div>
            <div><strong>Are there any motors or disturbing loads?:</strong> No</div>
            <div><strong>Are you planning to install low carbon technologies?:</strong> No</div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/click-quote')}>
            Previous
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Summary;

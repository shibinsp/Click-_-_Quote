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

  const totalLoad = loadItems.reduce((sum, item) => sum + (item.summed_load || 0), 0);

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
            <div><strong>Quote Method:</strong> {applicationData.applicant_details?.quoteMethod || 'N/A'}</div>
            <div><strong>Contact Method:</strong> {applicationData.applicant_details?.contactMethod || 'N/A'}</div>
            <div><strong>Reference Number:</strong> {applicationData.applicant_details?.referenceNumber || 'N/A'}</div>
            <div><strong>Grid Reference:</strong> {applicationData.applicant_details?.hasGridReference || 'N/A'}</div>
            <div><strong>Applying on Behalf:</strong> {applicationData.applicant_details?.applyingOnBehalf || 'N/A'}</div>
            <div><strong>Had Quote Before:</strong> {applicationData.applicant_details?.hadQuoteBefore || 'N/A'}</div>
            <div><strong>Connection Date:</strong> {applicationData.applicant_details?.connectionDate || 'N/A'}</div>
          </div>
        </div>

        {/* General Information */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>General Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><strong>Highways Services:</strong> {applicationData.general_information?.highwaysServices || 'N/A'}</div>
            <div><strong>Quote Type:</strong> {applicationData.general_information?.quoteType || 'N/A'}</div>
            <div><strong>Service Type:</strong> {applicationData.general_information?.serviceType || 'N/A'}</div>
            <div><strong>Property Use:</strong> {applicationData.general_information?.propertyUse || 'N/A'}</div>
            <div><strong>Meters Needed:</strong> {applicationData.general_information?.metersNeeded || 'N/A'}</div>
          </div>
        </div>

        {/* Site Address */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Site Address</h3>
          <div>
            <div><strong>Street:</strong> {applicationData.site_address?.street || 'N/A'}</div>
            {applicationData.site_address?.street2 && <div><strong>Street 2:</strong> {applicationData.site_address.street2}</div>}
            {applicationData.site_address?.street3 && <div><strong>Street 3:</strong> {applicationData.site_address.street3}</div>}
            <div><strong>City:</strong> {applicationData.site_address?.city || 'N/A'}</div>
            <div><strong>Postcode:</strong> {applicationData.site_address?.postcode || 'N/A'}</div>
            <div><strong>State:</strong> {applicationData.site_address?.state || 'N/A'}</div>
            <div><strong>Country:</strong> {applicationData.site_address?.country || 'N/A'}</div>
          </div>
        </div>

        {/* Load Details */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Load Details</h3>
          {loadItems.length > 0 ? (
            <div>
              <table className="load-table" style={{ marginBottom: '1rem' }}>
                <thead>
                  <tr>
                    <th>Connection Type</th>
                    <th>Phases</th>
                    <th>Heating Type</th>
                    <th>Bedrooms</th>
                    <th>Quantity</th>
                    <th>Load per Installation (kVA)</th>
                    <th>Summed Load (kVA)</th>
                  </tr>
                </thead>
                <tbody>
                  {loadItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.connection_type}</td>
                      <td>{item.phases}</td>
                      <td>{item.heating_type}</td>
                      <td>{item.bedrooms}</td>
                      <td>{item.quantity}</td>
                      <td>{item.load_per_installation?.toLocaleString()}</td>
                      <td>{item.summed_load?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                <strong>Total Combined Load: {totalLoad.toLocaleString()} kVA</strong>
              </div>
            </div>
          ) : (
            <div>No load items added</div>
          )}
        </div>

        {/* Other Contact */}
        {applicationData.other_contact && (
          <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Other Contact Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><strong>Contact Name:</strong> {applicationData.other_contact?.contactName || 'N/A'}</div>
              <div><strong>Contact Email:</strong> {applicationData.other_contact?.contactEmail || 'N/A'}</div>
              <div><strong>Contact Phone:</strong> {applicationData.other_contact?.contactPhone || 'N/A'}</div>
              <div><strong>Contact Role:</strong> {applicationData.other_contact?.contactRole || 'N/A'}</div>
            </div>
            {applicationData.other_contact?.additionalContacts?.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <strong>Additional Contacts:</strong>
                <ul style={{ marginLeft: '1rem' }}>
                  {applicationData.other_contact.additionalContacts.map((contact, index) => (
                    <li key={index}>{contact.name} - {contact.email} ({contact.role})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

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
        {applicationData.project_details && (
          <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Project Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><strong>Project Name:</strong> {applicationData.project_details?.projectName || 'N/A'}</div>
              <div><strong>Project Type:</strong> {applicationData.project_details?.projectType || 'N/A'}</div>
              <div><strong>Estimated Duration:</strong> {applicationData.project_details?.estimatedDuration || 'N/A'} weeks</div>
              <div><strong>Budget:</strong> £{applicationData.project_details?.budget || 'N/A'}</div>
              <div><strong>Start Date:</strong> {applicationData.project_details?.startDate || 'N/A'}</div>
              <div><strong>End Date:</strong> {applicationData.project_details?.endDate || 'N/A'}</div>
            </div>
            {applicationData.project_details?.projectDescription && (
              <div style={{ marginTop: '1rem' }}>
                <strong>Project Description:</strong>
                <p style={{ marginTop: '0.5rem' }}>{applicationData.project_details.projectDescription}</p>
              </div>
            )}
          </div>
        )}

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

import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuoteDetailsCard = ({ quote, onProceedWithQuote, title = "Highest Validity Quote" }) => {
  const navigate = useNavigate();
  
  if (!quote) return null;

  const handleProceedWithQuote = (e) => {
    // Prevent any form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Step 1: First confirmation - threshold criteria confirmation
    const firstConfirmed = window.confirm(
      "⚠️ THRESHOLD CRITERIA DISCREPANCY CONFIRMATION\n\n" +
      "Before proceeding with this quote, please confirm that you accept any discrepancies " +
      "that may result from Threshold Criteria analysis.\n\n" +
      "This includes:\n" +
      "• Load capacity limitations\n" +
      "• Network capacity constraints\n" +
      "• Technical feasibility issues\n" +
      "• Cost variations due to site conditions\n\n" +
      "Do you wish to proceed with this quote?"
    );
    
    if (firstConfirmed) {
      // Step 2: Call onProceedWithQuote to register the quote selection
      onProceedWithQuote(quote);
      
      // Step 3: Second confirmation - proceed to summary page
      const secondConfirmed = window.confirm(
        "✅ Quote Successfully Selected!\n\n" +
        "Quote ID: " + quote.quoteId + "\n" +
        "Customer: " + quote.customerName + "\n" +
        "Amount: £" + quote.estimatedCost.toLocaleString() + "\n" +
        "Valid Until: " + quote.validUntil + "\n\n" +
        "Threshold criteria discrepancies have been accepted.\n" +
        "Do you want to proceed to the Summary page?"
      );
      
      // Step 4: Navigate to Summary page if second confirmation is OK
      if (secondConfirmed) {
        console.log('Navigating to summary page...');
        // Use window.location for more reliable navigation
        window.location.href = '/summary';
      }
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '2px solid #007bff',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '1rem',
      boxShadow: '0 4px 12px rgba(0,123,255,0.15)',
      width: '100%',
      maxWidth: '100%'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '2px solid #e9ecef'
      }}>
        <div>
          <h3 style={{ 
            margin: 0, 
            color: '#007bff', 
            fontSize: '1.25rem',
            fontWeight: 'bold'
          }}>
            🏆 {title}
          </h3>
          <p style={{ 
            margin: '0.25rem 0 0 0', 
            color: '#6c757d', 
            fontSize: '0.9rem' 
          }}>
            Quote ID: {quote.quoteId} | QID: {quote.qid}
          </p>
        </div>
        <div style={{
          background: '#28a745',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}>
          {quote.validityPeriod}
        </div>
      </div>

      {/* Quote Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {/* Site Address */}
        <div style={{
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '6px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ 
            margin: '0 0 0.5rem 0', 
            color: '#495057', 
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📍 Site Address
          </h4>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '0.9rem' }}>
            {quote.siteAddress}
          </p>
        </div>

        {/* Site Plan & Boundary */}
        <div style={{
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '6px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ 
            margin: '0 0 0.5rem 0', 
            color: '#495057', 
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🗺️ Site Plan & Boundary
          </h4>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '0.9rem' }}>
            {quote.sitePlan}
          </p>
        </div>

        {/* Load Demand */}
        <div style={{
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '6px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ 
            margin: '0 0 0.5rem 0', 
            color: '#495057', 
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ⚡ Load Demand
          </h4>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '0.9rem' }}>
            {quote.loadDemand}
          </p>
        </div>

        {/* Validity Period */}
        <div style={{
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '6px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ 
            margin: '0 0 0.5rem 0', 
            color: '#495057', 
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📅 Validity Period
          </h4>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '0.9rem' }}>
            {quote.validityPeriod}
          </p>
        </div>
      </div>

      {/* Additional Information */}
      <div style={{
        background: '#e3f2fd',
        padding: '1rem',
        borderRadius: '6px',
        marginBottom: '1.5rem',
        border: '1px solid #bbdefb'
      }}>
        <h4 style={{ 
          margin: '0 0 0.75rem 0', 
          color: '#1976d2', 
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          💰 Quote Summary
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
          gap: '1rem',
          fontSize: '0.9rem'
        }}>
          <div>
            <strong>Customer:</strong> {quote.customerName}
          </div>
          <div>
            <strong>Project Type:</strong> {quote.projectType}
          </div>
          <div>
            <strong>Connection:</strong> {quote.connectionType}
          </div>
          <div>
            <strong>Estimated Cost:</strong> £{quote.estimatedCost.toLocaleString()}
          </div>
          <div>
            <strong>Quote Date:</strong> {quote.quoteDate}
          </div>
          <div>
            <strong>Completion:</strong> {quote.terms.completionTime}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <button
          type="button"
          onClick={handleProceedWithQuote}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(40,167,69,0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#218838';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#28a745';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ✅ Continue With Quote
        </button>
      </div>
    </div>
  );
};

export default QuoteDetailsCard;

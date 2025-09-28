import React, { useState } from 'react';
import { cloneQuotation, formatCurrency } from '../services/quotationService';

const QuotationModal = ({ quotations, isOpen, onClose, onCloneQuote }) => {
  const [selectedQuote, setSelectedQuote] = useState(null);

  if (!isOpen) return null;

  const handleCloneQuote = (quote) => {
    const clonedQuote = cloneQuotation(quote);
    onCloneQuote(clonedQuote);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Available Quotations for TW3</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {selectedQuote ? (
            <div className="quote-detail">
              <div className="quote-header">
                <h3>{selectedQuote.customerName}</h3>
                <div className="quote-id">Quote ID: {selectedQuote.quoteId}</div>
                <div className="quote-cost">{formatCurrency(selectedQuote.estimatedCost)}</div>
              </div>
              
              <div className="quote-info">
                <div className="info-section">
                  <h4>Project Details</h4>
                  <p><strong>Type:</strong> {selectedQuote.projectType}</p>
                  <p><strong>Connection:</strong> {selectedQuote.connectionType}</p>
                  <p><strong>Load:</strong> {selectedQuote.loadRequirement}</p>
                  <p><strong>Description:</strong> {selectedQuote.description}</p>
                </div>
                
                <div className="info-section">
                  <h4>Cost Breakdown</h4>
                  {Object.entries(selectedQuote.breakdown).map(([key, value]) => (
                    <div key={key} className="breakdown-item">
                      <span className="breakdown-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                      <span className="breakdown-value">{formatCurrency(value)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="info-section">
                  <h4>Terms & Conditions</h4>
                  <p><strong>Payment:</strong> {selectedQuote.terms.paymentTerms}</p>
                  <p><strong>Warranty:</strong> {selectedQuote.terms.warranty}</p>
                  <p><strong>Completion:</strong> {selectedQuote.terms.completionTime}</p>
                  <p><strong>Valid Until:</strong> {selectedQuote.validUntil}</p>
                </div>
                
                <div className="info-section">
                  <h4>Contact Information</h4>
                  <p><strong>Engineer:</strong> {selectedQuote.contact.engineer}</p>
                  <p><strong>Email:</strong> {selectedQuote.contact.email}</p>
                  <p><strong>Phone:</strong> {selectedQuote.contact.phone}</p>
                </div>
              </div>
              
              <div className="quote-actions">
                <button className="btn btn-secondary" onClick={() => setSelectedQuote(null)}>
                  Back to List
                </button>
                <button className="btn btn-primary" onClick={() => handleCloneQuote(selectedQuote)}>
                  Clone This Quote
                </button>
              </div>
            </div>
          ) : (
            <div className="quotation-list">
              <p className="quotation-intro">
                Found {quotations.length} quotation(s) for TW3 postcode. Click on any quotation to view details.
              </p>
              
              {quotations.map((quote) => (
                <div key={quote.quoteId} className="quotation-card" onClick={() => setSelectedQuote(quote)}>
                  <div className="quote-card-header">
                    <h4>{quote.customerName}</h4>
                    <div className="quote-cost">{formatCurrency(quote.estimatedCost)}</div>
                  </div>
                  <div className="quote-card-details">
                    <p><strong>Type:</strong> {quote.projectType}</p>
                    <p><strong>Connection:</strong> {quote.connectionType}</p>
                    <p><strong>Load:</strong> {quote.loadRequirement}</p>
                    <p><strong>Valid Until:</strong> {quote.validUntil}</p>
                  </div>
                  <div className="quote-card-footer">
                    <span className="quote-id">ID: {quote.quoteId}</span>
                    <span className="quote-date">{quote.quoteDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotationModal;

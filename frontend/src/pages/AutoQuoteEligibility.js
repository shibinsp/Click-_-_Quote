import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

const AutoQuoteEligibility = ({ onNext }) => {
  const navigate = useNavigate();
  const { updateApplication } = useApplication();
  
  const [formData, setFormData] = useState({
    eligibleForAutoQuote: false,
    connectionCapacity: '',
    networkCapacity: '',
    technicalFeasibility: '',
    regulatoryCompliance: '',
    costEstimate: '',
    timelineEstimate: '',
    additionalRequirements: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateApplication('auto_quote_eligibility', formData);
      navigate('/upload-docs');
      onNext();
    } catch (error) {
      console.error('Error saving auto quote eligibility:', error);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Auto Quote Eligibility</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Eligible for Auto Quote?
            <span className="required">*</span>
          </label>
          <div className="radio-group">
            <div className="radio-item">
              <input
                type="radio"
                id="eligibleYes"
                name="eligibleForAutoQuote"
                value="true"
                checked={formData.eligibleForAutoQuote === true}
                onChange={(e) => handleInputChange('eligibleForAutoQuote', e.target.value === 'true')}
              />
              <label htmlFor="eligibleYes">Yes</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="eligibleNo"
                name="eligibleForAutoQuote"
                value="false"
                checked={formData.eligibleForAutoQuote === false}
                onChange={(e) => handleInputChange('eligibleForAutoQuote', e.target.value === 'true')}
              />
              <label htmlFor="eligibleNo">No</label>
            </div>
          </div>
        </div>

        {formData.eligibleForAutoQuote && (
          <>
            <div className="form-group">
              <label className="form-label">
                Connection Capacity Assessment
              </label>
              <select
                className="form-select"
                value={formData.connectionCapacity}
                onChange={(e) => handleInputChange('connectionCapacity', e.target.value)}
              >
                <option value="">-- Select Assessment --</option>
                <option value="Adequate">Adequate</option>
                <option value="Requires Upgrade">Requires Upgrade</option>
                <option value="Insufficient">Insufficient</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Network Capacity Assessment
              </label>
              <select
                className="form-select"
                value={formData.networkCapacity}
                onChange={(e) => handleInputChange('networkCapacity', e.target.value)}
              >
                <option value="">-- Select Assessment --</option>
                <option value="Available">Available</option>
                <option value="Limited">Limited</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Technical Feasibility
              </label>
              <select
                className="form-select"
                value={formData.technicalFeasibility}
                onChange={(e) => handleInputChange('technicalFeasibility', e.target.value)}
              >
                <option value="">-- Select Feasibility --</option>
                <option value="Feasible">Feasible</option>
                <option value="Feasible with Modifications">Feasible with Modifications</option>
                <option value="Not Feasible">Not Feasible</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Regulatory Compliance
              </label>
              <select
                className="form-select"
                value={formData.regulatoryCompliance}
                onChange={(e) => handleInputChange('regulatoryCompliance', e.target.value)}
              >
                <option value="">-- Select Compliance Status --</option>
                <option value="Compliant">Compliant</option>
                <option value="Requires Permits">Requires Permits</option>
                <option value="Non-Compliant">Non-Compliant</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">
                  Cost Estimate (£)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.costEstimate}
                  onChange={(e) => handleInputChange('costEstimate', e.target.value)}
                  placeholder="Enter estimated cost"
                  min="0"
                  step="1000"
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">
                  Timeline Estimate (weeks)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.timelineEstimate}
                  onChange={(e) => handleInputChange('timelineEstimate', e.target.value)}
                  placeholder="Enter estimated timeline"
                  min="1"
                />
              </div>
            </div>
          </>
        )}

        <div className="form-group">
          <label className="form-label">
            Additional Requirements
          </label>
          <textarea
            className="form-input"
            value={formData.additionalRequirements}
            onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
            placeholder="Any additional requirements or notes"
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/project-details')}>
            Previous
          </button>
          <button type="submit" className="btn btn-primary">
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default AutoQuoteEligibility;

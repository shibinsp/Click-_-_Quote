import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

const ApplicantDetails = ({ onNext }) => {
  const navigate = useNavigate();
  const { updateApplication, applicationData } = useApplication();
  
  const [formData, setFormData] = useState({
    authorisedRepresentative: false,
    principalContractor: false,
    principalDesigner: false,
    quoteMethod: 'Email',
    contactMethod: 'Email',
    referenceNumber: '',
    hasGridReference: 'No',
    applyingOnBehalf: 'No',
    hadQuoteBefore: 'No',
    connectionDate: ''
  });

  // Load existing data when component mounts
  useEffect(() => {
    if (applicationData.applicant_details) {
      setFormData(prev => ({
        ...prev,
        ...applicationData.applicant_details
      }));
    }
  }, [applicationData.applicant_details]);

  const handleToggle = (field) => {
    const updatedData = {
      ...formData,
      [field]: !formData[field]
    };
    setFormData(updatedData);
    updateApplication('applicant_details', updatedData);
  };

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    updateApplication('applicant_details', updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateApplication('applicant_details', formData);
      navigate('/general-information');
      onNext();
    } catch (error) {
      console.error('Error saving applicant details:', error);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Applicant Details</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Do you have an Authorised Representative?
          </label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={formData.authorisedRepresentative}
              onChange={() => handleToggle('authorisedRepresentative')}
            />
            <span className="toggle-slider"></span>
          </div>
          <span style={{ marginLeft: '1rem' }}>
            {formData.authorisedRepresentative ? 'Yes' : 'No'}
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">
            Principal Contractor Details
          </label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={formData.principalContractor}
              onChange={() => handleToggle('principalContractor')}
            />
            <span className="toggle-slider"></span>
          </div>
          <span style={{ marginLeft: '1rem' }}>
            {formData.principalContractor ? 'Yes' : 'No'}
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">
            Principal Designer Details
          </label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={formData.principalDesigner}
              onChange={() => handleToggle('principalDesigner')}
            />
            <span className="toggle-slider"></span>
          </div>
          <span style={{ marginLeft: '1rem' }}>
            {formData.principalDesigner ? 'Yes' : 'No'}
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">
            How would you like to receive your quote?
          </label>
          <select
            className="form-select"
            value={formData.quoteMethod}
            onChange={(e) => handleInputChange('quoteMethod', e.target.value)}
          >
            <option value="Email">Email</option>
            <option value="Post">Post</option>
            <option value="Phone">Phone</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            How would you like us to contact you regarding job updates, information and appointments?
          </label>
          <div className="radio-group">
            <div className="radio-item">
              <input
                type="radio"
                id="email"
                name="contactMethod"
                value="Email"
                checked={formData.contactMethod === 'Email'}
                onChange={(e) => handleInputChange('contactMethod', e.target.value)}
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="text"
                name="contactMethod"
                value="Text message"
                checked={formData.contactMethod === 'Text message'}
                onChange={(e) => handleInputChange('contactMethod', e.target.value)}
              />
              <label htmlFor="text">Text message</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="telephone"
                name="contactMethod"
                value="Telephone"
                checked={formData.contactMethod === 'Telephone'}
                onChange={(e) => handleInputChange('contactMethod', e.target.value)}
              />
              <label htmlFor="telephone">Telephone</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="post"
                name="contactMethod"
                value="Post"
                checked={formData.contactMethod === 'Post'}
                onChange={(e) => handleInputChange('contactMethod', e.target.value)}
              />
              <label htmlFor="post">Post</label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            If you have your own reference number to track jobs please enter here
            <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={formData.referenceNumber}
            onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
            placeholder="Enter reference number"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Do you have a grid reference or a What3Words to help us locate your site?
          </label>
          <div className="radio-group">
            <div className="radio-item">
              <input
                type="radio"
                id="gridYes"
                name="hasGridReference"
                value="Yes"
                checked={formData.hasGridReference === 'Yes'}
                onChange={(e) => handleInputChange('hasGridReference', e.target.value)}
              />
              <label htmlFor="gridYes">Yes</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="gridNo"
                name="hasGridReference"
                value="No"
                checked={formData.hasGridReference === 'No'}
                onChange={(e) => handleInputChange('hasGridReference', e.target.value)}
              />
              <label htmlFor="gridNo">No</label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Are you applying on behalf of someone else?
          </label>
          <div className="radio-group">
            <div className="radio-item">
              <input
                type="radio"
                id="behalfYes"
                name="applyingOnBehalf"
                value="Yes"
                checked={formData.applyingOnBehalf === 'Yes'}
                onChange={(e) => handleInputChange('applyingOnBehalf', e.target.value)}
              />
              <label htmlFor="behalfYes">Yes</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="behalfNo"
                name="applyingOnBehalf"
                value="No"
                checked={formData.applyingOnBehalf === 'No'}
                onChange={(e) => handleInputChange('applyingOnBehalf', e.target.value)}
              />
              <label htmlFor="behalfNo">No</label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Have you had a quote from us at this address before?
          </label>
          <div className="radio-group">
            <div className="radio-item">
              <input
                type="radio"
                id="quoteYes"
                name="hadQuoteBefore"
                value="Yes"
                checked={formData.hadQuoteBefore === 'Yes'}
                onChange={(e) => handleInputChange('hadQuoteBefore', e.target.value)}
              />
              <label htmlFor="quoteYes">Yes</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="quoteNo"
                name="hadQuoteBefore"
                value="No"
                checked={formData.hadQuoteBefore === 'No'}
                onChange={(e) => handleInputChange('hadQuoteBefore', e.target.value)}
              />
              <label htmlFor="quoteNo">No</label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            When would you like your power connected?
          </label>
          <input
            type="date"
            className="form-input"
            value={formData.connectionDate}
            onChange={(e) => handleInputChange('connectionDate', e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" disabled>
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

export default ApplicantDetails;

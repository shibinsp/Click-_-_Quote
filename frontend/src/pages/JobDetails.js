import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

const JobDetails = ({ onNext }) => {
  const navigate = useNavigate();
  const { updateApplication, applicationData } = useApplication();
  
  const [formData, setFormData] = useState({
    hasGridReference: 'No',
    applyingOnBehalf: 'No',
    connectionDate: '2025-11-21'
  });

  // Load existing data when component mounts
  useEffect(() => {
    if (applicationData.job_details) {
      setFormData(prev => ({
        ...prev,
        ...applicationData.job_details
      }));
    }
  }, [applicationData.job_details]);

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    updateApplication('job_details', updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateApplication('job_details', formData);
      navigate('/site-address');
      onNext();
    } catch (error) {
      console.error('Error saving job details:', error);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Job Details</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Job Details Section */}
        <div className="form-section">
          <h2 className="section-title">Job Details</h2>
          
          <div className="form-group">
            <label className="form-label">
              Do you have a grid reference?
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
              When would you like your power connected?
            </label>
            <input
              type="date"
              className="form-input"
              value={formData.connectionDate}
              onChange={(e) => handleInputChange('connectionDate', e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/general-information')}>
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

export default JobDetails;

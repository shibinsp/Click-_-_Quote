import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

const ProjectDetails = ({ onNext }) => {
  const navigate = useNavigate();
  const { updateApplication, applicationData } = useApplication();
  
  const [formData, setFormData] = useState({
    connectionType: 'Flexible',
    securityOfSupply: 'Single Circuit',
    motorsOrDisturbingLoads: 'No',
    lowCarbonTechnologies: 'No'
  });

  // Load existing data when component mounts
  useEffect(() => {
    if (applicationData.project_details) {
      setFormData(prev => ({
        ...prev,
        ...applicationData.project_details
      }));
    }
  }, [applicationData.project_details]);

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    updateApplication('project_details', updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateApplication('project_details', formData);
      navigate('/auto-quote-eligibility');
      onNext();
    } catch (error) {
      console.error('Error saving project details:', error);
    }
  };


  return (
    <div className="form-container">
      <h1 className="form-title">Project Details</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Project Details Section */}
        <div className="form-section">
          <h2 className="section-title">Project Details</h2>
          
          <div className="form-group">
            <label className="form-label">
              What type of connection would you like?
            </label>
            <select
              className="form-select"
              value={formData.connectionType}
              onChange={(e) => handleInputChange('connectionType', e.target.value)}
            >
              <option value="Flexible">Flexible</option>
              <option value="Fixed">Fixed</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              What level of security of supply would you like?
            </label>
            <select
              className="form-select"
              value={formData.securityOfSupply}
              onChange={(e) => handleInputChange('securityOfSupply', e.target.value)}
            >
              <option value="Single Circuit">Single Circuit</option>
              <option value="Dual Circuit">Dual Circuit</option>
              <option value="Multiple Circuit">Multiple Circuit</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Are there any motors or disturbing loads?
            </label>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  id="motorsYes"
                  name="motorsOrDisturbingLoads"
                  value="Yes"
                  checked={formData.motorsOrDisturbingLoads === 'Yes'}
                  onChange={(e) => handleInputChange('motorsOrDisturbingLoads', e.target.value)}
                />
                <label htmlFor="motorsYes">Yes</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="motorsNo"
                  name="motorsOrDisturbingLoads"
                  value="No"
                  checked={formData.motorsOrDisturbingLoads === 'No'}
                  onChange={(e) => handleInputChange('motorsOrDisturbingLoads', e.target.value)}
                />
                <label htmlFor="motorsNo">No</label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Are you planning to install low carbon technologies?
            </label>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  id="carbonYes"
                  name="lowCarbonTechnologies"
                  value="Yes"
                  checked={formData.lowCarbonTechnologies === 'Yes'}
                  onChange={(e) => handleInputChange('lowCarbonTechnologies', e.target.value)}
                />
                <label htmlFor="carbonYes">Yes</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="carbonNo"
                  name="lowCarbonTechnologies"
                  value="No"
                  checked={formData.lowCarbonTechnologies === 'No'}
                  onChange={(e) => handleInputChange('lowCarbonTechnologies', e.target.value)}
                />
                <label htmlFor="carbonNo">No</label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/other-contact')}>
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

export default ProjectDetails;

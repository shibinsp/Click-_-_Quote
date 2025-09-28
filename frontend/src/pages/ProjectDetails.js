import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

const ProjectDetails = ({ onNext }) => {
  const navigate = useNavigate();
  const { updateApplication } = useApplication();
  
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    projectType: '',
    estimatedDuration: '',
    startDate: '',
    endDate: '',
    budget: '',
    specialRequirements: '',
    environmentalConsiderations: '',
    accessRequirements: ''
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
        <div className="form-group">
          <label className="form-label">
            Project Name
            <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={formData.projectName}
            onChange={(e) => handleInputChange('projectName', e.target.value)}
            placeholder="Enter project name"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Project Description
            <span className="required">*</span>
          </label>
          <textarea
            className="form-input"
            value={formData.projectDescription}
            onChange={(e) => handleInputChange('projectDescription', e.target.value)}
            placeholder="Describe your project in detail"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Project Type
            <span className="required">*</span>
          </label>
          <select
            className="form-select"
            value={formData.projectType}
            onChange={(e) => handleInputChange('projectType', e.target.value)}
            required
          >
            <option value="">-- Select Project Type --</option>
            <option value="Residential Development">Residential Development</option>
            <option value="Commercial Development">Commercial Development</option>
            <option value="Industrial Development">Industrial Development</option>
            <option value="Infrastructure Project">Infrastructure Project</option>
            <option value="Renewable Energy">Renewable Energy</option>
            <option value="Retrofit/Upgrade">Retrofit/Upgrade</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">
              Estimated Duration (weeks)
            </label>
            <input
              type="number"
              className="form-input"
              value={formData.estimatedDuration}
              onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
              placeholder="Enter duration in weeks"
              min="1"
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">
              Budget (£)
            </label>
            <input
              type="number"
              className="form-input"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              placeholder="Enter budget"
              min="0"
              step="1000"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">
              Project Start Date
            </label>
            <input
              type="date"
              className="form-input"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">
              Project End Date
            </label>
            <input
              type="date"
              className="form-input"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Special Requirements
          </label>
          <textarea
            className="form-input"
            value={formData.specialRequirements}
            onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
            placeholder="Any special requirements or constraints"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Environmental Considerations
          </label>
          <textarea
            className="form-input"
            value={formData.environmentalConsiderations}
            onChange={(e) => handleInputChange('environmentalConsiderations', e.target.value)}
            placeholder="Environmental considerations or requirements"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Access Requirements
          </label>
          <textarea
            className="form-input"
            value={formData.accessRequirements}
            onChange={(e) => handleInputChange('accessRequirements', e.target.value)}
            placeholder="Site access requirements and restrictions"
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/click-quote')}>
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

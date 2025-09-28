import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

const SiteAddress = ({ onNext }) => {
  const navigate = useNavigate();
  const { updateApplication, applicationData } = useApplication();
  
  const [formData, setFormData] = useState({
    street: '102 Field Road',
    street2: '',
    street3: '',
    city: 'Feltham',
    postcode: 'TW14 0BJ',
    state: '',
    country: 'United Kingdom'
  });

  // Load existing data when component mounts
  useEffect(() => {
    if (applicationData.site_address) {
      setFormData(prev => ({
        ...prev,
        ...applicationData.site_address
      }));
    }
  }, [applicationData.site_address]);

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    updateApplication('site_address', updatedData);
  };

  const handleClear = () => {
    setFormData({
      street: '102 Field Road',
      street2: '',
      street3: '',
      city: 'Feltham',
      postcode: 'TW14 0BJ',
      state: '',
      country: 'United Kingdom'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateApplication('site_address', formData);
      navigate('/load-details');
      onNext();
    } catch (error) {
      console.error('Error saving site address:', error);
    }
  };


  return (
    <div className="form-container">
      <h1 className="form-title">Site Address</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Site Address Section */}
        <div className="form-section">
          <h2 className="section-title">Site Address</h2>
          
          <div className="form-group">
            <label className="form-label">Street</label>
            <input
              type="text"
              className="form-input"
              value={formData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              placeholder="Enter street address"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Street 2</label>
            <input
              type="text"
              className="form-input"
              value={formData.street2}
              onChange={(e) => handleInputChange('street2', e.target.value)}
              placeholder="Enter additional street information"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Street 3</label>
            <input
              type="text"
              className="form-input"
              value={formData.street3}
              onChange={(e) => handleInputChange('street3', e.target.value)}
              placeholder="Enter additional street information"
            />
          </div>

          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-input"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Enter city"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Postcode</label>
            <input
              type="text"
              className="form-input"
              value={formData.postcode}
              onChange={(e) => handleInputChange('postcode', e.target.value)}
              placeholder="Enter postcode"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Country</label>
            <select
              className="form-select"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
            >
              <option value="United Kingdom">United Kingdom</option>
              <option value="Ireland">Ireland</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/job-details')}>
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

export default SiteAddress;

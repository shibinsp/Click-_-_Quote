import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

const ApplicantDetails = ({ onNext }) => {
  const navigate = useNavigate();
  const { updateApplication, applicationData } = useApplication();
  
  const [formData, setFormData] = useState({
    // Company/Individual Information
    applicationType: 'Company',
    companyName: 'Smart Connections',
    title: 'Mr.',
    firstName: 'Andrew',
    lastName: 'Hamilton',
    email: 'Andrew.h@smartconnections.co.uk',
    mobile: '07555544444',
    
    // Address Information
    street: '12',
    street2: 'Ormsby',
    street3: 'Stanley Road',
    city: 'Sutton',
    postcode: 'SM2 6TJ',
    state: 'Surrey',
    country: 'United Kingdom',
    
    // Address Options
    siteSameAsCorrespondence: false,
    invoiceSameAsCorrespondence: true
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
        {/* Company/Individual Information Section */}
        <div className="form-section">
          <h2 className="section-title">Applicant's Details</h2>
          
          <div className="form-group">
            <label className="form-label">
              Are you applying on behalf of a company OR as an individual?
            </label>
            <select
              className="form-select"
              value={formData.applicationType}
              onChange={(e) => handleInputChange('applicationType', e.target.value)}
            >
              <option value="Company">Company</option>
              <option value="Individual">Individual</option>
            </select>
          </div>

          {formData.applicationType === 'Company' && (
            <>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Title</label>
            <select
              className="form-select"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            >
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Ms.">Ms.</option>
              <option value="Dr.">Dr.</option>
              <option value="Prof.">Prof.</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter first name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Enter last name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile</label>
            <input
              type="tel"
              className="form-input"
              value={formData.mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
              placeholder="Enter mobile number"
            />
          </div>
        </div>

        {/* Address Information Section */}
        <div className="form-section">
          <h2 className="section-title">Correspondence Address</h2>
          
          <div className="form-group">
            <label className="form-label">Street</label>
            <input
              type="text"
              className="form-input"
              value={formData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              placeholder="Enter street number/name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Street 2</label>
            <input
              type="text"
              className="form-input"
              value={formData.street2}
              onChange={(e) => handleInputChange('street2', e.target.value)}
              placeholder="Enter street 2"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Street 3</label>
            <input
              type="text"
              className="form-input"
              value={formData.street3}
              onChange={(e) => handleInputChange('street3', e.target.value)}
              placeholder="Enter street 3"
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
            <label className="form-label">State</label>
            <input
              type="text"
              className="form-input"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="Enter state"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Country</label>
            <input
              type="text"
              className="form-input"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="Enter country"
            />
          </div>
        </div>

        {/* Address Options Section */}
        <div className="form-section">
          <h2 className="section-title">Address Options</h2>
          
          <div className="form-group">
            <label className="form-label">
              Is the site address the same as the correspondence address above?
            </label>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={formData.siteSameAsCorrespondence}
                onChange={() => handleToggle('siteSameAsCorrespondence')}
              />
              <span className="toggle-slider"></span>
            </div>
            <span style={{ marginLeft: '1rem' }}>
              {formData.siteSameAsCorrespondence ? 'Yes' : 'No'}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">
              Is the invoice address the same as the correspondence address above?
            </label>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={formData.invoiceSameAsCorrespondence}
                onChange={() => handleToggle('invoiceSameAsCorrespondence')}
              />
              <span className="toggle-slider"></span>
            </div>
            <span style={{ marginLeft: '1rem' }}>
              {formData.invoiceSameAsCorrespondence ? 'Yes' : 'No'}
            </span>
          </div>
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

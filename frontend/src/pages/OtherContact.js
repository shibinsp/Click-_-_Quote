import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

const OtherContact = ({ onNext }) => {
  const navigate = useNavigate();
  const { updateApplication, applicationData } = useApplication();
  
  const [formData, setFormData] = useState({
    authorisedRepresentative: 'No',
    principalContractorDetails: 'No',
    principalDesignerDetails: 'No'
  });

  // Load existing data when component mounts
  useEffect(() => {
    if (applicationData.other_contact) {
      setFormData(prev => ({
        ...prev,
        ...applicationData.other_contact
      }));
    }
  }, [applicationData.other_contact]);

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    
    // Auto-save data
    updateApplication('other_contact', updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateApplication('other_contact', formData);
      navigate('/project-details');
      onNext();
    } catch (error) {
      console.error('Error saving other contact details:', error);
    }
  };


  return (
    <div className="form-container">
      <h1 className="form-title">Other Contacts</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Other Contacts Section */}
        <div className="form-section">
          <h2 className="section-title">Other Contacts</h2>
          
          <div className="form-group">
            <label className="form-label">
              Do you have an Authorised Representative?
            </label>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  id="authRepYes"
                  name="authorisedRepresentative"
                  value="Yes"
                  checked={formData.authorisedRepresentative === 'Yes'}
                  onChange={(e) => handleInputChange('authorisedRepresentative', e.target.value)}
                />
                <label htmlFor="authRepYes">Yes</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="authRepNo"
                  name="authorisedRepresentative"
                  value="No"
                  checked={formData.authorisedRepresentative === 'No'}
                  onChange={(e) => handleInputChange('authorisedRepresentative', e.target.value)}
                />
                <label htmlFor="authRepNo">No</label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Principal Contractor Details
            </label>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  id="contractorYes"
                  name="principalContractorDetails"
                  value="Yes"
                  checked={formData.principalContractorDetails === 'Yes'}
                  onChange={(e) => handleInputChange('principalContractorDetails', e.target.value)}
                />
                <label htmlFor="contractorYes">Yes</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="contractorNo"
                  name="principalContractorDetails"
                  value="No"
                  checked={formData.principalContractorDetails === 'No'}
                  onChange={(e) => handleInputChange('principalContractorDetails', e.target.value)}
                />
                <label htmlFor="contractorNo">No</label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Principal Designer Details
            </label>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  id="designerYes"
                  name="principalDesignerDetails"
                  value="Yes"
                  checked={formData.principalDesignerDetails === 'Yes'}
                  onChange={(e) => handleInputChange('principalDesignerDetails', e.target.value)}
                />
                <label htmlFor="designerYes">Yes</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="designerNo"
                  name="principalDesignerDetails"
                  value="No"
                  checked={formData.principalDesignerDetails === 'No'}
                  onChange={(e) => handleInputChange('principalDesignerDetails', e.target.value)}
                />
                <label htmlFor="designerNo">No</label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/load-details')}>
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

export default OtherContact;

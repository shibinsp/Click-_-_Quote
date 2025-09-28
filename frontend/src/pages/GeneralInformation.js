import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

const GeneralInformation = ({ onNext }) => {
  const navigate = useNavigate();
  const { updateApplication, applicationData } = useApplication();
  
  const [formData, setFormData] = useState({
    highwaysServices: 'No',
    quoteType: 'Formal Quote',
    serviceType: 'New Connection - Demand or Generation',
    propertyUse: 'Domestic',
    metersNeeded: ''
  });

  // Load existing data when component mounts
  useEffect(() => {
    if (applicationData.general_information) {
      setFormData(prev => ({
        ...prev,
        ...applicationData.general_information
      }));
    }
  }, [applicationData.general_information]);

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    updateApplication('general_information', updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateApplication('general_information', formData);
      navigate('/site-address');
      onNext();
    } catch (error) {
      console.error('Error saving general information:', error);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">General Information</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Are you a customer of our Highways Services team, installing street furniture in the Highway such as kiosks or lightposts?
            <span className="required">*</span>
          </label>
          <select
            className="form-select"
            value={formData.highwaysServices}
            onChange={(e) => handleInputChange('highwaysServices', e.target.value)}
            required
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Which of the following do you require?
            <span className="required">*</span>
          </label>
          <select
            className="form-select"
            value={formData.quoteType}
            onChange={(e) => handleInputChange('quoteType', e.target.value)}
            required
          >
            <option value="Formal Quote">Formal Quote</option>
            <option value="Budget Quote">Budget Quote</option>
            <option value="Feasibility Study">Feasibility Study</option>
          </select>
          
          {formData.quoteType === 'Formal Quote' && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <p><strong>Formal Quote:</strong> A connection offer from UK Power Networks.</p>
              <p>This includes:</p>
              <ul style={{ marginLeft: '1rem' }}>
                <li><strong>Option A:</strong> UK Power Networks carries out all contestable and non-contestable works</li>
                <li><strong>Option B:</strong> UK Power Networks carries out non-contestable works only, ICP carries out contestable works</li>
                <li><strong>Option C:</strong> ICP carries out all contestable works, UK Power Networks carries out non-contestable works</li>
              </ul>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            What service are you looking for?
            <span className="required">*</span>
          </label>
          <div className="radio-group">
            <div className="radio-item">
              <input
                type="radio"
                id="newConnection"
                name="serviceType"
                value="New Connection - Demand or Generation"
                checked={formData.serviceType === 'New Connection - Demand or Generation'}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
              />
              <label htmlFor="newConnection">New Connection - Demand or Generation</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="disconnection"
                name="serviceType"
                value="Disconnection"
                checked={formData.serviceType === 'Disconnection'}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
              />
              <label htmlFor="disconnection">Disconnection</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="temporaryConnection"
                name="serviceType"
                value="Temporary Connection"
                checked={formData.serviceType === 'Temporary Connection'}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
              />
              <label htmlFor="temporaryConnection">Temporary Connection</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="upgradeDowngrade"
                name="serviceType"
                value="Upgrade or Downgrade a Connection"
                checked={formData.serviceType === 'Upgrade or Downgrade a Connection'}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
              />
              <label htmlFor="upgradeDowngrade">Upgrade or Downgrade a Connection</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="diversionWorks"
                name="serviceType"
                value="Diversion Works"
                checked={formData.serviceType === 'Diversion Works'}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
              />
              <label htmlFor="diversionWorks">Diversion Works</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="serviceAlteration"
                name="serviceType"
                value="Service Alteration"
                checked={formData.serviceType === 'Service Alteration'}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
              />
              <label htmlFor="serviceAlteration">Service Alteration</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                id="natureOfSupply"
                name="serviceType"
                value="Nature of Supply"
                checked={formData.serviceType === 'Nature of Supply'}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
              />
              <label htmlFor="natureOfSupply">Nature of Supply</label>
            </div>
          </div>
          
          {formData.serviceType === 'New Connection - Demand or Generation' && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <p><strong>New Connection:</strong> New permanent connection of an incoming supply or installations of large generation systems, e.g. solar photovoltaic, battery storage.</p>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            What is the main use of the property? If Generation is included in your scheme, please select Commercial or Mixed below
            <span className="required">*</span>
          </label>
          <select
            className="form-select"
            value={formData.propertyUse}
            onChange={(e) => handleInputChange('propertyUse', e.target.value)}
            required
          >
            <option value="Domestic">Domestic</option>
            <option value="Commercial">Commercial</option>
            <option value="Mixed">Mixed</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            How many meters do you need at the property?
            <span className="required">*</span>
          </label>
          <input
            type="number"
            className="form-input"
            value={formData.metersNeeded}
            onChange={(e) => handleInputChange('metersNeeded', e.target.value)}
            placeholder="Enter number of meters"
            min="1"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
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

export default GeneralInformation;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

const OtherContact = ({ onNext }) => {
  const navigate = useNavigate();
  const { updateApplication, applicationData } = useApplication();
  
  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    contactRole: '',
    additionalContacts: []
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

  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    role: ''
  });

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    
    // Auto-save data
    updateApplication('other_contact', updatedData);
  };

  const handleNewContactChange = (field, value) => {
    setNewContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.email) {
      const updatedData = {
        ...formData,
        additionalContacts: [...formData.additionalContacts, { ...newContact, id: Date.now() }]
      };
      setFormData(updatedData);
      updateApplication('other_contact', updatedData);
      setNewContact({ name: '', email: '', phone: '', role: '' });
    }
  };

  const handleRemoveContact = (id) => {
    const updatedData = {
      ...formData,
      additionalContacts: formData.additionalContacts.filter(contact => contact.id !== id)
    };
    setFormData(updatedData);
    updateApplication('other_contact', updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateApplication('other_contact', formData);
      navigate('/click-quote');
      onNext();
    } catch (error) {
      console.error('Error saving other contact details:', error);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Other Contact Details</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Primary Contact Name
          </label>
          <input
            type="text"
            className="form-input"
            value={formData.contactName}
            onChange={(e) => handleInputChange('contactName', e.target.value)}
            placeholder="Enter contact name"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Contact Email
          </label>
          <input
            type="email"
            className="form-input"
            value={formData.contactEmail}
            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
            placeholder="Enter email address"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Contact Phone
          </label>
          <input
            type="tel"
            className="form-input"
            value={formData.contactPhone}
            onChange={(e) => handleInputChange('contactPhone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Contact Address
          </label>
          <textarea
            className="form-input"
            value={formData.contactAddress}
            onChange={(e) => handleInputChange('contactAddress', e.target.value)}
            placeholder="Enter contact address"
            style={{ minHeight: '80px', resize: 'vertical' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Contact Role/Position
          </label>
          <input
            type="text"
            className="form-input"
            value={formData.contactRole}
            onChange={(e) => handleInputChange('contactRole', e.target.value)}
            placeholder="Enter contact role"
          />
        </div>

        <div className="form-group">
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Additional Contacts</h3>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-input"
              value={newContact.name}
              onChange={(e) => handleNewContactChange('name', e.target.value)}
              placeholder="Contact Name"
              style={{ flex: 1, minWidth: '200px' }}
            />
            <input
              type="email"
              className="form-input"
              value={newContact.email}
              onChange={(e) => handleNewContactChange('email', e.target.value)}
              placeholder="Email"
              style={{ flex: 1, minWidth: '200px' }}
            />
            <input
              type="tel"
              className="form-input"
              value={newContact.phone}
              onChange={(e) => handleNewContactChange('phone', e.target.value)}
              placeholder="Phone"
              style={{ flex: 1, minWidth: '150px' }}
            />
            <input
              type="text"
              className="form-input"
              value={newContact.role}
              onChange={(e) => handleNewContactChange('role', e.target.value)}
              placeholder="Role"
              style={{ flex: 1, minWidth: '150px' }}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddContact}
              style={{ minWidth: '100px' }}
            >
              Add Contact
            </button>
          </div>

          {formData.additionalContacts.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#666' }}>Added Contacts:</h4>
              {formData.additionalContacts.map((contact) => (
                <div
                  key={contact.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    marginBottom: '0.5rem'
                  }}
                >
                  <div>
                    <strong>{contact.name}</strong> - {contact.email}
                    {contact.phone && ` - ${contact.phone}`}
                    {contact.role && ` (${contact.role})`}
                  </div>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleRemoveContact(contact.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
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

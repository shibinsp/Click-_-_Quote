import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

const UploadDocs = ({ onNext }) => {
  const navigate = useNavigate();
  const { updateApplication } = useApplication();
  
  const [formData, setFormData] = useState({
    uploadedDocuments: [],
    requiredDocuments: [
      { name: 'Site Plan', required: true, uploaded: false },
      { name: 'Electrical Drawings', required: true, uploaded: false },
      { name: 'Planning Permission', required: false, uploaded: false },
      { name: 'Building Regulations Approval', required: false, uploaded: false },
      { name: 'Environmental Impact Assessment', required: false, uploaded: false },
      { name: 'Structural Calculations', required: false, uploaded: false }
    ]
  });

  const handleFileUpload = (documentName, file) => {
    const updatedDocuments = formData.requiredDocuments.map(doc => 
      doc.name === documentName ? { ...doc, uploaded: true, file } : doc
    );

    setFormData(prev => ({
      ...prev,
      requiredDocuments: updatedDocuments,
      uploadedDocuments: [...prev.uploadedDocuments, { name: documentName, file }]
    }));
  };

  const handleRemoveDocument = (documentName) => {
    const updatedDocuments = formData.requiredDocuments.map(doc => 
      doc.name === documentName ? { ...doc, uploaded: false, file: null } : doc
    );

    setFormData(prev => ({
      ...prev,
      requiredDocuments: updatedDocuments,
      uploadedDocuments: prev.uploadedDocuments.filter(doc => doc.name !== documentName)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateApplication('upload_docs', formData);
      navigate('/click-quote');
      onNext();
    } catch (error) {
      console.error('Error saving uploaded documents:', error);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Upload Documents</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Required Documents</h3>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Please upload the following documents. Required documents are marked with a red asterisk (*).
          </p>

          {formData.requiredDocuments.map((doc, index) => (
            <div key={index} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  {doc.name}
                  {doc.required && <span className="required">*</span>}
                </label>
                {doc.uploaded && (
                  <span style={{ color: '#28a745', fontSize: '0.9rem' }}>✓ Uploaded</span>
                )}
              </div>
              
              {!doc.uploaded ? (
                <input
                  type="file"
                  className="form-input"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleFileUpload(doc.name, e.target.files[0]);
                    }
                  }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#28a745' }}>{doc.file?.name}</span>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleRemoveDocument(doc.name)}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="form-group">
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Additional Documents</h3>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Upload any additional supporting documents that may be relevant to your application.
          </p>
          
          <input
            type="file"
            className="form-input"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            style={{ marginBottom: '1rem' }}
          />
        </div>

        <div className="form-group">
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Document Guidelines</h3>
          <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
            <ul style={{ marginLeft: '1rem', color: '#666' }}>
              <li>Maximum file size: 10MB per document</li>
              <li>Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG</li>
              <li>Ensure all documents are clearly legible</li>
              <li>Include all relevant drawings and specifications</li>
              <li>If documents are password protected, please provide the password</li>
            </ul>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/auto-quote-eligibility')}>
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

export default UploadDocs;

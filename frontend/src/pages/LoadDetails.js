import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';

const LoadDetails = ({ onNext }) => {
  const navigate = useNavigate();
  const { loadItems, addLoadItem, removeLoadItem, updateApplication, applicationData } = useApplication();
  
  const [newItem, setNewItem] = useState({
    connection_type: 'House',
    phases: 'Three',
    heating_type: 'Electric',
    bedrooms: '2',
    quantity: 1,
    load_per_installation: 0,
    summed_load: 0
  });

  const [totalLoad, setTotalLoad] = useState(0);

  useEffect(() => {
    const total = loadItems.reduce((sum, item) => sum + (item.summed_load || 0), 0);
    setTotalLoad(total);
  }, [loadItems]);

  const handleInputChange = (field, value) => {
    setNewItem(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calculate summed load
      if (field === 'quantity' || field === 'load_per_installation') {
        const quantity = field === 'quantity' ? parseFloat(value) : updated.quantity;
        const load = field === 'load_per_installation' ? parseFloat(value) : updated.load_per_installation;
        updated.summed_load = quantity * load;
      }
      
      return updated;
    });
  };

  const handleAddItem = async () => {
    try {
      await addLoadItem(newItem);
      setNewItem({
        connection_type: 'House',
        phases: 'Three',
        heating_type: 'Electric',
        bedrooms: '2',
        quantity: 1,
        load_per_installation: 0,
        summed_load: 0
      });
    } catch (error) {
      console.error('Error adding load item:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeLoadItem(itemId);
    } catch (error) {
      console.error('Error removing load item:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateApplication('load_details', { loadItems, totalLoad });
      navigate('/other-contact');
      onNext();
    } catch (error) {
      console.error('Error saving load details:', error);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">
        🏠 Domestic Load Table
      </h1>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <p>Please fill out the table below with your load requirements in KVA</p>
        <p>If you have selected a "mixed" site, you will be able to provide us with your Commercial loads on the next screen.</p>
        <p>If you are uncertain about your electrical loads, please consult an electrician for advice. Alternatively, please <button type="button" style={{ color: '#007bff', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>click here</button> for basic guidance.</p>
        <p><strong>A single phase connection can supply up to 23kVA.</strong></p>
        <p><strong>A three phase connection can supply more than 23KVA.</strong></p>
      </div>

      <form onSubmit={handleSubmit}>
        <table className="load-table">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Action</th>
              <th>What are you connecting?</th>
              <th>How many phases is the connection</th>
              <th>If a property, how will it be heated?</th>
              <th>No. of Bedrooms</th>
              <th>How many are you connecting?</th>
              <th>Load per installation type (kVA)*</th>
              <th>Summed load per installation type (kVA)*</th>
            </tr>
          </thead>
          <tbody>
            {loadItems.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}.</td>
                <td>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    🗑️
                  </button>
                </td>
                <td>{item.connection_type}</td>
                <td>{item.phases}</td>
                <td>{item.heating_type}</td>
                <td>{item.bedrooms}</td>
                <td>{item.quantity}</td>
                <td>{item.load_per_installation?.toLocaleString()}</td>
                <td>{item.summed_load?.toLocaleString()}</td>
              </tr>
            ))}
            <tr>
              <td>{loadItems.length + 1}.</td>
              <td></td>
              <td>
                <select
                  value={newItem.connection_type}
                  onChange={(e) => handleInputChange('connection_type', e.target.value)}
                >
                  <option value="Landlords Supply">Landlords Supply</option>
                  <option value="House">House</option>
                  <option value="Flat">Flat</option>
                  <option value="BNO">BNO</option>
                  <option value="Pumping Station">Pumping Station</option>
                  <option value="Streetlights">Streetlights</option>
                  <option value="Other">Other</option>
                </select>
              </td>
              <td>
                <select
                  value={newItem.phases}
                  onChange={(e) => handleInputChange('phases', e.target.value)}
                >
                  <option value="Single">Single</option>
                  <option value="Three">Three</option>
                </select>
              </td>
              <td>
                <select
                  value={newItem.heating_type}
                  onChange={(e) => handleInputChange('heating_type', e.target.value)}
                >
                  <option value="Electric">Electric</option>
                  <option value="Gas">Gas</option>
                  <option value="Oil">Oil</option>
                  <option value="Other">Other</option>
                </select>
              </td>
              <td>
                <select
                  value={newItem.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => handleInputChange('quantity', parseFloat(e.target.value) || 0)}
                  min="1"
                  style={{ width: '80px' }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={newItem.load_per_installation}
                  onChange={(e) => handleInputChange('load_per_installation', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  style={{ width: '120px' }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={newItem.summed_load}
                  readOnly
                  style={{ width: '120px', backgroundColor: '#f8f9fa' }}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <button
          type="button"
          className="add-line-btn"
          onClick={handleAddItem}
        >
          + Add New Line
        </button>

        <div className="total-load">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
            <span>Total Combined Load {totalLoad.toLocaleString()} KVA</span>
            <input
              type="number"
              value={100}
              style={{ width: '80px', padding: '0.25rem' }}
              readOnly
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/site-address')}>
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

export default LoadDetails;

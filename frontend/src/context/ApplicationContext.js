import React, { createContext, useContext, useState, useRef } from 'react';
import axios from 'axios';

const ApplicationContext = createContext();

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};

export const ApplicationProvider = ({ children }) => {
  const [applicationData, setApplicationData] = useState({
    applicant_details: {},
    general_information: {},
    site_address: {},
    load_details: {},
    other_contact: {},
    click_quote_data: {},
    project_details: {},
    auto_quote_eligibility: {},
    upload_docs: {},
    summary: {}
  });
  
  const [applicationId, setApplicationId] = useState(null);
  const [loadItems, setLoadItems] = useState([]);
  const debounceTimeoutRef = useRef(null);

  const API_BASE_URL = 'http://149.102.158.71:5000/api';

  // Create new application
  const createApplication = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/applications`, applicationData);
      setApplicationId(response.data.id);
      return response.data.id;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  };

  // Update application with debouncing
  const updateApplication = async (section, data) => {
    try {
      const updatedData = { ...applicationData, [section]: data };
      setApplicationData(updatedData);
      
      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      // Set new timeout for API call
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          if (applicationId) {
            await axios.put(`${API_BASE_URL}/applications/${applicationId}`, updatedData);
          } else {
            const response = await axios.post(`${API_BASE_URL}/applications`, updatedData);
            setApplicationId(response.data.id);
          }
        } catch (error) {
          console.error('Error updating application:', error);
        }
      }, 1000); // 1 second debounce
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  };

  // Load application data
  const loadApplication = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/applications/${id}`);
      setApplicationData(response.data);
      setApplicationId(id);
      
      // Load load items
      const loadItemsResponse = await axios.get(`${API_BASE_URL}/load-items/${id}`);
      setLoadItems(loadItemsResponse.data);
    } catch (error) {
      console.error('Error loading application:', error);
      throw error;
    }
  };

  // Load items management
  const addLoadItem = async (item) => {
    try {
      if (!applicationId) {
        await createApplication();
      }
      
      const response = await axios.post(`${API_BASE_URL}/load-items/${applicationId}`, item);
      const updatedItems = await axios.get(`${API_BASE_URL}/load-items/${applicationId}`);
      setLoadItems(updatedItems.data);
      return response.data;
    } catch (error) {
      console.error('Error adding load item:', error);
      throw error;
    }
  };

  const removeLoadItem = async (itemId) => {
    try {
      await axios.delete(`${API_BASE_URL}/load-items/${applicationId}?item_id=${itemId}`);
      const updatedItems = await axios.get(`${API_BASE_URL}/load-items/${applicationId}`);
      setLoadItems(updatedItems.data);
    } catch (error) {
      console.error('Error removing load item:', error);
      throw error;
    }
  };

  const updateLoadItem = async (itemId, updatedItem) => {
    try {
      // For simplicity, we'll remove and re-add the item
      await removeLoadItem(itemId);
      await addLoadItem(updatedItem);
    } catch (error) {
      console.error('Error updating load item:', error);
      throw error;
    }
  };

  const value = {
    applicationData,
    setApplicationData,
    applicationId,
    loadItems,
    setLoadItems,
    createApplication,
    updateApplication,
    loadApplication,
    addLoadItem,
    removeLoadItem,
    updateLoadItem
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

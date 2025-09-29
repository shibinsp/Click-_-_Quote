import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import MapComponent from '../components/MapComponent';
import QuotationModal from '../components/QuotationModal';
import QuoteDetailsCard from '../components/QuoteDetailsCard';
import { getQuotationsByPostcode, getHighestValidityQuote } from '../services/quotationService';

const ClickQuote = ({ onNext }) => {
  const navigate = useNavigate();
  const { updateApplication, applicationData } = useApplication();
  
  const [currentStep, setCurrentStep] = useState(1); // Start with step 1 (Draw site boundary) active
  const [mapData, setMapData] = useState({
    siteBoundary: [],
    substationPremise: null,
    cableRoute: []
  });

  const [mapCenter, setMapCenter] = useState({ lat: 51.5074, lng: -0.1278 }); // Default to London
  const [postcode, setPostcode] = useState('');
  const [searchPostcode, setSearchPostcode] = useState('');
  const [quotations, setQuotations] = useState([]);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [highestValidityQuote, setHighestValidityQuote] = useState(null);

  // Get postcode from site address data
  useEffect(() => {
    if (applicationData.site_address?.postcode) {
      setPostcode(applicationData.site_address.postcode);
      // Geocode the postcode to get coordinates
      geocodePostcode(applicationData.site_address.postcode);
      
      // Load quotations for TW3 or TW14 postcodes
      if (applicationData.site_address.postcode.toUpperCase().startsWith('TW3') || 
          applicationData.site_address.postcode.toUpperCase().includes('TW14')) {
        loadQuotations(applicationData.site_address.postcode);
      }
    }
  }, [applicationData.site_address]);

  // Enable drawing mode by default when component mounts
  useEffect(() => {
    console.log('Component mounted - enabling default drawing mode for step 1');
    // The MapComponent will automatically enable drawing mode based on currentStep=1
  }, []);

  const geocodePostcode = async (postcode) => {
    if (!postcode || !window.google) return;
    
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: postcode + ', UK' }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          setMapCenter({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          console.warn('Geocoding failed for postcode:', postcode);
        }
      });
    } catch (error) {
      console.error('Error geocoding postcode:', error);
    }
  };

  const loadQuotations = async (postcode) => {
    try {
      const quotes = await getQuotationsByPostcode(postcode);
      setQuotations(quotes);
      
      // Set the highest validity quote
      const highestQuote = getHighestValidityQuote(quotes);
      setHighestValidityQuote(highestQuote);
    } catch (error) {
      console.error('Error loading quotations:', error);
    }
  };

  const handleShowQuotations = () => {
    setShowQuotationModal(true);
  };

  const handleCloneQuote = (clonedQuote) => {
    // Save the cloned quote to application data
    updateApplication('click_quote_data', {
      ...mapData,
      clonedQuotation: clonedQuote
    });
    
    // Show success message with more details
    const successMessage = `
✅ Quotation Successfully Cloned!

Quote ID: ${clonedQuote.quoteId}
Customer: ${clonedQuote.customerName}
Amount: £${clonedQuote.estimatedCost.toLocaleString()}
Valid Until: ${clonedQuote.validUntil}

The cloned quotation has been saved to your application and will be available in the summary.
    `;
    
    alert(successMessage);
  };

  const handleProceedWithQuote = (quote) => {
    // Update application data with the selected quote
    updateApplication('click_quote_data', {
      ...mapData,
      selectedQuote: quote,
      quoteSelectionDate: new Date().toISOString().split('T')[0],
      thresholdCriteriaAccepted: true
    });
    
    // Note: Success message and navigation are now handled in QuoteDetailsCard component
    // This function only updates the application data
  };

  const handleSearchPostcode = async () => {
    if (!searchPostcode.trim()) {
      alert('Please enter a postcode to search');
      return;
    }

    try {
      // Geocode the searched postcode
      await geocodePostcode(searchPostcode.trim());
      
      // Update the current postcode
      setPostcode(searchPostcode.trim());
      
      // Load quotations if it's a TW3 or TW14 postcode
      if (searchPostcode.trim().toUpperCase().startsWith('TW3') || 
          searchPostcode.trim().toUpperCase().includes('TW14')) {
        loadQuotations(searchPostcode.trim());
      } else {
        // Clear quotations for non-TW3/TW14 postcodes
        setQuotations([]);
      }
      
      // Clear the search input
      setSearchPostcode('');
      
      // Show success message
      alert(`Successfully navigated to postcode: ${searchPostcode.trim()}`);
    } catch (error) {
      console.error('Error searching postcode:', error);
      alert('Error searching postcode. Please try again.');
    }
  };

  const [steps, setSteps] = useState([
    {
      id: 1,
      title: 'Draw site boundary',
      description: 'Define the area where the connection will be made',
      icon: '📐',
      completed: false,
      active: true, // Step 1 active by default
      clickable: true
    },
    {
      id: 2,
      title: 'Plot substation premise',
      description: 'Standard size (5m x 4m) - Place substation premise (and the point of supply)',
      icon: '🏠',
      completed: false,
      active: false,
      clickable: true,
      count: '0/1'
    },
    {
      id: 3,
      title: 'Draw cable route',
      description: '(between the point of supply and the existing network)',
      icon: '⚡',
      completed: false,
      active: false,
      clickable: true
    },
    {
      id: 4,
      title: 'Save',
      description: 'Save the drawing and proceed to next step',
      icon: '💾',
      completed: false,
      active: false,
      clickable: true
    }
  ]);

  const handleStepComplete = (stepId, data) => {
    setMapData(prev => ({
      ...prev,
      ...data
    }));

    setSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return { 
          ...step, 
          completed: true,
          active: false, // Deactivate current step
          count: stepId === 2 ? '1/1' : step.count
        };
      }
      return step;
    }));

    // Auto-advance to next step
    const nextStepId = stepId + 1;
    if (nextStepId <= 4) {
      // Activate next step
      setSteps(prev => prev.map(step => ({
        ...step,
        active: step.id === nextStepId
      })));
      
      setCurrentStep(nextStepId);
      
      const stepNames = {
        1: 'Site Boundary',
        2: 'Substation Premise', 
        3: 'Cable Route',
        4: 'Save'
      };
      
      const nextStepNames = {
        2: 'Substation Premise',
        3: 'Cable Route',
        4: 'Save'
      };
      
      alert(`✅ ${stepNames[stepId]} completed! Auto-advancing to ${nextStepNames[nextStepId]}.`);
    } else {
      // All steps completed
      alert(`✅ All drawing steps completed! Ready to save.`);
    }
  };

  const handleStepClick = (stepId) => {
    console.log('=== STEP CLICK EVENT ===');
    console.log('Step clicked:', stepId);
    console.log('Previous currentStep:', currentStep);
    
    // Allow clicking on any step to jump between them
    setSteps(prev => {
      const updatedSteps = prev.map(step => ({
        ...step,
        active: step.id === stepId,
        clickable: true // Make all steps clickable
      }));
      console.log('Updated steps:', updatedSteps);
      return updatedSteps;
    });
    
    setCurrentStep(stepId);
    console.log('Current step set to:', stepId);
    
    // Show step-specific instructions
    console.log(`Switched to step ${stepId}`);
    console.log('=== END STEP CLICK EVENT ===');
  };

  const handleUndo = () => {
    if (currentStep > 1) {
      // Clear the map data for the current step
      const updatedMapData = { ...mapData };
      
      if (currentStep === 2) {
        // Clear substation data
        updatedMapData.substationPremise = null;
        setMapData(updatedMapData);
        updateApplication('click_quote_data', updatedMapData);
      } else if (currentStep === 3) {
        // Clear cable route data
        updatedMapData.cableRoute = [];
        setMapData(updatedMapData);
        updateApplication('click_quote_data', updatedMapData);
      }
      
      // Go back to previous step
      setCurrentStep(currentStep - 1);
      
      // Update step completion status
      setSteps(prev => prev.map(step => 
        step.id >= currentStep ? { ...step, completed: false } : step
      ));
    } else if (currentStep === 1) {
      // Clear site boundary data
      const updatedMapData = { ...mapData };
      updatedMapData.siteBoundary = [];
      setMapData(updatedMapData);
      updateApplication('click_quote_data', updatedMapData);
      
      // Reset step 1
      setSteps(prev => prev.map(step => 
        step.id === 1 ? { ...step, completed: false } : step
      ));
    }
  };

  const handleRedo = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReferToDesigner = () => {
    // Handle referral to UK Power Networks designer
    console.log('Referring to UK Power Networks designer');
  };

  const handleSave = async () => {
    try {
      // Save all map data
      await updateApplication('click_quote_data', mapData);
      
      // Mark the save step as completed
      setSteps(prev => prev.map(step => 
        step.id === 4 ? { ...step, completed: true, active: false } : step
      ));
      
      // Show success message
      alert(`
✅ Drawing Successfully Saved!

Site Boundary: ${mapData.siteBoundary.length} points
Substation: ${mapData.substationPremise ? 'Placed' : 'Not placed'}
Cable Route: ${mapData.cableRoute.length} points

You can now proceed to the next step.
      `);
      
      // Navigate to next page
      navigate('/summary');
      if (onNext) onNext();
    } catch (error) {
      console.error('Error saving click & quote data:', error);
      alert('Error saving data. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Next button clicked, starting navigation...');
    try {
      console.log('Saving click_quote_data:', mapData);
      await updateApplication('click_quote_data', mapData);
      console.log('Data saved successfully, navigating to summary...');
      // Use window.location for more reliable navigation
      window.location.href = '/summary';
    } catch (error) {
      console.error('Error saving click & quote data:', error);
      alert('Error saving data. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <div style={{ marginBottom: '0.5rem' }}>
        <h1 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: '#333' }}>
          Need to speak to a designer?
        </h1>
        <p style={{ marginBottom: '0.25rem', color: '#666', fontSize: '0.8rem' }}>
          If you are unable to use the tool or are having trouble answering a particular question, 
          you can refer the application to UK Power Networks and we will pick up the details and get back in touch.
        </p>
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleReferToDesigner}
          style={{ float: 'right' }}
        >
          Refer to UK Power Networks
        </button>
        <div style={{ clear: 'both' }}></div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', minHeight: '700px' }}>
        <div style={{ 
          flex: '0 0 280px', 
          height: '700px', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Postcode Search Section */}
          <div style={{ 
            marginBottom: '0.75rem', 
            padding: '0.5rem', 
            background: '#f8f9fa', 
            borderRadius: '6px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{ marginBottom: '0.25rem', color: '#333', fontSize: '0.9rem' }}>
              🔍 Search by Postcode
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>
              Enter a UK postcode to navigate the map to that location and load relevant quotations.
            </p>
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
              <input
                type="text"
                value={searchPostcode}
                onChange={(e) => setSearchPostcode(e.target.value)}
                placeholder="e.g., TW3 1AB, SW1A 1AA"
                style={{
                  flex: 1,
                  padding: '0.25rem',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '0.8rem'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchPostcode();
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSearchPostcode}
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap'
                }}
              >
                Search
              </button>
            </div>
          </div>

          <div className="click-quote-steps" style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button 
                className="map-control-btn" 
                title="Back"
                onClick={() => navigate('/upload-docs')}
              >
                ←
              </button>
              <button 
                className="map-control-btn" 
                title="Undo"
                onClick={handleUndo}
                disabled={currentStep === null || currentStep <= 1}
              >
                ↶
              </button>
              <button 
                className="map-control-btn" 
                title="Redo"
                onClick={handleRedo}
                disabled={currentStep === null || currentStep >= 4}
              >
                ↷
              </button>
            </div>

            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {steps.map((step) => (
              <div
                key={step.id}
                className={`step-item ${
                  step.active ? 'active' :
                  step.completed ? 'completed' : 'pending'
                } clickable`}
                onClick={() => handleStepClick(step.id)}
                style={{ 
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  zIndex: 1,
                  opacity: 1
                }}
              >
                <div className="step-number">
                  {step.completed ? '✓' : step.id}
                </div>
                <div className="step-content">
                  <div className="step-title">
                    {step.icon} {step.title}
                  </div>
                  <div className="step-description">
                    {step.description}
                  </div>
                  {step.count && (
                    <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: step.completed ? '#28a745' : '#666' }}>
                      {step.count}
                    </div>
                  )}
                  {step.active && step.id === 1 && (
                    <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '4px' }}>
                      <div><strong>Drawing Mode:</strong></div>
                      <div>• Left-click to add points</div>
                      <div>• Right-click to move map</div>
                      <div>• Click 4+ points to complete</div>
                    </div>
                  )}
                  {step.active && step.id === 2 && (
                    <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '4px' }}>
                      <div><strong>Placement Mode:</strong></div>
                      <div>• Click on map to place substation</div>
                      <div>• Standard size: 5m x 4m</div>
                      <div>• Right-click to move map</div>
                    </div>
                  )}
                  {step.active && step.id === 3 && (
                    <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '4px' }}>
                      <div><strong>Drawing Mode:</strong></div>
                      <div>• Left-click to add route points</div>
                      <div>• Right-click to move map</div>
                      <div>• Connect to existing network</div>
                    </div>
                  )}
                  {step.active && step.id === 4 && (
                    <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '4px' }}>
                      <div><strong>Save & Continue:</strong></div>
                      <div>• Click to save all drawings</div>
                      <div>• Proceed to next step</div>
                      <div>• Data will be saved permanently</div>
                    </div>
                  )}
                </div>
                {step.active && (
                  <div className="step-indicator">
                    <div className="pulse-dot"></div>
                  </div>
                )}
                {step.id === 4 && step.clickable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave();
                    }}
                    style={{
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      marginTop: '0.5rem',
                      width: '100%'
                    }}
                  >
                    💾 Save & Continue
                  </button>
                )}
              </div>
              ))}
            </div>
          </div>
          
        </div>

        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <div className="map-container" style={{ height: '700px', position: 'relative', zIndex: 1 }}>
              <MapComponent
                currentStep={currentStep}
                mapData={mapData}
                onStepComplete={handleStepComplete}
                mapCenter={mapCenter}
                postcode={postcode}
                onUndo={handleUndo}
              />
            </div>
        </div>
      </div>

      {/* All Available Quotations - Under Map */}
      {quotations.length > 0 && (
        <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            color: '#007bff', 
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            📋 Available Quotations ({quotations.length})
          </h3>
          
          {/* Display all quotations */}
          {quotations.map((quote, index) => {
            const isHighestValidity = quote.qid === highestValidityQuote?.qid;
            const title = isHighestValidity ? "Highest Validity Quote" : `Quote ${index + 1} - ${quote.customerName}`;
            
            return (
              <div key={quote.qid} style={{ marginBottom: '1.5rem' }}>
                <QuoteDetailsCard
                  quote={quote}
                  onProceedWithQuote={handleProceedWithQuote}
                  title={title}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Information Bar under Map */}
      <div style={{ 
        background: '#f8f9fa', 
        border: '1px solid #dee2e6',
        borderRadius: '6px', 
        marginTop: '0.5rem',
        padding: '0.75rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Left side - Postcode and Load info */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.9rem', color: '#333' }}>
            <strong>📍 Postcode:</strong> {postcode || 'Not specified'}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#333' }}>
            <strong>⚡ Total Load:</strong> {applicationData.load_details?.totalLoad || '0'} kVA
          </div>
        </div>

        {/* Right side - Quotation info */}
        {postcode && postcode.toUpperCase().startsWith('TW3') && quotations.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.9rem', color: '#333' }}>
              <strong>💰 Available Quotations:</strong> {quotations.length}
            </div>
            {mapData.clonedQuotation && (
              <div style={{
                background: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
                fontSize: '0.8rem',
                color: '#155724'
              }}>
                <strong>✅ Cloned:</strong> {mapData.clonedQuotation.quoteId}
              </div>
            )}
            <button 
              className="btn btn-primary"
              onClick={handleShowQuotations}
              style={{ 
                padding: '0.25rem 0.75rem',
                fontSize: '0.8rem',
                whiteSpace: 'nowrap'
              }}
            >
              View Quotes
            </button>
          </div>
        )}
      </div>


      <form onSubmit={handleSubmit}>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/upload-docs')}>
            Previous
          </button>
          <button type="submit" className="btn btn-primary">
            Next
          </button>
        </div>
      </form>
      
      {/* Quotation Modal */}
      <QuotationModal
        quotations={quotations}
        isOpen={showQuotationModal}
        onClose={() => setShowQuotationModal(false)}
        onCloneQuote={handleCloneQuote}
      />
    </div>
  );
};

export default ClickQuote;

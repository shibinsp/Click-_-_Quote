import React, { useEffect, useRef, useState } from 'react';

const MapComponent = ({ currentStep, mapData, onStepComplete, mapCenter, postcode, onUndo }) => {
  console.log('MapComponent rendered with currentStep:', currentStep);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapLayers, setMapLayers] = useState({
    siteBoundary: null,
    substation: null,
    cableRoute: null,
    existingNetwork: null,
    locationMarker: null
  });
  
  const [drawingState, setDrawingState] = useState({
    isDrawing: false,
    points: [],
    distanceMarkers: [],
    pointMarkers: [] // Store point markers
  });
  
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  
  // Use ref to maintain current points for immediate access
  const currentPointsRef = useRef([]);

  // Drawing mode functions
  const enableDrawingMode = (stepType = 'boundary') => {
    console.log('=== ENABLE DRAWING MODE ===');
    console.log('enableDrawingMode called with stepType:', stepType);
    console.log('Current step from props:', currentStep);
    if (!mapInstanceRef.current) {
      console.log('No map instance found!');
      return;
    }
    
    setIsDrawingMode(true);
    const map = mapInstanceRef.current;
    console.log('Setting map options for drawing mode');
    // Disable map dragging during drawing
    map.setOptions({ draggable: false });
    // Change cursor to crosshair
    map.setOptions({ draggableCursor: 'crosshair' });
    
    // Add enhanced drawing mode indicator
    const drawingIndicator = document.createElement('div');
    drawingIndicator.id = 'drawing-indicator';
    
    let instructions, stepDescription, icon, backgroundColor;
    if (stepType === 'boundary') {
      instructions = 'Left-click to add points • Right-click to move map • Click 4+ points to complete';
      stepDescription = 'Click points to define the boundary area';
      icon = '🎯';
      backgroundColor = 'rgba(0, 102, 255, 0.95)'; // Blue
    } else if (stepType === 'substation') {
      instructions = 'Left-click to place substation • Right-click to move map • Single click to complete';
      stepDescription = 'Click to place the substation premise (5m x 4m)';
      icon = '🏠';
      backgroundColor = 'rgba(0, 204, 0, 0.95)'; // Green
    } else if (stepType === 'route') {
      instructions = 'Left-click to add route points • Right-click to move map • Connect to existing network';
      stepDescription = 'Click points to draw the cable route';
      icon = '⚡';
      backgroundColor = 'rgba(255, 102, 0, 0.95)'; // Orange
    }
    
    drawingIndicator.innerHTML = `
      <div style="
        background: ${backgroundColor};
        color: white;
        padding: 1rem 1.25rem;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: bold;
        box-shadow: 0 6px 12px rgba(0,0,0,0.4);
        position: absolute;
        top: 15px;
        left: 15px;
        z-index: 1000;
        border: 3px solid rgba(255,255,255,0.4);
        max-width: 320px;
        backdrop-filter: blur(10px);
      ">
        <div style="display: flex; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-size: 1.4rem; margin-right: 0.75rem;">${icon}</span>
          <strong style="font-size: 1rem;">Drawing Mode Active</strong>
        </div>
        <div style="font-size: 0.85rem; opacity: 0.95; line-height: 1.4;">
          ${instructions}
        </div>
        <div style="margin-top: 0.5rem; font-size: 0.75rem; opacity: 0.8;">
          ${stepDescription}
        </div>
      </div>
    `;
    mapRef.current.appendChild(drawingIndicator);
  };

  const disableDrawingMode = () => {
    console.log('=== DISABLE DRAWING MODE ===');
    if (!mapInstanceRef.current) return;
    
    setIsDrawingMode(false);
    const map = mapInstanceRef.current;
    
    // Re-enable map dragging
    map.setOptions({ draggable: true });
    map.setOptions({ draggableCursor: 'default' });
    
    // Remove drawing mode indicator
    const existingIndicator = document.getElementById('drawing-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }
  };

  // Handle step changes to update drawing mode
  useEffect(() => {
    console.log('Step change useEffect triggered. Current step:', currentStep);
    console.log('Map instance available:', !!mapInstanceRef.current);
    
    // If map is not ready, wait a bit and try again
    if (!mapInstanceRef.current) {
      console.log('Map not ready yet, retrying in 100ms...');
      const timer = setTimeout(() => {
        if (mapInstanceRef.current) {
          console.log('Map ready now, enabling drawing mode');
          // Retry the drawing mode setup
          setupDrawingMode();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    
    setupDrawingMode();
  }, [currentStep]);

  const setupDrawingMode = () => {
    console.log('=== SETUP DRAWING MODE ===');
    console.log('setupDrawingMode called with currentStep:', currentStep);
    if (!mapInstanceRef.current) {
      console.log('Map instance not available in setupDrawingMode');
      return;
    }
    
    // Clear any existing drawing mode indicators
    const existingIndicator = document.getElementById('drawing-indicator');
    if (existingIndicator) {
      console.log('Removing existing drawing indicator');
      existingIndicator.remove();
    }
    
    // DON'T reset drawing state - keep drawings visible
    // Only reset the current drawing points for the active step
    if (mapInstanceRef.current.drawingHandlers?.resetCurrentDrawing) {
      mapInstanceRef.current.drawingHandlers.resetCurrentDrawing();
    }
    
    setDrawingState(prev => ({
      ...prev,
      isDrawing: false,
      points: []
    }));
    // Clear ref
    currentPointsRef.current = [];
    
    // Enable appropriate drawing mode based on current step
    if (currentStep === null) {
      console.log('No step active - disabling drawing mode');
      // No step active - disable drawing mode
      disableDrawingMode();
    } else if (currentStep === 1) {
      console.log('Enabling site boundary drawing mode');
      // Site boundary drawing mode - BLUE
      enableDrawingMode('boundary');
    } else if (currentStep === 2) {
      console.log('Enabling substation placement mode');
      // Substation placement mode - GREEN
      enableDrawingMode('substation');
    } else if (currentStep === 3) {
      console.log('Enabling cable route drawing mode');
      // Cable route drawing mode - ORANGE
      enableDrawingMode('route');
    } else if (currentStep === 4) {
      console.log('Disabling drawing mode for save step');
      // Save mode - disable drawing
      disableDrawingMode();
    }
  };

  // Handle left click events - defined outside useEffect to access current currentStep
  const handleLeftClick = (event) => {
    console.log('=== MAP CLICK EVENT ===');
    console.log('Map clicked! Current step:', currentStep);
    console.log('Event details:', event);
    console.log('Drawing mode active:', isDrawingMode);
    
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const position = { lat, lng };
    console.log('Click position:', position);

    if (currentStep === 1) {
      console.log('Drawing site boundary...');
      // Site boundary drawing
      handleBoundaryDrawing(position, mapInstanceRef.current);
    } else if (currentStep === 2) {
      console.log('Placing substation...');
      // Substation placement
      handleSubstationPlacement(position, mapInstanceRef.current);
    } else if (currentStep === 3) {
      console.log('Drawing cable route...');
      // Cable route drawing
      handleCableRouteDrawing(position, mapInstanceRef.current);
    } else {
      console.log('No active step or currentStep is:', currentStep);
      console.log('Available steps: 1=boundary, 2=substation, 3=route');
    }
    console.log('=== END MAP CLICK EVENT ===');
  };

  // Drawing functions - defined outside useEffect to be accessible
  const handleBoundaryDrawing = (position, map) => {
    console.log('=== HANDLE BOUNDARY DRAWING ===');
    console.log('Current drawing points from ref:', currentPointsRef.current);
    console.log('New position:', position);
    
    // Get current points from ref and add new position
    const currentPoints = currentPointsRef.current || [];
    const newPointIndex = currentPoints.length + 1;
    const drawingPoints = [...currentPoints, position];
    
    // Update ref immediately
    currentPointsRef.current = drawingPoints;
    
    console.log('Updated drawing points:', drawingPoints);
    console.log('New point index:', newPointIndex);
    
    // Add enhanced point marker - BLUE for site boundary
    const pointMarker = new window.google.maps.Marker({
      position: position,
      map: map,
      title: `Boundary Point ${newPointIndex}`,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8, // Larger for better visibility
        fillColor: '#0066FF', // Bright blue
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3 // Thicker border
      },
      label: {
        text: `${newPointIndex}`,
        color: '#ffffff',
        fontSize: '14px', // Larger font
        fontWeight: 'bold'
      },
      zIndex: 1000 // Ensure markers are on top
    });
    
    console.log('Created point marker:', pointMarker);

    // Update state with new points and markers
    setDrawingState(prev => ({
      ...prev,
      points: drawingPoints,
      pointMarkers: [...prev.pointMarkers, pointMarker],
      distanceMarkers: [] // Clear distance markers
    }));

    // Show polygon preview after 2 points
    if (drawingPoints.length >= 2) {
      console.log('Creating polygon preview with points:', drawingPoints);
      
      // Clear previous polygon preview
      if (mapLayers.siteBoundary) {
        console.log('Clearing previous polygon');
        mapLayers.siteBoundary.setMap(null);
      }
      
      // Create preview polygon (not closed yet)
      const previewPath = [...drawingPoints];
      console.log('Preview path:', previewPath);
      
      const drawingPolygon = new window.google.maps.Polygon({
        paths: previewPath,
        strokeColor: '#0066FF', // Bright blue
        strokeOpacity: 0.8,
        strokeWeight: 3,
        strokePattern: [10, 5], // Dashed line pattern
        fillColor: '#0066FF',
        fillOpacity: 0.1 // Very light fill
      });
      drawingPolygon.setMap(map);
      console.log('Created polygon:', drawingPolygon);
      
      // Store the polygon for future clearing
      setMapLayers(prev => ({ ...prev, siteBoundary: drawingPolygon }));

      // Add distance markers for each segment
      const newDistanceMarkers = [];
      console.log('Adding distance markers for', drawingPoints.length, 'points');
      
      drawingPoints.forEach((point, index) => {
        if (index > 0) {
          console.log(`Calculating distance between point ${index-1} and ${index}`);
          const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
            new window.google.maps.LatLng(drawingPoints[index - 1].lat, drawingPoints[index - 1].lng),
            new window.google.maps.LatLng(point.lat, point.lng)
          );
          
          const midLat = (drawingPoints[index - 1].lat + point.lat) / 2;
          const midLng = (drawingPoints[index - 1].lng + point.lng) / 2;
          
          console.log(`Distance: ${distance.toFixed(1)}m, Mid point: ${midLat}, ${midLng}`);
          
          const distanceLabel = new window.google.maps.Marker({
            position: { lat: midLat, lng: midLng },
            map: map,
            title: `${distance.toFixed(1)}m`,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 0,
              fillOpacity: 0,
              strokeOpacity: 0
            },
            label: {
              text: `${distance.toFixed(1)}m`,
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor: '#0066FF', // Bright blue
              padding: '6px 8px',
              borderRadius: '6px',
              border: '2px solid #ffffff',
              boxShadow: '0 3px 6px rgba(0,0,0,0.4)'
            },
            zIndex: 999
          });
          newDistanceMarkers.push(distanceLabel);
          console.log('Created distance marker:', distanceLabel);
        }
      });

      console.log('Setting distance markers:', newDistanceMarkers);
      setDrawingState(prev => ({ ...prev, distanceMarkers: newDistanceMarkers }));
    }

    // Auto-complete when enough points (4+ for a proper polygon)
    if (drawingPoints.length >= 4) {
      // Clear previous polygon preview
      if (mapLayers.siteBoundary) {
        mapLayers.siteBoundary.setMap(null);
      }
      
      // Create final closed polygon
      const closedPath = [...drawingPoints, drawingPoints[0]];
      const finalPolygon = new window.google.maps.Polygon({
        paths: closedPath,
        strokeColor: '#0066FF', // Bright blue
        strokeOpacity: 0.9,
        strokeWeight: 4,
        strokePattern: [15, 5], // Dashed line pattern
        fillColor: '#0066FF',
        fillOpacity: 0.15 // Light fill
      });
      finalPolygon.setMap(map);
      
      // Store the final polygon
      setMapLayers(prev => ({ ...prev, siteBoundary: finalPolygon }));

      // Add final distance marker for closing segment
      const lastDistance = window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(drawingPoints[drawingPoints.length - 1].lat, drawingPoints[drawingPoints.length - 1].lng),
        new window.google.maps.LatLng(drawingPoints[0].lat, drawingPoints[0].lng)
      );
      
      const lastMidLat = (drawingPoints[drawingPoints.length - 1].lat + drawingPoints[0].lat) / 2;
      const lastMidLng = (drawingPoints[drawingPoints.length - 1].lng + drawingPoints[0].lng) / 2;
      
      const lastDistanceLabel = new window.google.maps.Marker({
        position: { lat: lastMidLat, lng: lastMidLng },
        map: map,
        title: `${lastDistance.toFixed(1)}m`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 0,
          fillOpacity: 0,
          strokeOpacity: 0
        },
        label: {
          text: `${lastDistance.toFixed(1)}m`,
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: '#0066FF',
          padding: '6px 8px',
          borderRadius: '6px',
          border: '2px solid #ffffff',
          boxShadow: '0 3px 6px rgba(0,0,0,0.4)'
        },
        zIndex: 999
      });

      setDrawingState(prev => ({ 
        ...prev, 
        distanceMarkers: [...prev.distanceMarkers, lastDistanceLabel] 
      }));

      // Complete the step
      onStepComplete(1, { siteBoundary: drawingPoints });
      showCompletionMessage(`✅ Site boundary completed! (${drawingPoints.length} points)`);
    }
  };

  const handleSubstationPlacement = (position, map) => {
    console.log('=== SUBSTATION PLACEMENT ===');
    console.log('Position:', position);
    console.log('Map:', map);
    
    // Clear existing substation
    if (mapLayers.substation) {
      mapLayers.substation.setMap(null);
    }

    const lat = position.lat;
    const lng = position.lng;

    // Create substation rectangle - GREEN
    const substation = new window.google.maps.Rectangle({
      bounds: {
        north: lat + 0.00005,
        south: lat - 0.00005,
        east: lng + 0.00004,
        west: lng - 0.00004
      },
      strokeColor: '#00CC00', // Bright green
      strokeOpacity: 0.9,
      strokeWeight: 4,
      fillColor: '#00CC00',
      fillOpacity: 0.3
    });
    substation.setMap(map);

    // Add substation marker - GREEN
    const substationMarker = new window.google.maps.Marker({
      position: position,
      map: map,
      title: 'Substation Premise (5m x 4m)',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#00CC00', // Bright green
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3
      },
      label: {
        text: '⚡',
        fontSize: '16px'
      }
    });

    setMapLayers(prev => ({ ...prev, substation }));
    onStepComplete(2, { substationPremise: position });
    showCompletionMessage('Substation premise placed! (5m x 4m)');
  };

  const handleCableRouteDrawing = (position, map) => {
    const drawingPoints = [...(drawingState.points || []), position];
    setDrawingState(prev => ({ ...prev, points: drawingPoints }));
    
    // Clear previous polyline
    if (mapLayers.cableRoute) {
      mapLayers.cableRoute.setMap(null);
    }
    
    // Clear existing distance markers
    setDrawingState(prev => {
      prev.distanceMarkers.forEach(marker => marker.setMap(null));
      return { ...prev, distanceMarkers: [] };
    });

    // Add point marker - ORANGE for cable route
    const pointMarker = new window.google.maps.Marker({
      position: position,
      map: map,
      title: `Route Point ${drawingPoints.length}`,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 6,
        fillColor: '#FF6600', // Bright orange
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2
      },
      label: {
        text: `${drawingPoints.length}`,
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: 'bold'
      }
    });

    if (drawingPoints.length >= 2) {
      // Create polyline - ORANGE for cable route
      const drawingPolyline = new window.google.maps.Polyline({
        path: drawingPoints,
        geodesic: true,
        strokeColor: '#FF6600', // Bright orange
        strokeOpacity: 0.9,
        strokeWeight: 5,
        strokePattern: [10, 5]
      });
      drawingPolyline.setMap(map);

      // Add distance markers
      const newDistanceMarkers = [];
      drawingPoints.forEach((point, index) => {
        if (index > 0) {
          const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
            new window.google.maps.LatLng(drawingPoints[index - 1].lat, drawingPoints[index - 1].lng),
            new window.google.maps.LatLng(point.lat, point.lng)
          );
          
          const midLat = (drawingPoints[index - 1].lat + point.lat) / 2;
          const midLng = (drawingPoints[index - 1].lng + point.lng) / 2;
          
          const distanceLabel = new window.google.maps.Marker({
            position: { lat: midLat, lng: midLng },
            map: map,
            title: `${distance.toFixed(1)}m`,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 0,
              fillOpacity: 0,
              strokeOpacity: 0
            },
            label: {
              text: `${distance.toFixed(1)}m`,
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 'bold',
              backgroundColor: '#FF6600', // Bright orange
              padding: '4px 6px',
              borderRadius: '4px',
              border: '2px solid #ffffff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }
          });
          newDistanceMarkers.push(distanceLabel);
        }
      });

      setDrawingState(prev => ({ ...prev, distanceMarkers: newDistanceMarkers }));

      // Auto-complete when enough points
      if (drawingPoints.length >= 3) {
        setMapLayers(prev => ({ ...prev, cableRoute: drawingPolyline }));
        onStepComplete(3, { cableRoute: drawingPoints });
        showCompletionMessage(`Cable route completed! (${drawingPoints.length} points)`);
      }
    }
  };

  const showCompletionMessage = (message) => {
    const completionMsg = document.createElement('div');
    completionMsg.id = 'completion-message';
    completionMsg.innerHTML = `
      <div style="
        background: rgba(0, 150, 0, 0.95);
        color: white;
        padding: 1rem 1.25rem;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: bold;
        box-shadow: 0 6px 12px rgba(0,0,0,0.4);
        position: absolute;
        top: 100px;
        left: 15px;
        z-index: 1000;
        border: 3px solid rgba(255,255,255,0.4);
        backdrop-filter: blur(10px);
        max-width: 300px;
      ">
        <div style="display: flex; align-items: center;">
          <span style="font-size: 1.2rem; margin-right: 0.5rem;">✅</span>
          <span>${message}</span>
        </div>
      </div>
    `;
    mapRef.current.appendChild(completionMsg);
    
    setTimeout(() => {
      const msg = document.getElementById('completion-message');
      if (msg) msg.remove();
    }, 4000); // Show longer for better visibility
  };

  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize Google Map
    const map = new window.google.maps.Map(mapRef.current, {
      center: mapCenter || { lat: 51.5074, lng: -0.1278 },
      zoom: 16,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = map;

    // Add click listeners
    map.addListener('click', handleLeftClick);
    map.addListener('rightclick', (event) => {
      // Right click allows map movement
      if (isDrawingMode) {
        // Temporarily disable drawing mode for map movement
        disableDrawingMode();
        // Re-enable after a short delay
        setTimeout(() => {
          if (currentStep === 1) {
            enableDrawingMode('boundary');
          } else if (currentStep === 2) {
            enableDrawingMode('substation');
          } else if (currentStep === 3) {
            enableDrawingMode('route');
          }
        }, 100);
      }
    });

    // Store map instance and handlers for cleanup
    mapInstanceRef.current.drawingHandlers = {
      enableDrawingMode,
      disableDrawingMode,
      handleLeftClick,
      resetDrawingState: () => {
        // Reset all drawing state
        setDrawingState(prev => {
          // Clear existing point markers from map
          prev.pointMarkers.forEach(marker => marker.setMap(null));
          return {
            isDrawing: false,
            points: [],
            distanceMarkers: [],
            pointMarkers: []
          };
        });
        // Clear ref
        currentPointsRef.current = [];
      },
      resetCurrentDrawing: () => {
        // Reset only current drawing points and markers
        setDrawingState(prev => {
          // Clear existing point markers from map
          prev.pointMarkers.forEach(marker => marker.setMap(null));
          return {
            ...prev,
            isDrawing: false,
            points: [],
            pointMarkers: []
          };
        });
        // Clear ref
        currentPointsRef.current = [];
      }
    };

  }, []); // Empty dependency array - run only once

  // Update map center when postcode changes
  useEffect(() => {
    if (mapInstanceRef.current && mapCenter) {
      mapInstanceRef.current.setCenter(mapCenter);
      mapInstanceRef.current.setZoom(16);
    }
  }, [mapCenter]);

  // Add/update location marker when postcode changes
  useEffect(() => {
    if (mapInstanceRef.current && postcode) {
      // Clear existing location marker
      if (mapLayers.locationMarker) {
        mapLayers.locationMarker.setMap(null);
      }

      // Add new location marker
      const locationMarker = new window.google.maps.Marker({
        position: mapCenter || { lat: 51.5074, lng: -0.1278 },
        map: mapInstanceRef.current,
        title: `Location: ${postcode}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#FF0000',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        },
        label: {
          text: '📍',
          fontSize: '16px'
        }
      });

      setMapLayers(prev => ({ ...prev, locationMarker }));
    }
  }, [postcode, mapCenter, mapLayers.locationMarker]);

  // Render existing map data when it changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Clear existing layers
    Object.values(mapLayers).forEach(layer => {
      if (layer && layer.setMap) {
        layer.setMap(null);
      }
    });

    // Render site boundary
    if (mapData.siteBoundary && mapData.siteBoundary.length >= 3) {
      const boundaryPolygon = new window.google.maps.Polygon({
        paths: mapData.siteBoundary,
        strokeColor: '#0066FF',
        strokeOpacity: 0.9,
        strokeWeight: 4,
        strokePattern: [15, 5],
        fillColor: '#0066FF',
        fillOpacity: 0.15
      });
      boundaryPolygon.setMap(map);
      setMapLayers(prev => ({ ...prev, siteBoundary: boundaryPolygon }));
    }

    // Render substation
    if (mapData.substationPremise) {
      const lat = mapData.substationPremise.lat;
      const lng = mapData.substationPremise.lng;
      
      const substation = new window.google.maps.Rectangle({
        bounds: {
          north: lat + 0.00005,
          south: lat - 0.00005,
          east: lng + 0.00004,
          west: lng - 0.00004
        },
        strokeColor: '#00CC00',
        strokeOpacity: 0.9,
        strokeWeight: 4,
        fillColor: '#00CC00',
        fillOpacity: 0.3
      });
      substation.setMap(map);
      setMapLayers(prev => ({ ...prev, substation }));
    }

    // Render cable route
    if (mapData.cableRoute && mapData.cableRoute.length >= 2) {
      const cablePolyline = new window.google.maps.Polyline({
        path: mapData.cableRoute,
        geodesic: true,
        strokeColor: '#FF6600',
        strokeOpacity: 0.9,
        strokeWeight: 5,
        strokePattern: [10, 5]
      });
      cablePolyline.setMap(map);
      setMapLayers(prev => ({ ...prev, cableRoute: cablePolyline }));
    }
  }, [mapData]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '700px'
      }} 
    />
  );
};

export default MapComponent;
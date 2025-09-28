import React from 'react';

const ProgressBar = ({ steps, currentStep }) => {
  return (
    <div className="progress-bar">
      <div className="steps-container">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div 
              className={`step ${
                index < currentStep ? 'completed' : 
                index === currentStep ? 'current' : 
                index === currentStep + 1 ? 'next' : 'pending'
              }`}
            >
              {index < currentStep && <span className="checkmark">✓</span>}
              <span className="step-text">{step}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="chevron-separator"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;

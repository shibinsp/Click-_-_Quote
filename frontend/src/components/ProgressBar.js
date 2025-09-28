import React from 'react';

const ProgressBar = ({ steps, currentStep }) => {
  // Define the specific steps based on the image
  const progressSteps = [
    { name: 'Register/check', type: 'register', icon: '✓' },
    { name: 'Applicant Details', type: 'chevron', completed: true },
    { name: 'General Information', type: 'chevron', completed: true },
    { name: 'Site Address', type: 'chevron', completed: true },
    { name: 'Load Details', type: 'chevron', completed: true },
    { name: 'Other Contact', type: 'chevron', completed: true },
    { name: 'Click & Quote', type: 'chevron', completed: true },
    { name: 'Project Details', type: 'chevron', completed: true },
    { name: 'Upload Docs', type: 'button', completed: false },
    { name: 'Summary', type: 'button', completed: false },
    { name: 'Submit', type: 'button', completed: false }
  ];

  return (
    <div className="progress-bar">
      <div className="steps-container">
        {progressSteps.map((step, index) => (
          <React.Fragment key={index}>
            <div 
              className={`step ${step.type} ${
                step.completed ? 'completed' : 
                index === currentStep ? 'current' : 'pending'
              }`}
            >
              {step.type === 'register' && (
                <span className="register-icon">{step.icon}</span>
              )}
              {step.type === 'chevron' && step.completed && (
                <span className="checkmark">✓</span>
              )}
              <span className="step-text">{step.name}</span>
            </div>
            {index < progressSteps.length - 1 && (
              <div className={`chevron-separator ${step.type}-to-${progressSteps[index + 1].type}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;

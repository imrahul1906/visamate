import React from 'react';

interface Props {
  currentStep: number;
}

export default function WizardStepper({ currentStep }: Props) {
  const steps = [
    'Country',
    'Visa Type',
    'Location',
    'Details',
    'Documents',
    'Next Step',
  ];
  return (
    <div className="flex justify-between mb-4">
      {steps.map((label, idx) => (
        <div
          key={label}
          className={`flex-1 text-center py-2 border-b-2 ${
            idx + 1 === currentStep ? 'border-indigo-600 font-medium' : 'border-gray-300'
          }`}
        >
          {idx + 1}. {label}
        </div>
      ))}
    </div>
  );
}

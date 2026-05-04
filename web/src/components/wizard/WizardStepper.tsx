"use client";

import React from "react";

interface Props {
  currentStep: number;
}

export default function WizardStepper({ currentStep }: Props) {
  const steps = [
    "Country",
    "Visa Type",
    "Location",
    "Details",
    "Documents",
    "Next Step",
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-3 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((label, idx) => {
          const isActive = idx + 1 === currentStep;

          return (
            <div key={label} className="flex-1 text-center relative">
              <div
                className={`text-sm ${isActive
                    ? "text-gray-900 font-semibold"
                    : "text-gray-400 font-medium"
                  }`}
              >
                {idx + 1}. {label}
              </div>

              {isActive && (
                <div className="absolute left-6 right-6 -bottom-2 h-[2px] bg-indigo-500 rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
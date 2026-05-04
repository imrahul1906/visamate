"use client";

import React from "react";

interface Props {
  currentStep: number;
  canContinue: boolean;
  onStepChange: (step: number) => void;
}

export default function WizardNav({
  currentStep,
  canContinue,
  onStepChange,
}: Props) {
  const updateStep = (step: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("step", step.toString());

    // ✅ FIX: no navigation → no scroll reset
    window.history.replaceState(null, "", `?${params.toString()}`);

    onStepChange(step);
  };

  return (
    <div className="flex justify-between mt-6">
      {currentStep > 1 ? (
        <button
          onClick={() => updateStep(currentStep - 1)}
          className="px-5 py-2 text-sm rounded-md border border-gray-300 text-gray-600 bg-white transition-colors duration-150 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-800"
        >
          Back
        </button>
      ) : (
        <div />
      )}

      <button
        onClick={() => updateStep(currentStep + 1)}
        disabled={!canContinue}
        className="px-6 py-2.5 text-sm font-medium text-white rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300"
      >
        Continue
      </button>
    </div>
  );
}
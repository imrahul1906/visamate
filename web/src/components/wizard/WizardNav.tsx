"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  currentStep: number;
  canContinue: boolean;
  onContinue?: () => void;
}

export default function WizardNav({ currentStep, canContinue, onContinue }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(Array.from(searchParams.entries()));

  const goToStep = (step: number) => {
    params.set('step', step.toString());
    router.replace(`?${params.toString()}`);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const handleContinue = () => {
    if (onContinue) onContinue();
    if (currentStep < 6) {
      goToStep(currentStep + 1);
    }
  };

  return (
    <div className="flex justify-between mt-4">
      {currentStep > 1 ? (
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          onClick={handleBack}
        >
          Back
        </button>
      ) : (
        <div />
      )}
      <button
        type="button"
        className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300`}
        onClick={handleContinue}
        disabled={!canContinue}
      >
        Continue
      </button>
    </div>
  );
}

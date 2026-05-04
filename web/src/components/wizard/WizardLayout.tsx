"use client";

import React from "react";
import WizardStepper from "./WizardStepper";
import WizardNav from "./WizardNav";

interface Props {
  step: number;
  canContinue: boolean;
  onStepChange: (step: number) => void;
  children: React.ReactNode;
}

export default function WizardLayout({
  step,
  canContinue,
  onStepChange,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-[#f3f4f6] pt-16 pb-10">
      <div className="max-w-5xl mx-auto px-4">

        {/* Stepper */}
        <WizardStepper currentStep={step} />

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          {children}
        </div>

        {/* Navigation (outside card like POC) */}
        <WizardNav
          currentStep={step}
          canContinue={canContinue}
          onStepChange={onStepChange}
        />
      </div>
    </div>
  );
}
"use client";

import React, { ReactNode } from 'react';
import WizardStepper from './WizardStepper';
import WizardNav from './WizardNav';

interface Props {
  children: ReactNode;
  currentStep: number;
  canContinue: boolean;
  onContinue?: () => void;
}

export default function WizardLayout({ children, currentStep, canContinue, onContinue }: Props) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center py-8">
      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow">
        <WizardStepper currentStep={currentStep} />
        <div className="my-8">{children}</div>
        <WizardNav
          currentStep={currentStep}
          canContinue={canContinue}
          onContinue={onContinue}
        />
      </div>
    </div>
  );
}

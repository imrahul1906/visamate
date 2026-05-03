"use client";

import React, { useState } from "react";
import WizardLayout from "../../components/wizard/WizardLayout";
import StepCountry from "../../components/wizard/steps/StepCountry";

interface Props {
  initialStep: number;
  initialCountry: string | null;
}

export default function WizardClient({
  initialStep,
  initialCountry,
}: Props) {
  const [step, setStep] = useState(initialStep);
  const [country, setCountry] = useState<string | null>(initialCountry);

  const canContinue = step === 1 ? !!country : true;

  return (
    <WizardLayout
      step={step}
      canContinue={canContinue}
      onStepChange={setStep}
    >
      {step === 1 && (
        <StepCountry
          selectedCountry={country}
          onSelect={setCountry}
        />
      )}

      {step !== 1 && (
        <div className="text-center py-20 text-gray-500">
          Step {step} coming soon...
        </div>
      )}
    </WizardLayout>
  );
}
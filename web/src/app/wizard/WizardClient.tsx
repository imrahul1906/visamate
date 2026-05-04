"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import WizardLayout from "../../components/wizard/WizardLayout";
import StepCountry from "../../components/wizard/steps/StepCountry";
import StepVisaType from "../../components/wizard/steps/StepVisaType";

interface Props {
  initialStep: number;
  initialCountry: string | null;
  initialVisaType: string | null;
}

export default function WizardClient({
  initialStep,
  initialCountry,
  initialVisaType,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(initialStep);
  const [country, setCountry] = useState<string | null>(initialCountry);
  const [visaType, setVisaType] = useState<string | null>(
    initialVisaType
  );

  // ✅ Control Continue button
  const canContinue =
    (step === 1 && !!country) ||
    (step === 2 && !!visaType) ||
    step > 2;

  // ✅ Update URL helper
  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.replace(`/wizard?${params.toString()}`);
  };

  // ✅ Handle step change (sync to URL)
  const handleStepChange = (nextStep: number) => {
    setStep(nextStep);
    updateURL({ step: String(nextStep) });
  };

  // ✅ Render steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepCountry
            selectedCountry={country}
            onSelect={(c) => {
              setCountry(c);
              updateURL({ country: c });
            }}
          />
        );

      case 2:
        return (
          <StepVisaType
            selectedVisa={visaType}
            onSelect={(v) => {
              setVisaType(v);
              updateURL({ visaType: v });
            }}
          />
        );

      default:
        return (
          <div className="text-center py-20 text-gray-500">
            Step {step} coming soon...
          </div>
        );
    }
  };

  return (
    <WizardLayout
      step={step}
      canContinue={canContinue}
      onStepChange={handleStepChange}
    >
      {renderStep()}
    </WizardLayout>
  );
}
"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StepCountry from "../../components/wizard/steps/StepCountry";
import StepVisaType from "../../components/wizard/steps/StepVisaType";
import StepLocation from "../../components/wizard/steps/StepLocation";
import StepDetails from "../../components/wizard/steps/StepDetails";
import StepDocuments from "../../components/wizard/steps/StepDocuments";
import StepNext from "../../components/wizard/steps/StepNext";
import WizardLayout from "../../components/wizard/WizardLayout";

export default function WizardClient({ initialStep, initialCountry }: { initialStep: number; initialCountry: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const step = parseInt(searchParams.get("step") ?? "1", 10);
  const currentStep = Math.min(Math.max(step, 1), 6);
  const selectedCountry = searchParams.get("country") ?? null;

  const canContinue = currentStep === 1 ? !!selectedCountry : true;

  const handleContinue = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", (currentStep + 1).toString());
    router.replace(`?${params.toString()}`);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepCountry selectedCountry={selectedCountry} onSelect={() => {}} />;
      case 2:
        return <StepVisaType />;
      case 3:
        return <StepLocation />;
      case 4:
        return <StepDetails />;
      case 5:
        return <StepDocuments />;
      case 6:
        return <StepNext />;
      default:
        return null;
    }
  };

  return (
    <WizardLayout
      currentStep={currentStep}
      canContinue={canContinue}
      onContinue={handleContinue}
    >
      {renderStep()}
    </WizardLayout>
  );
}
import React from 'react';
import WizardLayout from '../../components/wizard/WizardLayout';
import StepCountry from '../../components/wizard/steps/StepCountry';
import StepVisaType from '../../components/wizard/steps/StepVisaType';
import StepLocation from '../../components/wizard/steps/StepLocation';
import StepDetails from '../../components/wizard/steps/StepDetails';
import StepDocuments from '../../components/wizard/steps/StepDocuments';
import StepNext from '../../components/wizard/steps/StepNext';

export default async function WizardPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const rawParams = await searchParams;
  const sp = new URLSearchParams(Object.entries(rawParams as Record<string, string>));
  const step = parseInt(sp.get('step') ?? '1', 10);
  const currentStep = Math.min(Math.max(step, 1), 6);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepCountry />;
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
        return <StepCountry />;
    }
  };

  // For now allow continue always
  return (
    <WizardLayout currentStep={currentStep} canContinue={true}>
      {renderStep()}
    </WizardLayout>
  );
}

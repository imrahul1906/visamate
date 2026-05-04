import WizardClient from "./WizardClient";

export default async function WizardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const rawParams = await searchParams;

  const sp = new URLSearchParams(
    Object.entries(rawParams as Record<string, string>)
  );

  const step = parseInt(sp.get("step") ?? "1", 10);
  const currentStep = Math.min(Math.max(step, 1), 6);

  const selectedCountry = sp.get("country") ?? null;
  const selectedVisaType = sp.get("visaType") ?? null;

  return (
    <WizardClient
      initialStep={currentStep}
      initialCountry={selectedCountry}
      initialVisaType={selectedVisaType}
    />
  );
}
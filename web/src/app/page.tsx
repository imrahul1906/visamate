// src/app/page.tsx
import VisaMateLanding from "../features/wizard/WizardAccordion";
import { ApplicantProvider } from "@/lib/context/ApplicantContext";

export default function WizardPage() {
  return (
    <ApplicantProvider>
      <VisaMateLanding />
    </ApplicantProvider>
  );
}

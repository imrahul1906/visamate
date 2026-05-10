// visamate/web/src/types/wizard.ts

export interface WizardSelections {
  country: string;
  countryName: string;
  visaType: string;
  visaTypeName: string;
  location: string;
  locationName: string;
  sponsorship: string;
  profile: string;
  // Applicant context for CoverLetterWidget
  applicantName: string;
  passportNo: string;
  travelStartDate: string;
  travelDuration: number;
  cities: string[];
}
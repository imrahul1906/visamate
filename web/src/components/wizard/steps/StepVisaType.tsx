"use client";

import {
  Briefcase,
  Plane,
  GraduationCap,
  User,
  Camera,
} from "lucide-react";

interface Props {
  selectedVisa: string | null;
  onSelect: (visa: string) => void;
}

const visaOptions = [
  {
    id: "tourist",
    title: "Tourist Visa",
    description: "For tourism, sightseeing, visiting friends or family",
    icon: <Camera className="w-5 h-5" />,
  },
  {
    id: "business",
    title: "Business Visa",
    description: "For business meetings, conferences, trade, etc.",
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    id: "transit",
    title: "Transit Visa",
    description: "For passing through the country",
    icon: <Plane className="w-5 h-5" />,
  },
  {
    id: "student",
    title: "Student Visa",
    description: "For studying in educational institutions",
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    id: "work",
    title: "Work Visa",
    description: "For employment in the country",
    icon: <User className="w-5 h-5" />,
  },
];

export default function StepVisaType({
  selectedVisa,
  onSelect,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">Step 2</p>
        <h2 className="text-2xl font-semibold">Select Visa Type</h2>
        <p className="text-gray-500 mt-1">
          What type of visa do you need?
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {visaOptions.map((option) => {
          const isActive = selectedVisa === option.id;

          return (
            <div
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition
                ${
                  isActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
            >
              <div className="flex items-center gap-3">
                {/* Icon (always blue) */}
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  {option.icon}
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-medium">{option.title}</h3>
                  <p className="text-sm text-gray-500">
                    {option.description}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div
                className={`text-lg ${
                  isActive ? "text-blue-600" : "text-gray-400"
                }`}
              >
                ›
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
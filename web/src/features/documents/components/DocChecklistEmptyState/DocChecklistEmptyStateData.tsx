// src/features/documents/components/DocChecklistEmptyState/DocChecklistEmptyStateData.tsx
import React from "react";

export interface StepItem {
  icon: React.ReactNode;
  label: string;
  sub: string;
  color: string;
  glow: string;
  borderHover: string;
  bgHover: string;
}

export const STEPS: StepItem[] = [
  {
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
      </svg>
    ),
    label: "Select a document",
    sub: "Tap any item on the left to see what's needed",
    color: "var(--vm-indigo-light)",
    glow: "var(--vm-indigo-glow)",
    borderHover: "var(--vm-indigo-light)",
    bgHover: "var(--vm-indigo-glow)",
  },
  {
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
      </svg>
    ),
    label: "Upload your files",
    sub: "Attach digital copies to build your folder",
    color: "var(--vm-amber)",
    glow: "var(--vm-amber-bg)",
    borderHover: "var(--vm-amber-border)",
    bgHover: "var(--vm-amber-bg)",
  },
  {
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Mark items done",
    sub: "Check off docs as you collect them",
    color: "var(--vm-green)",
    glow: "var(--vm-green-bg)",
    borderHover: "var(--vm-green-border)",
    bgHover: "var(--vm-green-bg)",
  },
  {
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    label: "Download as ZIP",
    sub: "Export everything in one click when ready",
    color: "var(--vm-blue)",
    glow: "var(--vm-blue-bg)",
    borderHover: "var(--vm-blue-border)",
    bgHover: "var(--vm-blue-bg)",
  },
];

export const ONLINE_STEPS: StepItem[] = [
  {
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
      </svg>
    ),
    label: "Select a document",
    sub: "Tap any item on the left to see specifications",
    color: "var(--vm-indigo-light)",
    glow: "var(--vm-indigo-glow)",
    borderHover: "var(--vm-indigo-light)",
    bgHover: "var(--vm-indigo-glow)",
  },
  {
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5h10.5a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0017.25 4.5H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    label: "Verify digital uploads",
    sub: "Upload files to check format & size limits",
    color: "var(--vm-amber)",
    glow: "var(--vm-amber-bg)",
    borderHover: "var(--vm-amber-border)",
    bgHover: "var(--vm-amber-bg)",
  },
  {
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Verify specifications",
    sub: "Check sizing, background, and format rules",
    color: "var(--vm-green)",
    glow: "var(--vm-green-bg)",
    borderHover: "var(--vm-green-border)",
    bgHover: "var(--vm-green-bg)",
  },
  {
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
      </svg>
    ),
    label: "Fill on official portal",
    sub: "Open portal and use our copy-paste helper",
    color: "var(--vm-blue)",
    glow: "var(--vm-blue-bg)",
    borderHover: "var(--vm-blue-border)",
    bgHover: "var(--vm-blue-bg)",
  },
];

export interface DemoDocItem {
  name: string;
  badge: string;
  checked: boolean;
  uploaded: boolean;
}

export interface MockState {
  activeDocIndex: number;
  docs: DemoDocItem[];
  showGuide: boolean;
  zipClicked: boolean;
  progress: number;
}

export interface TimelineStep {
  targetX: string;
  targetY: string;
  opacity: number;
  duration: number;
  holdTime: number;
  click?: boolean;
  activeTextStep: number | null;
  stateUpdate?: (prev: MockState) => MockState;
}

export const TIMELINE_STEPS: TimelineStep[] = [
  // 0: Initial Idle
  {
    targetX: "75%",
    targetY: "45%",
    opacity: 1,
    duration: 0,
    holdTime: 1200,
    activeTextStep: null,
    stateUpdate: () => ({
      activeDocIndex: -1,
      docs: [
        { name: "Visa Application Form", badge: "Form", checked: false, uploaded: false },
        { name: "Passport Copy", badge: "Upload", checked: false, uploaded: false },
        { name: "Flight Reservations", badge: "Upload", checked: false, uploaded: false },
      ],
      showGuide: false,
      zipClicked: false,
      progress: 0,
    }),
  },
  // 1: Move and Click Row 1 (Visa Application Form)
  {
    targetX: "19%",
    targetY: "47%",
    opacity: 1,
    duration: 850,
    holdTime: 1500,
    click: true,
    activeTextStep: 0, // "Select a document"
    stateUpdate: (prev) => ({
      ...prev,
      activeDocIndex: 0,
    }),
  },
  // 2: Move and Click Checkbox for Row 1
  {
    targetX: "4.5%",
    targetY: "47%",
    opacity: 1,
    duration: 600,
    holdTime: 1200,
    click: true,
    activeTextStep: 2, // "Mark items done"
    stateUpdate: (prev) => {
      const docs = prev.docs.map((d, i) => i === 0 ? { ...d, checked: true } : d);
      return {
        ...prev,
        docs,
        progress: 33,
      };
    },
  },
  // 3: Move and Click Row 2 (Passport Copy)
  {
    targetX: "19%",
    targetY: "58%",
    opacity: 1,
    duration: 850,
    holdTime: 1500,
    click: true,
    activeTextStep: 0, // "Select a document"
    stateUpdate: (prev) => ({
      ...prev,
      activeDocIndex: 1,
    }),
  },
  // 4: Move and Click Upload Slot for Row 2
  {
    targetX: "69%",
    targetY: "65%",
    opacity: 1,
    duration: 850,
    holdTime: 1500,
    click: true,
    activeTextStep: 1, // "Upload your files"
    stateUpdate: (prev) => {
      const docs = prev.docs.map((d, i) => i === 1 ? { ...d, uploaded: true } : d);
      return {
        ...prev,
        docs,
      };
    },
  },
  // 5: Move and Click Checkbox for Row 2
  {
    targetX: "4.5%",
    targetY: "58%",
    opacity: 1,
    duration: 600,
    holdTime: 1200,
    click: true,
    activeTextStep: 2, // "Mark items done"
    stateUpdate: (prev) => {
      const docs = prev.docs.map((d, i) => i === 1 ? { ...d, checked: true } : d);
      return {
        ...prev,
        docs,
        progress: 66,
      };
    },
  },
  // 6: Move and Click Row 3 (Flight Reservations)
  {
    targetX: "19%",
    targetY: "69%",
    opacity: 1,
    duration: 850,
    holdTime: 1500,
    click: true,
    activeTextStep: 0, // "Select a document"
    stateUpdate: (prev) => ({
      ...prev,
      activeDocIndex: 2,
    }),
  },
  // 7: Move and Click Upload Slot for Row 3
  {
    targetX: "69%",
    targetY: "65%",
    opacity: 1,
    duration: 850,
    holdTime: 1500,
    click: true,
    activeTextStep: 1, // "Upload your files"
    stateUpdate: (prev) => {
      const docs = prev.docs.map((d, i) => i === 2 ? { ...d, uploaded: true } : d);
      return {
        ...prev,
        docs,
      };
    },
  },
  // 8: Move and Click Checkbox for Row 3
  {
    targetX: "4.5%",
    targetY: "69%",
    opacity: 1,
    duration: 600,
    holdTime: 1200,
    click: true,
    activeTextStep: 2, // "Mark items done"
    stateUpdate: (prev) => {
      const docs = prev.docs.map((d, i) => i === 2 ? { ...d, checked: true } : d);
      return {
        ...prev,
        docs,
        progress: 100,
      };
    },
  },
  // 9: Show Submission Guide (cursor fades out)
  {
    targetX: "50%",
    targetY: "50%",
    opacity: 0,
    duration: 400,
    holdTime: 1800,
    activeTextStep: 2, // "Mark items done"
    stateUpdate: (prev) => ({
      ...prev,
      showGuide: true,
      activeDocIndex: -1,
    }),
  },
  // 10: Move and Click ZIP Button (cursor fades back in and clicks)
  {
    targetX: "33.5%",
    targetY: "30%",
    opacity: 1,
    duration: 850,
    holdTime: 2500,
    click: true,
    activeTextStep: 3, // "Download as ZIP"
    stateUpdate: (prev) => ({
      ...prev,
      zipClicked: true,
    }),
  },
  // 11: End Fade Out / Reset Wait
  {
    targetX: "33.5%",
    targetY: "30%",
    opacity: 0,
    duration: 400,
    holdTime: 1500,
    activeTextStep: null,
  },
];

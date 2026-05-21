/**
 * useFormState.ts
 *
 * Custom hook — owns every piece of state and derived data for the Visa Form
 * Fill Helper. Keeps VisaFormWidget.tsx as a pure layout shell.
 *
 * Returns a single object so callers can destructure only what they need.
 */

import { useState, useEffect, useRef } from "react";
import type { DocumentItem } from "@/types/document";
import { getFormFillFields } from "../../../lib/data/repository";
import type { FormFillField } from "../../../lib/data/repository";
import {
  filterFields,
  groupFieldsBySection,
  getInitialCollapsedSections,
  toggleSection as toggleSectionPure,
  toggleDone as toggleDonePure,
  getProgressStats,
  isDownloadableForm,
  copyExample as copyExamplePure,
} from "@/features/documents/visa_form/formService";
import type { SectionMap } from "@/features/documents/visa_form/formService";

export interface FormState {
  // Data
  allFields: FormFillField[];
  filteredFields: FormFillField[];
  sections: SectionMap;
  activeField: FormFillField | null;

  // Loading
  fieldsLoading: boolean;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;

  // Active field
  activeFieldId: string | null;
  setActiveFieldId: (id: string) => void;

  // Done / progress
  doneFields: Set<string>;
  toggleDone: (id: string) => void;
  totalFields: number;
  doneCount: number;
  donePct: number;
  allDone: boolean;

  // Copy flash
  copiedId: string | null;
  copyExample: (example: string, id: string) => void;

  // UI open/collapsed
  helperOpen: boolean;
  setHelperOpen: React.Dispatch<React.SetStateAction<boolean>>;
  collapsedSections: Set<string>;
  setCollapsedSections: React.Dispatch<React.SetStateAction<Set<string>>>;
  toggleSection: (sectionName: string) => void;

  // Form meta
  isDownloadable: boolean;
}

export function useFormState(doc: DocumentItem): FormState {
  const formInfo = doc.form;
  const isDownloadable = isDownloadableForm(formInfo?.type);

  // ── UI state ────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [doneFields, setDoneFields] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [helperOpen, setHelperOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // ── Data loading (lazy — only when helper is opened) ────────
  const [allFields, setAllFields] = useState<FormFillField[]>([]);
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const [fieldsLoaded, setFieldsLoaded] = useState(false);

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setFieldsLoaded(false);
    setAllFields([]);
    setActiveFieldId(null);
    setSearchQuery("");
    setDoneFields(new Set());
    setFieldsLoading(false);
  }, [formInfo?.formFillDataKey]);

  useEffect(() => {
    if (!helperOpen || fieldsLoaded) return;
    setFieldsLoading(true);
    getFormFillFields(formInfo?.formFillDataKey).then((fields) => {
      setAllFields(fields);
      setFieldsLoading(false);
      setFieldsLoaded(true);
      if (fields.length > 0) {
        setActiveFieldId((curr) => curr || fields[0].id);
        setCollapsedSections(getInitialCollapsedSections(fields));
      }
    });
  }, [helperOpen, formInfo?.formFillDataKey, fieldsLoaded]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const searchRef = useRef<HTMLInputElement>(null);

  // ── Derived ─────────────────────────────────────────────────
  const filteredFields = filterFields(allFields, searchQuery);
  const sections = groupFieldsBySection(filteredFields);
  const activeField = allFields.find((f) => f.id === activeFieldId) ?? null;
  const { totalFields, doneCount, donePct, allDone } = getProgressStats(
    allFields.length,
    doneFields
  );

  // ── Actions ─────────────────────────────────────────────────
  const toggleDone = (id: string) =>
    setDoneFields((prev) => toggleDonePure(prev, id));

  const toggleSection = (sectionName: string) =>
    setCollapsedSections((prev) => toggleSectionPure(prev, sectionName));

  const copyExample = (example: string, id: string) => {
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    navigator.clipboard.writeText(example).catch(() => { });
    setCopiedId(id);
    copyTimeoutRef.current = setTimeout(() => {
      setCopiedId(null);
      copyTimeoutRef.current = null;
    }, 1800);
  };

  return {
    allFields,
    filteredFields,
    sections,
    activeField,
    fieldsLoading,
    searchQuery,
    setSearchQuery,
    searchRef,
    activeFieldId,
    setActiveFieldId,
    doneFields,
    toggleDone,
    totalFields,
    doneCount,
    donePct,
    allDone,
    copiedId,
    copyExample,
    helperOpen,
    setHelperOpen,
    collapsedSections,
    setCollapsedSections,
    toggleSection,
    isDownloadable,
  };
}
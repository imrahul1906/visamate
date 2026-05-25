"use client";

// web\src\features\documents\DocumentsContent.tsx
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApplicant } from "@/lib/context/ApplicantContext";

import { T } from "@/lib/theme";
import type { UploadsMap } from "../../types/document";

import { useDocumentData } from "./hooks/useDocumentData";
import { useDrawerAnimation } from "./hooks/useDrawerAnimation";
import { useKeyboardNav } from "./hooks/useKeyboardNav";

import { DocChecklistStyles } from "./components/DocChecklistStyles";
import { VisaSummaryBar } from "./components/VisaSummaryBar";
import { DocChecklistSidebar } from "./components/DocChecklistSidebar";
import { DocDetailPanel } from "./components/DocDetailPanel";
import { LoadingState, ErrorState } from "./components/DocLoadingStates";
import { SubmissionGuideState } from "./SubmissionGuideState";
import { DocChecklistEmptyState } from "./components/DocChecklistEmptyState";

import { downloadAllFiles } from "./utils/downloadAllFiles";

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

export interface DocumentsContentProps {
  embedded?: boolean;
  country?: string;
  countryName?: string;
  visaType?: string;
  visaTypeName?: string;
  location?: string;
  locationName?: string;
  sponsorship?: string;
  profile?: string;
}

export default function DocumentsContent(props: DocumentsContentProps = {}) {
  const { ctx } = useApplicant();
  const router = useRouter();

  const country = props.country ?? ctx.country ?? "";
  const countryName = props.countryName ?? ctx.countryName ?? props.country ?? ctx.country ?? "—";
  const visaType = props.visaType ?? ctx.visaType ?? "";
  const visaTypeName = props.visaTypeName ?? ctx.visaTypeName ?? "—";
  const location = props.location ?? ctx.vfsCenter ?? "";
  const locationName = props.locationName ?? props.location ?? ctx.vfsCenter ?? "—";
  const sponsorship = props.sponsorship ?? ctx.sponsorshipType ?? "SELF";

  // Derive travelEndDate using date math if travelStartDate and duration are present
  const deriveEndDate = (startDate: string, durationDays: number): string => {
    if (!startDate || !durationDays) return "";
    const d = new Date(startDate + "T00:00:00");
    if (isNaN(d.getTime())) return "";
    d.setDate(d.getDate() + durationDays - 1);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  };

  // ── Sponsor consent prefill — sourced from wizard context / props ──────────
  // These keys mirror SponsorConsentInputs so the widget can pre-populate
  // the letter without a separate input screen.
  const sponsorConsentPrefill: Record<string, string> = {
    destination: countryName !== "—" ? countryName : country,
    sponsorName: ctx.sponsorName || "",
    sponsorCity: ctx.sponsorCity || "",
    sponsorPassport: ctx.sponsorPassport || "",
    sponsorDob: ctx.sponsorDob || "",
    sponsorMobile: ctx.sponsorMobile || "",
    sponsorRelationship: ctx.sponsorRel || "",
    applicantName: ctx.applicantName || "",
    applicantPassport: ctx.passportNo || "",
    applicantDob: ctx.applicantDob || "",
    travelStartDate: ctx.travelStartDate || "",
    travelEndDate: ctx.travelStartDate && ctx.travelDuration ? deriveEndDate(ctx.travelStartDate, ctx.travelDuration) : "",
    travelDuration: ctx.travelDuration ? String(ctx.travelDuration) : "",
    purposeOfVisit: ctx.purpose || "",
    sponsorshipReason: ctx.sponsorshipReason || "",
    sponsorAccompanying: ctx.sponsorAccompanying || "",
  };

  // ── State ─────────────────────────────────────────────────────
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [uploads, setUploads] = useState<UploadsMap>({});
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [isMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );

  // ── Custom hooks ──────────────────────────────────────────────
  const { data, itineraryData, visaTypeData, requirementsData, loading, error } = useDocumentData({
    country, visaType, location, sponsorship,
    countryName, visaTypeName, locationName,
  });

  const { visibleDocId, drawerOpacity, drawerTranslateY } = useDrawerAnimation(activeDocId);

  useKeyboardNav({ data, activeDocId, setActiveDocId });

  // ── Auto-close drawer when all required docs become checked ───
  useEffect(() => {
    if (!data || activeDocId === null) return;
    const allD = data.categories.flatMap(c => c.documents);
    const requiredD = allD.filter(d => d.status === "required");
    if (requiredD.length > 0 && requiredD.every(d => checked[d.id])) {
      setTimeout(() => setActiveDocId(null), 0);
    }
  }, [checked, data, activeDocId]);

  // ── Handlers ──────────────────────────────────────────────────
  const toggleDoc = useCallback((id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleUpload = useCallback((docId: string, file: File) => {
    setUploads(prev => ({ ...prev, [docId]: file }));
  }, []);

  const handleRemove = useCallback((docId: string) => {
    setUploads(prev => { const n = { ...prev }; delete n[docId]; return n; });
  }, []);

  const handleItineraryReady = useCallback((docId: string, file: File) => {
    setUploads(prev => ({ ...prev, [docId]: file }));
  }, []);

  const handleSponsorConsentReady = useCallback((docId: string, file: File) => {
    setUploads(prev => ({ ...prev, [docId]: file }));
  }, []);

  const handleDownloadAll = async () => {
    setDownloadingZip(true);
    const allDocs = data?.categories.flatMap(c => c.documents) ?? [];
    await downloadAllFiles(uploads, allDocs);
    setDownloadingZip(false);
  };

  // ── Derived values ────────────────────────────────────────────
  const allDocs = data?.categories.flatMap(c => c.documents) ?? [];
  const requiredDocs = allDocs.filter(d => d.status === "required");
  const totalDone = allDocs.filter(d => checked[d.id]).length;
  const requiredDone = requiredDocs.filter(d => checked[d.id]).length;
  const overallPct = allDocs.length ? (totalDone / allDocs.length) * 100 : 0;
  const uploadCount = Object.keys(uploads).length;
  const uploadableCount = allDocs.filter(d => !d.noUpload).length;

  const activeDocIndex = allDocs.findIndex(d => d.id === activeDocId);
  const visibleDoc = allDocs.find(d => d.id === visibleDocId) ?? null;
  const activeCategory = visibleDoc
    ? data?.categories.find(c => c.documents.some(d => d.id === visibleDoc.id))
    : null;

  // ── Resolve photo spec for the active doc ─────────────────────
  // visibleDoc.photoSpecRef (e.g. "default") is now carried through by
  // mapRequirements, so we can look it up directly in requirementsData.
  const photoSpec = visibleDoc?.photoSpecRef && requirementsData?.photoSpecifications
    ? (requirementsData.photoSpecifications[visibleDoc.photoSpecRef] ?? null)
    : null;

  const drawerOpen = activeDocId !== null;
  const leftWidth = isMobile ? "100%" : "340px";
  const embedded = !!props.embedded;

  // ── Early returns ─────────────────────────────────────────────
  if (loading) return <LoadingState embedded={embedded} />;
  if (error) return <ErrorState embedded={embedded} error={error} onGoBack={() => router.push("/wizard")} />;

  // ── Main render ───────────────────────────────────────────────
  return (
    <div style={{
      background: "transparent",
      paddingTop: embedded ? 0 : 72,
      paddingBottom: 80,
      ...(embedded
        ? { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }
        : { minHeight: "calc(100vh - 56px)" }),
    }}>
      <DocChecklistStyles />

      <div style={{
        width: "100%",
        maxWidth: embedded ? "1400px" : "1200px",
        margin: "0 auto",
        padding: embedded ? "0 32px" : "0 16px",
      }}>

        {/* Back button */}
        {!embedded && (
          <button className="vm-back-btn" onClick={() => router.push("/wizard")}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Edit selections
          </button>
        )}

        {/* ── Visa Overview Strip (replaces old header + stat cards) ── */}
        <VisaSummaryBar
          embedded={embedded}
          countryName={countryName}
          visaTypeName={visaTypeName}
          locationName={locationName}
          locationCode={location}
          totalDone={totalDone}
          totalDocs={allDocs.length}
          requiredDone={requiredDone}
          requiredTotal={requiredDocs.length}
          uploadCount={uploadCount}
          uploadableCount={uploadableCount}
          downloadingZip={downloadingZip}
          onDownloadAll={handleDownloadAll}
          visaType={visaTypeData}
          processingDays={requirementsData?.processingDays ?? null}
        />

        {/* Two-panel shell */}
        <div
          className="vm-two-panel"
          style={{
            display: "flex",
            gap: 0,
            width: "100%",
            minHeight: embedded ? 560 : "calc(100vh - 340px)",
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            border: `1px solid ${T.border}`,
            background: T.surface,
            isolation: "isolate",
          }}
        >
          {/* LEFT PANEL — Checklist */}
          <div
            className="vm-left-panel"
            style={{
              width: leftWidth,
              flexShrink: 0,
              borderRight: `1px solid ${T.border}`,
              display: isMobile && drawerOpen ? "none" : "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {data && (
              <DocChecklistSidebar
                data={data}
                activeDocId={activeDocId}
                checked={checked}
                uploads={uploads}
                totalDone={totalDone}
                totalDocs={allDocs.length}
                overallPct={overallPct}
                uploadCount={uploadCount}
                uploadableCount={uploadableCount}
                onSelectDoc={setActiveDocId}
                onToggleDoc={toggleDoc}
                onDownloadAll={handleDownloadAll}
              />
            )}
          </div>

          {/* RIGHT PANEL — Focus Drawer or Welcome State */}
          <div
            className={isMobile && drawerOpen ? "vm-right-panel-overlay" : ""}
            style={{
              flex: 1,
              minWidth: 0,
              minHeight: embedded ? 560 : "calc(100vh - 340px)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              background: isMobile && drawerOpen ? T.surface : "transparent",
            }}
          >
            {!visibleDoc ? (
              requiredDone === requiredDocs.length && requiredDocs.length > 0 ? (
                <SubmissionGuideState
                  countryName={countryName}
                  visaTypeName={visaTypeName}
                  importantNotes={
                    (requirementsData?.importantNotes as string[] | undefined) ?? []
                  }
                />
              ) : (
                <DocChecklistEmptyState
                  totalDocs={allDocs.length}
                  requiredTotal={requiredDocs.length}
                  visaTypeName={visaTypeName}
                  countryName={countryName}
                  isOnline={visaTypeData?.process?.default?.applicationMode === "ONLINE"}
                />
              )
            ) : (
              <DocDetailPanel
                visibleDoc={visibleDoc}
                activeCategory={activeCategory}
                uploads={uploads}
                activeDocIndex={activeDocIndex}
                totalDocs={allDocs.length}
                isMobile={isMobile}
                drawerOpacity={drawerOpacity}
                drawerTranslateY={drawerTranslateY}
                itineraryData={itineraryData}
                photoSpec={photoSpec}
                onClose={() => setActiveDocId(null)}
                onUpload={(file) => handleUpload(visibleDoc.id, file)}
                onRemove={() => handleRemove(visibleDoc.id)}
                onItineraryReady={(file) => handleItineraryReady(visibleDoc.id, file)}
                onCoverLetterReady={(file) => handleUpload(visibleDoc.id, file)}
                onSponsorConsentReady={(file) => handleSponsorConsentReady(visibleDoc.id, file)}
                sponsorConsentPrefill={sponsorConsentPrefill}
                isOnline={visaTypeData?.process?.default?.applicationMode === "ONLINE"}
                onPrev={() => {
                  const prev = allDocs[activeDocIndex - 1];
                  if (prev) setActiveDocId(prev.id);
                }}
                onNext={() => {
                  const next = allDocs[activeDocIndex + 1];
                  if (next) setActiveDocId(next.id);
                }}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
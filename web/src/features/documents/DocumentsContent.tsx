"use client";

// web\src\features\documents\DocumentsContent.tsx
import { useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { T } from "@/components/shared/theme";
import type { UploadsMap } from "../../types/document";

import { useDocumentData } from "./hooks/useDocumentData";
import { useDrawerAnimation } from "./hooks/useDrawerAnimation";
import { useKeyboardNav } from "./hooks/useKeyboardNav";

import { DocumentsStyles } from "./components/DocumentsStyles";
import { DocumentsHeader } from "./components/DocumentsHeader";
import { StatStrip } from "./components/StatStrip";
import { UploadProgressBanner } from "./components/UploadProgressBanner";
import { CompletionBanner } from "./components/CompletionBanner";
import { ChecklistPanel } from "./components/ChecklistPanel";
import { FocusDrawer } from "./components/FocusDrawer";
import { LoadingState, ErrorState } from "./components/StatusStates";
import VisaOverviewPanel from "./visa_overview/VisaOverviewPanel";

import { downloadAllFiles } from "./util/downloadAllFiles";

// ─────────────────────────────────────────────────────────────
// Props — all optional. When provided they take priority over
// URL search-params, so the component works both as a standalone
// page AND embedded inside WizardAccordion without navigation.
// ─────────────────────────────────────────────────────────────

export interface DocumentsContentProps {
  /** When truthy the "Edit selections" back-button is hidden */
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
  const params = useSearchParams();
  const router = useRouter();

  // ── Resolve params — prefer injected props, fall back to URL ──
  const country      = props.country      ?? params.get("country")      ?? "";
  const countryName  = props.countryName  ?? params.get("countryName")  ?? params.get("country")  ?? "—";
  const visaType     = props.visaType     ?? params.get("visaType")     ?? "";
  const visaTypeName = props.visaTypeName ?? params.get("visaTypeName") ?? params.get("visaType") ?? "—";
  const location     = props.location     ?? params.get("location")     ?? "";
  const locationName = props.locationName ?? params.get("locationName") ?? params.get("location") ?? "—";
  const sponsorship  = props.sponsorship  ?? params.get("sponsorship")  ?? "SELF";

  // ── State ─────────────────────────────────────────────────────
  const [checked, setChecked]             = useState<Record<string, boolean>>({});
  const [uploads, setUploads]             = useState<UploadsMap>({});
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [activeDocId, setActiveDocId]     = useState<string | null>(null);
  const [isMobile]                        = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );

  // ── Custom hooks ──────────────────────────────────────────────
  const { data, itineraryData, visaTypeData, loading, error } = useDocumentData({
    country, visaType, location, sponsorship,
    countryName, visaTypeName, locationName,
  });

  const { visibleDocId, drawerOpacity, drawerTranslateY } = useDrawerAnimation(activeDocId);

  useKeyboardNav({ data, activeDocId, setActiveDocId });

  // ── Handlers ──────────────────────────────────────────────────
  const toggleDoc = useCallback((id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleDocAndAdvance = useCallback((id: string) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id] && data) {
        const allD = data.categories.flatMap(c => c.documents);
        const currentIdx = allD.findIndex(d => d.id === id);
        const nextDoc = allD.slice(currentIdx + 1).find(d => !next[d.id] && d.status === "required");
        if (nextDoc) setTimeout(() => setActiveDocId(nextDoc.id), 0);
      }
      return next;
    });
  }, [data]);

  const handleUpload = useCallback((docId: string, file: File) => {
    setUploads(prev => ({ ...prev, [docId]: file }));
  }, []);

  const handleRemove = useCallback((docId: string) => {
    setUploads(prev => { const n = { ...prev }; delete n[docId]; return n; });
  }, []);

  const handleItineraryReady = useCallback((docId: string, file: File) => {
    setUploads(prev => ({ ...prev, [docId]: file }));
  }, []);

  const handleDownloadAll = async () => {
    setDownloadingZip(true);
    const allDocs = data?.categories.flatMap(c => c.documents) ?? [];
    await downloadAllFiles(uploads, allDocs);
    setDownloadingZip(false);
  };

  // ── Derived values ────────────────────────────────────────────
  const allDocs        = data?.categories.flatMap(c => c.documents) ?? [];
  const requiredDocs   = allDocs.filter(d => d.status === "required");
  const totalDone      = allDocs.filter(d => checked[d.id]).length;
  const requiredDone   = requiredDocs.filter(d => checked[d.id]).length;
  const overallPct     = allDocs.length ? (totalDone / allDocs.length) * 100 : 0;
  const uploadCount    = Object.keys(uploads).length;
  const uploadableCount = allDocs.filter(d => !d.noUpload).length;

  const activeDocIndex = allDocs.findIndex(d => d.id === activeDocId);
  const visibleDoc     = allDocs.find(d => d.id === visibleDocId) ?? null;
  const activeCategory = visibleDoc
    ? data?.categories.find(c => c.documents.some(d => d.id === visibleDoc.id))
    : null;

  const drawerOpen = activeDocId !== null;
  const leftWidth  = isMobile ? "100%" : "340px";
  const embedded   = !!props.embedded;

  // ── Early returns ─────────────────────────────────────────────
  if (loading) return <LoadingState embedded={embedded} />;
  if (error)   return <ErrorState embedded={embedded} error={error} onGoBack={() => router.push("/wizard")} />;

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
      <DocumentsStyles />

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

        {/* Hero header */}
        <DocumentsHeader
          embedded={embedded}
          countryName={countryName}
          visaTypeName={visaTypeName}
          locationName={locationName}
          totalDone={totalDone}
          totalDocs={allDocs.length}
          requiredDone={requiredDone}
          requiredTotal={requiredDocs.length}
          uploadCount={uploadCount}
          uploadableCount={uploadableCount}
          downloadingZip={downloadingZip}
          onDownloadAll={handleDownloadAll}
        />

        {/* Stat strip */}
        <StatStrip
          requiredCount={requiredDocs.length}
          optionalCount={allDocs.length - requiredDocs.length}
          uploadCount={uploadCount}
        />

        {/* Upload progress banner */}
        <UploadProgressBanner
          uploadCount={uploadCount}
          uploadableCount={uploadableCount}
          onDownloadAll={handleDownloadAll}
        />

        {/* Completion banner */}
        <CompletionBanner requiredDone={requiredDone} requiredTotal={requiredDocs.length} />

        {/* Two-panel shell */}
        <div
          className="vm-two-panel"
          style={{
            display: "flex",
            gap: 0,
            width: "100%",
            minHeight: embedded ? 560 : "calc(100vh - 420px)",
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            border: `1px solid ${T.border}`,
            background: T.surface,
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
              <ChecklistPanel
                data={data}
                activeDocId={activeDocId}
                checked={checked}
                uploads={uploads}
                totalDone={totalDone}
                totalDocs={allDocs.length}
                overallPct={overallPct}
                onSelectDoc={setActiveDocId}
                onToggleDoc={toggleDoc}
              />
            )}
          </div>

          {/* RIGHT PANEL — Focus Drawer */}
          <div
            className={isMobile && drawerOpen ? "vm-right-panel-overlay" : ""}
            style={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              background: isMobile && drawerOpen ? T.surface : "transparent",
            }}
          >
            {!visibleDoc ? (
              <VisaOverviewPanel
                visaType={visaTypeData}
                countryName={countryName}
                visaTypeName={visaTypeName}
              />
            ) : (
              <FocusDrawer
                visibleDoc={visibleDoc}
                activeCategory={activeCategory}
                checked={checked}
                uploads={uploads}
                activeDocIndex={activeDocIndex}
                totalDocs={allDocs.length}
                isMobile={isMobile}
                drawerOpacity={drawerOpacity}
                drawerTranslateY={drawerTranslateY}
                itineraryData={itineraryData}
                onClose={() => setActiveDocId(null)}
                onToggleDone={toggleDocAndAdvance}
                onUpload={(file) => handleUpload(visibleDoc.id, file)}
                onRemove={() => handleRemove(visibleDoc.id)}
                onItineraryReady={(file) => handleItineraryReady(visibleDoc.id, file)}
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

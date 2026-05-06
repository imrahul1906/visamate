"use client";

// app/documents/DocumentsContent.tsx
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getRequirementsData, getItineraryPlaces } from "@/lib/data/repository";
import type { ItineraryPlacesData } from "@/lib/data/types";

import type { DocumentData, UploadsMap } from "./types";
import { mapRequirementsToDocumentData } from "./mapRequirements";
import { downloadAllFiles } from "./downloadAllFiles";
import CategorySection from "./CategorySection";

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────

export default function DocumentsContent() {
  const params = useSearchParams();
  const router = useRouter();

  const country      = params.get("country")      ?? "";
  const countryName  = params.get("countryName")  ?? params.get("country") ?? "—";
  const visaType     = params.get("visaType")     ?? "";
  const visaTypeName = params.get("visaTypeName") ?? params.get("visaType") ?? "—";
  const location     = params.get("location")     ?? "";
  const locationName = params.get("locationName") ?? params.get("location") ?? "—";
  const sponsorship  = params.get("sponsorship")  ?? "SELF";
  const profile      = params.get("profile")      ?? "";

  const [data, setData]                       = useState<DocumentData | null>(null);
  const [itineraryData, setItineraryData]     = useState<ItineraryPlacesData | null>(null);
  const [checked, setChecked]                 = useState<Record<string, boolean>>({});
  const [uploads, setUploads]                 = useState<UploadsMap>({});
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip]   = useState(false);

  // ── Data fetching ────────────────────────────────────────────
  useEffect(() => {
    if (!country || !visaType || !location) {
      setError("Missing required URL parameters (country, visaType, location).");
      setLoading(false);
      return;
    }

    // Fetch requirements and itinerary places in parallel
    Promise.all([
      getRequirementsData(country, visaType, location),
      getItineraryPlaces(country),
    ])
      .then(([req, itin]) => {
        if (!req) {
          setError(`No requirements found for ${countryName} · ${visaTypeName} · ${locationName}.`);
          setLoading(false);
          return;
        }
        setData(mapRequirementsToDocumentData(req, countryName, visaTypeName, locationName, sponsorship));
        setItineraryData(itin);   // null is fine — widget simply won't render
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load document requirements.");
        setLoading(false);
      });
  }, [country, visaType, location, sponsorship, countryName, visaTypeName, locationName]);

  // ── Handlers ────────────────────────────────────────────────
  const toggleDoc = (id: string) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

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

  // ── Derived stats ────────────────────────────────────────────
  const allDocs         = data?.categories.flatMap(c => c.documents) ?? [];
  const requiredDocs    = allDocs.filter(d => d.status === "required");
  const totalDone       = allDocs.filter(d => checked[d.id]).length;
  const requiredDone    = requiredDocs.filter(d => checked[d.id]).length;
  const overallPct      = allDocs.length ? (totalDone / allDocs.length) * 100 : 0;
  const uploadCount     = Object.keys(uploads).length;
  const uploadableCount = allDocs.filter(d => !d.noUpload).length;

  // ── Loading state ────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "calc(100vh - 56px)", background: "#f8f7f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #e5e7eb", borderTopColor: "#6366f1", margin: "0 auto 16px", animation: "spin 0.7s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: 13, color: "#9ca3af" }}>Loading your document checklist…</p>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ minHeight: "calc(100vh - 56px)", background: "#f8f7f4", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #fecaca", padding: "28px 24px", maxWidth: 400, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: "0 0 8px" }}>Could not load documents</p>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>{error}</p>
          <button onClick={() => router.push("/wizard")} style={{ fontSize: 13, fontWeight: 600, color: "#fff", background: "#6366f1", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer" }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ──────────────────────────────────────────────
  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "#f8f7f4", paddingTop: 72, paddingBottom: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
      `}</style>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px" }}>

        {/* ── Back ── */}
        <button
          onClick={() => router.push("/wizard")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 500, color: "#6b7280", padding: "0 0 20px", transition: "color 150ms ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#111827")}
          onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Edit selections
        </button>

        {/* ── Hero ── */}
        <div style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)",
          borderRadius: 20, padding: "28px 28px 24px", marginBottom: 20,
          position: "relative", overflow: "hidden",
        }}>
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {[
                { icon: "🌏", label: countryName },
                { icon: "📋", label: visaTypeName },
                { icon: "📍", label: locationName },
              ].map(({ icon, label }) => (
                <span key={label} style={{
                  fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)",
                  background: "rgba(255,255,255,0.1)", padding: "3px 10px", borderRadius: 20,
                  display: "flex", alignItems: "center", gap: 4, backdropFilter: "blur(4px)",
                }}>
                  {icon} {label}
                </span>
              ))}
            </div>

            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400, color: "#fff", margin: "0 0 6px", lineHeight: 1.2 }}>
              Your Document Checklist
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 20px", lineHeight: 1.5 }}>
              {allDocs.length} documents for your {visaTypeName} to {countryName}
            </p>

            {/* Progress bar */}
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px", backdropFilter: "blur(4px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>Overall Progress</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc" }}>{totalDone} / {allDocs.length} ready</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${overallPct}%`, background: "linear-gradient(90deg, #818cf8, #a5b4fc)", borderRadius: 3, transition: "width 500ms ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                  ✅ {requiredDone}/{requiredDocs.length} required · 📎 {uploadCount}/{uploadableCount} uploaded
                </span>
                {uploadCount > 0 && (
                  <button
                    onClick={handleDownloadAll}
                    disabled={downloadingZip}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: downloadingZip ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.18)",
                      color: "#fff", border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: 9, padding: "6px 14px", cursor: downloadingZip ? "default" : "pointer",
                      fontSize: 11, fontWeight: 700, backdropFilter: "blur(4px)",
                      transition: "all 200ms",
                    }}
                  >
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    {downloadingZip ? "Preparing…" : `Download All (${uploadCount})`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Upload progress bar ── */}
        {uploadCount > 0 && (
          <div style={{
            background: "#fff", borderRadius: 12, border: "1.5px solid #dcfce7",
            padding: "12px 16px", marginBottom: 16,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, background: "#dcfce7",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: 16 }}>📁</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>Document Folder Ready</span>
                <span style={{ fontSize: 11, color: "#6b7280" }}>{uploadCount} of {uploadableCount} uploaded</span>
              </div>
              <div style={{ height: 4, background: "#f1f5f9", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(uploadCount / uploadableCount) * 100}%`, background: "linear-gradient(90deg, #22c55e, #16a34a)", borderRadius: 2, transition: "width 400ms ease" }} />
              </div>
            </div>
            <button
              onClick={handleDownloadAll}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#16a34a", color: "#fff", border: "none",
                borderRadius: 8, padding: "7px 14px", cursor: "pointer",
                fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}
            >
              <svg width="12" height="12" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download ZIP
            </button>
          </div>
        )}

        {/* ── Completion banner ── */}
        {requiredDone === requiredDocs.length && requiredDocs.length > 0 && (
          <div style={{
            background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", border: "1.5px solid #6ee7b7",
            borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 20,
          }}>
            <span style={{ fontSize: 20 }}>🎉</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#065f46", margin: 0 }}>All required documents ready!</p>
              <p style={{ fontSize: 12, color: "#047857", margin: "2px 0 0" }}>You're ready to submit your visa application.</p>
            </div>
          </div>
        )}

        {/* ── Stat cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Required", value: requiredDocs.length,                    color: "#6366f1", bg: "#eef2ff" },
            { label: "Optional", value: allDocs.length - requiredDocs.length,   color: "#9ca3af", bg: "#f9fafb" },
            { label: "Uploaded", value: uploadCount,                             color: "#16a34a", bg: "#f0fdf4" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "14px 16px", border: `1px solid ${s.color}20` }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Categories — itineraryData threaded down ── */}
        {data?.categories.map((cat, ci) => {
          const delay = ci * (cat.documents.length * 60 + 80);
          return (
            <CategorySection
              key={cat.id}
              category={cat}
              checked={checked}
              onToggle={toggleDoc}
              startDelay={delay}
              uploads={uploads}
              onUpload={handleUpload}
              onRemove={handleRemove}
              onItineraryReady={handleItineraryReady}
              itineraryData={itineraryData}
            />
          );
        })}

        {/* ── Footer tip ── */}
        <div style={{
          background: "#fff", borderRadius: 14, border: "1.5px solid #f1f1ef",
          padding: "16px 18px", display: "flex", gap: 12, alignItems: "flex-start",
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 18 }}>💡</span>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#92400e", margin: "0 0 4px" }}>Pro Tip</p>
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
              All photocopies must be on A4 size only. The Embassy may request additional documentation depending on personal circumstances. Documents submitted will not be returned except for the passport. Upload digital copies above to create a ready-to-send document folder.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
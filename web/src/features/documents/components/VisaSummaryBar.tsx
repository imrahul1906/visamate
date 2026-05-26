"use client";

// VisaOverviewStrip.tsx

import React, { useEffect } from "react";
import type { VisaType } from "@/lib/data/types";

import { OverviewFeeBreakdown } from "../visa_overview/OverviewFeeBreakdown";
import { OverviewPaymentCard } from "../visa_overview/OverviewPaymentCard";
import { useOverviewData } from "../visa_overview/useOverviewData";

interface VisaOverviewStripProps {
  embedded: boolean;
  countryName: string;
  visaTypeName: string;
  locationName: string;
  locationCode?: string;
  totalDocs: number;
  totalDone?: number;
  requiredDone: number;
  requiredTotal: number;
  uploadCount: number;
  uploadableCount: number;
  downloadingZip: boolean;
  onDownloadAll: () => void;
  visaType: VisaType | null;
  /** Processing time string from RequirementsData (e.g. "Minimum 6 working days") */
  processingDays?: string | number | null;
  activePopover: "money" | "time" | "biometrics" | "interview" | "vfs" | null;
  onActivePopoverChange: (popover: "money" | "time" | "biometrics" | "interview" | "vfs" | null) => void;
}



// ─── Info Tile Component ───────────────────────────────────────────────────

interface InfoTileProps {
  label: string;
  value: string;
  /** "money" | "time" | "ok" | "warn" | "neutral" */
  variant: "money" | "time" | "ok" | "warn" | "neutral";
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  dimmed?: boolean;
}

const TILE_COLORS = {
  money: {
    bg: "var(--vm-tile-money-bg)",
    border: "var(--vm-tile-money-border)",
    label: "var(--vm-tile-money-label)",
    value: "var(--vm-tile-money-val)",
  },
  time: {
    bg: "var(--vm-tile-time-bg)",
    border: "var(--vm-tile-time-border)",
    label: "var(--vm-tile-time-label)",
    value: "var(--vm-tile-time-val)",
  },
  ok: {
    bg: "var(--vm-tile-ok-bg)",
    border: "var(--vm-tile-ok-border)",
    label: "var(--vm-tile-ok-label)",
    value: "var(--vm-tile-ok-val)",
  },
  warn: {
    bg: "var(--vm-tile-warn-bg)",
    border: "var(--vm-tile-warn-border)",
    label: "var(--vm-tile-warn-label)",
    value: "var(--vm-tile-warn-val)",
  },
  neutral: {
    bg: "var(--vm-tile-neutral-bg)",
    border: "var(--vm-tile-neutral-border)",
    label: "var(--vm-tile-neutral-label)",
    value: "var(--vm-tile-neutral-val)",
  },
};

function InfoTile({ label, value, variant, icon, onClick, active, dimmed }: InfoTileProps) {
  const c = TILE_COLORS[variant];
  return (
    <div
      className={`vm-info-tile vm-tile-${variant} ${active ? "vm-active" : ""} ${dimmed ? "vm-dimmed" : ""}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {/* Option 4 rotating border trace glow layer */}
      <div className="vm-tile-border-glow" />

      {/* Option 4 left accent border line */}
      <div className={`vm-tile-accent-line vm-accent-${variant}`} />

      {/* Soft glass shine glow overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* SVG Border Outline Trace on Hover / Active */}
      <svg className="vm-tile-hover-border" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 4 }}>
        <rect
          className="vm-tile-hover-rect"
          style={{
            x: "0.5px",
            y: "0.5px",
            width: "calc(100% - 1px)",
            height: "calc(100% - 1px)",
            rx: "6px",
            ry: "6px",
            fill: "none",
            strokeWidth: "1.5px",
          }}
          pathLength="100"
        />
      </svg>

      {/* Content wrapper covering the middle */}
      <div className="vm-tile-content-cover">
        {/* Icon */}
        <span style={{
          color: c.value,
          display: "flex",
          flexShrink: 0,
          opacity: 0.9,
          zIndex: 1,
          position: "relative",
        }}>
          {icon}
        </span>

        {/* Stacked Label & Value Typography */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1px",
          fontSize: "11px",
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: "nowrap",
          zIndex: 1,
          position: "relative",
        }}>
          <span style={{ 
            color: "var(--vm-muted)", 
            fontWeight: 700, 
            textTransform: "uppercase", 
            letterSpacing: "0.06em", 
            fontSize: "8.5px",
            opacity: 0.85
          }}>
            {label}
          </span>
          <span style={{ 
            color: c.value, 
            fontWeight: 600,
            fontSize: "12px",
            letterSpacing: "-0.01em"
          }}>
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Popover Wrapper Component ──────────────────────────────────────────────

function PopoverWrapper({
  children,
  align = "left",
  isOpen = false,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  isOpen?: boolean;
}) {
  return (
    <div
      className={`vsp-popover-card ${isOpen ? "vm-open" : ""}`}
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        [align]: 0,
        width: "min(380px, 88vw)",
        background: "rgba(var(--vm-surface-rgb, 19, 19, 42), 0.94)",
        backdropFilter: "blur(24px) saturate(190%)",
        WebkitBackdropFilter: "blur(24px) saturate(190%)",
        border: "1px solid var(--vm-border)",
        borderRadius: 16,
        boxShadow: "rgba(0, 0, 0, 0.22) 0px 16px 40px, rgba(255, 255, 255, 0.08) 0px 0px 0px 1px inset",
        zIndex: 9991,
        overflow: "visible", // Allows speech pointer tail to show
        
        // Premium liquid animations & GPU acceleration
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0) scale(1)" : "translateY(16px) scale(0.92)",
        transformOrigin: align === "left" ? "29px 0" : "calc(100% - 29px) 0",
        visibility: isOpen ? "visible" : "hidden",
        pointerEvents: isOpen ? "auto" : "none",
        willChange: "transform, opacity",
        transition: isOpen
          ? "opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 380ms cubic-bezier(0.16, 1, 0.3, 1)"
          : "opacity 220ms cubic-bezier(0.16, 1, 0.3, 1), transform 240ms cubic-bezier(0.25, 1, 0.5, 1), visibility 0s 240ms",
      }}
    >
      
      {/* Speech Bubble Caret/Tail */}
      <div style={{
        position: "absolute",
        top: "-6px",
        [align === "left" ? "left" : "right"]: "24px",
        width: "10px",
        height: "10px",
        background: "rgba(var(--vm-surface-rgb, 19, 19, 42), 0.94)",
        borderLeft: "1px solid var(--vm-border)",
        borderTop: "1px solid var(--vm-border)",
        transform: "rotate(45deg)",
        zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Strip ─────────────────────────────────────────────────────────────────

export function VisaSummaryBar({
  embedded,
  countryName,
  visaTypeName,
  locationName,
  locationCode,
  visaType,
  processingDays,
  activePopover,
  onActivePopoverChange,
}: VisaOverviewStripProps) {


  useEffect(() => {
    if (!activePopover) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const insideTile = target.closest(".vm-info-tile");
      const insidePopover = target.closest(".vsp-popover-card");

      if (!insideTile && !insidePopover) {
        onActivePopoverChange(null);
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [activePopover, onActivePopoverChange]);

  const { 
    currency, hasFees, totalMin, totalMax, processFlags, courierFee,
    visaFeeRefundable, serviceChargeRefundable, paymentInstructions 
  } = useOverviewData(visaType ?? ({} as VisaType), locationCode);

  const fees = visaType?.fees;
  const isOnline = visaType?.process?.default?.applicationMode === "ONLINE";
  const isAnyActive = activePopover !== null;

  // Total fee string — prefer totalMin/Max (includes VFS), fall back to base fee
  const totalFeeStr = (() => {
    if (totalMin != null && totalMax != null && totalMin !== totalMax)
      return `${currency} ${totalMin.toLocaleString()}–${totalMax.toLocaleString()}`;
    if (totalMin != null) return `${currency} ${totalMin.toLocaleString()}`;
    if (fees != null) return `${currency} ${fees.toLocaleString()}`;
    return null;
  })();

  // Pull specific flags
  const flagMap = Object.fromEntries(
    (processFlags ?? []).map(f => [f.label.toLowerCase(), f.required])
  );
  const biometricsRequired = flagMap["biometrics"] ?? flagMap["biometric"] ?? null;
  const interviewRequired = flagMap["interview"] ?? null;
  const vfsRequired = flagMap["vfs appointment"] ?? flagMap["vfs"] ?? flagMap["in-person"] ?? null;

  return (
    <>
      <style>{`
        .vm-info-tile {
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 6px; /* Option 4 crisp border-radius */
          padding: 6px 14px 6px 15px; /* Leave space on left for accent line */
          flex-shrink: 0;
          cursor: pointer;
          position: relative;
          overflow: hidden;

          /* Subtle border-box + padding-box background setup */
          border: 1px solid transparent;
          background: linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.45)) padding-box,
                      linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.06)) border-box;

          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          outline: none !important;
          min-width: 140px; /* Centered, compact, non-stretching width */

          /* GPU hardware layers to completely eliminate layout redrawing flashes */
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
          -webkit-transform: translate3d(0, 0, 0);

          /* Clean, blink-free transitions */
          transition: background 240ms ease, opacity 240ms ease;
          will-change: background, opacity;
        }

        .light .vm-info-tile {
          box-shadow: 0 4px 10px rgba(30, 27, 75, 0.02), 0 1px 2px rgba(30, 27, 75, 0.01);
          transition: background 240ms ease, border-color 240ms ease, box-shadow 240ms ease, transform 240ms ease;
        }

        .light .vm-info-tile.vm-tile-money {
          background: linear-gradient(var(--vm-tile-money-bg-glass), var(--vm-tile-money-bg-glass)) padding-box,
                      linear-gradient(90deg, var(--vm-tile-money-border), var(--vm-tile-money-border)) border-box;
        }
        .light .vm-info-tile.vm-tile-time {
          background: linear-gradient(var(--vm-tile-time-bg-glass), var(--vm-tile-time-bg-glass)) padding-box,
                      linear-gradient(90deg, var(--vm-tile-time-border), var(--vm-tile-time-border)) border-box;
        }
        .light .vm-info-tile.vm-tile-ok {
          background: linear-gradient(var(--vm-tile-ok-bg-glass), var(--vm-tile-ok-bg-glass)) padding-box,
                      linear-gradient(90deg, var(--vm-tile-ok-border), var(--vm-tile-ok-border)) border-box;
        }
        .light .vm-info-tile.vm-tile-warn {
          background: linear-gradient(var(--vm-tile-warn-bg-glass), var(--vm-tile-warn-bg-glass)) padding-box,
                      linear-gradient(90deg, var(--vm-tile-warn-border), var(--vm-tile-warn-border)) border-box;
        }
        .light .vm-info-tile.vm-tile-neutral {
          background: linear-gradient(var(--vm-tile-neutral-bg-glass), var(--vm-tile-neutral-bg-glass)) padding-box,
                      linear-gradient(90deg, var(--vm-tile-neutral-border), var(--vm-tile-neutral-border)) border-box;
        }

        /* 2-Column layout for contents: Left Icon, Right Text Column */
        .vm-tile-content-cover {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 2;
        }

        /* Accent bar along the left edge */
        .vm-tile-accent-line {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          transition: transform 200ms ease, opacity 200ms ease;
          z-index: 2;
        }

        .vm-accent-money { background: var(--vm-tile-money-val); }
        .vm-accent-time { background: var(--vm-tile-time-val); }
        .vm-accent-ok { background: var(--vm-tile-ok-val); }
        .vm-accent-warn { background: var(--vm-tile-warn-val); }
        .vm-accent-neutral { background: var(--vm-tile-neutral-val); }

        /* Tactile Press (Click Down) - instant feedback without layout shift or blinking */
        .vm-info-tile:active {
          transform: scale(0.97) !important;
          transition: transform 80ms cubic-bezier(0.25, 1, 0.5, 1) !important;
        }

        /* Sibling Dimming Focus Mode - pure opacity opacity, no filter/transform to prevent flashes */
        .vm-info-tile.vm-dimmed {
          opacity: 0.5;
        }
        
        .vm-info-tile.vm-dimmed:hover {
          opacity: 0.85;
        }

        /* SVG Border Drawing styles */
        .vm-tile-hover-rect {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          transition: stroke-dashoffset 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .vm-info-tile.vm-tile-money .vm-tile-hover-rect { stroke: var(--vm-tile-money-val); }
        .vm-info-tile.vm-tile-time .vm-tile-hover-rect { stroke: var(--vm-tile-time-val); }
        .vm-info-tile.vm-tile-ok .vm-tile-hover-rect { stroke: var(--vm-tile-ok-val); }
        .vm-info-tile.vm-tile-warn .vm-tile-hover-rect { stroke: var(--vm-tile-warn-val); }
        .vm-info-tile.vm-tile-neutral .vm-tile-hover-rect { stroke: var(--vm-tile-neutral-val); }

        .vm-info-tile:hover .vm-tile-hover-rect,
        .vm-info-tile.vm-active .vm-tile-hover-rect {
          stroke-dashoffset: 0;
        }

        /* Static hover highlight overlays (soft tint) */
        .vm-info-tile.vm-tile-money:hover {
          background: linear-gradient(rgba(232, 201, 122, 0.08), rgba(232, 201, 122, 0.08)) padding-box,
                      linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.06)) border-box;
        }
        .light .vm-info-tile.vm-tile-money:hover {
          background: linear-gradient(var(--vm-tile-money-bg-glass-hover), var(--vm-tile-money-bg-glass-hover)) padding-box,
                      linear-gradient(90deg, var(--vm-tile-money-val), var(--vm-tile-money-val)) border-box;
          box-shadow: 0 6px 16px rgba(180, 130, 30, 0.09), 0 2px 4px rgba(30, 27, 75, 0.02);
          transform: translateY(-1px);
        }

        .vm-info-tile.vm-tile-time:hover {
          background: linear-gradient(rgba(251, 146, 60, 0.08), rgba(251, 146, 60, 0.08)) padding-box,
                      linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.06)) border-box;
        }
        .light .vm-info-tile.vm-tile-time:hover {
          background: linear-gradient(var(--vm-tile-time-bg-glass-hover), var(--vm-tile-time-bg-glass-hover)) padding-box,
                      linear-gradient(90deg, var(--vm-tile-time-val), var(--vm-tile-time-val)) border-box;
          box-shadow: 0 6px 16px rgba(234, 88, 12, 0.09), 0 2px 4px rgba(30, 27, 75, 0.02);
          transform: translateY(-1px);
        }

        .vm-info-tile.vm-tile-ok:hover {
          background: linear-gradient(rgba(74, 222, 128, 0.06), rgba(74, 222, 128, 0.06)) padding-box,
                      linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.06)) border-box;
        }
        .light .vm-info-tile.vm-tile-ok:hover {
          background: linear-gradient(var(--vm-tile-ok-bg-glass-hover), var(--vm-tile-ok-bg-glass-hover)) padding-box,
                      linear-gradient(90deg, var(--vm-tile-ok-val), var(--vm-tile-ok-val)) border-box;
          box-shadow: 0 6px 16px rgba(22, 163, 74, 0.08), 0 2px 4px rgba(30, 27, 75, 0.02);
          transform: translateY(-1px);
        }

        .vm-info-tile.vm-tile-warn:hover {
          background: linear-gradient(rgba(251, 113, 133, 0.08), rgba(251, 113, 133, 0.08)) padding-box,
                      linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.06)) border-box;
        }
        .light .vm-info-tile.vm-tile-warn:hover {
          background: linear-gradient(var(--vm-tile-warn-bg-glass-hover), var(--vm-tile-warn-bg-glass-hover)) padding-box,
                      linear-gradient(90deg, var(--vm-tile-warn-val), var(--vm-tile-warn-val)) border-box;
          box-shadow: 0 6px 16px rgba(225, 29, 72, 0.09), 0 2px 4px rgba(30, 27, 75, 0.02);
          transform: translateY(-1px);
        }

        .vm-info-tile.vm-tile-neutral:hover {
          background: linear-gradient(rgba(148, 163, 184, 0.08), rgba(148, 163, 184, 0.08)) padding-box,
                      linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.06)) border-box;
        }
        .light .vm-info-tile.vm-tile-neutral:hover {
          background: linear-gradient(var(--vm-tile-neutral-bg-glass-hover), var(--vm-tile-neutral-bg-glass-hover)) padding-box,
                      linear-gradient(90deg, var(--vm-tile-neutral-val), var(--vm-tile-neutral-val)) border-box;
          box-shadow: 0 6px 16px rgba(71, 85, 105, 0.08), 0 2px 4px rgba(30, 27, 75, 0.02);
          transform: translateY(-1px);
        }

        /* Active highlight states: glassy translucent background, drawn border is handled by SVG hover-rect */
        .vm-info-tile.vm-tile-money.vm-active {
          background: linear-gradient(rgba(232, 201, 122, 0.06), rgba(232, 201, 122, 0.06)) padding-box,
                      linear-gradient(rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)) border-box !important;
          box-shadow: 0 4px 16px rgba(232, 201, 122, 0.08) !important;
        }
        .light .vm-info-tile.vm-tile-money.vm-active {
          background: linear-gradient(#ffffff, #ffffff) padding-box,
                      linear-gradient(90deg, var(--vm-tile-money-val), var(--vm-tile-money-val)) border-box !important;
          box-shadow: 0 8px 24px rgba(180, 130, 30, 0.16), 0 2px 6px rgba(30, 27, 75, 0.04) !important;
        }

        .vm-info-tile.vm-tile-time.vm-active {
          background: linear-gradient(rgba(251, 146, 60, 0.06), rgba(251, 146, 60, 0.06)) padding-box,
                      linear-gradient(rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)) border-box !important;
          box-shadow: 0 4px 16px rgba(251, 146, 60, 0.08) !important;
        }
        .light .vm-info-tile.vm-tile-time.vm-active {
          background: linear-gradient(#ffffff, #ffffff) padding-box,
                      linear-gradient(90deg, var(--vm-tile-time-val), var(--vm-tile-time-val)) border-box !important;
          box-shadow: 0 8px 24px rgba(234, 88, 12, 0.16), 0 2px 6px rgba(30, 27, 75, 0.04) !important;
        }

        .vm-info-tile.vm-tile-ok.vm-active {
          background: linear-gradient(rgba(74, 222, 128, 0.05), rgba(74, 222, 128, 0.05)) padding-box,
                      linear-gradient(rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)) border-box !important;
          box-shadow: 0 4px 16px rgba(74, 222, 128, 0.06) !important;
        }
        .light .vm-info-tile.vm-tile-ok.vm-active {
          background: linear-gradient(#ffffff, #ffffff) padding-box,
                      linear-gradient(90deg, var(--vm-tile-ok-val), var(--vm-tile-ok-val)) border-box !important;
          box-shadow: 0 8px 24px rgba(22, 163, 74, 0.16), 0 2px 6px rgba(30, 27, 75, 0.04) !important;
        }

        .vm-info-tile.vm-tile-warn.vm-active {
          background: linear-gradient(rgba(251, 113, 133, 0.06), rgba(251, 113, 133, 0.06)) padding-box,
                      linear-gradient(rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)) border-box !important;
          box-shadow: 0 4px 16px rgba(251, 113, 133, 0.08) !important;
        }
        .light .vm-info-tile.vm-tile-warn.vm-active {
          background: linear-gradient(#ffffff, #ffffff) padding-box,
                      linear-gradient(90deg, var(--vm-tile-warn-val), var(--vm-tile-warn-val)) border-box !important;
          box-shadow: 0 8px 24px rgba(225, 29, 72, 0.16), 0 2px 6px rgba(30, 27, 75, 0.04) !important;
        }

        .vm-info-tile.vm-tile-neutral.vm-active {
          background: linear-gradient(rgba(148, 163, 184, 0.05), rgba(148, 163, 184, 0.05)) padding-box,
                      linear-gradient(rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)) border-box !important;
          box-shadow: 0 4px 16px rgba(148, 163, 184, 0.06) !important;
        }
        .light .vm-info-tile.vm-tile-neutral.vm-active {
          background: linear-gradient(#ffffff, #ffffff) padding-box,
                      linear-gradient(90deg, var(--vm-tile-neutral-val), var(--vm-tile-neutral-val)) border-box !important;
          box-shadow: 0 8px 24px rgba(71, 85, 105, 0.16), 0 2px 6px rgba(30, 27, 75, 0.04) !important;
        }

        /* Active shimmer liquid highlight sweep (slower, high-end reflection) */
        @keyframes active-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .vm-info-tile.vm-active {
          z-index: 5;
        }

        .vm-info-tile.vm-active::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.0) 30%,
            rgba(255, 255, 255, 0.20) 50%,
            rgba(255, 255, 255, 0.0) 70%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: active-shimmer 1.2s cubic-bezier(0.25, 1, 0.5, 1) 1 forwards;
          pointer-events: none;
          z-index: 3;
        }

        .light .vm-info-tile.vm-active::after {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.0) 30%,
            rgba(255, 255, 255, 0.45) 50%,
            rgba(255, 255, 255, 0.0) 70%,
            transparent 100%
          );
        }
      `}</style>

      {/* Centered Floating Geometric Cards Row */}
      <div
        className="vm-capsule-dock"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12, // slightly larger gap for floating layout
          width: "fit-content",
          margin: "0 auto 36px auto",
          position: "relative",
          zIndex: activePopover ? 200 : 10,
        }}
      >
        {/* 1. Total fee (purple) */}
        {totalFeeStr && (
          <div style={{ position: "relative" }}>
            <InfoTile
              label={isOnline ? "Total visa fee" : "Total fee (incl. VFS)"}
              value={totalFeeStr}
              variant="money"
              icon={
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              onClick={() => onActivePopoverChange(activePopover === "money" ? null : "money")}
              active={activePopover === "money"}
              dimmed={isAnyActive && activePopover !== "money"}
            />
            <PopoverWrapper isOpen={activePopover === "money"} align="left">
              <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--vm-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif" }}>
                  Fee breakdown
                </div>
                <OverviewFeeBreakdown
                  visaType={visaType!} currency={currency} hasFees={hasFees}
                  visaFeeRefundable={visaFeeRefundable} serviceChargeRefundable={serviceChargeRefundable}
                  totalMin={totalMin} totalMax={totalMax} courierFee={courierFee}
                />
              </div>
            </PopoverWrapper>
          </div>
        )}

        {/* 2. Processing time (amber) */}
        {processingDays != null && (
          <div style={{ position: "relative" }}>
            <InfoTile
              label="Processing time"
              value={String(processingDays)}
              variant="time"
              icon={
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              onClick={() => onActivePopoverChange(activePopover === "time" ? null : "time")}
              active={activePopover === "time"}
              dimmed={isAnyActive && activePopover !== "time"}
            />
            <PopoverWrapper isOpen={activePopover === "time"} align="left">
              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--vm-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif" }}>
                  Processing Details
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 20 }}>⏱️</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--vm-text)", fontFamily: "'DM Sans', sans-serif" }}>
                      {String(processingDays)}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--vm-muted)", fontFamily: "'DM Sans', sans-serif" }}>
                      Estimated embassy decision time
                    </div>
                  </div>
                </div>
                <div style={{ height: 1, background: "var(--vm-border)", margin: "4px 0" }} />
                <p style={{ fontSize: 11, color: "var(--vm-muted)", margin: 0, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                  * Timeline starts after submitting physical documents at the center. Subject to consulate workloads.
                </p>
              </div>
            </PopoverWrapper>
          </div>
        )}

        {/* 3. Biometrics (green = not required, red = required) */}
        {biometricsRequired !== null && (
          <div style={{ position: "relative" }}>
            <InfoTile
              label="Biometrics"
              value={biometricsRequired ? "Required" : "Not required"}
              variant={biometricsRequired ? "warn" : "ok"}
              icon={
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
                </svg>
              }
              onClick={() => onActivePopoverChange(activePopover === "biometrics" ? null : "biometrics")}
              active={activePopover === "biometrics"}
              dimmed={isAnyActive && activePopover !== "biometrics"}
            />
            <PopoverWrapper isOpen={activePopover === "biometrics"} align="left">
              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--vm-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif" }}>
                  Biometrics Requirement
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 20 }}>🖐️</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vm-text)", fontFamily: "'DM Sans', sans-serif" }}>
                      {biometricsRequired ? "Biometrics Mandatory" : "No Biometrics Required"}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--vm-muted)", fontFamily: "'DM Sans', sans-serif" }}>
                      {biometricsRequired ? "Fingerprints & facial scan needed" : "Exempt from biometric submission"}
                    </div>
                  </div>
                </div>
                {biometricsRequired && (
                  <>
                    <div style={{ height: 1, background: "var(--vm-border)", margin: "4px 0" }} />
                    <p style={{ fontSize: 11, color: "var(--vm-muted)", margin: 0, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                      Must be submitted in-person at the center during your appointment.
                    </p>
                  </>
                )}
              </div>
            </PopoverWrapper>
          </div>
        )}

        {/* 4. Interview (green = not required, red = required) */}
        {interviewRequired !== null && (
          <div style={{ position: "relative" }}>
            <InfoTile
              label="Interview"
              value={interviewRequired ? "Required" : "Not required"}
              variant={interviewRequired ? "warn" : "ok"}
              icon={
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              }
              onClick={() => onActivePopoverChange(activePopover === "interview" ? null : "interview")}
              active={activePopover === "interview"}
              dimmed={isAnyActive && activePopover !== "interview"}
            />
            <PopoverWrapper isOpen={activePopover === "interview"} align="right">
              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--vm-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif" }}>
                  Interview Requirement
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 20 }}>💬</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vm-text)", fontFamily: "'DM Sans', sans-serif" }}>
                      {interviewRequired ? "Interview Required" : "Interview Not Required"}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--vm-muted)", fontFamily: "'DM Sans', sans-serif" }}>
                      {interviewRequired ? "Consulate meeting mandatory" : "Standard document review only"}
                    </div>
                  </div>
                </div>
                {interviewRequired && (
                  <>
                    <div style={{ height: 1, background: "var(--vm-border)", margin: "4px 0" }} />
                    <p style={{ fontSize: 11, color: "var(--vm-muted)", margin: 0, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                      The embassy may call you to schedule a physical or virtual interview.
                    </p>
                  </>
                )}
              </div>
            </PopoverWrapper>
          </div>
        )}

        {/* 5. VFS / In-person (neutral if needed, green if not) */}
        {vfsRequired !== null && (
          <div style={{ position: "relative" }}>
            <InfoTile
              label="VFS appointment"
              value={vfsRequired ? "Required" : "Not needed"}
              variant={vfsRequired ? "neutral" : "ok"}
              icon={
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              }
              onClick={() => onActivePopoverChange(activePopover === "vfs" ? null : "vfs")}
              active={activePopover === "vfs"}
              dimmed={isAnyActive && activePopover !== "vfs"}
            />
            <PopoverWrapper isOpen={activePopover === "vfs"} align="right">
              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--vm-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif" }}>
                  Appointment & Center Rules
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 20 }}>🏢</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--vm-text)", fontFamily: "'DM Sans', sans-serif" }}>
                      {vfsRequired ? "In-Person Submission" : "Online Submission"}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--vm-muted)", fontFamily: "'DM Sans', sans-serif" }}>
                      {vfsRequired ? `Required at ${locationCode?.toUpperCase()} VFS` : "Apply & submit documents online"}
                    </div>
                  </div>
                </div>
                {paymentInstructions.length > 0 && (
                  <>
                    <div style={{ height: 1, background: "var(--vm-border)", margin: "4px 0" }} />
                    <div style={{ fontSize: 9, fontWeight: 700, color: "var(--vm-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>
                      Center Payment Rules ({locationCode?.toUpperCase()})
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "360px", overflowY: "auto", paddingRight: 4 }}>
                      {paymentInstructions.map((instr, i) => (
                        <OverviewPaymentCard key={i} instruction={instr} fallbackCurrency={currency} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </PopoverWrapper>
          </div>
        )}
      </div>
    </>
  );
}
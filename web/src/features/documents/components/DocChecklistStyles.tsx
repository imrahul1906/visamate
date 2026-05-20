import { scrollbarCSS } from "@/components/shared/theme";

export function DocChecklistStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
      * { box-sizing: border-box; }

      ${scrollbarCSS}

      .vm-back-btn {
        display: flex; align-items: center; gap: 6px;
        background: transparent; border: none; cursor: pointer;
        font-size: 13px; font-weight: 500;
        color: rgba(255,255,255,0.4);
        padding: 0 0 24px;
        transition: color 150ms ease;
        font-family: 'DM Sans', sans-serif;
      }
      .vm-back-btn:hover { color: rgba(255,255,255,0.9); }

      .vm-dl-btn {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(255,255,255,0.1);
        color: #fff; border: 1px solid rgba(255,255,255,0.2);
        border-radius: 9px; padding: 6px 14px; cursor: pointer;
        font-size: 11px; font-weight: 700;
        backdrop-filter: blur(4px);
        transition: background 200ms ease, border-color 200ms ease;
        font-family: 'DM Sans', sans-serif;
      }
      .vm-dl-btn:hover {
        background: rgba(255,255,255,0.18);
        border-color: rgba(255,255,255,0.35);
      }

      .vm-doc-row {
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.07);
        background: rgba(255,255,255,0.02);
        padding: 10px 12px;
        cursor: pointer;
        transition: background 150ms ease, border-color 150ms ease;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        min-width: 0;
      }
      .vm-doc-row:hover {
        background: rgba(255,255,255,0.05);
        border-color: rgba(255,255,255,0.13);
      }
      .vm-doc-row.vm-active {
        background: rgba(99,102,241,0.08);
        border-color: rgba(99,102,241,0.45);
      }
      .vm-doc-row.vm-done {
        background: rgba(74,222,128,0.04);
        border-color: rgba(74,222,128,0.2);
      }
      .vm-doc-row.vm-active.vm-done {
        background: rgba(99,102,241,0.08);
        border-color: rgba(99,102,241,0.45);
      }
      .vm-doc-row.vm-optional {
        border-style: dashed;
        opacity: 0.72;
      }
      .vm-doc-row.vm-optional:hover {
        opacity: 1;
      }

      .vm-checkbox-btn {
        width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0;
        border: 2px solid rgba(255,255,255,0.2);
        background: transparent;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 160ms ease;
      }
      .vm-checkbox-btn.vm-checked {
        border-color: #6366f1;
        background: #6366f1;
      }

      /* .vm-badge removed — replaced by <Badge> component */

      .vm-drawer-close-btn {
        width: 28px; height: 28px; border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.05);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; flex-shrink: 0;
        transition: background 150ms ease;
        color: rgba(255,255,255,0.5);
      }
      .vm-drawer-close-btn:hover {
        background: rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.9);
      }

      .vm-mark-done-btn {
        display: inline-flex; align-items: center; gap: 6px;
        border-radius: 8px; padding: 7px 14px; cursor: pointer;
        font-size: 12px; font-weight: 600;
        transition: all 150ms ease;
        font-family: 'DM Sans', sans-serif;
      }
      .vm-mark-done-btn.vm-undone {
        background: rgba(99,102,241,0.1);
        border: 1px solid rgba(99,102,241,0.3);
        color: #818cf8;
      }
      .vm-mark-done-btn.vm-undone:hover {
        background: rgba(99,102,241,0.2);
        border-color: rgba(99,102,241,0.5);
      }
      .vm-mark-done-btn.vm-is-done {
        background: rgba(74,222,128,0.1);
        border: 1px solid rgba(74,222,128,0.3);
        color: #4ade80;
      }
      .vm-mark-done-btn.vm-is-done:hover {
        background: rgba(74,222,128,0.18);
      }

      .vm-nav-btn {
        display: inline-flex; align-items: center; gap: 5px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.09);
        border-radius: 8px; padding: 7px 13px;
        font-size: 12px; font-weight: 500; cursor: pointer;
        color: rgba(255,255,255,0.55);
        transition: all 150ms ease;
        font-family: 'DM Sans', sans-serif;
      }
      .vm-nav-btn:hover:not(:disabled) {
        background: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.2);
        color: rgba(255,255,255,0.9);
      }
      .vm-nav-btn:disabled {
        opacity: 0.3; cursor: default;
      }

      /* ── Document identity header ── */
      .vm-doc-identity-header {
        transition: border-color 200ms ease;
      }
      .vm-doc-identity-header:hover {
        border-color: rgba(99,102,241,0.28) !important;
      }

      /*
        Border shimmer: a bright highlight travels around the border once
        (two laps if you repeat the keyframe — we do 1.2s × 2 = 2 loops).
        Implemented as a conic-gradient mask on a pseudo-element overlay.
        The overlay has a vivid indigo border; the mask reveals only a
        short arc of it, which rotates a full 360°.
      */
      @property --shimmer-angle {
        syntax: '<angle>';
        initial-value: 0deg;
        inherits: false;
      }
      .vm-header-shimmer-border {
        border: 1px solid transparent;
        border-radius: 13px;
        pointer-events: none;
        background:
          conic-gradient(
            from var(--shimmer-angle),
            transparent 0deg,
            transparent 255deg,
            rgba(148,155,255,0.06) 290deg,
            rgba(185,190,255,0.35) 338deg,
            rgba(215,218,255,0.5) 355deg,
            rgba(185,190,255,0.35) 372deg,
            rgba(148,155,255,0.06) 408deg,
            transparent 430deg
          )
          border-box;
        -webkit-mask:
          linear-gradient(#fff 0 0) padding-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: destination-out;
        mask-composite: exclude;
        opacity: 0;
      }
      .vm-header-shimmer-run {
        animation: shimmer-border-rotate 2.6s cubic-bezier(0.16, 0.8, 0.38, 1) 1 forwards;
      }
      @keyframes shimmer-border-rotate {
        0%   { --shimmer-angle: 0deg;   opacity: 0; }
        5%   { opacity: 1; }
        78%  { --shimmer-angle: 360deg; opacity: 0.9; }
        100% { --shimmer-angle: 390deg; opacity: 0; }
      }

      .vm-stat-card {
        transition: border-color 200ms ease, transform 200ms ease;
      }
      .vm-stat-card:hover {
        border-color: rgba(129,140,248,0.35) !important;
        transform: translateY(-1px);
      }

      @media (max-width: 767px) {
        .vm-two-panel { flex-direction: column !important; }
        .vm-left-panel { width: 100% !important; }
        .vm-right-panel-overlay {
          position: fixed !important;
          top: 0; right: 0;
          width: 100% !important;
          height: 100% !important;
          z-index: 100;
        }
      }
    `}</style>
  );
}
import { scrollbarCSS } from "@/lib/theme";

export function DocChecklistStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }

      ${scrollbarCSS}

      .vm-back-btn {
        display: flex; align-items: center; gap: 6px;
        background: transparent; border: none; cursor: pointer;
        font-size: 13px; font-weight: 500;
        color: var(--vm-trans-white-45);
        padding: 0 0 24px;
        transition: color 150ms ease;
        font-family: 'DM Sans', sans-serif;
      }
      .vm-back-btn:hover { color: var(--vm-trans-white-85); }

      .vm-dl-btn {
        display: inline-flex; align-items: center; gap: 6px;
        background: var(--vm-trans-white-10);
        color: var(--vm-text); border: 1px solid var(--vm-trans-white-20);
        border-radius: 9px; padding: 6px 14px; cursor: pointer;
        font-size: 11px; font-weight: 700;
        backdrop-filter: blur(4px);
        transition: background 200ms ease, border-color 200ms ease;
        font-family: 'DM Sans', sans-serif;
      }
      .vm-dl-btn:hover {
        background: var(--vm-trans-white-18);
        border-color: var(--vm-trans-white-35);
      }

      .vm-doc-row {
        border-radius: 10px;
        border: 1px solid var(--vm-trans-white-07);
        background: var(--vm-trans-white-02);
        padding: 10px 12px;
        cursor: pointer;
        transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        min-width: 0;
      }
      .light .vm-doc-row {
        background: rgba(255, 255, 255, 0.65);
        border-color: rgba(108, 92, 231, 0.06);
        box-shadow: 0 2px 8px rgba(108, 92, 231, 0.02);
      }
      .vm-doc-row:hover {
        background: var(--vm-trans-white-05);
        border-color: var(--vm-trans-white-12);
      }
      .light .vm-doc-row:hover {
        background: rgba(255, 255, 255, 0.95);
        border-color: rgba(108, 92, 231, 0.16);
        box-shadow: 0 4px 12px rgba(108, 92, 231, 0.06);
        transform: translateY(-0.5px);
      }

      /* Active (selected) state */
      .vm-doc-row.vm-active {
        background: var(--vm-indigo-glow) !important;
        border-color: var(--vm-indigo-light) !important;
      }
      .vm-doc-row.vm-active:hover {
        background: rgba(99, 102, 241, 0.25) !important;
        border-color: var(--vm-indigo-light) !important;
        transform: translateY(-0.5px);
      }

      /* Active (selected) state in light mode */
      .light .vm-doc-row.vm-active {
        background: var(--vm-indigo-glow) !important;
        border-color: var(--vm-indigo) !important;
        box-shadow: 0 4px 12px rgba(108, 92, 231, 0.06) !important;
      }
      .light .vm-doc-row.vm-active:hover {
        background: rgba(79, 70, 229, 0.1) !important;
        border-color: var(--vm-indigo) !important;
        transform: translateY(-0.5px);
      }

      /* Completed state (when checked) */
      .vm-doc-row.vm-done {
        background: var(--vm-green-bg);
        border-color: var(--vm-green-border);
      }
      .light .vm-doc-row.vm-done {
        background: var(--vm-green-bg);
        border-color: var(--vm-green-border);
      }

      /* Click click feedback (active trigger) */
      .vm-doc-row:active, .light .vm-doc-row:active {
        transform: scale(0.97) !important;
        box-shadow: none !important;
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
        border: 2px solid var(--vm-trans-white-20);
        background: transparent;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 160ms ease;
      }
      .vm-checkbox-btn.vm-checked {
        border-color: var(--vm-indigo);
        background: var(--vm-indigo);
      }

      /* .vm-badge removed — replaced by <Badge> component */

      .vm-drawer-close-btn {
        width: 28px; height: 28px; border-radius: 8px;
        border: 1px solid var(--vm-trans-white-10);
        background: var(--vm-trans-white-05);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; flex-shrink: 0;
        transition: background 150ms ease;
        color: var(--vm-trans-white-45);
      }
      .vm-drawer-close-btn:hover {
        background: var(--vm-trans-white-10);
        color: var(--vm-trans-white-85);
      }

      .vm-mark-done-btn {
        display: inline-flex; align-items: center; gap: 6px;
        border-radius: 8px; padding: 7px 14px; cursor: pointer;
        font-size: 12px; font-weight: 600;
        transition: all 150ms ease;
        font-family: 'DM Sans', sans-serif;
      }
      .vm-mark-done-btn.vm-undone {
        background: var(--vm-indigo-glow);
        border: 1px solid var(--vm-indigo-light);
        color: var(--vm-indigo-light);
      }
      .vm-mark-done-btn.vm-undone:hover {
        background: var(--vm-indigo-glow);
        border-color: var(--vm-indigo);
      }
      .vm-mark-done-btn.vm-is-done {
        background: var(--vm-green-bg);
        border: 1px solid var(--vm-green-border);
        color: var(--vm-green);
      }
      .vm-mark-done-btn.vm-is-done:hover {
        background: var(--vm-green-border);
      }

      .vm-nav-btn {
        display: inline-flex; align-items: center; gap: 5px;
        background: var(--vm-trans-white-05);
        border: 1px solid var(--vm-trans-white-08);
        border-radius: 8px; padding: 7px 13px;
        font-size: 12px; font-weight: 500; cursor: pointer;
        color: var(--vm-trans-white-45);
        transition: all 150ms ease;
        font-family: 'DM Sans', sans-serif;
      }
      .vm-nav-btn:hover:not(:disabled) {
        background: var(--vm-trans-white-10);
        border-color: var(--vm-trans-white-20);
        color: var(--vm-trans-white-85);
      }
      .vm-nav-btn:disabled {
        opacity: 0.3; cursor: default;
      }

      /* ── Document identity header ── */
      .vm-doc-identity-header {
        transition: border-color 200ms ease;
      }
      .light .vm-doc-identity-header {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-left: 3px solid rgba(108, 92, 231, 0.25);
      }
      /* Title gradient — subtle brand tint in light mode */
      .light .vm-detail-doc-title {
        background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      /* Checklist empty-state heading — editorial serif gradient */
      .light .vm-checklist-heading {
        background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
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
        border-color: var(--vm-indigo-light) !important;
        transform: translateY(-1px);
      }

      /* Numbered steps in details panel */
      .vm-what-you-need-step {
        display: flex;
        align-items: flex-start;
        padding: 0 16px 0 14px;
        cursor: default;
        transition: background-color 160ms ease;
        background: transparent;
      }
      .vm-what-you-need-step:hover {
        background: var(--vm-trans-white-03) !important;
      }
      .vm-what-you-need-step .step-num {
        width: 22px; height: 22px; border-radius: 50%;
        background: var(--vm-trans-white-05);
        border: 1px solid var(--vm-trans-white-12);
        display: flex; align-items: center; justify-content: center;
        font-size: 10px; font-weight: 700; color: var(--vm-trans-white-45);
        flex-shrink: 0;
        transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease;
        font-family: 'DM Sans', sans-serif;
      }
      .vm-what-you-need-step:hover .step-num {
        background: var(--vm-purple-bg) !important;
        border-color: var(--vm-purple-border-soft) !important;
        color: var(--vm-purple-soft) !important;
      }
      .vm-what-you-need-step .step-connector {
        width: 2px;
        flex: 1;
        min-height: 14px;
        background: var(--vm-trans-white-08);
        margin-top: 4px;
        transition: background-color 160ms ease;
      }
      .vm-what-you-need-step:hover .step-connector {
        background: var(--vm-purple-border-soft) !important;
      }
      .vm-what-you-need-step .step-tip-text {
        font-size: 12.5px;
        color: var(--vm-trans-white-65);
        line-height: 1.6;
        flex: 1;
        transition: color 160ms ease;
        font-family: 'DM Sans', sans-serif;
      }
      .vm-what-you-need-step:hover .step-tip-text {
        color: var(--vm-text) !important;
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
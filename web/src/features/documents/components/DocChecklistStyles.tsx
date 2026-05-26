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

      /* Ambient Drifting Blobs */
      .vm-ambient-blobs {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: -2;
        overflow: hidden;
      }
      .vm-ambient-blob {
        position: absolute;
        width: 550px;
        height: 550px;
        border-radius: 50%;
        filter: blur(130px);
        opacity: 0.13;
        mix-blend-mode: screen;
        pointer-events: none;
      }
      .light .vm-ambient-blob {
        opacity: 0.05;
        mix-blend-mode: multiply;
        filter: blur(110px);
      }
      .vm-blob-a {
        background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
        top: -10%;
        left: -10%;
        animation: orbDriftA 25s infinite alternate ease-in-out;
      }
      .vm-blob-b {
        background: radial-gradient(circle, #a855f7 0%, transparent 70%);
        bottom: -10%;
        right: -10%;
        animation: orbDriftB 30s infinite alternate ease-in-out;
      }

      @keyframes orbDriftA {
        0% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(80px, 60px) scale(1.1); }
        100% { transform: translate(-40px, 120px) scale(0.95); }
      }
      @keyframes orbDriftB {
        0% { transform: translate(0, 0) scale(1.1); }
        50% { transform: translate(-100px, -50px) scale(0.9); }
        100% { transform: translate(60px, -110px) scale(1.05); }
      }

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

      /* Frosted Glass Panels */
      .vm-two-panel {
        background: rgba(15, 23, 42, 0.45) !important;
        backdrop-filter: blur(24px) saturate(180%);
        -webkit-backdrop-filter: blur(24px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.05) !important;
      }
      .light .vm-two-panel {
        background: rgba(255, 255, 255, 0.65) !important;
        border: 1px solid rgba(108, 92, 231, 0.12) !important;
        box-shadow: 0 10px 40px rgba(108, 92, 231, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.8) !important;
      }
      
      .vm-left-panel {
        border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
      }
      .light .vm-left-panel {
        border-right: 1px solid rgba(108, 92, 231, 0.1) !important;
      }

      .vm-doc-row {
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.04);
        background: rgba(255, 255, 255, 0.02);
        padding: 10px 12px;
        cursor: pointer;
        transition: background 200ms ease, border-color 200ms ease, box-shadow 200ms ease, transform 150ms ease;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        min-width: 0;
      }
      .light .vm-doc-row {
        background: rgba(255, 255, 255, 0.4);
        border-color: rgba(108, 92, 231, 0.06);
        box-shadow: 0 2px 8px rgba(108, 92, 231, 0.02);
      }
      .vm-doc-row:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.12);
        transform: translateY(-0.5px);
      }
      .light .vm-doc-row:hover {
        background: rgba(255, 255, 255, 0.85);
        border-color: rgba(108, 92, 231, 0.16);
        box-shadow: 0 4px 12px rgba(108, 92, 231, 0.06);
        transform: translateY(-0.5px);
      }

      /* Active (selected) state */
      .vm-doc-row.vm-active {
        background: rgba(99, 102, 241, 0.15) !important;
        border-color: rgba(99, 102, 241, 0.5) !important;
        box-shadow: 0 0 16px rgba(99, 102, 241, 0.1) !important;
      }
      .vm-doc-row.vm-active:hover {
        background: rgba(99, 102, 241, 0.22) !important;
        border-color: rgba(99, 102, 241, 0.6) !important;
      }

      /* Active (selected) state in light mode */
      .light .vm-doc-row.vm-active {
        background: rgba(99, 102, 241, 0.08) !important;
        border-color: rgba(99, 102, 241, 0.35) !important;
        box-shadow: 0 4px 12px rgba(108, 92, 231, 0.04) !important;
      }
      .light .vm-doc-row.vm-active:hover {
        background: rgba(99, 102, 241, 0.12) !important;
        border-color: rgba(99, 102, 241, 0.45) !important;
      }

      /* Completed state (when checked) */
      .vm-doc-row.vm-done {
        background: rgba(16, 185, 129, 0.08) !important;
        border-color: rgba(16, 185, 129, 0.3) !important;
      }
      .light .vm-doc-row.vm-done {
        background: rgba(16, 185, 129, 0.06) !important;
        border-color: rgba(16, 185, 129, 0.25) !important;
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

      /* ── Segmented Navigation Tabs (macOS style expanding capsule) ── */
      .vm-tabs-nav-container {
        position: absolute;
        top: -22px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        transition: width 450ms cubic-bezier(0.19, 1, 0.22, 1), height 450ms cubic-bezier(0.19, 1, 0.22, 1), border-color 300ms ease, box-shadow 450ms ease;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 22px; /* Fixed radius to prevent snap/choppiness */
        will-change: width;
      }

      /* Collapsed Circle State */
      .vm-tabs-nav-container.vm-collapsed {
        width: 44px;
        height: 44px;
        background: rgba(15, 23, 42, 0.75);
        border: 1px solid rgba(168, 85, 247, 0.35); /* purple borders to match mockup */
        box-shadow: 0 4px 16px rgba(168, 85, 247, 0.2), 0 0 8px rgba(99, 102, 241, 0.15);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        cursor: pointer;
      }
      .light .vm-tabs-nav-container.vm-collapsed {
        background: rgba(255, 255, 255, 0.85);
        border-color: rgba(108, 92, 231, 0.3);
        box-shadow: 0 4px 16px rgba(108, 92, 231, 0.15);
      }
      .vm-tabs-nav-container.vm-collapsed:hover {
        transform: translateX(-50%) scale(1.08);
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
        border-color: rgba(99, 102, 241, 0.6);
      }
      .light .vm-tabs-nav-container.vm-collapsed:hover {
        box-shadow: 0 6px 20px rgba(108, 92, 231, 0.25);
        border-color: rgba(108, 92, 231, 0.45);
      }

      /* Expanded Capsule State */
      .vm-tabs-nav-container.vm-expanded {
        width: 510px; /* Slightly wider to prevent text squeezing */
        height: 44px;
        background: rgba(15, 23, 42, 0.65);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
        backdrop-filter: blur(20px) saturate(150%);
        -webkit-backdrop-filter: blur(20px) saturate(150%);
        padding: 4px;
      }
      .light .vm-tabs-nav-container.vm-expanded {
        background: rgba(255, 255, 255, 0.75);
        border-color: rgba(108, 92, 231, 0.15);
        box-shadow: 0 8px 32px rgba(108, 92, 231, 0.08);
      }

      /* Trigger button elements */
      .vm-nav-trigger-btn {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.85); /* high contrast white */
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        padding: 0;
        transition: opacity 200ms ease, color 200ms ease;
      }
      .light .vm-nav-trigger-btn {
        color: rgba(30, 27, 75, 0.8); /* high contrast dark text */
      }
      .vm-nav-trigger-btn:hover {
        color: #ffffff;
      }
      .light .vm-nav-trigger-btn:hover {
        color: #1e1b4b;
      }

      /* Inner tab navigator - absolute and fixed width to avoid squishing contents during morph */
      .vm-tabs-nav {
        position: absolute;
        left: 0;
        top: 0;
        width: 502px; /* fixed size = container width - padding */
        height: 100%;
        display: flex;
        align-items: center;
        padding: 4px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 250ms cubic-bezier(0.19, 1, 0.22, 1);
        will-change: opacity;
      }
      
      /* Hide contents based on expansion state */
      .vm-collapsed .vm-tabs-nav {
        opacity: 0;
        pointer-events: none;
      }
      .vm-expanded .vm-nav-trigger-btn {
        opacity: 0;
        pointer-events: none;
      }
      .vm-expanded .vm-tabs-nav {
        opacity: 1;
        pointer-events: auto;
      }

      /* Close Button Inside Tab Bar */
      .vm-nav-close-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.08);
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--vm-trans-white-45);
        transition: all 200ms ease;
        margin-left: 6px;
        margin-right: 6px;
        flex-shrink: 0;
      }
      .light .vm-nav-close-btn {
        background: rgba(0, 0, 0, 0.03);
        border-color: rgba(0, 0, 0, 0.06);
        color: rgba(30, 27, 75, 0.45);
      }
      .vm-nav-close-btn:hover {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.3);
        color: #ef4444;
        transform: scale(1.05);
      }

      .vm-tab-btn {
        flex: 1;
        text-align: center;
        background: transparent;
        border: none;
        border-radius: 99px;
        padding: 6px 12px;
        font-family: 'DM Sans', sans-serif;
        font-size: 12px;
        font-weight: 600;
        color: var(--vm-trans-white-45);
        cursor: pointer;
        transition: color 200ms ease;
        position: relative;
        z-index: 1;
        outline: none;
        white-space: nowrap; /* Prevent word wrapping / half bubbles */
      }
      .light .vm-tab-btn {
        color: rgba(30, 27, 75, 0.55);
      }
      .vm-tab-btn:hover {
        color: var(--vm-text);
      }
      .light .vm-tab-btn:hover {
        color: var(--vm-text);
      }
      .vm-tab-btn.vm-active {
        color: var(--vm-text) !important;
      }
      .light .vm-tab-btn.vm-active {
        color: #1e1b4b !important;
      }

      /* Sliding active pill indicator */
      .vm-tab-slider {
        position: absolute;
        top: 4px;
        bottom: 4px;
        left: 0;
        border-radius: 99px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1), width 250ms cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 0;
        pointer-events: none;
      }
      .light .vm-tab-slider {
        background: #ffffff;
        border-color: rgba(108, 92, 231, 0.12);
        box-shadow: 0 2px 8px rgba(108, 92, 231, 0.08), 0 1px 2px rgba(30, 27, 75, 0.02);
      }

      /* Stable Grid Stacking Container to prevent page jumping and dancing */
      .vm-tab-panes-container {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        width: 100%;
        position: relative;
        margin-top: 16px; /* Space below header */
      }

      /* GPU-Accelerated Focus Overlay for Popovers */
      .vm-focus-overlay {
        position: absolute;
        inset: 0;
        backdrop-filter: blur(1.5px);
        -webkit-backdrop-filter: blur(1.5px);
        background: rgba(15, 23, 42, 0.18);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        z-index: 10;
        border-radius: 16px;
        transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), visibility 0s 300ms;
        will-change: opacity;
      }
      .light .vm-focus-overlay {
        background: rgba(255, 255, 255, 0.35);
        backdrop-filter: blur(1.2px);
        -webkit-backdrop-filter: blur(1.2px);
      }
      .vm-focus-overlay.vm-active {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transition: opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), visibility 0s 0s;
      }

      /* Animated Content Switcher - macOS Genie Slide-Out Flow */
      .vm-tab-pane {
        grid-column: 1;
        grid-row: 1;
        width: 100%;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transform: scale(0.96) translateY(-30px); /* scale down slightly towards the trigger circle */
        transform-origin: top center;
        transition: opacity 450ms cubic-bezier(0.19, 1, 0.22, 1), transform 450ms cubic-bezier(0.19, 1, 0.22, 1), visibility 0ms 450ms;
        will-change: transform, opacity;
      }
      .vm-tab-pane.vm-active {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: scale(1) translateY(0);
        transition: opacity 450ms cubic-bezier(0.19, 1, 0.22, 1), transform 450ms cubic-bezier(0.19, 1, 0.22, 1), visibility 0ms;
        z-index: 1;
      }

      /* ── File Row Thumbnails ── */
      .vm-file-thumb {
        width: 22px;
        height: 22px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 9.5px;
        font-weight: 800;
        font-family: 'DM Sans', sans-serif;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(4px);
      }
      .vm-file-thumb-pdf {
        background: var(--vm-badge-required-bg);
        border: 1px solid var(--vm-badge-required-border);
        color: var(--vm-badge-required-color);
      }
      .vm-file-thumb-img {
        background: var(--vm-badge-builder-bg);
        border: 1px solid var(--vm-badge-builder-border);
        color: var(--vm-badge-builder-color);
      }
      .vm-file-thumb-doc {
        background: var(--vm-badge-uploadable-bg);
        border: 1px solid var(--vm-badge-uploadable-border);
        color: var(--vm-badge-uploadable-color);
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
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
        transition: top 1.6s cubic-bezier(0.16, 1, 0.3, 1),
                    left 1.6s cubic-bezier(0.16, 1, 0.3, 1),
                    right 1.6s cubic-bezier(0.16, 1, 0.3, 1),
                    bottom 1.6s cubic-bezier(0.16, 1, 0.3, 1),
                    background 1.6s cubic-bezier(0.16, 1, 0.3, 1),
                    opacity 1.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .light .vm-ambient-blob {
        opacity: 0.05;
        mix-blend-mode: multiply;
        filter: blur(110px);
      }

      /* Dynamic positions based on active folder tab */
      .vm-active-tab-checklist .vm-blob-a {
        top: -10%;
        left: -10%;
        background: radial-gradient(circle, #3b82f6 0%, transparent 70%) !important;
      }
      .vm-active-tab-checklist .vm-blob-b {
        bottom: -10%;
        right: -10%;
        background: radial-gradient(circle, #a855f7 0%, transparent 70%) !important;
      }

      .vm-active-tab-guide .vm-blob-a {
        top: -5%;
        left: 28%;
        background: radial-gradient(circle, #8b5cf6 0%, transparent 70%) !important; /* shift to violet */
      }
      .vm-active-tab-guide .vm-blob-b {
        bottom: 15%;
        right: 45%;
        background: radial-gradient(circle, #ec4899 0%, transparent 70%) !important; /* shift to pink accent */
      }

      .vm-active-tab-security .vm-blob-a {
        top: 25%;
        left: 45%;
        background: radial-gradient(circle, #10b981 0%, transparent 70%) !important; /* shift to emerald */
      }
      .vm-active-tab-security .vm-blob-b {
        bottom: -10%;
        right: 15%;
        background: radial-gradient(circle, #06b6d4 0%, transparent 70%) !important; /* shift to teal */
      }

      .vm-blob-a {
        animation: orbDriftA 25s infinite alternate ease-in-out;
      }
      .vm-blob-b {
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

      /* Frosted Glass Panels (Separate floating glass panels inside master window) */
      .vm-two-panel {
        background: transparent !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        border: none !important;
        box-shadow: none !important;
        padding: 20px !important; /* balanced gap from outer border to eliminate wasted space */
        gap: 20px !important; /* clear visual gap between left checklist and right detail card */
      }
      
      .vm-left-panel {
        background: rgba(30, 41, 59, 0.4) !important; /* increased contrast against master window background */
        backdrop-filter: blur(16px) saturate(140%) !important;
        -webkit-backdrop-filter: blur(16px) saturate(140%) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important; /* brighter border for clear definition */
        border-radius: 14px !important;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.15) !important; /* specular top highlight & deeper drop shadow */
        overflow: hidden !important;
      }
      .light .vm-left-panel {
        background: rgba(255, 255, 255, 0.85) !important;
        border: 1px solid rgba(108, 92, 231, 0.18) !important;
        box-shadow: 0 16px 40px rgba(108, 92, 231, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9) !important;
      }

      .vm-right-panel {
        background: rgba(30, 41, 59, 0.4) !important;
        backdrop-filter: blur(16px) saturate(140%) !important;
        -webkit-backdrop-filter: blur(16px) saturate(140%) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        border-radius: 14px !important;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.15) !important;
        overflow: hidden !important;
      }
      .light .vm-right-panel {
        background: rgba(255, 255, 255, 0.85) !important;
        border: 1px solid rgba(108, 92, 231, 0.18) !important;
        box-shadow: 0 16px 40px rgba(108, 92, 231, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9) !important;
      }

      .vm-doc-row {
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.09); /* slightly brighter, cleaner border */
        background: rgba(255, 255, 255, 0.055); /* slightly higher opacity for distinct glass look */
        padding: 12px 14px;
        cursor: pointer;
        transition: background 200ms cubic-bezier(0.16, 1, 0.3, 1),
                    border-color 200ms cubic-bezier(0.16, 1, 0.3, 1),
                    border-left-width 200ms cubic-bezier(0.16, 1, 0.3, 1),
                    box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1),
                    transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        align-items: flex-start;
        gap: 11px;
        min-width: 0;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.04); /* premium floating card shadow */
      }
      .light .vm-doc-row {
        background: rgba(255, 255, 255, 0.88); /* more opaque card background for high separation */
        border-color: rgba(108, 92, 231, 0.12);
        box-shadow: 0 4px 10px rgba(108, 92, 231, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9);
      }
      .vm-doc-row:hover {
        background: rgba(255, 255, 255, 0.09);
        border-color: rgba(255, 255, 255, 0.16);
        transform: translateY(-1.5px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      }
      .light .vm-doc-row:hover {
        background: rgba(255, 255, 255, 0.98);
        border-color: rgba(108, 92, 231, 0.2);
        box-shadow: 0 6px 16px rgba(108, 92, 231, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1);
        transform: translateY(-1.5px);
      }

      /* Active (selected) state with a left highlight strip */
      .vm-doc-row.vm-active {
        background: rgba(99, 102, 241, 0.15) !important;
        border-color: rgba(99, 102, 241, 0.35) !important;
        border-left: 3.5px solid var(--vm-indigo-light) !important;
        box-shadow: 0 4px 16px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;
      }
      .vm-doc-row.vm-active:hover {
        background: rgba(99, 102, 241, 0.22) !important;
        border-color: rgba(99, 102, 241, 0.45) !important;
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
      }

      /* Active (selected) state in light mode */
      .light .vm-doc-row.vm-active {
        background: rgba(99, 102, 241, 0.08) !important;
        border-color: rgba(99, 102, 241, 0.25) !important;
        border-left: 3.5px solid var(--vm-indigo) !important;
        box-shadow: 0 4px 16px rgba(108, 92, 231, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
      }
      .light .vm-doc-row.vm-active:hover {
        background: rgba(99, 102, 241, 0.12) !important;
        border-color: rgba(99, 102, 241, 0.35) !important;
        box-shadow: 0 6px 20px rgba(108, 92, 231, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1) !important;
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
        transform: scale(0.98) !important;
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

      /* ── Master Console Window ── */
      .vm-master-window {
        background: rgba(15, 23, 42, 0.45);
        backdrop-filter: blur(24px) saturate(180%);
        -webkit-backdrop-filter: blur(24px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.05);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-top: 0; /* folder tabs row handles top space */
        position: relative;
        z-index: 10;
      }
      .light .vm-master-window {
        background: rgba(248, 250, 252, 0.75) !important; /* brighter, cleaner slate-white to eliminate dirty-grey look */
        border: 1px solid rgba(108, 92, 231, 0.1) !important;
        box-shadow: 0 10px 40px rgba(108, 92, 231, 0.02), inset 0 1px 1px rgba(255, 255, 255, 0.9) !important;
      }

      .vm-window-body {
        flex: 1;
        position: relative;
        width: 100%;
      }

      /* ── Dossier Folder Tabs Navigation ── */
      .vm-tabs-folder-row {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        gap: 6px;
        margin-top: 52px; /* perfect space from summary pills pushed down from overview */
        margin-bottom: -1px; /* physically overlaps the top border of the master window */
        position: relative;
        z-index: 20; /* must render on top of master window border */
        padding: 0 16px;
      }

      .vm-folder-tab {
        background: rgba(15, 23, 42, 0.25);
        backdrop-filter: blur(12px) saturate(120%);
        -webkit-backdrop-filter: blur(12px) saturate(120%);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08); /* matches master window top border */
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        padding: 8px 20px;
        color: var(--vm-trans-white-45);
        font-family: 'DM Sans', sans-serif;
        font-size: 11.5px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        outline: none;
        white-space: nowrap;
      }
      .light .vm-folder-tab {
        background: rgba(0, 0, 0, 0.02);
        border-color: rgba(108, 92, 231, 0.06);
        border-bottom-color: rgba(108, 92, 231, 0.12); /* matches master window top border */
        color: rgba(30, 27, 75, 0.5);
      }

      .vm-folder-tab:hover {
        color: var(--vm-text);
        background: rgba(15, 23, 42, 0.35);
        border-color: rgba(255, 255, 255, 0.08);
      }
      .light .vm-folder-tab:hover {
        color: #1e1b4b;
        background: rgba(0, 0, 0, 0.04);
        border-color: rgba(108, 92, 231, 0.1);
      }

      /* Active Folder Tab - merges borderless into master window */
      .vm-folder-tab.vm-active {
        background: rgba(15, 23, 42, 0.45) !important;
        backdrop-filter: blur(24px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
        border-color: rgba(255, 255, 255, 0.08) !important;
        border-bottom-color: transparent !important; /* hide bottom border to merge with content pane */
        color: var(--vm-text) !important;
        z-index: 22;
        padding-top: 11px; /* slightly taller to physically stand out */
        padding-bottom: 9px;
        transform: none !important; /* completely flush and static to prevent bouncing */
        box-shadow: 0 -8px 24px rgba(99, 102, 241, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      }
      .vm-folder-tab.vm-active::after {
        content: "";
        position: absolute;
        bottom: -2.5px; /* cover the master window border line underneath the active tab */
        left: 0;
        right: 0;
        height: 4px;
        background: var(--vm-surface) !important;
        z-index: 23;
        pointer-events: none;
      }
      .light .vm-folder-tab.vm-active {
        background: rgba(255, 255, 255, 0.65) !important;
        border-color: rgba(108, 92, 231, 0.12) !important;
        border-bottom-color: transparent !important;
        color: #1e1b4b !important;
        box-shadow: 0 -8px 24px rgba(108, 92, 231, 0.03), inset 0 1px 0 #ffffff !important;
      }

      /* Icons */
      .vm-tab-icon {
        width: 13px;
        height: 13px;
        stroke: currentColor;
        stroke-width: 2.2px;
      }

      /* Badges inside tabs */
      .vm-tab-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        padding: 1.5px 5px;
        font-size: 9px;
        font-weight: 700;
        font-family: 'DM Sans', sans-serif;
        color: var(--vm-indigo-light);
        background: rgba(99, 102, 241, 0.12);
        border: 1px solid rgba(99, 102, 241, 0.2);
        transition: all 250ms ease;
      }
      .light .vm-tab-badge {
        color: #4f46e5;
        background: rgba(79, 70, 229, 0.07);
        border-color: rgba(79, 70, 229, 0.15);
      }
      
      .vm-tab-badge.vm-badge-secure {
        color: var(--vm-green);
        background: rgba(16, 185, 129, 0.1);
        border-color: rgba(16, 185, 129, 0.15);
      }
      .light .vm-tab-badge.vm-badge-secure {
        color: #059669;
        background: rgba(5, 150, 105, 0.07);
        border-color: rgba(5, 150, 105, 0.15);
      }

      .vm-tab-badge.vm-badge-active {
        color: #ffffff !important;
        background: var(--vm-indigo) !important;
        border-color: var(--vm-indigo-light) !important;
        box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
      }
      .vm-tab-badge.vm-badge-secure.vm-badge-active {
        background: var(--vm-green) !important;
        border-color: var(--vm-green-border) !important;
        box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
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

      /* Animated Content Switcher - smooth hardware-accelerated fade */
      .vm-tab-pane {
        grid-column: 1;
        grid-row: 1;
        width: 100%;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transform: scale(0.985) translateY(12px);
        transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1),
                    transform 350ms cubic-bezier(0.16, 1, 0.3, 1),
                    visibility 0s 350ms;
        will-change: opacity, transform;
      }
      .vm-tab-pane.vm-active {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: scale(1) translateY(0);
        transition: opacity 450ms cubic-bezier(0.16, 1, 0.3, 1),
                    transform 500ms cubic-bezier(0.16, 1, 0.3, 1),
                    visibility 0s 0s;
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
        .vm-two-panel { 
          flex-direction: column !important; 
          padding: 12px !important;
          gap: 12px !important;
        }
        .vm-left-panel { 
          width: 100% !important; 
        }
        .vm-right-panel-overlay {
          position: fixed !important;
          top: 0; right: 0;
          width: 100% !important;
          height: 100% !important;
          z-index: 100;
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          background: var(--vm-surface) !important;
        }
      }
    `}</style>
  );
}
// src/features/documents/components/DocChecklistEmptyStateStyles.tsx
import { scrollbarCSS } from "@/lib/theme";

export function DocChecklistEmptyStateStyles() {
  return (
    <style>{`
      ${scrollbarCSS}

      /* Responsive Grid for Empty State */
      .vm-empty-container {
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 32px;
        align-items: center;
        position: relative;
        z-index: 1;
      }
      .vm-empty-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 100%;
        max-width: 650px;
      }
      .vm-empty-body-grid {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 32px;
        width: 100%;
      }
      .vm-empty-text-col {
        width: 100%;
        max-width: 440px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: var(--vm-surface2);
        border: 1px solid var(--vm-border);
        border-radius: 16px;
        box-shadow: none;
        padding: 20px 16px;
        box-sizing: border-box;
        transition: all 0.3s ease;
      }
      .vm-empty-mockup-col {
        display: none;
        width: 100%;
        max-width: 520px;
        flex-shrink: 0;
      }
      @media (min-width: 900px) {
        .vm-empty-body-grid {
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 48px;
        }
        .vm-empty-text-col {
          max-width: 380px;
          height: 350px;
          padding: 24px 20px;
          justify-content: center;
        }
        .vm-empty-mockup-col {
          display: block;
        }
      }

      /* Animation Keyframes */
      @keyframes pulseRing {
        0% { transform: scale(0.95); opacity: 0.5; }
        50% { transform: scale(1.05); opacity: 0.8; }
        100% { transform: scale(0.95); opacity: 0.5; }
      }
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes iconFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      @keyframes stepReveal {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes clickRipple {
        0% { transform: translate(-50%, -50%) scale(0.1); opacity: 1; border-color: var(--vm-indigo-light); box-shadow: 0 0 4px var(--vm-indigo); }
        100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; border-color: var(--vm-purple); box-shadow: none; }
      }
      @keyframes fileDrop {
        0% { transform: translateY(-12px) scale(0.8); opacity: 0; }
        70% { transform: translateY(2px) scale(1.05); opacity: 1; }
        100% { transform: translateY(0) scale(1); opacity: 1; }
      }

      .vm-click-ripple {
        position: absolute;
        border: 2px solid var(--vm-indigo);
        border-radius: 50%;
        animation: clickRipple 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        pointer-events: none;
        z-index: 110;
      }

      .vm-file-drop-anim {
        animation: fileDrop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      /* Orbs background drift */
      @keyframes orbDriftA {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(15px, -15px) scale(1.1); }
      }
      @keyframes orbDriftB {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(-15px, 15px) scale(1.05); }
      }

      /* Mockup specific UI replica styles */
      .mock-doc-row {
        border-radius: 10px;
        border: 1px solid var(--vm-trans-white-07);
        background: var(--vm-trans-white-02);
        padding: 8px 10px;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        transition: background 150ms ease, border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
        cursor: default;
      }
      .mock-doc-row.active {
        background: var(--vm-indigo-glow) !important;
        border-color: var(--vm-indigo-light) !important;
      }
      .mock-doc-row.done {
        background: var(--vm-green-bg) !important;
        border-color: var(--vm-green-border) !important;
      }

      .mock-checkbox-btn {
        width: 14px; height: 14px; border-radius: 4px; flex-shrink: 0;
        border: 1.5px solid var(--vm-trans-white-20);
        background: transparent;
        display: flex; align-items: center; justify-content: center;
        transition: all 160ms ease;
        margin-top: 1.5px;
      }
      .mock-checkbox-btn.checked {
        border-color: var(--vm-indigo) !important;
        background: var(--vm-indigo) !important;
      }

      .mock-mark-done-btn {
        display: inline-flex; align-items: center; gap: 6px;
        border-radius: 8px; padding: 7px 14px;
        font-size: 11px; font-weight: 600;
        transition: all 150ms ease;
        font-family: 'DM Sans', sans-serif;
        cursor: default;
      }
      .mock-mark-done-btn.undone {
        background: var(--vm-indigo-glow);
        border: 1px solid var(--vm-indigo-light);
        color: var(--vm-indigo-light);
      }
      .mock-mark-done-btn.is-done {
        background: var(--vm-green-bg);
        border: 1px solid var(--vm-green-border);
        color: var(--vm-green);
      }
    `}</style>
  );
}

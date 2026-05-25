/**
 * letterStyles.ts
 *
 * All CSS styles for the cover letter builder widget.
 * Injected via <style> tag in CoverLetterBuilder.tsx
 */

import { T, font, radius } from "@/lib/theme";

export const STYLES = `
  :root {
    --iw-bg:          ${T.bg};
    --iw-surface:     ${T.surface};
    --iw-surface2:    ${T.surface2};
    --iw-border:      ${T.border};
    --iw-border2:     ${T.border2};
    --iw-indigo:      ${T.indigo};
    --iw-indigo-lt:   ${T.indigoLight};
    --iw-indigo-glow: ${T.indigoGlow};
    --iw-text:        ${T.text};
    --iw-muted:       ${T.muted};
    --iw-muted2:      ${T.muted2};
    --iw-amber:       ${T.amber};
    --iw-amber-glow:  ${T.amberBg};
    --iw-error:       ${T.red};
    --iw-error-bg:    ${T.redBg};
    --iw-green:       ${T.green};
    --iw-indigo-rgb:  99, 102, 241;
    --iw-error-rgb:   239, 68, 68;
    --iw-radius:      ${radius.md}px;
    --iw-ff-body:     ${font.sans};
  }

  /* ─── Select screen ─── */
  .cl-select {
    font-family: var(--iw-ff-body);
    font-weight: 400;
    background: transparent;
    padding: 28px 20px;
    min-height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cl-select-inner { max-width: 560px; width: 100%; }
  .cl-eyebrow {
    margin: 0 0 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--iw-indigo-lt);
  }
  .cl-select-title {
    font-size: 22px; font-weight: 600;
    color: var(--iw-text); margin: 0 0 8px;
    font-family: var(--iw-ff-body);
  }
  .cl-select-sub {
    font-size: 13px; color: var(--iw-muted2);
    margin: 0 0 18px; line-height: 1.6;
  }
  /* Premium gradient title in light mode */
  .light .cl-select-title {
    background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Context strip */
  .cl-context-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    background: var(--iw-surface2);
    border: 1px solid var(--iw-border);
    border-radius: 12px;
    padding: 16px 18px;
    margin-bottom: 14px;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
  }
  .cl-context-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: var(--iw-surface);
    border: 1px solid var(--iw-border);
    border-radius: 8px;
    padding: 8px 10px;
    box-shadow: 0 2px 6px rgba(108, 92, 231, 0.01);
  }
  .cl-context-label { font-size: 9px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--iw-muted); }
  .cl-context-val { font-size: 11.5px; color: var(--iw-text); font-weight: 600; }
  .cl-context-val--empty { color: var(--iw-muted2); font-style: italic; font-weight: 500; }
  .cl-context-hint {
    font-size: 11px; color: var(--iw-amber); line-height: 1.65;
    background: rgba(217, 119, 6, 0.05);
    border: 1px solid rgba(217, 119, 6, 0.15);
    border-left: 3px solid var(--iw-amber);
    border-radius: 8px; padding: 10px 14px; margin-bottom: 18px;
  }
  .light .cl-context-strip {
    background: rgba(255, 255, 255, 0.88);
    border-color: rgba(108, 92, 231, 0.08);
    box-shadow: 0 4px 14px rgba(108, 92, 231, 0.03), inset 0 1px 2px rgba(0,0,0,0.01);
  }
  .light .cl-context-item {
    background: rgba(248, 246, 255, 0.75);
    border-color: rgba(108, 92, 231, 0.08);
    box-shadow: 0 2px 8px rgba(108, 92, 231, 0.02);
  }
  .light .cl-context-hint {
    background: rgba(217, 119, 6, 0.04);
    border-color: rgba(217, 119, 6, 0.12);
  }

  /* Options */
  .cl-options { display: flex; flex-direction: column; gap: 12px; }
  .cl-opt {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; padding: 18px 20px; border-radius: var(--iw-radius);
    border: 1px solid var(--iw-border); cursor: pointer; text-align: left;
    width: 100%; transition: all 260ms cubic-bezier(0.16, 1, 0.3, 1);
    background: rgba(255,255,255,0.03);
    position: relative;
    overflow: hidden;
  }
  .cl-opt:active { transform: scale(0.98); }
  .cl-opt--dark {
    background: var(--iw-indigo-glow);
    border-color: rgba(var(--iw-indigo-rgb), 0.2);
    color: var(--iw-text);
    box-shadow: 0 4px 12px rgba(108, 92, 231, 0.03);
  }
  .light .cl-opt--dark {
    background: rgba(255, 255, 255, 0.85);
    border-color: rgba(108, 92, 231, 0.12);
    box-shadow: 0 6px 20px rgba(108, 92, 231, 0.04);
  }
  .cl-opt--dark:hover {
    background: rgba(var(--iw-indigo-rgb), 0.12);
    border-color: var(--iw-indigo);
    box-shadow: 0 8px 24px rgba(var(--iw-indigo-rgb), 0.14);
    transform: translateY(-2px);
  }
  .light .cl-opt--dark:hover {
    background: #ffffff;
    border-color: var(--iw-indigo);
    box-shadow: 0 10px 28px rgba(108, 92, 231, 0.1);
    transform: translateY(-2px);
  }
  .cl-opt-left { display: flex; align-items: center; gap: 14px; flex: 1; }
  .cl-opt-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .cl-opt-icon--dark { background: rgba(var(--iw-indigo-rgb), 0.2); color: var(--iw-indigo-lt); border: 1px solid rgba(var(--iw-indigo-rgb), 0.3); }
  .light .cl-opt-icon--dark {
    background: rgba(108, 92, 231, 0.07);
    color: var(--iw-indigo);
    border-color: rgba(108, 92, 231, 0.18);
  }
  .cl-opt-text { display: flex; flex-direction: column; gap: 3px; }
  .cl-opt-title { font-size: 14.5px; font-weight: 700; display: flex; align-items: center; gap: 8px; line-height: 1; color: var(--iw-text); }
  .cl-opt-badge {
    font-size: 9px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase;
    padding: 3px 8px; border-radius: 99px;
    background: rgba(var(--iw-indigo-rgb), 0.2); color: var(--iw-indigo-lt); border: 1px solid rgba(var(--iw-indigo-rgb), 0.35);
  }
  .light .cl-opt-badge {
    background: rgba(108, 92, 231, 0.07);
    color: var(--iw-indigo);
    border-color: rgba(108, 92, 231, 0.18);
  }
  .cl-opt-desc { font-size: 11.5px; color: var(--iw-muted2); line-height: 1.5; }
  .light .cl-opt-title {
    background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ─── Builder shell ─── */
  .cl-builder { font-family: var(--iw-ff-body); background: transparent; display: flex; flex-direction: column; font-weight: 400; }

  /* Topbar */
  .cl-topbar {
    display: flex; align-items: center; gap: 16px;
    background: var(--iw-surface); border: 1px solid var(--iw-border);
    border-radius: 10px 10px 0 0; color: var(--iw-text);
    padding: 12px 16px;
  }
  .cl-back {
    display: flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.06); border: 1px solid var(--iw-border);
    color: var(--iw-muted2); border-radius: 8px;
    padding: 7px 12px; font-size: 12px; font-weight: 500;
    cursor: pointer; font-family: var(--iw-ff-body); flex-shrink: 0;
    transition: background 120ms, color 120ms, border-color 120ms;
  }
  .cl-back:hover { background: rgba(255,255,255,0.1); border-color: var(--iw-border2); color: var(--iw-text); }
  .cl-topbar-center { flex: 1; display: flex; flex-direction: column; }
  .cl-topbar-title { font-size: 13px; font-weight: 600; line-height: 1; color: var(--iw-text); }
  .cl-topbar-sub { font-size: 10px; color: var(--iw-muted); margin-top: 3px; letter-spacing: .05em; text-transform: uppercase; }
  .cl-topbar-steps { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .cl-step {
    width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid var(--iw-border);
    background: var(--iw-surface2); color: var(--iw-muted); font-size: 11px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }
  .cl-step--active { border-color: var(--iw-indigo); background: var(--iw-indigo-glow); color: var(--iw-indigo-lt); }
  .cl-step--done { border-color: rgba(74,222,128,0.5); background: rgba(74,222,128,0.1); color: var(--iw-green); }
  .cl-step-line { width: 20px; height: 1px; background: var(--iw-border); }

  /* ─── Inputs body ─── */
  .cl-inputs-body {
    background: var(--iw-surface);
    border: 1px solid var(--iw-border); border-top: none;
    border-radius: 0 0 10px 10px;
    padding: 24px 24px;
    display: flex; flex-direction: column; gap: 22px;
  }
  .cl-section { display: flex; flex-direction: column; gap: 14px; }
  .cl-section-label {
    font-size: 10px; font-weight: 700; letter-spacing: .07em;
    text-transform: uppercase; color: var(--iw-indigo-lt); margin: 0;
    padding-bottom: 6px; border-bottom: 1px solid var(--iw-border);
  }
  .cl-section-hint { font-weight: 400; text-transform: none; letter-spacing: 0; color: var(--iw-muted); font-size: 10px; }

  /* ── Hint chip — styled inline contextual tips ── */
  .cl-hint-chip {
    display: inline-flex; align-items: center; gap: 4px;
    background: rgba(251,191,36,0.10); border: 1px solid rgba(251,191,36,0.28);
    color: #f59e0b; border-radius: 99px;
    padding: 2px 8px; font-size: 10px; font-weight: 600;
    letter-spacing: .02em; text-transform: none;
    vertical-align: middle; margin-left: 6px;
    white-space: nowrap;
  }
  .cl-hint-chip svg { flex-shrink: 0; }
  .cl-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .cl-field-row--3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
  /* Travel: departure city (wider) + travelling toggle (narrower) */
  .cl-field-row--travel { grid-template-columns: 1.6fr 1fr; align-items: start; }

  /* Travel 3-col row: city | alone/with | companion */
  .cl-travel-row {
    display: grid;
    grid-template-columns: 1.8fr 1fr 1fr;
    gap: 14px;
    align-items: start;
  }

  /* Companion column — hidden when "Alone", fades in when "With someone" */
  .cl-companion-col {
    opacity: 0;
    pointer-events: none;
    transition: opacity 180ms ease;
  }
  .cl-companion-col--visible {
    opacity: 1;
    pointer-events: auto;
  }

  /* Companion sub-picker — slides in under the Alone/With toggle */
  .cl-companion-picker {
    display: flex; flex-direction: column; gap: 6px;
    margin-top: 4px; padding-top: 10px;
    border-top: 1px solid var(--iw-border);
  }
  .cl-field { display: flex; flex-direction: column; gap: 6px; }
  .cl-label { font-size: 11px; font-weight: 600; color: var(--iw-muted2); display: flex; gap: 8px; align-items: center; }
  .cl-field-err { font-size: 10px; color: var(--iw-error); font-weight: 500; }
  .cl-input {
    background: var(--iw-surface2); border: 1px solid var(--iw-border);
    border-radius: 8px; padding: 9px 12px; font-size: 13px;
    color: var(--iw-text); font-family: var(--iw-ff-body);
    outline: none; transition: border-color 120ms;
  }
  .cl-input:focus { border-color: rgba(var(--iw-indigo-rgb), 0.5); }
  .cl-input::placeholder { color: var(--iw-muted); }
  .cl-input--error { border-color: rgba(var(--iw-error-rgb), 0.45); }

  /* Toggles */
  .cl-toggle-row { display: flex; flex-wrap: wrap; gap: 8px; }
  .cl-toggle-row--sm .cl-toggle-btn { padding: 5px 10px; font-size: 11px; }
  .cl-toggle-btn {
    background: rgba(255,255,255,0.04); border: 1px solid var(--iw-border);
    border-radius: 8px; padding: 8px 16px; font-size: 12.5px; font-weight: 500;
    color: var(--iw-muted2); cursor: pointer; font-family: var(--iw-ff-body);
    transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .light .cl-toggle-btn {
    background: rgba(255, 255, 255, 0.6);
    border-color: rgba(108, 92, 231, 0.08);
    color: var(--iw-text);
  }
  .cl-toggle-btn:hover {
    border-color: var(--iw-border2);
    color: var(--iw-text);
    background: rgba(255,255,255,0.07);
  }
  .light .cl-toggle-btn:hover {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(108, 92, 231, 0.18);
  }
  .cl-toggle-btn--active {
    background: var(--iw-indigo-glow);
    border-color: var(--iw-indigo-lt);
    color: var(--iw-indigo-lt);
    font-weight: 600;
  }
  .light .cl-toggle-btn--active {
    background: var(--iw-indigo-glow);
    border-color: var(--iw-indigo);
    color: var(--iw-indigo);
    box-shadow: 0 2px 8px rgba(108, 92, 231, 0.06);
    font-weight: 600;
  }

  /* Family ties grid */
  .cl-ties-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
  }
  .cl-ties-item {
    display: flex; flex-direction: column; gap: 8px;
    background: var(--iw-surface2); border: 1px solid var(--iw-border);
    border-radius: 10px; padding: 12px 14px;
  }

  /* Contacts */
  .cl-contact-header {
    display: grid; grid-template-columns: 24px 1.4fr 1fr 1fr 1.2fr 28px;
    gap: 8px; padding: 0 4px; font-size: 10px; font-weight: 700;
    letter-spacing: .05em; text-transform: uppercase; color: var(--iw-muted);
  }
  .cl-contact-row {
    display: grid; grid-template-columns: 24px 1.4fr 1fr 1fr 1.2fr 28px;
    gap: 8px; align-items: center;
  }

  /* Country visit row — narrower grid: num | country | month-select | year-select | remove */
  .cl-country-visit-header {
    grid-template-columns: 24px 1fr 130px 90px 28px !important;
  }
  .cl-country-visit-row {
    grid-template-columns: 24px 1fr 130px 90px 28px;
  }

  /* Compact styled select — used for month and year pickers */
  .cl-select-pill {
    appearance: none; -webkit-appearance: none;
    background: var(--iw-surface2);
    border: 1px solid var(--iw-border);
    border-radius: 7px;
    padding: 7px 28px 7px 10px;
    font-size: 12px; font-weight: 500;
    color: var(--iw-text);
    font-family: var(--iw-ff-body);
    cursor: pointer;
    outline: none;
    width: 100%;
    min-width: 0;
    transition: border-color 120ms, background 120ms;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238888aa' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 12px;
  }
  .cl-select-pill:focus { border-color: rgba(var(--iw-indigo-rgb), 0.55); background-color: var(--iw-surface2); }
  .cl-select-pill:hover { border-color: var(--iw-border2); }
  .cl-select-pill option { background: var(--iw-surface2); color: var(--iw-text); }

  /* Mandatory asterisk */
  .cl-required {
    color: var(--iw-error);
    font-size: 11px;
    margin-left: 2px;
    font-weight: 700;
  }
  .cl-contact-num {
    width: 20px; height: 20px; border-radius: 50%; background: var(--iw-indigo);
    color: white; font-size: 10px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .cl-contact-field { min-width: 0; }
  .cl-add-contact {
    display: flex; align-items: center; gap: 6px;
    background: transparent; border: 1px dashed var(--iw-border);
    border-radius: 7px; padding: 7px 14px; font-size: 12px; font-weight: 500;
    color: var(--iw-muted); cursor: pointer; font-family: var(--iw-ff-body);
    transition: all 120ms; width: fit-content;
  }
  .cl-add-contact:hover { border-color: rgba(var(--iw-indigo-rgb), 0.4); color: var(--iw-indigo-lt); background: var(--iw-indigo-glow); }

  /* Icon btn */
  .cl-icon-btn {
    width: 24px; height: 24px; border: 1px solid var(--iw-border);
    background: rgba(255,255,255,0.04); border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--iw-muted); transition: all 100ms;
  }
  .cl-icon-btn--remove:hover { border-color: rgba(var(--iw-error-rgb), 0.4); color: var(--iw-error); background: var(--iw-error-bg); }

  /* Dependant rows */
  .cl-dependant-row {
    display: flex; align-items: flex-start; gap: 10px;
    background: var(--iw-surface2); border: 1px solid var(--iw-border);
    border-radius: 10px; padding: 14px;
  }
  .cl-dependant-row-num {
    width: 22px; height: 22px; border-radius: 50%; background: var(--iw-indigo);
    color: white; font-size: 10px; font-weight: 700; flex-shrink: 0; margin-top: 2px;
    display: flex; align-items: center; justify-content: center;
  }
  .cl-dependant-row-fields { flex: 1; display: flex; flex-direction: column; gap: 10px; }
  .cl-remove-btn {
    width: 26px; height: 26px; border: 1px solid var(--iw-border);
    background: rgba(255,255,255,0.04); border-radius: 6px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--iw-muted); transition: all 100ms; margin-top: 1px;
  }
  .cl-remove-btn:hover { border-color: rgba(var(--iw-error-rgb), 0.4); color: var(--iw-error); background: var(--iw-error-bg); }

  /* Save row */
  .cl-save-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; padding-top: 12px; border-top: 1px solid var(--iw-border);
  }
  .cl-save-hint { font-size: 12px; color: var(--iw-muted); margin: 0; line-height: 1.5; flex: 1; }
  .cl-save-btn {
    background: linear-gradient(135deg, var(--iw-indigo), var(--iw-indigo-lt)); color: white;
    border: none; border-radius: 8px; padding: 10px 22px; font-size: 12px; font-weight: 700;
    font-family: var(--iw-ff-body); cursor: pointer; flex-shrink: 0;
    transition: all 220ms cubic-bezier(0.16, 1, 0.3, 1); white-space: nowrap;
    box-shadow: 0 4px 16px rgba(var(--iw-indigo-rgb), 0.25); display: flex; align-items: center; gap: 7px;
  }
  .cl-save-btn:hover:not(:disabled) {
    transform: translateY(-1.5px);
    box-shadow: 0 6px 20px rgba(var(--iw-indigo-rgb), 0.35);
  }
  .cl-save-btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(var(--iw-indigo-rgb), 0.2);
  }
  .cl-save-btn:disabled { opacity: 0.5; cursor: default; }

  /* Spinner */
  .cl-spinner {
    width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
  }

  /* ─── Letter body ─── */
  .cl-letter-body {
    background: var(--iw-surface); border: 1px solid var(--iw-border); border-top: none;
    border-radius: 0 0 10px 10px; padding: 20px;
    display: flex; flex-direction: column; gap: 14px;
  }

  /* Letter sheet — white paper look */
  .cl-letter-sheet {
    background: #fff; border-radius: 8px; padding: 36px 40px;
    border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 2px 20px rgba(0,0,0,0.25);
    display: flex; flex-direction: column; gap: 0;
    font-family: 'Times New Roman', Times, Georgia, serif; color: #1a1a1a;
  }

  /* Address / Date — plain two-column flex */
  .cl-addr-block {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 14px;
  }

  /* Subject line */
  .cl-subject-row { display: flex; align-items: baseline; gap: 4px; margin-bottom: 12px; }
  .cl-subject-bold { font-size: 13px; font-weight: 700; font-family: 'Times New Roman', serif; white-space: nowrap; color: #1a1a1a; }

  /* Bullet list */
  .cl-bullet-list {
    margin: 0 0 12px; padding-left: 22px;
    font-size: 13px; line-height: 1.85; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
  }
  .cl-bullet-list li { margin-bottom: 4px; }

  /* Tables */
  .cl-doc-table, .cl-contacts-table {
    width: 100%; border-collapse: collapse;
    margin-bottom: 16px; font-size: 13px;
    font-family: 'Times New Roman', Times, serif;
  }
  .cl-doc-th, .cl-contacts-th {
    border: 1px solid #999; padding: 7px 12px;
    background: #f0f0f0; font-weight: 700; text-align: left;
  }
  .cl-doc-th--num { width: 100px; text-align: center; }
  .cl-doc-td, .cl-contacts-td {
    border: 1px solid #999; padding: 7px 12px;
    vertical-align: top; min-height: 28px;
  }
  .cl-doc-td--num { text-align: center; }

  /* Signature block */
  .cl-sig-block { margin-top: 12px; margin-bottom: 8px; }
  .cl-sig-line { width: 180px; border-bottom: 1px solid #999; margin: 8px 0 4px; }
  .cl-sig-sub { font-size: 12px; color: #555; margin: 0 0 2px; font-family: 'Times New Roman', Times, serif; }
  .cl-sig-italic { font-style: italic; }

  /* Download row */
  .cl-dl-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; padding-top: 12px; border-top: 1px solid var(--iw-border);
  }

  /* ─── Inline-editable letter preview ─── */

  /* Info strip */
  .cl-preview-info-strip {
    display: flex; align-items: flex-start; gap: 10px;
    background: rgba(var(--iw-indigo-rgb), 0.05);
    border: 1px solid rgba(var(--iw-indigo-rgb), 0.15);
    border-left: 3px solid var(--iw-indigo);
    border-radius: 8px; padding: 12px 14px;
    font-size: 12px; color: var(--iw-muted2); line-height: 1.6;
  }
  .cl-preview-info-strip strong { color: var(--iw-indigo-lt); }
  .light .cl-preview-info-strip strong { color: var(--iw-indigo); }
  .cl-preview-info-strip svg { color: var(--iw-indigo-lt); }
  .light .cl-preview-info-strip svg { color: var(--iw-indigo); }

  /* Heading input */
  .cl-letter-heading-input {
    font-size: 16px; font-weight: 700; text-align: center;
    letter-spacing: .12em; text-decoration: underline;
    margin: 0 0 18px; color: #1a1a1a; width: 100%;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent; padding: 4px 6px;
    border-radius: 4px; transition: background 110ms, box-shadow 110ms;
    box-sizing: border-box; display: block;
  }
  .cl-letter-heading-input:hover { background: rgba(var(--iw-indigo-rgb), 0.06); }
  .cl-letter-heading-input:focus { background: rgba(var(--iw-indigo-rgb), 0.1); box-shadow: 0 0 0 2px rgba(var(--iw-indigo-rgb), 0.3); }

  /* Address textarea & Date input */
  .cl-addr-textarea {
    font-size: 13px; line-height: 1.8; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent; resize: none;
    padding: 3px 5px; border-radius: 4px; width: 55%;
    transition: background 110ms, box-shadow 110ms;
  }
  .cl-addr-textarea:hover { background: rgba(var(--iw-indigo-rgb), 0.06); }
  .cl-addr-textarea:focus { background: rgba(var(--iw-indigo-rgb), 0.1); box-shadow: 0 0 0 2px rgba(var(--iw-indigo-rgb), 0.3); }

  .cl-date-input {
    font-size: 13px; line-height: 1.8; color: #1a1a1a; text-align: right;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent; padding: 3px 5px;
    border-radius: 4px; width: 40%; transition: background 110ms, box-shadow 110ms;
  }
  .cl-date-input:hover { background: rgba(var(--iw-indigo-rgb), 0.06); }
  .cl-date-input:focus { background: rgba(var(--iw-indigo-rgb), 0.1); box-shadow: 0 0 0 2px rgba(var(--iw-indigo-rgb), 0.3); }

  /* Generic inline field */
  .cl-inline-field {
    font-size: 13px; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent;
    border-bottom: 1.5px dashed rgba(var(--iw-indigo-rgb), 0.35);
    padding: 2px 4px; border-radius: 3px 3px 0 0;
    transition: border-color 110ms, background 110ms;
    min-width: 80px; width: auto;
  }
  .cl-inline-field:hover { border-bottom-color: var(--iw-indigo); background: rgba(var(--iw-indigo-rgb), 0.05); }
  .cl-inline-field:focus { border-bottom-color: var(--iw-indigo); background: rgba(var(--iw-indigo-rgb), 0.1); outline: none; box-shadow: none; }
  .cl-inline-field::placeholder { color: #bbb; font-style: italic; }
  .cl-inline-field--subject { flex: 1; font-weight: 700; }
  .cl-inline-field--salutation { display: block; width: 100%; margin-bottom: 10px; border-bottom-color: transparent; }
  .cl-inline-field--bullet { width: 100%; border-bottom-color: transparent; }
  .cl-inline-field--sig { font-weight: 600; min-width: 160px; }

  /* Inline paragraph textarea */
  .cl-inline-para {
    width: 100%; font-size: 13px; line-height: 1.85; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent; resize: none;
    padding: 5px 6px; border-radius: 4px; margin: 0 0 10px;
    box-sizing: border-box; overflow: hidden;
    transition: background 110ms, box-shadow 110ms;
    border-left: 2px solid transparent;
  }
  .cl-inline-para:hover { background: rgba(var(--iw-indigo-rgb), 0.05); border-left-color: rgba(var(--iw-indigo-rgb), 0.25); }
  .cl-inline-para:focus { background: rgba(var(--iw-indigo-rgb), 0.08); border-left-color: rgba(var(--iw-indigo-rgb), 0.5); box-shadow: none; }

  /* Section heading inputs */
  .cl-section-heading-input {
    font-size: 13px; font-weight: 700; text-decoration: underline;
    margin: 16px 0 8px; color: #1a1a1a; display: block; width: 100%;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent; padding: 3px 5px;
    border-radius: 4px; transition: background 110ms;
    box-sizing: border-box;
  }
  .cl-section-heading-input:hover { background: rgba(var(--iw-indigo-rgb), 0.06); }
  .cl-section-heading-input:focus { background: rgba(var(--iw-indigo-rgb), 0.1); box-shadow: 0 0 0 2px rgba(var(--iw-indigo-rgb), 0.3); }

  .cl-subsection-heading-input {
    font-size: 13px; font-weight: 700; font-style: italic;
    margin: 12px 0 6px; color: #1a1a1a; display: block; width: 100%;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent; padding: 3px 5px;
    border-radius: 4px; transition: background 110ms; box-sizing: border-box;
  }
  .cl-subsection-heading-input:hover { background: rgba(var(--iw-indigo-rgb), 0.06); }
  .cl-subsection-heading-input:focus { background: rgba(var(--iw-indigo-rgb), 0.1); box-shadow: 0 0 0 2px rgba(var(--iw-indigo-rgb), 0.3); }

  /* Bullet list editable */
  .cl-bullet-list--edit { list-style: none; padding-left: 14px; }
  .cl-bullet-edit-item { display: flex; align-items: center; margin-bottom: 3px; }
  .cl-bullet-edit-item::before { content: "•"; color: #1a1a1a; margin-right: 6px; flex-shrink: 0; font-size: 13px; }

  /* Table cell input (light, on white background) */
  .cl-cell-input-light {
    width: 100%; font-size: 13px; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent; padding: 2px 4px;
    border-radius: 3px; transition: background 100ms;
    box-sizing: border-box;
  }
  .cl-cell-input-light:hover { background: rgba(var(--iw-indigo-rgb), 0.07); }
  .cl-cell-input-light:focus { background: rgba(var(--iw-indigo-rgb), 0.12); box-shadow: 0 0 0 2px rgba(var(--iw-indigo-rgb), 0.25); }
  .cl-cell-input-light::placeholder { color: #bbb; font-style: italic; }
  .cl-doc-td--edit { padding: 5px 8px !important; }
  .cl-contacts-td--edit { padding: 5px 8px !important; }

  /* Add/remove buttons inside tables */
  .cl-cell-add-btn-light {
    font-size: 11px; font-weight: 600; color: var(--iw-indigo);
    background: rgba(var(--iw-indigo-rgb), 0.07); border: 1px dashed rgba(var(--iw-indigo-rgb), 0.35);
    border-radius: 4px; padding: 3px 10px; cursor: pointer;
    font-family: 'Times New Roman', Times, serif;
    transition: background 100ms; margin-top: 4px;
  }
  .cl-cell-add-btn-light:hover { background: rgba(var(--iw-indigo-rgb), 0.15); border-color: rgba(var(--iw-indigo-rgb), 0.6); }

  .cl-cell-remove-btn-light {
    width: 20px; height: 20px; border-radius: 50%; border: 1px solid #e0e0e0;
    background: #f5f5f5; font-size: 14px; line-height: 1; cursor: pointer;
    color: #999; display: flex; align-items: center; justify-content: center;
    transition: all 100ms; padding: 0;
  }
  .cl-cell-remove-btn-light:hover { background: #fee2e2; border-color: #fca5a5; color: #ef4444; }

  /* Unfilled fields warning banner */
  .cl-unfilled-warning {
    display: flex; gap: 10px; align-items: flex-start;
    background: #fff7ed; border: 1px solid #fed7aa;
    border-radius: 8px; padding: 12px 16px;
    color: #9a3412; font-size: 13px; line-height: 1.5;
    margin-bottom: 12px;
  }
  .cl-unfilled-warning strong { color: #7c2d12; }
  .cl-unfilled-warning ul { font-size: 12.5px; }

  /* Responsive */
  @media (max-width: 640px) {
    .cl-field-row { grid-template-columns: 1fr; }
    .cl-field-row--travel { grid-template-columns: 1fr; }
    .cl-travel-row { grid-template-columns: 1fr; }
    .cl-companion-col { opacity: 1; pointer-events: auto; }
    .cl-ties-grid { grid-template-columns: 1fr 1fr; }
    .cl-contact-header { display: none; }
    .cl-contact-row { grid-template-columns: 24px 1fr 28px; }
    .cl-country-visit-header { display: none !important; }
    .cl-country-visit-row { grid-template-columns: 24px 1fr 100px 72px 28px !important; }
    .cl-context-strip { grid-template-columns: repeat(2, 1fr); }
    .cl-letter-sheet { padding: 24px 18px; }
  }
`;
import { T } from "@/lib/theme";

export const styles = `
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
    --iw-green:       ${T.green};
    --iw-green-bg:    ${T.greenBg};
    --iw-amber:       ${T.amber};
    --iw-error:       ${T.red};
    --iw-error-bg:    ${T.redBg};
    --iw-indigo-rgb:  99, 102, 241;
    --iw-error-rgb:   239, 68, 68;
    --iw-radius:      10px;
    --iw-ff-body:     'DM Sans', sans-serif;
  }

  /* ─── Select screen ─── */
  .iw-select {
    font-family: var(--iw-ff-body); font-weight: 400;
    background: transparent; padding: 28px 20px;
    min-height: 280px; display: flex; align-items: center; justify-content: center;
  }
  .iw-select * { font-weight: inherit; }
  .iw-select-inner { max-width: 560px; width: 100%; }
  .iw-select-eyebrow { margin: 0 0 8px; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--iw-indigo-lt); }
  .iw-select-title { font-size: 22px; font-weight: 600; color: var(--iw-text); margin: 0 0 8px; font-family: var(--iw-ff-body); }
  .iw-select-sub { font-size: 13px; color: var(--iw-muted2); margin: 0 0 10px; line-height: 1.6; }
  .iw-options { display: flex; flex-direction: column; gap: 10px; }
  .iw-opt { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 18px; border-radius: var(--iw-radius); border: 1px solid var(--iw-border); cursor: pointer; text-align: left; width: 100%; transition: border-color 150ms, background 150ms, transform 120ms; background: rgba(255,255,255,0.03); }
  .iw-opt:active { transform: scale(0.99); }
  .iw-opt--light { color: var(--iw-muted2); }
  .iw-opt--light:hover { border-color: var(--iw-border2); background: rgba(255,255,255,0.06); transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.25); }
  .iw-opt--dark { background: var(--iw-indigo-glow); border-color: rgba(var(--iw-indigo-rgb), 0.35); color: var(--iw-text); }
  .iw-opt--dark:hover { background: rgba(var(--iw-indigo-rgb), 0.22); border-color: rgba(var(--iw-indigo-rgb), 0.55); box-shadow: 0 4px 24px rgba(var(--iw-indigo-rgb), 0.15); }
  .iw-opt-left { display: flex; align-items: center; gap: 14px; flex: 1; }
  .iw-opt-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .iw-opt-icon--light { background: rgba(255,255,255,0.06); color: var(--iw-muted2); border: 1px solid var(--iw-border); }
  .iw-opt-icon--dark { background: rgba(var(--iw-indigo-rgb), 0.2); color: var(--iw-indigo-lt); border: 1px solid rgba(var(--iw-indigo-rgb), 0.3); }
  .iw-opt-text { display: flex; flex-direction: column; gap: 3px; }
  .iw-opt-title { font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; line-height: 1; color: var(--iw-text); }
  .iw-opt-badge { font-size: 9px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; padding: 3px 8px; border-radius: 99px; background: rgba(var(--iw-indigo-rgb), 0.2); color: var(--iw-indigo-lt); border: 1px solid rgba(var(--iw-indigo-rgb), 0.35); }
  .iw-opt-desc { font-size: 12px; color: var(--iw-muted2); line-height: 1.5; }
  .iw-opt-arrow { flex-shrink: 0; color: var(--iw-muted); }
  .iw-opt--dark .iw-opt-arrow { color: var(--iw-indigo-lt); }

  /* Light mode premium overrides — itinerary select */
  .light .iw-select-title {
    background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .light .iw-opt--dark {
    background: rgba(255, 255, 255, 0.85);
    border-color: rgba(108, 92, 231, 0.12);
    box-shadow: 0 6px 20px rgba(108, 92, 231, 0.04);
  }
  .light .iw-opt--dark:hover {
    background: #ffffff;
    border-color: var(--iw-indigo);
    box-shadow: 0 10px 28px rgba(108, 92, 231, 0.1);
    transform: translateY(-2px);
  }
  .light .iw-opt-icon--dark {
    background: rgba(108, 92, 231, 0.07);
    color: var(--iw-indigo);
    border-color: rgba(108, 92, 231, 0.18);
  }
  .light .iw-opt-badge {
    background: rgba(108, 92, 231, 0.07);
    color: var(--iw-indigo);
    border-color: rgba(108, 92, 231, 0.18);
  }
  .light .iw-opt-title {
    background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .light .iw-opt--light {
    background: rgba(255, 255, 255, 0.85);
    border-color: rgba(30, 27, 75, 0.08);
    box-shadow: 0 6px 20px rgba(30, 27, 75, 0.02);
  }
  .light .iw-opt--light:hover {
    background: #ffffff;
    border-color: var(--iw-indigo);
    box-shadow: 0 10px 28px rgba(108, 92, 231, 0.08);
    transform: translateY(-2px);
  }
  .light .iw-opt-icon--light {
    background: rgba(30, 27, 75, 0.05);
    color: var(--iw-muted2);
    border-color: rgba(30, 27, 75, 0.1);
  }

  /* OR divider between options */
  .iw-opt-or { display: flex; align-items: center; gap: 10px; padding: 2px 0; }
  .iw-opt-or-line { flex: 1; height: 1px; background: var(--iw-border); }
  .iw-opt-or-text { font-size: 10px; font-weight: 700; letter-spacing: .1em; color: var(--iw-muted); text-transform: uppercase; flex-shrink: 0; }

  /* ─── Builder / Preview shared shell ─── */
  .iw-builder { font-family: var(--iw-ff-body); background: transparent; display: flex; flex-direction: column; font-weight: 400; overflow: visible; }
  .iw-builder * { font-weight: inherit; }
  .iw-builder b, .iw-builder strong { font-weight: 600; }

  /* Topbar */
  .iw-topbar { display: flex; align-items: center; gap: 16px; background: var(--iw-surface); border: 1px solid var(--iw-border); border-radius: 10px 10px 0 0; color: var(--iw-text); padding: 12px 16px; }
  .iw-back { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.06); border: 1px solid var(--iw-border); color: var(--iw-muted2); border-radius: 8px; padding: 7px 12px; font-size: 12px; font-weight: 500; cursor: pointer; font-family: var(--iw-ff-body); flex-shrink: 0; transition: background 120ms, color 120ms, border-color 120ms; }
  .iw-back:hover { background: rgba(255,255,255,0.1); border-color: var(--iw-border2); color: var(--iw-text); }
  .iw-topbar-center { flex: 1; display: flex; flex-direction: column; }
  .iw-topbar-title { font-size: 13px; font-weight: 600; line-height: 1; color: var(--iw-text); }
  .iw-topbar-sub { font-size: 10px; color: var(--iw-muted); margin-top: 3px; letter-spacing: .05em; text-transform: uppercase; }
  .iw-topbar-stats { display: flex; gap: 12px; flex-shrink: 0; }
  .iw-stat { font-size: 11px; color: var(--iw-muted); background: rgba(255,255,255,0.04); border: 1px solid var(--iw-border); border-radius: 7px; padding: 4px 10px; }
  .iw-stat strong { font-weight: 600; color: var(--iw-indigo-lt); }

  /* Error strips */
  .iw-error-strip { display: flex; gap: 16px; align-items: center; padding: 8px 16px; background: var(--iw-error-bg); border-bottom: 1px solid rgba(var(--iw-error-rgb), 0.2); font-size: 12px; color: var(--iw-error); font-weight: 500; }
  .iw-field-err { margin-left: 8px; font-size: 11px; font-weight: 500; color: var(--iw-error); font-style: normal; }
  .iw-input--error { border-color: rgba(var(--iw-error-rgb), 0.5) !important; background: rgba(var(--iw-error-rgb), 0.06) !important; }
  .iw-input--error:focus { box-shadow: 0 0 0 3px rgba(var(--iw-error-rgb), 0.12) !important; }
  .iw-day-tab--error { border-color: rgba(var(--iw-error-rgb), 0.4) !important; color: var(--iw-error) !important; }
  .iw-tab-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--iw-error); margin-right: 4px; vertical-align: middle; flex-shrink: 0; }
  .iw-day-tab--error.iw-day-tab--active { background: rgba(var(--iw-error-rgb), 0.15) !important; border-color: rgba(var(--iw-error-rgb), 0.5) !important; color: var(--iw-error) !important; }

  /* Builder body */
  .iw-body { display: grid; grid-template-columns: 268px 1fr; gap: 12px; padding: 12px; background: var(--iw-surface); border: 1px solid var(--iw-border); border-top: none; align-items: start; border-radius: 0 0 10px 10px; }
  .iw-left { background: var(--iw-surface2); border-radius: var(--iw-radius); border: 1px solid var(--iw-border); display: flex; flex-direction: column; overflow: hidden; }
  .iw-left-head { padding: 12px 12px 10px; border-bottom: 1px solid var(--iw-border); display: flex; flex-direction: column; gap: 8px; }
  .iw-panel-title { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--iw-indigo-lt); margin: 0; }
  .iw-city-select-wrap { position: relative; }
  .iw-city-select { width: 100%; border: 1px solid var(--iw-border); border-radius: 7px; padding: 7px 10px; font-size: 12px; font-family: var(--iw-ff-body); color: var(--iw-text); background: var(--iw-surface); appearance: none; cursor: pointer; outline: none; transition: border-color 150ms; }
  .iw-city-select:focus { border-color: var(--iw-indigo); box-shadow: 0 0 0 3px var(--iw-indigo-glow); }
  .iw-search-wrap { position: relative; padding: 8px 10px; border-bottom: 1px solid var(--iw-border); }
  .iw-search-icon { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--iw-muted); pointer-events: none; }
  .iw-search { width: 100%; box-sizing: border-box; border: 1px solid var(--iw-border); border-radius: 7px; padding: 7px 10px 7px 30px; font-size: 12px; font-family: var(--iw-ff-body); color: var(--iw-text); outline: none; background: var(--iw-surface); transition: border-color 150ms; }
  .iw-search::placeholder { color: var(--iw-muted); }
  .iw-search:focus { border-color: var(--iw-indigo); box-shadow: 0 0 0 3px var(--iw-indigo-glow); }
  .iw-places { flex: 1; overflow-y: auto; padding: 6px; display: flex; flex-direction: column; gap: 3px; scrollbar-width: thin; scrollbar-color: rgba(var(--iw-indigo-rgb), 0.35) transparent; }
  .iw-places::-webkit-scrollbar { width: 4px; }
  .iw-places::-webkit-scrollbar-thumb { background: rgba(var(--iw-indigo-rgb), 0.35); border-radius: 2px; }
  .iw-no-results { font-size: 12px; color: var(--iw-muted); text-align: center; padding: 16px; margin: 0; }
  .iw-place { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 10px; border-radius: 8px; border: 1px solid transparent; background: transparent; cursor: pointer; text-align: left; font-family: var(--iw-ff-body); transition: background 100ms, border-color 100ms; width: 100%; }
  .iw-place:hover:not(:disabled) { background: rgba(var(--iw-indigo-rgb), 0.08); border-color: rgba(var(--iw-indigo-rgb), 0.25); }
  .iw-place--added { opacity: .4; cursor: default; }
  .iw-place-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .iw-place-name { font-size: 11px; font-weight: 400; color: var(--iw-text); line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .iw-place-type { font-size: 10px; font-weight: 400; }
  .iw-place-action { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.06); color: var(--iw-muted); flex-shrink: 0; border: 1px solid var(--iw-border); }
  .iw-place:not(.iw-place--added):hover .iw-place-action { background: var(--iw-indigo); color: white; border-color: var(--iw-indigo); }

  /* Right panel */
  .iw-right { display: flex; flex-direction: column; gap: 10px; scrollbar-width: thin; scrollbar-color: rgba(var(--iw-indigo-rgb), 0.35) transparent; }
  .iw-config-row { background: var(--iw-surface2); border: 1px solid var(--iw-border); border-radius: var(--iw-radius); padding: 12px 14px; display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
  .iw-config-field { flex: 1; min-width: 150px; display: flex; flex-direction: column; gap: 5px; }
  .iw-config-field--sm { flex: 0 0 110px; min-width: auto; }
  .iw-label { font-size: 10px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--iw-indigo-lt); }
  .iw-input { border: 1px solid var(--iw-border); border-radius: 7px; padding: 7px 10px; font-size: 12px; font-family: var(--iw-ff-body); color: var(--iw-text); background: var(--iw-surface); outline: none; width: 100%; box-sizing: border-box; transition: border-color 150ms, box-shadow 150ms; }
  .iw-input::placeholder { color: var(--iw-muted); }
  .iw-input:focus { border-color: var(--iw-indigo); box-shadow: 0 0 0 3px var(--iw-indigo-glow); }
  .iw-input--date { color-scheme: dark; cursor: pointer; }
  .iw-input--date::-webkit-calendar-picker-indicator { filter: invert(0.7) sepia(1) saturate(2) hue-rotate(200deg); cursor: pointer; opacity: 0.8; }
  .iw-input--date::-webkit-calendar-picker-indicator:hover { opacity: 1; }
  .iw-input[type="number"]::-webkit-outer-spin-button,
  .iw-input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  .iw-input[type="number"] { -moz-appearance: textfield; }

  /* Day tabs */
  .iw-day-tabs { display: flex; gap: 5px; flex-wrap: wrap; }
  .iw-day-tab { border: 1px solid var(--iw-border); background: var(--iw-surface2); border-radius: 8px; padding: 6px 11px; cursor: pointer; font-size: 11px; font-family: var(--iw-ff-body); color: var(--iw-muted2); font-weight: 500; display: flex; flex-direction: column; align-items: center; gap: 1px; transition: all 100ms; line-height: 1; }
  .iw-day-tab-num { font-size: 11px; font-weight: 600; }
  .iw-day-tab-date { font-size: 9px; opacity: .7; }
  .iw-day-tab:hover:not(.iw-day-tab--active) { border-color: var(--iw-border2); color: var(--iw-text); background: rgba(255,255,255,0.05); }
  .iw-day-tab--active { background: var(--iw-indigo-glow); border-color: rgba(var(--iw-indigo-rgb), 0.45); color: var(--iw-indigo-lt); }

  /* Day panel */
  .iw-day-panel { background: var(--iw-surface2); border: 1px solid var(--iw-border); border-radius: var(--iw-radius); padding: 16px; display: flex; flex-direction: column; gap: 14px; }
  .iw-day-header { display: flex; align-items: flex-end; justify-content: space-between; }
  .iw-day-label { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--iw-indigo-lt); margin: 0 0 3px; }
  .iw-day-date { font-size: 18px; font-weight: 600; color: var(--iw-text); margin: 0; font-family: var(--iw-ff-body); }
  .iw-day-count { font-size: 11px; color: var(--iw-muted2); background: rgba(255,255,255,0.05); border: 1px solid var(--iw-border); border-radius: 99px; padding: 4px 10px; font-weight: 500; }
  .iw-same-btn { background: transparent; border: 1px dashed var(--iw-border); border-radius: 6px; padding: 4px 10px; font-size: 11px; font-family: var(--iw-ff-body); color: var(--iw-muted); cursor: pointer; transition: all 100ms; white-space: nowrap; }
  .iw-same-btn:hover { border-color: rgba(var(--iw-indigo-rgb), 0.4); color: var(--iw-indigo-lt); background: var(--iw-indigo-glow); }
  .iw-hotel-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .iw-hotel-field { display: flex; flex-direction: column; gap: 5px; }
  .iw-activity-section { display: flex; flex-direction: column; gap: 8px; }
  .iw-activity-label { font-size: 10px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--iw-indigo-lt); margin: 0; }
  .iw-activity-list { display: flex; flex-direction: column; gap: 5px; }
  .iw-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 90px; border: 1.5px dashed var(--iw-border); border-radius: 9px; font-size: 12px; color: var(--iw-muted); text-align: center; padding: 16px; }
  .iw-activity-item { display: flex; align-items: center; gap: 9px; background: rgba(255,255,255,0.03); border: 1px solid var(--iw-border); border-radius: 8px; padding: 8px 10px; transition: border-color 100ms; }
  .iw-activity-item:hover { border-color: var(--iw-border2); }
  .iw-activity-num { width: 20px; height: 20px; border-radius: 50%; background: var(--iw-indigo); color: white; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .iw-activity-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .iw-activity-name { font-size: 11px; font-weight: 400; color: var(--iw-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .iw-activity-type { font-size: 10px; font-weight: 400; }
  .iw-activity-actions { display: flex; gap: 2px; flex-shrink: 0; }
  .iw-icon-btn { width: 24px; height: 24px; border: 1px solid var(--iw-border); background: rgba(255,255,255,0.04); border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--iw-muted); transition: all 100ms; }
  .iw-icon-btn:hover:not(:disabled) { border-color: var(--iw-border2); color: var(--iw-text); background: rgba(255,255,255,0.09); }
  .iw-icon-btn:disabled { opacity: .25; cursor: default; }
  .iw-icon-btn--remove:hover:not(:disabled) { border-color: rgba(var(--iw-error-rgb), 0.4); color: var(--iw-error); background: var(--iw-error-bg); }
  .iw-custom-activity-row { display: flex; gap: 8px; align-items: center; }
  .iw-custom-activity-input { flex: 1; }
  .iw-custom-activity-btn { background: rgba(255,255,255,0.06); border: 1px solid var(--iw-border); border-radius: 7px; padding: 7px 14px; font-size: 12px; font-weight: 600; font-family: var(--iw-ff-body); color: var(--iw-muted2); cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 100ms; }
  .iw-custom-activity-btn:hover:not(:disabled) { background: var(--iw-indigo-glow); border-color: rgba(var(--iw-indigo-rgb), 0.35); color: var(--iw-indigo-lt); }
  .iw-custom-activity-btn:disabled { opacity: .35; cursor: default; }

  .iw-same-checkbox-label {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; color: var(--iw-muted2); cursor: pointer;
    font-family: var(--iw-ff-body); user-select: none;
    margin-bottom: 4px;
  }
  .iw-same-checkbox-label span { line-height: 1; }
  .iw-same-checkbox {
    width: 14px; height: 14px; cursor: pointer;
    accent-color: var(--iw-indigo);
    flex-shrink: 0;
  }

  /* Save row */
  .iw-save-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 12px; border-top: 1px solid var(--iw-border); }
  .iw-save-hint { font-size: 12px; color: var(--iw-muted); margin: 0; line-height: 1.5; flex: 1; }
  .iw-save-btn { background: linear-gradient(135deg, var(--iw-indigo), var(--iw-indigo-lt)); color: white; border: none; border-radius: 8px; padding: 9px 20px; font-size: 12px; font-weight: 600; font-family: var(--iw-ff-body); cursor: pointer; flex-shrink: 0; transition: opacity 150ms, box-shadow 150ms; white-space: nowrap; box-shadow: 0 2px 12px rgba(var(--iw-indigo-rgb), 0.3); display: flex; align-items: center; gap: 7px; }
  .iw-save-btn:hover:not(:disabled) { opacity: 0.88; box-shadow: 0 4px 20px rgba(var(--iw-indigo-rgb), 0.4); }
  .iw-save-btn:disabled { opacity: 0.5; cursor: default; }

  /* Spinner */
  .iw-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }

  /* ─── Preview screen ─── */
  .iw-preview-body {
    background: var(--iw-surface);
    border: 1px solid var(--iw-border);
    border-top: none;
    border-radius: 0 0 10px 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .iw-label-optional {
    font-size: 9px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
    padding: 2px 7px; border-radius: 99px;
    background: rgba(255,255,255,0.06); color: var(--iw-muted);
    border: 1px solid rgba(255,255,255,0.1);
    margin-left: 6px; vertical-align: middle;
  }

  /* Unified "same as above" row — spans both hotel fields */
  .iw-same-checkbox-label--unified {
    grid-column: 1 / -1;
    margin-bottom: 2px;
  }
  .iw-preview-info-strip {
    display: flex; align-items: flex-start; gap: 10px;
    background: rgba(var(--iw-indigo-rgb), 0.08);
    border: 1px solid rgba(var(--iw-indigo-rgb), 0.22);
    border-radius: 8px; padding: 11px 14px;
    font-size: 12px; color: var(--iw-muted2); line-height: 1.55;
  }
  .iw-preview-info-strip strong { color: var(--iw-indigo-lt); }
  .iw-preview-info-strip svg { color: var(--iw-indigo-lt); }

  /* White-paper sheet */
  .iw-letter-sheet {
    background: #fff;
    border-radius: 8px;
    padding: 36px 40px;
    border: 1px solid rgba(0,0,0,0.08);
    box-shadow: 0 2px 20px rgba(0,0,0,0.28);
    display: flex;
    flex-direction: column;
    gap: 0;
    font-family: 'Times New Roman', Times, Georgia, serif;
    color: #1a1a1a;
    /* A4 proportions — max 794px wide (96dpi A4 width) */
    max-width: 794px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  .iw-letter-heading {
    font-size: 22px; font-weight: 700; text-align: center;
    letter-spacing: .06em;
    margin: 0 0 18px; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
  }

  .iw-letter-meta { margin-bottom: 16px; }
  .iw-letter-meta-line {
    font-size: 13px; line-height: 1.8; color: #1a1a1a; margin: 0 0 3px;
    font-family: 'Times New Roman', Times, serif;
  }
  .iw-letter-meta-intro { margin-top: 10px; font-style: italic; }

  /* Table wrapper: horizontal scroll on small screens */
  .iw-preview-table-wrap {
    overflow-x: auto;
    margin-bottom: 0;
    width: 100%;
  }

  .iw-preview-table {
    width: 100%; border-collapse: collapse;
    font-family: 'Times New Roman', Times, serif;
    font-size: 12px;
    table-layout: fixed;
  }

  .iw-preview-th {
    background: var(--iw-surface2); color: var(--iw-text);
    border: 1px solid #444; padding: 10px 14px;
    font-size: 12px; font-weight: 700; text-align: left;
    font-family: 'Times New Roman', Times, serif;
    white-space: nowrap;
    vertical-align: middle;
  }

  /* Column proportions matching docx: 14 | 37 | 20 | 29 */
  .iw-col-date     { width: 14%; }
  .iw-col-activity { width: 37%; }
  .iw-col-contact  { width: 20%; }
  .iw-col-accom    { width: 29%; }

  .iw-preview-td {
    border: 1px solid #ccc;
    padding: 10px 14px;
    vertical-align: middle;
    text-align: left;
    line-height: 1.7;
    color: #1a1a1a;
  }

  .iw-preview-row-alt .iw-preview-td {
    background: #f7f7fb;
  }

  .iw-preview-activities {
    margin: 0; padding: 0 0 0 16px;
    list-style: disc;
    color: #1a1a1a;
  }
  .iw-preview-activities li { margin-bottom: 2px; }

  .iw-preview-same {
    color: #1a1a1a;
    font-style: normal;
    font-size: 12px;
    font-family: 'Times New Roman', Times, serif;
  }

  .iw-preview-empty-cell { color: #bbb; }

  /* Download row */
  .iw-dl-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; padding-top: 12px; border-top: 1px solid var(--iw-border);
  }

  /* ─── Responsive ─── */
  @media (max-width: 860px) {
    .iw-body { grid-template-columns: 1fr; }
    .iw-left { max-height: 300px; }
    .iw-hotel-row { grid-template-columns: 1fr; }
    .iw-topbar-stats { display: none; }
    .iw-letter-sheet { padding: 24px 16px; }
  }
  @media (max-width: 480px) {
    .iw-config-field--sm { flex: 1; min-width: 100px; }
    .iw-day-tab { padding: 5px 8px; font-size: 10px; }
    .iw-dl-row { flex-direction: column; align-items: flex-start; }
  }

  /* ─── Inline-editable preview ─── */

  /* Editable heading replaces <h2> */
  .iw-preview-heading-input {
    font-size: 22px; font-weight: 700; text-align: center;
    letter-spacing: .06em; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
    width: 100%; border: none; outline: none;
    background: transparent; margin: 0 0 18px;
    padding: 4px 6px; border-radius: 4px;
    transition: background 120ms, box-shadow 120ms;
    box-sizing: border-box;
  }
  .iw-preview-heading-input:hover { background: rgba(var(--iw-indigo-rgb), 0.06); }
  .iw-preview-heading-input:focus { background: rgba(var(--iw-indigo-rgb), 0.1); box-shadow: 0 0 0 2px rgba(var(--iw-indigo-rgb), 0.35); }

  .iw-preview-heading-static {
    font-size: 22px; font-weight: 700; text-align: center;
    letter-spacing: .06em; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
    width: 100%; margin: 0 0 18px;
    padding: 4px 6px;
    box-sizing: border-box;
  }

  /* Meta row (applicant / passport / dates) */
  .iw-preview-meta-row {
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
    margin-bottom: 4px;
  }
  .iw-preview-meta-label {
    font-size: 13px; font-weight: 700; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif; white-space: nowrap;
  }
  .iw-preview-meta-sep { color: #999; font-size: 13px; }
  .iw-preview-meta-input {
    font-size: 13px; color: #1a1a1a;
    font-family: 'Times New Roman', Times, serif;
    border: none; outline: none; background: transparent;
    border-bottom: 1.5px dashed #bbb;
    padding: 2px 4px; min-width: 120px;
    transition: border-color 120ms, background 120ms;
    border-radius: 3px 3px 0 0;
  }
  .iw-preview-meta-input--sm { min-width: 90px; }
  .iw-preview-meta-input:hover { border-bottom-color: var(--iw-indigo); background: rgba(var(--iw-indigo-rgb), 0.04); }
  .iw-preview-meta-input:focus { border-bottom-color: var(--iw-indigo); background: rgba(var(--iw-indigo-rgb), 0.08); box-shadow: none; }
  .iw-preview-meta-input::placeholder { color: #bbb; font-style: italic; }

  /* Editable table cells */
  .iw-preview-td--edit { padding: 8px 10px !important; vertical-align: middle !important; text-align: left !important; }

  .iw-cell-input {
    width: 100%; border: none; outline: none; background: transparent;
    font-family: 'Times New Roman', Times, serif; font-size: 12px;
    color: #1a1a1a; padding: 3px 5px; border-radius: 4px;
    transition: background 100ms, box-shadow 100ms;
    box-sizing: border-box;
  }
  .iw-cell-input:hover { background: rgba(var(--iw-indigo-rgb), 0.06); }
  .iw-cell-input:focus { background: rgba(var(--iw-indigo-rgb), 0.1); box-shadow: 0 0 0 2px rgba(var(--iw-indigo-rgb), 0.3); }
  .iw-cell-input::placeholder { color: #bbb; font-style: italic; }

  /* Activity list editable */
  .iw-preview-activities--edit { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 3px; }
  .iw-activity-edit-row { display: flex; align-items: center; gap: 4px; }
  .iw-activity-edit-row::before { content: "•"; color: #1a1a1a; font-size: 12px; flex-shrink: 0; padding-left: 2px; }
  .iw-cell-input--activity { flex: 1; min-width: 0; }

  .iw-cell-remove-btn {
    width: 18px; height: 18px; border-radius: 50%; border: 1px solid #e0e0e0;
    background: #f5f5f5; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #999; flex-shrink: 0; transition: all 100ms; padding: 0;
  }
  .iw-cell-remove-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #ef4444; }

  .iw-cell-add-btn {
    margin-top: 5px; font-size: 10px; font-weight: 600; color: var(--iw-indigo);
    background: rgba(var(--iw-indigo-rgb), 0.07); border: 1px dashed rgba(var(--iw-indigo-rgb), 0.35);
    border-radius: 4px; padding: 3px 8px; cursor: pointer;
    font-family: 'Times New Roman', Times, serif;
    transition: background 100ms, border-color 100ms;
    display: block; width: 100%; text-align: left;
  }
  .iw-cell-add-btn:hover { background: rgba(var(--iw-indigo-rgb), 0.14); border-color: rgba(var(--iw-indigo-rgb), 0.6); }

  /* "Same as above" toggle */
  .iw-same-toggle-wrap { display: flex; align-items: center; gap: 8px; }
  .iw-same-override-btn {
    border: 1px solid rgba(99,102,241,0.35); border-radius: 4px; padding: 2px 7px;
    cursor: pointer; font-family: 'Times New Roman', Times, serif;
    transition: background 100ms;
  }
  .iw-same-override-btn:hover { background: rgba(99,102,241,0.1); }
`;

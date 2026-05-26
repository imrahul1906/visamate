"use client";

import React from "react";
import { font } from "@/lib/theme";

interface ApplicationStatusTabProps {
  countryName?: string;
  visaTypeName?: string;
}

export default function ApplicationStatusTab({ countryName = "", visaTypeName = "" }: ApplicationStatusTabProps) {
  return (
    <div className="vm-status-container">
      {/* Nested CSS styles for centering, spacing, and hover scaling */}
      <style>{`
        .vm-status-container {
          display: flex;
          flex-direction: column;
          justify-content: center; /* Vertically center content to eliminate awkward blank space at the bottom */
          align-items: center;
          gap: 22px;
          padding: 24px;
          width: 100%;
          max-width: 860px;
          min-height: 460px; /* matches the parent tab container min-height */
          margin: 0 auto;
          animation: floatUp 450ms cubic-bezier(0.16, 1, 0.3, 1) both;
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
        }

        /* Centered Compact Tracking Hero Card */
        .vm-track-hero {
          background: rgba(30, 41, 59, 0.3);
          backdrop-filter: blur(16px) saturate(140%);
          -webkit-backdrop-filter: blur(16px) saturate(140%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 22px 32px;
          width: 100%;
          max-width: 500px; /* Constrained width to look like a premium self-contained console */
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.03);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .vm-track-hero:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 44px rgba(0, 0, 0, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
        }
        .light .vm-track-hero {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(108, 92, 231, 0.16);
          box-shadow: 0 20px 40px rgba(30, 27, 75, 0.06), 0 1px 3px rgba(30, 27, 75, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }
        .light .vm-track-hero:hover {
          border-color: rgba(108, 92, 231, 0.28);
          box-shadow: 0 28px 48px rgba(30, 27, 75, 0.09), 0 2px 6px rgba(30, 27, 75, 0.03);
        }
 
         /* Mini Badge inside Hero */
         .vm-mini-badge {
           display: inline-flex;
           align-items: center;
           gap: 4px;
           background: var(--vm-purple-bg);
           border: 1px solid var(--vm-purple-border-soft);
           border-radius: 12px;
           padding: 2px 8px;
           font-size: 8.5px;
           font-weight: 700;
           color: var(--vm-purple-soft);
           text-transform: uppercase;
           letter-spacing: 0.06em;
         }
 
         /* Tracker Launch Button */
         .vm-track-btn {
           display: inline-flex;
           align-items: center;
           justify-content: center;
           gap: 6px;
           background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
           color: #ffffff !important;
           border: none;
           border-radius: 8px;
           padding: 10px 20px;
           font-size: 12px;
           font-weight: 700;
           text-decoration: none;
           cursor: pointer;
           box-shadow: 0 4px 10px rgba(99, 102, 241, 0.18);
           transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
           margin-top: 4px;
         }
         .vm-track-btn:hover {
           background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
           box-shadow: 0 6px 18px rgba(99, 102, 241, 0.3), 0 0 0 2px rgba(139, 92, 246, 0.1);
           transform: translateY(-1px);
         }
 
         /* Gotchas Grid (Three Columns) */
         .vm-gotcha-grid {
           display: grid;
           grid-template-columns: repeat(3, 1fr);
           gap: 16px;
           width: 100%;
         }
         @media (max-width: 768px) {
           .vm-gotcha-grid {
             grid-template-columns: 1fr;
             gap: 12px;
           }
         }
 
         /* Compact Gotcha Cards */
         .vm-gotcha-card {
           background: rgba(30, 41, 59, 0.15);
           backdrop-filter: blur(12px);
           -webkit-backdrop-filter: blur(12px);
           border: 1px solid rgba(255, 255, 255, 0.05);
           border-radius: 12px;
           padding: 18px 16px;
           display: flex;
           flex-direction: column;
           gap: 10px;
           box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.01);
           transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
         }
         .light .vm-gotcha-card {
           background: rgba(255, 255, 255, 0.75);
           border: 1px solid rgba(108, 92, 231, 0.1);
           box-shadow: 0 8px 24px rgba(30, 27, 75, 0.04), 0 1px 2px rgba(30, 27, 75, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.95);
         }
         .vm-gotcha-card:hover {
           transform: translateY(-3px);
           border-color: rgba(255, 255, 255, 0.12);
           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
         }
         .light .vm-gotcha-card:hover {
           border-color: rgba(108, 92, 231, 0.24);
           box-shadow: 0 16px 32px rgba(30, 27, 75, 0.08), 0 2px 4px rgba(30, 27, 75, 0.03);
           background: #ffffff;
         }
 
         /* Icon Badge Box */
         .vm-icon-box {
           width: 28px;
           height: 28px;
           border-radius: 7px;
           background: rgba(255, 255, 255, 0.03);
           border: 1px solid rgba(255, 255, 255, 0.06);
           display: flex;
           align-items: center;
           justify-content: center;
           font-size: 13px;
           transition: all 0.3s ease;
         }
         .light .vm-icon-box {
           background: rgba(108, 92, 231, 0.06);
           border-color: rgba(108, 92, 231, 0.14);
         }
         .vm-gotcha-card:hover .vm-icon-box {
           background: rgba(99, 102, 241, 0.18);
           border-color: rgba(99, 102, 241, 0.28);
         }
         .light .vm-gotcha-card:hover .vm-icon-box {
           background: rgba(99, 102, 241, 0.12);
           border-color: rgba(99, 102, 241, 0.24);
         }
 
         /* Stay Updated Footer Row */
         .vm-status-footer {
           display: flex;
           justify-content: center;
           flex-wrap: wrap;
           gap: 12px 32px;
           width: 100%;
           padding-top: 16px;
           border-top: 1px solid rgba(255, 255, 255, 0.05);
           font-size: 11px;
           color: var(--vm-text);
           opacity: 0.45;
         }
         .light .vm-status-footer {
           border-top: 1px solid rgba(108, 92, 231, 0.12);
         }

         /* Divider */
         .vm-status-divider {
           height: 1px;
           background: var(--vm-border);
           width: 100%;
           opacity: 0.3;
           margin: 4px 0;
         }
         .light .vm-status-divider {
           opacity: 0.8;
           background: rgba(108, 92, 231, 0.14);
         }
       `}</style>
 
       {/* ── 1. Centered Track Hero Card ── */}
       <div className="vm-track-hero">
         <div className="vm-mini-badge">📡 Tracker</div>
 
         <h2 style={{
           fontFamily: font.sans,
           fontSize: 16.5,
           fontWeight: 700,
           color: "var(--vm-text)",
           margin: 0,
           letterSpacing: "-0.01em",
           lineHeight: 1.2,
         }}>
           Track Your Application
         </h2>
 
         <p style={{
           fontSize: 12,
           color: "var(--vm-text)",
           opacity: 0.6,
           margin: 0,
           fontFamily: font.sans,
           lineHeight: 1.4,
           maxWidth: 360,
         }}>
           Check your live visa status directly on the official VFS Global tracking portal.
         </p>
 
         <a
           href="https://www.vfsvisaonline.com/Global-Passporttracking/Track/"
           target="_blank"
           rel="noopener noreferrer"
           className="vm-track-btn"
         >
           <span>Track on VFS Global</span>
           <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
           </svg>
         </a>
       </div>
 
       <div className="vm-status-divider" />
 
       {/* ── 2. VFS Gotchas Grid (Three Compact Cards) ── */}
       <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
         <h3 style={{
           fontFamily: font.sans,
           fontSize: 10.5,
           fontWeight: 700,
           color: "var(--vm-text)",
           opacity: 0.4,
           textTransform: "uppercase",
           letterSpacing: "0.06em",
           margin: 0,
         }}>
           Critical VFS Gotchas
         </h3>
 
         <div className="vm-gotcha-grid">
           {/* Card 1 */}
           <div className="vm-gotcha-card">
             <div className="vm-icon-box">⏳</div>
             <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
               <h4 style={{
                 fontFamily: font.sans,
                 fontSize: 12.5,
                 fontWeight: 700,
                 color: "var(--vm-text)",
                 margin: 0,
               }}>
                 Scan Delay Panic
               </h4>
               <p style={{
                 fontSize: 11.5,
                 color: "var(--vm-text)",
                 opacity: 0.55,
                 margin: 0,
                 fontFamily: font.sans,
                 lineHeight: 1.4,
               }}>
                 VFS takes <strong>6–7 working days</strong> to scan your envelope. If you see &quot;Invalid Input&quot;, your package is simply awaiting scan.
               </p>
             </div>
           </div>
 
           {/* Card 2 */}
           <div className="vm-gotcha-card">
             <div className="vm-icon-box" style={{ color: "#f59e0b" }}>⚠️</div>
             <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
               <h4 style={{
                 fontFamily: font.sans,
                 fontSize: 12.5,
                 fontWeight: 700,
                 color: "var(--vm-text)",
                 margin: 0,
               }}>
                 On Hold deficiencies
               </h4>
               <p style={{
                 fontSize: 11.5,
                 color: "var(--vm-text)",
                 opacity: 0.55,
                 margin: 0,
                 fontFamily: font.sans,
                 lineHeight: 1.4,
               }}>
                 If your status shows &quot;On Hold&quot;, check your <strong>spam/junk email</strong> immediately for lists of missing documents.
               </p>
             </div>
           </div>
 
           {/* Card 3 */}
           <div className="vm-gotcha-card">
             <div className="vm-icon-box">📦</div>
             <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
               <h4 style={{
                 fontFamily: font.sans,
                 fontSize: 12.5,
                 fontWeight: 700,
                 color: "var(--vm-text)",
                 margin: 0,
               }}>
                 Courier UPS Label
               </h4>
               <p style={{
                 fontSize: 11.5,
                 color: "var(--vm-text)",
                 opacity: 0.55,
                 margin: 0,
                 fontFamily: font.sans,
                 lineHeight: 1.4,
               }}>
                 If returning via self-courier, VFS strictly accepts prepaid <strong>UPS labels only</strong>. Other labels cause delays.
               </p>
             </div>
           </div>
         </div>
       </div>
 
       {/* ── 3. Stay Updated Footer Row ── */}
       <div className="vm-status-footer">
         <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
           <span>💬</span>
           <span><strong>SMS Alerts:</strong> Purchased during online payment stage.</span>
         </div>
         <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
           <span>🕒</span>
           <span><strong>Intervals:</strong> Track online after 72 Business Hours.</span>
         </div>
       </div>
     </div>
   );
 }

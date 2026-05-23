"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "@/components/ui/Logo";
import { useApplicant } from "@/lib/context/ApplicantContext";

export default function SiteHeader() {
  const router = useRouter();
  const { ctx, reset } = useApplicant();
  
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Determine if a checklist is active (i.e. user has completed wizard selections)
  const isChecklistActive = !!ctx.country || !!ctx.visaType;

  const handleStartFresh = () => {
    reset();
    window.location.href = "/";
  };

  return (
    <>
      <style>{`
        .vm-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 90;
          transition: background 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), 
                      border-color 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), 
                      box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          font-family: 'DM Sans', var(--font-dm-sans), sans-serif;
        }
        .vm-header.scrolled {
          background: rgba(13, 13, 31, 0.82);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
        }
        .vm-header.top {
          background: transparent;
          border-bottom: 1px solid transparent;
        }
        .vm-inner {
          max-width: 1100px; margin: 0 auto;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px;
        }
        .vm-header-left {
          display: flex; align-items: center; gap: 14px;
        }
        .vm-header-logo { text-decoration: none; display: flex; align-items: center; }
        
        .vm-db-status {
          font-size: 11px; font-weight: 500;
          color: rgba(255, 255, 255, 0.45);
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          user-select: none;
          letter-spacing: -0.01em;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .vm-db-status:hover {
          background: rgba(108, 92, 231, 0.09);
          border-color: rgba(108, 92, 231, 0.35);
          color: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 10px rgba(108, 92, 231, 0.15);
          transform: translateY(-0.5px);
        }
        .vm-pulse-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 8px rgba(52, 211, 153, 0.8);
          animation: vm-pulse-green 2s infinite ease-in-out;
          transition: all 0.3s ease;
        }
        .vm-db-status:hover .vm-pulse-dot {
          background: #4ade80;
          box-shadow: 0 0 12px rgba(74, 222, 128, 1);
        }
        @keyframes vm-pulse-green {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.85); }
        }
        
        .vm-header-right {
          display: flex; align-items: center; gap: 12px;
        }
        .vm-header-link {
          font-size: 12.5px; font-weight: 500;
          color: rgba(255, 255, 255, 0.45);
          text-decoration: none;
          transition: color 0.25s ease;
          padding: 6px 4px;
        }
        .vm-header-link:hover {
          color: #fff;
        }
        .vm-header-sep {
          width: 1px; height: 12px;
          background: rgba(255, 255, 255, 0.12);
        }
        
        .vm-clear-wrapper {
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          width: 0;
          opacity: 0;
          pointer-events: none;
          transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1),
                      opacity 0.35s ease;
        }
        .vm-clear-wrapper.active {
          width: 141px; /* Separator (1px + 24px margins) + Button (116px) */
          opacity: 1;
          pointer-events: auto;
        }
        .vm-btn-clear {
          font-size: 12.5px; font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          padding: 8px 16px; border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px;
          text-decoration: none;
          width: 116px;
          box-sizing: border-box;
          transform: translateX(24px);
          opacity: 0;
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1),
                      opacity 0.35s ease,
                      background 0.2s ease,
                      border-color 0.2s ease,
                      color 0.2s ease;
        }
        .vm-clear-wrapper.active .vm-btn-clear {
          transform: translateX(0);
          opacity: 1;
        }
        .vm-btn-clear:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
          color: #fff;
        }

        
        @media (max-width: 480px) {
          .vm-db-status { display: none; }
          .vm-inner { padding: 0 16px; }
        }
      `}</style>

      <header className={`vm-header ${scrolled ? "scrolled" : "top"}`}>
        <div className="vm-inner">
          <div className="vm-header-left">
            <Link href="/" className="vm-header-logo">
              <Logo size="md" showBadge={false} />
            </Link>
            <div
              className="vm-db-status"
              onClick={() => {
                const el = document.getElementById("vm-faq-accordion");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
            >
              <span className="vm-pulse-dot" />
              <span>Visa rules updated: May 2026</span>
            </div>
          </div>

          <div className="vm-header-right">
            <a
              href="#vm-faq-accordion"
              className="vm-header-link"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("vm-faq-accordion");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
            >
              FAQs
            </a>

            <div className={`vm-clear-wrapper ${isChecklistActive ? "active" : ""}`}>
              <span className="vm-header-sep" style={{ margin: "0 8px 0 16px" }} />
              <button className="vm-btn-clear" onClick={handleStartFresh}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Start fresh
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
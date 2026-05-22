import React from "react";

interface ItinerarySelectProps {
  countryName: string;
  onDownloadBlank: () => void;
  onStartBuilder: () => void;
}

export default function ItinerarySelect({
  countryName,
  onDownloadBlank,
  onStartBuilder,
}: ItinerarySelectProps) {
  return (
    <div className="iw-select">
      <div className="iw-select-inner">
        <p className="iw-select-sub">
          Prepare your official itinerary for your {countryName} visa application.
        </p>
        <div className="iw-options">
          <button
            className="iw-opt iw-opt--light"
            onClick={(e) => {
              e.stopPropagation();
              onDownloadBlank();
            }}
          >
            <div className="iw-opt-left">
              <div className="iw-opt-icon iw-opt-icon--light">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="iw-opt-text">
                <span className="iw-opt-title">Download Blank Format</span>
                <span className="iw-opt-desc">
                  Official {countryName} itinerary template. Fill it manually
                  and attach to your documents.
                </span>
              </div>
            </div>
            <svg
              className="iw-opt-arrow"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <div className="iw-opt-or">
            <span className="iw-opt-or-line" />
            <span className="iw-opt-or-text">OR</span>
            <span className="iw-opt-or-line" />
          </div>

          <button
            className="iw-opt iw-opt--dark"
            onClick={(e) => {
              e.stopPropagation();
              onStartBuilder();
            }}
          >
            <div className="iw-opt-left">
              <div className="iw-opt-icon iw-opt-icon--dark">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="8" y1="14" x2="16" y2="14" />
                  <line x1="8" y1="18" x2="13" y2="18" />
                </svg>
              </div>
              <div className="iw-opt-text">
                <span className="iw-opt-title">
                  Itinerary Builder
                  <span className="iw-opt-badge">Recommended</span>
                </span>
                <span className="iw-opt-desc">
                  Plan day-by-day, add destinations and hotels. Preview and
                  download an editable Word document.
                </span>
              </div>
            </div>
            <svg
              className="iw-opt-arrow"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

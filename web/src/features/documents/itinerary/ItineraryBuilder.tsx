import React from "react";
import type { ItineraryCityMap } from "@/lib/data/types";
import type { ItineraryState } from "./useItineraryState";
import { validators } from "@/lib/utils/validators";

interface ItineraryBuilderProps {
  countryName: string;
  cities: ItineraryCityMap;
  typeColors: Record<string, string>;
  state: ItineraryState;
}

export default function ItineraryBuilder({
  countryName,
  cities,
  typeColors,
  state,
}: ItineraryBuilderProps) {
  const {
    setMode,
    selectedCity,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    activeDay,
    setActiveDay,
    customActivityInput,
    setCustomActivityInput,
    applicantName,
    setApplicantName,
    passportNo,
    setPassportNo,
    startDate,
    setStartDate,
    days,
    setDays,
    daysInput,
    setDaysInput,
    itinerary,
    accommodations,
    setAccommodations,
    fieldErrors,
    setFieldErrors,
    attempted,
    nameError,
    setNameError,
    passportError,
    setPassportError,
    phoneErrors,
    setPhoneError,
    filteredPlaces,
    allDaysList,
    accomForDay,
    setAccom,
    dateForDayLocal,
    dayItems,
    totalActivities,
    addPlace,
    addCustomActivity,
    removePlace,
    moveUp,
    moveDown,
    handlePreview,
    update,
  } = state;

  return (
    <div className="iw-builder" onClick={(e) => e.stopPropagation()}>
      {/* Topbar */}
      <div className="iw-topbar">
        <button className="iw-back" onClick={() => setMode("select")}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <div className="iw-topbar-center">
          <span className="iw-topbar-title">{countryName} Itinerary Builder</span>
          <span className="iw-topbar-sub">Official travel document</span>
        </div>
        <div className="iw-topbar-stats">
          <span className="iw-stat">
            <strong>{totalActivities}</strong> activities
          </span>
          <span className="iw-stat">
            <strong>{days}</strong> days
          </span>
        </div>
      </div>

      {/* Global validation strip */}
      {attempted && (fieldErrors["activities"] || fieldErrors["date"]) && (
        <div className="iw-error-strip">
          {fieldErrors["date"] && <span>📅 {fieldErrors["date"]}</span>}
          {fieldErrors["activities"] && <span>📍 {fieldErrors["activities"]}</span>}
        </div>
      )}

      <div className="iw-body">
        {/* ── Left: Destination picker ── */}
        <div className="iw-left">
          <div className="iw-left-head">
            <h3 className="iw-panel-title">Destinations</h3>
            <div className="iw-city-select-wrap">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="iw-city-select"
              >
                {Object.entries(cities).map(([k, city]) => (
                  <option key={k} value={k}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="iw-search-wrap">
            <svg
              className="iw-search-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="iw-search"
              placeholder="Search places…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="iw-places">
            {filteredPlaces.length === 0 && (
              <p className="iw-no-results">No results found.</p>
            )}
            {filteredPlaces.map((place) => {
              const alreadyAdded = itinerary.some(
                (x) => x.day === activeDay && x.placeId === place.id
              );
              return (
                <button
                  key={place.id}
                  className={`iw-place ${alreadyAdded ? "iw-place--added" : ""}`}
                  disabled={alreadyAdded}
                  onClick={() => {
                    if (!alreadyAdded) addPlace(place.id);
                  }}
                >
                  <div className="iw-place-info">
                    <span className="iw-place-name">{place.name}</span>
                    <span
                      className="iw-place-type"
                      style={{ color: typeColors[place.type] || "#888" }}
                    >
                      {place.type}
                    </span>
                  </div>
                  <span className="iw-place-action">
                    {alreadyAdded ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right: Day planner ── */}
        <div className="iw-right">
          {/* Applicant + passport — optional, validated inline */}
          <div className="iw-config-row">
            <div className="iw-config-field">
              <label className="iw-label">
                Applicant Name
                <span className="iw-label-optional">optional</span>
                {nameError && <span className="iw-field-err">{nameError}</span>}
              </label>
              <input
                type="text"
                className={`iw-input ${nameError ? "iw-input--error" : ""}`}
                placeholder="e.g. Rahul Yadav"
                value={applicantName}
                onKeyDown={validators.nameOnly.onKeyDown}
                onChange={(e) => {
                  const v = e.target.value;
                  setApplicantName(v);
                  update({ applicantName: v });
                  setNameError(validators.nameOnly.validate(v));
                }}
                onBlur={() => {
                  update({ applicantName });
                  setNameError(validators.nameOnly.validate(applicantName));
                }}
              />
            </div>
            <div className="iw-config-field">
              <label className="iw-label">
                Passport Number
                <span className="iw-label-optional">optional</span>
                {passportError && <span className="iw-field-err">{passportError}</span>}
              </label>
              <input
                type="text"
                className={`iw-input ${passportError ? "iw-input--error" : ""}`}
                placeholder="e.g. A1234567"
                value={passportNo}
                onKeyDown={validators.passport.onKeyDown}
                onChange={(e) => {
                  const v =
                    validators.passport.sanitise?.(e.target.value) ??
                    e.target.value;
                  setPassportNo(v);
                  update({ passportNo: v });
                  setPassportError(validators.passport.validate(v));
                }}
                onBlur={() => {
                  update({ passportNo });
                  setPassportError(validators.passport.validate(passportNo));
                }}
              />
            </div>
          </div>

          {/* Start date + duration */}
          <div className="iw-config-row">
            <div className="iw-config-field">
              <label className="iw-label">Start Date</label>
              <input
                type="date"
                className="iw-input iw-input--date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  update({ travelStartDate: e.target.value });
                }}
              />
            </div>
            <div className="iw-config-field iw-config-field--sm">
              <label className="iw-label">Duration (days)</label>
              <input
                type="number"
                className="iw-input"
                value={daysInput}
                placeholder="e.g. 7"
                min={1}
                max={30}
                onChange={(e) => {
                  setDaysInput(e.target.value);
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v) && v >= 1 && v <= 30) {
                    setDays(v);
                    if (activeDay > v) setActiveDay(v);
                  }
                }}
                onBlur={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (isNaN(v) || v < 1) {
                    setDaysInput("1");
                    setDays(1);
                    setActiveDay(1);
                  } else if (v > 30) {
                    setDaysInput("30");
                    setDays(30);
                  } else {
                    setDaysInput(String(v));
                  }
                }}
              />
            </div>
          </div>

          {/* Day tabs */}
          <div className="iw-day-tabs">
            {allDaysList.map((d) => {
              const hasErr =
                attempted &&
                (!!fieldErrors[`day_${d}_hotel`] ||
                  !!fieldErrors[`day_${d}_contact`]);
              return (
                <button
                  key={d}
                  className={`iw-day-tab ${
                    activeDay === d ? "iw-day-tab--active" : ""
                  } ${hasErr ? "iw-day-tab--error" : ""}`}
                  onClick={() => setActiveDay(d)}
                >
                  {hasErr && <span className="iw-tab-dot" />}
                  {startDate ? (
                    <>
                      <span className="iw-day-tab-num">Day {d}</span>
                      <span className="iw-day-tab-date">
                        {dateForDayLocal(d)}
                      </span>
                    </>
                  ) : (
                    `Day ${d}`
                  )}
                </button>
              );
            })}
          </div>

          {/* Day content */}
          <div className="iw-day-panel">
            <div className="iw-day-header">
              <div>
                <p className="iw-day-label">Day {activeDay}</p>
                <h3 className="iw-day-date">{dateForDayLocal(activeDay)}</h3>
              </div>
              <span className="iw-day-count">
                {dayItems.length}{" "}
                {dayItems.length === 1 ? "activity" : "activities"}
              </span>
            </div>

            {/* Hotel row */}
            <div className="iw-hotel-row">
              {/* Single "Same as above" toggle — copies both hotel name and contact */}
              {activeDay > 1 && (
                <label className="iw-same-checkbox-label iw-same-checkbox-label--unified">
                  <input
                    type="checkbox"
                    className="iw-same-checkbox"
                    checked={
                      accomForDay(activeDay).hotelName !== "" &&
                      accomForDay(activeDay).hotelName ===
                        accomForDay(activeDay - 1).hotelName &&
                      accomForDay(activeDay).hotelContact !== "" &&
                      accomForDay(activeDay).hotelContact ===
                        accomForDay(activeDay - 1).hotelContact
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        const prev = accomForDay(activeDay - 1);
                        setAccommodations((a) => ({
                          ...a,
                          [activeDay]: {
                            hotelName: prev.hotelName,
                            hotelContact: prev.hotelContact,
                          },
                        }));
                      } else {
                        setAccommodations((a) => ({
                          ...a,
                          [activeDay]: { hotelName: "", hotelContact: "" },
                        }));
                      }
                      if (attempted) {
                        setFieldErrors((p) => {
                          const n = { ...p };
                          delete n[`day_${activeDay}_hotel`];
                          delete n[`day_${activeDay}_contact`];
                          return n;
                        });
                      }
                      setPhoneError(activeDay, null);
                    }}
                  />
                  <span>Same hotel &amp; contact as previous day</span>
                </label>
              )}
              <div className="iw-hotel-field">
                <label className="iw-label">
                  Hotel / Accommodation
                  {attempted && fieldErrors[`day_${activeDay}_hotel`] && (
                    <span className="iw-field-err">
                      {fieldErrors[`day_${activeDay}_hotel`]}
                    </span>
                  )}
                </label>
                <input
                  className={`iw-input ${
                    attempted && fieldErrors[`day_${activeDay}_hotel`]
                      ? "iw-input--error"
                      : ""
                  }`}
                  placeholder="e.g. APA Hotel Shinjuku"
                  value={accomForDay(activeDay).hotelName}
                  onChange={(e) => {
                    setAccom(activeDay, "hotelName", e.target.value);
                    if (attempted) {
                      setFieldErrors((p) => {
                        const n = { ...p };
                        delete n[`day_${activeDay}_hotel`];
                        return n;
                      });
                    }
                  }}
                />
              </div>
              <div className="iw-hotel-field">
                <label className="iw-label">
                  Contact / Phone
                  {attempted && fieldErrors[`day_${activeDay}_contact`] && (
                    <span className="iw-field-err">
                      {fieldErrors[`day_${activeDay}_contact`]}
                    </span>
                  )}
                  {!fieldErrors[`day_${activeDay}_contact`] &&
                    phoneErrors[activeDay] && (
                      <span className="iw-field-err">
                        {phoneErrors[activeDay]}
                      </span>
                    )}
                </label>
                <input
                  className={`iw-input ${
                    (attempted && fieldErrors[`day_${activeDay}_contact`]) ||
                    phoneErrors[activeDay]
                      ? "iw-input--error"
                      : ""
                  }`}
                  placeholder="e.g. +81 3 1234 5678"
                  value={accomForDay(activeDay).hotelContact}
                  onKeyDown={validators.phone.onKeyDown}
                  onChange={(e) => {
                    const v =
                      validators.phone.sanitise?.(e.target.value) ??
                      e.target.value;
                    setAccom(activeDay, "hotelContact", v);
                    setPhoneError(activeDay, validators.phone.validate(v));
                    if (attempted) {
                      setFieldErrors((p) => {
                        const n = { ...p };
                        delete n[`day_${activeDay}_contact`];
                        return n;
                      });
                    }
                  }}
                  onBlur={() =>
                    setPhoneError(
                      activeDay,
                      validators.phone.validate(accomForDay(activeDay).hotelContact)
                    )
                  }
                />
              </div>
            </div>

            {/* Activities */}
            <div className="iw-activity-section">
              <p className="iw-activity-label">Activities</p>
              <div className="iw-activity-list">
                {dayItems.length === 0 ? (
                  <div className="iw-empty">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#c0bbb4"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>Select destinations from the left to add activities</span>
                  </div>
                ) : (
                  dayItems.map((item, idx) => {
                    const isCustom = !!item.customName;
                    const placeName = isCustom
                      ? item.customName!
                      : cities[item.city]?.places.find(
                          (p) => p.id === item.placeId
                        )?.name;
                    const placeType = isCustom
                      ? "Custom"
                      : cities[item.city]?.places.find(
                          (p) => p.id === item.placeId
                        )?.type;
                    if (!placeName) return null;
                    return (
                      <div key={item.placeId} className="iw-activity-item">
                        <span className="iw-activity-num">{idx + 1}</span>
                        <div className="iw-activity-info">
                          <span className="iw-activity-name">{placeName}</span>
                          <span
                            className="iw-activity-type"
                            style={{
                              color: isCustom
                                ? "#7c6f9f"
                                : typeColors[placeType ?? ""] || "#888",
                            }}
                          >
                            {placeType}
                          </span>
                        </div>
                        <div className="iw-activity-actions">
                          <button
                            className="iw-icon-btn"
                            onClick={() => moveUp(item.placeId)}
                            disabled={idx === 0}
                            title="Move up"
                          >
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="18 15 12 9 6 15" />
                            </svg>
                          </button>
                          <button
                            className="iw-icon-btn"
                            onClick={() => moveDown(item.placeId)}
                            disabled={idx === dayItems.length - 1}
                            title="Move down"
                          >
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                          <button
                            className="iw-icon-btn iw-icon-btn--remove"
                            onClick={() => removePlace(item.placeId, activeDay)}
                            title="Remove"
                          >
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Custom activity */}
            <div className="iw-custom-activity-row">
              <input
                className="iw-input iw-custom-activity-input"
                placeholder="Add your own activity…"
                value={customActivityInput}
                onChange={(e) => setCustomActivityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addCustomActivity(customActivityInput);
                }}
              />
              <button
                className="iw-custom-activity-btn"
                onClick={() => addCustomActivity(customActivityInput)}
                disabled={!customActivityInput.trim()}
              >
                + Add
              </button>
            </div>

            {/* Preview button */}
            <div className="iw-save-row">
              <p className="iw-save-hint">
                Complete all days, then preview your itinerary before
                downloading. Make sure to fill every field after downloading, if
                not filled here.
              </p>
              <button className="iw-save-btn" onClick={handlePreview}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Preview Itinerary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

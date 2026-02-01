import React from "react";
import "./breadcrumb.css";

/**
 * Breadcrumb for the center content (no new pages).
 * - Years view:  Years
 * - Months view: Years > Months
 */
export default function Breadcrumb({ view, onGoYears }) {
  return (
    <div className="mlBreadcrumb" role="navigation" aria-label="Breadcrumb">
      <button
        type="button"
        className={`mlCrumb ${view === "YEARS" ? "isActive" : ""}`}
        onClick={onGoYears}
      >
        Years
      </button>

      {view === "MONTHS" ? (
        <>
          <span className="mlCrumbSep">›</span>
          <span className="mlCrumb isActive">Months</span>
        </>
      ) : null}
    </div>
  );
}

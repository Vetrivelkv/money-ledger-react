import React, { useMemo, useState } from "react";
import "./addYearDialog.css";

const MONTHS = [
  { n: 1, name: "Jan" },
  { n: 2, name: "Feb" },
  { n: 3, name: "Mar" },
  { n: 4, name: "Apr" },
  { n: 5, name: "May" },
  { n: 6, name: "Jun" },
  { n: 7, name: "Jul" },
  { n: 8, name: "Aug" },
  { n: 9, name: "Sep" },
  { n: 10, name: "Oct" },
  { n: 11, name: "Nov" },
  { n: 12, name: "Dec" },
];

export default function AddYearDialog({
  open,
  onClose,
  onSave,
  saving = false,
  error,
}) {
  const initialYear = useMemo(() => new Date().getFullYear(), []);
  const [year, setYear] = useState(initialYear);
  const [monthsEnabled, setMonthsEnabled] = useState(MONTHS.map((m) => m.n));
  const [localError, setLocalError] = useState(null);

  if (!open) return null;

  const toggleMonth = (m) => {
    setMonthsEnabled((prev) => {
      const has = prev.includes(m);
      const next = has ? prev.filter((x) => x !== m) : [...prev, m];
      next.sort((a, b) => a - b);
      return next;
    });
  };

  const allSelected = monthsEnabled.length === 12;

  const submit = async () => {
    setLocalError(null);
    const y = Number(year);

    if (!Number.isFinite(y) || y < 1900 || y > 2200) {
      setLocalError("Enter a valid year (e.g., 2026).");
      return;
    }
    if (!monthsEnabled.length) {
      setLocalError("Select at least one month.");
      return;
    }

    await onSave?.({ year: y, monthsEnabled });
  };

  return (
    <div className="mlModalOverlay" role="dialog" aria-modal="true">
      <div className="mlModal">
        <div className="mlModalHeader">
          <div>
            <h3 className="mlModalTitle">Add Year</h3>
            <p className="mlModalSubtitle">
              Choose the year and enabled months. Everyone can see the year.
            </p>
          </div>
          <button className="mlModalClose" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="mlModalBody">
          <label className="mlField">
            <span className="mlLabel">Year</span>
            <input
              className="mlInput"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2026"
              min="1900"
              max="2200"
            />
          </label>

          <div className="mlMonthsTop">
            <div className="mlLabelRow">
              <span className="mlLabel">Enabled months</span>
              <div className="mlMonthActions">
                <button
                  type="button"
                  className="mlGhostBtn"
                  onClick={() => setMonthsEnabled(MONTHS.map((m) => m.n))}
                >
                  Select all
                </button>
                <button
                  type="button"
                  className="mlGhostBtn"
                  onClick={() => setMonthsEnabled([])}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="mlMonthGrid">
              {MONTHS.map((m) => {
                const selected = monthsEnabled.includes(m.n);
                return (
                  <button
                    key={m.n}
                    type="button"
                    className={`mlChip ${selected ? "selected" : ""}`}
                    onClick={() => toggleMonth(m.n)}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>

            <div className="mlHint">
              {allSelected ? "All months enabled." : `${monthsEnabled.length} month(s) selected.`}
            </div>
          </div>

          {(localError || error) && (
            <div className="mlErrorBox">{localError || error}</div>
          )}
        </div>

        <div className="mlModalFooter">
          <button className="mlBtnSecondary" onClick={onClose} type="button" disabled={saving}>
            Cancel
          </button>
          <button className="mlBtnPrimary" onClick={submit} type="button" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "./expensesTable.css";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function daysInMonth(year, month1to12) {
  return new Date(year, month1to12, 0).getDate();
}

function makeEmptyRow() {
  return {
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    description: "",
    amounts: {},
  };
}

export default function ExpensesMonthTable() {
  const selectedYear = useSelector((s) => s.years.selectedYear);
  const selectedMonth = useSelector((s) => s.ui.selectedMonth);

  const [rows, setRows] = useState(() => Array.from({ length: 10 }, makeEmptyRow));
  const [editing, setEditing] = useState(null); // { rowId, key: 'desc' | `d_${day}` }
  const [draft, setDraft] = useState("");

  const [menu, setMenu] = useState(null); // { x, y, rowId }
  const menuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menu) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      setMenu(null);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menu]);

  const yearNum = selectedYear?.year;
  const monthNum = selectedMonth;

  const dayMeta = useMemo(() => {
    if (!yearNum || !monthNum) return [];
    const count = daysInMonth(yearNum, monthNum);
    return Array.from({ length: count }, (_, i) => {
      const day = i + 1;
      const weekday = WEEKDAYS[new Date(yearNum, monthNum - 1, day).getDay()];
      return { day, weekday };
    });
  }, [yearNum, monthNum]);

  if (!selectedYear || !selectedMonth) return null;

  const monthLabel = `${MONTHS[monthNum - 1]} ${yearNum}`;

  const startEdit = (rowId, key, currentValue) => {
    setEditing({ rowId, key });
    setDraft(currentValue ?? "");
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft("");
  };

  const saveEdit = () => {
    if (!editing) return;
    const { rowId, key } = editing;
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        if (key === "desc") return { ...r, description: draft };
        // day cell
        const day = key.startsWith("d_") ? key.slice(2) : key;
        return {
          ...r,
          amounts: { ...r.amounts, [day]: draft },
        };
      })
    );
    cancelEdit();
  };

  const onCellContextMenu = (e, rowId) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, rowId });
  };

  const addRowBelow = (rowId) => {
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.id === rowId);
      if (idx < 0) return [...prev, makeEmptyRow()];
      const next = [...prev];
      next.splice(idx + 1, 0, makeEmptyRow());
      return next;
    });
    setMenu(null);
  };

  const removeRow = (rowId) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.id !== rowId);
      return next.length ? next : [makeEmptyRow()];
    });
    setMenu(null);
    if (editing?.rowId === rowId) cancelEdit();
  };

  return (
    <div className="mlExpensesWrap">
      <div className="mlExpensesInfo">
        <div className="mlExpensesTitle">Expenses sheet</div>
        <div className="mlExpensesSub">
          This table is for tracking expenses for <strong>{monthLabel}</strong>. Click any cell to enter values.
          Right-click any cell to add or remove rows.
        </div>
      </div>

      <div className="mlExpensesTableShell">
        <table className="mlExpensesTable">
          <thead>
            <tr>
              <th className="mlStickyCol mlHeadDesc">Description</th>
              {dayMeta.map(({ day, weekday }) => (
                <th key={day} className="mlDayHead">
                  <div className="mlDayNum">{day}</div>
                  <div className="mlDayName">{weekday}</div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td
                  className="mlStickyCol mlCellDesc"
                  onContextMenu={(e) => onCellContextMenu(e, row.id)}
                  onClick={() => startEdit(row.id, "desc", row.description)}
                >
                  {editing?.rowId === row.id && editing?.key === "desc" ? (
                    <div className="mlEditWrap">
                      <input
                        autoFocus
                        className="mlCellInput"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit();
                          if (e.key === "Escape") cancelEdit();
                        }}
                      />
                      <button type="button" className="mlTickBtn" onClick={saveEdit} aria-label="Save">
                        ✓
                      </button>
                    </div>
                  ) : (
                    <span className={row.description ? "" : "mlPlaceholder"}>
                      {row.description || "Click to enter"}
                    </span>
                  )}
                </td>

                {dayMeta.map(({ day }) => {
                  const key = `d_${day}`;
                  const val = row.amounts?.[String(day)] ?? "";
                  const isEditing = editing?.rowId === row.id && editing?.key === key;

                  return (
                    <td
                      key={key}
                      className="mlCell"
                      onContextMenu={(e) => onCellContextMenu(e, row.id)}
                      onClick={() => startEdit(row.id, key, val)}
                    >
                      {isEditing ? (
                        <div className="mlEditWrap">
                          <input
                            autoFocus
                            className="mlCellInput mlNumInput"
                            inputMode="decimal"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit();
                              if (e.key === "Escape") cancelEdit();
                            }}
                          />
                          <button type="button" className="mlTickBtn" onClick={saveEdit} aria-label="Save">
                            ✓
                          </button>
                        </div>
                      ) : (
                        <span className={val ? "" : "mlPlaceholder"}>{val || ""}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {menu ? (
        <div
          ref={menuRef}
          className="mlContextMenu"
          style={{ top: menu.y, left: menu.x }}
          role="menu"
        >
          <button type="button" className="mlMenuItem" onClick={() => addRowBelow(menu.rowId)}>
            Add row below
          </button>
          <button type="button" className="mlMenuItem danger" onClick={() => removeRow(menu.rowId)}>
            Remove row
          </button>
        </div>
      ) : null}
    </div>
  );
}

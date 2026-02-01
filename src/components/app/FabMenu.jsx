import React, { useEffect, useMemo, useRef, useState } from "react";
import "./fabMenu.css";

export default function FabMenu({ actions = [] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const visibleActions = useMemo(
    () => actions.filter((a) => !a.hidden),
    [actions]
  );

  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  if (!visibleActions.length) return null;

  return (
    <div className="mlFabRoot" ref={rootRef}>
      <div className={`mlFabMenu ${open ? "open" : ""}`}>
        {visibleActions.map((a) => (
          <button
            key={a.key}
            className={`mlFabMenuItem ${a.disabled ? "disabled" : ""}`}
            onClick={() => {
              if (a.disabled) return;
              setOpen(false);
              a.onClick?.();
            }}
            type="button"
          >
            <span className="mlFabMenuIcon">{a.icon || "＋"}</span>
            <span className="mlFabMenuText">{a.label}</span>
          </button>
        ))}
      </div>

      <button
        className={`mlFabButton ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Add"
        type="button"
      >
        <span className="mlFabPlus">+</span>
      </button>
    </div>
  );
}

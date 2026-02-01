import React from "react";
import "./bottomNav.css";

export default function BottomNav({ activeKey, onSelect }) {
  const items = [
    { key: "YEARS", label: "Years", icon: "📁" },
    { key: "EXPENSES", label: "Expenses", icon: "🧾", disabled: true },
    { key: "BALANCE", label: "Balance", icon: "💰", disabled: true },
  ];

  return (
    <div className="mlBottomNav" role="navigation" aria-label="Bottom navigation">
      {items.map((it) => (
        <button
          key={it.key}
          type="button"
          className={`mlBottomNavBtn ${activeKey === it.key ? "isActive" : ""}`}
          onClick={() => !it.disabled && onSelect(it.key)}
          disabled={it.disabled}
        >
          <span className="mlBottomNavIcon" aria-hidden="true">{it.icon}</span>
          <span className="mlBottomNavLabel">{it.label}</span>
        </button>
      ))}
    </div>
  );
}

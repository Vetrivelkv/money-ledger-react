import React, { useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import "./appBar.css";

export default function AppBar({ onLogout }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const initial = useMemo(() => {
    const n = user?.userName || user?.email || "";
    return n.trim() ? n.trim()[0].toUpperCase() : "U";
  }, [user]);

  return (
    <header className="mlAppBar">
      <div className="mlAppBar__left" />

      <div className="mlAppBar__center">
        <div className="mlAppBar__logo" aria-hidden="true">
          ML
        </div>
        <div className="mlAppBar__title">Money Ledger</div>
      </div>

      <div className="mlAppBar__right">
        <button
          type="button"
          className="mlAvatar"
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          title={user?.userName || user?.email || "User"}
        >
          {initial}
        </button>

        {menuOpen ? (
          <div className="mlMenu" role="menu">
            <button
              type="button"
              className="mlMenu__item"
              onClick={() => {
                setMenuOpen(false);
                onLogout?.();
              }}
              role="menuitem"
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}

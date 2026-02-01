import React from "react";
import "./authLayout.css";

export default function AuthLayout({ children }) {
  return (
    <div className="authShell">
      <div className="authLeft">
        <div className="authCard">
          <div className="authBrand">
            <div className="authLogo" aria-hidden="true">
              ML
            </div>
            <div>
              <div className="authBrandName">Money Ledger</div>
              <div className="authBrandTag">Track your monthly expenses</div>
            </div>
          </div>

          <div className="authBody">{children}</div>

          <div className="authFoot">
            © {new Date().getFullYear()} Money Ledger
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../routes/paths";

export default function AppHome() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h2 style={{ margin: 0 }}>App Home (Placeholder)</h2>
      <p style={{ color: "rgba(15,23,42,0.7)" }}>
        This is where your Years ➜ Months ➜ Expenses table will go after we add authentication and protected routes.
      </p>
      <Link to={PATHS.REGISTER}>Go back to Register</Link>
    </div>
  );
}

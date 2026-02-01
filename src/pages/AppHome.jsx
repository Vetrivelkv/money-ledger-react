import React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "../components/app/AppBar";
import { useAuth } from "../auth/AuthContext";
import { PATHS } from "../routes/paths";
import "./appHome.css";
import YearsGrid from "../components/YearsGrid";
import MonthsGrid from "../components/MonthsGrid";
import { useSelector } from "react-redux";

export default function AppHome() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const onLogout = async () => {
    await logout();
    navigate(PATHS.LOGIN, { replace: true });
  };

  const view = useSelector((state) => state.ui.view);

  const state = useSelector((state) => state);
  console.log(state, "entire state");

  return (
    <div className="mlAppShell">
      <AppBar onLogout={onLogout} />

      <main className="mlAppContent">
        <h2 className="mlAppHeading">
          Welcome{user?.userName ? `, ${user.userName}` : ""}!
        </h2>
        <p className="mlAppSubtext">
          You are logged in and your browser should now have an{" "}
          <strong>httpOnly</strong> session cookie. Next, we’ll build the Years
          → Months → Expenses UI here.
        </p>

        {view === "YEARS" && <YearsGrid />}
        {view === "MONTHS" && <MonthsGrid />}
      </main>
    </div>
  );
}

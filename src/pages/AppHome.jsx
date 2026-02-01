import React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "../components/app/AppBar";
import { useAuth } from "../auth/AuthContext";
import { PATHS } from "../routes/paths";
import "./appHome.css";

export default function AppHome() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const onLogout = async () => {
    await logout();
    navigate(PATHS.LOGIN, { replace: true });
  };

  return (
    <div className="mlAppShell">
      <AppBar onLogout={onLogout} />

      <main className="mlAppContent">
        <h2 className="mlAppHeading">Welcome{user?.userName ? `, ${user.userName}` : ""}!</h2>
        <p className="mlAppSubtext">
          You are logged in and your browser should now have an <strong>httpOnly</strong> session cookie.
          Next, we’ll build the Years → Months → Expenses UI here.
        </p>
      </main>
    </div>
  );
}

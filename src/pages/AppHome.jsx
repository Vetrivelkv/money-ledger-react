import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppBar from "../components/app/AppBar";
import Breadcrumb from "../components/app/Breadcrumb";
import BottomNav from "../components/app/BottomNav";
import { useAuth } from "../auth/AuthContext";
import { PATHS } from "../routes/paths";
import "./appHome.css";
import YearsGrid from "../components/YearsGrid";
import MonthsGrid from "../components/MonthsGrid";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedYear, fetchYears, selectYear } from "../store/yearsSlice";
import { setView } from "../store/uiSlice";

export default function AppHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const onLogout = async () => {
    await logout();
    navigate(PATHS.LOGIN, { replace: true });
  };

  const view = useSelector((state) => state.ui.view);
  const years = useSelector((state) => state.years.list);

  // Ensure years are in Redux once (used by deep-linking too)
  useEffect(() => {
    if (!years?.length) dispatch(fetchYears());
  }, []);

  // URL-driven view state (so browser Back works)
  useEffect(() => {
    const y = searchParams.get("year");

    if (!y) {
      dispatch(clearSelectedYear());
      dispatch(setView("YEARS"));
      return;
    }

    // When ?year= is present, switch to months and select that year
    const yearNum = Number(y);
    if (!Number.isFinite(yearNum)) {
      setSearchParams({});
      dispatch(clearSelectedYear());
      dispatch(setView("YEARS"));
      return;
    }

    if (years?.length) {
      const found = years.find((it) => it.year === yearNum);
      if (found) {
        dispatch(selectYear(found));
        dispatch(setView("MONTHS"));
      } else {
        // invalid year in URL
        setSearchParams({});
        dispatch(clearSelectedYear());
        dispatch(setView("YEARS"));
      }
    }
  }, [searchParams, years]);

  const goYears = () => setSearchParams({});
  const pickYear = (y) => setSearchParams({ year: String(y.year) });

  return (
    <div className="mlAppShell">
      <AppBar onLogout={onLogout} />

      <main className="mlAppContent">
        <div className="mlCenterCard">
          <div className="mlCenterTop">
            <Breadcrumb view={view} onGoYears={goYears} />
          </div>

          <div className="mlCenterHeader">
            <h2 className="mlAppHeading">
              Welcome{user?.userName ? `, ${user.userName}` : ""}!
            </h2>
            <p className="mlAppSubtext">
              Pick a year to view enabled months. We’ll add Expenses and Balance next.
            </p>
          </div>

          {view === "YEARS" && <YearsGrid onPickYear={pickYear} />}
          {view === "MONTHS" && <MonthsGrid />}
        </div>
      </main>

      <BottomNav
        activeKey="YEARS"
        onSelect={(key) => {
          if (key === "YEARS") goYears();
        }}
      />
    </div>
  );
}

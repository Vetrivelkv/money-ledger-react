import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppBar from "../components/app/AppBar";
import Breadcrumb from "../components/app/Breadcrumb";
import BottomNav from "../components/app/BottomNav";
import FabMenu from "../components/app/FabMenu";
import AddYearDialog from "../components/app/AddYearDialog";
import { useAuth } from "../auth/AuthContext";
import { PATHS } from "../routes/paths";
import "./appHome.css";
import YearsGrid from "../components/YearsGrid";
import MonthsGrid from "../components/MonthsGrid";
import BalanceOverview from "../components/BalanceOverview";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedYear, createYear, fetchYears, selectYear } from "../store/yearsSlice";
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

  const creatingYear = useSelector((state) => state.years.creating);
  const yearsError = useSelector((state) => state.years.error);
  const [addYearOpen, setAddYearOpen] = useState(false);

  // Ensure years are in Redux once (used by deep-linking too)
  useEffect(() => {
    if (!years?.length) dispatch(fetchYears());
  }, []);

  // URL-driven view state (so browser Back works)
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "balance") {
      dispatch(clearSelectedYear());
      dispatch(setView("BALANCE"));
      return;
    }

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
  const goBalance = () => setSearchParams({ tab: "balance" });

  const fabActions = useMemo(
    () => [
      {
        key: "addYear",
        label: "Add year",
        icon: "Y",
        disabled: false,
        hidden: view !== "YEARS",
        onClick: () => setAddYearOpen(true),
      },
      {
        key: "addMonth",
        label: "Add month",
        icon: "M",
        disabled: true,
      },
      {
        key: "addExpense",
        label: "Add expense",
        icon: "$",
        disabled: true,
      },
      {
        key: "addBalance",
        label: "Add balance",
        icon: "B",
        disabled: true,
      },
    ],
    [view]
  );

  const onSaveYear = async ({ year, monthsEnabled }) => {
    try {
      // backend accepts { year, months }
      await dispatch(createYear({ year, months: monthsEnabled })).unwrap();
      setAddYearOpen(false);
    } catch (e) {
      // keep dialog open; error is shown from Redux
    }
  };

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
              {view === "BALANCE"
                ? "Your overall balance is the sum of all monthly balances. Transactions are sorted by the most recent date."
                : "Pick a year to view enabled months. We’ll add Expenses and Balance next."}
            </p>
          </div>

          {view === "YEARS" && <YearsGrid onPickYear={pickYear} />}
          {view === "MONTHS" && <MonthsGrid />}
          {view === "BALANCE" && <BalanceOverview />}
        </div>
      </main>

      <FabMenu actions={fabActions} />
      <AddYearDialog
        open={addYearOpen}
        onClose={() => setAddYearOpen(false)}
        onSave={onSaveYear}
        saving={creatingYear}
        error={yearsError}
      />

      <BottomNav
        activeKey={view === "BALANCE" ? "BALANCE" : "YEARS"}
        onSelect={(key) => {
          if (key === "YEARS") goYears();
          if (key === "BALANCE") goBalance();
        }}
      />
    </div>
  );
}

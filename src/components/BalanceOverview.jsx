import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBalances, fetchUserTransactions } from "../store/balancesSlice";
import Button from "./ui/Button";
import AllTransactionsDialog from "./app/AllTransactionsDialog";
import "./balanceOverview.css";

export default function BalanceOverview() {
  const dispatch = useDispatch();

  const totalCurrentBalance = useSelector((s) => s.balances.totalCurrentBalance);
  const recentTransactions = useSelector((s) => s.balances.recentTransactions);
  const allTransactions = useSelector((s) => s.balances.allTransactions);
  const loadingBalances = useSelector((s) => s.balances.loadingBalances);
  const loadingRecent = useSelector((s) => s.balances.loadingRecent);
  const loadingAll = useSelector((s) => s.balances.loadingAll);
  const error = useSelector((s) => s.balances.error);

  const [allOpen, setAllOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllBalances());
    dispatch(fetchUserTransactions({ limit: 10 }));
  }, []);

  const openAll = async () => {
    setAllOpen(true);
    // Load all txns only when needed
    if (!allTransactions?.length) {
      await dispatch(fetchUserTransactions({ limit: 0 }));
    }
  };

  const headerHint = useMemo(() => {
    if (loadingBalances) return "Loading balances...";
    if (error) return error;
    return "Total of current balances across all months.";
  }, [loadingBalances, error]);

  return (
    <div className="mlBalanceWrap">
      <div className="mlBalanceTop">
        <div>
          <h2 className="mlBalanceTitle">Overall Balance</h2>
          <p className="mlBalanceHint">{headerHint}</p>
        </div>

        <div className="mlBalanceTotal">
          <div className="mlBalanceTotalLabel">Total</div>
          <div className="mlBalanceTotalValue">
            {Number(totalCurrentBalance || 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mlBalanceSection">
        <div className="mlBalanceSectionHeader">
          <h3 className="mlBalanceSectionTitle">Recent Transactions</h3>
          <Button variant="secondary" onClick={openAll}>
            View all transactions
          </Button>
        </div>

        {loadingRecent ? (
          <div className="mlHint">Loading recent transactions...</div>
        ) : recentTransactions?.length ? (
          <div className="mlTxnTableWrap">
            <table className="mlTxnTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Month</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t) => (
                  <tr
                    key={t.id || `${t.balanceId}-${t.createdAt}`}
                    className={t.type === "DEBIT" ? "isDebit" : "isCredit"}
                  >
                    <td>{new Date(t.createdAt).toLocaleString()}</td>
                    <td>{t.type}</td>
                    <td>{t.amount}</td>
                    <td>{t.description}</td>
                    <td>{t.year}-{String(t.month).padStart(2, "0")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mlHint">No transactions yet.</div>
        )}
      </div>

      <AllTransactionsDialog
        open={allOpen}
        onClose={() => setAllOpen(false)}
        transactions={allTransactions}
        loading={loadingAll}
      />
    </div>
  );
}

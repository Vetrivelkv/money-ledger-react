import React from "react";
import "./addYearDialog.css";
import "../balanceOverview.css";

export default function AllTransactionsDialog({ open, onClose, transactions = [], loading }) {
  if (!open) return null;

  return (
    <div className="mlModalOverlay" role="dialog" aria-modal="true">
      <div className="mlModal mlTxnModal">
        <div className="mlModalHeader">
          <div>
            <h3 className="mlModalTitle">All Transactions</h3>
            <p className="mlModalSubtitle">
              {loading ? "Loading..." : `${transactions.length} transaction(s)`}
            </p>
          </div>
          <button className="mlModalClose" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="mlModalBody">
          {loading ? (
            <div className="mlHint">Fetching transactions...</div>
          ) : transactions.length ? (
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
                  {transactions.map((t) => (
                    <tr key={t.id || `${t.balanceId}-${t.createdAt}`}
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

        <div className="mlModalFooter">
          <button className="mlBtnPrimary" onClick={onClose} type="button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

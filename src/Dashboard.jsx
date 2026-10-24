import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { api } from "./api";
import BalanceCard from "./components/BalanceCard";
import QuickActions from "./components/QuickActions";
import Transaction from "./components/Transaction";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [account, setAccount] = useState(null);
  const [txns, setTxns] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const me = await api("/account/me");
        const list = await api("/account/transactions");
        setAccount(me);
        setTxns(list.slice(0, 5));
      } catch (err) {
        if (err.message === "Invalid token" || err.message === "Not logged in") {
          logout();
        } else {
          setError(err.message);
        }
      }
    }
    load();
  }, [logout]);

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}</h1>
      <p style={{ color: "var(--muted)" }}>Here's an overview of your account</p>

      {error && <div className="form-error">{error}</div>}
      {!account && !error && <p>Loading...</p>}

      {account && (
        <div className="dashboard-grid" style={{ marginTop: 24 }}>
          <BalanceCard
            balance={account.balance}
            accountNumber={account.account_number}
          />
          <div className="card">
            <h3>Quick Actions</h3>
            <QuickActions />
          </div>
          <div className="card" style={{ gridColumn: "1 / -1" }}>
            <h3>Recent Transactions</h3>
            {txns.length === 0 ? (
              <p style={{ color: "var(--muted)" }}>No transactions yet.</p>
            ) : (
              <ul className="txn-list">
                {txns.map((t) => (
                  <Transaction key={t.id} txn={t} />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
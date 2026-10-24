import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { toPaise } from "../format";

export default function Transfer() {
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const paise = toPaise(amount);
    if (!toAccount || !paise || paise <= 0) {
      setError("Enter a valid account number and amount");
      return;
    }
    try {
      await api("/account/transfer", {
        method: "POST",
        body: { toAccount: toAccount.trim(), amount: paise },
      });
      setSuccess("Transfer successful!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="dashboard">
      <h1>Transfer Money</h1>
      <form className="card form-card" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <label>Recipient Account Number</label>
        <input value={toAccount} onChange={(e) => setToAccount(e.target.value)}
               placeholder="e.g. BE0000000002" />

        <label>Amount (₹)</label>
        <input type="number" step="0.01" min="0" value={amount}
               onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 500" />

        <button className="btn-primary">Send Money</button>
      </form>
    </div>
  );
}
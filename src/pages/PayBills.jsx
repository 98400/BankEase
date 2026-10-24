import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { toPaise } from "../format";

const BILLERS = ["Electricity", "Water", "Mobile Recharge", "Internet", "Gas"];

export default function PayBills() {
  const [biller, setBiller] = useState(BILLERS[0]);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const paise = toPaise(amount);
    if (!paise || paise <= 0) {
      setError("Enter a valid amount");
      return;
    }
    try {
      await api("/account/pay-bill", { method: "POST", body: { biller, amount: paise } });
      setSuccess(`${biller} bill paid successfully!`);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="dashboard">
      <h1>Pay Bills</h1>
      <form className="card form-card" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <label>Biller</label>
        <select value={biller} onChange={(e) => setBiller(e.target.value)}>
          {BILLERS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>

        <label>Amount (₹)</label>
        <input type="number" step="0.01" min="0" value={amount}
               onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 1200" />

        <button className="btn-primary">Pay Now</button>
      </form>
    </div>
  );
}
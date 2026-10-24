export default function BalanceCard({ balance, accountNumber }) {
  const rupees = (balance / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  return (
    <div className="balance-card">
      <div className="label">Available Balance</div>
      <div className="amount">{rupees}</div>
      {accountNumber && <div className="label">A/C: {accountNumber}</div>}
    </div>
  );
}
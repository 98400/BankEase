export default function Transaction({ txn }) {
  const credit = txn.type === "deposit" || txn.type === "transfer_in";
  const rupees = (txn.amount / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
  const date = new Date(txn.created_at).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <li className="txn-item">
      <div>
        <div>{txn.title || txn.counterparty || txn.type}</div>
        <small style={{ color: "var(--muted)" }}>{date}</small>
      </div>
      <span className={credit ? "txn-credit" : "txn-debit"}>
        {credit ? "+" : "-"}
        {rupees}
      </span>
    </li>
  );
}
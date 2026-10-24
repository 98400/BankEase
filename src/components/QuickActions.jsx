import { useNavigate } from "react-router-dom";
import { FiList, FiCreditCard, FiSend, FiFileText } from "react-icons/fi";

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="quick-actions">
      <button onClick={() => navigate("/transactions")}><FiList /> View Transactions</button>
      <button onClick={() => navigate("/cards")}><FiCreditCard /> Manage Cards</button>
      <button onClick={() => navigate("/transfer")}><FiSend /> Transfer Money</button>
      <button onClick={() => navigate("/pay-bills")}><FiFileText /> Pay Bills</button>
    </div>
  );
}
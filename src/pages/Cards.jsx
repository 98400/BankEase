import { useEffect, useState } from "react";
import { api } from "../api";

export default function Cards() {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/account/cards").then(setCards).catch((e) => setError(e.message));
  }, []);

  async function toggleFreeze(id) {
    try {
      const updated = await api(`/account/cards/${id}/freeze`, { method: "PATCH" });
      setCards(cards.map((c) => (c.id === id ? { ...c, frozen: updated.frozen } : c)));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="dashboard">
      <h1>My Cards</h1>
      {error && <div className="form-error">{error}</div>}

      <div className="cards-grid">
        {cards.map((c) => (
          <div key={c.id}>
            <div className={c.frozen ? "bank-card frozen" : "bank-card"}>
              <div className="card-type">{c.type} Card</div>
              <div className="card-number">**** **** **** {c.last4}</div>
              <div className="card-status">{c.frozen ? "FROZEN" : "ACTIVE"}</div>
            </div>
            <button className="btn-primary" onClick={() => toggleFreeze(c.id)}>
              {c.frozen ? "Unfreeze Card" : "Freeze Card"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
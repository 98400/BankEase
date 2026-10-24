import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">

      <div className="navbar-brand">
        <h2>BankEase</h2>
      </div>

      <div className="navbar-links">

        <NavLink to="/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/transactions">
          Transactions
        </NavLink>

        <NavLink to="/cards">
          Cards
        </NavLink>

        <NavLink to="/profile">
          Profile
        </NavLink>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;
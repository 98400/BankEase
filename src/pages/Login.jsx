import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { api } from "../api";

function Login() {
  const [customerId, setCustomerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!customerId || !password) {
      setError("Please enter Customer ID and Password");
      return;
    }
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: { customerId, password },
      });
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="brand">BankEase</h1>
        <p className="tagline">Digital Banking Customer Portal</p>

        <h2>Welcome Back</h2>
        <p className="muted">Login to access your account</p>

        {error && <div className="form-error">{error}</div>}

        <label>Customer ID</label>
        <input
          type="text"
          placeholder="Enter your Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-primary" type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
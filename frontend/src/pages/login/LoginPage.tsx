import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import "./LoginPage.css"

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [area, setArea] = useState("Indonesia");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password, area }),
      });

      // Expected backend response:
      // { accessToken, user }

      login(data.accessToken, data.user);
      navigate("/feed");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div className="container">
      <div className="title">Login</div>

      {error ? <p className="error" style={{ color: "lightcoral" }}>{error}</p> : <p className="not-error">a</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />

        <label htmlFor="area">Area</label>
        <select value={area} onChange={(e) => setArea(e.target.value)}>
          <option>Indonesia</option>
          <option>China</option>
          <option>America</option>
        </select>

        <br />

        <button type="submit">Login</button>
      </form>
      <br />
      <div>Don't have an account? <Link to="/register">Register</Link></div>
    </div>
  );
}

export default LoginPage;

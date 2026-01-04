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

    if (!username || !password) {
        setError("Please fill all fields");
        return;
    }

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password, area }),
      });

      // Expected backend response:
      // { accessToken, user }
      console.log(data);
      login(data.accessToken, data.refreshToken, data.user);
      navigate("/feed");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div className="login-container">
      <div className="login-title">Login</div>

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
      <br />
      {error ? <p className="login-error">{error}</p> : <p className="login-not-error">a</p>}
    </div>
  );
}

export default LoginPage;

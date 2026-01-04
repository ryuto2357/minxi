import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/client";
import "./RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [area, setArea] = useState("Indonesia");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
          confirmPassword,
          area,
        }),
      });

      setSuccess("Register successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.message || "Register failed");
    }
  }

  return (
    <div className="register-container">
      <div className="register-title">Register</div>

      

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <br />

        <label htmlFor="area">Area</label>
        <select value={area} onChange={(e) => setArea(e.target.value)}>
          <option>Indonesia</option>
          <option>China</option>
          <option>America</option>
        </select>

        <br />

        <button type="submit">Register</button>
      </form>

      <br />
      <div>
        Already have an account? <Link to="/login">Login</Link>
      </div>
      <br />
      {error ? <p className="register-error">{error}</p> : <p className="register-not-error">a</p>}
      {success ? <p className="register-success">{success}</p> : <p className="register-not-success">a</p>}
    </div>
  );
}

export default RegisterPage;


import { useState } from "react";
import api from "./api/axios";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      if (user.role !== "admin") {
        setError("Access denied. Admin account required.");
        return;
      }

      localStorage.setItem("fixnestToken", token);
      localStorage.setItem("fixnestUser", JSON.stringify(user));

      onLogin(user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07111f",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "25px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#101d2e",
          border: "1px solid #1e334d",
          borderRadius: "18px",
          padding: "35px",
          boxSizing: "border-box",
          boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "45px", marginBottom: "10px" }}>
            🛠️
          </div>

          <p
            style={{
              color: "#00d4ff",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "2px",
              margin: "0 0 8px",
            }}
          >
            FIXNEST
          </p>

          <h1 style={{ color: "#ffffff", margin: 0 }}>
            Admin Login
          </h1>

          <p style={{ color: "#9fb0c5", marginTop: "10px" }}>
            Sign in to manage community issues.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: "block",
              color: "#dbe7f3",
              marginBottom: "7px",
              fontSize: "14px",
            }}
          >
            Admin Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter admin email"
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px",
              marginBottom: "18px",
              background: "#0b1726",
              color: "#ffffff",
              border: "1px solid #29445e",
              borderRadius: "9px",
              outline: "none",
              fontSize: "14px",
            }}
          />

          <label
            style={{
              display: "block",
              color: "#dbe7f3",
              marginBottom: "7px",
              fontSize: "14px",
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px",
              marginBottom: "20px",
              background: "#0b1726",
              color: "#ffffff",
              border: "1px solid #29445e",
              borderRadius: "9px",
              outline: "none",
              fontSize: "14px",
            }}
          />

          {error && (
            <div
              style={{
                background: "#351b20",
                border: "1px solid #69323a",
                color: "#ff8585",
                padding: "11px",
                borderRadius: "8px",
                marginBottom: "18px",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "9px",
              background: "#00d4ff",
              color: "#00121c",
              fontWeight: "700",
              fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;

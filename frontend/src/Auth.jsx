
import { useState } from "react";
import api from "./api/axios";

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [society, setSociety] = useState("");
const [block, setBlock] = useState("");
const [flatNumber, setFlatNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!isLogin) {
  await api.post("/auth/register", {
    name,
    email,
    password,
    society,
    block,
    flatNumber,
  });

        setMessage("Registration successful! Logging you in...");
      }

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("fixnestToken", token);
      localStorage.setItem("fixnestUser", JSON.stringify(user));

      onAuthSuccess(user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07111f",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      color: "white"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "430px",
        background: "#101d2e",
        padding: "35px",
        borderRadius: "18px",
        border: "1px solid #1e334d"
      }}>
        <h1 style={{ textAlign: "center" }}>
          Fix<span style={{ color: "#00d4ff" }}>Nest</span>
        </h1>

        <h2 style={{ textAlign: "center" }}>
          {isLogin ? "Welcome Back!" : "Create Account"}
        </h2>

        <p style={{ color: "#9fb0c5", textAlign: "center" }}>
          {isLogin
            ? "Login to your resident account"
            : "Join your community today"}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          )}
          {!isLogin && (
  <>
    <input
      type="text"
      placeholder="Society Name"
      value={society}
      onChange={(e) => setSociety(e.target.value)}
      required
      style={inputStyle}
    />

    <input
      type="text"
      placeholder="Block"
      value={block}
      onChange={(e) => setBlock(e.target.value)}
      required
      style={inputStyle}
    />

    <input
      type="text"
      placeholder="Flat Number"
      value={flatNumber}
      onChange={(e) => setFlatNumber(e.target.value)}
      required
      style={inputStyle}
    />
  </>
)}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password (minimum 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
            style={inputStyle}
          />

          {message && (
            <p style={{ color: "#35e58a" }}>{message}</p>
          )}

          {error && (
            <p style={{ color: "#ff8585" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "15px",
              border: "none",
              borderRadius: "9px",
              background: "#00d4ff",
              color: "#00121c",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {loading
              ? "Please wait..."
              : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p style={{
          textAlign: "center",
          marginTop: "22px",
          color: "#cbd5e1"
        }}>
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={() => {
  setIsLogin(!isLogin);
  setError("");
  setMessage("");
  setName("");
  setEmail("");
  setPassword("");
  setSociety("");
  setBlock("");
  setFlatNumber("");
}}
            style={{
              background: "none",
              border: "none",
              color: "#00d4ff",
              cursor: "pointer",
              marginLeft: "5px"
            }}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  marginTop: "18px",
  borderRadius: "8px",
  border: "1px solid #29445e",
  background: "#0b1726",
  color: "white",
  outline: "none"
};

export default Auth;

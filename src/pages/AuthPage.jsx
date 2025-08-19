// src/pages/AuthPage.jsx
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/AuthPage.css";

export default function AuthPage() {
  const { login: doLogin } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = isSignUp
        ? "http://localhost:5000/api/auth/signup"
        : "http://localhost:5000/api/auth/login";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || "Something went wrong");

      doLogin(isSignUp ? data : data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  return (
    <motion.div
      className={`auth-container ${isSignUp ? "right-panel-active" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Sign Up */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required={isSignUp}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Sign In */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>

      {/* Overlay */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>Already have an account? Sign in here</p>
            <button className="ghost" onClick={() => setIsSignUp(false)}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello!!!</h1>
            <p>Don’t have an account? Sign up here</p>
            <button className="ghost" onClick={() => setIsSignUp(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

  import { useState } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import { useAuth } from "../auth/AuthContext";
  import "../styles/Signup.css"; // ✅ Import CSS

  export default function Signup() {
    const { login: doLogin } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");

      try {
        const res = await axios.post("http://localhost:5000/api/auth/signup", form);

        doLogin(res.data); // ✅ save to context
        navigate("/dashboard"); // ✅ go to dashboard
      } catch (err) {
        setError(err.response?.data?.message || "Signup failed");
      }
    };

    return (
      <div className="signup-container">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2 className="signup-title">Sign Up</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <p className="signup-error">{error}</p>}
          <button type="submit">Sign Up</button>
        </form>
      </div>
    );
  }

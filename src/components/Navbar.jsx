// src/components/Navbar.jsx
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="navbar-brand">
          AI Mock Interview
        </Link>
      </div>

      <ul className="navbar-links">
        {user && (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/aptitude">Aptitude</Link>
            </li>
            <li>
              <Link to="/interview">Interview</Link>
            </li>
            <li>
              <Link to="/company-questions">Company Qs</Link>
            </li>
            <li>
              <Link to="/me">Profile</Link>
            </li>
            <li>
              <button
                className="logout-button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </li>
          </>
        )}
        {!user && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

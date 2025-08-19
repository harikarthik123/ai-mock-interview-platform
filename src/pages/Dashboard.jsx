// pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css"; // Make sure you have styles for .dashboard-container etc.
import l from "../assets/l.png";
import m from "../assets/m.jpeg";
import n from "../assets/n.jpeg";
import v from "../assets/v.jpeg";

export default function Dashboard() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Aptitude Test",
      description: "Practice quantitative, logical & verbal tests with levels.",
      image: l,
      route: "/aptitude",
    },
    {
      title: "Mock Interview",
      description: "Experience real-time AI avatar interviews.",
      image: m,
      route: "/interview",
    },
    {
      title: "Company Questions",
      description: "Solve previous year company-specific questions.",
      image: n,
      route: "/company-questions",
    },
    {
      title: "Resume Upload",
      description: "Upload your resume and get AI-powered suggestions.",
      image: v, // Put a relevant image in public/images/
      route: "/resume",
    },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome to Your Dashboard</h2>
      <div className="card-grid">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card"
            onClick={() => navigate(feature.route)}
          >
            <img src={feature.image} alt={feature.title} />
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

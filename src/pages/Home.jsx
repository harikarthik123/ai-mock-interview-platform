// src/pages/Home.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import i from "../assets/i.jpg";
import j from "../assets/j.png";
import k from "../assets/k.jpeg";

export default function Home() {
  useEffect(() => {
    const reveal = () => {
      const reveals = document.querySelectorAll(".reveal");
      for (let el of reveals) {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 150;
        if (revealTop < windowHeight - revealPoint) {
          el.classList.add("active");
        } else {
          el.classList.remove("active");
        }
      }
    };
    window.addEventListener("scroll", reveal);
    reveal();
    return () => window.removeEventListener("scroll", reveal);
  }, []);

  return (
    <>
      

      <header className="hero">
        <h1>Welcome to AI Mock Interview Platform</h1>
        <p>Train smarter. Get hired faster.</p>
      </header>

      <section className="features">
        <div className="feature-card reveal">
          <img src={i} alt="Interview" />
          <h3>Realistic Interview Avatars</h3>
          <p>Simulate real interviews with AI-driven speaking avatars.</p>
        </div>
        <div className="feature-card reveal">
          <img src={j} alt="Dashboard" />
          <h3>Personalized Dashboard</h3>
          <p>Track your performance across tests and mock interviews.</p>
        </div>
        <div className="feature-card reveal">
          <img src={k} alt="Resume" />
          <h3>Resume Upload</h3>
          <p>Analyze and improve your resume using AI suggestions.</p>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 AI Mock Interview. All rights reserved.</p>
      </footer>
    </>
  );
}

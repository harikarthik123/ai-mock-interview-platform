// components/Aptitude/AptitudeSelection.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AptitudeSelection.css";

export default function AptitudeSelection() {
  const [category, setCategory] = useState("Quantitative");
  const [difficulty, setDifficulty] = useState("Easy");
  const navigate = useNavigate();

  const startTest = () => {
    navigate(`/aptitude/test?category=${category}&difficulty=${difficulty}`);
  };

  return (
    <div className="aptitude-selection-container">
      <h2>Select Test Configuration</h2>
      <div className="selection-box">
        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Quantitative</option>
          <option>Logical Reasoning</option>
          <option>Verbal Ability</option>
        </select>

        <label>Difficulty:</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <button onClick={startTest}>Start Test</button>
      </div>
    </div>
  );
}

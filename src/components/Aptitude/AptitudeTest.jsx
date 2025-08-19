import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/AptitudeTest.css";

export default function AptitudeTest() {
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Extract category & difficulty from query params
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category") || "Quantitative";
  const difficulty = queryParams.get("difficulty") || "Easy";

  // ✅ Fetch a single aptitude question once
  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/generate-aptitude-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, difficulty }),
        });
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuestion(data.questions[0]);
        }
      } catch (err) {
        console.error("Error fetching aptitude question:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [category, difficulty]);

  // Timer logic
  useEffect(() => {
    if (timeLeft === 0) {
      setShowResult(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Save result after test is over
  useEffect(() => {
    if (showResult && question) {
      fetch("http://localhost:5000/api/test-history/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ category, score, total: 1 }),
      })
        .then((res) => res.json())
        .then((data) => console.log("✅ Test history saved:", data))
        .catch((err) => console.error("❌ Failed to save test:", err));
    }
  }, [showResult]);

  // ✅ Handle Answer
  const handleAnswer = () => {
    if (selected === question.answer) {
      setScore(1); // since only 1 question
    }
    setShowResult(true);
  };

  if (loading) {
    return <p>Loading question...</p>;
  }

  if (!question) {
    return <p>No question available.</p>;
  }

  if (showResult) {
    return (
      <div className="aptitude-result">
        <h2>Test Completed!</h2>
        <p>Your Score: {score} / 1</p>
        <button onClick={() => navigate("/history")}>View Test History</button>
      </div>
    );
  }

  return (
    <div className="aptitude-container">
      <h2>{category} Aptitude Test</h2>
      <p className="aptitude-timer">Time Left: {timeLeft}s</p>

      <p className="aptitude-question">{question.question}</p>
      <div className="aptitude-options">
        {question.options.map((opt, i) => (
          <div key={i}>
            <label>
              <input
                type="radio"
                name="option"
                value={opt}
                checked={selected === opt}
                onChange={() => setSelected(opt)}
              />
              {opt}
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleAnswer}
        className="aptitude-next-btn"
        disabled={!selected}
      >
        Submit
      </button>
    </div>
  );
}

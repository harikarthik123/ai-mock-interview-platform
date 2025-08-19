import { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please login again.");
      return;
    }

    fetch("http://localhost:5000/api/test-history", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Send token in proper format
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to fetch history");
        }
        return res.json();
      })
      .then((data) => setHistory(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h2>User Test History</h2>
      {error && <p style={{ color: "red" }}>❌ {error}</p>}
      <ul>
        {history.map((h, i) => (
          <li key={i}>
            {h.testName} - {h.score} points
          </li>
        ))}
      </ul>
    </div>
  );
}

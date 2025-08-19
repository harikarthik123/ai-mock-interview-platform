// src/components/interview/InterviewSessionBox.jsx
import { useEffect, useState, useRef } from "react";
import "../../styles/InterviewSessionBox.css";
import InterviewRecorder from "./InterviewRecorder";

// --- small helper to salvage/repair LLM JSON that comes with prose or missing commas ---
function tryParseQuestionsPayload(obj) {
  // expected shape: { questions: [...] }
  if (obj && Array.isArray(obj.questions)) return obj.questions;
  return null;
}

function extractAndRepairJSONArray(raw = "") {
  if (!raw || typeof raw !== "string") return null;
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return null;

  let arrText = raw.slice(start, end + 1);

  // fix common LLM issues: "}{" → "}, {"
  arrText = arrText.replace(/\}\s*\{/g, "}, {");

  // Sometimes trailing commas sneak in: ", ]" → "]"
  arrText = arrText.replace(/,\s*\]/g, "]");

  // Ensure keys are quoted (usually fine already); keep it minimal to avoid over-fixing.

  try {
    return JSON.parse(arrText);
  } catch {
    return null;
  }
}

function normalizeQuestions(arr) {
  if (!Array.isArray(arr)) return [];
  // Convert strings → {question, answer:null}
  return arr
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string") return { question: item, answer: "" };
      if (typeof item === "object") {
        if (item.question) return { question: String(item.question), answer: String(item.answer || "") };
        // sometimes LLM returns {q: "..."} or similar
        const key = Object.keys(item).find((k) => k.toLowerCase().includes("question"));
        if (key) return { question: String(item[key]), answer: String(item.answer || "") };
      }
      return null;
    })
    .filter(Boolean);
}

export default function InterviewSessionBox() {
  const storedConfig = JSON.parse(localStorage.getItem("interviewConfig") || "{}");
  const defaultConfig = {
    domain: storedConfig.domain || "Web Development",
    difficulty: storedConfig.difficulty || "Easy",
    avatar: storedConfig.avatar || "Male",
  };

  const [config] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [canRecord, setCanRecord] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const currentUtterance = useRef(null);

  const currentQuestion = questions[questionIndex]?.question || "";

  useEffect(() => {
    let cancelled = false;

    const fetchQuestions = async () => {
      setLoading(true);
      setFetchError("");

      try {
        const res = await fetch("http://localhost:5000/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            domain: config.domain,
            difficulty: config.difficulty,
          }),
        });

        // Try normal path first
        if (res.ok) {
          const data = await res.json();
          const okArr = tryParseQuestionsPayload(data);
          if (okArr) {
            if (cancelled) return;
            const normalized = normalizeQuestions(okArr);
            if (normalized.length === 0) throw new Error("Empty questions array from server.");
            setQuestions(normalized);
            setQuestionIndex(0);
            // speak first question
            speak(normalized[0].question);
            return;
          }
        }

        // Not OK or shape unexpected — try to salvage from { raw } if provided
        let bodyText = "";
        try {
          bodyText = await res.text();
        } catch {
          // ignore
        }

        let rawCandidate = "";
        try {
          const maybeJson = JSON.parse(bodyText);
          rawCandidate = maybeJson?.raw || bodyText;
        } catch {
          rawCandidate = bodyText;
        }

        const repaired = extractAndRepairJSONArray(rawCandidate);
        const normalized = normalizeQuestions(repaired);

        if (!normalized || normalized.length === 0) {
          throw new Error("Could not parse questions from the model output.");
        }

        if (cancelled) return;
        setQuestions(normalized);
        setQuestionIndex(0);
        speak(normalized[0].question);
      } catch (err) {
        console.error("Error fetching/repairing questions:", err);
        if (cancelled) return;

        // Final fallback: 2 safe defaults
        const fallback = normalizeQuestions([
          {
            question:
              "In an Operating System, explain how deadlock can be prevented and detected. Compare Banker's algorithm with wait-die and wound-wait schemes.",
            answer:
              "Prevention uses strategies to break Coffman conditions. Detection uses wait-for graphs and recovery. Banker's is avoidance; wait-die/wound-wait are non-preemptive/preemptive timestamp schemes to prevent circular wait.",
          },
          {
            question:
              "Design a scheduler for a system with mixed workloads (interactive + batch) that balances latency and throughput. Which policies and data structures would you use?",
            answer:
              "Use MLFQ for interactive tasks (aging, priority boost) and CFQ/weighted fair queuing for batch. Keep per-queue run lists (deque), track vruntime/credits, and enforce time-slicing with preemption.",
          },
        ]);

        setQuestions(fallback);
        setQuestionIndex(0);
        setFetchError(err?.message || "Failed to fetch questions.");
        speak(fallback[0].question);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchQuestions();
    return () => {
      cancelled = true;
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Speak the current question aloud
  const speak = (text) => {
    stopSpeaking(); // cancel any previous
    try {
      const u = new SpeechSynthesisUtterance(text);
      currentUtterance.current = u;
      setSpeaking(true);
      setCanRecord(false);
      u.onend = () => {
        setSpeaking(false);
        setCanRecord(true); // allow recording after TTS finishes
      };
      u.onerror = () => {
        setSpeaking(false);
        setCanRecord(true); // still allow recording if TTS fails
      };
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.warn("Speech synthesis failed:", e);
      setSpeaking(false);
      setCanRecord(true);
    }
  };

  const stopSpeaking = () => {
    try {
      window.speechSynthesis.cancel();
    } catch {}
    setSpeaking(false);
  };

  const handleSpeakAgain = () => {
    if (currentQuestion) speak(currentQuestion);
  };

  const handleNext = () => {
    stopSpeaking();
    setCanRecord(false);
    setSpeaking(true); // temporarily lock record until new question is read

    setTimeout(() => {
      // move to next or finish
      if (questionIndex < questions.length - 1) {
        const nextIdx = questionIndex + 1;
        setQuestionIndex(nextIdx);
        const nextQ = questions[nextIdx]?.question || "";
        if (nextQ) speak(nextQ);
      } else {
        setSpeaking(false);
        setCanRecord(false);
        alert("✅ Interview Completed!");
      }
    }, 50);
  };

  return (
    <div className="interview-container">
      <h2 className="interview-title">
        Mock Interview — {config.domain} ({config.difficulty})
      </h2>

      {loading && <p>Generating questions…</p>}
      {!loading && fetchError && (
        <p style={{ color: "#b91c1c" }}>⚠️ {fetchError} (using fallback)</p>
      )}

      {!loading && !!questions.length && (
        <div className="interview-content">
          <div className="speech-box">
            <p className="label">Question {questionIndex + 1} of {questions.length}</p>
            <p className="avatar-text">“{currentQuestion}”</p>

            <div className="controls">
              <button onClick={handleSpeakAgain} disabled={speaking}>
                {speaking ? "Speaking…" : "Read Aloud Again"}
              </button>
              <button
                className="next-button"
                onClick={handleNext}
                disabled={speaking}
                title={speaking ? "Wait until reading finishes" : "Go to next question"}
              >
                Next Question
              </button>
            </div>
          </div>

          <InterviewRecorder
            canRecord={canRecord}
            questionIndex={questionIndex}
          />
        </div>
      )}
    </div>
  );
}

// src/components/interview/InterviewRecorder.jsx
import { useEffect, useRef, useState } from "react";

export default function InterviewRecorder({
  canRecord = false,
  questionIndex = 0,
  onUploadComplete = () => {},
}) {
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    return () => {
      // cleanup on unmount
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try { mediaRecorderRef.current.stop(); } catch {}
      }
    };
  }, []);

  const getBestMimeType = () => {
    // pick a widely supported audio container
    if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
    if (MediaRecorder.isTypeSupported("audio/ogg")) return "audio/ogg";
    return ""; // let browser decide
  };

  const startRecording = async () => {
    setError("");
    if (!canRecord) {
      alert("Please wait until the question is finished being read.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getBestMimeType();
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mr;

      const chunks = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      mr.onstop = () => {
        const type = mimeType || "audio/webm";
        const blob = new Blob(chunks, { type });
        setRecordedBlob(blob);
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch {}
      };

      mr.start();
      setRecording(true);
      setRecordedBlob(null);
    } catch (err) {
      console.error("mic error", err);
      setError("Could not access microphone. Please allow mic permission.");
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    } catch (e) {
      console.warn("stop failed", e);
    }
    setRecording(false);
  };

  const downloadRecording = () => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `answer_q${questionIndex}.webm`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const uploadRecording = async () => {
    if (!recordedBlob) {
      alert("No recorded answer to upload.");
      return;
    }
    setUploading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("audio", recordedBlob, `answer_q${questionIndex}.webm`);
      form.append("questionIndex", questionIndex);

      // If you have a backend route, uncomment and use it:
      // const resp = await fetch("http://localhost:5000/upload-answer-audio", {
      //   method: "POST",
      //   body: form,
      // });
      // const body = await resp.json();
      // onUploadComplete(body);

      // For now, just simulate a successful upload:
      setTimeout(() => {
        onUploadComplete({ success: true, transcription: "(demo) transcription here", analysis: null });
        setUploading(false);
        alert("Uploaded (demo). Wire your backend to process it.");
      }, 800);
    } catch (err) {
      console.error("upload error", err);
      setError("Failed to upload audio for analysis.");
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!audioPlayerRef.current || !recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    audioPlayerRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [recordedBlob]);

  return (
    <div className="mt-8 w-full text-center interview-recorder">
      <h3 className="text-xl font-semibold mb-4">Answer Recorder</h3>

      <div className="mt-2 space-x-4">
        {!recording ? (
          <button onClick={startRecording} className="btn btn-start" disabled={!canRecord}>
            Start Answer (Record)
          </button>
        ) : (
          <button onClick={stopRecording} className="btn btn-stop">
            Stop Recording
          </button>
        )}

        {recordedBlob && (
          <>
            <button onClick={downloadRecording} className="btn btn-download">
              Download Recording
            </button>
            <button onClick={uploadRecording} className="btn btn-upload" disabled={uploading}>
              {uploading ? "Uploading…" : "Upload for Analysis"}
            </button>
          </>
        )}
      </div>

      <div className="mt-4">
        <audio ref={audioPlayerRef} controls style={{ width: 320 }} />
      </div>

      {error && <p style={{ color: "#b91c1c", marginTop: 12 }}>⚠️ {error}</p>}
    </div>
  );
}

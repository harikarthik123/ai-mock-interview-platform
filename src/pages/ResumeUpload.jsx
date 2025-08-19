import { useState } from "react";
import "../styles/ResumeUpload.css";

export default function ResumeUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      setStatus("❌ Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Resume uploaded successfully.");
        if (onUploadSuccess) onUploadSuccess(data.filePath);
      } else {
        setStatus(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed.");
    }
  };

  return (
    <div className="resume-container">
      <input type="file" accept="application/pdf" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
      {status && <p>{status}</p>}
    </div>
  );
}



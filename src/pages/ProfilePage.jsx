// ProfilePage.jsx
import { useEffect, useState } from "react";
import ResumeUpload from "./ResumeUpload";
import PhotoUpload from "./PhotoUpload";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          setResumeUrl(data.user.resume || "");
        } else {
          console.error("Fetch profile failed:", data.message);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleResumeUploadSuccess = (url) => {
    setResumeUrl(url);
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      <div className="profile-details">
        {/* ✅ Just render the PhotoUpload with default photo */}
        <PhotoUpload />

        {/* ✅ User Info */}
        <div className="profile-info">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>

      {/* ✅ Resume Section */}
      <div className="profile-resume">
        <h2>Resume</h2>
        {resumeUrl ? (
          <iframe
            src={`http://localhost:5000/${resumeUrl}`}
            width="100%"
            height="500px"
            title="Resume"
          />
        ) : (
          <p>No resume uploaded yet.</p>
        )}
        <ResumeUpload onUploadSuccess={handleResumeUploadSuccess} />
      </div>
    </div>
  );
}

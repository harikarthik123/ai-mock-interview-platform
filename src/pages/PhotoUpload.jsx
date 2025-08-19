// src/components/PhotoUpload.jsx
import defaultPhoto from "../assets/profile.png"; // 👈 make sure you have profile.png in assets

export default function PhotoUpload() {
  return (
    <div className="photo-upload">
      <img
        src={defaultPhoto}
        alt="Profile"
        style={{ width: "150px", height: "150px", borderRadius: "50%" }}
      />
    </div>
  );
}

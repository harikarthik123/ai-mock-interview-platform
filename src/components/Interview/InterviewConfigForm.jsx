// InterviewConfigForm.jsx (unchanged)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/InterviewConfigForm.css'; // Make sure to import the CSS

export default function InterviewConfigForm() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('Easy');
  const [domain, setDomain] = useState('Web Development');
  const [avatar, setAvatar] = useState('Male');

  const handleStartInterview = (e) => {
    e.preventDefault();
    const config = { difficulty, domain, avatar };
    localStorage.setItem('interviewConfig', JSON.stringify(config));
    navigate('/interview/session');
  };

  return (
    <div className="container">
      <form onSubmit={handleStartInterview} className="form-box">
        <h2 className="form-title">Configure Your Mock Interview</h2>

        <div className="form-group">
          <label className="form-label">Select Difficulty:</label>
          <select
            className="form-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option>Easy</option>
            <option>Moderate</option>
            <option>Difficult</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Select Domain:</label>
          <select
            className="form-select"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          >
            <option>Web Development</option>
            <option>Java</option>
            <option>DSA</option>
            <option>DBMS</option>
            <option>Operating Systems</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Select Avatar:</label>
          <select
            className="form-select"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          >
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        <button type="submit" className="form-button">
          Start Interview
        </button>
      </form>
    </div>
  );
}

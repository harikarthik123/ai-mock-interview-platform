// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Aptitude from "./pages/Aptitude";
import InterviewConfig from "./pages/InterviewConfig";
import InterviewSession from "./pages/InterviewSession";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Navbar from "./components/Navbar.jsx";
import "./index.css";
import ResumeUpload from "./pages/ResumeUpload.jsx";

import CompanyQuestions from "./pages/CompanyQuestions";
import History from "./pages/History";
import AptitudeSelection from "./components/Aptitude/AptitudeSelection";
import AptitudeTest from "./components/Aptitude/AptitudeTest";
import { useLocation } from "react-router-dom";
import AuthPage from "./pages/AuthPage"; // ✅ New combined auth page
import ProfilePage from "./pages/ProfilePage.jsx";

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();

  // Hide Navbar on auth routes
  const hideNavbarRoutes = ["/", "/auth"];
  const shouldShowNavbar =
    user && !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        {/* Redirect root ("/") to auth */}
        <Route path="/" element={<AuthPage />} />

        {/* ✅ New combined Auth Page */}
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/aptitude"
          element={
            <ProtectedRoute>
              <Aptitude />
            </ProtectedRoute>
          }
        />

        <Route
          path="/aptitude/selection"
          element={
            <ProtectedRoute>
              <AptitudeSelection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/aptitude/test"
          element={
            <ProtectedRoute>
              <AptitudeTest />
            </ProtectedRoute>
          }
        />

        

        <Route
          path="/company-questions"
          element={
            <ProtectedRoute>
              <CompanyQuestions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <InterviewConfig />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <ResumeUpload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview/session"
          element={
            <ProtectedRoute>
              <InterviewSession />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from "./auth/AuthContext";
// ❌ REMOVE this import:
// import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

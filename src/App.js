import React, { useState } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import StudentPage from './pages/StudentPage';
import FacultyPage from './pages/FacultyPage';
import AdminPage from './pages/AdminPage';

const ROLE_META = {
  student: { label: 'Student', icon: '◈', color: '#4ecdc4' },
  faculty: { label: 'Faculty', icon: '◉', color: '#5b8dee' },
  admin:   { label: 'Admin',   icon: '◆', color: '#c9a96e' },
};

export default function App() {
  const [auth, setAuth] = useState(null);

  const handleLogin = (role, name) => setAuth({ role, name });
  const handleLogout = () => setAuth(null);

  if (!auth) return <LoginPage onLogin={handleLogin} />;

  const meta = ROLE_META[auth.role];

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">⬡</span>
          <span className="brand-name">BIBLIOTHECA</span>
        </div>

        <div className="nav-center">
          <span
            className="active-portal-badge"
            style={{ color: meta.color, borderColor: `${meta.color}44`, background: `${meta.color}11` }}
          >
            <span>{meta.icon}</span> {meta.label} Portal
          </span>
        </div>

        <div className="nav-right">
          <div className="nav-user">
            <div className="user-avatar" style={{ background: `${meta.color}22`, color: meta.color }}>
              {auth.name.charAt(0)}
            </div>
            <div className="user-info">
              <span className="user-name">{auth.name}</span>
              <span className="user-role">{meta.label}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>⎋ Logout</button>
        </div>
      </nav>

      <main className="main-content">
        {auth.role === 'student' && <StudentPage userName={auth.name} />}
        {auth.role === 'faculty' && <FacultyPage userName={auth.name} />}
        {auth.role === 'admin'   && <AdminPage   userName={auth.name} />}
      </main>

      <footer className="footer">
        <span>BIBLIOTHECA © 2025 — Library Management System</span>
      </footer>
    </div>
  );
}
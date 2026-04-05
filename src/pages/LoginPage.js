import React, { useState } from 'react';
import './LoginPage.css';

const CREDENTIALS = {
  student: { id: 'CS2021045', password: 'student123', name: 'Arjun Sharma' },
  faculty: { id: 'FAC2024001', password: 'faculty123', name: 'Dr. Meera Nair' },
  admin:   { id: 'ADMIN001',   password: 'admin123',   name: 'System Administrator' },
};

const ROLES = [
  {
    key: 'student',
    label: 'Student',
    icon: '◈',
    color: '#4ecdc4',
    idLabel: 'Roll Number',
    idPlaceholder: 'e.g. CS2021045',
    tagline: 'Access your library, borrow books, track dues.',
    hint: 'ID: CS2021045 · Pass: student123',
  },
  {
    key: 'faculty',
    label: 'Faculty',
    icon: '◉',
    color: '#5b8dee',
    idLabel: 'Faculty ID',
    idPlaceholder: 'e.g. FAC2024001',
    tagline: 'Manage requests, recommend books, guide students.',
    hint: 'ID: FAC2024001 · Pass: faculty123',
  },
  {
    key: 'admin',
    label: 'Admin',
    icon: '◆',
    color: '#c9a96e',
    idLabel: 'Admin ID',
    idPlaceholder: 'e.g. ADMIN001',
    tagline: 'Full system control — users, catalog, reports.',
    hint: 'ID: ADMIN001 · Pass: admin123',
  },
];

export default function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const role = ROLES.find(r => r.key === selectedRole);

  const handleRoleSelect = (key) => {
    setSelectedRole(key);
    setUserId('');
    setPassword('');
    setError('');
  };

  const handleBack = () => {
    setSelectedRole(null);
    setUserId('');
    setPassword('');
    setError('');
  };

  const handleLogin = async () => {
    if (!userId || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');

    await new Promise(r => setTimeout(r, 900));

    const creds = CREDENTIALS[selectedRole];
    if (userId === creds.id && password === creds.password) {
      onLogin(selectedRole, creds.name);
    } else {
      setLoading(false);
      setError('Invalid credentials. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="login-root">
      {/* Ambient background */}
      <div className="login-bg">
        <div className="bg-orb orb1" style={role ? { background: `radial-gradient(circle, ${role.color}22 0%, transparent 70%)` } : {}} />
        <div className="bg-orb orb2" />
        <div className="bg-grid" />
      </div>

      {/* Left brand panel */}
      <div className="login-brand">
        <div className="brand-content">
          <div className="brand-hex">⬡</div>
          <h1 className="brand-wordmark">Lib Smart</h1>
          <p className="brand-sub">Library Management System</p>
          <div className="brand-divider" />
          <div className="brand-quotes">
            <blockquote>"A library is not a luxury but one of the necessities of life."</blockquote>
            <cite>— Henry Ward Beecher</cite>
          </div>
          <div className="brand-stats">
            <div className="bstat"><span className="bstat-val">4,281</span><span className="bstat-label">Books</span></div>
            <div className="bstat-sep" />
            <div className="bstat"><span className="bstat-val">863</span><span className="bstat-label">Members</span></div>
            <div className="bstat-sep" />
            <div className="bstat"><span className="bstat-val">347</span><span className="bstat-label">Issued</span></div>
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div className="login-panel">
        <div className={`login-card ${shake ? 'shake' : ''}`}>

          {/* Role selector */}
          {!selectedRole && (
            <div className="login-card-inner role-select-view">
              <div className="lc-tag">Welcome back</div>
              <h2 className="lc-title">Sign in as</h2>
              <p className="lc-desc">Choose your role to continue to your portal</p>

              <div className="role-options">
                {ROLES.map(r => (
                  <button
                    key={r.key}
                    className="role-option"
                    style={{ '--role-color': r.color }}
                    onClick={() => handleRoleSelect(r.key)}
                  >
                    <div className="role-opt-icon" style={{ color: r.color }}>{r.icon}</div>
                    <div className="role-opt-info">
                      <div className="role-opt-label">{r.label}</div>
                      <div className="role-opt-tagline">{r.tagline}</div>
                    </div>
                    <div className="role-opt-arrow" style={{ color: r.color }}>→</div>
                  </button>
                ))}
              </div>

              <div className="lc-footer-note">
                Bibliotheca v2.0 · Academic Year 2024–25
              </div>
            </div>
          )}

          {/* Login form */}
          {selectedRole && role && (
            <div className="login-card-inner form-view">
              <button className="back-btn" onClick={handleBack}>← Back</button>

              <div className="form-role-badge" style={{ color: role.color, borderColor: `${role.color}44`, background: `${role.color}11` }}>
                <span>{role.icon}</span> {role.label} Portal
              </div>

              <h2 className="lc-title" style={{ marginTop: '1rem' }}>
                Sign in to<br />
                <span style={{ color: role.color, fontStyle: 'italic' }}>{role.label} Portal</span>
              </h2>

              <div className="form-group">
                <label className="form-label">{role.idLabel}</label>
                <input
                  className="form-input"
                  style={{ '--focus-color': role.color }}
                  type="text"
                  placeholder={role.idPlaceholder}
                  value={userId}
                  onChange={e => { setUserId(e.target.value); setError(''); }}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrap">
                  <input
                    className="form-input"
                    style={{ '--focus-color': role.color, paddingRight: '3rem' }}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    onKeyDown={handleKeyDown}
                  />
                  <button className="toggle-pass" onClick={() => setShowPass(s => !s)} tabIndex={-1}>
                    {showPass ? '◔' : '○'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="form-error">⚠ {error}</div>
              )}

              <button
                className="login-btn"
                style={{ '--role-color': role.color, background: role.color }}
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner" />
                    Authenticating...
                  </span>
                ) : (
                  `Sign In as ${role.label}`
                )}
              </button>

              <div className="demo-hint">
                <span className="hint-label">Demo credentials:</span>
                <span className="hint-val">{role.hint}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
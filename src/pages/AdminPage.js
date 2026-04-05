import React, { useState } from 'react';

const users = [
  { id: 'STU001', name: 'Arjun Sharma', role: 'Student', dept: 'CSE', borrowed: 3, fine: 40, status: 'active' },
  { id: 'FAC002', name: 'Dr. Meera Nair', role: 'Faculty', dept: 'CSE', borrowed: 1, fine: 0, status: 'active' },
  { id: 'STU003', name: 'Priya Mehta', role: 'Student', dept: 'ECE', borrowed: 2, fine: 0, status: 'active' },
  { id: 'STU004', name: 'Rohit Kumar', role: 'Student', dept: 'ME', borrowed: 5, fine: 80, status: 'blocked' },
  { id: 'FAC005', name: 'Prof. Anil Gupta', role: 'Faculty', dept: 'Math', borrowed: 0, fine: 0, status: 'active' },
  { id: 'STU006', name: 'Sneha Gupta', role: 'Student', dept: 'CSE', borrowed: 1, fine: 0, status: 'active' },
];

const adminActions = [
  { icon: '📚', title: 'Add New Book', desc: 'Register a new book into the catalog with full metadata' },
  { icon: '👤', title: 'Register User', desc: 'Create student or faculty accounts and assign library IDs' },
  { icon: '⚡', title: 'Issue Book', desc: 'Manually issue a book directly to a registered member' },
  { icon: '↩️', title: 'Process Return', desc: 'Handle book returns and auto-calculate fines' },
  { icon: '📊', title: 'Generate Report', desc: 'Export usage stats, fine reports, and catalog summaries' },
  { icon: '🔔', title: 'Send Notices', desc: 'Broadcast due-date reminders and overdue alerts' },
];

export default function AdminPage() {
  const [usersData, setUsersData] = useState(users);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleBlock = (id) =>
    setUsersData(u => u.map(x => x.id === id
      ? { ...x, status: x.status === 'blocked' ? 'active' : 'blocked' }
      : x));

  const filtered = usersData.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="page-hero">
        <div className="hero-bg" style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 20%, rgba(201,169,110,0.06) 0%, transparent 70%)' }} />
        <div className="hero-tag">Admin Portal</div>
        <h1 className="hero-title">
          Control &amp; <span style={{ color: 'var(--admin)' }}>Oversee</span>
        </h1>
        <p className="hero-subtitle">System Administrator · Full Access · Last login: Today 09:41 AM</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { label: 'Total Books', value: '4,281', delta: '+18 this week' },
          { label: 'Active Members', value: '863', delta: '12 pending approval' },
          { label: 'Books Issued', value: '347', delta: '28 overdue' },
          { label: 'Total Fines', value: '₹6.2K', delta: '₹1.8K uncollected' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: 'var(--admin)', fontSize: '1.9rem' }}>{s.value}</div>
            <div className="stat-delta">{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">Quick Actions</div>
        </div>
        <div className="admin-grid" style={{ padding: 0 }}>
          {adminActions.map((a, i) => (
            <div className="action-card" key={i}>
              <div className="action-icon">{a.icon}</div>
              <div className="action-title">{a.title}</div>
              <div className="action-desc">{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* User Management */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">User Management</div>
          <button className="section-action">+ Add User</button>
        </div>

        {/* Search */}
        <div className="search-bar" style={{ margin: '0 0 1.25rem 0' }}>
          <span className="search-icon">⌕</span>
          <input
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Borrowed</th>
                <th>Fine (₹)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-dim)' }}>{u.id}</span></td>
                  <td><span className="table-name">{u.name}</span></td>
                  <td>
                    <span className={`badge ${u.role === 'Faculty' ? 'badge-gold' : 'badge-blue'}`}>{u.role}</span>
                  </td>
                  <td>{u.dept}</td>
                  <td style={{ textAlign: 'center' }}>{u.borrowed}</td>
                  <td style={{ color: u.fine > 0 ? 'var(--accent-red)' : 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
                    {u.fine > 0 ? `₹${u.fine}` : '—'}
                  </td>
                  <td>
                    <span className={`book-status ${u.status === 'active' ? 'status-available' : 'status-issued'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button onClick={() => toggleBlock(u.id)} style={{
                        background: u.status === 'active' ? 'rgba(255,107,107,0.08)' : 'rgba(78,205,196,0.08)',
                        border: `1px solid ${u.status === 'active' ? 'rgba(255,107,107,0.25)' : 'rgba(78,205,196,0.25)'}`,
                        color: u.status === 'active' ? 'var(--accent-red)' : 'var(--accent-green)',
                        borderRadius: 3, padding: '0.25rem 0.6rem',
                        fontSize: '0.62rem', fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer'
                      }}>{u.status === 'active' ? 'Block' : 'Unblock'}</button>
                      <button style={{
                        background: 'rgba(91,141,238,0.08)', border: '1px solid rgba(91,141,238,0.2)',
                        color: 'var(--accent-blue)', borderRadius: 3, padding: '0.25rem 0.6rem',
                        fontSize: '0.62rem', fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer'
                      }}>Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom panels */}
      <div className="two-col">
        <div className="panel">
          <div className="panel-title">System Activity Log</div>
          {[
            { text: 'Book "Deep Learning" added to catalog', time: '11:30 AM today', color: 'green' },
            { text: 'Fine of ₹80 collected from Rohit Kumar', time: '10:15 AM today', color: 'gold' },
            { text: 'User STU009 registered', time: '09:50 AM today', color: 'blue' },
            { text: '3 overdue notices sent automatically', time: '09:00 AM today', color: '' },
            { text: 'Book "Dune" returned by Arjun Sharma', time: 'Yesterday', color: 'green' },
          ].map((a, i) => (
            <div className="activity-item" key={i}>
              <div className={`activity-dot ${a.color}`} />
              <div>
                <div className="activity-text">{a.text}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-title">Overdue Books</div>
          {[
            { student: 'Rohit Kumar', book: 'Rich Dad Poor Dad', days: 12 },
            { student: 'Amit Verma', book: 'Clean Code', days: 7 },
            { student: 'Priya Mehta', book: 'The Pragmatic Programmer', days: 3 },
          ].map((o, i) => (
            <div className="activity-item" key={i}>
              <div className="activity-dot red" />
              <div style={{ flex: 1 }}>
                <div className="activity-text" style={{ color: 'var(--text)' }}>{o.student}</div>
                <div className="activity-time">{o.book} · <span style={{ color: 'var(--accent-red)' }}>{o.days} days overdue</span></div>
              </div>
              <button style={{
                background: 'none', border: '1px solid var(--border)',
                color: 'var(--text-dim)', borderRadius: 3, padding: '0.2rem 0.5rem',
                fontSize: '0.62rem', fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer',
                flexShrink: 0
              }}>Notify</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
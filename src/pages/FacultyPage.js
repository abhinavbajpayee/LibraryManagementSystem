import React, { useState } from 'react';

const requests = [
  { id: 'REQ001', student: 'Priya Mehta', book: 'Design Patterns', date: '10 Jan', status: 'pending' },
  { id: 'REQ002', student: 'Rohit Kumar', book: 'Operating Systems', date: '09 Jan', status: 'approved' },
  { id: 'REQ003', student: 'Sneha Gupta', book: 'Data Structures', date: '08 Jan', status: 'pending' },
  { id: 'REQ004', student: 'Amit Verma', book: 'Computer Networks', date: '07 Jan', status: 'rejected' },
  { id: 'REQ005', student: 'Riya Sharma', book: 'Machine Learning', date: '06 Jan', status: 'approved' },
];

const recommended = [
  { title: 'Artificial Intelligence: A Modern Approach', author: 'Russell & Norvig', tag: 'AI/ML' },
  { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', tag: 'Engineering' },
  { title: 'Structure and Interpretation', author: 'Abelson & Sussman', tag: 'CS Theory' },
  { title: 'Database System Concepts', author: 'Silberschatz et al.', tag: 'Databases' },
  { title: 'Computer Organization', author: 'Patterson & Hennessy', tag: 'Architecture' },
  { title: 'Introduction to Compilers', author: 'Aho, Lam et al.', tag: 'Theory' },
];

export default function FacultyPage() {
  const [reqs, setReqs] = useState(requests);

  const approve = (id) => setReqs(r => r.map(x => x.id === id ? { ...x, status: 'approved' } : x));
  const reject = (id) => setReqs(r => r.map(x => x.id === id ? { ...x, status: 'rejected' } : x));

  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="page-hero">
        <div className="hero-bg" style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 20%, rgba(91,141,238,0.06) 0%, transparent 70%)' }} />
        <div className="hero-tag">Faculty Portal</div>
        <h1 className="hero-title">
          Manage &amp; <span style={{ color: 'var(--faculty)' }}>Recommend</span>
        </h1>
        <p className="hero-subtitle">Dr. Meera Nair · Department of Computer Science</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { label: 'Pending Requests', value: reqs.filter(r => r.status === 'pending').length, delta: 'Needs attention' },
          { label: 'Approved This Week', value: '14', delta: '+6 vs last week' },
          { label: 'Books Recommended', value: '28', delta: '6 added to catalog' },
          { label: 'Active Students', value: '132', delta: 'Under your dept.' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: 'var(--faculty)', fontSize: '1.9rem' }}>{s.value}</div>
            <div className="stat-delta">{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Borrow Requests */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">Borrow Requests</div>
          <button className="section-action">Export</button>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Student</th>
                <th>Book Title</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reqs.map(r => (
                <tr key={r.id}>
                  <td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: 'var(--text-dim)' }}>{r.id}</span></td>
                  <td><span className="table-name">{r.student}</span></td>
                  <td>{r.book}</td>
                  <td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>{r.date}</span></td>
                  <td>
                    <span className={`book-status ${
                      r.status === 'approved' ? 'status-available'
                      : r.status === 'rejected' ? 'status-issued'
                      : 'status-reserved'
                    }`}>{r.status}</span>
                  </td>
                  <td>
                    {r.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => approve(r.id)} style={{
                          background: 'rgba(78,205,196,0.1)', border: '1px solid rgba(78,205,196,0.3)',
                          color: 'var(--accent-green)', borderRadius: 3, padding: '0.25rem 0.6rem',
                          fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer'
                        }}>✓ Approve</button>
                        <button onClick={() => reject(r.id)} style={{
                          background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
                          color: 'var(--accent-red)', borderRadius: 3, padding: '0.25rem 0.6rem',
                          fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer'
                        }}>✕ Reject</button>
                      </div>
                    )}
                    {r.status !== 'pending' && <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Books */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">Recommended Books</div>
          <button className="section-action">+ Add Book</button>
        </div>
        <div className="cards-grid">
          {recommended.map((book, i) => (
            <div className="book-card" key={i} style={{ '--accent': 'var(--faculty)' }}>
              <div className="book-genre" style={{ color: 'var(--faculty)' }}>{book.tag}</div>
              <div className="book-title">{book.title}</div>
              <div className="book-author">{book.author}</div>
              <div className="book-meta">
                <span className="badge badge-blue">Recommended</span>
                <span className="book-copies" style={{ color: 'var(--faculty)', cursor: 'pointer' }}>Request →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
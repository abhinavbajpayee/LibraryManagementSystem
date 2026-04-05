import React, { useState } from 'react';

const books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic Fiction', status: 'available', copies: 3 },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Computer Science', status: 'issued', copies: 1 },
  { id: 3, title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'History', status: 'available', copies: 5 },
  { id: 4, title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', status: 'reserved', copies: 2 },
  { id: 5, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', status: 'available', copies: 4 },
  { id: 6, title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Philosophy', status: 'issued', copies: 0 },
  { id: 7, title: 'Introduction to Algorithms', author: 'Cormen et al.', genre: 'Computer Science', status: 'available', copies: 2 },
  { id: 8, title: '1984', author: 'George Orwell', genre: 'Dystopia', status: 'available', copies: 6 },
];

const myBorrows = [
  { title: 'Design Patterns', dueDate: '15 Jan 2025', status: 'on-time' },
  { title: 'Rich Dad Poor Dad', dueDate: '02 Jan 2025', status: 'overdue' },
  { title: 'The Psychology of Money', dueDate: '20 Jan 2025', status: 'on-time' },
];

export default function StudentPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const genres = ['All', 'Computer Science', 'Classic Fiction', 'Sci-Fi', 'History', 'Self-Help'];

  const filtered = books.filter(b =>
    (filter === 'All' || b.genre === filter) &&
    (b.title.toLowerCase().includes(search.toLowerCase()) ||
     b.author.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="page-hero">
        <div className="hero-bg" style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 20%, rgba(78,205,196,0.06) 0%, transparent 70%)' }} />
        <div className="hero-tag">Student Portal</div>
        <h1 className="hero-title">
          Discover &amp; <span style={{ color: 'var(--student)' }}>Borrow</span>
        </h1>
        <p className="hero-subtitle">Logged in as: Arjun Sharma · Roll No: CS2021045</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { label: 'Books Borrowed', value: '12', delta: '+3 this month' },
          { label: 'Currently Issued', value: '3', delta: 'Due soon: 1' },
          { label: 'Wishlist', value: '7', delta: '2 now available' },
          { label: 'Fine Pending', value: '₹40', delta: 'Pay now' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: 'var(--student)', fontSize: '1.9rem' }}>{s.value}</div>
            <div className="stat-delta">{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="section">
        <div className="search-bar" style={{ margin: 0 }}>
          <span className="search-icon">⌕</span>
          <input
            placeholder="Search books by title or author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {genres.map(g => (
            <button
              key={g}
              className="search-filter"
              style={filter === g ? { color: 'var(--student)', borderColor: 'var(--student)' } : {}}
              onClick={() => setFilter(g)}
            >{g}</button>
          ))}
        </div>
      </div>

      {/* Book Catalog */}
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <div className="section-title">Book Catalog</div>
          <button className="section-action">View All</button>
        </div>
        <div className="cards-grid">
          {filtered.map(book => (
            <div className="book-card" key={book.id}>
              <div className="book-genre">{book.genre}</div>
              <div className="book-title">{book.title}</div>
              <div className="book-author">{book.author}</div>
              <div className="book-meta">
                <span className={`book-status status-${book.status}`}>{book.status}</span>
                <span className="book-copies">{book.copies} copies</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Borrows + Activity */}
      <div className="two-col">
        <div className="panel">
          <div className="panel-title">My Issued Books</div>
          {myBorrows.map((b, i) => (
            <div className="activity-item" key={i}>
              <div className={`activity-dot ${b.status === 'overdue' ? 'red' : 'green'}`} />
              <div>
                <div className="activity-text" style={{ color: 'var(--text)' }}>{b.title}</div>
                <div className="activity-time">Due: {b.dueDate} · {b.status === 'overdue'
                  ? <span style={{ color: 'var(--accent-red)' }}>OVERDUE</span>
                  : <span style={{ color: 'var(--accent-green)' }}>On Time</span>}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-title">Recent Activity</div>
          {[
            { text: 'Returned "Atomic Habits"', time: '2 hours ago', color: 'green' },
            { text: 'Borrowed "Introduction to Algorithms"', time: 'Yesterday', color: 'blue' },
            { text: 'Reserved "Dune"', time: '3 days ago', color: '' },
            { text: 'Paid fine of ₹20', time: '5 days ago', color: 'green' },
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
      </div>
    </div>
  );
}
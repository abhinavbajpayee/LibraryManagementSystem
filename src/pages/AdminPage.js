import React, { useState } from 'react';
import './AdminPage.css';

/* ── seed data ─────────────────────────────────────────── */
const seedUsers = [
  { id: 'STU001', name: 'Arjun Sharma',     role: 'Student', dept: 'CSE',  borrowed: 3, fine: 40, status: 'active' },
  { id: 'FAC002', name: 'Dr. Meera Nair',   role: 'Faculty', dept: 'CSE',  borrowed: 1, fine: 0,  status: 'active' },
  { id: 'STU003', name: 'Priya Mehta',      role: 'Student', dept: 'ECE',  borrowed: 2, fine: 0,  status: 'active' },
  { id: 'STU004', name: 'Rohit Kumar',      role: 'Student', dept: 'ME',   borrowed: 5, fine: 80, status: 'blocked' },
  { id: 'FAC005', name: 'Prof. Anil Gupta', role: 'Faculty', dept: 'Math', borrowed: 0, fine: 0,  status: 'active' },
  { id: 'STU006', name: 'Sneha Gupta',      role: 'Student', dept: 'CSE',  borrowed: 1, fine: 0,  status: 'active' },
];

const seedBooks = [
  { id: 'B001', title: 'The Great Gatsby',           author: 'F. Scott Fitzgerald', genre: 'Classic Fiction',  copies: 3, available: 3 },
  { id: 'B002', title: 'Clean Code',                  author: 'Robert C. Martin',    genre: 'Computer Science', copies: 2, available: 1 },
  { id: 'B003', title: 'Sapiens',                     author: 'Yuval Noah Harari',   genre: 'History',          copies: 5, available: 5 },
  { id: 'B004', title: 'Dune',                        author: 'Frank Herbert',        genre: 'Sci-Fi',           copies: 2, available: 2 },
  { id: 'B005', title: 'Atomic Habits',               author: 'James Clear',          genre: 'Self-Help',        copies: 4, available: 3 },
  { id: 'B006', title: 'Rich Dad Poor Dad',           author: 'Robert Kiyosaki',     genre: 'Finance',          copies: 3, available: 2 },
  { id: 'B007', title: 'Introduction to Algorithms',  author: 'Cormen et al.',        genre: 'Computer Science', copies: 2, available: 2 },
  { id: 'B008', title: '1984',                        author: 'George Orwell',        genre: 'Dystopia',         copies: 6, available: 6 },
];

const seedIssuances = [
  { id: 'ISS001', userId: 'STU001', userName: 'Arjun Sharma', bookId: 'B002', bookTitle: 'Clean Code',        issueDate: '2025-01-01', dueDate: '2025-01-15', returned: false },
  { id: 'ISS002', userId: 'STU004', userName: 'Rohit Kumar',  bookId: 'B006', bookTitle: 'Rich Dad Poor Dad', issueDate: '2024-12-20', dueDate: '2025-01-03', returned: false },
  { id: 'ISS003', userId: 'STU003', userName: 'Priya Mehta',  bookId: 'B005', bookTitle: 'Atomic Habits',     issueDate: '2025-01-05', dueDate: '2025-01-19', returned: false },
];

const FINE_PER_DAY = 5;
const today = new Date('2025-01-13');

function calcFine(dueDateStr) {
  const due = new Date(dueDateStr);
  const diff = Math.floor((today - due) / 86400000);
  return diff > 0 ? diff * FINE_PER_DAY : 0;
}

function nowStr() {
  return today.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' today';
}

/* ── Modal Shell ───────────────────────────────────────── */
function Modal({ title, subtitle, color = '#c9a96e', onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header" style={{ borderBottomColor: `${color}44` }}>
          <div>
            <div className="modal-title" style={{ color }}>{title}</div>
            {subtitle && <div className="modal-subtitle">{subtitle}</div>}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mfield">
      <label className="mfield-label">{label}</label>
      {children}
    </div>
  );
}

const MInput = (props) => <input className="minput" {...props} />;

const MSelect = ({ children, ...props }) => (
  <select className="minput mselect" {...props}>{children}</select>
);

function Toast({ msg, onDone }) {
  React.useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return <div className="toast"><span className="toast-icon">✓</span>{msg}</div>;
}

/* ════════════════════════════════════════════════════════ */
export default function AdminPage({ userName }) {
  const [usersData,   setUsersData]   = useState(seedUsers);
  const [booksData,   setBooksData]   = useState(seedBooks);
  const [issuances,   setIssuances]   = useState(seedIssuances);
  const [activityLog, setActivityLog] = useState([
    { text: 'Book "Deep Learning" added to catalog',   time: '11:30 AM today', color: 'green' },
    { text: 'Fine of ₹80 collected from Rohit Kumar',  time: '10:15 AM today', color: '' },
    { text: 'User STU009 registered',                  time: '09:50 AM today', color: 'blue' },
    { text: '3 overdue notices sent automatically',    time: '09:00 AM today', color: '' },
    { text: 'Book "Dune" returned by Arjun Sharma',    time: 'Yesterday',      color: 'green' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modal,      setModal]      = useState(null);
  const [toast,      setToast]      = useState(null);

  const closeModal = () => setModal(null);
  const showToast  = (msg) => setToast(msg);
  const log        = (text, color = '') =>
    setActivityLog(l => [{ text, time: nowStr(), color }, ...l]);

  const totalBorrowed = issuances.filter(i => !i.returned).length;
  const totalFines    = usersData.reduce((s, u) => s + u.fine, 0);
  const overdueList   = issuances.filter(i => !i.returned && calcFine(i.dueDate) > 0);

  const toggleBlock = (id) => {
    setUsersData(u => u.map(x => {
      if (x.id !== id) return x;
      const next = x.status === 'blocked' ? 'active' : 'blocked';
      log(`User ${x.name} ${next === 'blocked' ? 'blocked' : 'unblocked'}`, next === 'blocked' ? 'red' : 'green');
      return { ...x, status: next };
    }));
  };

  const filtered = usersData.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-enter">
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      {/* Hero */}
      <div className="page-hero">
        <div className="hero-bg" style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 20%, rgba(201,169,110,0.06) 0%, transparent 70%)' }} />
        <div className="hero-tag">Admin Portal</div>
        <h1 className="hero-title">Control &amp; <span style={{ color: 'var(--admin)' }}>Oversee</span></h1>
        <p className="hero-subtitle">{userName || 'Library Admin'} · Full Access · Last login: Today 09:41 AM</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { label: 'Total Books',    value: booksData.length,                                delta: `${booksData.reduce((s,b)=>s+b.available,0)} available` },
          { label: 'Active Members', value: usersData.filter(u=>u.status==='active').length,  delta: `${usersData.filter(u=>u.status==='blocked').length} blocked` },
          { label: 'Books Issued',   value: totalBorrowed,                                    delta: `${overdueList.length} overdue` },
          { label: 'Total Fines',    value: `₹${totalFines}`,                                 delta: 'Pending collection' },
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
        <div className="section-header"><div className="section-title">Quick Actions</div></div>
        <div className="admin-grid" style={{ padding: 0 }}>
          {[
            { icon: '📚', title: 'Add New Book',    desc: 'Register a new book into the catalog with full metadata',   key: 'addBook' },
            { icon: '👤', title: 'Register User',   desc: 'Create student or faculty accounts and assign library IDs', key: 'registerUser' },
            { icon: '⚡', title: 'Issue Book',      desc: 'Manually issue a book directly to a registered member',     key: 'issueBook' },
            { icon: '↩️', title: 'Process Return',  desc: 'Handle book returns and auto-calculate fines',              key: 'processReturn' },
            { icon: '📊', title: 'Generate Report', desc: 'Export usage stats, fine reports, and catalog summaries',   key: 'report' },
            { icon: '🔔', title: 'Send Notices',    desc: 'Broadcast due-date reminders and overdue alerts',           key: 'notices' },
          ].map((a) => (
            <div className="action-card" key={a.key} onClick={() => setModal(a.key)}>
              <div className="action-icon">{a.icon}</div>
              <div className="action-title">{a.title}</div>
              <div className="action-desc">{a.desc}</div>
              <div className="action-cta">Open →</div>
            </div>
          ))}
        </div>
      </div>

      {/* User Management */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">User Management</div>
          <button className="section-action" onClick={() => setModal('registerUser')}>+ Add User</button>
        </div>
        <div className="search-bar" style={{ margin: '0 0 1.25rem 0' }}>
          <span className="search-icon">⌕</span>
          <input placeholder="Search by name or ID…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Role</th><th>Dept</th><th>Borrowed</th><th>Fine (₹)</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td><span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'0.7rem', color:'var(--text-dim)' }}>{u.id}</span></td>
                  <td><span className="table-name">{u.name}</span></td>
                  <td><span className={`badge ${u.role==='Faculty'?'badge-gold':'badge-blue'}`}>{u.role}</span></td>
                  <td>{u.dept}</td>
                  <td style={{ textAlign:'center' }}>{u.borrowed}</td>
                  <td style={{ color:u.fine>0?'var(--accent-red)':'var(--text-muted)', fontFamily:'JetBrains Mono,monospace', fontSize:'0.8rem' }}>
                    {u.fine>0 ? `₹${u.fine}` : '—'}
                  </td>
                  <td><span className={`book-status ${u.status==='active'?'status-available':'status-issued'}`}>{u.status}</span></td>
                  <td>
                    <button onClick={() => toggleBlock(u.id)} style={{
                      background: u.status==='active'?'rgba(255,107,107,0.08)':'rgba(78,205,196,0.08)',
                      border:`1px solid ${u.status==='active'?'rgba(255,107,107,0.25)':'rgba(78,205,196,0.25)'}`,
                      color: u.status==='active'?'var(--accent-red)':'var(--accent-green)',
                      borderRadius:3, padding:'0.25rem 0.6rem', fontSize:'0.62rem',
                      fontFamily:'JetBrains Mono,monospace', cursor:'pointer'
                    }}>{u.status==='active'?'Block':'Unblock'}</button>
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
          {activityLog.slice(0, 6).map((a, i) => (
            <div className="activity-item" key={i}>
              <div className={`activity-dot ${a.color}`} />
              <div><div className="activity-text">{a.text}</div><div className="activity-time">{a.time}</div></div>
            </div>
          ))}
        </div>
        <div className="panel">
          <div className="panel-title">Overdue Books</div>
          {overdueList.length === 0 && <p style={{ color:'var(--text-dim)', fontSize:'0.8rem' }}>No overdue books 🎉</p>}
          {overdueList.map((o, i) => (
            <div className="activity-item" key={i}>
              <div className="activity-dot red" />
              <div style={{ flex:1 }}>
                <div className="activity-text" style={{ color:'var(--text)' }}>{o.userName}</div>
                <div className="activity-time">{o.bookTitle} · <span style={{ color:'var(--accent-red)' }}>{Math.floor((today-new Date(o.dueDate))/86400000)} days · ₹{calcFine(o.dueDate)} fine</span></div>
              </div>
              <button onClick={() => { showToast(`Reminder sent to ${o.userName}`); log(`Overdue notice sent to ${o.userName}`, 'blue'); }} style={{
                background:'none', border:'1px solid var(--border)', color:'var(--text-dim)',
                borderRadius:3, padding:'0.2rem 0.5rem', fontSize:'0.62rem',
                fontFamily:'JetBrains Mono,monospace', cursor:'pointer', flexShrink:0
              }}>Notify</button>
            </div>
          ))}
        </div>
      </div>

      {/* ══ MODALS ══════════════════════════════════════ */}

      {modal === 'addBook' && (
        <AddBookModal onClose={closeModal} onSubmit={(book) => {
          const newId = `B${String(booksData.length + 1).padStart(3,'0')}`;
          setBooksData(b => [...b, { ...book, id: newId, available: parseInt(book.copies) }]);
          log(`Book "${book.title}" added to catalog`, 'green');
          showToast(`"${book.title}" added successfully!`);
          closeModal();
        }} />
      )}

      {modal === 'registerUser' && (
        <RegisterUserModal onClose={closeModal} usersCount={usersData.length} onSubmit={(user) => {
          setUsersData(u => [...u, user]);
          log(`New ${user.role} "${user.name}" registered (${user.id})`, 'blue');
          showToast(`${user.name} registered successfully!`);
          closeModal();
        }} />
      )}

      {modal === 'issueBook' && (
        <IssueBookModal
          onClose={closeModal}
          users={usersData.filter(u => u.status === 'active')}
          books={booksData.filter(b => b.available > 0)}
          issuances={issuances}
          onSubmit={({ user, book, dueDate }) => {
            const issId = `ISS${String(issuances.length + 1).padStart(3,'0')}`;
            setIssuances(is => [...is, { id:issId, userId:user.id, userName:user.name, bookId:book.id, bookTitle:book.title, issueDate:today.toISOString().slice(0,10), dueDate, returned:false }]);
            setBooksData(b => b.map(x => x.id===book.id ? { ...x, available:x.available-1 } : x));
            setUsersData(u => u.map(x => x.id===user.id ? { ...x, borrowed:x.borrowed+1 } : x));
            log(`"${book.title}" issued to ${user.name}`, 'blue');
            showToast(`Book issued to ${user.name}!`);
            closeModal();
          }}
        />
      )}

      {modal === 'processReturn' && (
        <ProcessReturnModal
          onClose={closeModal}
          issuances={issuances.filter(i => !i.returned)}
          calcFine={calcFine}
          onSubmit={(iss) => {
            const fine = calcFine(iss.dueDate);
            setIssuances(is => is.map(x => x.id===iss.id ? { ...x, returned:true } : x));
            setBooksData(b => b.map(x => x.id===iss.bookId ? { ...x, available:x.available+1 } : x));
            setUsersData(u => u.map(x => x.id===iss.userId ? { ...x, borrowed:Math.max(0,x.borrowed-1), fine:x.fine+fine } : x));
            log(`"${iss.bookTitle}" returned by ${iss.userName}${fine ? ` · Fine: ₹${fine}` : ''}`, fine?'red':'green');
            showToast(`Return processed${fine ? ` · Fine: ₹${fine}` : ' · No fine!'}`);
            closeModal();
          }}
        />
      )}

      {modal === 'report' && (
        <ReportModal onClose={closeModal} users={usersData} books={booksData} issuances={issuances} calcFine={calcFine} />
      )}

      {modal === 'notices' && (
        <NoticesModal
          onClose={closeModal}
          users={usersData}
          overdueList={overdueList}
          calcFine={calcFine}
          onSend={(msg, targets) => {
            log(`Notices sent to ${targets} members`, 'blue');
            showToast(`Notices sent to ${targets} members!`);
            closeModal();
          }}
        />
      )}
    </div>
  );
}

/* ════════ MODAL COMPONENTS ════════════════════════════ */

function AddBookModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ title:'', author:'', genre:'', isbn:'', copies:'1', publisher:'', year:'' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.title && form.author && form.genre && parseInt(form.copies) > 0;

  return (
    <Modal title="📚 Add New Book" subtitle="Register a book into the catalog" color="#c9a96e" onClose={onClose}>
      <div className="mform-grid">
        <Field label="Book Title *"><MInput value={form.title} onChange={e=>set('title',e.target.value)} placeholder="e.g. The Pragmatic Programmer" /></Field>
        <Field label="Author *"><MInput value={form.author} onChange={e=>set('author',e.target.value)} placeholder="e.g. Andrew Hunt" /></Field>
        <Field label="Genre *">
          <MSelect value={form.genre} onChange={e=>set('genre',e.target.value)}>
            <option value="">Select genre…</option>
            {['Computer Science','Classic Fiction','Sci-Fi','History','Self-Help','Finance','Philosophy','Dystopia','Mathematics','Engineering'].map(g=>(
              <option key={g}>{g}</option>
            ))}
          </MSelect>
        </Field>
        <Field label="ISBN"><MInput value={form.isbn} onChange={e=>set('isbn',e.target.value)} placeholder="978-XXXXXXXXXX" /></Field>
        <Field label="Number of Copies *"><MInput type="number" min="1" value={form.copies} onChange={e=>set('copies',e.target.value)} /></Field>
        <Field label="Publisher"><MInput value={form.publisher} onChange={e=>set('publisher',e.target.value)} placeholder="e.g. Addison-Wesley" /></Field>
        <Field label="Publication Year"><MInput type="number" value={form.year} onChange={e=>set('year',e.target.value)} placeholder="e.g. 2024" /></Field>
      </div>
      <div className="mfooter">
        <button className="mbtn-sec" onClick={onClose}>Cancel</button>
        <button className="mbtn-pri" style={{ background:'#c9a96e' }} disabled={!valid} onClick={() => onSubmit(form)}>Add to Catalog</button>
      </div>
    </Modal>
  );
}

function RegisterUserModal({ onClose, onSubmit, usersCount }) {
  const [form, setForm] = useState({ name:'', role:'Student', dept:'CSE', email:'', phone:'' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name && form.dept;

  const handleSubmit = () => {
    const prefix = form.role === 'Student' ? 'STU' : 'FAC';
    const id = `${prefix}${String(usersCount + 1).padStart(3,'0')}`;
    onSubmit({ ...form, id, borrowed:0, fine:0, status:'active' });
  };

  return (
    <Modal title="👤 Register User" subtitle="Create a new library member account" color="#5b8dee" onClose={onClose}>
      <div className="mform-grid">
        <Field label="Full Name *"><MInput value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Ananya Singh" /></Field>
        <Field label="Role *">
          <MSelect value={form.role} onChange={e=>set('role',e.target.value)}>
            <option>Student</option>
            <option>Faculty</option>
          </MSelect>
        </Field>
        <Field label="Department *">
          <MSelect value={form.dept} onChange={e=>set('dept',e.target.value)}>
            {['CSE','ECE','ME','Civil','Math','Physics','Chemistry','MBA'].map(d=><option key={d}>{d}</option>)}
          </MSelect>
        </Field>
        <Field label="Email"><MInput type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="user@juit.ac.in" /></Field>
        <Field label="Phone"><MInput value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="98XXXXXXXX" /></Field>
      </div>
      <div className="mfooter">
        <button className="mbtn-sec" onClick={onClose}>Cancel</button>
        <button className="mbtn-pri" style={{ background:'#5b8dee' }} disabled={!valid} onClick={handleSubmit}>Register Member</button>
      </div>
    </Modal>
  );
}

function IssueBookModal({ onClose, users, books, onSubmit }) {
  const [userId,  setUserId]  = useState('');
  const [bookId,  setBookId]  = useState('');
  const [dueDate, setDueDate] = useState('');

  const user = users.find(u => u.id === userId);
  const book = books.find(b => b.id === bookId);
  const valid = user && book && dueDate;

  return (
    <Modal title="⚡ Issue Book" subtitle="Manually issue a book to a member" color="#4ecdc4" onClose={onClose}>
      <div className="mform-grid">
        <Field label="Select Member *">
          <MSelect value={userId} onChange={e=>setUserId(e.target.value)}>
            <option value="">Choose member…</option>
            {users.map(u=><option key={u.id} value={u.id}>{u.name} ({u.id})</option>)}
          </MSelect>
        </Field>
        <Field label="Select Book *">
          <MSelect value={bookId} onChange={e=>setBookId(e.target.value)}>
            <option value="">Choose book…</option>
            {books.map(b=><option key={b.id} value={b.id}>{b.title} — {b.available} left</option>)}
          </MSelect>
        </Field>
        <Field label="Due Date *">
          <MInput type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} min={today.toISOString().slice(0,10)} />
        </Field>
      </div>
      {user && book && (
        <div className="mpreview">
          <div className="mpreview-row"><span>Member</span><strong>{user.name} · {user.role}</strong></div>
          <div className="mpreview-row"><span>Book</span><strong>{book.title}</strong></div>
          <div className="mpreview-row"><span>Available Copies</span><strong>{book.available}</strong></div>
          <div className="mpreview-row"><span>Currently Borrowed by Member</span><strong>{user.borrowed}</strong></div>
        </div>
      )}
      <div className="mfooter">
        <button className="mbtn-sec" onClick={onClose}>Cancel</button>
        <button className="mbtn-pri" style={{ background:'#4ecdc4', color:'#0a0a0f' }} disabled={!valid} onClick={() => onSubmit({ user, book, dueDate })}>
          Confirm Issue
        </button>
      </div>
    </Modal>
  );
}

function ProcessReturnModal({ onClose, issuances, calcFine, onSubmit }) {
  const [selected, setSelected] = useState('');
  const iss  = issuances.find(i => i.id === selected);
  const fine = iss ? calcFine(iss.dueDate) : 0;
  const days = iss ? Math.floor((today - new Date(iss.dueDate)) / 86400000) : 0;

  return (
    <Modal title="↩️ Process Return" subtitle="Record a return and calculate fines" color="#ff6b6b" onClose={onClose}>
      <Field label="Select Issuance Record *">
        <MSelect value={selected} onChange={e=>setSelected(e.target.value)}>
          <option value="">Choose issued book…</option>
          {issuances.map(i=>(
            <option key={i.id} value={i.id}>{i.bookTitle} — {i.userName} (due {i.dueDate})</option>
          ))}
        </MSelect>
      </Field>
      {iss && (
        <div className="mpreview">
          <div className="mpreview-row"><span>Book</span><strong>{iss.bookTitle}</strong></div>
          <div className="mpreview-row"><span>Borrower</span><strong>{iss.userName}</strong></div>
          <div className="mpreview-row"><span>Issued On</span><strong>{iss.issueDate}</strong></div>
          <div className="mpreview-row"><span>Due Date</span><strong>{iss.dueDate}</strong></div>
          <div className="mpreview-row">
            <span>Fine</span>
            <strong style={{ color: fine>0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
              {fine>0 ? `₹${fine}  (${days} days × ₹${FINE_PER_DAY}/day)` : 'No fine ✓'}
            </strong>
          </div>
        </div>
      )}
      {issuances.length === 0 && <p style={{ color:'var(--text-dim)', fontSize:'0.85rem' }}>No active issuances to return.</p>}
      <div className="mfooter">
        <button className="mbtn-sec" onClick={onClose}>Cancel</button>
        <button className="mbtn-pri" style={{ background:'#ff6b6b', color:'#0a0a0f' }} disabled={!iss} onClick={() => onSubmit(iss)}>
          Process Return{fine>0 ? ` & Charge ₹${fine}` : ''}
        </button>
      </div>
    </Modal>
  );
}

function ReportModal({ onClose, users, books, issuances, calcFine }) {
  const [type, setType] = useState('summary');

  const totalFine  = users.reduce((s,u) => s+u.fine, 0);
  const active     = issuances.filter(i => !i.returned);
  const overdue    = active.filter(i => calcFine(i.dueDate) > 0);

  const exportTxt = () => {
    const lines = [
      'BIBLIOTHECA LIBRARY REPORT',
      `Generated: ${new Date().toLocaleString()}`,
      `Report Type: ${type.toUpperCase()}`,
      '─'.repeat(40),
      `Total Books: ${books.length}`,
      `Total Copies: ${books.reduce((s,b)=>s+b.copies,0)}`,
      `Available Copies: ${books.reduce((s,b)=>s+b.available,0)}`,
      `Currently Issued: ${active.length}`,
      `Overdue: ${overdue.length}`,
      `Total Members: ${users.length}`,
      `Active Members: ${users.filter(u=>u.status==='active').length}`,
      `Pending Fines: ₹${totalFine}`,
    ];
    const blob = new Blob([lines.join('\n')], { type:'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `library-report-${type}.txt`;
    a.click();
  };

  return (
    <Modal title="📊 Generate Report" subtitle="Library analytics & data export" color="#c9a96e" onClose={onClose}>
      <div className="report-tabs">
        {[['summary','Summary'],['catalog','Catalog'],['members','Members'],['fines','Fines']].map(([k,l]) => (
          <button key={k} className={`rtab ${type===k?'rtab-active':''}`} onClick={()=>setType(k)}>{l}</button>
        ))}
      </div>

      {type === 'summary' && (
        <div className="rstat-grid">
          {[
            ['Total Books',       books.length],
            ['Total Copies',      books.reduce((s,b)=>s+b.copies,0)],
            ['Available',         books.reduce((s,b)=>s+b.available,0)],
            ['Currently Issued',  active.length],
            ['Overdue',           overdue.length],
            ['Total Members',     users.length],
            ['Active Members',    users.filter(u=>u.status==='active').length],
            ['Fines Pending',     `₹${totalFine}`],
          ].map(([l,v]) => (
            <div className="rstat" key={l}>
              <div className="rstat-val">{v}</div>
              <div className="rstat-label">{l}</div>
            </div>
          ))}
        </div>
      )}

      {type === 'catalog' && (
        <div style={{ overflowX:'auto', maxHeight:320, overflowY:'auto' }}>
          <table className="data-table" style={{ fontSize:'0.78rem' }}>
            <thead><tr><th>ID</th><th>Title</th><th>Author</th><th>Genre</th><th>Copies</th><th>Available</th></tr></thead>
            <tbody>
              {books.map(b => (
                <tr key={b.id}>
                  <td style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'0.65rem', color:'var(--text-dim)' }}>{b.id}</td>
                  <td><span className="table-name" style={{ fontSize:'0.85rem' }}>{b.title}</span></td>
                  <td>{b.author}</td>
                  <td>{b.genre}</td>
                  <td style={{ textAlign:'center' }}>{b.copies}</td>
                  <td style={{ textAlign:'center', color:b.available===0?'var(--accent-red)':'var(--accent-green)' }}>{b.available}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {type === 'members' && (
        <div style={{ overflowX:'auto', maxHeight:320, overflowY:'auto' }}>
          <table className="data-table" style={{ fontSize:'0.78rem' }}>
            <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Dept</th><th>Borrowed</th><th>Fine</th><th>Status</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'0.65rem', color:'var(--text-dim)' }}>{u.id}</td>
                  <td><span className="table-name" style={{ fontSize:'0.85rem' }}>{u.name}</span></td>
                  <td>{u.role}</td>
                  <td>{u.dept}</td>
                  <td style={{ textAlign:'center' }}>{u.borrowed}</td>
                  <td style={{ color:u.fine>0?'var(--accent-red)':'var(--text-muted)', fontFamily:'JetBrains Mono,monospace' }}>{u.fine>0?`₹${u.fine}`:'—'}</td>
                  <td><span className={`book-status ${u.status==='active'?'status-available':'status-issued'}`}>{u.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {type === 'fines' && (
        <div style={{ overflowX:'auto' }}>
          {users.filter(u=>u.fine>0).length === 0
            ? <p style={{ color:'var(--text-dim)', fontSize:'0.85rem', padding:'1rem 0' }}>No pending fines 🎉</p>
            : <table className="data-table" style={{ fontSize:'0.78rem' }}>
                <thead><tr><th>Name</th><th>Role</th><th>Dept</th><th>Fine Pending</th></tr></thead>
                <tbody>
                  {users.filter(u=>u.fine>0).map(u => (
                    <tr key={u.id}>
                      <td><span className="table-name" style={{ fontSize:'0.85rem' }}>{u.name}</span></td>
                      <td>{u.role}</td>
                      <td>{u.dept}</td>
                      <td style={{ color:'var(--accent-red)', fontFamily:'JetBrains Mono,monospace', fontWeight:600 }}>₹{u.fine}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} style={{ textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:'0.7rem', color:'var(--text-dim)' }}>TOTAL</td>
                    <td style={{ color:'var(--accent)', fontFamily:'JetBrains Mono,monospace', fontWeight:700 }}>₹{totalFine}</td>
                  </tr>
                </tbody>
              </table>
          }
        </div>
      )}

      <div className="mfooter">
        <button className="mbtn-sec" onClick={onClose}>Close</button>
        <button className="mbtn-pri" style={{ background:'#c9a96e' }} onClick={exportTxt}>⬇ Export .txt</button>
      </div>
    </Modal>
  );
}

function NoticesModal({ onClose, users, overdueList, calcFine, onSend }) {
  const [target,  setTarget]  = useState('overdue');
  const [subject, setSubject] = useState('Library Reminder — BIBLIOTHECA');
  const [message, setMessage] = useState('Dear Member,\n\nThis is a reminder from the JUIT Library. Please return your overdue books at the earliest to avoid further fines.\n\nRegards,\nLibrary Administration');
  const [sending, setSending] = useState(false);

  const counts = {
    overdue:  overdueList.length,
    all:      users.length,
    students: users.filter(u=>u.role==='Student').length,
    faculty:  users.filter(u=>u.role==='Faculty').length,
    fines:    users.filter(u=>u.fine>0).length,
  };

  const handleSend = () => {
    setSending(true);
    setTimeout(() => onSend(message, counts[target]), 900);
  };

  return (
    <Modal title="🔔 Send Notices" subtitle="Broadcast messages to library members" color="#5b8dee" onClose={onClose}>
      <div className="mform-grid">
        <Field label="Send To">
          <MSelect value={target} onChange={e=>setTarget(e.target.value)}>
            <option value="overdue">Overdue Members ({counts.overdue})</option>
            <option value="fines">Members with Pending Fines ({counts.fines})</option>
            <option value="students">All Students ({counts.students})</option>
            <option value="faculty">All Faculty ({counts.faculty})</option>
            <option value="all">All Members ({counts.all})</option>
          </MSelect>
        </Field>
        <Field label="Subject">
          <MInput value={subject} onChange={e=>setSubject(e.target.value)} />
        </Field>
        <Field label="Message">
          <textarea
            className="minput"
            rows={5}
            style={{ resize:'vertical', fontFamily:'inherit', lineHeight:1.6 }}
            value={message}
            onChange={e=>setMessage(e.target.value)}
          />
        </Field>
      </div>
      <div className="mpreview">
        <div className="mpreview-row"><span>Recipients</span><strong>{counts[target]} member{counts[target]!==1?'s':''}</strong></div>
        <div className="mpreview-row"><span>Channel</span><strong>Email + SMS</strong></div>
        <div className="mpreview-row"><span>Subject</span><strong>{subject}</strong></div>
      </div>
      <div className="mfooter">
        <button className="mbtn-sec" onClick={onClose}>Cancel</button>
        <button className="mbtn-pri" style={{ background:'#5b8dee' }} disabled={!message || sending} onClick={handleSend}>
          {sending ? '✓ Sending…' : `🔔 Send to ${counts[target]} Members`}
        </button>
      </div>
    </Modal>
  );
}
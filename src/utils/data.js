// Shared data utilities for Library Management System

export const LIBRARY_NAME = "BIBLIOTHECA";

export const BOOK_STATUS = {
  AVAILABLE: 'available',
  ISSUED: 'issued',
  RESERVED: 'reserved',
};

export const USER_ROLES = {
  STUDENT: 'Student',
  FACULTY: 'Faculty',
  ADMIN: 'Admin',
};

export const sampleBooks = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic Fiction', status: 'available', copies: 3, isbn: '978-0743273565' },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Computer Science', status: 'issued', copies: 1, isbn: '978-0132350884' },
  { id: 3, title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'History', status: 'available', copies: 5, isbn: '978-0062316110' },
  { id: 4, title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', status: 'reserved', copies: 2, isbn: '978-0441013593' },
  { id: 5, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', status: 'available', copies: 4, isbn: '978-0735211292' },
];

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const calculateFine = (dueDateStr, returnDateStr = null) => {
  const dueDate = new Date(dueDateStr);
  const returnDate = returnDateStr ? new Date(returnDateStr) : new Date();
  const diffDays = Math.floor((returnDate - dueDate) / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays * 5 : 0; // ₹5 per day fine
};
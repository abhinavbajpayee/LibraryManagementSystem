import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex gap-6">
      <Link to="/">Student</Link>
      <Link to="/faculty">Faculty</Link>
      <Link to="/admin">Admin</Link>
    </nav>
  );
}
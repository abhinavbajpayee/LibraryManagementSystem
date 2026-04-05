import React from 'react';

export default function BookList({ books, onIssue, onReturn, showActions = true }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      {books.map((book) => (
        <div key={book.id} className="flex justify-between border-b py-2">
          <div>
            <h3 className="font-semibold">{book.title}</h3>
            <p className="text-sm text-gray-500">{book.author}</p>
          </div>
          <div>
            <span>{book.available ? 'Available' : 'Issued'}</span>
            {showActions && (
              <div className="mt-2">
                {book.available ? (
                  <button onClick={() => onIssue(book.id)}>Issue</button>
                ) : (
                  <button onClick={() => onReturn(book.id)}>Return</button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
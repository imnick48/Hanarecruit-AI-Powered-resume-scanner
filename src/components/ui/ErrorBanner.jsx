import React from 'react';

export default function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <div
      className="mb-4 px-4 py-3 rounded-lg text-sm font-medium"
      style={{
        background: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fecaca',
      }}
    >
      {message}
    </div>
  );
}

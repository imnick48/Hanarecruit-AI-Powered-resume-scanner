import React from 'react';

export default function InputField({ label, ...props }) {
  return (
    <div>
      {label && (
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: '#374151' }}
        >
          {label}
        </label>
      )}
      <input
        className="w-full px-4 py-2.5 text-sm rounded-lg border"
        style={{ borderColor: '#d1d5db', color: '#111827', background: '#fafafa' }}
        {...props}
      />
    </div>
  );
}

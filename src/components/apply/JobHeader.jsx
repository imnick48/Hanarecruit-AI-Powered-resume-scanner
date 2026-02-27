import React from 'react';

export default function JobHeader({ job }) {
  return (
    <div className="card p-6 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: '#4f46e5' }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: '#6b7280' }}
        >
          Open Position
        </span>
      </div>
      <h2 className="text-xl font-bold mb-2" style={{ color: '#1e1b4b' }}>
        {job.title}
      </h2>
      <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>
        {job.description}
      </p>
    </div>
  );
}

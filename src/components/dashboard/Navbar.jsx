import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const recruiter = JSON.parse(localStorage.getItem('recruiter') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('recruiter');
    navigate('/');
  };

  return (
    <header
      style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo + org badge */}
        <div className="flex items-center gap-2">
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <span className="font-bold tracking-tight" style={{ color: '#1e1b4b' }}>
            RecruitRank
          </span>
          <span
            className="text-sm ml-2 px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: '#eef2ff', color: '#4f46e5' }}
          >
            {recruiter.organizationName}
          </span>
        </div>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="text-sm font-medium px-4 py-2 rounded-lg"
          style={{ color: '#6b7280', transition: 'background 0.15s' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { API_URL } from '../../constants/api';

function ScoreBadge({ score }) {
  const bg = score >= 80 ? '#dcfce7' : score >= 60 ? '#fef9c3' : '#fee2e2';
  const color = score >= 80 ? '#15803d' : score >= 60 ? '#a16207' : '#dc2626';
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: bg, color }}
    >
      {score}
    </span>
  );
}

function SuggestionCell({ text }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return <span style={{ color: '#9ca3af' }}>—</span>;
  const isLong = text.length > 120;
  return (
    <div style={{ minWidth: 220, maxWidth: 400 }}>
      <span
        style={{
          color: '#374151',
          fontSize: '0.8rem',
          lineHeight: '1.5',
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : 3,
          WebkitBoxOrient: 'vertical',
          overflow: expanded ? 'visible' : 'hidden',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      >
        {text}
      </span>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            marginTop: 4,
            fontSize: '0.72rem',
            color: '#4f46e5',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontWeight: 600,
          }}
        >
          {expanded ? 'Show less ↑' : 'Show more ↓'}
        </button>
      )}
    </div>
  );
}


export default function ApplicantsTable({ applicants, ranked, onRank, loading, suggestions }) {
  const hasScores = applicants.length > 0 && applicants[0].score !== null;
  const hasSuggestions = ranked && suggestions && Object.keys(suggestions).length > 0;

  const columns = [
    'Name',
    'Email',
    'Reason',
    ...(hasScores ? ['Score'] : []),
    ...(hasSuggestions ? ['AI Suggestion'] : []),
    'Resume',
  ];

  return (
    <div className="mt-5 pt-5" style={{ borderTop: '1px solid #e5e7eb' }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold" style={{ color: '#1e1b4b' }}>
          {applicants.length} Applicant{applicants.length !== 1 ? 's' : ''}
        </span>
        {applicants.length > 0 && !ranked && !hasScores && (
          <button
            onClick={onRank}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl text-white"
            style={{
              background: loading ? '#9ca3af' : '#059669',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {loading ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ animation: 'spin 1s linear infinite' }}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Ranking & Generating…
              </>
            ) : (
              '✦ Rank with AI'
            )}
          </button>
        )}
      </div>

      {/* Spinner animation keyframes */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {applicants.length === 0 ? (
        <p className="text-sm text-center py-6" style={{ color: '#9ca3af' }}>
          No applicants yet.
        </p>
      ) : (
        <>
          {hasSuggestions && (
            <div
              className="mb-3 px-4 py-2.5 rounded-xl flex items-center gap-2"
              style={{ background: '#f0fdf4', border: '1px solid #86efac' }}
            >
              <span style={{ fontSize: '1rem' }}>✦</span>
              <span className="text-xs font-semibold" style={{ color: '#15803d' }}>
                AI-generated suggestions are displayed below. Click "Show more" to expand.
              </span>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #e5e7eb' }}>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                      style={{ color: '#6b7280', whiteSpace: 'nowrap' }}
                    >
                      {col === 'AI Suggestion' ? (
                        <span style={{ color: '#059669' }}>✦ AI Suggestion</span>
                      ) : (
                        col
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: '#111827' }}>
                      {app.name}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#6b7280' }}>
                      {app.email}
                    </td>
                    <td className="px-4 py-3 max-w-xs" style={{ color: '#6b7280' }}>
                      <span className="block truncate">{app.reason}</span>
                    </td>
                    {hasScores && (
                      <td className="px-4 py-3">
                        <ScoreBadge score={app.score} />
                      </td>
                    )}
                    {hasSuggestions && (
                      <td className="px-4 py-3">
                        <SuggestionCell text={suggestions[app.id]} />
                      </td>
                    )}
                    <td className="px-4 py-3" style={{ whiteSpace: 'nowrap' }}>
                      <a
                        href={`${API_URL}/resume/${app.id}?token=${localStorage.getItem('token')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold no-underline px-3 py-1.5 rounded-lg"
                        style={{ background: '#eef2ff', color: '#4f46e5', display: 'inline-block', whiteSpace: 'nowrap' }}
                      >
                        View PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

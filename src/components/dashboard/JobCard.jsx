import React, { useState } from 'react';
import ApplicantsTable from './ApplicantsTable';
import { API_URL } from '../../constants/api';

export default function JobCard({ job, copyLink }) {
  const [applicants, setApplicants] = useState([]);
  const [showApplicants, setShowApplicants] = useState(false);
  const [ranked, setRanked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState({});

  const fetchApplicants = async () => {
    try {
      const res = await fetch(`${API_URL}/applications/${job.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setApplicants(data);

      // Auto-populate suggestions from persisted ai_suggestion fields
      const existingSuggestions = {};
      let hasAnySuggestion = false;
      data.forEach((app) => {
        if (app.ai_suggestion) {
          existingSuggestions[app.id] = app.ai_suggestion;
          hasAnySuggestion = true;
        }
      });
      if (hasAnySuggestion) {
        setSuggestions(existingSuggestions);
        setRanked(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRank = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/applications/rank/${job.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      // Backend returns { ranked: [...], suggestions: { id: "..." } }
      if (data.ranked) {
        setApplicants(data.ranked);
        setSuggestions(data.suggestions || {});
      } else {
        // Fallback if old format
        setApplicants(data);
      }
      setRanked(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const toggleApplicants = () => {
    if (!showApplicants) fetchApplicants();
    setShowApplicants(!showApplicants);
  };

  const link = `${window.location.origin}/apply/${job.link_id}`;

  return (
    <div className="card job-card p-6">
      <div className="flex items-start justify-between gap-4">
        {/* Job info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base mb-1" style={{ color: '#1e1b4b' }}>
            {job.title}
          </h4>
          <p className="text-sm leading-relaxed mb-3" style={{ color: '#6b7280' }}>
            {job.description.substring(0, 120)}...
          </p>
          <div className="flex items-center gap-2">
            <span
              className="text-xs px-2.5 py-1 rounded-lg truncate max-w-xs"
              style={{ fontFamily: 'DM Mono, monospace', background: '#f3f4f6', color: '#6b7280' }}
            >
              {link}
            </span>
            <button
              onClick={() => copyLink(job.link_id)}
              className="flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-lg"
              style={{ background: '#eef2ff', color: '#4f46e5' }}
            >
              Copy
            </button>
          </div>
        </div>

        {/* Toggle applicants */}
        <button
          onClick={toggleApplicants}
          className="flex-shrink-0 flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl border"
          style={{
            borderColor: showApplicants ? '#4f46e5' : '#e5e7eb',
            color: showApplicants ? '#4f46e5' : '#374151',
            background: showApplicants ? '#eef2ff' : '#fff',
            transition: 'all 0.15s',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          {showApplicants ? 'Hide' : 'Applicants'}
        </button>
      </div>

      {showApplicants && (
        <ApplicantsTable
          applicants={applicants}
          ranked={ranked}
          onRank={handleRank}
          loading={loading}
          suggestions={suggestions}
        />
      )}
    </div>
  );
}

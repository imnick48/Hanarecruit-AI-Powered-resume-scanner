import React, { useState, useEffect } from 'react';
import Navbar from '../components/dashboard/Navbar';
import JobCard from '../components/dashboard/JobCard';
import CreateJobForm from '../components/dashboard/CreateJobForm';
import { API_URL } from '../constants/api';

function EmptyState() {
  return (
    <div className="card p-12 text-center">
      <div
        className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
        style={{ background: '#eef2ff' }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      </div>
      <p className="font-semibold mb-1" style={{ color: '#1e1b4b' }}>
        No jobs yet
      </p>
      <p className="text-sm" style={{ color: '#9ca3af' }}>
        Create your first job to start collecting applications.
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/jobs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJobCreated = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
    setShowForm(false);
  };

  const copyLink = (linkId) => {
    navigator.clipboard.writeText(`${window.location.origin}/apply/${linkId}`);
    alert('Link copied!');
  };

  return (
    <div className="min-h-screen" style={{ background: '#f4f5f7' }}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#1e1b4b' }}>
              Job Listings
            </h2>
            <p className="text-sm" style={{ color: '#6b7280' }}>
              {jobs.length} job{jobs.length !== 1 ? 's' : ''} posted
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl"
          >
            {showForm ? '✕ Cancel' : '＋ New Job'}
          </button>
        </div>

        {showForm && <CreateJobForm onJobCreated={handleJobCreated} />}

        {jobs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} copyLink={copyLink} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

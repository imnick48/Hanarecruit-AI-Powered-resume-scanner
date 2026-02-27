import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import JobHeader from '../components/apply/JobHeader';
import ApplicationForm from '../components/apply/ApplicationForm';
import { API_URL } from '../constants/api';

const BG = 'linear-gradient(135deg, #eef2ff 0%, #f4f5f7 60%, #e0e7ff 100%)';

function SuccessScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: BG }}
    >
      <div className="card p-12 text-center max-w-md w-full">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
          style={{ background: '#dcfce7' }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#15803d"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#1e1b4b' }}>
          Application Submitted!
        </h2>
        <p className="text-sm" style={{ color: '#6b7280' }}>
          Thank you for applying. We'll review your application and get back to you soon.
        </p>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#f4f5f7' }}
    >
      <div className="text-sm" style={{ color: '#6b7280' }}>
        Loading...
      </div>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#f4f5f7' }}
    >
      <p className="text-sm font-medium" style={{ color: '#dc2626' }}>
        {message}
      </p>
    </div>
  );
}

export default function Apply() {
  const { linkId } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const res = await fetch(`${API_URL}/jobs/${linkId}`);
      const data = await res.json();
      if (res.ok) setJob(data);
      else setError(data.error);
    } catch (err) {
      setError('Server error');
    }
  };

  if (success) return <SuccessScreen />;
  if (!job && !error) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: BG }}>
      <div className="max-w-2xl mx-auto">
        <JobHeader job={job} />
        <ApplicationForm linkId={linkId} onSuccess={() => setSuccess(true)} />
      </div>
    </div>
  );
}

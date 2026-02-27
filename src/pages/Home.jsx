import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/ui/Logo';

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token, navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{
        background: 'linear-gradient(135deg, #eef2ff 0%, #f4f5f7 60%, #e0e7ff 100%)',
      }}
    >
      <div className="mb-5">
        <Logo size="lg" />
      </div>
      <p className="text-lg mb-10" style={{ color: '#6b7280' }}>
        AI-powered resume ranking for modern recruiters
      </p>
      <div className="flex gap-3">
        <Link
          to="/register"
          className="btn-primary px-6 py-3 text-sm font-semibold text-white rounded-xl no-underline"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 text-sm font-semibold rounded-xl no-underline border"
          style={{ color: '#4f46e5', borderColor: '#c7d2fe', background: '#fff' }}
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import InputField from '../components/ui/InputField';
import ErrorBanner from '../components/ui/ErrorBanner';
import { API_URL } from '../constants/api';

export default function Register() {
  const [form, setForm] = useState({ organizationName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) navigate('/login');
      else setError(data.error);
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start ranking candidates in minutes">
      <ErrorBanner message={error} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          label="Organization Name"
          placeholder="Acme Corp"
          value={form.organizationName}
          onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
          required
        />
        <InputField
          label="Email"
          type="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <InputField
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          className="btn-primary w-full py-2.5 text-sm font-semibold text-white rounded-xl mt-1"
        >
          Create Account
        </button>
      </form>
      <p className="text-center text-sm mt-5" style={{ color: '#6b7280' }}>
        Already have an account?{' '}
        <Link to="/login" className="font-semibold no-underline" style={{ color: '#4f46e5' }}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

import React, { useState } from 'react';
import InputField from '../ui/InputField';
import TextAreaField from '../ui/TextAreaField';
import ErrorBanner from '../ui/ErrorBanner';
import { API_URL } from '../../constants/api';

export default function ApplicationForm({ linkId, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', reason: '' });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('reason', form.reason);
    formData.append('resume', file);

    try {
      const res = await fetch(`${API_URL}/applications/apply/${linkId}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) onSuccess();
      else setError(data.error);
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="card p-6">
      <h3 className="font-semibold mb-5" style={{ color: '#1e1b4b' }}>
        Your Application
      </h3>
      <ErrorBanner message={error} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Full Name"
            placeholder="Jane Smith"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <InputField
            label="Email"
            type="email"
            placeholder="jane@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <TextAreaField
          label="Why are you applying?"
          placeholder="Tell us what excites you about this role and what you'd bring to the team..."
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          rows={4}
          required
        />
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: '#374151' }}
          >
            Resume (PDF)
          </label>
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg border"
            style={{ borderColor: '#d1d5db', background: '#fafafa' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="text-sm flex-1"
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn-primary w-full py-3 text-sm font-semibold text-white rounded-xl mt-1"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}

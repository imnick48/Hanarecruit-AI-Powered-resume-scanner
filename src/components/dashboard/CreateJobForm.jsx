import React, { useState } from 'react';
import InputField from '../ui/InputField';
import TextAreaField from '../ui/TextAreaField';
import { API_URL } from '../../constants/api';

export default function CreateJobForm({ onJobCreated }) {
  const [form, setForm] = useState({ title: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        onJobCreated(data);
        setForm({ title: '', description: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card p-6 mb-6">
      <h3 className="font-semibold mb-4" style={{ color: '#1e1b4b' }}>
        Create New Job
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          label="Job Title"
          placeholder="e.g. Senior Frontend Engineer"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <TextAreaField
          label="Job Description"
          placeholder="Describe the role, requirements, and expectations..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={5}
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary px-5 py-2.5 text-sm font-semibold text-white rounded-xl"
          >
            Create Job
          </button>
        </div>
      </form>
    </div>
  );
}

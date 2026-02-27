CREATE TABLE recruiters (
  id SERIAL PRIMARY KEY,
  organization_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  link_id VARCHAR(255) UNIQUE NOT NULL,
  recruiter_id INTEGER REFERENCES recruiters(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  reason TEXT,
  resume_text TEXT,
  resume_pdf BYTEA,
  score INTEGER,
  ai_suggestion TEXT,
  resume_path TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

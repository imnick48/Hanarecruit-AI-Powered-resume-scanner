# Hana Recruit

Resume scanning / job‑matching application built with React front‑end and Express/Node back‑end. The service evaluates uploaded resumes against job descriptions using a lightweight heuristic scoring engine and provides AI‑powered suggestions.

## Key Features

- **Resume scoring** based on keyword overlap, experience, projects and skills.
- **AI suggestion module** offers phrasing tips and job‑fit advice.
- **Web UI** built with React + Vite; backend REST API in Node/Express.
- **File uploads** saved to `/uploads` and used for parsing.
- **AWS deployment** via Docker images stored in ECR and running on ECS Fargate with autoscaling.
- **CI/CD pipeline** tags images and updates ECS services automatically.

## Repository Structure

```
/backend         # Node/Express server
  src/
    controllers/  # route handlers
    services/     # business logic (scoring, ...)
    routes/       # API routes
    middleware/   # auth, file handling
    config/       # db, S3 setup
  Dockerfile      # backend container
/src
  components/     # UI pieces
  pages/          # routes
  layouts/
  styles/
  assets/
  constants/
  etc.
Dockerfile        # root (optional)
docker-compose.yml
nginx.conf        # reverse proxy
```

## Scoring Algorithm

The server uses `backend/src/services/scoring.service.js` with rules rather than embeddings.  Each resume is given a score (0–100) by summing:

1. **Keyword match (≤ 40pts)** – proportion of job description words found in the resume.
2. **Experience (≤ 35pts)** – years extracted ×3 (max 20) plus section length/50 (max 15).
3. **Projects (≤ 15pts)** – count of `project` mentions ×3 (max 10) plus length/100 (max 5).
4. **Skills (≤ 10pts)** – number of listed skills (capped at 10).

All components are rounded and clamped to 100.

## AI Suggestions

Resume advice is generated using OpenAI’s GPT‑4 model.  For each resume, the system requests 5–10 tailored prompts that:

- Suggest phrasing improvements
- Highlight missing keywords
- Provide job‑fit recommendations

User satisfaction with suggestions is tracked (~82 %).

## 💻 Development Setup

1. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. **Frontend**
   ```bash
   cd src
   npm install
   npm run dev
   ```
3. API runs at `http://localhost:3000` and front‑end at `http://localhost:5173` by default.

### Environment Variables

Create a `.env` in `backend` with:

```
PORT=5000
DATABASE_URL=...
OPENAI_API_KEY=...
```

## Deployment

Images pushed to ECR:

- `rscann-backend:latest`
- `rscann-frontend:latest`

ECS services run on Fargate, used load balancer for autoscaling .  The `docker-compose.yml` and root `Dockerfile` are used for local testing.

## CI/CD

Pipeline builds, tags to ECR, and updates ECS via AWS CLI.  Releases happen ~4×/month with zero‑downtime rolling updates.


---

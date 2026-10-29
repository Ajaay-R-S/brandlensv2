# BrandLens

BrandLens helps teams review marketing content against approved brand guidelines and facts before publication. It flags terminology and claims issues, checks accessibility inputs, and supports a creator-to-reviewer workflow.

> **Demo project:** BrandLens ships with fictional FreshNest sample data. The API does not include authentication, so do not expose sensitive information or use it for production workflows without adding appropriate security and storage.

## Features

- Seeded knowledge base of brand guidelines, glossary terms, and approved facts.
- Content submissions with findings, source citations, and suggested revisions.
- Finding actions, revision history, reviewer comments, approval, and locking.
- Accessibility checks for image alt text and color contrast.
- Recurring-issue and guideline-gap insights.

## Tech stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Python, FastAPI, Pydantic
- **Storage:** JSON file (`backend/data.json` by default)

## Run locally

Prerequisites: Python 3.10+ and Node.js/npm.

### 1. Start the backend

From the project root, open a terminal and run:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --app-dir backend
```

The API is available at <http://127.0.0.1:8000>. Interactive API documentation is at <http://127.0.0.1:8000/docs>.

### 2. Start the frontend

In a second terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Open the URL Vite prints, usually <http://localhost:5173>. During local development, Vite proxies `/api` requests to the backend on port `8000`.

## Run the end-to-end test

With the backend running, open another terminal at the project root:

```powershell
python test_e2e.py
```

The script exercises the API workflow and creates then deletes a test submission.

## Deploy a demo

One simple option is to deploy the API to Render and the frontend to Vercel. Deploy both services from the same GitHub repository.

### Backend: Render

Create a **Web Service** and configure:

| Setting | Value |
| --- | --- |
| Root directory | Repository root |
| Build command | `pip install -r backend/requirements.txt` |
| Start command | `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT --app-dir backend` |

Set these environment variables:

| Variable | Value |
| --- | --- |
| `PYTHON_VERSION` | `3.12.3` |
| `CORS_ORIGINS` | `https://YOUR-FRONTEND.vercel.app` |

Replace the example frontend URL with the actual Vercel domain. After deployment, verify the API at `https://YOUR-BACKEND.onrender.com/docs`.

The API writes data to `backend/data.json` by default. To retain user changes across service restarts or redeploys, attach persistent storage and set `DB_FILE` to a file path on its mount (for example, `/var/data/data.json` if the disk is mounted at `/var/data`). Without persistent storage, treat written data as temporary.

### Frontend: Vercel

Import the repository as a Vercel project and configure:

| Setting | Value |
| --- | --- |
| Root directory | `frontend` |
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |

Set the environment variable:

| Variable | Value |
| --- | --- |
| `VITE_API_URL` | `https://YOUR-BACKEND.onrender.com` |

Use the backend origin only: do not add a trailing slash or `/api`. The frontend appends `/api` automatically. Redeploy after setting or changing environment variables.

After both services deploy, open the Vercel site and test the knowledge base, a submission, review actions, and insights. A free backend service may take a little while to respond after being idle.

## Important limitations

- The API currently has no authentication or authorization. Anyone who can reach the API may be able to read or modify its data.
- JSON-file storage is intended for a small demo, not concurrent or production use. Configure persistent storage or replace it with a database before relying on saved data.
- Free hosting plans may sleep while idle and may have storage or usage limits.

## Project layout

```text
backend/
  app/                 FastAPI application and business logic
  requirements.txt     Python dependencies
frontend/
  src/                 React application
  package.json         Frontend scripts and dependencies
test_e2e.py            API end-to-end workflow test
```

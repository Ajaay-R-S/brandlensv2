# BrandLens

> **Check content against the brand's own approved facts and rules before it goes public, and explain every finding.**  
> *Round 1 - The Plan | Problem statement by Inkloom AI | Team Achivers | Solo entry by R S AJAAY*

BrandLens is a lightweight, high-precision pre-publication review platform built with **FastAPI**, **React**, and **Tailwind CSS**. It replaces guesswork and generic "off-brand" rejections with citation-backed findings, role-based approval workflows, and guideline-gap analytics.

---

## The 8-Step Complete Product Workflow

1. **Step 1: Set Up (Knowledge Base)**
   - Pre-seeded with the fictional meal-kit brand **FreshNest**.
   - Structured into **Guidelines & Claims Policies** (e.g. `CL-01`, `CL-02`, `CL-03`, `TONE-01`, `ACC-01`), **Glossary Terms** (e.g. `T-01`, `T-02`, `T-07`, `T-10`, `T-15`), and **Approved Facts** (e.g. `F-01`, `F-05`, `F-08`, `F-12`, `F-14`, `F-18`, `F-21`).
   - Every rule/fact entry has an ID and version (`v1.0`), and must be explicitly approved before enforcement.

2. **Step 2: Submit (Creator Upload)**
   - Creator pastes text or loads quick presets (including the exact 3-issue mockup from page 2 of the Round 1 Plan).
   - Channels supported: Ad Copy, Social Post, Product Description, Blog Editorial, Email Newsletter.
   - Optional visual asset checks: image alt-text validation and WCAG 2.1 color contrast pairs.

3. **Step 3: Analyse (Rules + Retrieval + AI Review)**
   - Deterministic checks first for glossary terms, banned phrasing, and WCAG contrast.
   - Lexical and semantic retrieval against approved KB entries.
   - Constrained strictly to approved facts; never guesses missing evidence.

4. **Step 4: Explain (Cited Findings)**
   - Three distinct finding types matching the plan specification:
     - **Rule violation**: Content breaks a stated guideline or glossary rule (e.g., `"diet boxes"` breaks `Glossary T-07`).
     - **Contradicted claim**: Content conflicts with an approved fact (e.g., `"free delivery on all orders"` contradicts `Fact F-12`).
     - **Not verifiable**: No approved evidence supports the superlative or health claim (e.g., `"healthiest in India and guarantee weight loss in 2 weeks"` routes to human reviewer under `Policy CL-3`).
   - Each card displays severity, exact flagged quote, educational reason, intent-preserving rewrite, and verified source citation.

5. **Step 5: Revise Loop**
   - **Accept**: Applies suggested revision directly to the draft.
   - **Edit**: Allows creator to refine the suggestion while preserving approved facts.
   - **Dismiss (Reason Needed)**: Mandatory modal requiring a structured justification (`Approved marketing exception`, `Context qualifies claim`, `Creative wordplay`, `Rule is outdated`, etc.). Feeds recurring-issue insights!
   - **Send to Reviewer**: Flags item for human reviewer resolution.
   - Resubmitting creates version bumps (`v1` → `v2`), preserving revision history.

6. **Step 6: Review (Reviewer Diff & Comments)**
   - Instant role-switching in the top header:
     - `Jane Doe (Content Creator)`
     - `Rahul Sharma (Legal & Brand Reviewer)`
     - `Priya Patel (Brand Manager / Admin)`
   - Side-by-side and inline word-level diff viewer comparing original draft vs current revision.
   - Threaded comments per submission.
   - Reviewer decision controls: **Approve & Lock**, **Request Changes**, **Reject**.

7. **Step 7: Approve (Locked Version & Audit Record)**
   - Approving permanently locks the version against unauthorized edits.
   - Immutable audit trail records: approver identity, timestamp, exact guideline versions applied, responsible AI disclosure, and full finding resolution logs.
   - 1-click **Copy Clean Text** and **Export Audit JSON**.
   - Manager role can unlock if editorial corrections are required.

8. **Step 8: Learn (Recurring-Issue & Guideline-Gap Insights)**
   - Dashboard displaying recurring issues by rule and channel.
   - **Guideline-Gap Analysis**: Detects rules frequently dismissed or disputed by creators, providing actionable recommendations to refine rigid or ambiguous brand rules.
   - Metrics: Total scans, findings caught, suggestion acceptance rate, 100% citation accuracy, and turnaround time.

---

## Running the Application Locally

### 1. Start the FastAPI Backend
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --app-dir backend
```
Backend API will be live at `http://127.0.0.1:8000`. Interactive docs at `http://127.0.0.1:8000/docs`.

### 2. Start the React Frontend
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Run Automated E2E Tests
```bash
python test_e2e.py
```
Validates all 8 workflow steps end-to-end.

## Deploying a Demo

The simplest split deployment is a Render web service for the FastAPI backend and a Vercel project for the Vite frontend.

### Backend on Render

Connect this repository as a new Render Web Service and use:

- **Root directory:** repository root
- **Build command:** `pip install -r backend/requirements.txt`
- **Start command:** `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT --app-dir backend`
- **Environment variable:** `PYTHON_VERSION=3.12.3`
- **Environment variable:** `CORS_ORIGINS=https://YOUR-FRONTEND.vercel.app`

After deployment, check `https://YOUR-BACKEND.onrender.com/docs`.

The backend stores its data in `backend/data.json` by default. For persistent data on Render, attach a persistent disk and set `DB_FILE` to a file path on its mount, for example `/var/data/data.json` when the disk is mounted at `/var/data`. Without persistent storage, data written by the app can be lost when the service restarts or redeploys.

### Frontend on Vercel

Import the same repository into Vercel and configure:

- **Root directory:** `frontend`
- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variable:** `VITE_API_URL=https://YOUR-BACKEND.onrender.com`

Set `VITE_API_URL` to the backend origin only, without a trailing slash or `/api`. The frontend adds `/api` automatically. Redeploy after setting or changing environment variables.

Once deployed, open the Vercel URL and test the complete workflow. The first request to a free Render service may be slow after inactivity. This setup is intended for a demo: the API has no authentication, so do not use it for private or sensitive data.

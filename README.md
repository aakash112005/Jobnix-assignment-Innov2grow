# Hirable — AI-Ready Job Portal (MERN Stack)

A full-stack job portal with candidate/employer/admin roles, JWT auth with
refresh-token rotation, job search & filtering, applications, a public-API
job scraper with dedup + cron scheduling, an AI resume-matching score, and
role-based dashboards with charts.

Built for the "Full Stack Engineer Technical Assessment — AI-Ready Job
Portal with Job Aggregation" brief.

---

## Tech stack

**Frontend:** React 18 + Vite, Tailwind CSS, React Router DOM, Redux Toolkit,
Axios, React Hook Form, Framer Motion, React Icons, Recharts, React Hot Toast.

**Backend:** Node.js, Express, MongoDB + Mongoose, JWT, Bcrypt, Multer,
Nodemailer, Express Validator, Helmet, Morgan, CORS, dotenv, node-cron.

**Docs/Ops:** Swagger/OpenAPI, Postman collection, Docker + docker-compose,
Jest + Supertest unit/integration tests.

---

## Project structure

```
job-portal/
├── client/                # React + Vite frontend
│   └── src/
│       ├── components/    # Navbar, Footer, JobCard, SearchFilters, PipelineTrack…
│       ├── layouts/       # MainLayout, DashboardLayout
│       ├── pages/         # Home, Jobs, JobDetails, dashboards, auth pages…
│       ├── redux/         # store + slices (auth, jobs, ui)
│       ├── routes/        # ProtectedRoute, RoleRoute
│       └── services/      # api.js (axios), authService, jobService
├── server/                # Node/Express backend
│   ├── config/            # db.js, swagger.js
│   ├── controllers/       # auth, user, job, application, dashboard, scraper, company
│   ├── middlewares/       # auth, roleAuth, errorHandler, rateLimiter, upload
│   ├── models/            # User, Company, Job, Application, SavedJob
│   ├── routes/
│   ├── scraper/           # scraperService.js + sources/remotiveSource.js
│   ├── cron/               # scraperCron.js (every 6h)
│   ├── services/           # aiMatchingService.js
│   ├── validators/
│   ├── utils/
│   └── tests/               # Jest + Supertest
├── docker-compose.yml
├── postman_collection.json
└── DATABASE_SCHEMA.md
```

---

## Local setup

### Prerequisites
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend

```bash
cd server
cp .env.example .env    # fill in MONGO_URI, JWT secrets, SMTP (optional)
npm install
npm run seed             # optional: creates demo admin/employer/candidate + jobs
npm run dev               # starts on http://localhost:5000
```

API docs: `http://localhost:5000/api-docs` (Swagger UI)

Demo accounts after seeding:

| Role | Email | Password |
|---|---|---|
| Admin | admin@jobportal.com | Password123 |
| Employer | employer@jobportal.com | Password123 |
| Candidate | candidate@jobportal.com | Password123 |

### 2. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev               # starts on http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:5000` — no CORS
setup needed locally.

### 3. Run tests

```bash
cd server
npm test
```

### 4. Docker (both services + MongoDB)

```bash
cp server/.env.example .env   # set JWT secrets at minimum
docker compose up --build
```

---

## Deployment

- **Frontend → Vercel:** import the `client/` directory as the project
  root, framework preset "Vite", set `VITE_API_URL` to your deployed
  backend's `/api` URL.
- **Backend → Render:** new Web Service pointing at `server/`, build
  command `npm install`, start command `npm start`, add all vars from
  `.env.example` (use a MongoDB Atlas URI for `MONGO_URI`), and set
  `CLIENT_URL` to your Vercel URL so CORS + cookies work.

---

## REST API summary

Full request/response detail is in Swagger (`/api-docs`) and
`postman_collection.json`. Base path: `/api`.

| Method | Endpoint | Access |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| POST | `/auth/refresh` | Public (refresh cookie) |
| POST | `/auth/logout` | Private |
| POST | `/auth/forgot-password` | Public |
| POST | `/auth/reset-password` | Public |
| GET/PUT | `/profile` | Private |
| POST | `/profile/resume` | Private (candidate) |
| GET | `/profile/saved-jobs` | Private (candidate) |
| GET | `/jobs` | Public — search, filter, sort, paginate |
| GET | `/jobs/:id` | Public |
| POST/PUT/DELETE | `/jobs`, `/jobs/:id` | Private (employer/admin) |
| PUT | `/jobs/:id/close` | Private (employer/admin) |
| POST | `/jobs/:id/apply` | Private (candidate) |
| GET | `/jobs/:id/applicants` | Private (employer/admin) |
| POST/DELETE | `/jobs/:id/save` | Private (candidate) |
| GET | `/applications` | Private (role-scoped) |
| PUT | `/applications/:id` | Private (employer/admin) |
| GET | `/dashboard` | Private — role-specific payload |
| POST | `/scrape/jobs` | Private (admin) |
| GET/POST | `/companies` | Public / Private (employer) |
| GET/DELETE | `/users` | Private (admin) |

---

## Feature checklist against the assignment

- Auth: register/login/logout, forgot password, role-based routing,
  protected routes, persistent login (silent refresh on load), refresh
  token rotation, password hashing, validation.
- Candidate: profile, resume upload, saved jobs, applied jobs, search,
  apply, filters, bookmarks.
- Employer: dashboard, create/edit/delete/close jobs, manage applicants,
  company profile, analytics.
- Admin: dashboard, manage users/companies/jobs/applications, reports,
  platform analytics, deactivate/delete users.
- Job model with every required field.
- Search + pagination + sorting + all listed filters.
- All REST endpoints from the spec.
- Scraper (Remotive public API) with dedup via a unique DB index, plus
  jobs-added/duplicates/errors reporting and a 6-hourly cron job.
- Admin dashboard charts: totals, jobs scraped today, top skills/
  companies/locations, user growth.
- Bonus features implemented: Docker, Swagger, Resume Upload, Email
  Notifications, Rate Limiting, AI Resume Matching, Unit Testing,
  CI/CD-ready structure. (Redis caching is stubbed via an empty
  `REDIS_URL` env var and can be wired into `apiFeatures`/`jobController`
  if needed — see note below.)

### Note on scope

This is a large, genuinely full-featured implementation of every module in
the assignment, but a couple of bonus items were intentionally kept light
to stay honest about effort vs. a multi-week production build:

- **Redis** isn't wired in yet (env var is present as a placeholder) —
  the natural cache point is `GET /jobs`.
- **AI resume matching** uses a deterministic skill-overlap heuristic
  (`server/services/aiMatchingService.js`) rather than an LLM call, with a
  documented async seam (`matchResumeToJobAsync`) to swap in a real model
  later.

---

## Security

Helmet, `express-rate-limit` (stricter on auth routes), JWT with short-lived
access tokens + httpOnly rotating refresh tokens, bcrypt password hashing
(12 rounds), `express-mongo-sanitize` + `xss-clean` input sanitization,
`express-validator` on all mutating routes, and role-authorization
middleware on every protected endpoint.

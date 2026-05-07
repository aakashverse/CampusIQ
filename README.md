# CampusIQ — College Discovery Platform

A full-stack college discovery paltform built with React, Node.js, Express, and PostgreSQL.

## Features
- College listing with search, filters, and pagination
- College detail pages (overview, courses, stats)
- Compare 2–3 colleges with an AI-powered insight layer
- JWT auth (register/login)
- Save/unsave colleges

---

## Project Structure

```
college-platform/
├── backend/
│   ├── config/db.js          # PostgreSQL pool
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── collegeController.js
│   │   ├── compareController.js
│   │   └── savedController.js
│   ├── middleware/auth.js     # JWT middleware
│   ├── routes/
│   │   ├── auth.js
│   │   ├── colleges.js
│   │   ├── compare.js
│   │   └── saved.js
│   ├── utils/llm.js           # OpenAI integration
│   ├── schema.sql             # DB schema + seed data
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AIInsightBox.jsx
    │   │   ├── CollegeCard.jsx
    │   │   ├── CompareBar.jsx
    │   │   ├── CompareTable.jsx
    │   │   ├── FilterPanel.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Pagination.jsx
    │   │   └── SearchBar.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CompareContext.jsx
    │   ├── pages/
    │   │   ├── CollegeDetail.jsx
    │   │   ├── Compare.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Saved.jsx
    │   ├── utils/api.js       # Axios instance
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

## Setup Instructions

### 1. Prerequisites
- Node.js v18+
- PostgreSQL running locally
- (Optional) OpenAI API key for AI insights

### 2. Database Setup

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE college_platform;"

# Run the schema + seed data
psql -U postgres -d college_platform -f backend/schema.sql
```

### 3. Backend Setup

```bash
cd backend
npm install

# Copy env file and fill in your values
cp .env.example .env
# Edit .env: set DATABASE_URL, JWT_SECRET, OPENAI_API_KEY

npm run dev   # runs on http://localhost:5000
```

Your `.env` should look like:
```
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/college_platform
JWT_SECRET=any_random_secret_string
OPENAI_API_KEY=sk-...   # Leave as-is to use rule-based fallback
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev   # runs on http://localhost:5173
```

The Vite dev server proxies `/api` → `localhost:5000` automatically (configured in `vite.config.js`).

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/colleges` | No | List with search/filter/pagination |
| GET | `/api/colleges/:id` | No | College detail + courses |
| POST | `/api/compare` | No | Compare colleges + AI insight |
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/saved` | Yes | Get user's saved colleges |
| GET | `/api/saved/ids` | Yes | Get saved college ID list |
| POST | `/api/saved/:collegeId` | Yes | Toggle save/unsave |

### Query params for GET /api/colleges
- `search` — name search (case-insensitive)
- `location` — filter by location substring
- `maxFees` — filter by max annual fees (INR)
- `page` — page number (default: 1)
- `limit` — per page (default: 9)

---

## AI Insight (LLM Layer)

The compare endpoint calls OpenAI GPT-3.5-turbo with a structured JSON prompt. If no API key is set, it falls back to a rule-based insight that still works well for demos.

To enable real AI: set `OPENAI_API_KEY` in `.env`.

---

## AUTHOR
AKASH YADAV

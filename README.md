# 日本語 Tracker

A full-stack JLPT study tracker built with Next.js, Express, and MongoDB.

## Features

- **Daily Tracker** — Log vocab, listening, and grammar study each day
- **Streak System** — Track current and longest study streaks with milestone badges
- **Weekly Goals** — Set weekly targets and track progress with live progress bars
- **Mock Test Tracker** — Log JLPT practice test scores with pass/fail detection
- **Study Plans** — Create custom multi-week study plans for any JLPT level
- **Analytics** — Visual charts for weekly/monthly trends and test score history
- **Themes** — Multiple color themes (Neon Cyber, etc.) with localStorage persistence
- **CSV Export** — Download all daily entries as a CSV file
- **Mobile Responsive** — Hamburger nav for small screens

## Tech Stack

**Frontend**

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- React Hot Toast
- Axios

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT (httpOnly cookies)
- bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Fill in your .env.local values
npm run dev
```

## Environment Variables

See `.env.example` (backend) and `.env.local.example` (frontend).

## API Routes

| Method         | Endpoint                | Description             |
| -------------- | ----------------------- | ----------------------- |
| POST           | `/api/auth/register`    | Register a new user     |
| POST           | `/api/auth/login`       | Login                   |
| POST           | `/api/auth/logout`      | Logout                  |
| GET            | `/api/auth/me`          | Get current user        |
| GET/POST       | `/api/entries`          | Daily entries           |
| PUT/DELETE     | `/api/entries/:id`      | Update/delete entry     |
| GET/POST       | `/api/goals`            | Weekly goals            |
| GET            | `/api/goals/current`    | Current week goal       |
| DELETE         | `/api/goals/:id`        | Delete goal             |
| GET            | `/api/progress/summary` | Dashboard summary       |
| GET            | `/api/progress/weekly`  | Last 7 days chart data  |
| GET            | `/api/progress/monthly` | Last 30 days chart data |
| GET/POST       | `/api/tests`            | Mock test results       |
| DELETE         | `/api/tests/:id`        | Delete test             |
| GET/POST       | `/api/plans`            | Study plans             |
| GET/PUT/DELETE | `/api/plans/:id`        | Single plan             |

## Project Structure

```
backend/
├── config/         # MongoDB connection
├── controllers/    # Route handlers
├── middleware/     # Auth middleware
├── models/         # Mongoose schemas
├── routes/         # Express routers
└── utils/          # Streak + week utilities

frontend/
├── app/            # Next.js App Router pages
├── components/     # Reusable UI components
├── context/        # React context providers
├── hooks/          # Custom hooks
├── lib/            # Axios instance, themes
├── types/          # TypeScript interfaces
└── utils/          # CSV export utility
```

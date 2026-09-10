# Task Time Logger

A senior-level task management and time-tracking web application featuring seamless AI-driven task enhancement and personalized daily productivity insights.

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, React Query, Lucide Icons
- **Backend:** Next.js API Routes, Drizzle ORM, Neon Serverless PostgreSQL, JSON Web Tokens (JWT)
- **AI Integration:** Google Gemini API (`gemini-3.6-flash`)

## Setup Instructions for Local Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/task-time-logger.git
   cd task-time-logger
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the root directory and add the following keys:

   ```
   DATABASE_URL=your_neon_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Run database migrations:**

   ```bash
   npx drizzle-kit push
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Live Deployed Link

[https://task-and-time-tracking-app-by-saumya.vercel.app/](https://task-and-time-tracking-app-by-saumya.vercel.app/)

## Note for Reviewer / Examiner

- In `hooks/useGenerateTask.ts`, please use the `/api/ai/generate-task` endpoint instead of `/api/ai/generate-task-openrouter`.
- In `hooks/useGenerateTask.ts`, please use the `/api/ai/dashboard-summary` endpoint instead of `/api/ai/dashboard-summary-openrouter`.
- The Gemini model used here — `gemini-3.6-flash` — behaves exactly as required for this application.
- During development and testing, my Gemini API key reached its quota limit, so i configured open-router api key. Please keep this in mind while reviewing/testing AI-related features.

## About Time Tracking (For Reviewer / Examiner)

In the tracker API, `app/api/tracker/start/{id}` accepts a task `id`, but the system only allows **one active timer at a time** — this is intentional, to encourage focus and ensure accurate, real-time time logs.

Because of this, `app/api/tracker/stop/` does not accept any `id` — it simply stops whichever timer is currently active.

This single-active-timer rule is also enforced at the database level.

I implemented it this way based on my understanding of the requirements. If concurrent time tracking across multiple tasks is preferred instead, please let me know — it's just a few tweaks away!

# Task Time Logger

A senior-level task management and time-tracking web application featuring seamless AI-driven task enhancement and personalized daily productivity insights.

## Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS, React Query, Lucide Icons
* **Backend:** Next.js API Routes, Drizzle ORM, Neon Serverless PostgreSQL, JSON Web Tokens (JWT)
* **AI Integration:** Google Gemini API (`gemini-3.6-flash`)

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

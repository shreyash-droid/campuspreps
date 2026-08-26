# Campus Preps

A centralized academic resource platform for university students — previous year papers, study materials, curated YouTube links, an AI study assistant, and per-user favorites.

## Tech stack

Everything runs inside a single Next.js app. There is no separate backend server — the API routes under `app/api` **are** the Node.js backend.

| Layer      | Technology |
|------------|------------|
| Framework  | Next.js 15 (App Router, React 19) |
| Styling    | Tailwind CSS 4 |
| Auth       | NextAuth (Auth.js v5) — Google OAuth |
| Database   | PostgreSQL via Prisma ORM |
| AI chat    | Google Gemini (`@google/generative-ai`) |
| Email      | Nodemailer (contact form) |

## Features

- **Google sign-in** — one-click OAuth, sessions stored in Postgres.
- **Resources** — module notes, question papers (CATs/FATs), and YouTube links per subject/year.
- **Favorites** — save notes, PYQs, and links to your account.
- **AI assistant** — ask study questions, answered by Gemini.
- **Contact form** — messages delivered by email.

## Project structure

```
app/
  api/
    auth/[...nextauth]/   # NextAuth route handlers
    favorites/            # favorites CRUD (Prisma + session)
    chat/                 # Gemini AI assistant
    contact/              # contact form email
  components/             # UI components
  context/               # AuthContext (NextAuth wrapper) + FavoritesContext
  data/                  # static subject/resource data
  <routes>/              # pages (home, profile, favorites, subjects, ...)
auth.js                  # NextAuth config (Google + Prisma adapter)
lib/prisma.js            # Prisma client singleton
prisma/schema.prisma     # Postgres schema
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

- `DATABASE_URL` — your Postgres connection string.
- `AUTH_SECRET` — generate with `npx auth secret`.
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.
- `GOOGLE_API_KEY` — a Gemini API key for the AI assistant.
- `EMAIL_USER` / `EMAIL_PASS` / `RECIPIENT_EMAIL` — Gmail credentials for the contact form.

### 3. Set up the database

```bash
npm run db:push
```

This creates the tables from `prisma/schema.prisma`.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script            | Description |
|-------------------|-------------|
| `npm run dev`     | Start the dev server |
| `npm run build`   | Production build |
| `npm run start`   | Start the production server |
| `npm run lint`    | Lint |
| `npm run db:push` | Push the Prisma schema to Postgres |

# WaitForIt Static Website

WaitForIt is a React and Vite website for a developer visibility platform that helps engineers capture technical decisions, debugging notes, architecture trade-offs, and progress logs from their workflow.

The site includes a public marketing experience, blog-style content, waitlist capture, analytics tracking, and a lightweight admin/dashboard experience powered by an in-memory Express API.

## Features

- Multi-page single-page app experience with internal navigation
- Home, why, how it works, features, developers, roadmap, blog, about, contact, login, integration guide, and dashboard views
- Light and dark theme toggle
- Waitlist modal with duplicate email handling
- Seeded waitlist subscriber data
- Blog article modal with featured technical posts
- In-memory analytics events for page views, CTA clicks, blog reads, and waitlist signups
- Mock email pipeline with editable welcome email template
- CSV waitlist export endpoint
- Production build served through Express

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Express
- Motion
- Lucide React
- Canvas Confetti

## Project Structure

```text
.
+-- assets/                 Static assets
+-- src/
|   +-- components/         Shared UI components
|   +-- data/               Seed data for waitlist, analytics, emails, and blog posts
|   +-- pages/              App page views
|   +-- App.tsx             Main app routing and global state
|   +-- main.tsx            React entry point
|   +-- index.css           Global styles
|   +-- types.ts            Shared TypeScript types
+-- server.ts               Express API and Vite middleware server
+-- vite.config.ts          Vite configuration
+-- package.json            Scripts and dependencies
+-- README.md               Project documentation
```

## Prerequisites

Install Node.js before running the project.

Recommended:

- Node.js 20 or newer
- npm 10 or newer

## Environment Variables

Create a local environment file from the example:

```bash
cp .env.example .env.local
```

The current app does not require a real Gemini API key for the local waitlist, dashboard, analytics, or email-template demo flows. Keep the variables available if you extend the app with Gemini-powered features or deploy through AI Studio.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app:

```text
http://localhost:3000
```

The dev command starts Vite directly on port `3000`, so frontend transform errors and stack traces appear in the Vite terminal. Vite proxies `/api` requests to the Django backend at `http://127.0.0.1:8000` by default. Start Django in a second terminal; set `BACKEND_API_URL` to override its address. Keep `VITE_API_BASE_URL` unset in development so API requests use the Vite proxy.

For Railway, deploy this frontend as its own service from this project, with
`npm run build` as the build command and `npm start` as the start command. Set
`NODE_ENV=production` and `BACKEND_API_URL` to the public Django API origin, such as
`https://wait-for-it.up.railway.app`, without a trailing path. Railway provides
`PORT`; the server binds to that port on `0.0.0.0`. In local development, use
`http://127.0.0.1:8000` for `BACKEND_API_URL`.

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server on port `3000` and proxies `/api` requests to Django. Run the Django backend separately.

```bash
npm run build
```

Builds the Vite frontend and bundles the Express server into `dist/server.cjs`.

```bash
npm run start
```

Runs the production server from `dist/server.cjs`. Run `npm run build` first.

```bash
npm run lint
```

Runs TypeScript checks with `tsc --noEmit`.

```bash
npm run clean
```

Removes generated build output.

## API Routes

The app includes local mock API routes for the waitlist and dashboard.

### Waitlist

- `POST /api/v1/waitlist` creates a waitlist subscriber
- `GET /api/v1/waitlist` returns subscribers, with optional `search`, `role`, and `status` filters
- `PUT /api/v1/waitlist/:id` updates a subscriber
- `DELETE /api/v1/waitlist/:id` removes a subscriber
- `POST /api/v1/waitlist/export` exports subscribers as CSV

Example waitlist request:

```bash
curl -X POST http://localhost:3000/api/v1/waitlist \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Ada Lovelace\",\"email\":\"ada@example.com\",\"is_developer\":true,\"role\":\"Backend Engineer\",\"source\":\"readme\"}"
```

### Email Pipeline

- `GET /api/v1/email-pipeline/logs` returns welcome email delivery logs
- `POST /api/v1/email-pipeline/send` manually creates a welcome email log for a subscriber
- `GET /api/v1/email-template` returns the current welcome email template
- `PUT /api/v1/email-template` updates the welcome email template

### Analytics

- `GET /api/v1/analytics` returns dashboard summary metrics and recent events
- `POST /api/v1/analytics/event` records an analytics event

## Data Storage

This project uses in-memory data seeded from `src/data/initialData.ts`.

That means:

- Data resets whenever the server restarts
- Waitlist signups are not persisted to a database
- Email sending is simulated through local delivery logs
- Analytics are demo metrics, not production analytics

To make the app production-ready, replace the in-memory arrays in `server.ts` with a database and connect the email pipeline to a real email provider.

## Customization

Update public site copy and page content in the files under:

```text
src/pages/
```

Update seeded subscribers, email templates, analytics events, FAQs, and featured blog posts in:

```text
src/data/initialData.ts
```

Update shared app types in:

```text
src/types.ts
```

Update global styling in:

```text
src/index.css
```

## Build For Production

Create the production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

The production server serves static frontend assets from `dist` and keeps the same API routes available through Express.

## Deployment Notes

This app can be deployed anywhere that supports Node.js servers.

Typical deployment steps:

1. Install dependencies with `npm install`
2. Set required environment variables
3. Build with `npm run build`
4. Start with `npm run start`
5. Expose port `3000`

For static-only hosting, the frontend can be built with Vite, but the waitlist, analytics, dashboard, CSV export, and email-template routes will need to be moved to a hosted backend or serverless functions.

## License

No license has been specified for this project.

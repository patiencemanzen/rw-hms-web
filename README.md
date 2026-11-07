# Rw-HMS Web

Next.js frontend for **Rw-HMS**, the Rwanda National Hospital Management & Interconnection System.
It holds no business logic: every rule and permission check lives in the API
([`rw-hms-api`](../rw-hms-api)), and this app calls it over HTTP with cookies.

## Requirements

- Node.js 22+ and npm
- **The API must be running first.** Follow the setup in `rw-hms-api/README.md`
  (`docker compose up -d`, `npm run db:migrate`, `npm run db:seed`, `npm run start:dev`).

## Setup

```bash
npm install
cp .env.example .env.local
npm run api:types     # generate TypeScript types from the running API's OpenAPI spec
npm run dev           # http://localhost:3000
```

`API_URL` is read at build time and never reaches the browser. The browser calls `/api/*` on this
app, and `next.config.ts` proxies those calls to the API. Only `NEXT_PUBLIC_*` variables reach the
browser, so never put secrets in them.

## Scripts

| Script                               | What it does                                                                                         |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `npm run dev`                        | Start the dev server on port 3000                                                                    |
| `npm run build` / `npm start`        | Production build and server                                                                          |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript checks                                                                         |
| `npm test`                           | Component and unit tests (Vitest + Testing Library)                                                  |
| `npm run test:e2e`                   | Playwright end-to-end tests (API must be running; run `npx playwright install chromium` once)        |
| `npm run api:types`                  | Regenerate `lib/api/schema.d.ts` from `API_DOCS_URL` (default `http://localhost:4000/api/docs-json`) |

Run `npm run api:types` again whenever the API's endpoints or DTOs change. Never hand-write
response types that the spec already defines.

## Structure

```
app/[locale]/(app)/     signed-in pages, wrapped by <AuthGate> in the sidebar + top-bar shell
app/[locale]/(auth)/    login, forgot-password, reset-password
components/auth/        auth gate + useAuth() context, auth forms
components/ui/          shadcn/ui primitives (Radix + Tailwind)
components/layout/      sidebar, top bar, language switcher, user menu
components/common/      page header, empty / error / loading states
lib/api/                generated types, openapi-fetch client, TanStack Query hooks
lib/i18n/               next-intl routing and request config
lib/validators/         Zod form schemas mirroring the API DTO rules
lib/utils/              formatting, ID masking, age calculation
messages/               en.json, rw.json, fr.json
e2e/                    Playwright tests
```

## Deploying

Deploys to Vercel with the Next.js preset. Set one environment variable, `API_URL`, to the
API's public base URL. The full production guide, which covers the API on Render and the order of
steps, is in the API repo's README under "Deploying to production".

## Authentication

The API owns the session through httpOnly cookies, so the web app never sees a token. Because the
web and API run on different origins, Next.js middleware can't read those cookies. Instead,
`<AuthGate>` calls `GET /auth/me` on the client and sends signed-out visitors to
`/login?next=<path>`. The API checks access on every request anyway; the gate only controls
navigation.

`lib/api/client.ts` adds `X-CSRF-Token` (on writes) and `X-Facility-Id` to every request. When the
access token expires it refreshes once and retries, and concurrent refreshes share one request.
Components read the user, active facility and `signOut()` from `useAuth()`.

The Playwright `setup` project signs in once as `doctor.chuk@rwhms.gov.rw` and saves the session
to `e2e/.auth/` (gitignored). Override the account with `E2E_USER_EMAIL` / `E2E_USER_PASSWORD`.
The tests expect a seeded database.

## Internationalisation

The UI is available in English (`/en`), Kinyarwanda (`/rw`) and French (`/fr`). Every string lives
in `messages/*.json`, and a unit test fails if the three files don't have identical keys.
Kinyarwanda and French copy should be reviewed by native speakers before release.

## Design system

Colours, radii and status tones are defined as tokens in `app/globals.css`:

- Primary green `#00473A`, secondary `#1F5F4D`, tint `#E8F0EC`
- Page background `#F7F9F7`, card border `#DDE3DF`
- Status tones: critical, warning, info, success

The font is IBM Plex Sans. Use the `label-caps` class for small uppercase field and section labels.

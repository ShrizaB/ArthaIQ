# ArthaIQ — Your Money, Planned

A CRED-inspired personal finance dashboard built with modern React tooling.

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui design tokens |
| Routing | React Router v6 |
| Data Fetching | TanStack React Query v5 |
| Animations | Framer Motion |
| Charts | Recharts |
| Authentication | Civic Auth (PKCE + popup OIDC) |
| Database | PostgreSQL (schema in `src/db/schema.sql`) |
| Build Tool | Vite + SWC |

## Features

- **Dashboard** — Net worth trajectory, cash flow chart, goal snapshot, monthly summary
- **Goals** — Progress tracking for Emergency Fund, Home, Education, Retirement
- **Spending** — Category breakdown, donut chart, 6-month trend line
- **Portfolio** — Fund holdings table, XIRR bar, allocation donut
- **Tax Planner** — Live Old vs New regime comparison with sliders (80C, NPS, HRA, 80D)
- **AI Advisor** — Live Claude-powered chat with your full financial profile as context

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env` file:
```env
# Anthropic — for AI Advisor (get from console.anthropic.com)
VITE_ANTHROPIC_API_KEY=sk-ant-...

# Database (optional for demo — mock data works without it)
DATABASE_URL=postgresql://user:password@localhost:5432/arthaiq
```

### 3. Set up PostgreSQL (optional)
```bash
# Create database
createdb arthaiq

# Run schema
psql arthaiq < src/db/schema.sql
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Civic Authentication

The app uses Civic Auth with PKCE (no SDK needed — pure browser crypto).

**How it works:**
1. User clicks "Continue with Civic"
2. A popup opens to `auth.civic.com`
3. After verification, the popup redirects to `/auth/callback`
4. The main window polls the popup, extracts the auth code, and exchanges it for an id_token
5. The user object is stored in sessionStorage

**To use your own Civic app:**
1. Register at [civic.com](https://www.civic.com)
2. Replace `CIVIC_CLIENT_ID` in `src/lib/civicAuth.tsx`
3. Add `http://localhost:5173/auth/callback` as an allowed redirect URI

## Project Structure

```
src/
├── components/
│   ├── charts/       # Recharts wrappers (NetWorthChart, CashFlowChart, etc.)
│   ├── layout/       # AppLayout, sidebar, topbar
│   └── ui/           # Card, GoalCard, and other shared components
├── db/
│   └── schema.sql    # PostgreSQL schema with indexes and triggers
├── hooks/
│   └── useFinanceData.ts  # TanStack Query hooks
├── lib/
│   ├── civicAuth.tsx # Civic Auth provider, gate, badge
│   ├── data.ts       # Mock data + AI system prompt
│   └── utils.ts      # formatINR, cn, goalProgress
├── pages/
│   ├── DashboardPage.tsx
│   ├── GoalsPage.tsx
│   ├── SpendingPage.tsx
│   ├── PortfolioPage.tsx
│   ├── TaxPage.tsx
│   └── AIAdvisorPage.tsx
├── types/
│   └── index.ts      # TypeScript interfaces
├── App.tsx           # Root — QueryClient + Civic + Router
├── index.css         # Tailwind + CRED dark palette CSS vars
└── main.tsx
```

## Build for Production

```bash
npm run build
# Output in /dist — deploy to Vercel, Netlify, or any static host
```

## Connecting Real Data

The `src/hooks/useFinanceData.ts` file contains TanStack Query hooks wired to mock data. To connect PostgreSQL:

1. Build a simple API layer (Express / Next.js / Hono)
2. Replace the mock fetchers with `fetch('/api/...')` calls
3. Use the schema in `src/db/schema.sql` as your data model

## Design System

The CRED-inspired palette:

| Token | Value | Usage |
|---|---|---|
| `bg` | `#0D0D0D` | App background |
| `surface-1` | `#141414` | Cards, sidebar |
| `surface-2` | `#1A1A1A` | Hover states |
| `ink` | `#F5F0E8` | Primary text |
| `ink-2` | `#A09A90` | Secondary text |
| `gold` | `#C9A84C` | Accent, CTA |
| `gain` | `#3DAA70` | Positive values |
| `loss` | `#C05050` | Negative values |

Fonts: **DM Serif Display** (numbers/headings) · **DM Sans** (body) · **DM Mono** (labels/data)

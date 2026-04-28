# Stranded Energy MVP

Stranded Energy MVP is a local demo app for screening stranded gas and marginal field development opportunities. It helps a founder or commercial team move from a raw opportunity to a structured screening view, including score, gas-to-power sizing, preliminary economics, risks, monetization options, and a draft project memo.

This is a local MVP. It is designed for demos, workflow testing, and early diligence conversations.

## What The App Does

The app helps you:

- Create and edit energy opportunities.
- Capture resource, infrastructure, commercial, and regulatory inputs.
- Score an opportunity across 10 screening categories.
- Estimate gas-to-power capacity from available gas.
- Run a preliminary financial screen.
- Build a risk register.
- Compare monetization options.
- Select a preferred monetization concept.
- Generate, edit, and export a Markdown or print-to-PDF project memo.
- See latest score, classification, recommended MW, estimated capex, EBITDA, and last updated values on the dashboard.

## Who It Is For

This MVP is for:

- Founders evaluating stranded energy opportunities.
- Energy developers screening early-stage projects.
- Commercial teams comparing monetization routes.
- Investors reviewing preliminary development logic.
- Advisors preparing early project memos.

It is not intended for final engineering, legal, environmental, interconnection, reserve, or investment decisions.

## Current MVP Modules

- **Dashboard:** overview of all opportunities and latest saved outputs.
- **Opportunity CRUD:** create, edit, and delete opportunities.
- **Scoring:** 10-category deterministic opportunity score and classification.
- **Gas-to-Power:** screening calculator for theoretical, practical, and recommended MW.
- **Financial Screen:** preliminary capex, revenue, opex, EBITDA, payback, and break-even view.
- **Risk Register:** default and manual risks with probability, impact, severity, mitigation, and owner.
- **Monetization Options:** ranked rule-based options such as gas-to-power, pipeline tie-in, CNG, mini-LNG, and defer.
- **Memo Generator:** draft project memo using saved opportunity data and latest analysis snapshots.
- **Memo Export:** local Markdown export and browser print-to-PDF export.

## Project Stack

- Next.js App Router
- TypeScript
- Tailwind
- Prisma 7
- SQLite
- Prisma `better-sqlite3` adapter
- Recharts
- pnpm

## Prerequisites

Install these first:

- Node.js 20 or newer
- pnpm
- Git

No external database, API key, or cloud service is required for the local MVP.

## Setup Instructions

Open a terminal in the repository:

```bash
cd C:\Users\kunle\Projects\stranded-energy-mvp
```

Install dependencies:

```bash
pnpm install
```

Generate Prisma Client:

```bash
pnpm prisma generate
```

## Environment Setup

Create `.env` from the example file if needed:

```bash
cp .env.example .env
```

For local demos, `.env` should contain:

```bash
DATABASE_URL="file:./dev.db"
```

The app uses Prisma 7 with SQLite through the Prisma `better-sqlite3` adapter. The shared Prisma Client is configured in `lib/db.ts`.

## Prisma Migration And Seed

Run the migration:

```bash
pnpm prisma migrate dev --name init
```

Load seed data:

```bash
pnpm prisma db seed
```

Open Prisma Studio if you want to inspect or edit database records directly:

```bash
pnpm prisma studio
```

## Resetting The Demo Database

Before a founder demo, you can reset the local SQLite database and reload the three seed opportunities:

```bash
pnpm demo:reset
```

This deletes local demo records and reloads:

- West Texas Stranded Gas Power Screen
- Niger Delta Marginal Field Modular Infrastructure Screen
- Louisiana Flare Gas Modular Power Opportunity

To inspect the database after reset:

```bash
pnpm db:studio
```

See `docs/demo-reset.md` for the full reset workflow and warning.

## Run The App

Start the local development server:

```bash
pnpm dev
```

Open the app:

```text
http://localhost:3000
```

Useful checks:

```bash
pnpm lint
pnpm test
pnpm build
```

Run tests once:

```bash
pnpm test
```

Run tests in watch mode while developing:

```bash
pnpm test:watch
```

## End-To-End Workflow

Use the seed opportunity `West Texas Stranded Gas Power Screen` for a full demo.

1. Open the dashboard at `http://localhost:3000`.
2. Click `Edit` on `West Texas Stranded Gas Power Screen`.
3. Review the opportunity profile and the resource, infrastructure, commercial, and regulatory data.
4. Click `Score Opportunity`, review suggested scores, optionally override values, and save.
5. Click `Gas-to-Power`, review prefilled gas assumptions, check sensitivity cases, and save.
6. Click `Financial`, review the prefilled gas-to-power outputs, check economics and charts, and save.
7. Click `Risks`, generate default risks, then edit owners, mitigations, next actions, and statuses.
8. Click `Monetization`, review ranked options, and mark one option as preferred.
9. Click `Memo`, generate the project memo, edit any sections, save, and export Markdown or open the print view to save as PDF.
10. Return to the dashboard and show the latest saved score, classification, recommended MW, capex, EBITDA, and last updated date.

## Exporting Project Memos

The memo page supports two local export paths:

- `Export Markdown` downloads an editable `.md` file.
- `Print / Save as PDF` opens a clean print view. Use the browser print dialog and choose `Save as PDF`.

The PDF path uses the browser print feature, so no external PDF service or API is required.

## Pipeline View

Open `http://localhost:3000/pipeline` to see all opportunities grouped by status. Each card shows the latest score, classification, recommended MW, EBITDA, and last updated date when those outputs exist.

Use the status dropdown on each card to move an opportunity through the simple v1 pipeline. This is a lightweight visual workflow view, not a full CRM or drag-and-drop sales pipeline.

## Known Limitations

- Screening-level calculations only.
- No authentication or user roles.
- No live GIS, map layers, satellite imagery, pipeline databases, or market data.
- No live interconnection modeling.
- No engineering drawings or equipment design.
- No legal, regulatory, environmental, tax, or land-title determination.
- No bankable project finance model.
- No automated external data ingestion.
- PDF export uses the browser print dialog rather than a server-side PDF renderer.
- SQLite is used for local development and demos, not production operations.
- Server action validation is intentionally simple and may show framework errors for invalid manual submissions.

## Troubleshooting

If dependencies are missing:

```bash
pnpm install
```

If Prisma Client is out of date:

```bash
pnpm prisma generate
```

If the database is empty:

```bash
pnpm prisma db seed
```

If migrations are not applied:

```bash
pnpm prisma migrate dev --name init
```

If the app will not start, make sure `.env` exists and includes:

```bash
DATABASE_URL="file:./dev.db"
```

If port `3000` is already in use, stop the other local server or run Next.js on another port:

```bash
pnpm dev -- -p 3001
```

If you want to inspect data directly:

```bash
pnpm prisma studio
```

## V2 Roadmap

Practical next items:

- Scenario comparison for gas-to-power and financial cases.
- Better unit tests for scoring, gas-to-power, financial, risk, monetization, and memo logic.
- Data reset command for demos.
- Shared formatting helpers for money, MW, MWh, dates, and percentages.
- Opportunity pipeline Kanban.
- Document upload and simple data room.
- AI-assisted memo drafting with explicit source references.
- Counterparty CRM.
- GIS/map view.
- Advanced financial model with debt, tax, depreciation, IRR, NPV, and sensitivities.
- Data room export.

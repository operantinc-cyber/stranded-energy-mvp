# Stranded Energy MVP

This repository contains two linked pieces:

- A simple public website for an AI-native energy infrastructure developer.
- An internal concierge development desk for screening stranded gas, flare gas, marginal field, and modular power opportunities.

The public site communicates the company vision. The internal desk is the current proof point.

## What This Project Is

An AI-native energy infrastructure developer focused on stranded and underused energy assets.

The company uses autonomous agents and structured development workflows to originate, screen, structure, and advance overlooked energy opportunities.

## What The MVP Is

The current MVP is a concierge development screen. It helps turn a raw opportunity into a practical development concept with intake review, technical sizing, preliminary economics, risk review, monetization comparison, and a project memo.

It is a first proof point, not the final product.

## What The Final Company Vision Is

The long-term business is a development company with workflow leverage from autonomous agents. The value should come from project origination, development rights, development fees, success fees, project equity, carried interest, and operating intelligence.

## Public Website Vs Internal MVP

- The public website is the homepage at `/`.
- The public website should be simple and should not link to the internal desk.
- The internal development desk lives in direct routes such as `/pipeline`, `/intake`, `/crm`, `/commercial`, `/partners`, and `/opportunities/[id]/*`.
- The internal desk is a local working surface for founder-led development, not the company itself.

## Messaging Separation

- Public language should say `AI-native energy infrastructure developer`.
- MVP language should say `concierge development screen` or `internal development desk`.
- Avoid describing the company as a generic SaaS platform, dashboard product, or software tool.
- Use `development workflow`, `project origination`, `development partner`, and `operating intelligence` when describing the larger business.
- `docs/messaging-guide.md` is the source of truth for wording.

## Autonomy-Ready Architecture

- Autonomous agents are internal leverage.
- Structured workflows create repeatability.
- The system is designed to learn from screened opportunities, not just store records.
- Over time, the workflow should support origination, prioritization, concept selection, packaging, and project advancement.

## What This Is Not

- Not a generic SaaS product.
- Not just a dashboard.
- Not final engineering.
- Not legal advice.
- Not investment advice.
- Not reserve certification.
- Not interconnection study.
- Not environmental opinion.
- Not bankable feasibility study.

## Who It Is For

The public company story and internal workflow are relevant for:

- Operators and gas producers.
- Marginal field owners.
- Infrastructure investors and family offices.
- EPC and modular infrastructure partners.
- Industrial power users and data center developers.
- Advisors and development agencies working on stranded assets.

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

## Website and internal app separation

- `/` is a simple public landing page for the Stranded Energy Development Screen service.
- The public landing page intentionally does not expose or link to internal MVP pages.
- Internal MVP tools are not part of the public website.
- The internal development desk is available through direct routes such as `http://localhost:3000/pipeline` and the opportunity detail pages.
- The internal MVP workflow remains under `/opportunities`, `/pipeline`, `/intake`, `/crm`, `/commercial`, and `/partners`.
- The public landing page does not use the database.
- The internal MVP uses SQLite locally.
- Authentication is not included in V1 and should be added before public deployment of internal tools.

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

1. Open the internal development desk at `http://localhost:3000/pipeline`.
2. Click `Edit` on `West Texas Stranded Gas Power Screen`.
3. Review the opportunity profile and the resource, infrastructure, commercial, and regulatory data.
4. Click `Score Opportunity`, review suggested scores, optionally override values, and save.
5. Click `Gas-to-Power`, review prefilled gas assumptions, check sensitivity cases, and save.
6. Click `Financial`, review the prefilled gas-to-power outputs, check economics and charts, and save.
7. Click `Risks`, generate default risks, then edit owners, mitigations, next actions, and statuses.
8. Click `Monetization`, review ranked options, and mark one option as preferred.
9. Click `Memo`, generate the project memo, edit any sections, save, and export Markdown or open the print view to save as PDF.
10. Return to the pipeline or opportunity detail page and show the latest saved score, classification, recommended MW, capex, EBITDA, and last updated date.

## Exporting Project Memos

The memo page supports two local export paths:

- `Export Markdown` downloads an editable `.md` file.
- `Print / Save as PDF` opens a clean print view. Use the browser print dialog and choose `Save as PDF`.

The PDF path uses the browser print feature, so no external PDF service or API is required.

## Pipeline View

Open `http://localhost:3000/pipeline` to see all opportunities grouped by status. Each card shows the latest score, classification, recommended MW, EBITDA, and last updated date when those outputs exist.

Use the status dropdown on each card to move an opportunity through the simple v1 pipeline. This is a lightweight visual workflow view, not a full CRM or drag-and-drop sales pipeline.

## Client Intake Workflow

Use `docs/client-intake-form.md` to collect minimum screening data from an operator, investor, or asset owner. A reusable copy is also available at `templates/client-intake-form.md`.

Open `http://localhost:3000/intake` for the internal checklist. Use it to review data quality, identify red flags, decide what follow-up questions are needed, and confirm whether the opportunity is ready to enter the MVP.

After intake review, create a new opportunity in the app. Then proceed through scoring, gas-to-power, financial screen, risks, monetization options, and memo generation.

## Counterparty CRM And Outreach Workflow

Use `templates/target-counterparty-crm.csv` as the initial CRM for operators, investors, EPC partners, vendors, offtakers, advisors, and regional energy contacts.

Use `docs/outreach-playbook.md` to prioritize the first 100 contacts and decide when a lead is qualified. Use `docs/outreach-templates.md` for concise first outreach by segment.

Qualified opportunities should move into the app through the client intake process. Start with `docs/client-intake-form.md`, review the responses at `http://localhost:3000/intake`, then create an opportunity when the asset or counterparty is credible enough to screen.

## Commercial Service Package

Use `docs/service-overview.md` to define the Stranded Energy Development Screen offer for clients.

Use `docs/pricing-sheet.md` for early pricing ranges across diagnostics, full development screens, advanced pre-feasibility support, and development partnerships.

Use `templates/feasibility-proposal-template.md` as a starting point for paid work proposals. Include or adapt `docs/report-disclaimer.md` in client-facing memos and reports.

## Investor And Partner Materials

Use `docs/thesis-deck-outline.md` as the 12-slide narrative for explaining the business thesis.

Investor and partner one-pagers are available in `docs/`, including materials for investors, operators, EPC/vendor partners, offtakers, and advisor recruiting.

Open `http://localhost:3000/partners` to see a simple in-app summary of the materials and how each audience should be approached.

## Map/GIS View

Add latitude and longitude to an opportunity using decimal degrees, then open the opportunity Map page from the detail page or pipeline action area.

V1 uses an embedded OpenStreetMap view and external map links for quick location review. It does not require API keys and does not perform full GIS, land, pipeline, substation, road, environmental, or interconnection analysis.

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

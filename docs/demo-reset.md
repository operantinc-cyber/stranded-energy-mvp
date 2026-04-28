# Demo Database Reset

The local demo database is the SQLite database used by this MVP on your machine. It stores the local opportunities, scoring snapshots, gas-to-power results, financial screens, risks, monetization preferences, and memos.

For founder demos, it is useful to reset the database back to the same three seed opportunities.

## Warning

`pnpm demo:reset` deletes local demo database records and reloads seed data. Do not run it if you need to keep local edits, saved calculations, risks, or memos.

## Reset And Reseed

From the project folder:

```bash
pnpm demo:reset
```

This runs Prisma migrate reset and then loads the seed data.

Expected seed records:

- West Texas Stranded Gas Power Screen
- Niger Delta Marginal Field Modular Infrastructure Screen
- Louisiana Flare Gas Modular Power Opportunity

## Inspect The Database

Open Prisma Studio:

```bash
pnpm db:studio
```

In Prisma Studio, open the `Opportunity` table and confirm the three seed opportunities exist.

## Run The App

Start the app:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

The dashboard should show the three seed opportunities.


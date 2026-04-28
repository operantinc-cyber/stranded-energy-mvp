# Demo Script: 7-10 Minute Founder Walkthrough

Use the seed opportunity:

```text
West Texas Stranded Gas Power Screen
```

Goal of the demo: show how a founder can take a stranded gas opportunity from raw diligence inputs to a structured development memo in one local workflow.

## Before The Demo

Run:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000/pipeline
```

If the seed opportunity is missing, run:

```bash
pnpm prisma db seed
```

## 1. Internal Development Desk

Approximate time: 1 minute

Talking points:

- "This is the internal development desk. It gives us one place to track stranded energy opportunities."
- "Each row shows the opportunity name, asset type, location, status, score, classification, recommended MW, capex, EBITDA, and last updated date."
- "The desk is intentionally simple. The point of the MVP is not portfolio analytics yet. The point is to move one opportunity through a repeatable development workflow."

Demo actions:

- Point to `West Texas Stranded Gas Power Screen`.
- Point to the action links: `Edit`, `Score`, `G2P`, `Financial`.
- Click `Edit`.

## 2. Opportunity Detail

Approximate time: 1 minute

Talking points:

- "This is the core opportunity record."
- "We capture basic asset information, location, ownership, status, and description."
- "Below that, we capture the inputs that drive the rest of the screening workflow: resource, infrastructure, commercial, and regulatory data."
- "For a founder demo, the important point is that the workflow starts with structured data instead of a scattered spreadsheet or memo."

Demo actions:

- Briefly scroll through Resource Data.
- Point out available gas and gas heating value.
- Briefly scroll through Infrastructure, Commercial, and Regulatory sections.
- Click `Score Opportunity`.

## 3. Scoring

Approximate time: 1 minute

Talking points:

- "The app auto-suggests a score using deterministic rules."
- "The score is not a black box. A user can override every category."
- "The 10 categories cover resource quality, infrastructure, market demand, technical feasibility, commercial control, regulatory feasibility, economics, speed, repeatability, and counterparty seriousness."
- "The total score is normalized to 100 and converted into a classification: Priority, Develop, Watch, or Reject."

Demo actions:

- Show suggested scores.
- Leave the defaults or adjust one category.
- Click `Save Score`.
- Point out the total score and classification.
- Go back to the opportunity detail page.

## 4. Gas-To-Power Calculator

Approximate time: 1 minute

Talking points:

- "Next we estimate what the gas resource could support as a power project."
- "Available gas and heating value are prefilled from the resource data."
- "The assumptions are simple: heat rate, availability, and parasitic load."
- "The output gives theoretical MW, practical low and high cases, recommended MW, annual MWh, and fuel energy."
- "This is a screening calculator, not an engineering design."

Demo actions:

- Click `Gas-to-Power`.
- Show the prefilled gas volume and heating value.
- Show the recommended MW.
- Show the 75 percent, 100 percent, and 125 percent sensitivity table.
- Click `Save Gas-to-Power Result`.
- Go back to the opportunity detail page.

## 5. Financial Screen

Approximate time: 1-1.5 minutes

Talking points:

- "The financial screen pulls from the latest gas-to-power result."
- "Project size, annual MWh, and annual fuel are prefilled so the workflow carries forward."
- "We can override power price, gas price, capex, fixed opex, and variable opex."
- "The outputs are capex range, revenue, fuel cost, fixed opex, variable opex, total opex, EBITDA, payback, and break-even power price."
- "The charts are there to make the demo intuitive: EBITDA versus power price, payback versus capex, and a simple revenue / opex / EBITDA bar chart."

Demo actions:

- Click `Financial`.
- Show assumptions.
- Show outputs.
- Show charts.
- Click `Save Financial Screen`.
- Go back to the opportunity detail page.

## 6. Risk Register

Approximate time: 1 minute

Talking points:

- "Now we move from calculations to development risk."
- "The app can generate default risks from the opportunity data."
- "Each risk has category, description, probability, impact, severity, mitigation, owner, next action, and status."
- "Severity is simple: probability times impact."
- "This gives the founder a practical risk register without needing to start from a blank page."

Demo actions:

- Click `Risks`.
- Click `Generate Default Risks`.
- Show risks sorted by severity.
- Edit one owner or next action if useful.
- Click `Save Risk`.
- Go back to the opportunity detail page.

## 7. Monetization Options

Approximate time: 1 minute

Talking points:

- "The monetization page compares possible development pathways."
- "The app ranks options such as gas-to-power, pipeline tie-in, processing, CNG, mini-LNG, reinjection, onsite industrial power, data center power, marginal field redevelopment, and defer."
- "The ranking is rule-based. It uses gas volume, pipeline distance, industrial offtake, continuous flaring, gas quality, land availability, and asset type."
- "For the demo, we can mark a preferred concept. That preferred concept flows into the memo."

Demo actions:

- Click `Monetization`.
- Show ranked option cards.
- Point out feasibility, capex intensity, time to execute, requirements, risks, recommendation, and score.
- Click `Mark Preferred` on `Gas-to-Power` or the top-ranked option.
- Go back to the opportunity detail page.

## 8. Memo Generator

Approximate time: 1-1.5 minutes

Talking points:

- "The memo generator pulls together the structured data and latest saved analysis."
- "It uses the score, gas-to-power result, financial screen, risk register, and preferred monetization concept."
- "The language is intentionally cautious. It distinguishes known data, assumptions, and data gaps."
- "This is useful because a founder can quickly turn a messy opportunity into a readable development memo."

Demo actions:

- Click `Memo`.
- Click `Generate Memo`.
- Scroll through the preview sections:
  - Executive Summary
  - Asset and Location Overview
  - Resource Basis
  - Infrastructure Review
  - Monetization Options
  - Recommended Development Concept
  - Preliminary Technical Configuration
  - Commercial Structure
  - Preliminary Financial Screen
  - Risk Register Summary
  - Development Roadmap
  - Go / No-Go Recommendation
  - Immediate Next Actions, Assumptions, and Data Gaps
- Edit one sentence in the memo.
- Click `Save Memo`.
- Click `Export Markdown`.

## 9. Close

Approximate time: 30 seconds

Talking points:

- "In under 10 minutes, we moved from a raw seeded opportunity to a scored, sized, financially screened, risk-reviewed, monetization-ranked project memo."
- "The MVP is not trying to replace engineering or legal diligence. It is a structured front-end screening workflow."
- "The next step is to improve validation, scenario comparison, PDF export, GIS, document uploads, and more robust financial modeling."

Demo action:

- Return to the pipeline.
- Show that latest score, classification, recommended MW, capex, EBITDA, and last updated values are populated.

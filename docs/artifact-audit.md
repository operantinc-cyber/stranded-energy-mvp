# Artifact Audit

This log records the major public and internal artifacts reviewed during the messaging cleanup.

| File | Audience | Corrected Purpose | Messaging Status | Notes |
| --- | --- | --- | --- | --- |
| `app/page.tsx` | Public | Public landing page for the company vision | Updated | Now communicates the AI-native energy infrastructure developer story and avoids internal routes. |
| `README.md` | Internal and founder-facing | Repo orientation and messaging separation | Updated | Now distinguishes the public website from the internal development desk. |
| `docs/service-overview.md` | Clients | Service description and offer framing | Updated | Emphasizes concierge development screen as the first proof point. |
| `docs/pricing-sheet.md` | Clients | Pricing ladder and engagement framing | Updated | Frames pricing as development services, not software subscription. |
| `docs/thesis-deck-outline.md` | Investors and partners | Narrative deck outline | Updated | Reframed around AI-native energy infrastructure development and autonomous project origination. |
| `docs/investor-one-pager.md` | Investors | Investor narrative and milestones | Updated | Emphasizes development company economics, project rights, and operating intelligence. |
| `docs/operator-partner-one-pager.md` | Operators | Operator outreach summary | Updated | Focuses on stranded assets and practical development concepts. |
| `docs/epc-vendor-partner-one-pager.md` | EPC and vendors | Partner outreach summary | Updated | Frames vendors as early technical partners in a development workflow. |
| `docs/offtaker-partner-one-pager.md` | Offtakers | Dedicated power and supply narrative | Updated | Focuses on load needs and early-stage site screening. |
| `docs/advisor-recruitment-note.md` | Advisors | Advisor outreach note | Updated | Requests practical support for the internal development desk and company buildout. |
| `docs/demo-script.md` | Founder demo | Internal workflow demo script | Updated | Reworded around the internal development desk rather than a dashboard product. |
| `docs/methodology.md` | Internal and client-facing technical note | Screening methodology | Updated | Keeps the screening language tied to the development desk. |
| `docs/known-limitations.md` | Internal and client-facing caution note | Limits of the MVP | Updated | Clarifies that the internal desk is a preliminary screening tool. |
| `docs/v2-roadmap.md` | Internal planning | Roadmap for product and company evolution | Updated | Adds messaging guardrails and removes platform-style framing. |
| `docs/map-gis-view.md` | Internal and client-facing | Lightweight asset location view | Updated | Describes the simple coordinate-based map view. |
| `docs/report-disclaimer.md` | Client-facing | Standard report disclaimer | Updated | Appropriate and retained as-is for client materials. |
| `docs/client-intake-form.md` | Client-facing | Intake questionnaire | Updated | Keeps the intake language tied to screening and the internal development desk. |
| `docs/internal-intake-checklist.md` | Internal | Founder checklist for screening readiness | Updated | Clarifies its role inside the development desk. |
| `docs/target-counterparty-crm.md` | Internal and founder-facing | CRM template guidance | Updated | Positioned as a business development tracker, not software. |
| `docs/outreach-playbook.md` | Internal | Outreach prioritization guide | Updated | Focuses on qualifying opportunities for the development desk. |
| `docs/outreach-templates.md` | Internal | First outreach email templates | Updated | Reframed around the company vision and current proof point. |
| `templates/feasibility-proposal-template.md` | Client/proposal | Paid development screen proposal template | Updated | Tied to the AI-native energy infrastructure developer story. |
| `templates/client-intake-form.md` | Client-facing | Intake questionnaire copy | Updated | Matches the client intake form messaging. |
| `templates/target-counterparty-crm.csv` | Internal | CRM seed template | Updated | Example rows only; suitable for manual outreach tracking. |
| `app/pipeline/page.tsx` | Internal | Opportunity pipeline | Unchanged for messaging cleanup | Internal desk route, not part of the public website. |
| `app/dashboard/page.tsx` | Internal | Legacy internal desk route | Updated | Reworded to internal development desk language and kept off the public homepage. |
| `app/opportunities/[id]/page.tsx` | Internal | Opportunity detail page | Unchanged for messaging cleanup | Internal desk route, not part of the public website. |

## Notes

- The public website should stay simple and should not link to internal routes.
- The internal desk should keep using practical development language.
- Remaining files that may still need manual review are any newly created internal notes or ad hoc client emails outside this repository.

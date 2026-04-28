# MVP Methodology

This document describes the internal development desk that supports the AI-native energy infrastructure developer. The current proof point is a concierge development screen.

## Disclaimer

This is a preliminary development screening tool, not final engineering design, legal advice, investment advice, reserve certification, interconnection study, environmental opinion, or bankable feasibility study.

All outputs should be treated as directional screening results. Any real project decision requires qualified engineering, legal, environmental, commercial, interconnection, and financial review.

## Opportunity Scoring Methodology

The scoring engine assigns 1-10 scores across 10 categories:

- Resource Quality
- Infrastructure Proximity
- Market Demand
- Technical Feasibility
- Commercial Control
- Regulatory Feasibility
- Economic Potential
- Speed to Execute
- Strategic Repeatability
- Counterparty Seriousness

The total score is normalized to 100.

Classification:

- 80-100: Priority
- 60-79: Develop
- 40-59: Watch
- Below 40: Reject

The scores are deterministic and rule-based. They use available structured inputs such as gas volume, gas quality, infrastructure distance, owner/control signals, offtake signals, permitting complexity, and counterparty interest.

Manual overrides are allowed because early development data often includes judgment calls that are not fully captured in structured fields.

## Gas-To-Power Screening Assumptions

The gas-to-power calculator estimates power potential from available gas.

Inputs include:

- Available gas in MMscfd.
- Heating value in Btu/scf.
- Generator heat rate in Btu/kWh.
- Availability percentage.
- Parasitic load percentage.

The calculator estimates:

- Daily energy content.
- Gross kWh per day.
- Gross MW.
- Net MW after parasitic load.
- Practical MW low and high range.
- Recommended MW as the midpoint of the practical range.
- Annual MWh.
- Annual fuel energy.

The default assumptions are screening assumptions only. They are not equipment selections, dispatch studies, EPC estimates, or reliability studies.

## Financial Screening Assumptions

The financial screen uses the latest gas-to-power result when available.

Inputs include:

- Project size in MW.
- Annual MWh.
- Power price.
- Gas price.
- Annual fuel MMBtu.
- Low, base, and high capex per kW.
- Fixed opex per kW-year.
- Variable opex per MWh.

The screen estimates:

- Total capex low, base, and high.
- Annual revenue.
- Annual fuel cost.
- Annual fixed opex.
- Annual variable opex.
- Total annual opex.
- EBITDA.
- Simple payback.
- Break-even power price.

This is not a bankable financial model. It does not include debt, tax, depreciation, working capital, construction timing, inflation, escalation, curtailment, outage modeling, hedges, contract terms, or full project finance metrics.

## Financial Scenario Comparison

The financial screen also derives Low Case, Base Case, and High Case sensitivities from the current assumptions.

- Low Case reduces power price and annual production while increasing gas price and base capex.
- Base Case uses the assumptions entered on the financial screen.
- High Case increases power price and annual production while reducing gas price and base capex.

Each case recalculates revenue, fuel cost, annual opex, EBITDA, base capex, simple payback, and break-even power price. These scenarios are screening-level sensitivities only. They are not a forecast, financing case, investment recommendation, or bankable downside/base/upside model.

## Risk Severity Methodology

The risk register uses a simple probability-impact matrix.

Probability values:

- Low = 1
- Medium = 2
- High = 3

Impact values:

- Low = 1
- Medium = 2
- High = 3

Severity equals probability value multiplied by impact value.

Risks are sorted by severity score descending. Default risks are generated from common stranded energy development issues and selected opportunity fields.

## Monetization Ranking Methodology

The monetization engine compares options including:

- Gas-to-Power
- Pipeline Tie-In
- Gas Processing/NGL Recovery
- CNG
- Mini-LNG
- Reinjection
- Onsite Industrial Power
- Data Center Power
- EPF/Marginal Field Redevelopment
- Do Nothing/Defer

The ranking is rule-based. It considers:

- Gas volume.
- Pipeline distance.
- Industrial offtake signals.
- Continuous flaring.
- Gas contaminants such as H2S and CO2.
- Land availability.
- Asset type.
- Infrastructure availability.

Each option receives:

- Feasibility.
- Capex intensity.
- Time to execute.
- Key requirements.
- Key risks.
- Recommendation.
- Score.

This is not a substitute for commercial negotiation, engineering concept selection, market study, or legal review.

## Memo Generation Logic

The memo generator pulls from:

- Opportunity profile.
- Resource data.
- Infrastructure data.
- Commercial data.
- Regulatory data.
- Latest scoring result.
- Latest gas-to-power result.
- Latest financial screen.
- Risk register.
- Preferred monetization concept.

The generated memo uses cautious development language and attempts to distinguish:

- Known data.
- Assumptions.
- Missing data.
- Screening-level outputs.

The user can manually edit all memo sections before saving and exporting Markdown.

## What The MVP Does Not Validate

The MVP does not validate:

- Reserves.
- Deliverability.
- Gas composition lab accuracy.
- Engineering design.
- Emissions compliance.
- Permitting requirements.
- Legal rights.
- Land title.
- Interconnection queue status.
- Pipeline capacity.
- Counterparty credit.
- Bankability.
- Tax treatment.
- EPC cost certainty.
- Construction schedule certainty.

## When External Validation Is Required

Use qualified experts before making real commitments.

Engineering validation is required for:

- Generator selection.
- Gas treatment.
- Compression.
- Electrical design.
- Site layout.
- Reliability and availability assumptions.
- EPC cost and schedule.

Legal validation is required for:

- Gas rights.
- Land rights.
- Mineral rights.
- Easements.
- Commercial contracts.
- Corporate authority.
- Regulatory obligations.

Environmental validation is required for:

- Air permits.
- Water permits.
- Emissions.
- Noise.
- Waste handling.
- Community impact.
- Environmental liability.

Interconnection validation is required for:

- Utility process.
- Queue position.
- Study requirements.
- Upgrade costs.
- Export limits.
- Behind-the-meter configuration.

Financial validation is required for:

- Bankable capex.
- Debt sizing.
- Tax assumptions.
- Contracted revenue.
- Sensitivities.
- IRR and NPV.
- Financing documents.

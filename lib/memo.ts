import type {
  CommercialData,
  FinancialScreenResult,
  GasToPowerResult,
  InfrastructureData,
  Opportunity,
  ProjectMemo,
  RegulatoryData,
  ResourceData,
  RiskItem,
  ScoringResult,
} from "@prisma/client";

export type MemoBundle = Opportunity & {
  resourceData: ResourceData | null;
  infrastructureData: InfrastructureData | null;
  commercialData: CommercialData | null;
  regulatoryData: RegulatoryData | null;
  scoringResults: ScoringResult[];
  gasToPowerResults: GasToPowerResult[];
  financialScreenResults: FinancialScreenResult[];
  risks: RiskItem[];
  projectMemo: ProjectMemo | null;
};

export type GeneratedProjectMemo = {
  executiveSummary: string;
  assetDescription: string;
  resourceBasis: string;
  infrastructureReview: string;
  monetizationOptions: string;
  recommendedConcept: string;
  technicalDesign: string;
  commercialStructure: string;
  financialSummary: string;
  riskSummary: string;
  developmentRoadmap: string;
  goNoGoRecommendation: string;
  nextActions: string;
  assumptions: string;
  dataGaps: string;
};

export const MEMO_DISCLAIMER =
  "This development screen is a preliminary commercial and technical screening document. It is not a final engineering design, investment recommendation, legal opinion, environmental opinion, reserve certification, interconnection study, or bankable feasibility study. All assumptions require validation by qualified technical, legal, regulatory, and financial advisors before investment or execution.";

function missing(value: unknown) {
  return value == null || value === "";
}

function text(value: string | null | undefined, fallback = "not provided") {
  return value && value.trim() ? value : fallback;
}

function number(value: number | null | undefined, digits = 1) {
  return value == null ? "not provided" : value.toFixed(digits);
}

function money(value: number | null | undefined) {
  if (value == null) {
    return "not provided";
  }

  const abs = Math.abs(value);
  const prefix = value < 0 ? "-$" : "$";

  if (abs >= 1_000_000) {
    return `${prefix}${(abs / 1_000_000).toFixed(1)} million`;
  }

  if (abs >= 1_000) {
    return `${prefix}${(abs / 1_000).toFixed(1)} thousand`;
  }

  return `${prefix}${abs.toFixed(0)}`;
}

function location(opportunity: MemoBundle) {
  const parts = [
    opportunity.locationCity,
    opportunity.locationState,
    opportunity.locationCountry,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "location not fully defined";
}

function sentenceList(items: string[]) {
  return items.length > 0 ? items.join(" ") : "No specific items were identified.";
}

function dataGaps(bundle: MemoBundle) {
  const gaps: string[] = [];

  if (missing(bundle.resourceData?.availableGasMMscfd)) {
    gaps.push("confirmed available gas volume");
  }

  if (missing(bundle.resourceData?.gasHeatingValueBtuScf)) {
    gaps.push("gas heating value and composition");
  }

  if (missing(bundle.infrastructureData?.distanceToPipelineMiles)) {
    gaps.push("distance and access to pipeline infrastructure");
  }

  if (missing(bundle.infrastructureData?.distanceToPowerLineMiles)) {
    gaps.push("distance and access to power infrastructure");
  }

  if (!bundle.commercialData?.existingPowerOfftaker && !bundle.commercialData?.nearbyIndustrialOfftaker) {
    gaps.push("bankable power offtake or anchor load");
  }

  if (!bundle.commercialData?.landOwnerKnown) {
    gaps.push("land ownership and site control");
  }

  if (missing(bundle.regulatoryData?.permittingComplexity)) {
    gaps.push("permitting pathway and schedule");
  }

  if (bundle.risks.length === 0) {
    gaps.push("risk register");
  }

  if (bundle.financialScreenResults.length === 0) {
    gaps.push("financial screen");
  }

  return gaps;
}

function assumptions(bundle: MemoBundle) {
  const latestGasToPower = bundle.gasToPowerResults[0];
  const latestFinancial = bundle.financialScreenResults[0];
  const items = [
    latestGasToPower
      ? `The latest gas-to-power case assumes ${number(latestGasToPower.availableGasMMscfd)} MMscfd, ${number(latestGasToPower.heatingValueBtuScf, 0)} Btu/scf gas, ${number(latestGasToPower.generatorHeatRateBtuKwh, 0)} Btu/kWh heat rate, ${number(latestGasToPower.assumedAvailabilityPercent)}% availability, and ${number(latestGasToPower.parasiticLoadPercent)}% parasitic load.`
      : "No gas-to-power calculation has been saved; power sizing remains an assumption.",
    latestFinancial
      ? `The latest financial screen assumes a ${number(latestFinancial.projectSizeMw)} MW project, ${number(latestFinancial.annualMwh, 0)} annual MWh, ${money(latestFinancial.capexPerKwBase)} per kW base capex, ${money(latestFinancial.powerPriceUsdMwh)} per MWh power price, and ${money(latestFinancial.gasPriceUsdMmbtu)} per MMBtu gas price.`
      : "No financial screen has been saved; economic conclusions are preliminary.",
  ];

  return items.join("\n\n");
}

function goNoGo(latestScore: ScoringResult | undefined) {
  if (!latestScore) {
    return "No formal go / no-go recommendation is available because the opportunity has not been scored. The prudent recommendation is to hold at screening stage until scoring, gas-to-power sizing, commercial validation, and risk review are complete.";
  }

  if (latestScore.classification === "Priority") {
    return `Go, with disciplined diligence controls. The latest score is ${latestScore.totalScore.toFixed(0)}/100 and classification is Priority, indicating the opportunity can advance to detailed diligence if key risks remain manageable.`;
  }

  if (latestScore.classification === "Develop") {
    return `Conditional go. The latest score is ${latestScore.totalScore.toFixed(0)}/100 and classification is Develop, so the opportunity should advance only through targeted workstreams that close resource, commercial, regulatory, and cost gaps.`;
  }

  if (latestScore.classification === "Watch") {
    return `No-go for full development at this stage. The latest score is ${latestScore.totalScore.toFixed(0)}/100 and classification is Watch, so the opportunity should remain in the pipeline while material gaps are resolved.`;
  }

  return `No-go. The latest score is ${latestScore.totalScore.toFixed(0)}/100 and classification is Reject, so development should not proceed without a material improvement in the underlying facts.`;
}

export function generateProjectMemo(bundle: MemoBundle): GeneratedProjectMemo {
  const latestScore = bundle.scoringResults[0];
  const latestGasToPower = bundle.gasToPowerResults[0];
  const latestFinancial = bundle.financialScreenResults[0];
  const preferredConcept = bundle.projectMemo?.recommendedConcept;
  const topRisks = bundle.risks.slice(0, 5);
  const gaps = dataGaps(bundle);

  const executiveSummary = sentenceList([
    `${bundle.name} is a ${text(bundle.assetType)} opportunity located in ${location(bundle)}.`,
    latestScore
      ? `The latest scoring result is ${latestScore.totalScore.toFixed(0)}/100 with a ${latestScore.classification} classification.`
      : "No scoring result has been saved, so the development priority remains unclassified.",
    latestGasToPower
      ? `The latest gas-to-power screen indicates a recommended capacity of approximately ${number(latestGasToPower.recommendedMw)} MW and ${number(latestGasToPower.annualMwh, 0)} annual MWh.`
      : "No gas-to-power screen has been saved.",
    latestFinancial
      ? `The latest financial screen indicates base capex of ${money(latestFinancial.totalCapexBase)} and EBITDA of ${money(latestFinancial.ebitda)}.`
      : "No financial screen has been saved.",
  ]);

  const assetDescription = `${bundle.name} is currently recorded as ${text(bundle.assetType)} with status ${text(bundle.status)}. The known location is ${location(bundle)}. Owner, operator, and contact information should be treated as incomplete unless separately confirmed. Current owner is ${text(bundle.ownerName)}, operator is ${text(bundle.operatorName)}, and primary contact is ${text(bundle.contactName)}.`;

  const resourceBasis = sentenceList([
    `Available gas is recorded as ${number(bundle.resourceData?.availableGasMMscfd)} MMscfd, with heating value of ${number(bundle.resourceData?.gasHeatingValueBtuScf, 0)} Btu/scf.`,
    `Recorded flare status is ${text(bundle.resourceData?.flareStatus)} and production stability is ${text(bundle.resourceData?.productionStability)}.`,
    `Contaminant data should be verified; current H2S is ${number(bundle.resourceData?.h2sPpm, 0)} ppm and CO2 is ${number(bundle.resourceData?.co2Percent)}%.`,
    "These values should be treated as screening inputs until supported by current operator data, gas analysis, and production history.",
  ]);

  const infrastructureReview = sentenceList([
    `Recorded distances are ${number(bundle.infrastructureData?.distanceToPipelineMiles)} miles to pipeline, ${number(bundle.infrastructureData?.distanceToPowerLineMiles)} miles to power line, ${number(bundle.infrastructureData?.distanceToRoadMiles)} miles to road, and ${number(bundle.infrastructureData?.distanceToIndustrialLoadMiles)} miles to industrial load.`,
    `Land availability is ${bundle.infrastructureData?.landAvailable ? "known as available" : "not confirmed as available"}, and existing facilities are ${bundle.infrastructureData?.existingFacilities ? "reported" : "not reported"}.`,
    `Site access quality is ${text(bundle.infrastructureData?.siteAccessQuality)}.`,
  ]);

  const monetizationOptions = sentenceList([
    preferredConcept
      ? `The preferred monetization concept currently saved in the project memo is ${preferredConcept}.`
      : "No preferred monetization concept has been selected.",
    "Potential pathways should be compared using gas scale, offtake availability, infrastructure proximity, land control, gas quality, execution timing, and financing requirements.",
  ]);

  const recommendedConcept = preferredConcept
    ? `Recommended concept: ${preferredConcept}. This recommendation remains preliminary and should be tested against confirmed resource data, site control, offtake terms, permitting requirements, execution schedule, and updated financial sensitivities.`
    : "No recommended development concept has been selected. The next step is to run the monetization options screen and select a preferred concept for further diligence.";

  const technicalDesign = latestGasToPower
    ? `The preliminary technical configuration is a gas-to-power case of approximately ${number(latestGasToPower.recommendedMw)} MW recommended capacity, with a practical range of ${number(latestGasToPower.practicalMwLow)} MW to ${number(latestGasToPower.practicalMwHigh)} MW. The case assumes ${number(latestGasToPower.availableGasMMscfd)} MMscfd of gas and should be refined after gas deliverability, gas quality, generator selection, parasitic loads, and site constraints are confirmed.`
    : "No preliminary technical configuration has been calculated. A gas-to-power sizing run or alternate concept definition is required before technical scope can be described with confidence.";

  const commercialStructure = sentenceList([
    `Commercial control is currently indicated by gas owner known: ${bundle.commercialData?.gasOwnerKnown ? "yes" : "no"}, land owner known: ${bundle.commercialData?.landOwnerKnown ? "yes" : "no"}, mineral rights known: ${bundle.commercialData?.mineralRightsKnown ? "yes" : "no"}.`,
    `Existing gas contract: ${bundle.commercialData?.existingGasContract ? "yes" : "no"}, existing power offtaker: ${bundle.commercialData?.existingPowerOfftaker ? "yes" : "no"}, nearby industrial offtaker: ${bundle.commercialData?.nearbyIndustrialOfftaker ? "yes" : "no"}.`,
    `Preferred commercial model recorded in diligence data is ${text(bundle.commercialData?.preferredCommercialModel)}.`,
  ]);

  const financialSummary = latestFinancial
    ? `The preliminary financial screen indicates total capex of ${money(latestFinancial.totalCapexLow)} to ${money(latestFinancial.totalCapexHigh)}, with a base case of ${money(latestFinancial.totalCapexBase)}. Annual revenue is ${money(latestFinancial.annualRevenue)}, total annual opex is ${money(latestFinancial.totalAnnualOpex)}, EBITDA is ${money(latestFinancial.ebitda)}, and simple payback is ${latestFinancial.simplePaybackYears == null ? "not meaningful because EBITDA is non-positive" : `${latestFinancial.simplePaybackYears.toFixed(1)} years`}. These outputs are screening-level and should be sensitivity-tested.`
    : "No financial screen has been saved. The project economics remain undefined beyond qualitative screening.";

  const riskSummary =
    topRisks.length > 0
      ? `The highest-ranked risks are: ${topRisks
          .map(
            (risk) =>
              `${risk.category} risk (${risk.severityScore}/9): ${risk.riskDescription}`,
          )
          .join("; ")}.`
      : "No risks have been entered. A risk register should be generated and reviewed before development decisions are made.";

  const developmentRoadmap = [
    "Phase 1: Confirm resource basis, gas quality, ownership, site control, and offtake interest.",
    "Phase 2: Refine technical concept, permitting path, execution schedule, and cost basis.",
    "Phase 3: Secure commercial agreements, vendor pricing, development budget, and investment approval.",
    "Phase 4: Move to detailed engineering and implementation only after major risks are mitigated.",
  ].join("\n");

  const nextActions = [
    "Confirm available gas volume, production stability, and gas composition with source documentation.",
    "Confirm land control, access, permitting pathway, and interconnection or load connection requirements.",
    "Validate preferred monetization concept with counterparties and preliminary vendor input.",
    "Refresh financial sensitivities for power price, capex, gas price, availability, and schedule.",
    "Assign owners and dates to the top risk mitigations.",
  ].join("\n");

  return {
    executiveSummary,
    assetDescription,
    resourceBasis,
    infrastructureReview,
    monetizationOptions,
    recommendedConcept,
    technicalDesign,
    commercialStructure,
    financialSummary,
    riskSummary,
    developmentRoadmap,
    goNoGoRecommendation: goNoGo(latestScore),
    nextActions,
    assumptions: assumptions(bundle),
    dataGaps:
      gaps.length > 0
        ? gaps.join(", ")
        : "No major data gaps were automatically identified.",
  };
}

export function projectMemoToMarkdown(
  opportunityName: string,
  memo: GeneratedProjectMemo,
) {
  return `# ${opportunityName} Project Memo

> ${MEMO_DISCLAIMER}

## 1. Executive Summary
${memo.executiveSummary}

## 2. Asset and Location Overview
${memo.assetDescription}

## 3. Resource Basis
${memo.resourceBasis}

## 4. Infrastructure Review
${memo.infrastructureReview}

## 5. Monetization Options
${memo.monetizationOptions}

## 6. Recommended Development Concept
${memo.recommendedConcept}

## 7. Preliminary Technical Configuration
${memo.technicalDesign}

## 8. Commercial Structure
${memo.commercialStructure}

## 9. Preliminary Financial Screen
${memo.financialSummary}

## 10. Risk Register Summary
${memo.riskSummary}

## 11. Development Roadmap
${memo.developmentRoadmap}

## 12. Go / No-Go Recommendation
${memo.goNoGoRecommendation}

## 13. Immediate Next Actions
${memo.nextActions}

## 14. Assumptions
${memo.assumptions}

## 15. Data Gaps
${memo.dataGaps}
`;
}

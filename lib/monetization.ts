import type {
  CommercialData,
  InfrastructureData,
  Opportunity,
  RegulatoryData,
  ResourceData,
} from "@prisma/client";

type Rating = "High" | "Medium" | "Low";
type Timing = "Short" | "Medium" | "Long";

export type MonetizationOption = {
  name: string;
  feasibility: Rating;
  capexIntensity: Rating;
  timeToExecute: Timing;
  keyRequirements: string[];
  keyRisks: string[];
  recommendation: string;
  score: number;
};

export type MonetizationInput = Opportunity & {
  resourceData: ResourceData | null;
  infrastructureData: InfrastructureData | null;
  commercialData: CommercialData | null;
  regulatoryData: RegulatoryData | null;
};

function clampScore(score: number) {
  return Math.min(100, Math.max(0, Math.round(score)));
}

function ratingFromScore(score: number): Rating {
  if (score >= 70) {
    return "High";
  }

  if (score >= 45) {
    return "Medium";
  }

  return "Low";
}

function textIncludes(value: string | null | undefined, terms: string[]) {
  const normalized = value?.toLowerCase() ?? "";
  return terms.some((term) => normalized.includes(term));
}

function hasHighContaminants(resource: ResourceData | null) {
  return (resource?.h2sPpm ?? 0) > 100 || (resource?.co2Percent ?? 0) > 8;
}

function hasLand(input: MonetizationInput) {
  return input.infrastructureData?.landAvailable !== false;
}

function buildOption({
  name,
  score,
  capexIntensity,
  timeToExecute,
  keyRequirements,
  keyRisks,
  positiveRecommendation,
  weakRecommendation,
}: {
  name: string;
  score: number;
  capexIntensity: Rating;
  timeToExecute: Timing;
  keyRequirements: string[];
  keyRisks: string[];
  positiveRecommendation: string;
  weakRecommendation: string;
}): MonetizationOption {
  const normalizedScore = clampScore(score);
  const feasibility = ratingFromScore(normalizedScore);

  return {
    name,
    feasibility,
    capexIntensity,
    timeToExecute,
    keyRequirements,
    keyRisks,
    recommendation:
      feasibility === "Low" ? weakRecommendation : positiveRecommendation,
    score: normalizedScore,
  };
}

export function compareMonetizationOptions(
  input: MonetizationInput,
): MonetizationOption[] {
  const resource = input.resourceData;
  const infrastructure = input.infrastructureData;
  const commercial = input.commercialData;
  const regulatory = input.regulatoryData;

  const gasVolume = resource?.availableGasMMscfd ?? 0;
  const pipelineDistance = infrastructure?.distanceToPipelineMiles;
  const industrialDistance = infrastructure?.distanceToIndustrialLoadMiles;
  const dataCenterDistance = infrastructure?.distanceToDataCenterMiles;
  const continuousFlaring = textIncludes(resource?.flareStatus, [
    "continuous",
    "active",
  ]);
  const marginalOilfield = textIncludes(input.assetType, [
    "marginal",
    "oilfield",
    "oil field",
  ]);
  const contaminated = hasHighContaminants(resource);
  const landAvailable = hasLand(input);
  const noLandPenalty = landAvailable ? 0 : 18;
  const contaminationPenalty = contaminated ? 15 : 0;
  const clearPathSignals = [
    gasVolume >= 2,
    pipelineDistance != null && pipelineDistance < 5,
    commercial?.nearbyIndustrialOfftaker === true,
    commercial?.existingPowerOfftaker === true,
    marginalOilfield,
  ].filter(Boolean).length;

  const options: MonetizationOption[] = [
    buildOption({
      name: "Gas-to-Power",
      score:
        35 +
        (gasVolume >= 2 ? 25 : 0) +
        (gasVolume >= 5 ? 12 : 0) +
        (continuousFlaring ? 8 : 0) +
        (infrastructure?.existingPowerInfrastructure ? 8 : 0) -
        noLandPenalty -
        contaminationPenalty * 0.6,
      capexIntensity: "Medium",
      timeToExecute: "Medium",
      keyRequirements: [
        "Reliable gas supply",
        "Generation equipment",
        "Site control",
        "Power offtake or onsite load",
      ],
      keyRisks: [
        "Gas deliverability",
        "Equipment lead time",
        "Permitting",
        "Power price exposure",
      ],
      positiveRecommendation:
        "Advance as a core monetization pathway if gas supply and offtake can be confirmed.",
      weakRecommendation:
        "Do not lead with gas-to-power until resource scale, site control, or gas quality improves.",
    }),
    buildOption({
      name: "Pipeline Tie-In",
      score:
        30 +
        (pipelineDistance != null && pipelineDistance < 5 ? 35 : 0) +
        (gasVolume >= 5 ? 12 : 0) +
        (commercial?.gasOwnerKnown ? 8 : 0) -
        contaminationPenalty,
      capexIntensity: pipelineDistance != null && pipelineDistance < 5 ? "Medium" : "High",
      timeToExecute: "Medium",
      keyRequirements: [
        "Nearby pipeline capacity",
        "Gas quality compliance",
        "Right-of-way",
        "Gas sales agreement",
      ],
      keyRisks: [
        "Pipeline capacity",
        "Gas specification",
        "Right-of-way delays",
        "Tariff economics",
      ],
      positiveRecommendation:
        "Evaluate tie-in economics and capacity with the pipeline operator.",
      weakRecommendation:
        "Pipeline tie-in is likely secondary unless distance, capacity, or gas quality improves.",
    }),
    buildOption({
      name: "Gas Processing/NGL Recovery",
      score:
        28 +
        (gasVolume >= 5 ? 20 : 0) +
        (resource?.liquidsContent ? 12 : 0) +
        (infrastructure?.existingGasProcessing ? 15 : 0) -
        contaminationPenalty * 0.7,
      capexIntensity: "High",
      timeToExecute: "Long",
      keyRequirements: [
        "Rich gas stream",
        "Processing equipment",
        "NGL logistics",
        "Sales contracts",
      ],
      keyRisks: [
        "Insufficient liquids yield",
        "Processing complexity",
        "NGL market access",
        "High capex",
      ],
      positiveRecommendation:
        "Screen liquids value and processing logistics before committing engineering work.",
      weakRecommendation:
        "Do not prioritize NGL recovery without confirmed liquids content and sufficient volume.",
    }),
    buildOption({
      name: "CNG",
      score:
        32 +
        (gasVolume >= 1 ? 14 : 0) +
        (industrialDistance != null && industrialDistance <= 25 ? 10 : 0) +
        (infrastructure?.distanceToRoadMiles != null &&
        infrastructure.distanceToRoadMiles <= 5
          ? 10
          : 0) -
        contaminationPenalty * 0.7 -
        noLandPenalty * 0.5,
      capexIntensity: "Medium",
      timeToExecute: "Medium",
      keyRequirements: [
        "Compression package",
        "Truck access",
        "Anchor demand",
        "Safety plan",
      ],
      keyRisks: [
        "Logistics cost",
        "Demand reliability",
        "Compression downtime",
        "Safety compliance",
      ],
      positiveRecommendation:
        "Use CNG as a flexible option where road access and nearby demand are credible.",
      weakRecommendation:
        "CNG is not attractive without reliable road access and demand density.",
    }),
    buildOption({
      name: "Mini-LNG",
      score:
        22 +
        (gasVolume >= 5 ? 18 : 0) +
        (gasVolume >= 10 ? 12 : 0) +
        (industrialDistance != null && industrialDistance <= 50 ? 8 : 0) -
        contaminationPenalty -
        noLandPenalty,
      capexIntensity: "High",
      timeToExecute: "Long",
      keyRequirements: [
        "Large reliable gas supply",
        "Liquefaction package",
        "Cryogenic logistics",
        "Creditworthy demand",
      ],
      keyRisks: [
        "High capex",
        "Complex operations",
        "Permitting",
        "Demand aggregation",
      ],
      positiveRecommendation:
        "Consider only if gas scale, demand, and logistics justify higher complexity.",
      weakRecommendation:
        "Mini-LNG should remain a later-stage alternative unless scale and demand are strong.",
    }),
    buildOption({
      name: "Reinjection",
      score:
        38 +
        (marginalOilfield ? 15 : 0) +
        (resource?.gasPressurePsig ? 6 : 0) +
        (commercial?.mineralRightsKnown ? 8 : 0) -
        (regulatory?.environmentalIssuesKnown ? 8 : 0),
      capexIntensity: "Medium",
      timeToExecute: "Medium",
      keyRequirements: [
        "Reservoir suitability",
        "Compression",
        "Injection approvals",
        "Field development plan",
      ],
      keyRisks: [
        "Reservoir response",
        "Compression cost",
        "Regulatory approval",
        "Limited near-term cash flow",
      ],
      positiveRecommendation:
        "Evaluate reinjection where reservoir support or flare reduction has strategic value.",
      weakRecommendation:
        "Reinjection is not a primary monetization route without reservoir or regulatory drivers.",
    }),
    buildOption({
      name: "Onsite Industrial Power",
      score:
        34 +
        (gasVolume >= 2 ? 18 : 0) +
        (commercial?.nearbyIndustrialOfftaker ? 22 : 0) +
        (industrialDistance != null && industrialDistance <= 10 ? 8 : 0) -
        noLandPenalty -
        contaminationPenalty * 0.5,
      capexIntensity: "Medium",
      timeToExecute: "Medium",
      keyRequirements: [
        "Industrial offtaker",
        "Site control",
        "Generation package",
        "Power sales structure",
      ],
      keyRisks: [
        "Offtaker credit",
        "Load reliability",
        "Site access",
        "Power contract terms",
      ],
      positiveRecommendation:
        "Prioritize if a nearby industrial offtaker can support a bankable contract.",
      weakRecommendation:
        "Do not prioritize without a credible industrial load or site-control path.",
    }),
    buildOption({
      name: "Data Center Power",
      score:
        24 +
        (gasVolume >= 5 ? 25 : 0) +
        (dataCenterDistance != null && dataCenterDistance <= 25 ? 10 : 0) +
        (infrastructure?.distanceToFiberMiles != null &&
        infrastructure.distanceToFiberMiles <= 5
          ? 10
          : 0) -
        noLandPenalty -
        contaminationPenalty * 0.5,
      capexIntensity: "High",
      timeToExecute: "Long",
      keyRequirements: [
        "Large reliable gas supply",
        "Fiber proximity",
        "Land and cooling strategy",
        "Data center customer",
      ],
      keyRisks: [
        "Customer acquisition",
        "Reliability standards",
        "Fiber and cooling constraints",
        "High capex",
      ],
      positiveRecommendation:
        "Advance only with clear customer demand and infrastructure fit.",
      weakRecommendation:
        "Treat data center power as speculative until load, fiber, land, and scale are confirmed.",
    }),
    buildOption({
      name: "EPF/Marginal Field Redevelopment",
      score:
        28 +
        (marginalOilfield ? 28 : 0) +
        ((resource?.oilProductionBopd ?? 0) > 0 ? 12 : 0) +
        (infrastructure?.existingFacilities ? 10 : 0) -
        (regulatory?.communityIssuesKnown ? 8 : 0) -
        (regulatory?.securityIssuesKnown ? 8 : 0),
      capexIntensity: "High",
      timeToExecute: "Long",
      keyRequirements: [
        "Field development plan",
        "Surface facilities",
        "Commercial rights",
        "Regulatory approvals",
      ],
      keyRisks: [
        "Reservoir uncertainty",
        "Facilities scope growth",
        "Community issues",
        "Security constraints",
      ],
      positiveRecommendation:
        "Evaluate as an integrated redevelopment case if the asset is a marginal oilfield.",
      weakRecommendation:
        "Do not lead with redevelopment unless oilfield upside and rights are clear.",
    }),
  ];

  const bestActiveScore = Math.max(...options.map((option) => option.score));
  const deferScore = clampScore(
    25 +
      (clearPathSignals === 0 ? 35 : 0) +
      (bestActiveScore < 50 ? 25 : 0) +
      (contaminated ? 8 : 0) +
      (!landAvailable ? 8 : 0),
  );

  options.push(
    buildOption({
      name: "Do Nothing/Defer",
      score: deferScore,
      capexIntensity: "Low",
      timeToExecute: "Short",
      keyRequirements: [
        "Defined data gaps",
        "Monitoring plan",
        "Trigger criteria for reactivation",
      ],
      keyRisks: [
        "Lost opportunity",
        "Continued flaring or shut-in value loss",
        "Counterparty momentum loss",
      ],
      positiveRecommendation:
        "Defer active development until the highest-impact gaps are resolved.",
      weakRecommendation:
        "Do not defer if an active pathway has stronger economics and execution clarity.",
    }),
  );

  return options.sort((a, b) => b.score - a.score);
}


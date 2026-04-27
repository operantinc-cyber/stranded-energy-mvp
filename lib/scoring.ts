import type {
  CommercialData,
  InfrastructureData,
  Opportunity,
  RegulatoryData,
  ResourceData,
} from "@prisma/client";

export type CategoryScores = {
  resourceQualityScore: number;
  infrastructureScore: number;
  marketDemandScore: number;
  technicalFeasibilityScore: number;
  commercialControlScore: number;
  regulatoryFeasibilityScore: number;
  economicPotentialScore: number;
  speedToExecuteScore: number;
  strategicRepeatabilityScore: number;
  counterpartySeriousnessScore: number;
};

export type ScoringInput = Opportunity & {
  resourceData: ResourceData | null;
  infrastructureData: InfrastructureData | null;
  commercialData: CommercialData | null;
  regulatoryData: RegulatoryData | null;
};

export function clamp(value: number, min = 1, max = 10) {
  return Math.min(max, Math.max(min, value));
}

function roundScore(value: number) {
  return Math.round(clamp(value) * 10) / 10;
}

function distanceScore(distance: number | null | undefined) {
  if (distance == null) {
    return 5;
  }

  if (distance <= 1) {
    return 10;
  }

  if (distance <= 3) {
    return 8;
  }

  if (distance <= 10) {
    return 6;
  }

  if (distance <= 25) {
    return 4;
  }

  return 2;
}

function textIncludes(value: string | null | undefined, terms: string[]) {
  const normalized = value?.toLowerCase() ?? "";
  return terms.some((term) => normalized.includes(term));
}

export function scoreResourceQuality(resource: ResourceData | null) {
  if (!resource) {
    return 3;
  }

  let score = 4;

  const gas = resource.availableGasMMscfd;
  if (gas != null) {
    if (gas >= 10) {
      score += 3;
    } else if (gas >= 5) {
      score += 2.5;
    } else if (gas >= 2) {
      score += 1.5;
    } else if (gas >= 1) {
      score += 0.75;
    }
  }

  const heatingValue = resource.gasHeatingValueBtuScf;
  if (heatingValue != null) {
    if (heatingValue >= 1050) {
      score += 1;
    } else if (heatingValue < 900) {
      score -= 1;
    }
  }

  if (textIncludes(resource.productionStability, ["stable", "steady", "continuous"])) {
    score += 1;
  } else if (textIncludes(resource.productionStability, ["variable", "intermittent"])) {
    score -= 0.5;
  }

  if (textIncludes(resource.flareStatus, ["continuous", "active"])) {
    score += 0.75;
  }

  if (textIncludes(resource.shutInStatus, ["shut", "inactive"])) {
    score -= 1;
  }

  if ((resource.co2Percent ?? 0) > 8) {
    score -= 0.75;
  }

  if ((resource.h2sPpm ?? 0) > 100) {
    score -= 1;
  }

  return roundScore(score);
}

export function scoreInfrastructure(infrastructure: InfrastructureData | null) {
  if (!infrastructure) {
    return 3;
  }

  const proximity =
    (distanceScore(infrastructure.distanceToRoadMiles) +
      distanceScore(infrastructure.distanceToPowerLineMiles) +
      distanceScore(infrastructure.distanceToIndustrialLoadMiles) +
      distanceScore(infrastructure.distanceToPipelineMiles)) /
    4;

  let score = proximity;

  if (infrastructure.landAvailable) {
    score += 0.75;
  }

  if (infrastructure.waterAvailable) {
    score += 0.5;
  }

  if (infrastructure.existingFacilities) {
    score += 0.75;
  }

  if (infrastructure.existingPowerInfrastructure) {
    score += 0.75;
  }

  if (infrastructure.existingGasProcessing || infrastructure.existingCompression) {
    score += 0.5;
  }

  if (textIncludes(infrastructure.siteAccessQuality, ["poor", "limited"])) {
    score -= 1;
  } else if (textIncludes(infrastructure.siteAccessQuality, ["good", "excellent"])) {
    score += 0.5;
  }

  return roundScore(score);
}

export function scoreCommercialControl(commercial: CommercialData | null) {
  if (!commercial) {
    return 3;
  }

  let score = 3;

  if (commercial.gasOwnerKnown) {
    score += 1.5;
  }

  if (commercial.landOwnerKnown) {
    score += 1.25;
  }

  if (commercial.mineralRightsKnown) {
    score += 1;
  }

  if (commercial.existingGasContract) {
    score += 0.75;
  }

  if (commercial.existingPowerOfftaker || commercial.nearbyIndustrialOfftaker) {
    score += 1.25;
  }

  if (commercial.interestedCounterparty) {
    score += 1.25;
  }

  if (commercial.preferredCommercialModel) {
    score += 0.5;
  }

  return roundScore(score);
}

export function scoreRegulatory(regulatory: RegulatoryData | null) {
  if (!regulatory) {
    return 3;
  }

  let score = regulatory.existingPermits ? 8 : 6;

  if (regulatory.airPermitRequired) {
    score -= 0.75;
  }

  if (regulatory.waterPermitRequired) {
    score -= 0.5;
  }

  if (regulatory.landUseApprovalRequired) {
    score -= 0.5;
  }

  if (regulatory.interconnectionRequired) {
    score -= 0.5;
  }

  if (regulatory.environmentalIssuesKnown) {
    score -= 1.25;
  }

  if (regulatory.communityIssuesKnown) {
    score -= 1;
  }

  if (regulatory.securityIssuesKnown) {
    score -= 0.75;
  }

  if (textIncludes(regulatory.permittingComplexity, ["low", "simple"])) {
    score += 1;
  } else if (textIncludes(regulatory.permittingComplexity, ["high", "complex"])) {
    score -= 1.5;
  }

  const months = regulatory.expectedPermittingMonths;
  if (months != null) {
    if (months <= 6) {
      score += 1;
    } else if (months > 12) {
      score -= 1;
    }
  }

  return roundScore(score);
}

export function calculateTotalScore(scores: CategoryScores) {
  const values = Object.values(scores).map((score) => clamp(score));
  const average = values.reduce((sum, score) => sum + score, 0) / values.length;
  return Math.round(average * 10);
}

export function classifyOpportunity(totalScore: number) {
  if (totalScore >= 80) {
    return "Priority";
  }

  if (totalScore >= 60) {
    return "Develop";
  }

  if (totalScore >= 40) {
    return "Watch";
  }

  return "Reject";
}

export function generateRecommendation(totalScore: number, classification: string) {
  if (classification === "Priority") {
    return `Priority opportunity (${totalScore}/100): move to detailed diligence and concept development.`;
  }

  if (classification === "Develop") {
    return `Develop opportunity (${totalScore}/100): resolve key data gaps and commercial path before committing major resources.`;
  }

  if (classification === "Watch") {
    return `Watch opportunity (${totalScore}/100): keep in the pipeline, but improve weak inputs before advancing.`;
  }

  return `Reject opportunity (${totalScore}/100): do not advance without a material change in resource, infrastructure, commercial, or regulatory conditions.`;
}

export function suggestScores(opportunity: ScoringInput): CategoryScores {
  const resourceQualityScore = scoreResourceQuality(opportunity.resourceData);
  const infrastructureScore = scoreInfrastructure(opportunity.infrastructureData);
  const commercialControlScore = scoreCommercialControl(opportunity.commercialData);
  const regulatoryFeasibilityScore = scoreRegulatory(opportunity.regulatoryData);

  const marketDemandScore = roundScore(
    4 +
      (opportunity.commercialData?.nearbyIndustrialOfftaker ? 2 : 0) +
      (opportunity.commercialData?.existingPowerOfftaker ? 1.5 : 0) +
      (opportunity.commercialData?.targetPowerPriceUsdMwh != null ? 0.75 : 0) +
      (distanceScore(opportunity.infrastructureData?.distanceToIndustrialLoadMiles) - 5) * 0.35 +
      (distanceScore(opportunity.infrastructureData?.distanceToDataCenterMiles) - 5) * 0.25,
  );

  const technicalFeasibilityScore = roundScore(
    resourceQualityScore * 0.45 +
      infrastructureScore * 0.45 +
      (opportunity.infrastructureData?.existingGasProcessing ? 0.5 : 0) +
      (opportunity.infrastructureData?.existingCompression ? 0.5 : 0),
  );

  const economicPotentialScore = roundScore(
    resourceQualityScore * 0.4 +
      marketDemandScore * 0.3 +
      commercialControlScore * 0.2 +
      ((opportunity.commercialData?.expectedCapacityFactorPercent ?? 0) >= 80 ? 1 : 0),
  );

  const speedToExecuteScore = roundScore(
    infrastructureScore * 0.35 +
      regulatoryFeasibilityScore * 0.35 +
      commercialControlScore * 0.2 +
      (opportunity.infrastructureData?.landOwnershipKnown ? 0.5 : 0),
  );

  const strategicRepeatabilityScore = roundScore(
    5 +
      (opportunity.assetType ? 1 : 0) +
      (opportunity.resourceData ? 1 : 0) +
      (opportunity.infrastructureData ? 1 : 0) +
      (opportunity.locationCountry ? 0.5 : 0),
  );

  const counterpartySeriousnessScore = roundScore(
    3 +
      (opportunity.commercialData?.interestedCounterparty ? 2.5 : 0) +
      (opportunity.contactName ? 1 : 0) +
      (opportunity.contactEmail ? 1 : 0) +
      (opportunity.commercialData?.preferredCommercialModel ? 1 : 0) +
      (opportunity.commercialData?.existingPowerOfftaker ? 1 : 0),
  );

  return {
    resourceQualityScore,
    infrastructureScore,
    marketDemandScore,
    technicalFeasibilityScore,
    commercialControlScore,
    regulatoryFeasibilityScore,
    economicPotentialScore,
    speedToExecuteScore,
    strategicRepeatabilityScore,
    counterpartySeriousnessScore,
  };
}

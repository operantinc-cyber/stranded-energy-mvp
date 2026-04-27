"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  calculateTotalScore,
  classifyOpportunity,
  clamp,
  generateRecommendation,
  type CategoryScores,
} from "@/lib/scoring";
import { calculateGasToPower } from "@/lib/gasToPower";
import { calculateFinancialScreen } from "@/lib/financial";
import {
  calculateSeverity,
  generateDefaultRisks,
  impactLevels,
  probabilityLevels,
  riskCategories,
  riskStatuses,
} from "@/lib/risks";

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function requiredText(formData: FormData, name: string) {
  const value = text(formData, name);
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function numberValue(formData: FormData, name: string) {
  const value = text(formData, name);
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${name} must be a number`);
  }

  return parsed;
}

function checkbox(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function optionValue<const T extends readonly string[]>(
  formData: FormData,
  name: string,
  allowed: T,
) {
  const value = text(formData, name);
  if (!value || !allowed.includes(value)) {
    throw new Error(`${name} is invalid`);
  }

  return value;
}

function opportunityData(formData: FormData) {
  return {
    name: requiredText(formData, "name"),
    assetType: requiredText(formData, "assetType"),
    status: text(formData, "status") ?? "New",
    locationCountry: text(formData, "locationCountry"),
    locationState: text(formData, "locationState"),
    locationCity: text(formData, "locationCity"),
    latitude: numberValue(formData, "latitude"),
    longitude: numberValue(formData, "longitude"),
    ownerName: text(formData, "ownerName"),
    operatorName: text(formData, "operatorName"),
    contactName: text(formData, "contactName"),
    contactEmail: text(formData, "contactEmail"),
    description: text(formData, "description"),
  };
}

function resourceData(formData: FormData) {
  return {
    availableGasMMscfd: numberValue(formData, "availableGasMMscfd"),
    gasHeatingValueBtuScf: numberValue(formData, "gasHeatingValueBtuScf"),
    gasPressurePsig: numberValue(formData, "gasPressurePsig"),
    gasTemperatureF: numberValue(formData, "gasTemperatureF"),
    methanePercent: numberValue(formData, "methanePercent"),
    ethanePercent: numberValue(formData, "ethanePercent"),
    propanePercent: numberValue(formData, "propanePercent"),
    co2Percent: numberValue(formData, "co2Percent"),
    h2sPpm: numberValue(formData, "h2sPpm"),
    nitrogenPercent: numberValue(formData, "nitrogenPercent"),
    liquidsContent: text(formData, "liquidsContent"),
    currentGasUse: text(formData, "currentGasUse"),
    currentGasPriceUsdMmbtu: numberValue(formData, "currentGasPriceUsdMmbtu"),
    flareStatus: text(formData, "flareStatus"),
    shutInStatus: text(formData, "shutInStatus"),
    productionStability: text(formData, "productionStability"),
    oilProductionBopd: numberValue(formData, "oilProductionBopd"),
    waterProductionBwpd: numberValue(formData, "waterProductionBwpd"),
    waterCutPercent: numberValue(formData, "waterCutPercent"),
    notes: text(formData, "resourceNotes"),
  };
}

function infrastructureData(formData: FormData) {
  return {
    distanceToPipelineMiles: numberValue(formData, "distanceToPipelineMiles"),
    distanceToPowerLineMiles: numberValue(formData, "distanceToPowerLineMiles"),
    distanceToSubstationMiles: numberValue(formData, "distanceToSubstationMiles"),
    distanceToRoadMiles: numberValue(formData, "distanceToRoadMiles"),
    distanceToFiberMiles: numberValue(formData, "distanceToFiberMiles"),
    distanceToIndustrialLoadMiles: numberValue(formData, "distanceToIndustrialLoadMiles"),
    distanceToDataCenterMiles: numberValue(formData, "distanceToDataCenterMiles"),
    landAvailable: checkbox(formData, "landAvailable"),
    landOwnershipKnown: checkbox(formData, "landOwnershipKnown"),
    waterAvailable: checkbox(formData, "waterAvailable"),
    existingFacilities: checkbox(formData, "existingFacilities"),
    existingPowerInfrastructure: checkbox(formData, "existingPowerInfrastructure"),
    existingGasProcessing: checkbox(formData, "existingGasProcessing"),
    existingCompression: checkbox(formData, "existingCompression"),
    siteAccessQuality: text(formData, "siteAccessQuality"),
    notes: text(formData, "infrastructureNotes"),
  };
}

function commercialData(formData: FormData) {
  return {
    gasOwnerKnown: checkbox(formData, "gasOwnerKnown"),
    landOwnerKnown: checkbox(formData, "landOwnerKnown"),
    mineralRightsKnown: checkbox(formData, "mineralRightsKnown"),
    existingGasContract: checkbox(formData, "existingGasContract"),
    existingPowerOfftaker: checkbox(formData, "existingPowerOfftaker"),
    nearbyIndustrialOfftaker: checkbox(formData, "nearbyIndustrialOfftaker"),
    interestedCounterparty: checkbox(formData, "interestedCounterparty"),
    preferredCommercialModel: text(formData, "preferredCommercialModel"),
    targetPowerPriceUsdMwh: numberValue(formData, "targetPowerPriceUsdMwh"),
    targetGasPriceUsdMmbtu: numberValue(formData, "targetGasPriceUsdMmbtu"),
    expectedCapacityFactorPercent: numberValue(
      formData,
      "expectedCapacityFactorPercent",
    ),
    notes: text(formData, "commercialNotes"),
  };
}

function regulatoryData(formData: FormData) {
  return {
    existingPermits: checkbox(formData, "existingPermits"),
    airPermitRequired: checkbox(formData, "airPermitRequired"),
    waterPermitRequired: checkbox(formData, "waterPermitRequired"),
    landUseApprovalRequired: checkbox(formData, "landUseApprovalRequired"),
    interconnectionRequired: checkbox(formData, "interconnectionRequired"),
    environmentalIssuesKnown: checkbox(formData, "environmentalIssuesKnown"),
    communityIssuesKnown: checkbox(formData, "communityIssuesKnown"),
    securityIssuesKnown: checkbox(formData, "securityIssuesKnown"),
    permittingComplexity: text(formData, "permittingComplexity"),
    expectedPermittingMonths: numberValue(formData, "expectedPermittingMonths"),
    notes: text(formData, "regulatoryNotes"),
  };
}

export async function createOpportunity(formData: FormData) {
  const opportunity = await prisma.opportunity.create({
    data: {
      ...opportunityData(formData),
      resourceData: {
        create: resourceData(formData),
      },
      infrastructureData: {
        create: infrastructureData(formData),
      },
      commercialData: {
        create: commercialData(formData),
      },
      regulatoryData: {
        create: regulatoryData(formData),
      },
    },
  });

  revalidatePath("/");
  redirect(`/opportunities/${opportunity.id}`);
}

export async function updateOpportunity(id: string, formData: FormData) {
  await prisma.opportunity.update({
    where: { id },
    data: {
      ...opportunityData(formData),
      resourceData: {
        upsert: {
          create: resourceData(formData),
          update: resourceData(formData),
        },
      },
      infrastructureData: {
        upsert: {
          create: infrastructureData(formData),
          update: infrastructureData(formData),
        },
      },
      commercialData: {
        upsert: {
          create: commercialData(formData),
          update: commercialData(formData),
        },
      },
      regulatoryData: {
        upsert: {
          create: regulatoryData(formData),
          update: regulatoryData(formData),
        },
      },
    },
  });

  revalidatePath("/");
  revalidatePath(`/opportunities/${id}`);
  redirect(`/opportunities/${id}`);
}

export async function deleteOpportunity(id: string) {
  await prisma.opportunity.delete({
    where: { id },
  });

  revalidatePath("/");
  redirect("/");
}

function scoreValue(formData: FormData, name: string) {
  const value = numberValue(formData, name);
  if (value == null) {
    throw new Error(`${name} is required`);
  }

  return clamp(value);
}

export async function saveOpportunityScore(id: string, formData: FormData) {
  const scores: CategoryScores = {
    resourceQualityScore: scoreValue(formData, "resourceQualityScore"),
    infrastructureScore: scoreValue(formData, "infrastructureScore"),
    marketDemandScore: scoreValue(formData, "marketDemandScore"),
    technicalFeasibilityScore: scoreValue(formData, "technicalFeasibilityScore"),
    commercialControlScore: scoreValue(formData, "commercialControlScore"),
    regulatoryFeasibilityScore: scoreValue(formData, "regulatoryFeasibilityScore"),
    economicPotentialScore: scoreValue(formData, "economicPotentialScore"),
    speedToExecuteScore: scoreValue(formData, "speedToExecuteScore"),
    strategicRepeatabilityScore: scoreValue(formData, "strategicRepeatabilityScore"),
    counterpartySeriousnessScore: scoreValue(formData, "counterpartySeriousnessScore"),
  };
  const totalScore = calculateTotalScore(scores);
  const classification = classifyOpportunity(totalScore);

  await prisma.scoringResult.create({
    data: {
      opportunityId: id,
      ...scores,
      totalScore,
      classification,
      recommendation: generateRecommendation(totalScore, classification),
    },
  });

  revalidatePath("/");
  revalidatePath(`/opportunities/${id}`);
  revalidatePath(`/opportunities/${id}/score`);
  redirect(`/opportunities/${id}/score`);
}

function requiredNumber(formData: FormData, name: string) {
  const value = numberValue(formData, name);
  if (value == null) {
    throw new Error(`${name} is required`);
  }

  return value;
}

export async function saveGasToPowerResult(id: string, formData: FormData) {
  const result = calculateGasToPower({
    availableGasMMscfd: requiredNumber(formData, "availableGasMMscfd"),
    heatingValueBtuScf: requiredNumber(formData, "heatingValueBtuScf"),
    generatorHeatRateBtuKwh: requiredNumber(
      formData,
      "generatorHeatRateBtuKwh",
    ),
    availabilityPercent: requiredNumber(formData, "availabilityPercent"),
    parasiticLoadPercent: requiredNumber(formData, "parasiticLoadPercent"),
  });

  await prisma.gasToPowerResult.create({
    data: {
      opportunityId: id,
      availableGasMMscfd: result.availableGasMMscfd,
      heatingValueBtuScf: result.heatingValueBtuScf,
      generatorHeatRateBtuKwh: result.generatorHeatRateBtuKwh,
      assumedAvailabilityPercent: result.availabilityPercent,
      parasiticLoadPercent: result.parasiticLoadPercent,
      theoreticalMw: result.theoreticalMw,
      practicalMwLow: result.practicalMwLow,
      practicalMwHigh: result.practicalMwHigh,
      recommendedMw: result.recommendedMw,
      annualMwh: result.annualMwh,
      fuelEnergyMmbtuDay: result.fuelEnergyMmbtuDay,
      fuelEnergyMmbtuYear: result.fuelEnergyMmbtuYear,
      notes: text(formData, "notes"),
    },
  });

  revalidatePath("/");
  revalidatePath(`/opportunities/${id}`);
  revalidatePath(`/opportunities/${id}/gas-to-power`);
  redirect(`/opportunities/${id}/gas-to-power`);
}

export async function saveFinancialScreenResult(id: string, formData: FormData) {
  const result = calculateFinancialScreen({
    projectSizeMw: requiredNumber(formData, "projectSizeMw"),
    annualMwh: requiredNumber(formData, "annualMwh"),
    powerPriceUsdMwh: requiredNumber(formData, "powerPriceUsdMwh"),
    gasPriceUsdMmbtu: requiredNumber(formData, "gasPriceUsdMmbtu"),
    annualFuelMmbtu: requiredNumber(formData, "annualFuelMmbtu"),
    capexPerKwLow: requiredNumber(formData, "capexPerKwLow"),
    capexPerKwBase: requiredNumber(formData, "capexPerKwBase"),
    capexPerKwHigh: requiredNumber(formData, "capexPerKwHigh"),
    fixedOpexUsdKwYear: requiredNumber(formData, "fixedOpexUsdKwYear"),
    variableOpexUsdMwh: requiredNumber(formData, "variableOpexUsdMwh"),
  });

  await prisma.financialScreenResult.create({
    data: {
      opportunityId: id,
      projectSizeMw: result.projectSizeMw,
      capexPerKwLow: result.capexPerKwLow,
      capexPerKwBase: result.capexPerKwBase,
      capexPerKwHigh: result.capexPerKwHigh,
      totalCapexLow: result.totalCapexLow,
      totalCapexBase: result.totalCapexBase,
      totalCapexHigh: result.totalCapexHigh,
      powerPriceUsdMwh: result.powerPriceUsdMwh,
      annualMwh: result.annualMwh,
      annualRevenue: result.annualRevenue,
      gasPriceUsdMmbtu: result.gasPriceUsdMmbtu,
      annualFuelCost: result.annualFuelCost,
      fixedOpexUsdKwYear: result.fixedOpexUsdKwYear,
      variableOpexUsdMwh: result.variableOpexUsdMwh,
      annualFixedOpex: result.annualFixedOpex,
      annualVariableOpex: result.annualVariableOpex,
      totalAnnualOpex: result.totalAnnualOpex,
      ebitda: result.ebitda,
      simplePaybackYears: result.simplePaybackYears,
    },
  });

  revalidatePath("/");
  revalidatePath(`/opportunities/${id}`);
  revalidatePath(`/opportunities/${id}/financial`);
  redirect(`/opportunities/${id}/financial`);
}

function riskData(formData: FormData) {
  const probability = optionValue(formData, "probability", probabilityLevels);
  const impact = optionValue(formData, "impact", impactLevels);

  return {
    category: optionValue(formData, "category", riskCategories),
    riskDescription: requiredText(formData, "riskDescription"),
    probability,
    impact,
    severityScore: calculateSeverity(probability, impact),
    mitigation: requiredText(formData, "mitigation"),
    owner: text(formData, "owner"),
    nextAction: text(formData, "nextAction"),
    status: optionValue(formData, "status", riskStatuses),
  };
}

export async function createRisk(id: string, formData: FormData) {
  await prisma.riskItem.create({
    data: {
      opportunityId: id,
      ...riskData(formData),
    },
  });

  revalidatePath(`/opportunities/${id}/risks`);
  redirect(`/opportunities/${id}/risks`);
}

export async function updateRisk(id: string, riskId: string, formData: FormData) {
  await prisma.riskItem.update({
    where: { id: riskId },
    data: riskData(formData),
  });

  revalidatePath(`/opportunities/${id}/risks`);
  redirect(`/opportunities/${id}/risks`);
}

export async function deleteRisk(id: string, riskId: string) {
  await prisma.riskItem.delete({
    where: { id: riskId },
  });

  revalidatePath(`/opportunities/${id}/risks`);
  redirect(`/opportunities/${id}/risks`);
}

export async function generateRisks(id: string) {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      resourceData: true,
      infrastructureData: true,
      commercialData: true,
      regulatoryData: true,
    },
  });

  if (!opportunity) {
    throw new Error("Opportunity not found");
  }

  const risks = generateDefaultRisks(opportunity);

  await prisma.riskItem.createMany({
    data: risks.map((risk) => ({
      opportunityId: id,
      ...risk,
    })),
  });

  revalidatePath(`/opportunities/${id}/risks`);
  redirect(`/opportunities/${id}/risks`);
}

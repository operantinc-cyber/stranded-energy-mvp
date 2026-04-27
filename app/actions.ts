"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

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

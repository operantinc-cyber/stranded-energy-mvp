import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.opportunity.deleteMany();

  await prisma.opportunity.create({
    data: {
      name: "West Texas Stranded Gas Power Screen",
      locationCountry: "USA",
      locationState: "Texas",
      locationCity: "West Texas",
      assetType: "Stranded Gas",
      status: "New",
      description: "Screening case for stranded gas-to-power development in West Texas.",
      resourceData: {
        create: {
          availableGasMMscfd: 5,
          gasHeatingValueBtuScf: 1050,
          currentGasPriceUsdMmbtu: 2.5,
          flareStatus: "Unknown",
          productionStability: "Stable",
          notes: "Illustrative seed case for stranded gas monetization."
        }
      },
      infrastructureData: {
        create: {
          distanceToRoadMiles: 1,
          distanceToPowerLineMiles: 4,
          distanceToIndustrialLoadMiles: 15,
          landAvailable: true,
          landOwnershipKnown: false,
          waterAvailable: false,
          existingFacilities: false,
          existingPowerInfrastructure: false,
          existingGasProcessing: false,
          existingCompression: false,
          siteAccessQuality: "Good"
        }
      },
      commercialData: {
        create: {
          gasOwnerKnown: true,
          landOwnerKnown: false,
          mineralRightsKnown: false,
          existingGasContract: false,
          existingPowerOfftaker: false,
          nearbyIndustrialOfftaker: true,
          interestedCounterparty: false,
          preferredCommercialModel: "Power Purchase Agreement",
          targetPowerPriceUsdMwh: 70,
          targetGasPriceUsdMmbtu: 2.5,
          expectedCapacityFactorPercent: 85
        }
      },
      regulatoryData: {
        create: {
          existingPermits: false,
          airPermitRequired: true,
          waterPermitRequired: false,
          landUseApprovalRequired: true,
          interconnectionRequired: true,
          environmentalIssuesKnown: false,
          communityIssuesKnown: false,
          securityIssuesKnown: false,
          permittingComplexity: "Medium",
          expectedPermittingMonths: 9
        }
      }
    }
  });

  await prisma.opportunity.create({
    data: {
      name: "Niger Delta Marginal Field Modular Infrastructure Screen",
      locationCountry: "Nigeria",
      locationState: "Niger Delta",
      locationCity: "Niger Delta",
      assetType: "Marginal Oilfield",
      status: "New",
      description: "Screening case for modular EPF and gas-to-power development in a marginal field setting.",
      resourceData: {
        create: {
          availableGasMMscfd: 3,
          gasHeatingValueBtuScf: 1050,
          flareStatus: "Intermittent flaring",
          productionStability: "Moderately variable",
          oilProductionBopd: 3000,
          waterProductionBwpd: 2000,
          notes: "Illustrative marginal field case with oil, gas, and produced water."
        }
      },
      infrastructureData: {
        create: {
          distanceToRoadMiles: 3,
          landAvailable: false,
          landOwnershipKnown: false,
          waterAvailable: true,
          existingFacilities: true,
          existingPowerInfrastructure: false,
          existingGasProcessing: false,
          existingCompression: false,
          siteAccessQuality: "Moderate"
        }
      },
      commercialData: {
        create: {
          gasOwnerKnown: true,
          landOwnerKnown: false,
          mineralRightsKnown: true,
          existingGasContract: false,
          existingPowerOfftaker: false,
          nearbyIndustrialOfftaker: false,
          interestedCounterparty: true,
          preferredCommercialModel: "Joint Venture",
          expectedCapacityFactorPercent: 80
        }
      },
      regulatoryData: {
        create: {
          existingPermits: false,
          airPermitRequired: true,
          waterPermitRequired: true,
          landUseApprovalRequired: true,
          interconnectionRequired: false,
          environmentalIssuesKnown: true,
          communityIssuesKnown: true,
          securityIssuesKnown: true,
          permittingComplexity: "High",
          expectedPermittingMonths: 12
        }
      }
    }
  });

  await prisma.opportunity.create({
    data: {
      name: "Louisiana Flare Gas Modular Power Opportunity",
      locationCountry: "USA",
      locationState: "Louisiana",
      locationCity: "Industrial Corridor",
      assetType: "Flare Gas",
      status: "New",
      description: "Screening case for continuous flare gas monetization through modular power.",
      resourceData: {
        create: {
          availableGasMMscfd: 2,
          gasHeatingValueBtuScf: 1050,
          flareStatus: "Continuous flaring",
          productionStability: "Stable",
          notes: "Illustrative flare gas monetization opportunity."
        }
      },
      infrastructureData: {
        create: {
          distanceToPowerLineMiles: 2,
          distanceToIndustrialLoadMiles: 8,
          landAvailable: true,
          landOwnershipKnown: true,
          waterAvailable: true,
          existingFacilities: true,
          existingPowerInfrastructure: true,
          existingGasProcessing: false,
          existingCompression: false,
          siteAccessQuality: "Good"
        }
      },
      commercialData: {
        create: {
          gasOwnerKnown: true,
          landOwnerKnown: true,
          mineralRightsKnown: true,
          existingGasContract: false,
          existingPowerOfftaker: false,
          nearbyIndustrialOfftaker: true,
          interestedCounterparty: true,
          preferredCommercialModel: "Revenue Share",
          targetPowerPriceUsdMwh: 65,
          expectedCapacityFactorPercent: 85
        }
      },
      regulatoryData: {
        create: {
          existingPermits: false,
          airPermitRequired: true,
          waterPermitRequired: false,
          landUseApprovalRequired: true,
          interconnectionRequired: true,
          environmentalIssuesKnown: false,
          communityIssuesKnown: false,
          securityIssuesKnown: false,
          permittingComplexity: "Medium",
          expectedPermittingMonths: 8
        }
      }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

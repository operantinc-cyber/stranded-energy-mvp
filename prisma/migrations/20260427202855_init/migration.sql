-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "locationCountry" TEXT,
    "locationState" TEXT,
    "locationCity" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "assetType" TEXT NOT NULL,
    "ownerName" TEXT,
    "operatorName" TEXT,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'New',
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ResourceData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunityId" TEXT NOT NULL,
    "availableGasMMscfd" REAL,
    "gasHeatingValueBtuScf" REAL,
    "gasPressurePsig" REAL,
    "gasTemperatureF" REAL,
    "methanePercent" REAL,
    "ethanePercent" REAL,
    "propanePercent" REAL,
    "co2Percent" REAL,
    "h2sPpm" REAL,
    "nitrogenPercent" REAL,
    "liquidsContent" TEXT,
    "currentGasUse" TEXT,
    "currentGasPriceUsdMmbtu" REAL,
    "flareStatus" TEXT,
    "shutInStatus" TEXT,
    "productionStability" TEXT,
    "oilProductionBopd" REAL,
    "waterProductionBwpd" REAL,
    "waterCutPercent" REAL,
    "notes" TEXT,
    CONSTRAINT "ResourceData_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InfrastructureData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunityId" TEXT NOT NULL,
    "distanceToPipelineMiles" REAL,
    "distanceToPowerLineMiles" REAL,
    "distanceToSubstationMiles" REAL,
    "distanceToRoadMiles" REAL,
    "distanceToFiberMiles" REAL,
    "distanceToIndustrialLoadMiles" REAL,
    "distanceToDataCenterMiles" REAL,
    "landAvailable" BOOLEAN NOT NULL DEFAULT false,
    "landOwnershipKnown" BOOLEAN NOT NULL DEFAULT false,
    "waterAvailable" BOOLEAN NOT NULL DEFAULT false,
    "existingFacilities" BOOLEAN NOT NULL DEFAULT false,
    "existingPowerInfrastructure" BOOLEAN NOT NULL DEFAULT false,
    "existingGasProcessing" BOOLEAN NOT NULL DEFAULT false,
    "existingCompression" BOOLEAN NOT NULL DEFAULT false,
    "siteAccessQuality" TEXT,
    "notes" TEXT,
    CONSTRAINT "InfrastructureData_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CommercialData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunityId" TEXT NOT NULL,
    "gasOwnerKnown" BOOLEAN NOT NULL DEFAULT false,
    "landOwnerKnown" BOOLEAN NOT NULL DEFAULT false,
    "mineralRightsKnown" BOOLEAN NOT NULL DEFAULT false,
    "existingGasContract" BOOLEAN NOT NULL DEFAULT false,
    "existingPowerOfftaker" BOOLEAN NOT NULL DEFAULT false,
    "nearbyIndustrialOfftaker" BOOLEAN NOT NULL DEFAULT false,
    "interestedCounterparty" BOOLEAN NOT NULL DEFAULT false,
    "preferredCommercialModel" TEXT,
    "targetPowerPriceUsdMwh" REAL,
    "targetGasPriceUsdMmbtu" REAL,
    "expectedCapacityFactorPercent" REAL,
    "notes" TEXT,
    CONSTRAINT "CommercialData_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RegulatoryData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunityId" TEXT NOT NULL,
    "existingPermits" BOOLEAN NOT NULL DEFAULT false,
    "airPermitRequired" BOOLEAN NOT NULL DEFAULT false,
    "waterPermitRequired" BOOLEAN NOT NULL DEFAULT false,
    "landUseApprovalRequired" BOOLEAN NOT NULL DEFAULT false,
    "interconnectionRequired" BOOLEAN NOT NULL DEFAULT false,
    "environmentalIssuesKnown" BOOLEAN NOT NULL DEFAULT false,
    "communityIssuesKnown" BOOLEAN NOT NULL DEFAULT false,
    "securityIssuesKnown" BOOLEAN NOT NULL DEFAULT false,
    "permittingComplexity" TEXT,
    "expectedPermittingMonths" REAL,
    "notes" TEXT,
    CONSTRAINT "RegulatoryData_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScoringResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunityId" TEXT NOT NULL,
    "resourceQualityScore" REAL NOT NULL,
    "infrastructureScore" REAL NOT NULL,
    "marketDemandScore" REAL NOT NULL,
    "technicalFeasibilityScore" REAL NOT NULL,
    "commercialControlScore" REAL NOT NULL,
    "regulatoryFeasibilityScore" REAL NOT NULL,
    "economicPotentialScore" REAL NOT NULL,
    "speedToExecuteScore" REAL NOT NULL,
    "strategicRepeatabilityScore" REAL NOT NULL,
    "counterpartySeriousnessScore" REAL NOT NULL,
    "totalScore" REAL NOT NULL,
    "classification" TEXT NOT NULL,
    "recommendation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ScoringResult_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GasToPowerResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunityId" TEXT NOT NULL,
    "availableGasMMscfd" REAL NOT NULL,
    "heatingValueBtuScf" REAL NOT NULL,
    "generatorHeatRateBtuKwh" REAL NOT NULL,
    "assumedAvailabilityPercent" REAL NOT NULL,
    "parasiticLoadPercent" REAL NOT NULL,
    "theoreticalMw" REAL NOT NULL,
    "practicalMwLow" REAL NOT NULL,
    "practicalMwHigh" REAL NOT NULL,
    "recommendedMw" REAL NOT NULL,
    "annualMwh" REAL NOT NULL,
    "fuelEnergyMmbtuDay" REAL NOT NULL,
    "fuelEnergyMmbtuYear" REAL NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GasToPowerResult_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FinancialScreenResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunityId" TEXT NOT NULL,
    "projectSizeMw" REAL NOT NULL,
    "capexPerKwLow" REAL NOT NULL,
    "capexPerKwBase" REAL NOT NULL,
    "capexPerKwHigh" REAL NOT NULL,
    "totalCapexLow" REAL NOT NULL,
    "totalCapexBase" REAL NOT NULL,
    "totalCapexHigh" REAL NOT NULL,
    "powerPriceUsdMwh" REAL NOT NULL,
    "annualMwh" REAL NOT NULL,
    "annualRevenue" REAL NOT NULL,
    "gasPriceUsdMmbtu" REAL NOT NULL,
    "annualFuelCost" REAL NOT NULL,
    "fixedOpexUsdKwYear" REAL NOT NULL,
    "variableOpexUsdMwh" REAL NOT NULL,
    "annualFixedOpex" REAL NOT NULL,
    "annualVariableOpex" REAL NOT NULL,
    "totalAnnualOpex" REAL NOT NULL,
    "ebitda" REAL NOT NULL,
    "simplePaybackYears" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FinancialScreenResult_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RiskItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunityId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "riskDescription" TEXT NOT NULL,
    "probability" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "severityScore" INTEGER NOT NULL,
    "mitigation" TEXT NOT NULL,
    "owner" TEXT,
    "nextAction" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Open',
    CONSTRAINT "RiskItem_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectMemo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunityId" TEXT NOT NULL,
    "executiveSummary" TEXT,
    "assetDescription" TEXT,
    "resourceBasis" TEXT,
    "infrastructureReview" TEXT,
    "monetizationOptions" TEXT,
    "recommendedConcept" TEXT,
    "technicalDesign" TEXT,
    "commercialStructure" TEXT,
    "financialSummary" TEXT,
    "riskSummary" TEXT,
    "developmentRoadmap" TEXT,
    "goNoGoRecommendation" TEXT,
    "nextActions" TEXT,
    "memoStatus" TEXT NOT NULL DEFAULT 'Draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectMemo_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ResourceData_opportunityId_key" ON "ResourceData"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "InfrastructureData_opportunityId_key" ON "InfrastructureData"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "CommercialData_opportunityId_key" ON "CommercialData"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "RegulatoryData_opportunityId_key" ON "RegulatoryData"("opportunityId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMemo_opportunityId_key" ON "ProjectMemo"("opportunityId");

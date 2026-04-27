export type GasToPowerInputs = {
  availableGasMMscfd: number;
  heatingValueBtuScf?: number;
  generatorHeatRateBtuKwh?: number;
  availabilityPercent?: number;
  parasiticLoadPercent?: number;
};

export type GasToPowerAssumptions = {
  availableGasMMscfd: number;
  heatingValueBtuScf: number;
  generatorHeatRateBtuKwh: number;
  availabilityPercent: number;
  parasiticLoadPercent: number;
};

export type GasToPowerResult = GasToPowerAssumptions & {
  dailyEnergyBtu: number;
  dailyEnergyMmbtu: number;
  grossKwhPerDay: number;
  grossMw: number;
  netMw: number;
  theoreticalMw: number;
  practicalMwLow: number;
  practicalMwHigh: number;
  recommendedMw: number;
  annualMwh: number;
  fuelEnergyMmbtuDay: number;
  fuelEnergyMmbtuYear: number;
};

export function normalizeGasToPowerInputs(
  inputs: GasToPowerInputs,
): GasToPowerAssumptions {
  return {
    availableGasMMscfd: inputs.availableGasMMscfd,
    heatingValueBtuScf: inputs.heatingValueBtuScf ?? 1050,
    generatorHeatRateBtuKwh: inputs.generatorHeatRateBtuKwh ?? 8500,
    availabilityPercent: inputs.availabilityPercent ?? 85,
    parasiticLoadPercent: inputs.parasiticLoadPercent ?? 5,
  };
}

export function validateGasToPowerInputs(inputs: GasToPowerAssumptions) {
  if (inputs.availableGasMMscfd <= 0) {
    throw new Error("availableGasMMscfd must be greater than 0");
  }

  if (inputs.heatingValueBtuScf <= 0) {
    throw new Error("heatingValueBtuScf must be greater than 0");
  }

  if (inputs.generatorHeatRateBtuKwh <= 0) {
    throw new Error("generatorHeatRateBtuKwh must be greater than 0");
  }

  if (inputs.availabilityPercent < 0 || inputs.availabilityPercent > 100) {
    throw new Error("availabilityPercent must be between 0 and 100");
  }

  if (inputs.parasiticLoadPercent < 0 || inputs.parasiticLoadPercent > 50) {
    throw new Error("parasiticLoadPercent must be between 0 and 50");
  }
}

export function calculateGasToPower(inputs: GasToPowerInputs): GasToPowerResult {
  const assumptions = normalizeGasToPowerInputs(inputs);
  validateGasToPowerInputs(assumptions);

  const dailyEnergyBtu =
    assumptions.availableGasMMscfd * 1_000_000 * assumptions.heatingValueBtuScf;
  const dailyEnergyMmbtu = dailyEnergyBtu / 1_000_000;
  const grossKwhPerDay = dailyEnergyBtu / assumptions.generatorHeatRateBtuKwh;
  const grossMw = grossKwhPerDay / 24 / 1000;
  const netMw = grossMw * (1 - assumptions.parasiticLoadPercent / 100);
  const practicalMwLow = netMw * 0.7;
  const practicalMwHigh = netMw * 0.9;
  const recommendedMw = (practicalMwLow + practicalMwHigh) / 2;
  const annualMwh =
    recommendedMw * 8760 * (assumptions.availabilityPercent / 100);
  const fuelEnergyMmbtuDay = dailyEnergyMmbtu;
  const fuelEnergyMmbtuYear = dailyEnergyMmbtu * 365;

  return {
    ...assumptions,
    dailyEnergyBtu,
    dailyEnergyMmbtu,
    grossKwhPerDay,
    grossMw,
    netMw,
    theoreticalMw: grossMw,
    practicalMwLow,
    practicalMwHigh,
    recommendedMw,
    annualMwh,
    fuelEnergyMmbtuDay,
    fuelEnergyMmbtuYear,
  };
}


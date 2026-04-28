export type FinancialInputs = {
  projectSizeMw: number;
  annualMwh: number;
  powerPriceUsdMwh?: number;
  gasPriceUsdMmbtu?: number;
  annualFuelMmbtu: number;
  capexPerKwLow?: number;
  capexPerKwBase?: number;
  capexPerKwHigh?: number;
  fixedOpexUsdKwYear?: number;
  variableOpexUsdMwh?: number;
};

export type FinancialAssumptions = {
  projectSizeMw: number;
  annualMwh: number;
  powerPriceUsdMwh: number;
  gasPriceUsdMmbtu: number;
  annualFuelMmbtu: number;
  capexPerKwLow: number;
  capexPerKwBase: number;
  capexPerKwHigh: number;
  fixedOpexUsdKwYear: number;
  variableOpexUsdMwh: number;
};

export type FinancialResult = FinancialAssumptions & {
  projectSizeKw: number;
  totalCapexLow: number;
  totalCapexBase: number;
  totalCapexHigh: number;
  annualRevenue: number;
  annualFuelCost: number;
  annualFixedOpex: number;
  annualVariableOpex: number;
  totalAnnualOpex: number;
  ebitda: number;
  simplePaybackYears: number | null;
  breakEvenPowerPrice: number;
};

export type FinancialScenarioName = "Low Case" | "Base Case" | "High Case";

export type FinancialScenario = FinancialResult & {
  name: FinancialScenarioName;
};

export function normalizeFinancialInputs(
  inputs: FinancialInputs,
): FinancialAssumptions {
  return {
    projectSizeMw: inputs.projectSizeMw,
    annualMwh: inputs.annualMwh,
    powerPriceUsdMwh: inputs.powerPriceUsdMwh ?? 70,
    gasPriceUsdMmbtu: inputs.gasPriceUsdMmbtu ?? 2.5,
    annualFuelMmbtu: inputs.annualFuelMmbtu,
    capexPerKwLow: inputs.capexPerKwLow ?? 1000,
    capexPerKwBase: inputs.capexPerKwBase ?? 1400,
    capexPerKwHigh: inputs.capexPerKwHigh ?? 1800,
    fixedOpexUsdKwYear: inputs.fixedOpexUsdKwYear ?? 25,
    variableOpexUsdMwh: inputs.variableOpexUsdMwh ?? 5,
  };
}

export function validateFinancialInputs(inputs: FinancialAssumptions) {
  if (inputs.projectSizeMw <= 0) {
    throw new Error("projectSizeMw must be greater than 0");
  }

  if (inputs.annualMwh <= 0) {
    throw new Error("annualMwh must be greater than 0");
  }

  if (inputs.annualFuelMmbtu < 0) {
    throw new Error("annualFuelMmbtu cannot be negative");
  }

  if (inputs.powerPriceUsdMwh < 0 || inputs.gasPriceUsdMmbtu < 0) {
    throw new Error("price assumptions cannot be negative");
  }

  if (
    inputs.capexPerKwLow < 0 ||
    inputs.capexPerKwBase < 0 ||
    inputs.capexPerKwHigh < 0
  ) {
    throw new Error("capex assumptions cannot be negative");
  }

  if (inputs.fixedOpexUsdKwYear < 0 || inputs.variableOpexUsdMwh < 0) {
    throw new Error("opex assumptions cannot be negative");
  }
}

export function calculateFinancialScreen(
  inputs: FinancialInputs,
): FinancialResult {
  const assumptions = normalizeFinancialInputs(inputs);
  validateFinancialInputs(assumptions);

  const projectSizeKw = assumptions.projectSizeMw * 1000;
  const totalCapexLow = projectSizeKw * assumptions.capexPerKwLow;
  const totalCapexBase = projectSizeKw * assumptions.capexPerKwBase;
  const totalCapexHigh = projectSizeKw * assumptions.capexPerKwHigh;
  const annualRevenue = assumptions.annualMwh * assumptions.powerPriceUsdMwh;
  const annualFuelCost =
    assumptions.annualFuelMmbtu * assumptions.gasPriceUsdMmbtu;
  const annualFixedOpex = projectSizeKw * assumptions.fixedOpexUsdKwYear;
  const annualVariableOpex =
    assumptions.annualMwh * assumptions.variableOpexUsdMwh;
  const totalAnnualOpex =
    annualFuelCost + annualFixedOpex + annualVariableOpex;
  const ebitda = annualRevenue - totalAnnualOpex;
  const simplePaybackYears =
    ebitda > 0 ? totalCapexBase / ebitda : null;
  const breakEvenPowerPrice = totalAnnualOpex / assumptions.annualMwh;

  return {
    ...assumptions,
    projectSizeKw,
    totalCapexLow,
    totalCapexBase,
    totalCapexHigh,
    annualRevenue,
    annualFuelCost,
    annualFixedOpex,
    annualVariableOpex,
    totalAnnualOpex,
    ebitda,
    simplePaybackYears,
    breakEvenPowerPrice,
  };
}

function scenarioResult(
  name: FinancialScenarioName,
  inputs: FinancialInputs,
): FinancialScenario {
  return {
    name,
    ...calculateFinancialScreen(inputs),
  };
}

export function calculateFinancialScenarios(
  baseInputs: FinancialInputs,
): FinancialScenario[] {
  const base = normalizeFinancialInputs(baseInputs);

  return [
    scenarioResult("Low Case", {
      ...base,
      projectSizeMw: base.projectSizeMw * 0.9,
      annualMwh: base.annualMwh * 0.9,
      powerPriceUsdMwh: base.powerPriceUsdMwh * 0.85,
      gasPriceUsdMmbtu: base.gasPriceUsdMmbtu * 1.15,
      annualFuelMmbtu: base.annualFuelMmbtu * 0.9,
      capexPerKwBase: base.capexPerKwBase * 1.15,
    }),
    scenarioResult("Base Case", base),
    scenarioResult("High Case", {
      ...base,
      projectSizeMw: base.projectSizeMw * 1.05,
      annualMwh: base.annualMwh * 1.05,
      powerPriceUsdMwh: base.powerPriceUsdMwh * 1.15,
      gasPriceUsdMmbtu: base.gasPriceUsdMmbtu * 0.9,
      annualFuelMmbtu: base.annualFuelMmbtu * 1.05,
      capexPerKwBase: base.capexPerKwBase * 0.9,
    }),
  ];
}

type FormatOptions = {
  fallback?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  compact?: boolean;
};

function isMissing(value: number | Date | string | null | undefined) {
  return value == null || value === "";
}

export function formatNumber(
  value: number | null | undefined,
  options: FormatOptions = {},
) {
  if (isMissing(value)) {
    return options.fallback ?? "Not provided";
  }

  return new Intl.NumberFormat("en", {
    maximumFractionDigits: options.maximumFractionDigits ?? 1,
    minimumFractionDigits: options.minimumFractionDigits,
    notation: options.compact ? "compact" : "standard",
  }).format(value);
}

export function formatCurrency(
  value: number | null | undefined,
  options: FormatOptions = {},
) {
  if (isMissing(value)) {
    return options.fallback ?? "Not calculated";
  }

  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const maximumFractionDigits = options.maximumFractionDigits ?? 1;

  if (options.compact ?? abs >= 1_000_000) {
    return `${sign}$${formatNumber(abs, {
      compact: true,
      maximumFractionDigits,
    })}`;
  }

  return `${sign}${new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
  }).format(abs)}`;
}

export function formatMw(value: number | null | undefined) {
  if (value == null) {
    return "Not calculated";
  }

  return `${formatNumber(value, {
    maximumFractionDigits: 1,
  })} MW`;
}

export function formatMwh(value: number | null | undefined) {
  if (value == null) {
    return "Not calculated";
  }

  return `${formatNumber(value, {
    maximumFractionDigits: 0,
  })} MWh`;
}

export function formatMmbtu(value: number | null | undefined) {
  if (value == null) {
    return "Not calculated";
  }

  return `${formatNumber(value, {
    maximumFractionDigits: 0,
  })} MMBtu`;
}

export function formatPercent(value: number | null | undefined) {
  if (value == null) {
    return "Not provided";
  }

  return `${formatNumber(value, {
    maximumFractionDigits: 1,
  })}%`;
}

export function formatScore(value: number | null | undefined) {
  return formatNumber(value, {
    fallback: "Not calculated",
    maximumFractionDigits: 1,
  });
}

export function formatDate(value: Date | string | null | undefined) {
  if (isMissing(value)) {
    return "Not provided";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatPaybackYears(value: number | null | undefined) {
  if (value == null || value <= 0 || !Number.isFinite(value)) {
    return "Not meaningful";
  }

  return `${formatNumber(value, { maximumFractionDigits: 1 })} years`;
}

export function formatNullable<T>(
  value: T | null | undefined,
  formatter?: (value: T) => string,
) {
  if (value == null || value === "") {
    return "Not provided";
  }

  return formatter ? formatter(value) : String(value);
}

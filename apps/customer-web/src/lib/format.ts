/**
 * E-NAKO Centralized Number & Currency Formatting System
 * Formats numbers using clean non-breaking space grouping (e.g. "84 250 000 XAF")
 * adhering to CEMAC / BEAC / OHADA standards and modern fintech aesthetics.
 */

export function formatNumber(
  val: number | string,
  fractionDigits?: number,
): string {
  if (val === null || val === undefined || val === "") return "0";
  const num =
    typeof val === "string" ? parseFloat(val.replace(/[^0-9.-]/g, "")) : val;
  if (isNaN(num)) return typeof val === "string" ? val : "0";

  const maxDecimals = fractionDigits !== undefined ? fractionDigits : 2;
  const minDecimals =
    fractionDigits !== undefined ? fractionDigits : num % 1 !== 0 ? 2 : 0;

  // Format using space thousands separator: "84 250 000"
  const formatted = num
    .toLocaleString("fr-FR", {
      maximumFractionDigits: maxDecimals,
      minimumFractionDigits: minDecimals,
    })
    .replace(/\u202F/g, " ");

  return formatted;
}

export function formatMoney(
  val: number | string,
  currency = "XAF",
  fractionDigits?: number,
): string {
  const formatted = formatNumber(val, fractionDigits);
  return `${formatted} ${currency}`;
}

export function formatXAF(val: number | string): string {
  return formatMoney(val, "XAF");
}

export function formatFCFA(val: number | string): string {
  return formatMoney(val, "FCFA");
}

export function formatEUR(val: number | string): string {
  const formatted = formatNumber(val);
  return `€${formatted}`;
}

export function formatUSD(val: number | string): string {
  const formatted = formatNumber(val);
  return `$${formatted}`;
}

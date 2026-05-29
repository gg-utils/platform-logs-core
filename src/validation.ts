/**
 * @fileoverview Validates numeric strings and chars-per-token values for the log-tail planning helpers.
 *
 * @testing Package: `npm run platform-logs-core:test`.
 * @see packages/platform-logs-core/src/tokens-to-char-budget.ts - Token-budget helper that depends on the same numeric input discipline.
 * @documentation reviewed=2026-04-12 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */

const POSITIVE_INT = /^[1-9][0-9]*$/;
const NUMERIC = /^[0-9]+(\.[0-9]+)?$/;

/**
 * True when `value` is a base-10 strictly positive integer string (`^[1-9][0-9]*$`, so no leading zeros).
 */
export function logTail_isPositiveIntString(value: string): boolean {
  return POSITIVE_INT.test(value);
}

/**
 * True when `value` matches the decimal numeric token format used for chars-per-token inputs.
 */
export function logTail_isCharsPerTokenFormat(value: string): boolean {
  return NUMERIC.test(value);
}

/**
 * Parses a chars-per-token string into a finite strictly positive number.
 *
 * @throws Error with `INVALID_FORMAT` or `NOT_POSITIVE` markers when validation fails.
 */
export function logTail_parseCharsPerTokenStrictPositive(
  value: string,
): number {
  if (!NUMERIC.test(value)) {
    throw new Error("INVALID_FORMAT");
  }
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error("NOT_POSITIVE");
  }
  return n;
}

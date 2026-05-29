/**
 * @fileoverview Validates numeric strings and chars-per-token values for the log-tail planning helpers.
 *
 * @testing Package: `npm run platform-logs-core:test`.
 * @see packages/platform-logs-core/src/tokens-to-char-budget.ts - Token-budget helper that depends on the same numeric input discipline.
 * @documentation reviewed=2026-04-12 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */
/**
 * True when `value` is a base-10 strictly positive integer string (`^[1-9][0-9]*$`, so no leading zeros).
 */
export declare function logTail_isPositiveIntString(value: string): boolean;
/**
 * True when `value` matches the decimal numeric token format used for chars-per-token inputs.
 */
export declare function logTail_isCharsPerTokenFormat(value: string): boolean;
/**
 * Parses a chars-per-token string into a finite strictly positive number.
 *
 * @throws Error with `INVALID_FORMAT` or `NOT_POSITIVE` markers when validation fails.
 */
export declare function logTail_parseCharsPerTokenStrictPositive(value: string): number;
//# sourceMappingURL=validation.d.ts.map
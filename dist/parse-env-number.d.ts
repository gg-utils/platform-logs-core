/**
 * @fileoverview Parses numeric environment values for platform log command-line scripts.
 *
 * @testing Package: `npm run platform-logs-core:test`.
 * @see packages/platform-logs-core/src/validation.ts - Numeric-string validation rules that stay aligned with these parsing helpers.
 * @see packages/platform-logs-core/src/tail-process.ts - Process-control helpers that rely on these numeric defaults.
 * @documentation reviewed=2026-04-12 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */
/**
 * Parses a strictly positive integer env string, falling back to `defaultValue` when empty or invalid.
 *
 * @remarks
 * USAGE: rejects zero, negatives, non-integers, and non-finite values; use {@link logTail_parseEnvNumber}
 * when broader numeric ranges are needed.
 */
export declare function logTail_parseEnvPositiveInt(raw: string | undefined, defaultValue: number): number;
/**
 * Parses a generic finite numeric env string, falling back to `defaultValue` when empty or non-finite.
 *
 * @remarks
 * USAGE: unlike {@link logTail_parseEnvPositiveInt}, this accepts zero and negative numbers when present.
 */
export declare function logTail_parseEnvNumber(raw: string | undefined, defaultValue: number): number;
//# sourceMappingURL=parse-env-number.d.ts.map
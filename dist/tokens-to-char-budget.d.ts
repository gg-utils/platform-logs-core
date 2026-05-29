/**
 * @fileoverview Converts token counts into character budgets for the log-tail preview and snapshot code.
 *
 * @testing Package: `npm run platform-logs-core:test`.
 * @see packages/platform-logs-core/src/log-tail.unit.test.ts - Unit coverage for token-to-character rounding.
 * @documentation reviewed=2026-04-12 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */
/**
 * Matches legacy awk in the former Bash log-tail scripts:
 * value = tokens * avg; if value < 1 then 1; integer -> value else int(value)+1
 * (awk int() truncates toward zero; for positive values, floor).
 */
export declare function logTail_tokensToCharBudget(tokens: number, charsPerToken: number): number;
//# sourceMappingURL=tokens-to-char-budget.d.ts.map
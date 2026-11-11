/**
 * @fileoverview Public exports for product-neutral platform log primitives.
 *
 * Keep project-specific log directory names, npm command labels, runtime scopes, and dashboard
 * wiring in config/adapters. This package owns reusable file discovery, numeric parsing, token
 * budget conversion, validation, and tail process helpers.
 *
 * @example
 * ```typescript
 * import { logTail_resolveLatestLogFile } from "@gg-utils/platform-logs-core";
 *
 * const newest = logTail_resolveLatestLogFile({
 *   directory: "/workspace/logs/platform",
 *   basenamePattern: "platform-*.log",
 *   latestSymlinkPath: "/workspace/logs/platform/latest.log",
 * });
 * ```
 *
 * @testing CLI: npm run platform-logs-core:test from the repository root (runs tsx --test over packages/platform-logs-core/src per that package's npm test script).
 *
 * @see packages/platform-logs-kit/src/resolve-log-targets.ts - Kit orchestration that imports discover helpers from `@gg-utils/platform-logs-core` subpaths surfaced through this barrel.
 * @see scripts/platform/commands/dev-tail-follow.ts - Dev tail CLI that composes discovery, env parsing, tail subprocess, token budget, and validation exports from this package.
 * @see scripts/checks/platform-logs-package-boundary.ts - Repo check that constrains which `@gg-utils/platform-logs-core` export entrypoints stay supported alongside this index.
 *
 * @documentation reviewed=2026-05-22 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */
export * from "./discover-log-files.js";
export * from "./parse-env-number.js";
export * from "./tail-process.js";
export * from "./tokens-to-char-budget.js";
export * from "./validation.js";

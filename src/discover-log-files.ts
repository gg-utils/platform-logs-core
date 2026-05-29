/**
 * @fileoverview Discovers log files by basename glob and recency for platform log runtimes.
 *
 * @example
 * ```typescript
 * const newest = logTail_resolveLatestLogFile({
 *   directory: "/workspace/logs/platform",
 *   basenamePattern: "platform-*.log",
 *   latestSymlinkPath: "/workspace/logs/platform/latest.log",
 * });
 * ```
 *
 * @testing Package: `npm run platform-logs-core:test`.
 * @see packages/platform-logs-core/src/log-tail.unit.test.ts - Unit coverage for glob and newest-file resolution.
 * @documentation reviewed=2026-04-12 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */

import fs from "node:fs";
import path from "node:path";

/** Glob subset: single `*` segment, e.g. `runtime-*.log`. */
export function logTail_basenameMatchesSimpleGlob(
  basename: string,
  pattern: string,
): boolean {
  const star = pattern.indexOf("*");
  if (star < 0) {
    return basename === pattern;
  }
  const prefix = pattern.slice(0, star);
  const suffix = pattern.slice(star + 1);
  if (!basename.startsWith(prefix) || !basename.endsWith(suffix)) {
    return false;
  }
  return basename.length >= prefix.length + suffix.length;
}

/**
 * Lists files in `directory` whose basenames match `basenamePattern`, sorted by mtime descending (ties broken by path).
 *
 * @remarks
 * I/O: reads directory entries and stats each candidate file; returns empty array when the directory is unreadable.
 */
export function logTail_listMatchingFilesByMtimeDesc(options: {
  directory: string;
  basenamePattern: string;
}): string[] {
  let names: string[];
  try {
    names = fs.readdirSync(options.directory);
  } catch {
    return [];
  }

  const withStat: { fullPath: string; mtimeMs: number }[] = [];
  for (const name of names) {
    if (!logTail_basenameMatchesSimpleGlob(name, options.basenamePattern)) {
      continue;
    }
    const fullPath = path.join(options.directory, name);
    let st: fs.Stats;
    try {
      st = fs.statSync(fullPath);
    } catch {
      continue;
    }
    if (!st.isFile()) {
      continue;
    }
    withStat.push({ fullPath, mtimeMs: st.mtimeMs });
  }

  withStat.sort((a, b) => {
    if (b.mtimeMs !== a.mtimeMs) {
      return b.mtimeMs - a.mtimeMs;
    }
    return a.fullPath.localeCompare(b.fullPath);
  });

  return withStat.map((e) => e.fullPath);
}

/**
 * Resolves the newest matching log file, falling back through `latestSymlinkPath` when the directory sort is empty.
 *
 * @remarks
 * I/O: directory listing, stats, and optional symlink readlink; safe when files race during rotation.
 */
export function logTail_resolveLatestLogFile(options: {
  directory: string;
  basenamePattern: string;
  latestSymlinkPath: string;
}): string | undefined {
  const sorted = logTail_listMatchingFilesByMtimeDesc({
    directory: options.directory,
    basenamePattern: options.basenamePattern,
  });
  const first = sorted[0];
  if (
    first !== undefined &&
    fs.existsSync(first) &&
    fs.statSync(first).isFile()
  ) {
    return first;
  }

  try {
    if (!fs.lstatSync(options.latestSymlinkPath).isSymbolicLink()) {
      return undefined;
    }
  } catch {
    return undefined;
  }

  let target: string;
  try {
    target = fs.readlinkSync(options.latestSymlinkPath);
  } catch {
    return undefined;
  }

  const resolved = path.isAbsolute(target)
    ? target
    : path.join(path.dirname(options.latestSymlinkPath), target);

  try {
    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
      return resolved;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

/**
 * Picks the Nth newest file (1-based) after the same basename filtering and mtime ordering as {@link logTail_listMatchingFilesByMtimeDesc}.
 *
 * @remarks
 * USAGE: `indexOneBased` matches the log-tail UI’s run-index semantics (1 = newest).
 */
export function logTail_resolveNthNewestMatchingFile(options: {
  directory: string;
  basenamePattern: string;
  /** 1-based index (same as bash sed -n "${run_index}p"). */
  indexOneBased: number;
}): string | undefined {
  const sorted = logTail_listMatchingFilesByMtimeDesc({
    directory: options.directory,
    basenamePattern: options.basenamePattern,
  });
  const idx = options.indexOneBased - 1;
  if (idx < 0 || idx >= sorted.length) {
    return undefined;
  }
  return sorted[idx];
}

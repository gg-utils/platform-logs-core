/**
 * @fileoverview Spawns, checks, and stops the tail process used by the log-tail command-line runtime.
 *
 * @testing Package: `npm run platform-logs-core:test`.
 * @see packages/platform-logs-core/src/discover-log-files.ts - File-discovery logic that supplies tail inputs.
 * @see packages/platform-logs-core/src/log-tail.unit.test.ts - Package-local coverage for sibling log primitives.
 * @documentation reviewed=2026-04-12 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */

import { type ChildProcess, spawn } from "node:child_process";

/**
 * Spawns `tail` with inherited stdio so operators see streaming output in their terminal session.
 *
 * @remarks
 * I/O: delegates to the host `tail` binary; caller owns lifecycle via {@link logTail_stopTail}.
 */
export function logTail_spawnTail(
  args: readonly string[],
  env: NodeJS.ProcessEnv = process.env,
): ChildProcess {
  const child = spawn("tail", [...args], {
    stdio: "inherit",
    env,
  });
  return child;
}

/**
 * Returns whether the child is still attached and has not emitted an exit code or signal yet.
 */
export function logTail_isTailRunning(child: ChildProcess | null): boolean {
  if (child === null) {
    return false;
  }
  return child.exitCode === null && child.signalCode === null;
}

/**
 * Sends `SIGTERM` to a live tail child; no-ops when already exited or when `child` is null.
 *
 * @remarks
 * USAGE: pair with {@link logTail_spawnTail}; swallow errors because the process may already be gone.
 */
export function logTail_stopTail(child: ChildProcess | null): void {
  if (child === null) {
    return;
  }
  if (child.exitCode !== null || child.signalCode !== null) {
    return;
  }
  try {
    child.kill("SIGTERM");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ESRCH") {
      return;
    }
    throw error;
  }
}

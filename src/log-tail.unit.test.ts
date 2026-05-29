/**
 * @fileoverview Unit coverage for product-neutral platform log discovery, token-budget, and validation helpers.
 *
 * @testing Package: `npm run platform-logs-core:test`.
 * @see packages/platform-logs-core/src/discover-log-files.ts - Log-file discovery helpers asserted here.
 * @see packages/platform-logs-core/src/tokens-to-char-budget.ts - Token-budget helper asserted here.
 * @see packages/platform-logs-core/src/validation.ts - Numeric-string validation helpers covered here.
 * @documentation reviewed=2026-05-20 standard=FILE_OVERVIEW_STANDARDS_TYPESCRIPT@3
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  logTail_basenameMatchesSimpleGlob,
  logTail_listMatchingFilesByMtimeDesc,
  logTail_resolveLatestLogFile,
  logTail_resolveNthNewestMatchingFile,
} from "./discover-log-files.js";
import { logTail_tokensToCharBudget } from "./tokens-to-char-budget.js";
import {
  logTail_isCharsPerTokenFormat,
  logTail_isPositiveIntString,
  logTail_parseCharsPerTokenStrictPositive,
} from "./validation.js";

function withTempDir(callback: (directory: string) => void): void {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "platform-logs-"));
  try {
    callback(directory);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

test("logTail_tokensToCharBudget matches legacy rounding", () => {
  assert.equal(logTail_tokensToCharBudget(5, 4), 20);
  assert.equal(logTail_tokensToCharBudget(1, 4.1), 5);
  assert.equal(logTail_tokensToCharBudget(1, 0.05), 1);
});

test("logTail_basenameMatchesSimpleGlob matches a single-star pattern", () => {
  assert.equal(
    logTail_basenameMatchesSimpleGlob("platform-foo.log", "platform-*.log"),
    true,
  );
  assert.equal(
    logTail_basenameMatchesSimpleGlob("other.log", "platform-*.log"),
    false,
  );
});

test("logTail_listMatchingFilesByMtimeDesc orders by mtime", () => {
  withTempDir((directory) => {
    const older = path.join(directory, "platform-a.log");
    const newer = path.join(directory, "platform-b.log");
    fs.writeFileSync(older, "a");
    fs.writeFileSync(newer, "b");
    const timestampSeconds = Date.now() / 1000;
    fs.utimesSync(older, timestampSeconds, timestampSeconds);
    fs.utimesSync(newer, timestampSeconds + 1, timestampSeconds + 1);

    const sorted = logTail_listMatchingFilesByMtimeDesc({
      directory,
      basenamePattern: "platform-*.log",
    });
    assert.equal(sorted[0], newer);
    assert.equal(sorted[1], older);
  });
});

test("logTail_resolveLatestLogFile falls back to latest symlink", () => {
  withTempDir((directory) => {
    const target = path.join(directory, "platform-x.log");
    fs.writeFileSync(target, "x");
    const link = path.join(directory, "latest.log");
    fs.symlinkSync(path.basename(target), link);

    const resolved = logTail_resolveLatestLogFile({
      directory,
      basenamePattern: "platform-*.log",
      latestSymlinkPath: link,
    });
    assert.equal(resolved, target);
  });
});

test("logTail_resolveNthNewestMatchingFile returns the requested index", () => {
  withTempDir((directory) => {
    const older = path.join(directory, "platform-old.log");
    const newer = path.join(directory, "platform-new.log");
    fs.writeFileSync(older, "o");
    fs.writeFileSync(newer, "n");
    const timestampSeconds = Date.now() / 1000;
    fs.utimesSync(older, timestampSeconds, timestampSeconds);
    fs.utimesSync(newer, timestampSeconds + 2, timestampSeconds + 2);

    assert.equal(
      logTail_resolveNthNewestMatchingFile({
        directory,
        basenamePattern: "platform-*.log",
        indexOneBased: 1,
      }),
      newer,
    );
    assert.equal(
      logTail_resolveNthNewestMatchingFile({
        directory,
        basenamePattern: "platform-*.log",
        indexOneBased: 2,
      }),
      older,
    );
  });
});

test("validation helpers accept positive int strings", () => {
  assert.equal(logTail_isPositiveIntString("1"), true);
  assert.equal(logTail_isPositiveIntString("0"), false);
  assert.equal(logTail_isPositiveIntString("01"), false);
});

test("validation helpers parse strict positive chars-per-token values", () => {
  assert.equal(logTail_parseCharsPerTokenStrictPositive("4"), 4);
  assert.equal(logTail_parseCharsPerTokenStrictPositive("3.8"), 3.8);
  assert.throws(() => logTail_parseCharsPerTokenStrictPositive("0"));
});

test("validation helpers match chars-per-token format", () => {
  assert.equal(logTail_isCharsPerTokenFormat("0"), true);
  assert.equal(logTail_isCharsPerTokenFormat("4.2"), true);
});

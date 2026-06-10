/**
 * T034 — Zero-Sitecore-dependency CI assertion
 * TC-38: No @sitecore-content-sdk/* or @sitecore-* in static/package.json deps
 * TC-39: No import/require from @sitecore-* anywhere under static/src
 * TC-39+: "test-the-test" mutation check — test would fail if an @sitecore-* dep were added
 *
 * FILE-SYSTEM assertion (reads from disk at test time).
 * Defining invariant: ADR-0003/0007; PRD non-negotiable.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join, extname } from 'path';

// Resolve static/ root: this file lives at tests/unit/invariants/
// Go up 3 levels: invariants -> unit -> tests -> static/
const STATIC_ROOT = resolve(__dirname, '../../..');
const SRC_ROOT = join(STATIC_ROOT, 'src');
const PKG_PATH = join(STATIC_ROOT, 'package.json');

// Walk all TS/TSX/JS source files under a directory
function getAllSourceFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...getAllSourceFiles(full));
    } else {
      const ext = extname(full);
      if (['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'].includes(ext)) {
        results.push(full);
      }
    }
  }
  return results;
}

const SITECORE_PATTERN = /@sitecore-/;

describe('T034 — Zero-Sitecore-dependency invariant', () => {
  it('TC-38: static/package.json has no @sitecore-* dependency or devDependency', () => {
    const pkg = JSON.parse(readFileSync(PKG_PATH, 'utf-8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const allDeps = [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
    ];

    const sitecoreDeps = allDeps.filter((name) => SITECORE_PATTERN.test(name));

    expect(
      sitecoreDeps,
      `Found @sitecore-* packages in package.json: ${sitecoreDeps.join(', ')}`
    ).toHaveLength(0);
  });

  it('TC-39: no import/require from @sitecore-* in any src file', () => {
    const files = getAllSourceFiles(SRC_ROOT);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      // Matches: from '@sitecore-...' (ES import) OR require('@sitecore-...')
      const importRe = /(?:from|require\()\s*['"`](@sitecore-[^'"`\s]+)['"`]/g;
      let match: RegExpExecArray | null;
      while ((match = importRe.exec(content)) !== null) {
        violations.push(`${file}: imports '${match[1]}'`);
      }
    }

    expect(
      violations,
      `Found @sitecore-* imports in src:\n${violations.join('\n')}`
    ).toHaveLength(0);
  });

  it('TC-39+: mutation — detection logic catches a fake @sitecore-* package entry', () => {
    // Simulate a mutated package.json — verifies the check logic is effective
    const fakePkg = {
      dependencies: { '@sitecore-content-sdk/core': '^1.0.0', react: '19.0.0' },
      devDependencies: { typescript: '^5' },
    };

    const allDeps = [
      ...Object.keys(fakePkg.dependencies),
      ...Object.keys(fakePkg.devDependencies),
    ];
    const found = allDeps.filter((name) => SITECORE_PATTERN.test(name));

    // The detection logic MUST find exactly 1 violation in the mutant
    expect(found).toHaveLength(1);
    expect(found[0]).toBe('@sitecore-content-sdk/core');
  });

  it('TC-39+: mutation — regex catches a fake @sitecore-* import in source text', () => {
    // Simulate a source file containing a Sitecore import
    const fakeSource = `import { ComponentPropsContext } from '@sitecore-content-sdk/nextjs';`;
    const importRe = /(?:from|require\()\s*['"`](@sitecore-[^'"`\s]+)['"`]/g;
    const matches: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = importRe.exec(fakeSource)) !== null) {
      matches.push(match[1]);
    }
    // The regex MUST detect the fake import
    expect(matches).toHaveLength(1);
    expect(matches[0]).toBe('@sitecore-content-sdk/nextjs');
  });
});

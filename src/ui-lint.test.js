// @vitest-environment node

import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const require = createRequire(import.meta.url);
const oxlintCli = path.join(path.dirname(require.resolve("oxlint/package.json")), "bin", "oxlint");
const configPath = path.join(projectRoot, ".oxlintrc.json");
let fixtureDirectory;

beforeAll(() => {
  fixtureDirectory = fs.mkdtempSync(path.join(projectRoot, "src", ".oxlint-fixtures-"));
});

afterAll(() => {
  if (fixtureDirectory) fs.rmSync(fixtureDirectory, { recursive: true, force: true });
});

function lintFixture(name, source) {
  const filename = path.join(fixtureDirectory, name);
  fs.writeFileSync(filename, source, "utf8");

  const result = spawnSync(
    process.execPath,
    [oxlintCli, "--config", configPath, "--deny-warnings", "--format", "json", filename],
    { cwd: projectRoot, encoding: "utf8", maxBuffer: 1024 * 1024 }
  );

  if (result.error) throw result.error;
  const report = result.stdout.trim() ? JSON.parse(result.stdout) : { diagnostics: [] };
  return { exitCode: result.status, diagnostics: report.diagnostics || [], stderr: result.stderr };
}

describe("supplemental React and accessibility lint gate", () => {
  it.each([
    ["missing-alt.jsx", 'export default () => <img src="bee.png" />;', "jsx-a11y(alt-text)"],
    ["invalid-aria-name.jsx", '<button aria-labal="close">Close</button>;', "jsx-a11y(aria-props)"],
    ["invalid-aria-value.jsx", '<div aria-hidden="yes" />;', "jsx-a11y(aria-proptypes)"],
    ["invalid-role.jsx", '<div role="madeup" />;', "jsx-a11y(aria-role)"],
    ["invalid-anchor.jsx", '<a href="javascript:void(0)">Open</a>;', "jsx-a11y(anchor-is-valid)"],
    ["duplicate-props.jsx", '<img src="bee.png" alt="bee" alt="bee" />;', "react(jsx-no-duplicate-props)"],
    ["unsafe-blank-target.jsx", '<a href="https://example.com" target="_blank">External link</a>;', "react(jsx-no-target-blank)"],
    ["import-after-statement.jsx", 'const ready = true;\nimport React from "react"; export default () => <p>{ready}</p>;', "import(first)"],
  ])("rejects %s with its configured rule", (_name, source, expectedRule) => {
    const result = lintFixture(_name, source);
    const codes = result.diagnostics.map(({ code }) => code);

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toBe("");
    expect(codes).toContain(expectedRule);
  });

  it("accepts meaningful and decorative image text with valid accessible JSX", () => {
    const result = lintFixture(
      "accessible.jsx",
      'export default () => <main><a href="/about"><img src="bee.png" alt="Bee avatar" /></a><img src="decoration.svg" alt="" aria-hidden="true" /><button type="button" aria-label="Close">×</button></main>;'
    );

    expect(result.exitCode).toBe(0);
    expect(result.diagnostics).toEqual([]);
    expect(result.stderr).toBe("");
  });
});

// @vitest-environment node
import { ESLint } from "eslint";
import { expect, it } from "vitest";

const lint = async (code) => {
  const [result] = await new ESLint().lintText(code, { filePath: "src/lint-fixture.js" });
  return result.messages.map(({ ruleId }) => ruleId);
};

it("accepts the classic React factory used implicitly by JSX and fragments", async () => {
  expect(await lint("import React from 'react'; export default () => <><main /></>;")).toEqual([]);
});

it("rejects JSX without the React factory required at runtime", async () => {
  expect(await lint("export default () => <main />;")).toContain("classic-jsx/react-in-scope");
});

it("still rejects undefined JSX components with the new lint gate", async () => {
  expect(await lint("import React from 'react'; export default () => <Missing />;")).toContain("no-undef");
});

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

// ESLint10 tracks JSX component references, but classic JSX also implicitly
// calls React.createElement/React.Fragment. Keep that factory in scope and used.
const classicJsx = {
  rules: {
    "react-in-scope": {
      meta: { type: "problem", schema: [], messages: { missing: "Classic JSX requires React in scope." } },
      create(context) {
        const useFactory = (node) => {
          if (!context.sourceCode.markVariableAsUsed("React", node)) {
            context.report({ node, messageId: "missing" });
          }
        };
        return { JSXElement: useFactory, JSXFragment: useFactory };
      },
    },
  },
};

export default [
  { ignores: ["build/**", "node_modules/**"] },
  {
    files: ["src/**/*.js", "scripts/**/*.js", "*.mjs", "*.cjs"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { "react-hooks": reactHooks, "classic-jsx": classicJsx },
    rules: {
      ...js.configs.recommended.rules,
      // The CRA check enforced these two rules; compiler-only rules would
      // introduce a React upgrade/refactor outside this toolchain migration.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "classic-jsx/react-in-scope": "error",
      "no-unused-vars": ["error", { args: "none", ignoreRestSiblings: true, caughtErrors: "none" }],
    },
  },
  {
    files: ["src/**/*.test.js"],
    languageOptions: { globals: globals.vitest },
  },
  {
    files: ["scripts/**/*.js", "*.cjs"],
    languageOptions: { sourceType: "commonjs" },
  },
];

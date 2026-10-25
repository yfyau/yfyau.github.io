# Development checks

Use Node.js `24.22.1` from `.nvmrc` and npm `11.19.1` from `package.json`'s `packageManager` field. Ensure that Node is also first on `PATH`: npm scripts spawn the `node` found there. Install the exact locked tree with `npm ci`; no forced peers or legacy-peer-deps setting is required.

```sh
npm ci
npm start
npm run verify
```

`npm start` runs Vite on loopback (`127.0.0.1`, port 5173 by default). `npm test` watches tests; `npm run test:ci` runs them once. The full gate runs `lint`, `test:ci`, `build` (including homepage prerender), then `verify:build`, stopping on the first failure. Individual stages can also be run directly. CI uses the same gate and uploads `build/` as a seven-day artifact, with read-only repository permissions and no publish job.

Vite owns root `index.html`; `public/` holds copied assets, service pages, crawler files and CNAME. Keep those root-relative URLs and `build/` output for GitHub Pages. React/ReactDOM remain 16.9.0. The shared transform handles existing `.js` JSX with the classic React factory for browser builds, tests and prerender. The React plugin's optimizer list excludes its two unavailable automatic-JSX entrypoints; no compatibility shim or newer React runtime is shipped. The existing `.js` JSX adapter updates via Vite full-page reload on source edits, so in-page selections reset; state-preserving React Fast Refresh is not claimed. This development-only limitation does not affect the built site.

The postbuild script uses Vite's SSR loader and ReactDOMServer, validates content and the empty root, then writes the rendered HTML with its build year. It closes its temporary server in `finally`, with HMR/watch disabled and a separate `node_modules/.vite-prerender` cache to keep its optimizer files separate from an active dev preview. The browser hydrates the server markup. No production Node server is needed. The build verifier checks the four rendered documents, canonical/service content, crawler files and generated HTML/CSS asset references. `?beeDebug=1` still loads the separate debug chunk only when requested.

## Compatibility and lint policy

The existing Browserslist query remains in `package.json`; Autoprefixer applies it to CSS. JS uses an explicit conservative ES2015 syntax target instead of Vite's moving default. Native ESM/dynamic-import support is still required by Vite (Chrome64 / Firefox67 / Safari11.1 / Edge79 floor). On 2026-10-23 the resolved policy includes Chrome109+, Firefox121+, iOS16.6+, Safari18.5+ and UC15.5 (Chromium78), plus newer Edge/Opera/Samsung releases, all above that floor. Recheck this when changing the query or tooling; this is a build compatibility assessment, not physical-device proof or a new promise of support for every older browser/API.

`npm run lint` runs both `lint:eslint` and `lint:ui`; either failure stops verification. ESLint10 enforces core recommended checks (including native JSX component references), the two React Hooks rules, and the classic React factory rule. Oxlint1.89.0 supplements it with29 selected built-in React, jsx-a11y and import rules in `.oxlintrc.json`. These cover alt text, anchor content/validity, ARIA names/values/roles, headings/iframes, duplicate JSX props, unsafe external targets, render/state errors and import order. Warnings fail. CLI fixture tests verify invalid and valid inputs instead of assuming that exit0 on the site proves enforcement.

The old ESLint React/import/jsx-a11y packages still exclude ESLint10 from their declared peers; no forced peers, ESLint downgrade or new TypeScript toolchain is used. Oxlint uses independently implemented rules, so this is focused coverage restoration rather than byte-for-byte CRA preset parity. `forbid-foreign-prop-types`, `no-typos` and the deprecated `accessible-emoji` rule have no selected Oxlint equivalent; JSX scope/reference checks stay with ESLint, and Flow checks are not needed in this JavaScript site. The product's rendered accessibility tests remain complementary; no static rule set proves full accessibility.

Rule references: [Oxlint built-ins](https://oxc.rs/docs/guide/usage/linter/plugins.html), [rule reference](https://oxc.rs/docs/guide/usage/linter/rules.html), [former CRA3.3.1 selection](https://github.com/facebook/create-react-app/blob/v3.3.1/packages/eslint-config-react-app/index.js).

## Publishing and review

`npm run deploy` remains a manual command publishing `build/` to the `build` branch; its predeploy hook runs the full gate. Do not publish until the candidate is reviewed and deployment is explicitly authorized. Hosted CI and physical iPhone Safari are separate evidence: local checks do not establish either.

Current release/migration rationale, recovery snapshot and exact results: [CURRENT V2-034](agent-context/CURRENT.md) and [October 23 worklog](agent-context/worklog/2026-10-23.md).

# Agent context index

This folder is the continuity layer for work on Jason Yau's personal website.

- **Current baseline:** [stable-2026-10-04](../releases/stable-2026-10-04.md), source `master`, Pages `build:/`.
- [Stable cleanup and remaining follow-ups](worklog/2026-10-04.md).
- Earlier local September/October engineering records and design provenance: Git archive tag `archive/2026-10-04/codex-homepage-prerender-20261002`. These remain recoverable locally; old design experiments are not active tasks.
- Build acceptance: `npm run verify` runs lint, tests, production build/prerender and generated-output checks. See [development checks](../development.md). Pages must receive the verified output.
- Local review candidate: [V2-034 Vite/Vitest migration with V2-032/V2-033 fixes](CURRENT.md), [October 23 verification record](worklog/2026-10-23.md). The public stable baseline remains unchanged.

- [Current task and status](CURRENT.md) - V2-035 approved release in progress; V2-032/033/034 preserved.133tests pass, full audit0; publication pending CI/live checks.
- [Design and engineering decisions](DECISIONS.md)
- [Proposed coherent design direction](../design-direction.md)
- [Consulting UI elements and style board](../design/consulting-ui-elements.md)
- [Portfolio hosting and subdomain deployment research](../deployment-hosting-research.md)
- Research: [RS-001 mature personal-site reference study](../research/personal-site-reference-study.md)
- Research: [CR-001 consulting market and search-positioning study](../research/consulting-market-positioning-study.md)
- Chronological worklog: [2026-08-11](worklog/2026-08-11.md), [2026-08-12](worklog/2026-08-12.md), [2026-08-28](worklog/2026-08-28.md), [2026-08-29](worklog/2026-08-29.md)
- Product source: `src/`
- HTML entry and metadata: root `index.html`; copied static assets and service pages: `public/`
- Build and deployment configuration: `package.json`

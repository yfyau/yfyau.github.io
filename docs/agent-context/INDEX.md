# Agent context index

This folder is the continuity layer for work on Jason Yau's personal website.

- **Current baseline:** [stable-2026-10-04](../releases/stable-2026-10-04.md), source `master`, Pages `build:/`.
- [Stable cleanup and remaining follow-ups](worklog/2026-10-04.md).
- Earlier local September/October engineering records and design provenance: Git archive tag `archive/2026-10-04/codex-homepage-prerender-20261002`. These remain recoverable locally; old design experiments are not active tasks.
- Build acceptance: `npm run build` includes `scripts/prerender.js` through `postbuild`; Pages must receive the verified generated output.

- [Current task and status](CURRENT.md)
- [Design and engineering decisions](DECISIONS.md)
- [Proposed coherent design direction](../design-direction.md)
- [Consulting UI elements and style board](../design/consulting-ui-elements.md)
- [Portfolio hosting and subdomain deployment research](../deployment-hosting-research.md)
- Research: [RS-001 mature personal-site reference study](../research/personal-site-reference-study.md)
- Research: [CR-001 consulting market and search-positioning study](../research/consulting-market-positioning-study.md)
- Chronological worklog: [2026-08-11](worklog/2026-08-11.md), [2026-08-12](worklog/2026-08-12.md), [2026-08-28](worklog/2026-08-28.md), [2026-08-29](worklog/2026-08-29.md)
- Product source: `src/`
- Static shell and metadata: `public/`
- Build and deployment configuration: `package.json`

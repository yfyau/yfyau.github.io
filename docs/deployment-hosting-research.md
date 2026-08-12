# Portfolio hosting and subdomain deployment research

**Research date:** 2026-08-12  
**Status:** Recommendation ready; no deployment or DNS change performed

## Task contract

- **Outcome:** identify the cheapest, simplest, good-value way to publish the current personal site and leave a safe path for roughly ten other subdomain projects that may require backend services or a running server.
- **In scope:** current repository, build artifact, GitHub Pages state, public DNS state, static hosting, request-driven APIs, on-demand containers, managed always-on services, shared VPS options, and current official limits and pricing.
- **Non-goals:** publishing, changing branches, changing DNS, adding credentials, migrating the framework, or buying another domain.
- **Acceptance:** one recommended host, a clear fallback, an exact deployment outline, and explicit unresolved choices and risks.

## Verified current state

- This is a static Create React App build. `npm run build` emits `build/`; the current artifact contains 26 files totalling 2,453,072 bytes, and its largest file is 1,386,999 bytes. It is far below all candidate static-host limits.
- `package.json`, canonical metadata, Open Graph metadata, `robots.txt`, and `sitemap.xml` currently assume `https://yfyau.com/` as the canonical host.
- The public GitHub repository is `yfyau/yfyau.github.io`. GitHub's Pages API reports a built legacy deployment sourced from `master` with custom domain `yfyau.me` and HTTPS enforcement enabled. That source is the historical site, not the uncommitted redesign on `code`.
- Public DNS-over-HTTPS reports that `yfyau.com` is delegated to Cloudflare nameservers (`fatima.ns.cloudflare.com` and `lewis.ns.cloudflare.com`). The zone exists, but the apex has no published A answer and `www.yfyau.com` and `jason.yfyau.com` do not exist. `yfyau.me` returns NXDOMAIN.
- A subdomain under an already-owned domain does not require a separate domain purchase. The recurring unavoidable cost is only the existing `yfyau.com` registration.
- Jason clarified that roughly ten other candidate sites may need backend services. Their runtime, state, traffic, WebSocket/background-job, storage, uptime, and commercial requirements are not yet inventoried, so no single server platform can responsibly be selected for all ten today.

## Static-host comparison

| Option | Hosting cost for this site | Deployment and subdomain fit | Material limits or drawbacks | Verdict |
| --- | --- | --- | --- | --- |
| **Cloudflare Pages Free** | $0/month | Existing DNS is already on Cloudflare; Git integration supplies production and branch previews; a custom subdomain can be added in Pages and represented by a CNAME. | 500 builds/month, 20,000 files, 25 MiB per file, 100 custom domains/project. Git-integrated projects cannot later be converted in place to Direct Upload. | **Best overall value and recommended.** Static asset requests are free and unlimited, and DNS plus hosting stay in one control plane. |
| **GitHub Pages** | $0/month for this public repo | Existing repo and `gh-pages` dependency make it the fewest-new-account fallback. A subdomain uses a CNAME to `yfyau.github.io`; correctly configured custom domains support HTTPS. | Current Pages source and CNAME are stale. Published site limit 1 GB, soft 100 GB/month bandwidth, and soft 10 builds/hour. Preview deployments are less integrated unless a separate Actions workflow is added. | **Simplest fallback**, but the existing deployment must first be repaired and rebound from `yfyau.me`. |
| **Vercel Hobby** | $0/month for a personal, non-commercial site | Very easy CRA Git import, automatic preview deployments, HTTPS, and custom domains. | Hobby is restricted to personal/non-commercial use; usage caps apply and a Hobby project can pause after exhausting included usage. It adds a second platform while DNS remains on Cloudflare. | Excellent developer experience, but no useful advantage here over Cloudflare Pages. |
| **Netlify Free** | $0/month | Git deploys, previews, custom domains, SSL, and CDN are included. | The current Free plan has a 300-credit monthly hard limit; production deploys, bandwidth, and requests consume credits, and sites pause at the limit. | Functional but weaker value and predictability for this static portfolio. |

## Portfolio recommendation

Use **Cloudflare as the shared DNS, TLS, routing, and static-delivery front door**, not as a rule that every application must be static or use one runtime. Keep the redesigned personal site on Cloudflare Pages Free, then select backend compute per project only when its real workload is known.

Why it wins for this repository:

1. `yfyau.com` already uses Cloudflare nameservers, so DNS, certificate status, redirects, and hosting can be managed in one place.
2. The site remains purely static, so Cloudflare documents its asset requests as free and unlimited; no Worker or paid server is required.
3. Connecting the GitHub repository gives automatic builds and disposable preview URLs before a production hostname is attached.
4. The current 2.45 MB / 26-file build is tiny relative to the free limits.
5. It avoids repairing the obsolete `master` / `yfyau.me` GitHub Pages production path as the long-term delivery mechanism.

Keep **GitHub Pages** as the zero-cost fallback. Its limits are also ample for this site, and it can be restored with a publishing-source and CNAME correction if avoiding another hosting integration matters more than previews and centralized Cloudflare control.

This changes the earlier recommendation's scope, not its result for this repository: Pages remains the right host for the current static personal site, while the other projects retain an explicit route to real backend compute.

## Backend workload ladder

| Workload | Default platform | Current cost shape | Use when | Do not use when |
| --- | --- | --- | --- | --- |
| Static HTML/React/assets | Cloudflare Pages | $0; static asset requests are free and unlimited | No trusted server-side logic is required | Secrets or authoritative writes would have to run in the browser |
| Short HTTP API, webhook, auth callback, scheduled light work | Cloudflare Workers | Free: 100,000 requests/day and 10 ms CPU/invocation. Paid: $5/month base with 10 million requests and 30 million CPU-ms included | Request-driven JavaScript/TypeScript can be stateless or use managed bindings | A normal Linux process, unrestricted runtime, long local work, or persistent filesystem is required |
| Real-time coordination | Workers plus Durable Objects | Usage-based under Workers; WebSocket upgrade counts as a request and messages do not | Chat, game/session coordination, or many long-lived WebSockets fit the Durable Object model | An existing server assumes Vercel-style functions or an ordinary single-process WebSocket server without adaptation |
| Existing Docker/full runtime that may sleep between bursts | Cloudflare Containers on Workers Paid | $5 Workers base includes 25 GiB-hours memory, 375 vCPU-minutes, and 200 GB-hours disk; additional active use plus Worker/Durable Object usage is metered | A full Linux/runtime or container image is required and scale-to-zero is acceptable | The service must be permanently warm, scaling must be automatic without Worker lifecycle code, or local disk is the system of record |
| First conventional always-on server/container | Railway Hobby | $5/month minimum counts toward usage; then RAM $10/GB-month, CPU $20/vCPU-month, egress $0.05/GB, volume $0.15/GB-month | Fast Git/Docker deployment, logs, restart policy, volumes, TCP, and ordinary server semantics matter more than the lowest sticker price | Assuming ten always-on services will all cost $5; actual allocated/used resources accumulate |
| Several proven, lightweight, always-on services | One managed VPS with Docker and a reverse proxy | DigitalOcean: $12/month for 1 vCPU/2 GiB or $24 for 2 vCPU/4 GiB; Hetzner can have a lower base price in supported regions | Workloads are predictable, compatible, and worth consolidating, and Jason accepts patching, backups, monitoring, capacity management, and shared-failure risk | Requirements are still hypothetical, services need isolation/SLA, or there is no operator capacity |

Vercel Functions remain viable for request/response backends, but Vercel Hobby is personal/non-commercial and Vercel Functions cannot act as WebSocket servers. Render Free is a trial path, not a production portfolio baseline: free services sleep after 15 minutes, can take about a minute to wake, and share 750 monthly instance-hours across the workspace.

Cloudflare Containers are promising but newer and more platform-specific than Railway: container instances are controlled and scaled through Worker code. Run one representative pilot before choosing them for a family of existing server applications.

## Cost-aware operating rule

Do not buy one server now merely because ten projects might eventually need one.

1. Start each project as static plus Workers Free when that genuinely satisfies its authority and runtime needs.
2. Move the account to Workers Paid at roughly $5/month only when aggregate API use, Durable Objects, Queues, or an on-demand container justifies it.
3. Put the first project that truly needs an ordinary always-on process on Railway as a bounded pilot and measure its real RAM, CPU, storage, egress, cold-start, and operational requirements.
4. Consider a shared VPS only after at least three compatible always-on services have measured demand and their combined managed-platform bill clearly exceeds the VPS plus its operational cost.
5. Keep databases, object storage, queues, and secrets managed and separately backed up; a container or VPS filesystem is not automatically durable evidence or a database plan.

This ladder keeps the initial hosting bill at $0, makes the first backend step roughly $5/month rather than ten separate subscriptions, and preserves a migration path to ordinary servers without forcing server maintenance before it creates value.

## Subdomain topology

Use one first-level hostname per public product, such as `project.yfyau.com`. Prefer same-origin `/api/*` routing through Cloudflare when frontend and backend belong to the same product; this avoids unnecessary CORS and cookie complexity.

If a separate API hostname is required, prefer another first-level name such as `project-api.yfyau.com`. Avoid assuming that `api.project.yfyau.com` is free to operate: on a full Cloudflare DNS setup, Universal SSL covers the apex and first-level subdomains but not deeper names without an additional certificate option.

## Canonical-host choice

The hosting choice does not require a new domain, but the public hostname is a product decision:

- **Cleanest personal-site address:** `yfyau.com`, with `www.yfyau.com` redirected to it.
- **If a subdomain is explicitly required:** use `www.yfyau.com` for the conventional public site, or `jason.yfyau.com` only if the apex is intentionally reserved as a future multi-site hub.

`www` is technically a subdomain. A named host such as `jason.yfyau.com` costs the same, but makes the address longer. Whichever host is canonical must match `package.json`, canonical/Open Graph/JSON-LD metadata, `robots.txt`, and `sitemap.xml`; one hostname should 301-redirect to the other rather than serving duplicate canonical copies.

## Proposed implementation path (not executed)

1. Create a ten-project inventory with runtime/language, request pattern, expected traffic, latency and cold-start tolerance, authoritative state/database, background/cron work, WebSocket/TCP needs, persistent disk, region, uptime, and commercial status. Do not infer one backend from another project's needs.
2. Freeze and commit the accepted personal-site candidate on an agreed production branch. Do not deploy the current dirty working tree.
3. In Cloudflare Pages, import `yfyau/yfyau.github.io` with that exact production branch, build command `npm run build`, and output directory `build` (this older Create React App project does not emit `dist`).
4. Validate the generated `*.pages.dev` deployment first: HTML, JavaScript, CSS, WebP/JPEG/ICO MIME types, deep-link hashes, metadata, mobile/desktop rendering, and HTTPS.
5. Confirm the canonical-host choice. If it changes from `yfyau.com`, update every canonical/discovery surface together and rebuild before DNS cutover.
6. Add the selected custom domain in the Pages dashboard before creating or accepting its DNS record. Attach the redirect hostname separately.
7. Verify public DNS, TLS, HTTP-to-HTTPS behavior, the one-way 301 canonical redirect, asset MIME types, social card, `robots.txt`, and `sitemap.xml` from outside the local network.
8. Only after the new host is proven, remove or neutralize the obsolete GitHub Pages `yfyau.me` binding. Do not leave a dangling CNAME.
9. Select one backend-requiring project as the representative pilot. Use the lowest rung that satisfies its actual constraints, verify it end to end, record monthly resource use and operational friction, and only then reuse the recipe for compatible projects.

Rollback is simple: keep the last known-good Pages deployment and the previous DNS records documented before cutover; restore those records if production verification fails.

## Official evidence

- [Cloudflare Pages pricing](https://developers.cloudflare.com/pages/functions/pricing/)
- [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Cloudflare Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare Workers WebSockets](https://developers.cloudflare.com/workers/runtime-apis/websockets/)
- [Cloudflare Containers overview](https://developers.cloudflare.com/containers/)
- [Cloudflare Containers pricing](https://developers.cloudflare.com/containers/pricing/)
- [Cloudflare Universal SSL coverage](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/)
- [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [GitHub Pages HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [Vercel Hobby plan](https://vercel.com/docs/plans/hobby)
- [Vercel custom domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [Vercel limits](https://vercel.com/docs/limits)
- [Netlify pricing](https://www.netlify.com/pricing/)
- [Railway pricing](https://docs.railway.com/pricing)
- [Railway custom domains](https://docs.railway.com/networking/domains/working-with-domains)
- [Render free-service limitations](https://render.com/docs/free)
- [DigitalOcean Droplet pricing](https://www.digitalocean.com/pricing/droplets)
- [Hetzner June 2026 cloud pricing](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/)

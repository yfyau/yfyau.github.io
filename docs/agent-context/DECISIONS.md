# Decisions

## DEC-001: Modernize the bee as a non-blocking guide

- **Date:** 2026-08-11
- **Status:** Superseded by DEC-004
- **Owner:** Root agent, based on the user's redesign direction

### Context

The old site used a pure-CSS flying bee as a full-screen entry gate. It is the strongest original idea, but a timed, blocking intro makes content slower to reach and is less accessible.

### Decision

Keep the pure-CSS bee as the signature visual and interaction, but place it inside the main hero as an optional guide into the page. Clicking or keyboard-activating it will animate and move the visitor to the next section; direct navigation and scrolling remain available.

Use a warm editorial visual language with strong typography, generous space, technical annotations, and restrained playful motion. Keep the implementation dependency-light and statically deployable.

### Alternatives considered

- **Restore the original full-screen gate:** rejected because it delays access and depends on a timed transition.
- **Remove the bee for a conventional portfolio:** rejected because it discards the site's distinctive history.
- **Move immediately to a server-rendered stack:** deferred because the first redesign does not need server behavior and static hosting is simpler.

### Consequences and reversal conditions

The first release can remain on static hosting while other subdomains use different infrastructure. Reconsider the framework or hosting model only when a concrete dynamic requirement appears.

### Evidence

- Existing bee implementation: `src/components/Bee/`
- Existing entry route: `src/App.js`
- Historical static deployment: `master` branch and `package.json` deploy script

## DEC-002: Make the site career-first and mobile-first

- **Date:** 2026-08-11
- **Status:** Accepted
- **Owner:** Jason Yau

### Context

Jason clarified that the site's primary job is a concise career introduction and supplied a resume as the historical fact source. The resume predates his current role; his direct update establishes that he joined Okta as a Senior Software Engineer in July 2025. Mobile is the primary experience, with desktop treated as an expansion rather than the default composition.

### Decision

Lead with Jason's current role and engineering identity, followed by a concise experience timeline and representative outcomes. Use the resume for historical roles and metrics, and use Jason's direct update for the current Okta role. Do not infer or publish unprovided details about the work at Okta.

Keep bees as the dominant personal motif. Include snowboarding and gaming as small off-duty visual notes; do not turn them into competing themes. Explain the bee connection through the shared pronunciation of `Fung` in Jason's Chinese name (`風`, wind) and bee (`蜂`).

Implement the stylesheet mobile-first, adding wider-layout enhancements with `min-width` queries.

### Alternatives considered

- **Project-archive-first portfolio:** superseded because it overweights eight-year-old work relative to the site's current career purpose.
- **Full resume rendered as a webpage:** rejected because the site should be concise, visually distinctive, and easy to scan.
- **Career-only corporate profile:** rejected because it would discard the personal bee identity and off-duty texture.

### Consequences and reversal conditions

The supplied resume remains a private source and is not copied into the public site. A downloadable resume can be added later only after Jason approves the current document and its exposed contact details.

### Evidence

- User-provided current-role update: Okta, Senior Software Engineer, July 2025 to present.
- Supplied two-page resume, visually inspected on 2026-08-11.

## DEC-003: Keep the legacy build temporarily operable

- **Date:** 2026-08-11
- **Status:** Accepted as a temporary compatibility measure
- **Owner:** Root agent

### Context

The site still uses Create React App 3 and Webpack 4. On current Node, the production build failed with `ERR_OSSL_EVP_UNSUPPORTED` because the legacy bundler expects an older OpenSSL hashing provider. A framework migration and dependency modernization were outside this redesign's approved scope.

### Decision

Run the existing start and build scripts through Node with `--openssl-legacy-provider`. This restores the established build without adding a dependency or changing the generated site's runtime architecture.

Do not treat this compatibility flag as long-term modernization. Keep the dependency upgrade as a separate task with its own migration and regression budget.

### Alternatives considered

- **Migrate to a modern framework during the redesign:** rejected as material scope expansion.
- **Require an old Node installation:** rejected because it makes local and CI operation harder to reproduce.
- **Use a shell-specific environment variable:** rejected because a direct Node flag is portable across Windows and Unix-like environments.

### Consequences and reversal conditions

The site builds today, but the old dependency tree remains a material maintenance and security concern. Remove the flag when Webpack/Create React App is upgraded or replaced and the normal build passes on the supported Node version.

### Evidence

- Initial production build failed with `ERR_OSSL_EVP_UNSUPPORTED`.
- Production build passed after applying the Node compatibility flag.
- `npm ci` reported 231 advisories and numerous deprecated transitive packages.

## DEC-004: Replace the cartoon bee and strengthen the engineering claim

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Jason Yau

### Context

Jason's direct review of the first browser pass found two identity-level failures. The CSS bee looked like low-quality children's clip-art, and `feel workable` suggested software that merely reaches the minimum bar rather than software that is stable, well engineered, and trustworthy.

### Decision

Replace the CSS-drawn hero bee with original generated editorial artwork: a non-anthropomorphic honeybee in controlled flight, rendered in charcoal, amber, and muted teal with wind-like motion. CSS remains responsible for composition and restrained motion, not for drawing the primary brand image.

Change the hero claim to `I build software that holds up.` Support it with clearly attributed track-record signals around reliability, scale, diagnosis speed, and end-to-end ownership.

Simplify the off-duty section. Keep the personal bee-name connection, snowboarding, and games as concise signals rather than three competing cartoon scenes.

### Alternatives considered

- **Polish the existing CSS bee:** rejected because the underlying proportions, anthropomorphic face, and clip-art language are the problem.
- **Use a generic stock or macro bee photo:** rejected because the site needs an ownable, art-directed image tied to the wind/bee concept.
- **Keep `workable` and explain it in body copy:** rejected because the first-screen claim must be strong without repair text.

### Consequences and reversal conditions

The hero now depends on one optimized raster asset, so responsive cropping, file size, and alt text become verification requirements. Revisit the asset only if it does not remain legible at mobile size or makes the page materially slow.

### Evidence

- Jason's direct browser review on 2026-08-12.
- Generated hero artwork retained and optimized as `src/images/bee-hero-v2.webp` (90,606 bytes) after visual inspection.
- Focused React test and production build passed on 2026-08-12.
- Responsive production-browser review passed at 390 x 844 and 1102 x 994; the mobile first viewport includes both the headline and bee artwork.

## DEC-005: Treat mobile readability as part of the visual standard

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

Revision 2 established the intended editorial composition, but source and rendered-screen review found supporting text between roughly 8 and 11 px across proof labels, experience detail, personal copy, contact copy, and footer metadata. The result looked precise at a glance but imposed unnecessary reading effort on the primary mobile audience.

### Decision

Preserve the display typography, image, color system, section order, and restrained density. Raise body copy to approximately 14–16 px, utility labels to approximately 10–12 px, and action/navigation text and hit areas to a deliberate mobile baseline. Add consistent keyboard focus treatment and a branded monogram favicon.

Do not respond by enlarging every element uniformly or turning the editorial layout into a generic accessibility template. Hierarchy remains pronounced; small type is reserved for genuinely secondary metadata.

### Alternatives considered

- **Keep the current sizes because the layout is visually clean:** rejected because visual cleanliness does not compensate for uncomfortable reading on the primary device class.
- **Apply browser-wide text scaling:** rejected because it would distort the display hierarchy and produce uncontrolled wrapping.
- **Redesign the complete visual system again:** rejected because the current identity is coherent; the issue is execution quality at smaller sizes.

### Consequences and reversal conditions

Some sections will become taller, particularly experience. This is acceptable for a concise one-page career site if scanning and line length remain controlled. Revisit individual sizes only with rendered breakpoint evidence, not by returning body text to sub-12-pixel defaults.

### Evidence

- Rendered mobile contrast audit covered 19 representative text/background roles. Seventeen already passed WCAG thresholds.
- The two failures were corrected and remeasured: current-role date increased from 3.91:1 to 5.59:1; contact section label increased from 3.75:1 to 6.16:1. Both exceed the 4.5:1 small-text threshold.

## DEC-006: Prove responsive edges and make the static site shareable

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The initial responsive checks covered 390 px mobile and 1102 px desktop, but not the exact minimum-width and desktop-grid transition edges. A 320 x 720 browser check exposed horizontal scrolling caused by a fixed 20 rem shell minimum after the vertical scrollbar reduced the actual content width. A 1024 x 768 check showed the hero growing to 994 px, pushing metrics and actions below the initial laptop viewport. The static shell also had no canonical URL, social image, structured Person data, robots file, or sitemap.

### Decision

Remove the fixed shell minimum and let the mobile layout contract to the actual client width. Add a short-desktop media query that tightens the existing hero typography and vertical rhythm only when the split layout is active and viewport height is at most 52 rem; do not change the standard desktop or tablet composition.

Add static discovery metadata for the intended canonical `https://yfyau.com/` home: Open Graph and Twitter large-image metadata, JSON-LD Person data using only confirmed facts, `robots.txt`, and a one-page sitemap. Use an original, text-free, wide bee image so sharing remains visually consistent without relying on generated typography.

### Alternatives considered

- **Keep the 20 rem minimum because 320 px is the documented lower bound:** rejected because scrollbar width and browser chrome can reduce the actual layout viewport below the nominal device width.
- **Shrink the standard desktop hero everywhere:** rejected because the existing composition is balanced at normal desktop heights; the defect is height-specific.
- **Use the portrait hero directly as the social image:** rejected because social previews expect a wide crop and would remove important subject detail unpredictably.
- **Add analytics or third-party SEO tooling:** rejected as unnecessary infrastructure and outside the read-only static-site behavior.

### Consequences and reversal conditions

The source now includes a second project-bound raster asset and canonical metadata that assumes the eventual public home is `yfyau.com`. If deployment chooses another canonical host, update the canonical, social, robots, sitemap, and structured-data URLs together before publishing.

### Evidence

- Production browser at 320 x 720: client width 305 px, document width 305 px, no horizontal overflow, broken images, or console errors.
- Production browser at 1024 x 768: hero 769 px high and actions end at 744 px; no horizontal overflow, broken images, or console errors.
- Regression checks at 768 x 900 and 1102 x 994 preserve their intended responsive compositions.
- `public/og-card.png`: 1731 x 909, 1,386,999 bytes; served by the local static build as `image/png` with HTTP 200.
- Final build parsing confirmed canonical, Open Graph, Twitter card, JSON-LD Person, robots, and sitemap values.

## DEC-007: Make semantic names map to real accessibility objects

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The visual UI used `aria-label` on three generic `div` elements for track-record metrics, the skill rail, and off-duty interests. Generic containers without a supporting role may not expose those names consistently. The skip link targeted `<main>`, but the target was not programmatically focusable and native hidden-fragment behavior varies across browser and assistive-technology combinations.

### Decision

Keep the visual markup and reading order, but map each label to an appropriate semantic object: a named `group` for the metrics, a named `aside` for skills, and a named `list` with two `listitem` interests. Make `<main>` programmatically focusable and explicitly focus it when the skip link is activated.

Do not add redundant ARIA where native HTML already supplies the right semantics, and do not change heading levels that already form a valid H1 → H2 → H3 outline.

### Alternatives considered

- **Leave the generic labels in place:** rejected because the labels are not guaranteed to be exposed as named accessibility objects.
- **Turn every visual section into a landmark:** rejected because excessive landmarks create navigation noise.
- **Rely only on native fragment focus:** rejected because the explicit skip-link purpose is important enough to make deterministic.

### Evidence

- Production DOM role queries find one main landmark, one complementary landmark, one named `Selected track record` group, and one named `Interests outside work` list.
- No generic named divs, duplicate IDs, empty links, unnamed buttons, images without alt text, invalid label references, or hidden focusable descendants remain in the audited production DOM.
- A document-mounted React test activates the skip link and proves `document.activeElement` becomes `<main>`.

## DEC-008: Preserve source meaning when compressing career evidence

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The detailed BrokerBay outcome says root-cause analysis time was reduced by 50%, while the compressed hero label said `50% faster diagnosis`. A 50% time reduction is not mathematically equivalent to a 50% speed increase. The hero also placed prior-role metrics immediately below the current Okta identity without explicitly saying they came from earlier roles. The current-role card explained its lack of public detail instead of reinforcing Jason's engineering standard.

### Decision

Keep the source numbers unchanged and compress them without changing their mathematical meaning: `50% less RCA time`. Name the group `Prior-role track record` so the metrics cannot reasonably be read as current Okta outcomes.

Keep the current Okta entry free of inferred responsibilities or achievements. Replace defensive absence-of-detail copy with a statement of personal working standard: clear ownership, careful systems thinking, and reliable delivery.

### Alternatives considered

- **Keep `faster diagnosis` as friendlier language:** rejected because it changes the quantitative meaning.
- **Attribute all three hero metrics to BrokerBay in the label:** not required because the detailed timeline immediately supplies that provenance; `prior-role` is concise and accurate across the group.
- **Add generic identity/security responsibilities to make Okta fuller:** rejected because Jason supplied role and start date, not publishable responsibility details.

### Evidence

- The detailed source sentence remains `cut root-cause analysis time by 50%`; the hero now renders `50% / LESS RCA TIME`.
- Production checks at 320 px show three equal 88 px proof columns with no overflow and the old `faster diagnosis` phrase absent.
- The new current-role note fits the 320 px card and the 1102 px three-column card without overflow or console errors.

## DEC-009: Use link semantics for the bee's page navigation

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The hero bee was implemented as a button even though its only outcome is navigation to the Experience section. Production activation scrolled correctly but left the URL hash empty, so assistive technology received action semantics while browser history and shareable page state received no destination.

### Decision

Render the bee portrait as an anchor with `href="#experience"`. Preserve the controlled flight animation by preventing the immediate default jump, then after the existing delay push `#experience` only when the hash differs and scroll the section with smooth or reduced-motion behavior as appropriate.

Suppress activation while the flight animation is already running. After it settles, allow the link to scroll again but do not create duplicate history entries when `#experience` is already current.

### Alternatives considered

- **Keep button semantics because JavaScript performs the scroll:** rejected because the user outcome is navigation, not an in-place command.
- **Use a plain anchor with immediate native jump:** rejected because it discards the intentional bee-flight transition.
- **Replace history on every activation:** rejected because the first navigation should be represented in browser history while repeated activation should remain idempotent.

### Evidence

- Before the change, production rendered `BUTTON`, no `href`, and an empty hash after scrolling Experience to 16 px.
- After the change, production renders `A` with `href="#experience"`; the hash remains empty during the animation, becomes `#experience` at the navigation point, and Experience settles at 16 px with no console error.
- A reduced-motion interaction test proves default prevention, `behavior: auto`, one scroll for rapid double activation, one initial `pushState`, later re-scroll after the animation, and no duplicate `pushState` for the current hash.

## DEC-010: Expose overflowing static content only when it needs interaction

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The skills rail hid its scrollbar and had no visible continuation cue or keyboard tab stop. Production measurements showed that only two of eight skills were fully visible at 320 px, three at 390 px, and four at 768 px. Even the 1102 px check initially hid the final item. The content could be swiped, but that behavior was undiscoverable and sighted keyboard users had no direct focus target for the overflow region.

### Decision

Keep the restrained editorial rail and horizontal reading model. When `scrollWidth` exceeds `clientWidth`, render a small `SWIPE / SCROLL` cue, connect it to the named skills list with `aria-describedby`, and add `tabindex=0`. Add a clear focus-visible outline, proximity scroll snapping, contained inline overscroll, and momentum touch scrolling.

Measure overflow from the actual rendered list with a resize observer plus a window-resize fallback. When every item fits, remove the cue, description, and tab stop rather than presenting a false interaction or hard-coding a viewport breakpoint.

### Alternatives considered

- **Keep the hidden scrollbar as a familiar touch pattern:** rejected because measured content was substantially hidden and the affordance was not discoverable.
- **Always show the cue and tab stop:** rejected because at wide desktop sizes all eight items fit, making both signals unnecessary and misleading.
- **Hide the cue at a fixed desktop breakpoint:** rejected because overflow depends on rendered text, padding, scrollbar reservation, and available width rather than the nominal viewport alone.
- **Wrap the skills onto multiple lines:** rejected because it would turn the compact working-set rail into a larger content block and weaken its deliberate ticker-like rhythm.

### Evidence

- Before the change, hidden horizontal content measured 710 px at 320, 640 px at 390, 372 px at 768, and 108 px at 1102; the list had no tab-index or visible scroll cue.
- Final production checks at 320, 390, and 768 show the cue, `aria-describedby`, and `tabindex=0`; the final item becomes fully visible after horizontal scrolling, and page-level overflow remains false.
- Final checks at 1102 and 1280 show all eight items fit and the cue, description, and tab stop are absent.
- A mounted-DOM test supplies overflowing dimensions and proves the interaction state is rendered only for an overflowing skills list.

## DEC-011: Make persistent navigation readable and contact copy evergreen

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The production primary navigation met the 44 px target-size requirement but rendered its labels at only 10 px. A direct 280 px viewport measurement showed enough horizontal room to increase the type without removing any destination. Separately, the contact section closed a career-first portfolio with `Fresh domain, same person` and `THE NEW HOME`: accurate launch notes, but weak permanent positioning that would become stale as soon as the site stopped being new.

An end-to-end audit measured the page at 8.5 mobile viewports at 390 x 844 and found no broken content or repeated sections. A full-page screenshot did repeat the hero, but fixed-viewport section captures proved this was screenshot stitching rather than a rendered-site defect. Header link bounds likewise disproved apparent clipping in the scaled screenshot.

### Decision

Raise primary navigation labels to a 12 px floor at every responsive size while preserving existing target height, destinations, and restrained uppercase treatment.

Replace the launch-era contact framing with `OPEN CHANNEL` and a concise evergreen invitation for thoughtful products, hard systems, or a good engineering conversation. Keep email as the primary route and GitHub as the longer public trail. Do not add a form, social network list, availability claim, or invented consulting proposition.

### Alternatives considered

- **Leave 10 px labels because targets are 44 px:** rejected because target size solves operability, not text readability.
- **Remove one mobile navigation destination to make room:** rejected because direct 280 px evidence showed all three 12 px labels fit.
- **Make the header sticky or add an active-section indicator:** deferred because the audit did not prove a navigation-orientation failure and either change would materially alter the browsing rhythm.
- **Keep the domain-launch story as personality:** rejected because it describes a temporary implementation event rather than Jason's enduring professional value.
- **Add a contact form or availability badge:** rejected as unnecessary infrastructure or an unconfirmed factual claim.

### Evidence

- Before the change, all three production navigation labels measured 10 px at 280, 320, 360, and 390 px.
- Final production checks at 280, 320, 390, 768, and 1102 px measure every label at 12 px and every target at 44 px. All links remain fully visible, header overflow is false, and page-level overflow is false.
- The new contact paragraph wraps to 154.8 px high in the narrowest 224.8 px copy area and 129 px high in the 279 px desktop column without overflow.
- Desktop production renders `OPEN CHANNEL`; source and render assertions prove `Fresh domain, same person` and `THE NEW HOME` are absent.

## DEC-012: Keep career and contact essentials available without JavaScript

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The discovery metadata already included canonical, Open Graph, Twitter, structured-data, image-dimension, and image-alt fields, so rewriting it would have added churn rather than value. The audit instead found that the web-app manifest's full name contained visible replacement characters and that disabling or failing JavaScript reduced the career site to `This site needs JavaScript enabled to run.`

For an otherwise static, career-first personal site whose central promise is software that holds up, losing Jason's identity and every contact route when the application bundle fails is below the intended resilience baseline. A complete duplicate of the React portfolio would create two content sources that could drift.

### Decision

Keep React as the full interactive experience and add a deliberately bounded `<noscript>` fallback containing only Jason's current Okta identity, core headline, concise product/platform/mobile positioning, email, and GitHub link. Style it from the emitted production CSS with the same paper, charcoal, amber, teal, type pairing, and geometric field language as the main site.

Repair the manifest name with an encoding-safe JSON Unicode escape and align the manifest, initial body, and React paper backgrounds at `#f2eee4`. Guard an empty `#root` from adding a possible blank viewport after the fallback. Add focused tests against the source static artifacts so encoding and essential content cannot silently regress.

### Alternatives considered

- **Rewrite already-complete social metadata:** rejected because the current canonical, Open Graph, Twitter, JSON-LD, dimensions, and alt text were present and coherent.
- **Keep the generic JavaScript requirement:** rejected because it removes the site's most important identity and contact value during a common failure mode.
- **Duplicate the full portfolio in `<noscript>`:** rejected because career history, metrics, and personal content would acquire a second manually synchronized source of truth.
- **Add a service worker or migrate frameworks:** rejected as a material architecture expansion unrelated to the proven fallback gap.
- **Inline all fallback CSS:** rejected because the production stylesheet is already linked before the markup and keeping styles in the canonical CSS avoids a separate visual-maintenance surface.

### Evidence

- Before the change, `public/manifest.json` rendered the full name as `Jason Yau ??Senior Software Engineer`, and `<noscript>` contained only the generic JavaScript requirement.
- Two new static-artifact tests parse the manifest, assert the exact decoded name and background, require current identity/contact links, require fallback styling and the empty-root guard, and reject the generic message; the full 2-suite, 7-test run passes.
- The production build passes. Parsing emitted artifacts confirms the decoded em-dash name, no replacement markers, matching background, all essential fallback strings and links, CSS-before-fallback ordering, fallback selectors, and the empty-root guard.
- Interactive production checks at 390 and 1102 px confirm React still renders, the fallback is absent, the root is non-empty, body color matches, images load, adaptive skills behavior remains correct, and page-level overflow is false.
- The available browser surface cannot disable JavaScript, so no separate rendered fallback screenshot is claimed.

## DEC-013: Preserve resume-backed claims and name navigation destinations directly

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The site had been built from the supplied resume plus Jason's explicit update that he became an Okta Senior Software Engineer in July 2025. Because a career-first portfolio loses its purpose if contact details or quantified outcomes are copied incorrectly, the private source needed a complete claim-by-claim audit before further copy refinement.

The resume was created in April 2025 and still lists BrokerBay as present, so it cannot support or contradict the later Okta transition. It does independently support the public email, prior employers, role sequence, education, technical areas, and five quantified outcomes. The primary navigation still labelled the Contact destination `Hello`, which was personable in layout but ambiguous when read as an isolated link.

### Decision

Preserve the current career content and its deliberately compressed year-level chronology because every published prior-role claim maps to the resume. Continue treating the Okta role and July 2025 start as user-supplied current truth. Do not publish the resume, phone number, or more detailed private contact information.

Rename the primary `Hello` link to `Contact` so its purpose matches the section and remains clear out of visual context. Preserve the 12 px text floor, 44 px targets, and all three destinations; do not shorten another label or reduce readability to make it fit.

### Alternatives considered

- **Rewrite career copy merely because the source was reopened:** rejected because the audit found no contradiction or unsupported quantified claim.
- **Publish exact resume months for every prior role:** rejected because the site intentionally uses a concise year-level timeline and the private resume cannot establish BrokerBay's post-April 2025 end month without inference.
- **Change the email to a similar-looking handle from conversational transcription:** rejected because the rendered PDF explicitly confirms `jason.yfyau@gmail.com`.
- **Keep `Hello` for personality:** rejected because primary navigation should identify its destination without depending on surrounding art direction.
- **Publish or link the supplied resume:** rejected because it contains a phone number and no sanitized public copy has been approved.

### Evidence

- `Resume_YatFung_YAU.pdf` is a two-page A4 source last modified April 24, 2025. Text extraction and visual review agree on email, role chronology, education, technical skills, and all five public metrics.
- Direct comparison confirms: 99% to 99.99% PubSub reliability, over 4.5 million daily events, 50% less root-cause analysis time, 20% lower CI cost, and 55% higher trading-app frame rate.
- The final 2-suite, 7-test run passes and asserts both navigation destinations and labels.
- Production checks at 280, 320, 390, 768, and 1102 px show all three 12 px labels inside 44 px targets with no clipping or page/header overflow. At 280 px, `Contact` ends at 249.3 px inside a 265 px client.
- A production click on `Contact` produces `#contact`, places the Contact section 16 px from the viewport top, and does not create horizontal overflow.

## DEC-014: Use one site-specific editorial language system

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The primary headline, career proof, current-role copy, bee/name story, and contact invitation had become specific to Jason. A rendered microcopy audit still found four secondary phrases that could move unchanged to almost any portfolio: `ENGINEERED BY NATURE`, `THE CONCISE VERSION`, `A LITTLE MORE HUMAN`, and `Designed with intent. Built to stay clear.` Their generic voice weakened the otherwise coherent field-study and editorial system.

The underlying sections already supplied stronger, truthful vocabulary: honeybee flight, selected career outcomes, Fung/wind, snowboarding, games/play, and the bee as the site's visual frame. No new personal claim or invented hobby detail was required.

### Decision

Replace only those four secondary phrases:

- `HONEYBEE / FLIGHT STUDY` for the hero specimen caption;
- `SELECTED WORK / OUTCOMES` for the career section's desktop index;
- `WIND / SNOW / PLAY` for the personal section's desktop index;
- `Wind in the name. Bee in the frame.` for the footer signature.

Keep the strong primary headings, factual career copy, established section structure, and no-JavaScript fallback wording unchanged. Treat the microcopy as field notes and editorial indexing, not as extra marketing slogans.

### Alternatives considered

- **Rewrite every label for stylistic consistency:** rejected because most existing labels were already specific and useful; broad rewriting would add churn.
- **Keep `ENGINEERED BY NATURE` as a bee pun:** rejected because it is a widely portable phrase, while the field-study framing is already visible in the artwork.
- **Add a longer personal manifesto to the footer:** rejected because the footer needs a compact signature, not another content section.
- **Name a specific game in `WIND / SNOW / PLAY`:** rejected because the conversational transcription was ambiguous and no exact title should be inferred.

### Evidence

- The source and test suite require all four new phrases and reject all four previous phrases; the final 2-suite, 7-test run passes.
- The production build passes with a slightly smaller main bundle and no copy-related compiler issue.
- At 320 px, the `FUNG / WIND` name note and `HONEYBEE / FLIGHT STUDY` remain on one line each with about 23 px separation and no caption overflow.
- At 390 px, the copyright, signature, and back-to-top items stack without any two-dimensional intersection or footer overflow.
- At 768 and 1102 px, every right-side section tag displays without overlap, and the three-column footer retains a centered signature with no collision.
- No checked width has page-level overflow or a broken image, and production text contains none of the removed phrases.

## DEC-015: Cap reading measure without boxing in the wide-screen art

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

Desktop support had been visually verified only through 1102 px. At 1440 px the composition still read well, but direct 1920 and 2560 px measurements exposed two scaling defects:

- career summaries and outcomes expanded to 889 and 1245 px, placing 101 to 103 characters on a single line;
- the portrait's intrinsic 2:3 ratio contributed to desktop grid sizing, growing a 1920 x 1080 hero to 1401.6 px and a 2560 x 1440 hero to 1857.6 px.

A global centered `max-width` would have corrected line length by shrinking the entire visual world, but would discard the deliberate split-screen bee art and full-bleed dark, paper, teal, and amber fields.

### Decision

At 80 rem and wider, increase horizontal section, header, and skill-rail gutters with a viewport calculation that preserves an approximately 1280 px content field. Keep each section's background full width and keep the hero itself split across the full display.

On desktop, absolutely position the already-covered bee image inside its portrait frame so its intrinsic ratio cannot set grid height. At 80 rem and wider, cap hero heading and introduction scale, reduce vertical padding and proof/action spacing, and cap the action row at 40 rem to align with the proof group. Preserve the existing short-height compact rule as the later, stronger override.

### Alternatives considered

- **Apply `max-width` and auto margins to every section:** rejected because section backgrounds and the full-bleed editorial composition should continue to the viewport edge.
- **Cap only individual paragraphs:** rejected because career grid, identity panel, contact column, off-clock cards, header, and skill rail would continue drifting to unrelated measures.
- **Crop the source image or remove its dimensions:** rejected because the intrinsic dimensions support loading stability and the correct fix is to remove the image from desktop grid sizing, not its metadata.
- **Leave the wide hero taller than the viewport as intentional drama:** rejected because height scaled directly with image width and reached 1857.6 px on a 1440 px-high display rather than following an intentional composition rule.
- **Apply the wide compaction to mobile/tablet:** rejected because their proven title-art-evidence sequence and mobile-first reading rhythm solve a different problem.

### Evidence

- Before the change, the representative 101-character career summary measured 640.5 px/two lines at 1440, 889.3 px/one line at 1920, and 1244.9 px/one line at 2560. Afterward it remains 631.6 px/two lines at all three widths.
- Before the change, hero height measured 1059.6, 1401.6, and 1857.6 px at 1440 x 900, 1920 x 1080, and 2560 x 1440. Afterward it measures 900.8, 1080.8, and 1440.8 px.
- A settled 1920 production check shows proof opacity 1, actions opacity 1, proof bottom 972.8 px, and actions bottom 1048 px inside the 1080.8 px hero.
- Production screenshots at 1920 show the full hero, bee, proof, actions, field caption, readable career heading, and current Okta card in balanced full-bleed compositions.
- Regression checks at eight widths from 390 through 2560 px preserve action bounds, image cover, skill affordance state, and zero page overflow or broken images. The final 2-suite, 7-test run and production build pass.

## DEC-016: Remove reduced-motion waiting as well as movement

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The global reduced-motion override already collapsed animation and transition durations to 0.01 ms and changed scrolling to automatic. It did not reset authored delays. The hero proof and action groups therefore remained initially hidden for 340 and 420 ms respectively before snapping into their final states. That removed most movement but preserved an unnecessary content wait for the users who had explicitly requested less motion.

### Decision

Inside the existing `prefers-reduced-motion: reduce` query, set both `animation-delay` and `transition-delay` to `0ms !important` alongside the existing duration, iteration-count, and scroll-behavior overrides. Preserve the normal-motion stagger and the bee navigation's existing JavaScript reduced-motion branch.

Keep the short non-zero duration instead of replacing every animation with `none`; this preserves the established final-state and event behavior while removing both perceptible travel and the hidden-content delay.

### Alternatives considered

- **Leave the delays because movement is already near-instant:** rejected because delayed hidden content is still a motion-related timing cost and creates a visible snap after a pause.
- **Remove all hero entrance animation for every user:** rejected because the restrained stagger remains intentional in normal motion and production verification shows it settles cleanly.
- **Solve only the bee interaction in JavaScript:** rejected because the defect is in the global CSS entrance system; the bee interaction already selects automatic scrolling and a zero navigation delay when reduced motion is requested.
- **Use `animation: none` globally inside the media query:** rejected because zero-delay, near-zero-duration animation preserves predictable end-state semantics with less risk to existing interaction behavior.

### Evidence

- A new static-artifact test requires the reduced-motion media query, zero animation and transition delays, 0.01 ms animation and transition durations, one iteration, and automatic scrolling.
- The final test run passes 2 suites and 8 tests without React warnings; the existing interactive test continues to prove reduced-motion bee navigation, rapid-repeat suppression, and history behavior.
- The production build passes. Its minified CSS contains the reduced-motion query and all six timing/scroll overrides.
- Normal-motion production at 390 x 844 retains `rise-in` with 0.34 s and 0.42 s delays plus 0.8 s durations. Both groups settle at opacity 1, with no horizontal overflow or broken images.

## DEC-017: Keep primary navigation available through the long mobile story

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The career-first page is intentionally substantial: at a 390 x 844 viewport the rendered document is 7,239 px tall, or more than eight viewport heights. The primary Experience, About, and Contact navigation previously used an absolutely positioned header, so it disappeared as soon as the reader moved beyond the hero. Returning to another section required reaching the footer or manually scrolling back to the top.

The existing header already had the right visual treatment for a persistent surface: a compact wordmark, direct labels, 44 px targets, a translucent paper background, a border, and backdrop blur. Adding a second floating control would duplicate navigation and weaken the editorial restraint.

### Decision

Keep the single existing header and change its positioning from absolute to fixed. Define responsive header-offset tokens and use them as each section's `scroll-margin-top`, leaving approximately one rem of visible breathing room below the header after an anchor activation.

Preserve the initial hero composition, header content, link names, target sizes, smooth-scroll behavior, and reduced-motion override. Do not introduce a hamburger, scroll-direction animation, active-section tracker, or second mobile navigation layer.

### Alternatives considered

- **Leave navigation at the top only:** rejected because the unusually long mobile story makes all three primary destinations unavailable for most of the reading journey.
- **Add a floating menu button:** rejected because it duplicates a complete navigation system and adds an unexplained interaction mode.
- **Make the header sticky in normal flow:** rejected because inserting the header into flow would add its height on top of the one-viewport desktop hero and disturb the established title/art composition.
- **Hide or collapse the header while scrolling:** rejected because that requires scroll-state logic, introduces extra motion, and makes availability less predictable.
- **Reduce the career content solely to shorten the page:** rejected because the career history is the site's main purpose and its claims have already been verified against the supplied resume.

### Evidence

- A focused static-artifact test requires the mobile and desktop offset tokens, fixed header position, and section use of the shared offset; the final run passes 2 suites and 9 tests without React warnings.
- The production build passes with only a 28-byte gzip CSS increase from revision 15.
- Real About activations at requested widths of 280, 320, 390, 768, 1024, and 1440 px keep the header at viewport top, retain every primary link within the client width, introduce no page-level overflow or broken images, and leave 15.7 to 19.1 px between the header and destination.
- Real Experience and Contact activations at 390 x 844 update to the correct hashes and leave 16.1 and 16.4 px of clearance respectively. Mobile and desktop screenshots show the paper header remaining legible over the dark, paper, and amber chapters without creating another visual system.

## DEC-018: Let the persistent header name the current chapter

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal
- **Supersedes:** DEC-017 only where it deferred an active-section tracker

### Context

DEC-017 made the existing primary header persistent and deliberately deferred a current-section tracker until the simpler navigation change could be judged on its own. The follow-up production audit then exposed a specific orientation gap: after manually scrolling to About, all three links had no `aria-current` value and all three underline transforms remained collapsed. The header stayed available but did not communicate which chapter the reader was viewing.

The existing hover/focus underline already supplied a coherent visual vocabulary. A location state could reuse that line and the established teal accent without adding a progress bar, new icon, URL mutation, or separate motion system.

### Decision

Track the Experience, About, and Contact sections against a reading line at 28% of the viewport, never above the fixed header. Mark exactly the section containing that line as current. Apply `aria-current="location"` to its existing navigation link, extend the existing one-pixel underline, and use the existing teal token. Mark no destination while the reader is still in the hero.

Drive the state from rendered section geometry on scroll and resize. Keep manual scrolling independent of URL history; direct link activations retain the browser's existing hash behavior. Use the global reduced-motion duration override for the small inherited color/underline transition.

### Alternatives considered

- **Rely on clicked-link focus:** rejected because focus can remain on a previous destination after the reader manually scrolls elsewhere, and it provides no state for a reading journey begun by scrolling.
- **Update the URL hash on every section transition:** rejected because passive reading should not create history or deep-link changes without an explicit navigation action.
- **Add a progress bar or numeric scroll percentage:** rejected because it adds a second orientation language and says less about the content chapter itself.
- **Use only color:** rejected because the existing underline adds a non-color cue and already belongs to the header's interaction language.
- **Mark Experience while the hero is visible:** rejected because none of the three named destinations is the current chapter at the top of the page.

### Evidence

- Before the change, a manual scroll to About at 390 x 844 produced no `aria-current` values and three collapsed underline transforms.
- A new mounted-DOM test drives the geometry from About to Contact and proves exactly one `aria-current="location"` value moves to the correct link; the final run passes 2 suites and 10 tests without React warnings.
- The production build passes. The current-location behavior adds 265 bytes gzip to main JavaScript and 37 bytes gzip to CSS.
- Manual About checks at requested widths of 280, 320, 390, 768, 1024, and 1440 px show exactly one current link, a fully extended underline, the resolved teal `rgb(24, 66, 63)`, every nav link inside the client width, no hash mutation, no overflow, and no broken images.
- At 390 px, manual traversal through Hero, Experience, About, Contact, and back to Hero selects none/Experience/About/Contact/none as intended. Real Experience and Contact clicks produce `#experience` and `#contact`, keep 16 px destination clearance, and select the matching current link.

## DEC-019: Make the social card self-identifying

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The Open Graph and Twitter metadata already supplied correct canonical URLs, titles, descriptions, type, dimensions, and alt text. The linked 1731 x 909 artwork was visually strong but composed with the realistic bee on the right and a large intentional copy field on the left that remained completely empty. Viewed independently in a message or social feed, it read as an unfinished background image and did not identify Jason, his role, his domain, or the site's primary statement.

The website already has one concise, tested, and user-approved claim: `I build software that holds up.` Completing the open copy field with that line and confirmed identity facts strengthens the same art direction without inventing a marketing slogan or another visual system.

### Decision

Use the built-in image-generation workflow with the existing card as the edit target and visual anchor. Preserve the mature realistic honeybee, dark-teal wind trails, charcoal field, amber light, and 1.91:1 composition. Add exactly four text groups: `JASON YAU`, `I BUILD SOFTWARE THAT HOLDS UP.`, `SENIOR SOFTWARE ENGINEER`, and `YFYAU.COM`, using a high-contrast editorial serif plus disciplined monospaced support type.

Save the accepted result non-destructively as `public/og-card-v2.png`, keep `public/og-card.png` as the rollback source, and update only Open Graph/Twitter image URLs and alt descriptions. Add artifact coverage for both references, removal of the old declared URL, exact dimensions, PNG signature, and identity-bearing alt text.

### Alternatives considered

- **Keep the text-free card:** rejected because the empty left copy field makes the image dependent on surrounding metadata and visibly incomplete as a standalone share.
- **Add text with HTML/CSS at runtime:** rejected because social crawlers consume the static raster asset rather than rendering the website composition.
- **Use the vertical hero image directly:** rejected because its 2:3 framing is unsuitable for `summary_large_image` and would crop the signature bee composition unpredictably.
- **Replace the original file in place:** rejected because a versioned sibling keeps rollback simple and makes metadata selection explicit.
- **Add Okta or detailed career metrics to the card:** rejected because an employer logo is unnecessary, detailed claims reduce thumbnail legibility, and the concise identity hierarchy is stronger.

### Evidence

- Visual inspection of the original confirmed a complete bee/wind atmosphere on the right and a large unused copy field on the left.
- The accepted built-in imagegen candidate is 1731 x 909 and contains all four required text groups exactly once, correctly spelled, with no extra text, watermark, second bee, cartoon treatment, or unrelated logo. The realistic subject, lighting, trails, and palette remain coherent with the website.
- A 600 x 315 browser rendering keeps the name, three-line primary statement, role, domain, and bee legible within safe margins.
- The final test run passes 2 suites and 11 tests without React warnings. The production build succeeds; emitted HTML contains exactly two v2 URL references, zero old declared image URLs, two identity-bearing alt descriptions, and the correct width/height declarations.
- The built asset returns HTTP 200 as `image/png`, reports natural dimensions 1731 x 909, has a 1,528,811-byte payload, and matches the public source SHA-256. A local workspace image-viewer rendering glitch was rejected as evidence after the source and copy hashes matched; independent browser decoding of the built asset showed the complete image at both 1200 and 600 px widths.

## DEC-020: Serve the photographic social card as a high-quality JPEG

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal
- **Supersedes:** DEC-019 only for the final v2 file format, filename, MIME, and payload evidence

### Context

DEC-019 established the branded composition and initially saved the generated result as a 1,528,811-byte PNG. The asset is a full-canvas photographic image with no alpha channel (`Format24bppRgb`), fine wind texture, soft dark gradients, and a realistic bee. PNG preserved it correctly but was a poor delivery format for that content: every crawler or message-preview fetch paid 1.53 MB for an image commonly rendered at roughly 600 x 315.

Direct-entry behavior was audited before changing anything else. Production loads of `#experience`, `#off-duty`, and `#contact` already restored their targets, current navigation states, and fixed-header clearances correctly, so no speculative deep-link JavaScript was added.

### Decision

Encode the accepted branded card once as a quality-92 JPEG using the platform image encoder. Keep dimensions at 1731 x 909 and preserve the text-free `public/og-card.png` rollback art. Point Open Graph and Twitter to `og-card-v2.jpg`, declare `image/jpeg`, and replace the PNG-specific artifact assertion with a small JPEG Start-of-Frame parser that proves actual dimensions and a 250,000-byte payload ceiling.

Remove the redundant workspace v2 PNG after source/candidate comparison. Its exact generated source remains recoverable under the built-in image-generation output path recorded in the revision-18 worklog; the original text-free project card also remains intact.

### Alternatives considered

- **Keep the 1.53 MB PNG:** rejected because the image has no transparency and its photographic gradients compress inefficiently losslessly.
- **Lower JPEG quality further:** rejected because 216 KB already achieves a large reduction and quality 92 preserves fine wing detail, serif edges, and dark wind texture with comfortable margin.
- **Use WebP:** rejected for the social crawler boundary; JPEG is the conservative broadly decoded photographic format and already meets the payload goal.
- **Keep both branded PNG and JPEG in `public/`:** rejected because only one is declared and shipping a redundant 1.53 MB sibling would undermine the repository-size benefit.
- **Add deep-link restoration code in the same slice:** rejected because direct production evidence proved the browser/React build already honors all three supported hashes.

### Evidence

- The source reports 1731 x 909, 24-bit RGB with no alpha. Quality-92 JPEG encoding produces a 216,847-byte candidate, an 85.8% reduction from 1,528,811 bytes.
- Original-resolution visual review preserves all four exact text groups, bee anatomy and detail, amber motes, teal wind trails, safe margins, and dark tonal hierarchy. A browser-rendered 600 x 315 preview remains clearly legible.
- The final test run passes 2 suites and 11 tests without React warnings. The artifact test parses JPEG Start-of-Frame dimensions as 1731 x 909, requires exactly two `.jpg` metadata references, `image/jpeg`, two identity-bearing alt descriptions, no declared v2 PNG, and a payload under 250,000 bytes.
- The production build passes. Emitted HTML contains two JPEG references and zero v2 PNG references. The built image returns HTTP 200 as `image/jpeg`, has a 216,847-byte payload, natural dimensions 1731 x 909, and a SHA-256 identical to the public source. Neither public nor build output retains the redundant v2 PNG.
- Direct 390 x 844 loads of all three supported hashes retain the requested URLs, select Experience/About/Contact respectively, leave 16.1 to 16.4 px below the fixed header, and show no overflow or broken images.

## DEC-021: Use one JY icon system across browser and home-screen surfaces

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The current `favicon.svg` already used the redesigned JY monogram, but its declared ICO fallback was still the old 32 px yellow-and-black cartoon bee from the legacy site. Browsers or bookmark surfaces that chose the fallback therefore reintroduced exactly the visual language the redesign had removed. The manifest declared only the SVG, there was no Apple touch icon, and HTML/manifest theme color used contact-section amber even though the mobile launch and hero begin on paper `#f2eee4`.

Current platform documentation supports a bounded correction: Apple documents a PNG `apple-touch-icon` for Home Screen Web Clips; Google web.dev documents 192 and 512 px Chromium manifest icons and recommends raster fallbacks alongside SVG; MDN documents `sizes: any` for scalable SVG manifest icons. This does not require or authorize a service worker, offline behavior, or a broader PWA project.

### Decision

Derive every raster icon deterministically from the existing JY mark: paper, ink circle, two amber rules, and ivory Georgia `JY`. Replace `favicon.ico` with transparent 16/32/48 px entries. Add non-transparent `apple-touch-icon.png` at 180 x 180, `icon-192.png`, and `icon-512.png`; keep the scalable `favicon.svg` first in the manifest and mark the 512 px icon `any maskable` with all identity elements kept inside the safe central field.

Set HTML and manifest theme colors to the existing paper `#f2eee4`, matching manifest background, initial body, React shell, and fixed header. Keep amber as the accent inside the icon and page rather than painting browser chrome with a color that appears only in the Contact chapter.

### Alternatives considered

- **Leave the cartoon ICO because SVG is listed first:** rejected because a fallback exists precisely for clients that do not use the SVG, and it must not contradict the current identity.
- **Delete the ICO with no replacement:** rejected because a coherent conventional fallback is cheap and useful for older browser/bookmark surfaces.
- **Use only the scalable SVG in the manifest:** rejected because the platform guidance explicitly recommends raster fallbacks and Chromium's documented baseline includes 192 and 512 px icons.
- **Use the realistic hero bee as an app icon:** rejected because its fine photographic silhouette loses identity at favicon sizes and would create a third icon language instead of extending the existing JY mark.
- **Keep amber browser chrome:** rejected because the launch/hero surface is paper and the amber field does not appear until the final Contact chapter.
- **Add a service worker or install prompt:** rejected as unrelated infrastructure and an unsupported expansion beyond correcting the icon surfaces already declared.

### Evidence

- Before the change, direct rendering of the 4,286-byte 32 px `favicon.ico` showed the legacy cartoon bee while `favicon.svg` showed the current JY mark.
- Deterministic raster review shows the same JY circle/rules/type at 180 and 512 px. Pillow decodes the new 1,972-byte ICO and reports 16, 32, and 48 px entries; the production browser decodes and displays the 48 px entry correctly.
- The static-artifact test requires the exact manifest icon list, aligned HTML/manifest/background colors, Apple touch link, ICO directory sizes, and actual 180/192/512 PNG dimensions. It also proves every PNG is truecolor without an alpha channel. The final run passes 2 suites and 11 tests without React warnings.
- The production build passes. `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, and `icon-512.png` return HTTP 200 as `image/x-icon` or `image/png`, are 1,972/3,227/3,527/10,234 bytes, and match their public/build SHA-256 values. Emitted HTML links the Apple icon and uses paper theme color; emitted manifest uses paper theme/background and all three declared icon formats.
- Platform references: Apple `Configuring Web Applications` documents root or linked PNG touch icons and the 180 x 180 retina iPhone size; web.dev `Add a web app manifest` documents 192/512 Chromium icons and raster fallback alongside SVG; MDN `icons - Web app manifest` documents exact raster sizes and `any` for scalable SVG.

## DEC-022: Use a split first viewport on short landscape phones

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The mobile-first hero had been proven in portrait and the desktop split had been proven from 1024 px upward, but short landscape phones had not been inspected. Production checks at 568 x 320, 667 x 375, and 844 x 390 exposed a material gap: the one-column mobile order rendered the complete title block before the image, leaving zero bee pixels in every first viewport. The full hero measured 1,581 to 1,804 px, or roughly four to five landscape viewports, so the signature visual and supporting argument felt disconnected from the opening statement.

A real bee-link activation at 568 x 320 also exposed a related geometry edge case. The link correctly updated `#experience` and landed the section at 93.1 px, but the active-section reading line sat at 89.6 px and therefore marked no current destination.

### Decision

Within a bounded `35rem` to `63.99rem`, `max-height: 30rem`, landscape-only media query, make the hero's first grid row at least `100svh` and split it into title and bee columns. Keep the supporting introduction, proof, and actions in a full-width second row immediately below. Compact only the typography, portrait annotations, caption, and action spacing needed for that first-row composition.

Preserve the existing single-column portrait mobile and tablet layouts and the established desktop split. Move the current-section reading line from a one-pixel post-header minimum to a 24 px post-header inset while retaining the 28% viewport reading position where it is larger. This makes anchor landings and current-location semantics agree on short viewports without mutating the URL during passive scrolling.

### Alternatives considered

- **Leave landscape phones on the portrait stack:** rejected because the signature bee remained completely absent from the first viewport and the hero consumed up to five viewport heights.
- **Shrink only the title globally:** rejected because it would weaken the proven portrait hierarchy without solving the separated title/image structure.
- **Hide the bee or supporting content at short heights:** rejected because both are core to the site's identity and career-first argument; the problem was order and composition, not excess content.
- **Apply the split to all tablets or all landscape widths:** rejected because portrait tablets and full desktop already have proven, distinct reading patterns.
- **Ignore the missing active state because the anchor worked:** rejected because the fixed navigation should describe the actual reading location, especially on a constrained viewport where orientation matters more.

### Evidence

- Before the change, 568 x 320, 667 x 375, and 844 x 390 reported 0 visible bee pixels and hero heights of 1,644.6, 1,581.4, and 1,803.7 px. Their image blocks began 558 to 580 px below the top.
- After the change, the same widths report 288, 343.2, and 358.4 visible bee pixels in the first viewport and hero heights of 668.3, 693.7, and 708.9 px. All three report zero horizontal overflow and zero broken images.
- Fixed-viewport screenshots at 568 x 320 and 844 x 390 show the title and realistic bee sharing a deliberate first screen with readable navigation, role label, image annotations, and bee action. A 390 x 844 portrait screenshot confirms the established vertical composition remains intact.
- Regression geometry at 390 x 844, 768 x 900, 1024 x 768, and 1440 x 900 reports the expected portrait/tablet/desktop hero modes, zero overflow, and zero broken images.
- The first 568 x 320 click reached `#experience` but marked no active link. After the reading-line adjustment, the same real click retains the 93.1 px section position and marks only `Experience` with `aria-current="location"`.
- The final focused run passes 2 suites and 13 tests without React warnings. The production build succeeds; CSS remains 6.11 KB gzip and main JavaScript is 4.2 KB gzip.

## DEC-023: Turn the two interests into paired editorial field cards

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

A fixed-viewport review followed the complete 390 px mobile reading journey from hero through Experience, the name story, interests, and Contact, then compared the same transition at 1440 x 900. Hero, career, identity, and contact chapters each had a distinct visual argument. Immediately after the strong wind/bee name study, however, Snowboarding and Boss fights collapsed into two generic text rows. On desktop they occupied a large undifferentiated paper field; on mobile they read like appended resume notes rather than the restrained personal signature the user requested.

The facts themselves were sufficient and should remain secondary to the career story. The gap was visual hierarchy, not missing hobbies, imagery, interaction, or detail.

### Decision

Keep exactly two interests and preserve the semantic list. Turn each entry into a sharp-edged editorial field card with a decorative, screen-reader-hidden art panel and a separate readable copy panel. Use only the existing paper, teal, amber, ink, and soft-teal palette:

- Snowboarding receives topographic contour lines, a simplified one-board/edge form, and `FIELD NOTE / WINTER` plus `EDGE / FLOW` annotations.
- Difficult games receive a quiet encounter grid, segmented pattern meter, concentric target geometry, and `ENCOUNTER / PATTERN` plus `READ / ADAPT / RETRY` annotations.

Sharpen the supporting sentences to describe clean-line focus and pattern/patience without naming a stance, game, character, or franchise. Keep the cards stacked on mobile and paired at the existing tablet/desktop breakpoint. Use no external asset or motion; the abstract CSS graphics are small, static, and deliberately simpler than the generated hero bee.

### Alternatives considered

- **Leave the two text rows unchanged:** rejected because both mobile and desktop review showed a visibly generic break in an otherwise specific editorial system.
- **Add stock or generated snowboarding and gaming images:** rejected because two more photographic styles would compete with the signature bee, increase payload, and make the personal close feel like a lifestyle gallery.
- **Use game characters, logos, or named franchises:** rejected because the user's exact signature titles were ambiguous and a public personal site should not manufacture preference or borrow an IP identity.
- **Add animated board or boss interactions:** rejected because motion would add complexity and compete with the one intentional hero flight interaction.
- **Add a third hobby or more explanatory copy:** rejected because the task was to improve presentation of verified interests, not expand the personal narrative.

### Evidence

- Before screenshots at 390 x 844 and 1440 x 900 show the two interests as plain heading/paragraph rows. After screenshots at the same sizes show a coherent stacked/pair composition that uses the site's existing field-study language and palette without overtaking the wind/bee identity card.
- The first responsive pass passed from 320 through 1440 px, but a separate 280 px audit detected hidden min-content overflow: the long `Snowboarding` word expanded child fields beyond the 223.2 px card while the page-level clip concealed it. Adding explicit shrink constraints and a bounded responsive heading size brought art, copy, heading, and all labels inside the card.
- Final production checks at 280, 320, 390, 768, 1024, and 1440 px report zero page overflow, zero broken images, zero copy overflow, and zero art-label escapes. Cards stack through 390 px and form two equal columns from 768 px; Contact retains 80 to 144 px of separation.
- A real 280 px rendering confirms the 34.4 px `Snowboarding` heading, paragraphs, edge label, encounter label, and retry caption remain readable and unclipped. Mobile 390 px and desktop 1440 px reviews confirm the intended hierarchy.
- The final test run passes 2 suites and 13 tests without React warnings, including assertions for two semantic list items, exactly two decorative art fields with `aria-hidden="true"`, and the final copy. The production build succeeds at 6.66 KB CSS and 4.33 KB main JavaScript gzip, with no new image or dependency.

## DEC-024: Confirm the bee flight without pretending the photo is a separate sprite

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The user's earliest visual criticism focused on the bee, so the completed generated asset was re-audited as an interaction rather than judged only at rest. Fixed-viewport captures at 390 x 844 and 1440 x 900 showed that the realistic bee and field-study framing are strong before activation. The click state, however, still used a legacy-style whole-photo `portrait-surge`: the captured early frame reached roughly 1.07 scale and 1.13 brightness, then the keyframe continued to 1.12 scale with translation and darkening.

On mobile with the action centered, that camera movement pushed the bee entirely out of the viewport, leaving only enlarged wind trails before navigation. The amber action visible in desktop automation came from hover/focus rules; `.bee-portrait--following` itself styled only the image, so accepted-state feedback was not guaranteed on touch.

### Decision

Keep the generated photograph as one honest image and keep the link destination and 420 ms confirmation window. Anchor transforms at 58% / 34%, near the subject, and replace `portrait-surge` with a 700 ms `portrait-confirm` curve: 1.01 at rest, a maximum 1.04 emphasis with mild brightness/contrast, then 1.025. Remove translation and end-state darkening.

Make `.bee-portrait--following` explicitly turn the action amber on every input mode. During the accepted state, change the visible copy to `OPENING FLIGHT LOG`, the accessible label to `Opening Jason's experience`, and expose `aria-busy="true"`. Restore the original state after 900 ms. Continue to navigate immediately with automatic scrolling when reduced motion is requested; the global reduced-motion CSS still collapses animation and transition timing.

### Alternatives considered

- **Keep the 1.12 camera surge:** rejected because the actual mobile frame lost the signature subject and read as an image zoom rather than a bee-led transition.
- **Remove all visual response:** rejected because the link deliberately waits before smooth navigation and needs visible acceptance feedback, especially on touch.
- **Generate or mask a separate transparent bee and fly it across the page:** rejected because it would introduce a second rendering of the subject, extra asset and masking complexity, and the same artificial CSS-flight problem the redesign moved away from.
- **Add a drawn flight-path overlay or particle burst:** rejected because the image already contains wind trails and amber motes; another effects layer would make the field-study framing busier and less mature.
- **Reduce the handoff to 300 ms:** tried and rejected after the first production capture; the state was technically correct but too brief to read reliably. The established 420 ms window is short yet perceptible.

### Evidence

- Before activation, both mobile and desktop show the complete realistic bee. The old captured motion frames report roughly 1.07 scale, 1.13 brightness, and translation; the 390 px action-centered frame contains no bee.
- The final mobile accepted frame reports about 1.04 scale, 1.08 brightness, no translation, `aria-busy="true"`, amber action color, and `OPENING FLIGHT LOG`. The full bee remains visible in the same action-centered viewport. The equivalent 1440 px frame preserves the original hero balance.
- Production checks at 280 x 720, 390 x 844, 568 x 320, 1024 x 768, and 1440 x 900 keep the 167 to 174 px confirmation action inside every portrait field, with zero horizontal overflow and zero broken images.
- After the handoff, the real URL is `#experience`, the desktop section top is 104 px, only Experience is current, the busy attribute is removed, and the original action label is restored.
- The final test run passes 2 suites and 14 tests without React warnings. A new normal-motion test proves the explicit busy/label state, no navigation through 419 ms, smooth navigation at 420 ms, and state restoration at 900 ms. The existing reduced-motion test continues to prove immediate automatic scrolling, repeat suppression, reactivation, and hash de-duplication; the static reduced-motion artifact test still covers zero animation/transition delay and duration semantics.
- The optimized production build passes at 38.68 KB vendor JavaScript, 6.65 KB CSS, 4.35 KB main JavaScript, and 784 B runtime JavaScript gzip. No asset or dependency was added.

## DEC-025: Return the reading position with the scroll position

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The page-ending journey was audited after the downward bee handoff was refined. At 390 x 844, the Contact close already had correct visual hierarchy, two 76.8 px Email/GitHub targets, safe GitHub attributes, a 44 px footer return target, a 114.8 px footer, and no overflow or broken image. No new footer or contact design was justified.

Activating the exact `BACK TO TOP` link correctly changed the URL to `#top`, scrolled the hero to 0 px, and cleared the active chapter. After the smooth scroll, however, `document.activeElement` was `<body>`. The viewport returned to the beginning while keyboard and assistive reading position did not, leaving the interaction visually complete but semantically unfinished.

### Decision

Keep the header wordmark and footer action as real `href="#top"` links. Route both through one `returnToTop` handler that:

1. prevents only the browser's incomplete default focus behavior;
2. pushes `#top` only when it is not already current;
3. focuses the fixed, visible wordmark using `preventScroll`;
4. scrolls the hero to `start` with `smooth` behavior normally and `auto` when reduced motion is requested.

Reuse the existing global focus-visible outline rather than adding a new return animation, toast, or control. Focusing the wordmark makes the current position visible and leaves the next keyboard stops as Experience, About, and Contact.

### Alternatives considered

- **Leave the native hash link unchanged:** rejected because direct production evidence proved that it loses focus to `<body>` in the actual browser.
- **Focus the hero section or H1:** rejected because either would require a new programmatic tab stop and a large or absent focus treatment; the wordmark is already interactive, visible, fixed, and labelled as the top return.
- **Add a floating Back to top button:** rejected because the existing fixed header and footer action already provide the route, and another persistent control would clutter the mobile composition.
- **Focus the first Experience navigation link:** rejected because returning to the start should identify the page/home position, not imply that Experience is current.
- **Always push a new `#top` history entry:** rejected because repeated wordmark activation at the top should scroll/focus without adding duplicate browser history.

### Evidence

- Baseline real activation at 390 x 844 ended at `#top`, hero top 0, and scrollY 0, but the active element was `<body>`.
- After the change, the same activation ends with `.wordmark` focused and labelled `Jason Yau, back to top`; it matches `:focus-visible` and renders a solid current-color outline with 4 px offset. The mobile screenshot shows the focus ring fully around the JY mark while the hero begins at the top.
- Repeated production checks at 280, 390, 568 landscape, 1024, and 1440 px all report `#top`, scrollY 0, hero top 0, no active chapter, a fully visible focused wordmark, zero overflow, and zero broken images.
- The focused mounted-DOM regression begins at `#contact`, proves one `pushState`, wordmark focus, and reduced-motion `auto` scrolling; a repeated wordmark activation at `#top` proves no second history push and normal-motion `smooth` scrolling.
- The final test run passes 2 suites and 15 tests without React warnings. The optimized production build passes at 38.68 KB vendor JS, 6.65 KB CSS, 4.42 KB main JS, and 784 B runtime JS gzip. No CSS, asset, or dependency was added.

## DEC-026: Make the first-screen bee discoverable before React

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The first-screen image had already been optimized to a 90,606-byte 1024 x 1536 WebP and mounted with intrinsic dimensions, eager loading, async decoding, and high fetch priority. Its source URL was still created by a JavaScript import. Production `index.html` contained neither `bee-hero-v2` nor an image preload; the generated hashed media URL existed only inside main JavaScript. The browser's HTML scanner therefore could not discover the signature mobile image until the application bundle downloaded and executed.

The connected browser deliberately omits Resource Timing, so no unsupported local millisecond baseline was inferred. The initial HTML and build graph are direct evidence of the dependency. Current web.dev LCP guidance specifically lists images dynamically added by JavaScript as late-discovery resources and recommends a high-priority preload when the URL otherwise lives in JavaScript or CSS. MDN documents that an image preload belongs in initial `<head>`, requires `as="image"`, can declare `type="image/webp"`, and can use fetch priority sparingly for a significant LCP candidate.

### Decision

Move the exact WebP from `src/images/bee-hero-v2.webp` to the stable root path `public/bee-hero-v2.webp`. Point the React image at `/bee-hero-v2.webp` and add exactly one initial-head link with the same path, `rel="preload"`, `as="image"`, `type="image/webp"`, and `fetchpriority="high"`.

Keep the mounted image's existing eager/high-priority/async attributes, 1024 x 1536 dimensions, alt text, portrait framing, motion, and interaction. Continue to serve only one variant because the current 90 KB asset is already bounded and responsive-image generation would be a separate asset-quality decision. References: [web.dev Optimize LCP](https://web.dev/articles/optimize-lcp), [MDN rel=preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload), and [MDN fetchpriority](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/fetchpriority).

### Alternatives considered

- **Rely on `loading="eager"` and `fetchpriority="high"` only:** rejected because those attributes cannot affect a URL the browser has not yet discovered; in the baseline they appeared only after React mounted.
- **Keep the hashed source import and hard-code its current build hash into HTML:** rejected because every rebuild could change the URL and silently break preload matching.
- **Inline the 90 KB image as data:** rejected because it would inflate render-blocking HTML, prevent independent caching, and make discovery earlier at the cost of a much larger document.
- **Generate AVIF/mobile/desktop variants now:** deferred because the existing single WebP is 90 KB and visually verified; variant generation requires a separate visual-quality and support decision rather than being smuggled into a discovery fix.
- **Claim an LCP improvement from local request ordering:** rejected because request discovery is only one LCP component and no field or throttled Lighthouse measurement has been performed.

### Evidence

- Baseline build inspection found zero hero URL/preload references in `index.html`; the hashed `/static/media/bee-hero-v2...webp` URL was present only in main JavaScript.
- The final static-artifact test requires the exact multi-attribute preload, one HTML URL occurrence, the matching root source in App, absence of the old import/file, valid RIFF/WEBP/VP8 signature, actual 1024 x 1536 dimensions, and a payload below 100 KB.
- The final build contains one HTML preload, one matching main-bundle source string, one 90,606-byte root hero, and no `static/media` hero copy. Public and build SHA-256 values are identical.
- A temporary no-store audit server delayed only main JavaScript by 1,500 ms. HTML completed at 33,205 ms; the hero request arrived at 33,226 ms, main JavaScript was requested one millisecond later and completed at 34,728 ms. Exactly one hero request occurred, proving initial-head discovery and later `<img>` reuse before React could execute. Both temporary audit servers were stopped and the temporary script was removed.
- Browser checks at 280, 390, 568 landscape, 1024, and 1440 px show identical preload/currentSrc URLs, complete natural 1024 x 1536 images, retained eager/high-priority/async attributes, zero overflow, and zero broken images. The real bee-confirmation/Experience handoff remains intact.
- The final run passes 2 suites and 16 tests without React warnings. The optimized build passes at 38.68 KB vendor JS, 6.65 KB CSS, 4.39 KB main JS, and 784 B runtime JS gzip; main JavaScript is 35 B smaller than revision 24.

### Constraint

The legacy local preview server on port 43817 returns `.webp` as `application/octet-stream`; the browser still decodes the file, reuses the matching URL without a console warning, and the MIME-correct audit server proves one-request behavior. This is not evidence about the eventual host. Verify `image/webp` on the production URL before deployment sign-off.

## DEC-027: Let enlarged text reflow and measure the real header

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The normal responsive audit already covered viewports down to 280 px, but that did not prove WCAG 2.2 Resize Text behavior. A controlled production build with the root font doubled from 16 to 32 px exposed real loss at 390 x 844: `Contact` sat entirely outside the fixed header, the hero heading and proof metrics exceeded their columns, and readable Okta, identity, and Snowboarding content extended past clipped or narrow grid containers. The fixed `--header-offset` also stopped representing the header after navigation wrapped; direct `#experience` content landed 66.6 px under the enlarged header.

### Decision

Preserve the existing typography and visual hierarchy. Make relevant flex rows wrap, replace implicit `1fr` tracks with shrink-safe `minmax(0, ...)` tracks, apply bounded `overflow-wrap` to display and career text, and let wide hero/action columns shrink or wrap rather than force content outside the viewport.

Measure the actual fixed header during layout, publish its height plus 16 px as the shared `--header-offset`, and observe future header-size changes. On an initial deep link, realign the target after that measurement so static hash entry and JavaScript-enhanced navigation share the same clearance. Keep the existing CSS tokens as the no-JavaScript/default fallback and remove the inline measurement during unmount.

### Alternatives considered

- **Reduce fonts in narrow or zoomed layouts:** rejected because it would undermine the user's enlargement rather than make the layout accommodate it.
- **Hide one navigation label or replace the header with a menu:** rejected because all three short destinations can remain visible by wrapping and a new menu would add interaction and accessibility surface.
- **Allow page-level horizontal scrolling:** rejected because the affected content is ordinary prose and controls, not an intrinsically two-dimensional data surface.
- **Keep the breakpoint-based header offset:** rejected because the header height is content-driven when text wraps; a fixed estimate cannot represent all supported text sizes.
- **Redesign the visual system:** rejected because the defects were sizing and flow constraints, not an art-direction problem.

### Evidence

- The initial 390 x 844 / 200% audit showed `Contact` ending at x=498.5, heading/metric min-content overflow, and current-card readable content extending to x=451 inside a 375 px viewport. The corrected audit has no page overflow and no readable-content clipping; all header links fit across two rows.
- The initial enlarged deep link placed Experience 66.6 px behind a 252.5 px header. The measured offset is 269 px and both direct Experience entry and real About navigation leave 16.5 to 16.6 px below the header with the correct current label.
- The corrected 1280 x 900 / 200% audit has zero page overflow and no readable-content overflow; only the deliberately cropped bee-photo layer remains larger than its frame.
- Normal production regression at 280, 390, 568 landscape, 1024, and 1440 px retains the original 16 px root, visible navigation, zero page overflow, zero broken images, and shrink-safe career/personal/contact cards. Representative direct anchors keep 16.3 to 16.4 px clearance.
- The final run passes 2 suites and 17 tests. The optimized build is 38.68 KB vendor JS, 6.74 KB CSS, 4.57 KB main JS, and 784 B runtime JS gzip. No asset, dependency, content, deployment, domain, commit, or branch change was introduced.

## DEC-028: Use a two-tone keyboard focus system

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The page already exposed semantic links, an overflow-only focusable skills list, global `:focus-visible`, a skip-link focus transfer, and a programmatic top-return focus target. A complete connected-browser focus inventory at 390 px found 12 sequential targets in coherent DOM order; the corresponding 1440 px page correctly had 11 because the skills row no longer overflowed.

Rendered visibility was not equally strong. The skip link and filled `VIEW THE TRACK RECORD` action inherited a paper-colored outline while their outer field was also paper. The skip link became visible on focus and the unfilled action changed its full background, but the filled action's only perimeter change was effectively 1:1 with adjacent pixels. In contrast, header/contact ink outlines, the bee's amber-on-black indicator, and the skills rail's amber-on-teal indicator were already clear.

### Decision

Give ordinary links and buttons a consistent two-tone keyboard-only perimeter: a 3 px paper outline offset by 3 px with a 6 px ink spread behind it. One of the two bands therefore remains visible on paper, ink, teal, and amber surfaces without depending on the component's current text color. Keep the indicator under `:focus-visible` so pointer navigation does not acquire keyboard rings.

Preserve the bee's subject-specific amber inset indicator and large amber action-state change, but strengthen the outline to 3 px and explicitly suppress the common outer shadow. Preserve the skills rail's amber-on-teal outline and strengthen it to 3 px. Do not add focus animations, sound, a new component, or a change to tab order.

### Alternatives considered

- **Change only the filled primary CTA:** rejected because the same paper-on-paper perimeter also affected the skip link and a shared focus system is easier to recognize across a long page.
- **Use only an ink outline everywhere:** rejected because an ink-only ring can disappear against dark fields and would weaken the bee treatment.
- **Use only amber everywhere:** rejected because amber has weak contrast against the paper and Contact surfaces even though it is strong on teal/black.
- **Rely on background changes:** rejected because the already-filled action has no remaining full-component color change and distributed links are harder to compare than adjacent controls.
- **Add a JavaScript focus-mode class:** rejected because `:focus-visible` already supplies the needed keyboard/pointer distinction without runtime state.

### Evidence

- Before the change, the skip and both hero actions reported a computed paper outline with no box shadow; the filled action sat on a paper outer field and retained its existing ink fill. Afterward the skip and action screenshots show a complete paper inner line and ink outer line, with computed 2.4 px outline and 6 px spread in the connected browser.
- At 390 px all 12 focus targets report `:focus-visible`; the bee reports amber/no common shadow and the overflow-only skills row reports amber/no common shadow. At 1440 px all 11 applicable targets report `:focus-visible`, and the non-overflowing skills row is absent from the sequence.
- Far-distance Email focus settles fully inside both 390 x 844 and 1440 x 900 viewports below the fixed header. At 280, 390, 568 landscape, 1024, and 1440 px, focused Contact and the primary action keep their full outer perimeters inside the horizontal viewport, with zero page overflow and zero broken images.
- Pointer About navigation reports no focus-visible outline or shadow, reaches the correct section with 16.1 px clearance, and selects About. The real bee acceptance and completion states remain unchanged and error-free.
- The final run passes 2 suites and 18 tests. The optimized build is 38.68 KB vendor JS, 6.77 KB CSS, 4.57 KB main JS, and 784 B runtime JS gzip. No asset, dependency, content, deployment, domain, commit, or branch change was introduced.

## DEC-029: Support user text spacing through resilient flow, not an authored mode

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

Revision 26 proved 200% text enlargement and corrected several real min-content and header-measurement defects. That did not separately prove WCAG 2.2 Text Spacing, whose test changes four properties together: 1.5 times font-size line height, 2 times font-size paragraph spacing, 0.12 times font-size letter spacing, and 0.16 times font-size word spacing. The long editorial headings, fixed header, clipped visual frames, career grids, and narrow Contact links were the main plausible failure surfaces.

### Decision

Keep the authored typography as the default and rely on the now shrink-safe, content-sized layout to honor user or assistive-technology spacing overrides. Use the four exact metrics together only as a temporary verification layer, test for clipped/overlapping/unavailable readable content and controls across representative layouts, and remove that layer before the final build.

Do not add a site-specific text-spacing switch, preserve the override with `!important`, or redesign headings merely because an extreme user override produces more line breaks. A wrap is acceptable when the complete string and functionality remain available; text cut off, overlap, or forced off-screen is not.

### Alternatives considered

- **Ship a text-spacing preference control:** rejected because browser, extension, and user styles already own this need; a duplicate site setting would add state and control surface without fixing underlying layout resilience.
- **Keep the exact stress CSS in production:** rejected because the values are test conditions, not the intended editorial typography, and `!important` would override rather than respect users.
- **Add special spacing-only breakpoints:** rejected because no readable-content or control failure appeared at any audited width; speculative rules would increase CSS complexity without an evidenced defect.
- **Treat mid-word wrapping as failure:** rejected because the acceptance condition is retained content and functionality, not preservation of the authored line composition under an extreme override.

### Evidence

- Computed 390 px production-stress values matched all four metrics: 18.88 px body copy produced 28.32 px line height, 2.2656 px letter spacing, 3.0208 px word spacing, and 37.76 px paragraph margin.
- Automated geometry at 390 and 1280 px found zero off-viewport readable elements and zero readable sibling intersections. At 280, 390, 568 landscape, and 1280 px, document and client widths matched and all images decoded. The only clipped own-content element was the intentionally cropped bee link; hidden skip-link placement and the accessible horizontal skills rail were expected audit exceptions.
- Visual review covered the hero, Experience opening and current role, About opening, interest cards, and Contact at mobile and desktop sizes. Headings grew and wrapped, but no readable string or control was lost or obscured.
- After removing the temporary override, normal production checks at 280, 390, 568 landscape, 1024, and 1440 px retained zero overflow and broken images. Bee and Contact navigation preserve their busy/current-state behavior and approximately 16 px measured-header clearance.
- The final run passes 2 suites and 18 tests. The optimized build remains 38.68 KB vendor JS, 6.77 KB CSS, 4.57 KB main JS, and 784 B runtime JS gzip. No permanent product source, dependency, asset, content, deployment, domain, commit, or branch change was introduced.

## DEC-030: Treat the portrait-mobile title and bee as one viewport poster

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The career, About, and Contact openings were coherent at 390 px, but the mobile-first hero did not offer an action in its first viewport. At 390 x 844 it measured 1,703.3 px. The title ended at 458 px, the bee frame continued to 1,145.6 px, and the body actions did not begin until 1,516.1 px. The first screen communicated Jason's role and visual identity, but a recruiter could not act on either without a substantial scroll.

### Decision

For portrait screens below 36 rem only, compose the title and bee as two rows whose preferred heights total one small viewport: 52svh for identity/title and 48svh for the bee field. Keep content-safe minima for unusually short screens, let the visual's internal photo track shrink, and tighten the mobile heading to a bounded 2.8-3.9 rem scale with a full-width measure. Keep the generated bee, caption, interaction, hero body, proof, secondary actions, copy, DOM order, section IDs, landscape path, and desktop path unchanged.

The first viewport is therefore a complete poster and a real action surface, not the entire hero. Detailed credibility remains immediately below it instead of being removed to satisfy a height target.

### Alternatives considered

- **Shorten only the bee image:** rejected because the four-line 390 px heading still consumed too much of the opening and the result felt like a cropped asset rather than a composed poster.
- **Move the career metrics and both buttons over the image:** rejected because it would obscure the generated bee, overload the first impression, and duplicate the bee link's Experience intent.
- **Remove the introduction, proof, or Email action on mobile:** rejected because content deletion would lower recruiter value rather than improve its sequence.
- **Apply the same grid at tablet and desktop sizes:** rejected because those layouts already keep the complete hero and actions inside one viewport with a balanced split.
- **Change markup order or create a second mobile CTA:** rejected because the existing bee link already provides the correct action, progressive fallback, accessible name, and tested handoff.

### Evidence

- At 390 x 844, the final title/visual boundary is 438.9 px and the visual ends at 844 px. `FOLLOW THE BEE` ends at 775.2 px and the heading ends at 410.9 px across three lines. The hero is 1,401.8 px, 301.6 px shorter, while the complete body remains below the opening poster.
- At 280 x 720 and 320 x 720, the visual ends at exactly 720 px and the bee action ends at 640.8 and 651.2 px. At 390 x 667 the content minima make the visual end 1.3 px past the viewport, while the action still ends at 599.4 px. All three pages have matching document/client widths and zero broken images.
- The unchanged 568 x 320 landscape, 1024 x 768, and 1440 x 900 paths retain their prior hero heights and compositions. Fixed-view desktop review shows no visual change.
- A real 390 px activation preserves busy/label state, restores the idle link, reaches `#experience`, selects Experience, and leaves 16.2 px of measured-header clearance.
- The final run passes 2 suites and 19 tests. The optimized build is 38.68 KB vendor JS, 6.85 KB CSS, 4.57 KB main JS, and 784 B runtime JS gzip. No dependency, asset, resume fact, deployment, domain, commit, or branch change was introduced.

## DEC-031: Let personal content carry the editorial identity

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The generated bee, career story, typography, color system, and chapter layouts already establish a distinctive personal portfolio. Repeated field-study metadata was competing with that identity: the domain had a fake edition number, the bee carried two corner labels plus a two-part caption, each chapter had a numbered strip, the interest cards repeated numbering and art labels, the current role carried a decorative `02`, and a pulsing green dot implied live state without representing one. The accumulated treatment read like an agency template explaining its own design system.

### Decision

Remove non-informational numbering, versioning, image labels, card labels, and the non-live status dot. Present `YFYAU.COM` as the domain, not an edition badge. Let the generated bee stand without explanatory corner text or caption, while retaining its accessible description and actual `FOLLOW THE BEE` action. Let each chapter begin directly with its heading and content. Replace visible em dash, en dash, and middle-dot separators with natural prose punctuation.

Preserve labels that carry real information or interaction: current and historical dates, Okta, measured outcomes, `WORKING SET` and its conditional horizontal-scroll hint, Education, the meaningful `WIND / BEE` name study, `WHY THE BEE STAYS`, Email/GitHub, and the footer identity. Do not change the IA, anchors, navigation labels, assets, career facts, interests, contact routes, or established motion.

### Alternatives considered

- **Keep the full field-study system:** rejected because the chrome repeated the same editorial signal more often than it added information and weakened the personal, career-first hierarchy.
- **Remove every uppercase or monospace label:** rejected because real dates, metrics, skill guidance, and the wind/bee name relationship remain useful and intentional.
- **Replace the removed labels with a new metadata system:** rejected because that would redesign the symptom instead of allowing the bee, content, type, and spacing to do the visual work.
- **Change the whole visual theme:** rejected because the generated bee and current palette are now strong; the problem was surrounding explanation, not the core identity.

### Evidence

- Rendered production text contains none of the removed field-study strings, numbered chapter/card labels, em dashes, en dashes, or middle dots. A leaf-text inventory leaves only factual, functional, or name-study uppercase labels.
- Fixed-view before/after review at 390 x 844 and 1440 x 900 shows a cleaner bee field and earlier chapter content. The desktop Contact chapter and footer now fit inside one 900 px viewport without losing content.
- Geometry at 280, 320, 390, 568 landscape, 1024, and 1440 px shows zero page-level horizontal overflow, zero broken images, no current-job internal overflow, and a first-viewport bee action at every size.
- Real bee navigation retains its accepted state and 16 px Experience clearance; real 280 px Contact navigation retains 16 px clearance and the correct active chapter.
- The final run passes 2 suites and 20 tests. The optimized build is 38.68 KB vendor JS, 6.38 KB CSS, 4.24 KB main JS, and 784 B runtime JS gzip. No dependency, asset, resume fact, deployment, domain, commit, or branch change was introduced.

## DEC-032: Replace abstract hobby diagrams with an original cinematic image pair

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

After Revision 30, the generated bee, current-role card, wind/bee name study, and Contact close shared a mature visual standard. The Snowboarding and Boss fights fields still used hand-built CSS contour lines, a miniature board, a grid, and a target motif. Mobile and desktop review showed that these diagrams were legible but materially flatter and more synthetic than the rest of the page. The user had explicitly preferred image generation when CSS illustration quality was not strong enough.

### Decision

Replace only the two decorative interest fields with an original generated-image pair. Use close editorial action photography for snowboarding, showing a board and lower legs rather than inventing Jason's appearance. Use original cinematic concept art for the boss fight, with an anonymous player facing a dragon-like adversary and no recognizable character, franchise armor, interface, logo, or text. Lock both images to the existing near-black, deep-teal, paper-white, and restrained-amber palette.

Optimize the selected outputs as versioned WebP assets in `public/`, keep them decorative with empty alt text because the adjacent headings and copy already name the interests, publish intrinsic dimensions, and lazy-load below the fold. Preserve the existing cards, content, list semantics, chapter layout, and Contact transition. Remove the obsolete CSS illustration structures and rules instead of retaining hidden fallback art.

### Alternatives considered

- **Keep refining the CSS diagrams:** rejected because the problem was material quality, not line placement, and further ornamental CSS would keep the two fields visibly below the generated bee.
- **Generate identifiable lifestyle portraits of Jason:** rejected because no personal reference photos were supplied and an invented face would be misleading.
- **Use recognizable Mega Man or another game character:** rejected because a personal portfolio does not need copyrighted character imitation to communicate a preference for difficult games.
- **Remove the interest visuals entirely:** rejected because the two cards are the only personal visual counterweight below the career story and the user had provided both interests as useful design material.
- **Add the images as new full-width sections:** rejected because it would expand the IA and let hobbies compete with the career-first purpose.

### Evidence

- Final workspace assets are `public/interest-snow-v2.webp` at 1600 x 731 and 79,932 bytes, and `public/interest-boss-v2.webp` at 1600 x 776 and 75,024 bytes. Static tests verify WebP signatures, exact dimensions, payload ceilings, and source references.
- Fixed-view production review at 390 x 844 and 1440 x 900 shows the board/powder and dragon/player focal pairs remain readable after `object-fit: cover` cropping. The images share palette and atmosphere without duplicating the hero bee.
- Geometry at 280, 320, 390, 568 landscape, 1024, and 1440 px shows equal image-field heights within each layout family, correct decoded natural dimensions, zero broken images, zero page-level overflow, and no interest-copy overflow.
- Real bee and Contact navigation preserve accepted state, active-section behavior, and 16-17 px fixed-header clearance.
- The final run passes 2 suites and 21 tests. The optimized build is 38.68 KB vendor JS, 6.08 KB CSS, 4.27 KB main JS, and 784 B runtime JS gzip. No dependency, career fact, contact route, deployment, domain, commit, or branch change was introduced.

## DEC-033: Compose informational chapter openings as vertical reading sequences

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

After the generated imagery and visual-chrome cleanup, the desktop Experience and About openings still shared a common portfolio-template pattern: an 834 px, 230 px-tall headline occupied the left column while a much smaller explanation floated at x=978 in a narrow right rail. The copy was relevant, but its placement made it read like an annotation to the design rather than the next sentence in Jason's story. A 112 px gap then separated the opening grid from the Okta or identity panel. Mobile was already vertically composed and Contact's comparable split was functional because the right column contained the actual email/GitHub action surface.

### Decision

At 48 rem and above, compose informational `.section-heading` elements as a vertical sequence. Use a calmer `clamp(5rem, 7.5vw, 6.75rem)` headline, place the direct explanatory paragraph underneath on a maximum 52 rem measure, and inset it with `min(8vw, 7rem)` to create a restrained editorial handoff rather than a detached rail. Use a 4.5 rem transition from each opening to the Okta and wind/bee panels.

Declare `.contact-heading` as the explicit grid exception, retaining the established 1.25fr/0.55fr columns, four-rem gap, bottom alignment, and larger headline scale. Keep the below-48-rem flow, copy, content order, facts, assets, interactions, anchors, and section padding unchanged.

### Alternatives considered

- **Keep the shared desktop split:** rejected because equal structure was hiding an important semantic distinction: Experience/About carry explanatory prose, while Contact carries an interactive destination panel.
- **Stack Contact as well:** rejected because its right column is not decorative caption copy; the paired email and GitHub links make the two-column close useful and scannable.
- **Move the explanation directly under the headline but keep it flush-left:** rejected because the small inset gives the prose an intentional entry point and keeps the chapter from becoming a generic centered or fully left-aligned block.
- **Reduce section padding or move the cards much earlier:** rejected because the problem was the relationship between headline and explanation, not overall chapter breathing room. The final 72 px transition is enough to bind the content without crowding the large panels.
- **Change markup or wording:** rejected because the existing information and semantic order were already sound; CSS could resolve the hierarchy without content churn.

### Evidence

- At 1440 x 900 the Experience/About explanations begin at x=192 on an 832 px measure instead of floating from x=978 to x=1345. The headline height is 194.4 px instead of 230.4 px, and the opening-to-panel gap is 72 px instead of 112 px.
- Fixed-view production review at 390 x 844 and 1440 x 900 confirms a coherent vertical reading sequence, an unchanged mobile hierarchy, and the preserved functional Contact split. At 1024 and 1440 px Contact computes as a two-column grid; below 48 rem it remains block flow.
- Sequential geometry at 280, 320, 390, 568 landscape, 1024, and 1440 px shows matching document/client widths, zero broken images, zero current-card or interest-copy overflow, equal interest-field heights within each layout family, and in-bounds Contact links.
- A real 390 px bee activation retains busy/restored state, reaches `#experience`, and leaves 16.17 px below the fixed header.
- The final run passes 2 suites and 22 tests. The optimized build is 38.68 KB vendor JS, 6.11 KB CSS, 4.27 KB main JS, and 784 B runtime JS gzip. No dependency, content, asset, career fact, contact route, deployment, domain, commit, or branch change was introduced.

## DEC-034: Use precise career language and observe chapter crossings instead of scroll frames

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The Revision 32 visual hierarchy was coherent on 1440 x 900 and 390 x 844, but the mandatory copy self-audit still found five high-visibility defects. The hero omitted articles around `ambiguous problem` and `reliable production system`; Experience said Jason `stayed for` reliability; the current Okta card listed generic traits instead of explaining its deliberately limited detail; the Hundsun summary used the awkward compound `trading-mobile`; and Contact referred to `hard systems`. None changed a fact, but together they weakened the direct engineering voice the redesigned page was meant to establish.

The persistent navigation also installed a passive window scroll listener and recomputed three section rectangles on every scroll event. Its state changes only when a section crosses one stable reading line, so per-scroll React work was unnecessary on a long mobile-first page.

### Decision

Rewrite only the five audited sentences with direct language supported by existing facts. Keep the hero introduction at 20 words, describe the plan-to-production/improvement loop plainly, explain that current-role details stay brief while pointing to the measured prior record, describe Hundsun as mobile trading products and integrations, and invite product engineering, complex systems, or technical conversation. Do not add current Okta responsibilities, new outcomes, or broader voice changes.

Replace the scroll listener with one `IntersectionObserver`. Preserve the existing reading line at the greater of 24 px below the fixed header or 28% of viewport height, clamp it inside the viewport, and express it as a one-pixel observer root using negative top and bottom margins. Observe Experience, About, and Contact; read initial geometry before observer delivery; rebuild on header/viewport resize; and disconnect on cleanup. If the optional observer API is absent, retain initial state and fully functional anchor navigation without reintroducing per-scroll work.

### Alternatives considered

- **Keep the copy unchanged:** rejected because the defects were visible language problems, not subjective tone changes, and the user had already rejected weak minimum-bar phrasing.
- **Rewrite every paragraph:** rejected because most copy is already clear and personal; a broad rewrite would risk factual drift and erase the established voice.
- **Invent a detailed Okta summary:** rejected because the user supplied only title and start date. Current responsibilities remain outside the verified fact boundary.
- **Throttle or wrap the scroll listener in `requestAnimationFrame`:** rejected because it would still schedule work throughout scrolling to detect a boundary event that the platform can observe directly.
- **Mark active navigation from click handlers or URL hash only:** rejected because manual scrolling must update the reading state, and back-to-top must clear it. That would be a behavioral substitute, not equivalent navigation.

### Evidence

- Rendered copy pre-flight finds all new phrases and none of the five retired forms, with zero em/en dashes, empty links, href-less links, or broken images.
- Real production observer navigation marks Experience, About, and Contact at both 1440 x 900 and 390 x 844. Desktop clearance is 16-16.25 px; mobile clearance is 15.84-16.19 px. Back-to-top clears active state, restores `#top`, reaches scroll position zero, and focuses the wordmark.
- Six-size geometry at 280, 320, 390, 568 landscape, 1024, and 1440 px shows matching document/client widths, zero revised-copy or current-card overflow, zero broken images, in-bounds Contact links, and a single-row in-bounds navigation.
- Unit coverage controls observer delivery, checks the short-landscape root margin, proves the same three active states, and verifies cleanup. A static regression rejects any raw scroll-listener registration or removal.
- The final run passes 2 suites and 23 tests without React warnings. The optimized build is 38.68 KB vendor JS, 6.11 KB CSS, 4.36 KB main JS, and 784 B runtime JS gzip. No dependency, visual style, layout, career fact, asset, anchor, contact route, deployment, domain, commit, or branch change was introduced.

## DEC-035: Let the desktop hero statement use its available measure

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The settled 390 x 844 opening rendered the statement in three lines, but every measured desktop from 1024 through 1920 px rendered it in four. Both the plain `I build software` and emphasized `that holds up.` fragments wrapped to two lines. The desktop title content fields already provided 430.28 to 832.01 px, while the authored `8.2ch` cap limited the actual H1 to 317.96 to 529.95 px. The larger layouts therefore fragmented more than mobile because of an artificial text-measure constraint rather than a real column limit.

### Decision

At 64 rem and above, change only the H1 cap from `8.2ch` to `min(10ch, 100%)`. Preserve the type scale, line height, grid ratio, alignment, title text, role label, hero body, proof, actions, generated bee, interaction, and every below-64-rem composition. The 100% bound keeps the title shrink-safe while the 10ch measure allows the emphasized phrase to resolve as one line.

Accept three desktop lines as the intended editorial rhythm: `I build`, `software`, and `that holds up.`. Do not force a generic two-line lockup by shrinking the type or changing the established split-screen proportions.

### Alternatives considered

- **Reduce the desktop font size:** rejected because the display scale and bee pairing were already strong; the failure came from unused width, not oversized type.
- **Widen or rebalance the hero grid:** rejected because every measured left column already had enough content width, and changing the visual split would disturb the generated bee crop.
- **Set the H1 to the full column width:** rejected because it risks collapsing the statement into two low, dense lines on wide screens and weakens the deliberate `I build` / `software` cadence.
- **Apply the rule to mobile and short landscape:** rejected because those layouts have separate proven poster compositions and genuine width/height constraints. Their current wrapping remains intentional.
- **Change the statement again:** rejected because `I build software that holds up.` is direct, specific in tone, and already approved as the replacement for minimum-bar language.

### Evidence

- Production rendering at 1024 x 768, 1280 x 800, 1440 x 900, and 1920 x 1080 changes from four lines to exactly three, with two plain lines and one emphasized line. Computed font sizes remain 72, 83.2, 100.8, and 120 px respectively.
- At every desktop size the hero remains one viewport high plus its one-pixel border, actions remain inside the first viewport, and page-level horizontal overflow remains zero. Fixed-view review accepts both the narrow 1024 and full 1440 compositions.
- The 390 x 844 title retains its prior 335.2 x 172.2 px geometry, three-line arrangement, and first-screen bee action. A real bee handoff retains its busy state, restored label, `#experience` route, active Experience state, 15.86 px fixed-header clearance, and zero overflow.
- A nine-size traversal reports zero decoded-image failures, loaded interest imagery, in-bounds navigation and Contact actions, and zero page overflow. Focused tests pass 2 suites and 24 tests; the optimized build passes at 38.68 KB vendor JS, 6.12 KB CSS, 4.36 KB main JS, and 784 B runtime JS gzip. No content, fact, asset, dependency, route, deployment, domain, commit, or branch state changed.

## DEC-036: Make the About opening answer the signature bee

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

Full-journey review at 390 x 844 and 1440 x 900 found that the hero, career story, identity artwork, generated interest imagery, and Contact close were visually coherent. The weakest remaining chapter opening was About: `More than a job title.` could belong to any career portfolio, while the more personal `WHY THE BEE STAYS` was demoted to a repeated uppercase eyebrow inside the identity panel. The introductory `Snow` also described weather rather than Jason's supplied interest in snowboarding.

### Decision

Promote the existing bee phrase into the chapter H2 as `Why the bee stays.` and emphasize `stays.` using the established same-family italic treatment. Replace the introduction with `My name explains the bee. Snowboarding and difficult games explain most of the rest.` Remove the now-redundant identity kicker and its CSS so the panel begins directly with `One sound. Two meanings.`

Preserve the wind/bee explanation, Chinese characters, hobby titles and copy, generated images, section ID, navigation label, section composition, spacing, accent treatment, facts, and every other chapter.

### Alternatives considered

- **Keep `More than a job title.`:** rejected because it states a generic portfolio idea while the chapter already contains a specific personal answer.
- **Keep both bee labels:** rejected because repeating the phrase as an H2 and uppercase micro-label adds hierarchy without information and recreates the eyebrow pattern already removed elsewhere.
- **Write an entirely new personal headline:** rejected because `Why the bee stays` already existed in the page voice and directly answers the generated hero bee.
- **Add more hobby copy or another image:** rejected because the two generated cards already communicate snowboarding and difficult games; the defect was naming and hierarchy, not missing content.
- **Call the interest `snow`:** rejected because it is vague and contradicts the user's explicit snowboarding detail.

### Evidence

- Rendered H2 and introduction normalize exactly to the two decided strings. The retired title, vague snow phrase, uppercase duplicate, `.identity-kicker` element, and its CSS are absent.
- At 390, 1024, and 1440 px the complete heading heights remain exactly 228.85, 197.8, and 248.2 px; the identity panel begins after the established 72 px transition. Fixed-view review accepts the title/panel hierarchy and the simplified mobile identity copy.
- Production traversal at 280, 320, 390, 568 landscape, 768, 1024, 1440, and 1920 px reports zero page or identity-copy overflow, zero decoded-image failures, loaded lazy interest images, in-bounds single-row navigation, and in-bounds Contact links. Visible copy contains zero em/en dashes.
- Real mobile About navigation reaches `#off-duty`, marks About, leaves 15.84 px below the fixed header, and retains zero overflow. Focused tests pass 2 suites and 24 tests; the optimized build passes at 38.68 KB vendor JS, 6.10 KB CSS, 4.33 KB main JS, and 784 B runtime JS gzip. No fact, asset, dependency, route, deployment, domain, commit, or branch state changed.

## DEC-037: Give the signature bee sole ownership of the career handoff

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The generated bee was designed and tested as the signature Experience interaction, including accessible busy text, visual confirmation, delayed smooth navigation, reduced-motion behavior, and restored idle state. The same hero also placed `View the track record` immediately before `Email me`, creating a second text control to the same `#experience` destination. On desktop both duplicate controls appeared together. On 280-390 px portrait the bee action was already visible in the opening viewport, while the duplicate did not appear until 448-499 px below it.

### Decision

Remove the duplicate `View the track record` link. Keep the bee portrait as the only hero-local Experience handoff and retain the primary navigation as the plain non-signature route. Promote the existing mailto action to the one filled text CTA and label it `Email Jason`, giving the hero two distinct choices: explore through the bee or contact Jason directly.

Keep portrait-mobile email width equal to its content field. At 36 rem and above, cap the action group at 20 rem. Repeat that cap in the established 35-63.99 rem short-landscape query because 568 px is 35.5 rem and otherwise falls between the base and tablet rules. Preserve every destination, email address, proof point, bee state transition, asset, section ID, navigation label, and non-hero Contact link.

### Alternatives considered

- **Keep both Experience controls:** rejected because adjacent controls with the same destination weaken the signature interaction and add a redundant keyboard stop.
- **Remove the bee action instead:** rejected because the bee is the user-requested visual identity, already has a complete accessible state cycle, and is the more memorable handoff.
- **Replace the duplicate with GitHub:** rejected because the hero needs one direct-contact action, while GitHub already has a clear destination in Contact and adding it would restore two generic text actions.
- **Keep `Email me` as the label:** rejected because `Email Jason` is self-contained in navigation and assistive contexts without relying on the preceding first-person paragraph.
- **Let the single CTA fill the entire desktop column:** rejected after the 568 px seam produced a 512.8 px horizontal bar. A 320 px cap keeps it deliberate and still leaves a generous target.
- **Cap portrait mobile as well:** rejected because its narrower content fields already produce appropriate 224.8-335.2 px controls, and a smaller offset button would add asymmetry without value.

### Evidence

- Rendered source and DOM contain one hero-local `#experience` link, the bee, and one `.hero-actions` link, `Email Jason`. Mounted-DOM and static regressions require that structure, the exact mailto destination, filled treatment, bounded responsive measure, and absence of both retired labels.
- At 280, 320, and 390 px the email link stays on one 51.2 px line and fills only the content measure; at 568, 768, 1024, 1440, and 1920 px it measures exactly 320 px. The corrected 568 px computed action max-width is 320 px instead of `none`.
- Real keyboard-origin focus on the 390 px email link produces `:focus-visible`, a paper outline, a six-pixel ink perimeter, and a fully visible in-viewport frame. The focusable sequence reaches skip, wordmark, three navigation links, bee, then email, with no duplicate hero career button.
- A real mobile bee handoff retains busy/following state, restores its idle label, reaches `#experience`, marks Experience, leaves 15.86 px below the header, and retains zero overflow. Eight-size traversal reports zero page overflow or broken images and in-bounds navigation/Contact actions. Focused tests pass 2 suites and 25 tests; the optimized build passes at 38.68 KB vendor JS, 6.10 KB CSS, 4.31 KB main JS, and 784 B runtime JS gzip. No fact, asset, dependency, external destination, route, deployment, domain, commit, or branch state changed.

## DEC-038: Let verified current-role facts carry the poster

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The current Okta role was visually prominent, but the yellow poster devoted its entire final row to `Details stay brief while the role is current. The record below shows how I work: own the problem, measure the result, and improve the system.` That copy explained why information was absent rather than adding career evidence. It occupied four lines and 85.8 px at 390 x 844, expanded to six lines at 1024 x 768, and contributed to a card consuming roughly half of each viewport. This repeated the minimum-bar weakness the user had already identified in the retired hero slogan.

### Decision

Keep the yellow grid, inner frame, `NOW` badge, date, company, and display title, but delete the current-role explanation and its CSS. Do not replace it with an inferred Okta responsibility, generic trait list, or another slogan. Reduce the poster minimum height from 28 to 22 rem so the verified prior-role track record surfaces sooner.

On mobile, let the label and title occupy opposite vertical edges. From 48 rem upward, keep the established offset title column but place the label across the full grid row: `NOW` anchors the top left and `JUL 2025 - PRESENT` anchors the top right. This uses existing facts to balance the poster after the paragraph is removed.

### Alternatives considered

- **Rewrite the paragraph to sound stronger:** rejected because any unsupported Okta result would be invented, while another generic work-style claim would remain filler.
- **Keep the paragraph for transparency:** rejected because the absence of current-role detail does not require a large defensive explanation; the clearly dated title already communicates the current position.
- **Delete the paragraph but preserve the 28/25 rem heights:** rejected because the empty area would retain the same cost while delaying stronger verified evidence below.
- **Replace the right side with skills or prior-role metrics:** rejected because those facts already have dedicated, better-contextualized sections and would blur current versus prior evidence.
- **Center the title after deletion:** rejected because it would abandon the established asymmetric editorial identity. Spanning the date across the top balances the same composition with factual content.

### Evidence

- Production DOM and source contain only `NOW`, `JUL 2025 - PRESENT`, `Okta`, and `Senior Software Engineer` inside the poster. The retired sentence, `.current-job-note` element, and all related CSS are absent. Focused mounted-DOM and static regressions bind those facts and the responsive composition.
- At 390 x 844 the poster falls from 448 to 352 px and from 53.1% to 41.7% of the viewport; the first prior role starts 96 px sooner. At 1024 and 1440 px the poster falls from 400 to 352 px and prior evidence starts 48 px sooner. The 280 px four-line title and all other three-line variants remain inside their cards.
- Settled production review at 390, 768, and 1440 px accepts the top-corner metadata and offset title. Eight-size traversal from 280 through 1920 px reports no page/card overflow, broken images, pending images, wrapped navigation rows, out-of-bounds Contact links, or duplicate hero actions.
- A real mobile bee handoff restores its idle label, reaches `#experience`, and leaves 15.86 px below the header; layout evaluation marks Experience. Visible-copy pre-flight finds no retired paragraph, em/en dash, middle dot, empty link, or missing href. Focused tests pass 2 suites and 26 tests; the optimized build passes at 38.68 KB vendor JS, 6.08 KB CSS, 4.24 KB main JS, and 784 B runtime JS gzip. No current-role claim, fact, asset, dependency, route, deployment, domain, commit, or branch state changed.

## DEC-039: Keep the personal story factual and the footer quiet

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

A settled 390/768/1440 journey audit found the visual system cohesive from the generated bee through career evidence, identity artwork, interest imagery, and Contact. Three copy fragments remained weaker than their compositions. `The bee stuck: focused, resilient, and built to work as part of something larger` turned a personal naming connection into a generic engineering trait list. `Email is the fastest route. GitHub has the longer trail` decorated simple contact instructions. `Wind in the name. Bee in the frame.` repeated the identity story as a centered footer motto without adding information.

### Decision

Explain the identity directly: Jason's Chinese name includes `風 (Fung)`, the character for wind; `蜂`, the character for bee, is pronounced the same way in Cantonese; that shared sound is why the bee became his mark. Keep `風 (Fung)` together typographically so the transliteration cannot orphan from the character.

Make Contact functional: invite product-engineering, complex-systems, or technical conversation, then state that email is direct and public code is on GitHub. Remove the footer motto instead of replacing it. Let copyright and `Back to top` form the two footer endpoints from 48 rem upward.

### Alternatives considered

- **Retain the bee trait list:** rejected because `focused`, `resilient`, and `part of something larger` are generic self-branding qualities and are not needed to explain the user's supplied reason for choosing a bee.
- **Write a more poetic bee paragraph:** rejected because the dedicated visual already supplies personality; the copy's job is to make the real language/name connection understandable.
- **Keep the route/trail metaphor in Contact:** rejected because it makes two familiar destinations less direct and continues the performative tone removed elsewhere.
- **Replace the footer motto with another brand phrase:** rejected because the identity panel already owns the wind/bee story and the footer needs navigation/provenance, not a second slogan.
- **Remove `Fung` and show Chinese characters only:** rejected after visual review because the English-language audience benefits from the Romanization and it directly connects the character to Jason's name.

### Evidence

- Rendered identity copy normalizes exactly to the decided wording, `風 (Fung)` remains one inline unit and inside its field from 280 through 1920 px, and the generic trait list is absent. The paragraph falls from seven to six lines at 390 px and nine to eight at 768 px without changing the panel's artwork or heading.
- Rendered Contact uses direct email/GitHub wording. At 1440 px it falls from four to three lines and shortens the section by 25.8 px. The footer has exactly two children; at 390 px its height falls from 114.8 to 87.8 px, while desktop retains its established height and balanced endpoints.
- Eight-size traversal reports no page overflow, broken/pending images, wrapped navigation row, out-of-bounds Contact/footer item, or retired phrase. Visible-copy pre-flight finds no em/en dash, middle dot, empty link, or missing href.
- A real mobile footer activation reaches `#top`, scrolls to zero, and restores focus to the wordmark. Focused tests pass 2 suites and 26 tests; the optimized build passes at 38.68 KB vendor JS, 6.07 KB CSS, 4.21 KB main JS, and 784 B runtime JS gzip. No career fact, asset, dependency, route, deployment, domain, commit, or branch state changed.

## DEC-040: Make the strength rail describe and support its content

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The horizontal rail after the hero usefully exposes eight verified strengths and already made itself focusable only when it overflowed. Its presentation weakened that structure: `WORKING SET` was vague developer-flavoured language, `SWIPE / SCROLL` narrated a standard interaction, and an amber star before every item created eight competing decorative marks. Production measurement showed overflow from 280 through 1024 px, but a real 390 px keyboard check also showed that the focused list did not advance when ArrowRight was pressed.

### Decision

Label the content `CORE STRENGTHS`. When the list overflows, show the concise functional hint `MORE SKILLS` and include a screen-reader-only instruction to use the left and right arrow keys. Remove all repeated star glyphs and use low-contrast inline hairlines between adjacent skills.

Preserve the eight skills, horizontal scroll-snap architecture, hidden scrollbar, and conditional focus/description behavior. Add explicit ArrowLeft/ArrowRight movement by 75% of the visible list width, with a 160 px minimum, clamped to the available range and respecting reduced-motion preference. Do not make a fitting list focusable or display an unnecessary hint.

### Alternatives considered

- **Keep `WORKING SET`:** rejected because it sounds like internal tooling language and is less clear than the list's existing accessible name.
- **Keep `SWIPE / SCROLL`:** rejected because it describes platform mechanics rather than the content available beyond the edge.
- **Retain or restyle the stars:** rejected because a repeated accent before every item adds decoration without hierarchy. Quiet separators communicate grouping with less visual noise.
- **Show every skill by wrapping the rail:** rejected because eight items form a long list and the single horizontal index is an intentional, compact handoff between hero and Experience.
- **Rely on browser-native arrow scrolling:** rejected after production verification showed focus and a focus ring but no content movement in the tested browser.
- **Keep the hint at desktop:** rejected because conditional disclosure already knows whether more content exists; a false hint and extra tab stop would be misleading.

### Evidence

- Settled 390 and 1440 px production review shows a quieter content index with clear hierarchy and no decorative star rhythm. The source and rendered page contain `CORE STRENGTHS` and conditional `MORE SKILLS`, with neither retired label.
- List width falls from 975 to 838 px. Overflow remains intentional from 280 through 768 px; at 1024 px the previous 69 px overflow disappears and the hint, accessible description, and tab stop are correctly absent. All eight skills remain present.
- Real 390 px keyboard verification moves from scrollLeft 0 to 261.6 px on ArrowRight and returns to 0 on ArrowLeft while retaining `:focus-visible`. The mounted-DOM regression verifies conditional focus/description, the hidden instruction, and calculated rightward movement.
- Eight-size traversal reports zero page overflow, broken/pending images, label/hint collision, out-of-bounds navigation, empty links, missing hrefs, or forbidden separators. Focused tests pass 2 suites and 26 tests; the optimized build passes at 38.68 KB vendor JS, 6.11 KB CSS, 4.38 KB main JS, and 784 B runtime JS gzip. No skill, career fact, asset, dependency, route, deployment, domain, commit, or branch state changed.

## DEC-041: Keep the signature hero continuous across tablet orientation

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The accepted 280-575 px portrait poster places the role/title in 52% of the opening viewport and the generated bee/action in the remaining 48%. The 568 px short-landscape and 1024 px desktop layouts use side-by-side splits. A fresh audit found that 576-1023 px tablets fell between those systems. Representative portrait heroes measured 1,584.6-2,253.4 px and placed the bee action 315.6-364.9 px below the opening viewport. The established landscape split stopped at a 480 px height cap; 768 x 576 through 1023 x 768 therefore became 1,734.3-1,817 px stacked heroes, with only a dark edge of the image visible at 800 x 600.

### Decision

Treat 576-1023 px as one responsive family with an orientation-specific composition. Portrait uses three grid rows: 52svh for role/title, 48svh for the generated bee/action, and an automatic row for the supporting introduction, evidence, and email action. Use a height-aware title size, `clamp(3.75rem, min(12vw, 10svh), 6.8rem)`, so short portrait tablets fit without giving tall tablets undersized type.

Landscape extends the already-proven split hero across all heights in the same width range. Keep its narrow editorial statement, 0.92/1.08 text-image columns, 100svh bee field, and supporting body below. Preserve the separate narrow-portrait poster below 576 px and desktop split from 1024 px.

### Alternatives considered

- **Keep the stacked tablet fallback:** rejected because the signature interaction disappears below the first viewport across an entire device family.
- **Use one split layout for both tablet orientations:** rejected because portrait would produce two narrow columns and diminish both the title and bee. The 52/48 vertical poster uses portrait space better.
- **Use one vertical poster for both orientations:** rejected because landscape has enough width for the proven split and too little height to spend half the viewport on a title field.
- **Add fixed pixel heights to the existing stack:** rejected because 576 x 800 and 912 x 1368 need different type and image proportions; viewport units preserve the opening composition instead of tuning individual devices.
- **Change the title, image crop, or action copy to force a fit:** rejected because the content and generated visual are already accepted. The defect was responsive ownership, not content length.

### Evidence

- At 576, 640, 768, 820, and 912 px portrait, title and action stay inside their fields, the visual ends within 0.02 px of the viewport, and the action ends 24 px before its bottom edge. Hero height is 291.6-407.8 px shorter than baseline. Settled 576, 768, and 912 px screenshots retain a clean two-line statement and readable bee crop.
- At 768 x 576, 800 x 600, 960 x 720, and 1023 x 768 landscape, hero height is 730.5-839.8 px shorter than baseline and the action is visible/contained. Settled 640, 800, and 1023 px review accepts the four-line narrow-column statement and dominant image.
- Full-page traversal at 280, 390, 575, 576, 768, 912, 568 landscape, 640 landscape, 800 landscape, 1023 landscape, 1024, 1440, and 1920 px reports no page overflow, broken/pending image, escaped title/action, navigation wrap, out-of-bounds link, empty link, missing href, or forbidden separator. The prior 280, 390, 568, 1024, 1440, and 1920 hero heights remain unchanged.
- Real bee activation at 768 x 900 and 800 x 600 exposes busy/following state, restores the idle label, reaches `#experience`, marks Experience, and leaves 16.5/16.1 px below the fixed header. Focused tests pass 2 suites and 27 tests; the optimized build passes at 38.68 KB vendor JS, 6.14 KB CSS, 4.38 KB main JS, and 784 B runtime JS gzip. No copy, career fact, asset, crop, dependency, route, deployment, domain, commit, or branch state changed.

## DEC-042: Identify the owner before the portfolio statement

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The fixed header displays the `Jason Yau` wordmark from 768 px upward but hides it on narrower mobile layouts to preserve the one-line navigation. The hero eyebrow stated the current role and start date, while the full name did not appear until the introduction after the generated-bee viewport, and only as `Jason`. Production measurement placed that introduction at y=776-900 on 280-576 px portrait. The full `Jason Yau` text therefore first appeared in the footer on the primary mobile experience. The 20-word introduction also repeated `a Senior Software Engineer at Okta` after the eyebrow had already established the same fact.

### Decision

Make the single hero eyebrow identify the person first: `Jason Yau`, followed by `Senior Software Engineer at Okta since Jul 2025`. Use two deliberate grid lines with the name in ink and the role detail in the existing soft tone. Preserve the same uppercase mono treatment and one-eyebrow count.

Reduce the supporting introduction to the existing proposition: `I turn ambiguous product, platform, and mobile problems into reliable production systems.` Do not replace the deleted self-introduction with a new slogan or trait list. Keep the dated current-role poster later in Experience as the detailed career record.

### Alternatives considered

- **Keep the name only in the hidden mobile wordmark and footer:** rejected because a personal site should identify its owner in the opening composition, especially when career-first scanning is the main use case.
- **Add `Jason Yau` as a separate large hero element:** rejected because it would create a fifth hero text layer and compete with the accepted statement.
- **Keep `I’m Jason...` after the bee:** rejected because it delays identity until after one viewport and repeats role/company instead of advancing the story.
- **Drop the start date from the hero:** rejected because the user explicitly supplied July 2025 and the compact role line can carry it without crowding the accepted statement.
- **Hide the new name line on desktop because the header already shows it:** rejected because responsive content should retain a stable ownership hierarchy; the small eyebrow repetition is functional provenance, not a duplicate call to action or slogan.

### Evidence

- The rendered hero shows `Jason Yau` and `Senior Software Engineer at Okta since Jul 2025` inside the opening title field at every tested size from 280 through 1920 px. At 280 px the role detail wraps to two lines; from 390 px it resolves to one line in portrait. Settled mobile, tablet, landscape, and desktop review finds no clipping or hierarchy conflict.
- The introduction is 12 words and contains no repeated self-introduction. It saves 56.6 px of hero height at 280/320, 28.3 px at 390/575/576, 34.8 px at 768/912 portrait, and 23.2 px at 800/1023 landscape. The new identity line adds 12 px at 568 x 320 but keeps the action fully visible in the initial viewport.
- Fourteen-size traversal reports zero page overflow, broken/pending image, escaped role/title/action, navigation wrap, out-of-bounds navigation, empty link, missing href, forbidden separator, or missing current-role fact. Every opening contains the full name and current detail; every introduction contains 12 words and no retired phrase.
- Real 390 portrait and 568 short-landscape bee activations retain their complete state cycle and reach Experience with 16.35/16.25 px header clearance. Focused tests pass 2 suites and 27 tests; the optimized build passes at 38.68 KB vendor JS, 6.12 KB CSS, 4.37 KB main JS, and 784 B runtime JS gzip. No career fact, proof point, asset, crop, dependency, destination, route, deployment, domain, commit, or branch state changed.

## DEC-043: Make the generated bee and statement share one responsive composition

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The accepted 1024+ desktop hero uses a deliberate side-by-side career and generated-bee split. Portrait gives the title and image 52/48 of the opening viewport, but a settled 280/390/768 audit showed that the two fields still met as complete paper and black rectangles. The hard horizontal seam made the generated art feel appended rather than art-directed. At 280 px, `that holds up.` also wrapped to two lines, creating a four-line statement. The established 568-1023 px landscape split repeated the four-line pattern; at 568 x 320 the italic descender ended about 11 px before the viewport bottom.

The typography pre-flight found one related craft defect: the italic hero, About, and Contact emphasis includes `p`, `y`, and `g`, but inherited 0.88-0.92 line-height and had no explicit descender reserve.

### Decision

Let the paper title field cut into the portrait image on one 24 px diagonal using `clip-path: polygon(0 1.5rem, 100% 0, 100% 100%, 0 100%)`. Apply it to both existing portrait families and nowhere else. The sharp edge follows the bee's rightward movement and preserves the site's sharp container/action geometry, while the circular monogram and wind/bee diagram remain identity marks rather than container radii.

Use a continuous narrow-portrait scale, `clamp(2.35rem, calc(22.55vw - 1.6rem), 3.9rem)`, and keep the emphasized phrase on one line. Use `clamp(2.4rem, calc(8.4vw - 0.55rem), 4rem)` plus the same phrase lock in the 568-1023 px landscape split. Give all hero/section-heading italic spans line-height 1.1 and 0.06em bottom padding.

Preserve the generated image, exact statement, current-role copy, 52/48 portrait allocation, bee action position and state cycle, supporting evidence, anchor IDs, routes, metadata, dependencies, downstream layouts, and 1024+ desktop split.

### Alternatives considered

- **Generate another bee image:** rejected because the accepted generated asset is legible and cohesive at every crop; the measured defect was how the page introduced it, not the asset itself.
- **Overlap the image with absolute positioning:** rejected because it would complicate the proven 52/48 viewport boundary and risk hiding the action or changing document flow.
- **Add the diagonal to desktop:** rejected because desktop already has an intentional architectural split and the same device would weaken it.
- **Use a fixed narrow breakpoint:** rejected after the first source candidate exposed a 20% type jump from 320 to 321 px. The continuous formula preserves hierarchy without a new seam.
- **Shrink all portrait type uniformly:** rejected because 390-575 px already supports the stronger accepted scale; the formula changes only the widths that need it.
- **Keep the four-line landscape statement:** rejected because settled 568/800 review showed avoidable crowding, while a width-derived scale preserves the image and statement hierarchy in three lines.
- **Rely on visual inspection for italic clipping:** rejected because explicit line-box and padding ownership is more robust across the fallback serif stack.

### Evidence

- Settled 280, 390, 568 landscape, 768 portrait, 1024, and 1440 px review accepts the diagonal portrait entry, the two/three-line narrow statements, the unchanged desktop split, and the reserved italic descenders. The 280 px title falls from four to two lines; all other tested layouts use at most three, and the emphasized phrase remains one line.
- The portrait scale moves continuously through 37.6, 42.05, 46.38, 46.56, 46.92, 55.58, and 62.4 px at 280, 300, 319, 320, 321, 360, and 390 px. Landscape resolves to 38.91, 44.96, 58.4, and 64 px at 568, 640, 800, and 1023 px, reducing each title from four to three lines. At 568 x 320, title-bottom clearance grows from about 11 to 40 px and hero height falls 18.55 px; all other measured hero heights remain unchanged.
- An 18-size settled traversal spanning 280-1920 px, both 319/320/321 and 575/576 boundaries, portrait/landscape, and 1023/1024 reports zero failure for title/role/action/image/navigation bounds, opening-viewport boundary, image readiness, clip ownership, emphasis wrapping, section-heading descender clearance, or horizontal overflow.
- Real 390 portrait and 568 short-landscape activations expose the accepted busy/following state, restore idle state, reach `#experience`, mark Experience, and leave 16.35/16.1 px header clearance. Copy/accessibility pre-flight finds no forbidden separator, retired phrase, broken/missing-alt image, empty link, or missing href. Focused tests pass 2 suites and 27 tests; the optimized build passes at 38.68 KB vendor JS, 6.19 KB CSS, 4.37 KB main JS, and 784 B runtime JS gzip. No copy, career fact, proof point, asset, crop, dependency, destination, route, deployment, domain, commit, or branch state changed.

## DEC-044: Let hobby copy name the person, not a portfolio archetype

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The generated Snowboarding and Boss fights cards had an accepted visual pairing, but their summaries, `One board, cold air...` and `Pattern, patience...`, could describe almost any polished developer portfolio. Neither used first person, and the games card omitted the user's explicit Mega Man preference. The career-first hierarchy did not need another section or longer biography; it needed two short lines that sounded like this person.

The first 280 px review after the copy change also exposed a separate narrow-boundary defect: the unchanged 34.4 px `Snowboarding` heading wrapped after `Snowboardi`, adding a weak orphan line even though the card itself remained contained.

### Decision

Use `I ride a snowboard. A clean line is reason enough for another run.` and `Mega Man is my pick. Difficult bosses keep me coming back.` Keep the established Snowboarding and Boss fights headings, generated assets, list/card semantics, and career-first ordering. Naming Mega Man in text is a personal preference, not permission to replace the original boss encounter with recognizable copyrighted character art.

Below 300 px, scale both hobby headings continuously with `clamp(1.85rem, calc(24.5vw - 2.44rem), 2.15rem)`. Rejoin the established heading size at 300 px. Do not apply `white-space: nowrap`; preserving natural text behavior is safer for text zoom and future content while the fluid scale solves the measured boundary.

### Alternatives considered

- **Keep the poetic summaries:** rejected because they are generic lifestyle prose and omit the user's supplied specificity.
- **Add more biography or hobby detail:** rejected because the section should remain a compact personal counterpoint to the career story, and additional claims were not supplied.
- **Put Mega Man in the heading or generated image:** rejected because `Boss fights` is the broader durable interest, while recognizable character art would cross the established original-imagery boundary.
- **Force both headings onto one line with `nowrap`:** rejected because it makes the narrow screenshot pass by removing normal fallback behavior. A continuous scale resolves the actual 280-299 px seam.
- **Shrink the heading at all mobile sizes:** rejected because 300-390 px already supports the stronger accepted hierarchy.

### Evidence

- The new Snowboarding copy uses four, three, two, three, and two lines at 280, 320, 390, 768, and 1440 px. The new Boss fights copy uses three, three, two, three, and two lines, improving the previous five/four/three/three/three pattern without changing the card grid.
- At 280 px the heading is 29.6 px, occupies one 36 px text line, and reduces the snow card from 440.4 to 391.6 px. At 290, 299, 300, and 302 px the heading remains one line at 32.108, 34.264, 34.4, and 34.4 px. Range-based verification reports one text rect for both headings at all 17 tested sizes from 280 through 1920 px.
- The 17-size production traversal reports exact new copy, no retired copy, ready imagery, contained navigation/cards/titles/copy, no copy or page overflow, no empty or href-less link, and no forbidden separator. A real 390 px About action reaches `#off-duty`, marks About with `aria-current="location"`, and retains 16 px fixed-header clearance.
- Final 390/1440 pre-flight reports zero broken/missing-alt image, empty link, missing href, forbidden separator, or page overflow. Focused tests pass 2 suites and 27 tests; the optimized build passes at 38.68 KB vendor JS, 6.22 KB CSS, 4.35 KB main JS, and 784 B runtime JS gzip. No career fact, metric, asset, dependency, destination, route, deployment, DNS, `CNAME`, commit, or branch state changed.

## DEC-045: Keep every career signal attributable

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The hero's `99.99% / 4.5M+ / 50%` values are verified BrokerBay outcomes, but `Prior-role track record` only distinguished them from current Okta work; it did not tell a first-pass reader which role produced them. The detailed timeline supplied that provenance later. The same timeline changed the resume's `Freelance` identity to `Independent` and combined two distinct official roles under the invented title `Early engineering chapters` with a slash-separated company label.

Fresh text extraction and visual review of both pages of the supplied April 2025 resume confirm `Business Services Officer` at Bank of East Asia in 2019, `Part-Time Software Engineer` at Future Solutions Laboratory in 2017-2018, and `Software Engineer` / `Freelance` in 2019-2020. The site did not need more resume detail; it needed the concise detail it already showed to be attributable.

### Decision

Name the hero group `BrokerBay outcomes` and the first metric `PubSub job reliability`. Keep all three values and the detailed BrokerBay outcome sentences unchanged.

Restore five distinct prior-role entries in chronological order. Use the resume's `Freelance`, `Business Services Officer` / Bank of East Asia, and `Part-Time Software Engineer` / Future Solutions Laboratory identities. Give the two restored rows one concise summary each using only supplied resume evidence. Do not infer months, Okta responsibilities, or additional outcomes.

At 320 px and below, replace only the proof group's three equal columns with a three-row value/label ledger. Keep 10 px labels instead of shrinking them; values remain one line and labels wrap naturally. Restore the established three-column grid at 321 px.

### Alternatives considered

- **Keep `Early engineering chapters`:** rejected because it is portfolio copy, not a role, and hides two materially different employers and responsibilities.
- **Keep the combined row but slash the two official titles:** rejected because the resulting title/company pair would be harder to scan than two compact chronological rows.
- **Publish every resume bullet:** rejected because the website is intentionally a concise career profile, not a duplicate two-page resume.
- **Remove the hero metrics as duplicate evidence:** rejected because the verified signals support fast recruiter scanning; explicit BrokerBay attribution resolves the credibility issue without removing useful proof.
- **Keep three narrow columns and reduce label size:** rejected after 280 px review showed a complete word split. The existing 10 px micro type is already the minimum accepted size; a responsive ledger preserves both wording and readability.
- **Shorten `PubSub job reliability` to a vaguer label:** rejected because the more precise system-level noun is the point of the provenance correction.

### Evidence

- The supplied resume's rendered pages and text extraction agree on the restored role, company, year, and responsibility pairs. Source and mounted-DOM regressions bind the five ordered periods, titles, companies, two restored summaries, exact BrokerBay group/metric labels, and absence of the retired combined identity.
- Settled 280 and 390 px proof review shows deliberate narrow-ledger and normal three-column compositions. At 280-290 px only `PubSub job reliability` uses two natural lines; every value and other label uses one. At 300-320 px all six value/label strings use one line. At 321 px computed proof ownership returns to three columns.
- Settled 390, 768, and 1440 px timeline review shows the official titles remain complete and contained. `Part-Time Software Engineer` uses two lines at 390/1440 and three within the narrower 768/1024 role column, without breaking a word or overlapping its company/detail fields.
- Seventeen-size traversal from 280 through 1920 px reports exact career/provenance content, correct ledger ownership, ready imagery, contained navigation/proof/role/company geometry, no item or page overflow, and no empty link, missing href, forbidden separator, or retired phrase. A real 390 px bee action reaches Experience, marks it with `aria-current="location"`, restores idle state, and retains 16.45 px header clearance.
- Final 390/1440 pre-flight reports the exact proof and five-role chronology, unchanged current Okta date, expected section/heading hierarchy, and zero broken/missing-alt image, empty link, missing href, forbidden separator, or page overflow. Focused tests pass 2 suites and 28 tests; the optimized build passes at 38.68 KB vendor JS, 6.3 KB CSS, 4.4 KB main JS, and 784 B runtime JS gzip. No current-role claim, metric value, asset, dependency, route, metadata, deployment, domain, commit, or branch state changed.

## DEC-046: Make interaction feedback belong to the input

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The site had a strong keyboard focus system and a complete bee click state, but ten ordinary link surfaces had no authored pressed response. Their visual affordances were expressed through `:hover` and `:focus-visible`, and every hover rule applied without a hover-capability media query. On touch hardware this relied on browser-specific synthetic or sticky hover rather than acknowledging the press itself.

A target-size audit across 280, 390, 768, and 1440 px found navigation at 44 px, the wordmark at 37.6 px, hero Email at 51.2 px, Contact rows at 76.8-82.4 px, and the footer return at 44 px. The scrollable skill list was the only focusable custom control below 24 px: 22.4 px at 280/390 and 19.2 px at 768. Its surrounding rail looked large, but only the list itself owned touch scrolling, focus, and arrow-key control.

### Decision

Keep focus and press as separate feedback channels. Preserve the existing two-tone/amber focus rings and raised focus cues. Add restrained `:active` feedback to the existing wordmark, navigation, footer, filled action, bee, and Contact links using only transform, background, filter, border, and color. Keep translation to 1.6 px and scale changes to 0.96-0.99 so the response reads as a press rather than a new animation.

Place all hover-only styling inside `(hover: hover) and (pointer: fine)`. Do not hide the browser tap highlight or add pointer JavaScript. When overflow makes the skill list focusable, give that list a 44 px minimum height and vertically center its unchanged items. Do not increase fitting desktop rails that are not interactive.

### Alternatives considered

- **Keep browser-default touch feedback:** rejected because it is browser-dependent and does not match the authored hover/focus language.
- **Reuse hover as the pressed state:** rejected because synthetic hover can remain after a tap and communicates presence rather than pressure.
- **Add ripple, magnetic, or spring physics:** rejected because the editorial surface needs restrained acknowledgement, not another visual motif or dependency.
- **Scale every pressed link:** rejected because full-row Contact scaling and navigation compression would create unnecessary layout shimmer. The response is chosen per surface.
- **Make the entire skill rail focusable:** rejected because labels and instructions are not the horizontally manipulated object; focus belongs on the list that scrolls.
- **Increase every skills rail to 44 px:** rejected because the 912-1920 px list fits, has no `tabIndex`, and does not need touch/keyboard operating space.
- **Remove the skill list's tab stop:** rejected because it would solve target size by removing keyboard access to off-screen skills.

### Evidence

- Optimized production CSSOM contains one fine-pointer media block with every hover selector and eight active rule blocks covering all existing link families. A real 1440 fine-pointer hover matches `:hover`, does not move focus, and lifts the Email action 2.4 px with the established ink/paper contrast.
- Keyboard checks at 390 px retain solid 2.4 px focus outlines; ordinary links keep the 6 px second ring, the bee retains its dedicated amber inset outline, the Email action lifts 2.4 px, and the Contact arrow travels 3.2 px diagonally. Focus behavior remains independent of hover capability.
- The interactive rail is exactly 44 px from 280 through 800 px; at 912-1920 px it is no longer focusable and remains 19.2 px inside the unchanged 80.8 px rail. Its accessible description remains attached. Real ArrowRight/ArrowLeft control still travels 0 to 261.6 to 0 with focus retained.
- Sixteen-size traversal reports target-height ownership, decoded imagery, contained navigation/action/Contact geometry, exact current identity, and zero overflow, empty link, missing href, or forbidden separator. Settled 390 review accepts the slightly taller interactive rail and fully contained amber focus ring.
- Real 390 bee activation retains its complete state cycle and Experience destination with 16.45 px header clearance. Final 390/1440 pre-flight confirms reduced-motion coverage, exact page/career hierarchy, and zero broken/missing-alt image, empty link, missing href, forbidden separator, or page overflow. Focused tests pass 2 suites and 28 tests; the optimized build passes at 38.68 KB vendor JS, 6.5 KB CSS, 4.4 KB main JS, and 784 B runtime JS gzip. No content, fact, asset, dependency, destination, state timing, route, metadata, deployment, domain, commit, or branch state changed.

## DEC-047: Make the typography native beyond Windows

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The performance audit found that the high-priority image path is already bounded and early: the 90.6 KB hero WebP is discoverable in the initial HTML, preloaded once, and rendered with eager/high-priority loading, async decoding, and intrinsic dimensions. Below-fold generated imagery is already lazy. Repeating image-priority work would not address a measured gap.

The type system did expose a mobile-first inconsistency. Its serif stack was `Constantia, Georgia, serif`; its mono stack was `Cascadia Mono, Aptos Mono, Courier New, monospace`. Both preferred faces are Windows-oriented. Apple therefore skipped directly to Georgia and Courier New even though the site relies on the type pairing for most of its visual identity. The no-JavaScript shell duplicated those lists separately, creating another drift point.

### Decision

Own one canonical pair of native font stacks in `src/index.css`. Keep Constantia, Cascadia Mono, and Aptos Mono first so the approved Windows rendering remains unchanged. Add `ui-serif`, Iowan/Palatino-class fallbacks, `ui-monospace`, SF Mono-class fallbacks, Consolas, and Liberation Mono before the existing terminal generic choices.

Have the React design tokens alias the canonical variables and have the no-JavaScript shell consume them directly. Do not add a web font, external request, font preload, JavaScript font loader, or new dependency. Keep the locked print-editorial light theme and all existing type sizes, weights, tracking, wrapping, and content.

### Alternatives considered

- **Add or self-host a custom web font:** rejected because it adds bytes, loading behavior, licensing/maintenance work, and a possible layout shift to solve a problem native platform faces already solve well.
- **Leave Georgia and Courier New as the only Apple paths:** rejected because Courier New weakens the compact technical voice and the site already claims mobile-first quality.
- **Put Apple faces before the Windows choices:** rejected because this would change the reviewed Windows composition instead of extending it.
- **Keep separate React and no-JavaScript stacks:** rejected because identical brand typography should have one source of truth.
- **Add `content-visibility` or a broader rendering optimization:** deferred because it can affect long-page anchor geometry and current-section observation; no measured rendering bottleneck justifies that risk.

### Evidence

- The built production CSS contains both canonical variables and their full platform fallbacks. A focused artifact regression binds the ordering, shared use, and removal of the prior direct three-family lists from `App.css`.
- At 390 px, before/after DOM geometry is exact for the H1, introduction, proof group, skill rail, and Snowboarding heading. Their x/y/width/height, font size, and line height do not move; computed stacks expand while the installed first-choice Windows faces continue to render.
- Six-size production traversal at 280, 390, 568 x 320, 768, 1024, and 1440 px reports expanded computed stacks, single-row contained navigation, correct adaptive skill-rail ownership, decoded hero imagery, and zero page overflow, empty link, missing href, or forbidden separator. Full-page 390/1440 traversal decodes both lazy decorative interest images at their intrinsic dimensions.
- A real 390 bee action still reaches Experience with 16.45 px fixed-header clearance. Settled 390/1440 screenshots retain the accepted composition. Final pre-flight confirms current Okta identity, slogan, five resume-backed prior roles, section/heading hierarchy, safe external links, and the locked light theme. Tests pass 2 suites and 29 tests; the optimized build passes at 38.68 KB vendor JS, 6.62 KB CSS, 4.4 KB main JS, and 784 B runtime JS gzip. `git diff --check` passes with only line-ending notices. No content, fact, asset, dependency, route, deployment, DNS, `CNAME`, commit, or branch state changed.

## DEC-048: Let the final chapters speak as directly as the hero

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

A settled full-journey review at 390 and 1440 px found the hero, career proof, current Okta poster, prior-role chronology, identity panel, generated interest pair, and Contact layout visually coherent. Adding another effect or layout family would create activity without addressing a weakness.

The remaining mismatch was voice. About said snowboarding and difficult games `explain most of the rest`, a broad conclusion that sounded like portfolio narration rather than Jason. Contact repeated the hero's durability idea as the generic craft invitation `Let's build something solid.` Its supporting paragraph also used `a good technical conversation`, a subjective qualifier that added length without making the contact route clearer.

### Decision

Keep every section, heading position, image, link, fact, and layout rule. Replace only those three strings. About should say `The bee comes from my name. Away from work, I snowboard and play difficult games.` Contact should say `Start with the hard part.` and `For product engineering or complex systems, email me directly. My public code is on GitHub.`

Preserve the same-family italic emphasis by putting `the hard part.` in the existing Contact span. Do not add a new CTA, claim, capability, current-role detail, metaphor, asset, animation, or breakpoint.

### Alternatives considered

- **Keep the existing wording:** rejected because the visual system is specific while both phrases could appear on many generic developer portfolios.
- **Rewrite the complete About/Contact chapters:** rejected because the identity explanation, hobby cards, email, GitHub route, and surrounding copy are already factual and clear.
- **Add more hobbies or biography:** rejected because the supplied interests already have one generated visual and one concise first-person statement each; career remains primary.
- **Use `Bring the hard problem`:** rejected because it reads more like a consultant acquisition line. `Start with the hard part.` stays confident without implying a service business.
- **Keep `good technical conversation` as a third contact category:** rejected because the new heading already creates the conversational invitation and the shorter body makes the actual routes easier to scan.

### Evidence

- Mounted-DOM and static-source regressions bind all three exact replacements and reject `explain most of the rest`, `something solid`, and `good technical conversation`.
- At 390 px the About copy and complete heading group retain their exact previous 77.4 and 246.09 px heights. The Contact title falls from 209.68 to 136.69 px, support copy from 103.2 to 77.4 px, content group from 546.48 to 447.69 px, and page from 7063 to 6964 px. At 1440 px the Contact title and group retain their previous 263.68 and 273.4 px geometry, so desktop balance does not shift.
- Eleven-size production traversal from 280 through 1920 px reports exact copy, no retired fragments, decoded imagery, one-row navigation, contained Contact links/footer, and zero page overflow, forbidden separator, or copy scroll clipping. At 568 x 320 the H2 has visible overflow only for the existing one-pixel italic-descender reserve; its emphasized span remains within the 512.8 px content width and settled review shows no clip.
- Real 390 Contact and Back-to-top actions preserve their destination/current/focus behavior with 16.1 px header clearance and final scroll position 0. Settled 390/1440 screenshots accept the clearer voice and stronger Contact rhythm. Final pre-flight confirms current Okta identity, exact proof/chronology, semantic imagery, safe links, and the locked light theme. Tests pass 2 suites and 29 tests; the optimized build passes at 38.68 KB vendor JS, 6.62 KB CSS, 4.39 KB main JS, and 784 B runtime JS gzip. No fact, metric, asset, style, dependency, route, metadata, deployment, DNS, `CNAME`, commit, or branch state changed.

## DEC-049: Let evidence determine career-row density

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The 390 px page devoted 2888.56 px, or 41.5% of its height, to Experience. That emphasis is appropriate for a career-first portfolio, and the five resume-backed roles should remain visible. The hierarchy inside the chapter was weaker: every prior role used the same 36 px vertical padding and 21.6 px gap even though only Full-Stack Engineer and Senior Programmer carry detailed outcome lists. The three concise earlier roles therefore occupied almost a complete mobile viewport together without carrying equivalent evidence density.

### Decision

Keep all five roles expanded and preserve their exact chronology, company, period, summary, and outcomes. Treat outcome-bearing roles as evidence-rich rows with the established spacing. Add `.experience-item--compact` only when a role has no outcomes, using 26.4 px padding and a 16 px gap below 768 px, then 36 px padding with 32 px gaps from 768 px and 48 px gaps from 1024 px.

Do not add accordions, disclosure controls, hidden content, a `show more` action, smaller body type, or a second career component. The distinction should remain a semantic presentation detail derived from existing data rather than a manually maintained list of job names.

### Alternatives considered

- **Keep every row equally spacious:** rejected because equal visual weight hides the difference between evidence-rich and supporting history, making the mobile chapter slower to scan.
- **Collapse or hide older roles:** rejected because the concise entries are verified career history and the site should remain immediately legible without interaction.
- **Remove summaries from older roles:** rejected because that would reduce useful resume-backed context to solve a spacing problem.
- **Compact all prior roles:** rejected because the BrokerBay and Hundsun outcomes are the page's strongest detailed career proof and need room to read.
- **Add an accordion or timeline carousel:** rejected because it adds state, accessibility work, and concealed content without improving the career story.

### Evidence

- At 390 px the two evidence-rich rows remain exactly 458.3 and 404.2 px. Each supporting row falls by 30.4 px; Experience falls from 2888.56 to 2797.36 px and the page from 6964 to 6873 px. At both 768 and 1440 px the evidence-rich rows remain exact while Experience falls by 72 px.
- Eleven-size production traversal from 280 through 1920 px reports exactly the intended three compact titles and two evidence titles, correct responsive padding/gap ownership, decoded imagery, one-line navigation, contained career children, and zero horizontal overflow. Settled mobile review accepts the tighter supporting-history rhythm and earlier Education entry.
- Real 390 bee/About/Contact/back-to-top actions retain destination and current-navigation behavior; the settled bee action restores idle state and leaves 16.45 px below the fixed header. Tests pass 2 suites and 29 tests; the optimized build passes at 38.68 KB vendor JS, 6.66 KB CSS, 4.4 KB main JS, and 784 B runtime JS gzip. No career content, fact, asset, dependency, route, metadata, deployment, DNS, `CNAME`, commit, or branch state changed.

## DEC-050: Name the verified range instead of another virtue

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

Fresh full-journey review found the visual system and page structure cohesive. The remaining headline mismatch was semantic. Hero already says `I build software that holds up.` Experience then said `Engineering that earns trust.`, restating durability as another abstract virtue that could appear on many engineering portfolios.

The verified career evidence offers a more specific organizing idea. Hundsun includes a 55% mobile render-frame-rate improvement; BrokerBay includes more than 4.5 million daily events. Together they describe the span from user-facing performance to distributed processing without inventing an Okta responsibility.

### Decision

Replace only the Experience H2 with `Frames to millions of events.` Keep `Frames to` in the base serif and `millions of events.` in the established same-family italic accent. Preserve the supporting paragraph, current Okta poster, proof values, five prior roles, typography scale, spacing rules, and every other visible string.

Do not add a LinkedIn route because the supplied resume contains no public-profile URL. Do not add an Okta note, infer current responsibilities, introduce another metric treatment, or resize the heading for this phrase unless rendered evidence shows a defect.

### Alternatives considered

- **Keep `Engineering that earns trust.`:** rejected because it duplicates the hero's durability register and does not distinguish Jason's career evidence.
- **Use `From mobile frames to millions of events.`:** rejected because the longer setup adds words the supporting paragraph and timeline already supply; the shorter title preserves poster force.
- **Use a generic range such as `Product to platform`:** rejected because it is accurate but no more distinctive than the retired line.
- **Add LinkedIn as the missing recruiter route:** rejected after visual inspection of both supplied resume pages found no LinkedIn or other public-profile URL to publish safely.
- **Fill the Okta poster or its empty desktop field:** rejected because no public current-role detail has been supplied and the existing poster uses the space deliberately.

### Evidence

- Mounted-DOM and static-source regressions bind the exact new title and reject both fragments of the retired title. Both pages of the April 2025 resume visually confirm the source frame-rate and daily-event facts; the site already presents those claims in their respective prior-role rows.
- At 280 px the H2 falls from 237.08 to 184.53 px and from four visible lines to three. At 320, 390, and 568 px it retains three lines with only 11.69, 13.26, and 17.6 px of additional height. From 768 through 1920 px, H2, accent, and complete heading-group geometry match Revision 48 exactly.
- Eleven-size production traversal reports the exact new title, no retired title, contained H2/accent fields, zero scroll clipping or page overflow, one-row navigation, current Okta identity, exact career hierarchy, ready eager imagery, complete links, and zero em/en dash. Settled 280/390/568/1440 screenshots accept the composition.
- Real 390 bee/About/Contact/back-to-top actions preserve destination, current-state, decoded-image, and focus behavior. Tests pass 2 suites and 29 tests; the optimized build passes at 38.68 KB vendor JS, 6.66 KB CSS, 4.4 KB main JS, and 784 B runtime JS gzip. `git diff --check` passes with only line-ending notices. No fact, paragraph, asset, style, dependency, route, metadata, deployment, DNS, `CNAME`, commit, or branch state changed.

## DEC-051: Give narrow mobile navigation deliberate separation

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The accepted fixed header keeps the three career-first destinations visible, but fresh target-rectangle measurement exposed an extreme-width defect. At 280 px the `JY` wordmark and the Experience target were separated by only 0.34 px. At 240-256 px the navigation wrapped into a second row, raising the header from 76.8 px to roughly 128 px and changing every anchor's fixed-header boundary.

### Decision

Preserve all three full navigation labels and their 44 px target height. At <=300 px, use 12 px horizontal header padding, 11 px navigation type, 0.02em letter spacing, and 5.6 px flex gaps. At the exact <=240 px edge, use 8 px padding and 10 px type. Keep all accepted metrics unchanged at 320 px and above.

Do not abbreviate or hide a destination, add a menu, make the header two rows, reduce target height, shrink the wordmark, or alter page content and section geometry.

### Alternatives considered

- **Keep the existing header:** rejected because 0.34 px is visually indistinguishable from collision and the 240-256 px wrap changes the fixed-header contract.
- **Accept support only from 280 or 320 px:** rejected because a small bounded rule can preserve the complete navigation at 240 px without affecting standard mobile widths.
- **Add a menu or hide labels:** rejected because three direct destinations are faster and clearer than extra state on this single-page portfolio.
- **Use a two-row header:** rejected because it consumes scarce mobile height and changes anchor offset behavior for a problem that typography and spacing can solve.
- **Shrink the JY mark:** rejected because the bee-led identity should not weaken at the most constrained width.

### Evidence

- The final header is one 76.8 px row at every audited width from 240 through 568 px and one 84.8 px row at 768 px and above. Wordmark-to-Experience separation is 17.07/11.74/35.74/55.74 px at 240/256/280/300 px; each narrow navigation gap is 5.6 px and every target remains 44 px high.
- Ten-size production traversal through 1440 px reports zero page/body overflow and exact accepted 12 px navigation type from 320 px upward. Settled 240 and 280 px screenshots show complete, legible labels and deliberate wordmark separation. All three generated images decode at their intended dimensions.
- A real 280 px Experience/About/Contact journey preserves the expected hashes and single current state with 15.84/16.01/16.4 px fixed-header clearance. JY restores `#top`, scroll 0, and wordmark focus. Tests pass 2 suites and 30 tests; the optimized build passes at 38.68 KB vendor JS, 6.69 KB CSS, 4.4 KB main JS, and 784 B runtime JS gzip. No content, fact, asset, dependency, route, metadata, deployment, DNS, `CNAME`, commit, or branch state changed.

## DEC-052: Match the wordmark target to the mobile control system

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

Fresh full-page mobile, desktop, and short-landscape review accepted the page composition. An exact target audit found one remaining control mismatch in the fixed header. Navigation anchors are 44 px high and every large page action meets or exceeds that height, but the JY back-to-top anchor inherited the visible circle's 37.6 x 37.6 px dimensions.

### Decision

Give `.wordmark` a 44 x 44 px minimum target while keeping the visible `.wordmark-mark` at 37.6 x 37.6 px. Let the extra target area remain transparent and participate in normal header layout so its real hit rectangle is measurable.

Do not enlarge the circle, add another wrapper or pseudo-element, change header padding, reduce navigation spacing, alter focus styling, or modify any content, section, asset, or behavior.

### Alternatives considered

- **Keep 37.6 px:** rejected because the primary brand/back-to-top action was the only main control smaller in both dimensions than the established 44 px header target system.
- **Enlarge the visible circle to 44 px:** rejected because the mark already has the right visual weight and the problem is target size rather than brand scale.
- **Use an absolutely positioned pseudo-element:** rejected because a real anchor rectangle gives clearer hit-area evidence and avoids invisible overlap that DOM geometry cannot expose.
- **Add padding and negative margins:** rejected because the simpler minimum-size contract preserves centering and lets the existing grid own spacing.

### Evidence

- The anchor is 44 x 44 px at 240-568 px and 116.71 x 44 px when the desktop name is visible. The mark and navigation rectangles have zero before/after geometry difference at eight shared audit widths. Responsive header heights stay 76.8/84.8 px; hero height has zero difference at every shared 320-1440 px check.
- At 240/256 px the real target gaps before Experience remain 10.67/5.34 px. Ten-size traversal reports single-row navigation, three 44 px navigation heights, and zero page/body overflow. Settled 240 px review shows no visible composition change; the established keyboard focus treatment is complete around the larger target.
- A real 256 px Experience activation preserves `#experience`, one current item, and 16.16 px fixed-header clearance. JY restores `#top`, scroll 0, wordmark focus, and `:focus-visible`; all generated images decode. Tests pass 2 suites and 30 tests; the optimized build passes at 38.68 KB vendor JS, 6.7 KB CSS, 4.4 KB main JS, and 784 B runtime JS gzip. No content, fact, visible asset, dependency, route, metadata, deployment, DNS, `CNAME`, commit, or branch state changed.

## DEC-053: Harden the no-JavaScript fallback without moving the mounted site

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The branded no-JavaScript fallback already preserves identity, current role, slogan, email, and GitHub access, but its shell used only `100vh`. On mobile browsers with dynamic browser chrome that unit can describe a less stable viewport than `dvh`. The fallback's italic `that holds up.` line also lacked the line-height and bottom reserve already used by the mounted hero to protect italic descenders.

### Decision

Keep `min-height: 100vh` first as the compatibility fallback, then add `min-height: 100dvh` as the modern override. Give `.no-script-content h1 span` `line-height: 1.1` and `padding-bottom: 0.06em`, matching the mounted headline's descender treatment. Lock property presence and ordering inside the existing static no-JavaScript regression.

Do not redesign the fallback, add JavaScript detection, add an image or dependency, alter visible copy or links, or change any mounted-page selector.

### Alternatives considered

- **Keep `100vh` only:** rejected because a two-line progressive enhancement improves current mobile viewport behavior without dropping legacy parsing support.
- **Replace `100vh` with `100dvh`:** rejected because retaining the older declaration first gives browsers that do not understand `dvh` a valid minimum height.
- **Redesign the fallback around the generated bee:** rejected because it adds weight and a second visual composition to a resilient content path that should remain fast and useful.
- **Create a JavaScript-driven fallback state:** rejected because it defeats the purpose of content that remains available when JavaScript does not execute.

### Evidence

- The source and optimized bundle contain `100vh` before `100dvh`, plus the exact `1.1` line height and `0.06em` bottom reserve. The focused regression passes inside 2 suites / 30 tests. The optimized build succeeds at 38.68 KB vendor JS, 6.7 KB CSS (+7 B), 4.4 KB main JS, and 784 B runtime JS gzip.
- Settled 390 px mounted-page geometry is exact before/after: 76.8 px header, 44 x 44 px wordmark, 296 x 44 px navigation, 1296.45 px hero, 335.2 x 187.18 px H1, 375.2 x 405.11 px bee visual, Experience at 1402.05 px, 6886 px document height, and zero horizontal overflow. Final pre-flight reports the intended identity, hierarchy, links, alt attributes, decoded imagery, and no duplicate IDs or overflow.
- An isolated `data:` fallback fixture was rejected by the in-app browser's URL security policy before rendering. No workaround or alternate browser surface was used. Direct rendered no-JavaScript evidence is therefore a disclosed gap rather than an inferred pass. No content, fact, asset, dependency, route, metadata, deployment, DNS, `CNAME`, commit, or branch state changed.

## DEC-054: Make every core strength visible without a scroll instruction

- **Date:** 2026-08-12
- **Status:** Accepted
- **Owner:** Root agent under the continuing improvement goal

### Context

The post-hero teal rail contains only eight short career signals, but at 390 px its 838 px horizontal track sat inside a 335 px viewport. TypeScript, Node.js, React, and part of Distributed systems were initially visible; Kubernetes, GCP, Mobile, and Observability were hidden. The page then exposed `MORE SKILLS`, made the list a focus target, and added arrow-key behavior. A concise recruiter scan had become an interaction to discover and operate.

### Decision

Render the eight strengths as a complete static responsive index. Use a two-column fallback through 300 px; a 3 / 3 / 2 asymmetric layout from 301-479 px; four columns from 480-1023 px; and one row from 1024 px upward. Preserve names, order, serif type, teal palette, sharp rules, and the rail's position between hero and Experience.

Remove the conditional overflow state, list ref, resize observer, hint, `tabindex`, `aria-describedby`, and arrow-key scrolling handler because the final list does not overflow or require interaction.

### Alternatives considered

- **Keep horizontal scrolling and improve the hint:** rejected because the content is short enough to expose completely and has higher value as one immediate career scan.
- **Use four columns at all ordinary mobile widths:** rejected after the first rendered candidate hard-broke Kubernetes and Observability and produced an inferior typographic rhythm.
- **Use two columns at every mobile width:** rejected because it adds unnecessary height at 390-568 px when a clean 3 / 3 / 2 or four-column layout fits complete words.
- **Remove skills entirely:** rejected because core technical strengths are part of the accepted career-first scope and complement the outcome evidence below.
- **Turn skills into pills or cards:** rejected because the established print-editorial system uses spacing and rules rather than generic UI containers.

### Evidence

- Thirteen-size production measurement from 240 through 1280 px reports all eight exact skills, every item contained, zero item/list/page overflow, no hint or focus target, and the intended 4/3/2/1 rows at the responsive boundaries. At 390 px all skills are visible in a 200.53 px rail; at 1024 and 1280 px the list is one 80 px strip.
- Settled 240/390/1280 screenshots accept complete words and the transition into `Frames to millions of events.` The first 4 x 2 candidate was rejected on screenshot evidence before acceptance. A real 390 px bee/About/Contact/back-to-top journey preserves the expected hashes, one current navigation state, 16.17/16.4/16.29 px clearances, restored bee state, scroll 0, wordmark focus, and visible focus.
- Tests pass 2 suites and 30 tests. The optimized build passes at 38.68 KB vendor JS, 6.75 KB CSS, 4.1 KB main JS, and 784 B runtime JS gzip; main JS falls by 314 B. Final 390/1280 pre-flight reports exact identity/content, decoded images, one-row navigation, non-wrapping actions, and zero broken link, duplicate ID, missing alt attribute, forbidden separator, or horizontal overflow. No content, fact, asset, dependency, route, metadata, deployment, DNS, `CNAME`, commit, or branch state changed.

## DEC-055: Use a career dossier with one living emblem as the research direction

- **Date:** 2026-08-12
- **Status:** Accepted for the bounded mobile proof-peek direction
- **Owner:** Root agent under the continuing improvement goal

### Context

After Revision 53, Jason stopped further self-directed iteration and requested a study of mature personal pages before more implementation. Eight live sites were reviewed against Jason's career-first, mobile-first brief at a controlled 390 x 844 viewport, with selected 1280 x 800 desktop comparison. The sites separate into recruiter-first career portfolios, compressed professional homes, minimal project indexes, personality-led publishing systems, and immersive interaction canvases.

### Decision

Use `career dossier with one living emblem` as the next design direction. Combine Brittany Chiang's explicit career hierarchy, Lee Robinson's editing discipline, Maggie Appleton's authored identity, and one bounded Rauno Freiberg/Josh Comeau level signature moment. For Jason, that signature moment remains the generated bee and its existing purposeful interaction.

Preserve the accepted desktop hero, current-role identity, attributed outcomes, static complete skills, career-first order, direct contact, restrained hobbies, and reduced-motion behavior. The first candidate experiment should address only the mobile first screen: reveal either a credible proof edge or direct action earlier without weakening the bee.

Do not add a blog, digital garden, empty project architecture, horizontal recruiter-critical content, interaction toys, sound, a terminal, or a second signature motif. This proposal authorizes no product implementation.

### Alternatives considered

- **Clone one reference:** rejected because each mature site is optimized around a different asset: public writing, open source, a design practice, or a conventional job portfolio.
- **Follow the most immersive references:** rejected because Rauno's intentionally horizontal canvas and Josh's interaction-rich biography make the medium part of their product; Jason's primary job is concise career communication.
- **Follow the most minimal references:** rejected because Lee, Emil, Paco, and Anthony can rely on known employers, projects, or public artifacts to carry missing chronology.
- **Keep iterating Revision 53 without research:** rejected by the explicit direction to stop and study mature pages first.

### Evidence

- The complete analysis, comparison matrix, live source links, preserved elements, rejected patterns, and bounded next experiment are recorded in `docs/research/personal-site-reference-study.md`.
- At 390 x 844, Lee's complete home fits one screen; Brittany exposes name, role, value proposition, social paths, and the start of About; Maggie exposes a distinctive disciplinary statement and current GitHub Next context; Josh makes portrait and greeting dominant before career detail; Rauno's intentionally horizontal document measured roughly 2,994 px wide; Anthony embeds proof in linked tool/team badges; Emil moves directly from current/past role to projects; Paco uses lateral project/writing discovery.
- Revision 53 at the same mobile viewport exposes Jason's name, exact current role/date, slogan, and bee, but the first screen ends inside the bee panel before direct email or outcome evidence. At desktop it already shows the full split hero, prior-role outcome strip, and email action above the fold.

## DEC-056: Prefer Cloudflare Pages for the static-site deployment

- **Date:** 2026-08-12
- **Status:** Proposed recommendation; awaiting hostname and deployment authorization
- **Owner:** Root agent under DR-001

### Context

The accepted personal-site candidate is a pure static Create React App build, and Jason asked for the cheapest, simplest, good-value subdomain deployment route. The current repository already includes a `gh-pages` publisher, but live GitHub Pages configuration still serves historical `master` with `yfyau.me`. The replacement domain `yfyau.com` is already delegated to Cloudflare nameservers but has no active website records.

### Proposed decision

Use Cloudflare Pages Free as the primary host and GitHub Pages as the fallback. Use Git-backed previews before attaching a public hostname. Do not add a server, Worker Function, paid plan, deployment token in the repository, new domain, framework migration, or custom CI pipeline for this static site.

Treat the canonical hostname as a separate user-facing decision. Prefer `yfyau.com` with `www` redirected to it for the cleanest personal address. If a subdomain must be canonical, use `www.yfyau.com`; use `jason.yfyau.com` only when the apex is intentionally reserved for a multi-site hub. Update all canonical/discovery metadata atomically if the current `https://yfyau.com/` choice changes.

### Alternatives considered

- **Repair and retain GitHub Pages:** credible zero-cost fallback and the fewest-new-platform route, but the current source/CNAME is stale and branch previews require more workflow work.
- **Vercel Hobby:** excellent CRA and preview support, but adds a second control plane while DNS is already on Cloudflare; Hobby is personal/non-commercial and quota-limited.
- **Netlify Free:** capable, but its current 300-credit hard limit charges credits for production deploys, bandwidth, and requests, making it less predictable than the static alternatives.
- **Rent a VPS or add a server:** rejected because this bundle has no runtime/backend requirement and would add cost, patching, certificates, and operational failure modes without product value.

### Evidence and reversal conditions

- The build has 26 files totalling 2,453,072 bytes; the largest is 1,386,999 bytes. Cloudflare Pages Free documents 20,000 files, 25 MiB per file, 500 builds/month, 100 custom domains/project, and free unlimited static-asset requests.
- GitHub's live API reports the repo public and Pages built from `master:/` with `cname=yfyau.me` and HTTPS enforced. Public DNS reports `yfyau.me` NXDOMAIN. DNS-over-HTTPS reports `yfyau.com` on Cloudflare nameservers, with no apex A answer and no `www` or `jason` record.
- Reverse the recommendation if the project gains server runtime needs that Pages cannot satisfy, if Cloudflare's static pricing materially changes, or if Jason values avoiding a Cloudflare Git integration more than centralized DNS and preview deployments. In that case, repair GitHub Pages and bind the selected subdomain directly to `yfyau.github.io`.
- Full evidence and the non-executed rollout/rollback sequence are in `docs/deployment-hosting-research.md`. No deployment, DNS, CNAME, branch, source, build output, commit, or push occurred during this decision.

## DEC-057: Use one Cloudflare front door and choose backend compute by workload

- **Date:** 2026-08-12
- **Status:** Proposed recommendation; awaiting project inventory and pilot authorization
- **Owner:** Root agent under DR-002

### Context

Jason clarified that roughly ten other candidate sites may require backend services or an actual running server. This makes a single static-host recommendation insufficient for the portfolio, but it does not justify pre-purchasing one server or forcing unknown applications into the same runtime. Their language, traffic, state, database, job, WebSocket/TCP, disk, region, uptime, and commercial requirements have not yet been inventoried.

### Proposed decision

Keep Cloudflare as the shared authoritative DNS, free first-level TLS, routing, and static-delivery front door. Give each public product one first-level hostname and prefer same-origin `/api/*` routing. Choose compute at the lowest workload rung that meets the product's real constraints:

1. Pages for static applications.
2. Workers for short request-driven APIs, webhooks, auth callbacks, and light schedules.
3. Workers plus Durable Objects for compatible WebSocket/session coordination.
4. One Cloudflare Container pilot for a bursty Docker/full-runtime workload that may scale to zero.
5. Railway for the first conventional always-on server that needs ordinary process, volume, TCP, and restart semantics.
6. A shared VPS only after several compatible always-on services have measured demand and consolidation is cheaper after patching, backups, monitoring, capacity, and shared-failure ownership.

Do not buy or configure backend capacity for ten hypothetical services. Inventory all candidates, select one representative backend-requiring pilot, verify its end-to-end behavior and monthly resource use, then reuse only the proven recipe for compatible projects.

### Alternatives considered

- **Put all ten on Cloudflare Workers:** rejected because Workers are request-driven and do not provide ordinary Linux/server semantics for arbitrary applications.
- **Put all ten on Cloudflare Containers:** rejected as a default because lifecycle and scaling are Worker-controlled and the newer platform should earn adoption through one representative pilot.
- **Put all ten on Railway:** rejected before measurement because the $5 Hobby price is a minimum toward usage rather than a flat ten-service bill; continuous RAM/CPU accumulates.
- **Buy one VPS now:** rejected because it creates operational ownership and a shared failure domain before any service has proven always-on demand or compatibility.
- **Use Vercel for everything:** rejected because Hobby is personal/non-commercial, Functions cannot act as WebSocket servers, and full server processes do not fit the function lifecycle.
- **Use Render Free for production backends:** rejected because free services sleep after 15 minutes, can take about a minute to wake, and share 750 monthly instance-hours.

### Evidence and reversal conditions

- Workers Free includes 100,000 requests/day at 10 ms CPU/invocation. Workers Paid is $5/month with 10 million requests and 30 million CPU-ms included; static assets remain free, and WebSocket messages do not count as requests after the upgrade connection.
- Workers Paid includes initial Cloudflare Container memory/CPU/disk allowances and meters active use. Containers run arbitrary `linux/amd64` images but are spun up and controlled through Worker code.
- Railway Hobby is a $5/month minimum credited against usage; published usage rates are $10/GB-month RAM, $20/vCPU-month CPU, $0.05/GB egress, and $0.15/GB-month volume storage. Hobby permits two custom domains per service, which is sufficient for one public first-level hostname plus an optional alternate on each service, not proof that ten services stay within $5.
- DigitalOcean currently lists a 1 vCPU/2 GiB Droplet at $12/month and 2 vCPU/4 GiB at $24/month. Lower-price VPS offers exist, but sticker price does not include Jason's operating time or remove the shared-outage boundary.
- On the current full Cloudflare DNS setup, Universal SSL covers `yfyau.com` and first-level names such as `project.yfyau.com`, not a deeper name such as `api.project.yfyau.com` without another certificate option.
- Reverse or refine the ladder after the ten-project inventory and pilot produce real requirements and resource evidence. Full research and official links are in `docs/deployment-hosting-research.md`. No server, container, Worker, Railway project, DNS record, credential, or external deployment was created.

## DEC-058: Let the portrait hero reveal proof before the first screen ends

- **Date:** 2026-08-12
- **Status:** Accepted local candidate
- **Owner:** Root agent under the continuing improvement goal

### Context

RS-001 found that Revision 53 already had a strong desktop career dossier with one living emblem, but its 390 x 844 opening used a fixed 52% title field plus 48% bee field. The supporting body began at 843.99 px, so the first screen ended inside the bee panel before the engineering argument, attributed outcomes, or direct action appeared. Jason authorized changing the local page to review the research direction.

### Decision

For portrait layouts below 1024 px, let title content determine its own track and bound the bee field with `clamp(18rem, 34svh, 22rem)`. Reduce only the portrait hero-body top padding from 3.5 to 2 rem and proof margin from 2.5 to 1.75 rem. Preserve content order so the page still reads identity, living emblem, supporting argument, attributed proof, and action.

Keep the 24 px diagonal entry, complete generated bee, existing image position, bee action and motion, every word and metric, short-landscape split, and 1024+ desktop grid. Update the source regression from the retired one-viewport poster equation to the new bounded proof-peek contract.

### Alternatives considered

- **Put Email and proof before the image:** rejected for the first implementation because it weakens the name-derived bee as the one signature moment and changes semantic reading order.
- **Shrink only the title typography:** rejected because the accepted statement geometry is strong and the excess came from viewport-locked tracks rather than oversized copy.
- **Show the numerical values by clipping their first line at exactly 844 px:** rejected because a fully visible provenance label is a cleaner scroll invitation than chopped numbers.
- **Apply the compact proportions to landscape and desktop:** rejected because those layouts already expose evidence/actions in appropriate first-screen compositions.
- **Keep Revision 53 unchanged:** rejected because it would ignore the reference study's clearest Jason-specific finding after the user explicitly asked to try the change.

### Evidence

- At 390 x 844, the title field falls from 438.88 to 374.77 px and the bee field from 405.11 to 288 px. The body begins at 662.78 instead of 843.99 px. `BrokerBay outcomes` ends at 835.29 px, inside the first screen; the hero falls from 1296.45 to 1079.24 px and the page from 6982 to 6764 px.
- Fifteen-size production geometry from 240 x 720 through 1440 x 900 contains the H1, role, navigation, bee action, and all decoded images with zero page/body horizontal overflow. Settled 280/390/768/1280 screenshots accept the mobile crop, proof reveal, and desktop parity.
- A real 390 px bee/About/Contact/back-to-top journey preserves confirmation and accessible busy state, the intended hashes/current labels, 15.88-16.56 px settled destination clearance, restored idle state, scroll 0, wordmark focus, and visible focus. Tests pass 2 suites / 30 tests; the optimized build succeeds at 38.68 KB vendor JS, 6.75 KB CSS, 4.1 KB main JS, and 784 B runtime JS gzip. No deployment, DNS, remote branch, `master`, commit, push, or merge changed.

## DEC-059: Make the opening an identity, not an employer scorecard

- **Date:** 2026-08-12
- **Status:** Accepted local candidate
- **Owner:** Root agent under Revision 55

### Context

Jason supplied the bee-at-computer icon he uses regularly and asked for subtraction. The hero's exact `Senior Software Engineer at Okta since Jul 2025` line felt over-specified, while a `BrokerBay outcomes` strip beside the claim-light current Okta entry made the prior employer look like the only place where work happened. Inventing current-role detail is not authorized and moving the same evidence elsewhere in the opening would not solve the hierarchy problem.

### Decision

Use the supplied bee-at-computer icon as a static personal mark. Keep the hero to Jason's name, `I build software that holds up.`, one short production-systems introduction, and one direct Email action. Remove the condensed proof group, generated portrait, Experience handoff, busy state, timers, overlays, cue text, and related interaction CSS.

Keep current and prior career facts where their provenance is explicit. The current poster continues to show `NOW`, `JUL 2025 - PRESENT`, `Okta`, and `Senior Software Engineer`. BrokerBay's verified outcomes remain only in the BrokerBay row. Rename the Experience chapter to the neutral `Experience.` and remove its generic explanatory paragraph.

Preserve the supplied image pixels. Present the original 460 x 460 PNG on its sampled `#fdfcff` light field with a circular identity crop, matching the existing round JY mark while structural layout remains sharp. Do not substitute a newly illustrated bee.

### Alternatives considered

- **Add Okta achievements to balance BrokerBay:** rejected because Jason has not supplied current-role responsibilities or outcomes and the site must not invent them.
- **Move BrokerBay proof just below the hero:** rejected because Jason asked for subtraction and the full attributed evidence already exists in Experience.
- **Keep the generated bee interaction but change its label:** rejected because the familiar personal icon is the stronger identity and a decorative Experience handoff adds another hero intent.
- **Use the model-edited transparent variant:** rejected after visual review because the model redrew proportions, linework, laptop, and expression despite strict invariants.
- **Use either local alpha-matte variant:** rejected because the soft matte removed white laptop/wing details and the hard key exposed noisy background pixels. The original is more faithful.

### Evidence

- At 390 x 844 the complete hero ends at 829.64 px and Email ends at 788.84 px. The hero contains no Okta, BrokerBay, proof group, or Experience link; the 226.43 px icon is decoded from the natural 460 x 460 source.
- At 1280 x 800 the H1 is exactly two rendered lines, Email ends at 776 px, the icon is 304 px, and the full hero ends at 800.8 px. Navigation remains one row.
- Six audited responsive sizes from 280 x 720 through 1280 x 800 report contained imagery, the exact concise hero text, zero hero Experience links, and zero page overflow. A real 390 px Experience journey preserves 16.56 px fixed-header clearance, exact Okta facts, and attributed BrokerBay outcomes; return-to-top restores scroll 0 and focus.
- Tests pass 2 suites / 28 tests. The optimized build succeeds at 38.69 KB vendor JS, 6.01 KB CSS, 3.68 KB main JS, and 784 B runtime JS gzip. The public/build icon hashes match. Nothing was published, deployed, committed, pushed, merged, or applied to DNS or `master`.

## DEC-060: Use one persistent bee mark and a three-card interest system

- **Date:** 2026-08-12
- **Status:** Accepted local candidate
- **Owner:** Root agent under Revision 57

### Context

After Revision 55, Jason asked to remove the complete `One sound. Two meanings.` explanation and suggested placing his familiar icon where the top-left `JY` mark lived. Before that revision closed, he added coffee as a current interest. Keeping the icon both in the header and hero would repeat the same identity signal; deleting explanatory copy without collapsing its track would leave a visibly unfinished About panel; forcing three cards into narrow tablet columns would weaken all three.

### Decision

Use Jason's exact supplied bee-at-computer icon once, as the persistent top-left wordmark. Remove its hero duplicate and let the opening become a text-led composition. Remove the complete requested identity-copy block without substitute wording, while retaining the authored wind/bee visual study as a full-width panel.

Add Coffee as the third static Off duty card. Use one optimized project-local photograph in the established dark editorial language. Render interests in one column below 768 px, as Snowboarding and Boss fights above a full-width Coffee card from 768 through 1023 px, and as three equal columns from 1024 px. Keep all imagery decorative to assistive technology because the adjacent headings and copy carry the meaning.

### Alternatives considered

- **Keep the icon in both header and hero:** rejected as duplicate identity intent after Jason explicitly preferred the top-left placement.
- **Replace the removed name explanation with shorter copy:** rejected because Jason asked for removal and the existing visual already carries the association without another essay.
- **Use three columns from 768 px:** rejected because the approximately 229 px cards would force large headings and copy into unnecessarily narrow measures.
- **Use a CSS coffee illustration or a generic external stock URL:** rejected because the existing interest system is built from authored project-local raster imagery, and a remote dependency or placeholder would lower consistency.

### Evidence

- At 390 px the hero is 587.21 px high, the H1 is fully contained, the supplied icon renders at 38.88 px from its natural 460 x 460 source, and the three interest cards are 333.6 px wide in one column. The requested identity copy, its wrapper, and the hero image wrapper are absent.
- At 768 px Snowboarding and Boss fights are 343.6 px each and Coffee spans 687.2 px. At 1024 and 1280 px all three cards share one row at 301.6 and 378.4 px each. Six audited responsive sizes report one-row navigation and zero horizontal overflow.
- The generated Coffee asset is `public/interest-coffee-v1.webp`, 1600 x 731 and 66,058 bytes, with no logo, text, or watermark. Tests pass 2 suites / 28 tests and the production build succeeds. A real 390 px navigation/return journey preserves 16.54 px clearance, current-state semantics, `#top`, scroll 0, and wordmark focus. No deployment or external state changed.

## DEC-061: Govern the site as technical editorial with one human signature

- **Date:** 2026-08-12
- **Status:** Superseded by DEC-063 after Jason selected Playful Engineer
- **Owner:** Root agent under Revision 58 planning

### Context

Jason rejected the remaining Wind/Bee section and found the white opening too plain, then correctly stopped the isolated color response because Revision 57 reads as a mixture. The page currently combines editorial typography, a playful cartoon wordmark, cinematic hobby imagery, an industrial current-role poster, a language-study motif, and a separate amber contact campaign. Local quality does not create global coherence when color, image, and section treatments have no stable roles.

### Proposed decision

Adopt `Technical editorial with one human signature` as the north star. Career chronology and attributed outcomes remain the sole proof system. The supplied icon remains once, as the persistent personal signature. Off-duty photography remains one bounded human chapter. Paper is the dominant reading surface; ink carries content and rules; teal carries structural depth; amber is reserved for current or active emphasis. Display serif, mono facts, sharp geometry, and low motion each retain one stable job.

Remove the complete Wind/Bee explanatory story and do not replace it with another identity essay or decorative system. Recompose Hero, Experience, Off duty, and Contact as chapters of the same palette and geometry rather than assigning each an independent art direction. Replace the old photoreal bee/wind social image only after the approved page system provides a canonical replacement.

### Alternatives considered

- **Playful engineer, mascot-led:** more distinctive but makes the mascot compete with career proof and requires replacing the photographic system.
- **Cinematic dark tech:** visually strong but risks generic AI-tech styling, weakens recruiter scanning, and does not naturally fit the supplied cartoon icon.
- **Continue targeted section tweaks:** rejected because changing only the Hero color would preserve the underlying mixture Jason identified.

### Approval and reversal conditions

- Approval requires Jason to accept this north star or select one of the two materially different alternatives. Proposed does not authorize product implementation.
- Reverse or refine if Jason wants personality or cinematic atmosphere to lead over career clarity. That is a brand-level change and should be approved before assets or layout are rebuilt.
- Full governing rules and the current-system diagnosis are in `docs/design-direction.md`. Product source remains at Revision 57; no source, asset, test, build, metadata, dependency, deployment, DNS, commit, push, merge, or `master` state changed in this planning phase.

## DEC-062: Compare three reversible full-page systems before choosing Revision 58

- **Date:** 2026-08-12
- **Status:** Completed; Jason selected B and DEC-063 governs the default route
- **Owner:** Root agent under Revision 58 concept study

### Context

Jason preferred choosing from three visible frames before deepening one framework. Static prose alone could not reveal how typography, palette, geometry, career hierarchy, personal imagery, and contact rhythm behave together. Applying three competing systems to the default route would make the product baseline unstable and obscure which changes belonged to which direction.

### Decision

Keep Revision 57 on the default route and add one query-gated Concept Lab at `?concepts=1`. Render the three materially different directions as complete page compositions using the same shared statement, factual current role, prior career context, three existing interest images, direct email intent, and familiar icon. Provide an All comparison and isolated A, B, and C views. Give each frame independent anchors and scoped styles.

Treat the three frames as decision artifacts, not accepted product implementation. Do not update metadata, assets, dependencies, deployment, DNS, remote branches, or `master`. After Jason chooses, deepen only that system and retire the Concept Lab when it no longer has decision value.

### Alternatives considered

- **Three static screenshots:** rejected because they cannot expose responsive behavior, navigation, image loading, or full-page rhythm.
- **Three Hero-only variants:** rejected because the current problem is cross-section coherence, not only the opening treatment.
- **Apply the recommended editorial system directly:** rejected after Jason explicitly requested a three-frame choice before deeper iteration.

### Evidence

- A, B, and C render as isolated complete frames and together in All mode. The default route remains Revision 57.
- At 390 x 844 and 1280 x 800 every inspected frame has zero internal and document horizontal overflow; desktop Hero statements occupy two visual lines; frame-specific anchors are unique; reached interest images decode at natural width 1600.
- Tests pass 3 suites / 30 tests. The production build succeeds at 38.68 KB vendor JS, 8.42 KB CSS, 5.51 KB main JS, and 784 B runtime JS gzip. Nothing was published or committed.

## DEC-063: Adopt Playful Engineer as the default portfolio system

- **Date:** 2026-08-12
- **Status:** Accepted local candidate
- **Owner:** Root agent under Revision 59

### Context

Jason selected frame B after comparing three complete mobile-first systems. The default Revision 57 page still used the rejected editorial mixture and retained the Wind/Bee story, while the Concept Lab proved that a pale-blue, honey-yellow, heavy-sans system could carry the same factual career content with more personality.

### Decision

Apply Playful Engineer to the default route as a career-first design system. Use navy ink, pale blue, warm paper, and honey yellow across the complete page; heavy native sans for main hierarchy; mono only for labels, dates, and compact technical facts; rounded bordered surfaces and restrained offset shadows for tactile emphasis. Keep the supplied icon once in the persistent top-left wordmark.

Make Experience the credibility anchor: the current Okta entry receives the strongest honey panel, while all prior roles live in one calm white chronology container with attributed outcomes and dividers. Let Off duty carry the highest playful color field and use an asymmetric Snowboarding / Boss fights / Coffee layout. Remove the complete Wind/Bee explanation instead of translating it into another motif. Align the no-JavaScript shell and social preview with the same system.

Keep motion at state-feedback intensity only. Preserve the Concept Lab temporarily as a reversible design artifact, and leave deployment, DNS, branches, dependencies, and external state unchanged.

### Alternatives considered

- **Keep B only as a concept page:** rejected because Jason explicitly chose it as the framework to deepen and the default route would remain the incoherent baseline.
- **Make the icon or mascot the Hero:** rejected because the career promise should remain primary and the familiar mark already supplies sufficient personality in the header.
- **Use repeated equal cards for every section:** rejected because Experience needs chronology and Off duty benefits from asymmetry; one generic card grid would flatten the information hierarchy.
- **Retain the old photoreal bee/wind sharing card:** rejected because it republishes the concept Jason deleted and conflicts with the approved palette and icon.

### Evidence

- The default page renders the selected system at 390 x 844 and 1280 x 720 with one-row navigation, legible Hero hierarchy, contained cards, and no browser console errors or warnings.
- At the mobile document end, Contact becomes the single settled current navigation item; its full-viewport minimum resolves the previous About-state ambiguity without adding a scroll listener.
- Source/static contracts assert removal of Wind/Bee markup, Playful tokens/layouts, exact career facts, interest assets, fallback alignment, and the 960 x 504 PNG sharing card. Tests pass 3 suites / 30 tests and the optimized production build succeeds. Nothing was published, deployed, committed, pushed, merged, or applied to DNS or `master`.

## DEC-064: Refine the selected Playful product and retire the comparison surface

- **Date:** 2026-08-12
- **Status:** Accepted local candidate
- **Owner:** Root agent under Revisions 60-63

### Context

Frame B was already selected, but the production route still shipped the complete three-frame Concept Lab and an unreferenced generated Hero bee. Portrait Heroes spent 360-430 px on functional empty space before their supporting copy. The Hero used a partial greeting while the rest of the site identified Jason fully. Browser/install surfaces still used the superseded JY seal rather than Jason's supplied bee icon. During final review Jason also explicitly removed the desktop `YFYAU.COM` edition label and supplied his LinkedIn URL.

A fresh isolated read-only reviewer independently accepted the visual system and responsive hierarchy. Its only P1 findings were those two new explicit requirements: remove the edition label without replacement and add LinkedIn as a scoped contact entry.

### Decision

Keep Playful Engineer as the single product path. Group portrait Hero content at the start of a `min(44rem, 80dvh)` field so the strengths rail enters the first mobile viewport, while restoring a full-height two-column composition only from 64 rem. Use `Jason Yau` as the factual Hero identity.

Retire the Concept Lab source, styles, and tests after the selection decision, along with the unreferenced generated Hero bee. Replace the obsolete JY favicon/touch/manifest family with the exact supplied 460 x 460 bee icon and align browser/manifest color to the Playful sky. Remove `YFYAU.COM` from the React header, CSS, and no-JavaScript header without substitute text. Add `https://www.linkedin.com/in/yfyau/` beside Email and GitHub, with safe new-tab attributes, no-JavaScript parity, and JSON-LD `sameAs` parity.

This supersedes only DEC-063's temporary Concept Lab retention. It does not reopen the chosen design direction or authorize deployment, DNS, dependencies, commits, pushes, merges, or `master` changes.

### Evidence

- The independent reviewer audited 280, 390, 768, 768 x 480, 1024 x 480, and 1440 widths with zero horizontal overflow, correct anchor clearance/current states, working return-to-top behavior, decoded images, and zero browser console messages.
- Post-fix browser checks at 390 x 844 and 1280 x 720 confirm no visible `YFYAU.COM`, exactly one React LinkedIn Contact action with the required target/rel, zero horizontal overflow, correct Contact clearance, and zero console messages.
- Focused tests pass 2 suites / 29 tests. The production build succeeds at 38.69 KB vendor JS, 4.05 KB CSS, 3.52 KB main JS, and 784 B runtime JS gzip. Only the pre-existing Browserslist freshness notice remains.
- Nothing was published, deployed, committed, pushed, merged, or applied to DNS or `master`.

## DEC-065: Make the desktop Hero content-driven rather than viewport-driven

- **Date:** 2026-08-12
- **Status:** Accepted local candidate
- **Owner:** Root agent under Revision 65

### Context

Jason's 1328 x 1187 desktop screenshot exposed a structural proportion problem. The Playful Hero forced itself to `100dvh`, while its title and supporting action ended at roughly 328 px. The remaining 859 px had no visual counterweight, content, image, or transition, so it read as an unfinished canvas rather than intentional whitespace. The screenshot still displayed a cached pre-Revision-63 `YFYAU.COM` label, but the latest source and build already excluded that label; the whitespace defect remained current.

### Decision

Preserve the accepted statement, two-column split, palette, typography, CTA, strengths rail, anchors, and all mobile/tablet rules. From 64 rem upward only, replace the full-viewport lock with a bounded `clamp(36rem, 62dvh, 44rem)` Hero, vertically center the existing content, and use the existing strengths rail as the Hero's bottom visual anchor. Let the Experience opening enter tall desktop first screens as the next evidence beat.

Do not fill the void with ornamental grids, duplicate mascot artwork, fake interface graphics, decorative text, new claims, or motion. The intended sequence is statement, capabilities, then evidence. This is a spacing/rhythm correction, not a new design direction.

### Evidence

- At 1328 x 1187 the Hero becomes 704 px tall; empty space after the content falls from about 859 to 235 px. The strengths rail ends at 770 px and the Experience chapter begins inside the first viewport.
- At 1280 x 720 the Hero/rail end at 576/642 px. At 1024 x 480 the bounded minimum preserves the full statement, intro, and CTA. The unchanged 768 tablet and 390 mobile rules retain their accepted layout. All four widths report zero horizontal overflow.
- Experience and About navigation settle at about 104 px with a 76.8 px fixed header; all interest images decode at their intended dimensions; the console has no messages.
- Tests pass 2 suites / 29 tests. The optimized build passes at 38.69 KB vendor JS, 4.07 KB CSS, 3.52 KB main JS, and 784 B runtime JS gzip. No external or Git publishing action occurred.

## DEC-066: Unify Off-duty as one Playful illustration series and use Sekiro's Wolf

- **Date:** 2026-08-12
- **Status:** Accepted local candidate
- **Owner:** Root agent under Revision 66

### Context

The accepted page used one Playful sky, honey, navy, rounded-border system, but its three large hobby images remained dark cinematic photography/concept art. They read as imported from a different brand. The Boss fights copy also named Mega Man, while Jason's intended signature difficult game is Sekiro and the scene should feature Wolf rather than a generic dragon.

### Decision

Replace all three Off-duty images together instead of patching only the game card. Use Jason's exact bee icon as a linework/tone reference and generate a matched set with thick expressive navy outlines, flat sky/honey/off-white color blocks, restrained paper grain, no gradients, no text, no logos, and crop-safe 3:2 compositions. The subjects are a snowboard carve, a Wolf-like one-armed shinobi facing an armored samurai, and pour-over coffee. The bee does not appear in these scenes.

Optimize the accepted images to 1280 x 853 project-local WebPs. Remove the superseded uncommitted cinematic WebPs after integration. Change the visible game copy to `Sekiro is my pick. Learning a hard boss is half the fun.` Preserve the existing card layout, section hierarchy, career content, navigation, dependencies, and external state.

### Evidence

- `interest-snow-v3.webp`, `interest-sekiro-v1.webp`, and `interest-coffee-v2.webp` decode at 1280 x 853. Browser review at 390 x 844, 768 x 1024, and 1280 x 900 accepts their stacked, two-column, and asymmetric desktop crops with zero horizontal overflow.
- The live card view visibly shares one palette, outline weight, texture, and illustration medium. The Boss fights card depicts the intended shinobi/samurai encounter and the rendered page contains Sekiro but not Mega Man.
- Tests pass 2 suites / 29 tests. The optimized production build passes at 38.69 KB vendor JS, 4.07 KB CSS, 3.51 KB main JS, and 784 B runtime JS gzip. Browser warning/error logs are empty. Nothing was published, deployed, committed, pushed, merged, or applied to DNS or `master`.

## DEC-067: Treat the desktop Hero and strengths rail as one viewport composition

- **Date:** 2026-08-12
- **Status:** Accepted local candidate
- **Owner:** Root agent under Revision 67

### Context

Revision 65 corrected a top-aligned 100dvh canvas by bounding the desktop Hero to 704 px at 1328 x 1187. That exposed Experience immediately, but Jason correctly identified the opposite problem: the opening now read as a shallow horizontal banner and the core statement lost presence. Jason proposed reconsidering a full viewport now that the content group is vertically centered rather than top-aligned.

### Decision

Compare three renders at the same 1328 x 1187 viewport: the 704 px bounded baseline, a centered 100dvh Hero, and a centered Hero whose height is one viewport minus the strengths rail. Select the third. From 64 rem upward, use `min-height: calc(100vh - 4.15rem)` with the existing centered two-column grid, padding, type, and action. The existing 4.15 rem rail becomes the visual baseline of the first screen.

Do not add decorative filler, imagery, motion, copy, or a new layout. Preserve mobile, tablet, short-landscape, navigation, content, palette, typography, and all external state. Use desktop-only `vh` because the repository's legacy CSS compiler rejects `dvh` inside `calc()`; the independent mobile rules continue to use dynamic viewport units where supported.

### Evidence

- Variant A produced a 704 px Hero and exposed Experience but read as compressed. Variant B produced a balanced 1187 px Hero but moved all capability evidence below the fold. Variant C produces a 1120.8 px Hero plus 66.2 px rail at 1328 x 1187, and a 653.6 px Hero plus 66.2 px rail at 1280 x 720. Both sums land at the viewport baseline.
- At 1024 x 480 content safely expands beyond the calculated minimum to 446.9 px; the Email action remains inside the Hero. At 768 x 1024 and 390 x 844 the unchanged breakpoint rules retain their prior geometry. All audited sizes have zero horizontal overflow and browser warning/error logs are empty.
- Tests pass 2 suites / 29 tests. The production build passes at 38.69 KB vendor JS, 4.06 KB CSS, 3.51 KB main JS, and 784 B runtime JS gzip. Only the pre-existing Browserslist freshness notice remains. Nothing was published, deployed, committed, pushed, merged, or applied to DNS or `master`.

## DEC-068: Keep source on code and publish a build-only master branch

- **Date:** 2026-08-12
- **Status:** Accepted and deployed
- **Owner:** Root agent under Revision 68

### Context

Jason explicitly requested commit and push before deployment. The repository historically separates editable React source on `code` from compiled GitHub Pages artifacts on `master`. Today's verified Pages state still sourced production from `master`, while the old package script sent `gh-pages -d build` to an unused `gh-pages` branch. The historical production CNAME also pointed to expired `yfyau.me`; public `yfyau.com` DNS currently has Cloudflare authority but no apex A answer or `www` CNAME.

### Decision

Commit the complete accepted redesign on `code`, push and verify that remote SHA, then deploy the optimized build to `master` with `gh-pages -d build -b master`. Keep the emitted build free of a CNAME so the obsolete `yfyau.me` binding is not republished. Treat `https://yfyau.github.io/` as the immediate verified production URL.

Do not merge source into `master`, deploy to the unused `gh-pages` branch, create a Cloudflare Pages project, or change DNS inside this release. Binding `yfyau.com` is a separate externally visible cutover that must configure hosting and DNS together and then verify HTTPS and canonical redirects.

### Evidence

- Source commit `046a5d8 Redesign personal website` was pushed to `origin/code` and confirmed by `git ls-remote` before deployment. The release gate was clean and passed 2 suites / 30 tests plus the optimized production build.
- `npm.cmd run deploy` rebuilt and returned `Published`. Remote `master` advanced from `7d52af1` to build-only commit `a937256`; remote `code` remained at `046a5d8` through the deployment action. Raw `master/index.html` contains the new hashed assets and raw `master/CNAME` returns 404.
- The production home, CSS, JS, bee icon, three interest WebPs, OG image, robots file, and sitemap all return HTTP 200 with expected content types. Browser checks confirm the current visible copy and layout at mobile and desktop sizes, all lazy interest images decode after navigation, horizontal overflow is zero, and warning/error logs are empty.
- No DNS, Cloudflare project, pull request, dependency, or unrelated external state changed. The production domain verified in this release is `https://yfyau.github.io/`, not `yfyau.com`.

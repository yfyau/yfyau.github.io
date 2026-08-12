# Coherent design direction proposal

**Status:** Resolved; Jason selected Playful Engineer, implemented locally in Revision 59  
**Date:** 2026-08-12  
**Product:** Recruiter-first personal website with a mobile-first reading order

**Resolution:** The diagnosis and three alternatives remain historical design evidence. Jason selected the Playful Engineer frame after the live comparison; DEC-063 and `docs/agent-context/CURRENT.md` now govern the implementation. The earlier Technical editorial recommendation is not the active direction.

## Diagnosis

Revision 57 contains several individually workable but competing systems:

| Voice | Current expression | Why it competes |
| --- | --- | --- |
| Editorial portfolio | Large serif headlines, mono facts, sharp rules, generous space | Calm and career-oriented, but not consistently applied to every section |
| Playful personal mark | Cartoon bee-at-computer icon | Friendly and specific, but visually unrelated to the cinematic imagery and technical poster |
| Cinematic lifestyle | Dark generated snowboarding, boss-fight, and coffee photography | Strong as one Off duty set, but too dramatic to become the whole career brand |
| Technical poster | Black Experience field, yellow current-role panel, grid treatment | Credible for engineering evidence, but it introduces a separate industrial language |
| Name-origin story | Wind/Bee characters, circles, label, and explanation | Repeats the icon's identity job and creates a fifth visual chapter |
| Contact campaign | Full amber closing poster | Uses the same accent as the current-role proof for a different meaning |

The problem is not insufficient decoration. Color, type, image, and shape do not have stable jobs across the page.

## Recommended north star

### Technical editorial with one human signature

The site should read like a compact senior-engineering dossier edited by a real person. Career evidence supplies authority. The small familiar icon supplies personality. Off-duty photography supplies humanity. None of those layers should pretend to be the other.

**Product sentence:** A calm, highly edited career dossier with one unmistakable personal signature.

**Audience result:** Within ten seconds, a recruiter or engineering leader should understand Jason's engineering level, current context, durable value, evidence path, and direct contact route. A longer scan should reveal personality without changing the site's genre.

## Governing system

### Content hierarchy

1. Identity and durable engineering promise.
2. Complete technical-strength scan.
3. Current role and attributed prior-role evidence.
4. Three off-duty interests in one photographic chapter.
5. One direct contact close.

Career is the proof system. Hobbies are biography, not competing brands.

### Color roles

- **Paper:** global reading surface and dominant background. Warm, not white.
- **Ink:** body text, rules, and primary actions.
- **Deep teal:** structural depth and one intentional large color field. It should not become a different theme in every section.
- **Amber:** current or active emphasis only. The Okta current-role state may own it; Contact and decorative areas should not reuse it as generic excitement.

Every color gets one semantic job. Revision 58 should not begin by choosing a new Hero color in isolation.

### Typography roles

- The established editorial display serif remains limited to major chapter headlines and the opening promise.
- Mono remains for dates, labels, small facts, navigation, and supporting copy where the technical voice is useful.
- No third display family, novelty lettering, vertical type, decorative numbering, or poetic micro-label system.

### Geometry

- Sharp rectangles and one-pixel rules remain the page grammar.
- The circular crop is reserved for the familiar header icon. It is the documented exception, not a new rounded-card system.
- Layout is asymmetric but calm. Large fields organize content; decorative grids, crosshairs, circles, and fake technical diagrams do not.

### Imagery

- The supplied icon appears once in the persistent wordmark. It is not enlarged, redrawn, explained, or repeated in a hero or About story.
- The three Off duty images stay as one low-key cinematic photographic set.
- No photoreal bee, wind trails, fantasy hero visual, fake product screenshot, or unrelated abstract AI art.
- Social imagery should eventually be regenerated or recaptured from the approved visual system rather than retain the old photoreal bee/wind concept.

### Motion

- Motion intensity stays low. Entry establishes hierarchy; hover, active, and focus provide feedback.
- No mascot animation, scroll cue, parallax, marquee, custom cursor, or section-specific motion language.

## Intended page composition after approval

### Header

Keep the small familiar icon, name, three navigation links, and domain. The icon is the only mascot expression.

### Hero

Keep the existing concise promise, introduction, and Email action. Recompose the large flat white field with the shared paper/teal/ink system. Use one strong editorial color-block decision rather than a background effect, illustration, or technical decoration.

### Strengths and Experience

Make these feel like consecutive chapters in the same dossier. Teal and amber must retain their semantic roles. Current-role emphasis remains obvious; prior-role evidence remains attributable and calm.

### Off duty

Remove the full Wind/Bee story, characters, label, and decorative panel. Move directly into Snowboarding, Sekiro/Wolf boss fights, and Coffee. Keep these as the only large personal visuals and render all three as one Playful hand-drawn editorial series: thick navy ink, sky blue, honey yellow, warm off-white, and restrained paper grain. The supplied bee remains a small identity mark, not a repeated character inside the hobby scenes.

### Contact

Keep one direct email and GitHub path. Bring the closing section back into the shared paper/teal system so amber does not mean both current status and generic CTA emphasis.

## Explicit deletion list

- `Why the bee stays.` and the bee-origin paragraph.
- Both Chinese characters, slash, `WIND / BEE`, concentric circles, and their wrapper/CSS.
- Old photoreal bee/wind social-card concept when a replacement from the approved system is ready.
- Any new decorative grid, crosshair, technical-diagram, poetic-label, or repeated bee treatment.
- Section-by-section color decisions that do not follow the global color roles.

## Alternatives considered

### Playful engineer, mascot-led

Make the cartoon bee large and central; replace cinematic images with one illustration system; use brighter amber and more tactile motion. This is memorable but makes career proof compete with a mascot and requires a broad asset redesign.

### Cinematic dark tech

Adopt the dark photographic language across the Hero, Experience, and Contact; reduce the cartoon icon to a minor utility mark. This is visually dramatic but less recruiter-efficient, risks generic AI-tech styling, and weakens the familiar icon's role.

### Why the recommendation wins

Technical editorial retains the strongest proven parts of the site: the concise promise, explicit career chronology, real outcome evidence, direct email, mobile scan, supplied icon, and three personal interests. It removes the conflicting explanatory motif without forcing Jason into either a mascot brand or a dark cinematic persona.

## Approval boundary (resolved)

The three directions are now rendered as reversible full-page frames at `?concepts=1&rev=58-frames`: A Editorial Dossier, B Playful Engineer, and C Dark Systems. They reuse the same facts and assets so the comparison is about system, hierarchy, and tone rather than different content.

Jason selected B, Playful Engineer. Revisions 59-63 deepen that system on the default route, remove the complete Wind/Bee concept, align fallback and sharing surfaces, and verify the complete mobile and desktop story. The Concept Lab has now been retired: its selection rationale remains in DEC-062/DEC-063, while DEC-064 governs the refined single product path.

Revision 67 establishes the desktop opening rhythm. From 64 rem upward, the two-column statement/action group is vertically centered while the Hero and strengths rail together occupy one viewport. The rail acts as the composition's baseline: the Hero keeps full-screen presence without returning to top-aligned empty space, and capabilities remain visible before the first scroll. Mobile, tablet, and short-landscape compositions keep their independent rules.

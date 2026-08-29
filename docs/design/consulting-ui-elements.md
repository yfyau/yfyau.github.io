# Consulting UI elements

- **Date:** 2026-08-28
- **Status:** Accepted by Jason on 2026-08-29; applied to the production home page
- **Mode:** Redesign - Preserve
- **Design read:** A targeted evolution of a career-first developer portfolio for engineering leaders and SME operators, using a playful editorial workshop language inside the existing native-CSS poster system.
- **Dials:** `DESIGN_VARIANCE 7 / MOTION_INTENSITY 4 / VISUAL_DENSITY 5`

## Concept: useful tension

Consulting should feel more active than Experience and more ordered than Off duty. The visual idea is a difficult problem being brought under control:

- large, calm editorial statement for confidence;
- one offset honey action object for urgency and human contact;
- two unequal service surfaces instead of a generic equal-card grid;
- visible borders, labels, and handoff states for engineering precision;
- a small amount of physical movement only when the visitor acts.

The system should look like the same person and the same site, not a second business landing page embedded inside the portfolio.

## Token jobs

| Token | Existing value | Consulting job |
| --- | --- | --- |
| Ink | `#172437` | Type, structure, focus, and the offset physical shadow |
| Ink soft | `#4c5967` | Explanatory copy only |
| Paper | `#f5f6f0` | Section field and breathing room |
| Paper raised | `#fffefa` | Diagnostic and service work surfaces |
| Sky | `#dcebf1` | Supporting context and the workflow service |
| Sky deep | `#c8dfe8` | Selected control state without creating a new accent |
| Honey | `#f3c53b` | Active choice and the one contact action |

No new accent color is introduced. Consulting inherits the page's locked light theme.

## Geometry and material

- Keep the existing `1.15rem` large radius and `0.85rem` action radius.
- The bee crop remains the only circle.
- Use a two-pixel ink frame for interactive and primary surfaces.
- Use the existing hard offset shadow only on the selected problem ticket and the primary CTA.
- Do not put every sentence inside a card. Supporting service information sits in open grid areas with sparse rules.

## Type roles

- Aptos Display or the existing display fallback carries the human statement and service names.
- Cascadia Mono or the existing mono fallback carries short labels, problem states, and action text.
- Large headings stay tightly tracked but do not exceed the established section scale.
- No new display family, serif, vertical type, decorative section number, or fake terminal language.

## Recommended section composition

Desktop uses an asymmetric two-column opening. The left side makes the offer; the right side contains a single honey problem ticket. Below it, two unequal service blocks share one baseline but not equal card styling.

Mobile collapses to one strict column:

1. statement;
2. problem ticket;
3. systems service;
4. workflow service;
5. one email action.

The section belongs immediately before Contact. Contact remains the final close.

## Interaction language

- Hoverable physical objects move `-2px, -2px` and grow the offset shadow over 180 ms.
- Active controls move down by one pixel.
- Switching the problem type changes only the selected state and supporting text.
- No perpetual motion, mascot animation, parallax, marquee, scroll hijack, or custom cursor.
- Reduced-motion users receive instant state changes without transforms.

## Elements deliberately excluded

- three equal service cards;
- generic gear, lightbulb, robot, or AI sparkle icons;
- dark corporate consulting panel;
- glass surfaces, gradients, or a second accent color;
- fake availability dots, pricing counters, or unsupported testimonials;
- a contact form before real intake requirements exist;
- repeated bee artwork outside the persistent wordmark.

## Review artifact

The accepted responsive specimen is in [consulting-style-board.html](consulting-style-board.html). Its consulting composition is implemented between Off duty and Contact in `src/App.js` and `src/App.css`. The board remains a review artifact and creates no public route.

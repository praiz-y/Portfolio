---
title: Tech Sisters
summary: A community platform for women in tech, with accessibility treated as a build requirement rather than a later pass.
category: Web Apps
year: 2024
role: Design & Development
stack:
  - HTML5
  - CSS3
  - JavaScript
  - Figma
liveUrl: https://techsisters.example.com
featured: true
order: 2
placeholder: true

# Left empty on purpose. Only add results you have actually measured, and say
# how they were measured. An invented number on a job application is a
# liability, not a decoration.
results: []
---

<!--
  DRAFT COPY — NOT VERIFIED.
  The section structure is real; every specific claim below is scaffolded and
  must be replaced with what actually happened. Delete this notice once done.
-->


## Problem

The community needed a public-facing home that felt credible to sponsors while staying genuinely usable for members — many of whom were early-career and arriving on older phones and unreliable connections. The existing setup was a link-in-bio page that couldn't carry the story or the events.

## Constraints

Accessibility was the fixed point: AA contrast, full keyboard operability, and no motion that couldn't be switched off. That constrains colour choice hard — the obvious "brand" palette failed contrast at the sizes the design called for, so the palette had to be rebuilt around the text rather than applied on top of it. Mobile-first, with the assumption of a mid-range Android on a slow connection as the baseline case.

## Decisions

I designed in the browser rather than in a static mockup, because contrast failures only showed up once real text was rendered at real sizes against real backgrounds. Every interactive control is a real button or link — no click handlers on divs, no placeholder `href`s — so keyboard and screen-reader behaviour came for free instead of being patched in later.

## The Struggle

The recurring tension was between the visual weight the brand wanted and the contrast the text needed. Large display type gave room to use a lighter colour that read as "on brand"; the same colour on body copy was unreadable. Holding one palette and changing the size, rather than holding the size and lightening the palette, was the fix — but it took several rounds to accept that the display colour was never going to work for body text.

## Limitations

The events listing is static; it doesn't pull from a calendar or support filters. Membership sign-up hands off to an external form rather than being integrated, which keeps the surface area small but means the experience breaks at the handoff point. Both are deliberate, and both are the first things I'd change with more time.

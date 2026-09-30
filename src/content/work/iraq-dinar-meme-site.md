---
title: Iraq Dinar Meme Site
summary: A fast, image-led community site built around Iraq Dinar meme culture — static-feeling speed with a CMS-free content flow.
category: Landing Pages
year: 2024
role: Design & Development
stack:
  - HTML5
  - CSS3
  - JavaScript
  - Cloudinary
liveUrl: https://iraqdinar.io
featured: true
order: 1
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

The community had a high volume of visual content and nowhere good to put it. Existing posts were scattered across chat groups, so anything worth keeping scrolled away within a day, and there was no single link to hand someone who asked what the project was about.

## Constraints

The site had to be cheap to run and simple enough that a non-developer could keep it current. That ruled out a database-backed CMS — the ongoing cost and admin surface were both wrong for a community project with no budget. Image delivery was the other constraint: full-resolution uploads were the single biggest cause of slow loads.

## Decisions

I built it as a static site and pushed all image handling to Cloudinary, which does format negotiation and resizing at the CDN edge. That meant no server to maintain and no build step running on every content change. I kept the layout image-first and let type stay out of the way — the visuals are the content here.

## The Struggle

The hard part wasn't the build, it was resisting features. Every addition — comments, accounts, likes — would have meant a backend, and a backend would have meant the running costs that made a CMS the wrong call in the first place. Deciding what the site *wouldn't* do was most of the design work.

## Limitations

Content updates still require editing markup, which is fine for the current cadence but would break down past a few updates a week. There's no search, and the gallery doesn't paginate — both are fine at the current volume and both would need revisiting before that changes.

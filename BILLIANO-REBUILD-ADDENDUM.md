# BILLIANO-REBUILD-ADDENDUM.md
## Read together with BILLIANO-REBUILD.md. Where they conflict, this file wins.

## 1. HERO IMAGERY — full-screen rotating canvas
- Full-viewport background images as the canvas of the home page, alternating automatically
  every ~6 seconds with a slow crossfade: heat pump installs, solar PV arrays, atrium /
  stack-ventilation architecture. Sustainability showcased visually, not just stated.
- Image sources, in priority order:
  (a) /assets/legacy/ — the owner's collected images recovered from the old deploy
      (owner will supply the zip; unpack images into this folder)
  (b) Unsplash (free licence) for any gaps — searches: "air source heat pump",
      "solar panels roof UK", "atrium natural ventilation architecture"
- Respect prefers-reduced-motion: static first image, no auto-rotation, for those users.
- Auto-rotation applies to the background imagery only — NOT to page content. Content
  never moves or switches without the visitor clicking. (Auto-advancing content fails
  WCAG and infuriates readers.)
- Keep text legible over images: dark gradient scrim behind headline text.

## 2. BACKGROUND / CANVAS
- Replace the blue canvas with a natural-light palette: clean off-white / pale sage,
  aligned with sustainability and freshness. Professional, airy, uncluttered.

## 3. ACCREDITATION PAGE — restore the OLD tab design
- Reinstate the previous accreditation register layout: colour-coded status tabs —
  GREEN = Attained · AMBER = In progress / Near completion · GREY = Planned /
  To be displayed soon. Filterable by status, as before.
- Honesty rule unchanged: nothing shows Attained unless genuinely awarded.

## 4. ENQUIRY WIDGET — structured form, not just mailto
- "Get a quote / Make an enquiry" form with fields: name · nature of project
  (short text + dropdown of service types) · contact info (email + phone) · message.
- Submit delivers to enquiries@billianobuiltdesigns.co.uk AND
  Executive@billianobuiltdesigns.co.uk (Netlify Forms with email notifications to both).
- Confirmation state on submit.

## 5. FLOATING ACTION BUBBLES
- Two small persistent floating bubbles, bottom-right, visible while scrolling on all pages:
  (a) "Enquire" — opens the enquiry form
  (b) WhatsApp — deep link https://wa.me/447943569024 (confirmed by owner;
      UK number 07943 569024 with leading zero dropped in the wa.me format)
- Unobtrusive: small, no sound, no bounce animation loops.

## 6. PLACEHOLDER SUBSTITUTION
- Owner is supplying extracts from existing company documents (proposal, privacy notice,
  compliance framework). A /content/docs/ folder will hold them; wire Terms of Service,
  Privacy, and Complaints pages to render from these files so text updates without
  code changes. Until supplied, keep [PLACEHOLDER] markers.

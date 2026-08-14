# BILLIANO-REBUILD.md
## Master build brief — Billiano Built Designs
### Read this entire file before writing any code. This repo is the single source of truth. All changes flow: this repo → push/merge → Netlify auto-deploy. No drag-and-drop deploys ever again.

---

## CONTEXT

- Live domain: billianobuiltdesigns.co.uk (Netlify, HTTPS already provisioned)
- The current live site is an OLD drag-and-drop deploy, not from this repo. It has a fatal
  script error visible as a red banner: `Uncaught SyntaxError: Unexpected token '<'` from
  `/_ds/organic-50e1f8b0-3711:1`. Whatever produced that reference must not survive the rebuild.
- Reference model: the haraka-transport repo (same team) — clean frontend + password-protected
  admin backend. Reuse its architecture and stack (Express + SQLite, Netlify frontend,
  Render backend) so both businesses run the same way.
- Design tokens already exist (sage/pine/terracotta palette, Capraions display font, Tailwind
  config). KEEP the tokens and wordmark. DROP the brown/organic paper background — use a clean
  near-white background (the sage-tint token) with generous white space. Benchmark: r1ttm.com —
  not its aesthetics, its clarity. One clear CTA, no clutter, nothing fighting for attention.

## BRAND (exact, non-negotiable)

- Name: Billiano Built Designs
- Strapline: Sustainable Building Services & Energy Design
- Contact emails: enquiries@billianobuiltdesigns.co.uk and Executive@billianobuiltdesigns.co.uk
- Phone: 07849 549740

## HONESTY RULE (highest priority, overrides all design/content choices)

No accreditation, insurance, membership, project, testimonial, statistic, or client may be
shown as real unless it appears in this brief as confirmed. Anything else renders as a clearly
marked placeholder: [PLACEHOLDER: what goes here]. A false accreditation claim permanently
disqualifies public tenders. When in doubt, placeholder it.

Confirmed as of this brief:
- Company: incorporated Ltd (number: [PLACEHOLDER: company number])
- BEng (Hons) Mechanical Engineering — held
- PG Cert Sustainable Engineering — held
- ICO registration — in progress, confirming imminently
- Insurances (public liability, professional indemnity, employers') — being purchased,
  figures TBC: keep the insurance table but every insurer name, policy number and level is
  [to confirm] until real values are supplied
- The four-status accreditation register page (Held / In progress / Planned / Partner-held)
  is APPROVED as-is in structure — keep it exactly, it is honest and partners respond well to it

## FRONTEND — PAGES & CHANGES

1. KEEP: Home, Heat pumps, Retrofit, Accreditations (the register page), Public sector
2. DELETE ENTIRELY: "Identity & tokens" page — that is an internal design-system handoff
   document and must never be public. Remove it from nav, routes, sitemap, and files.
3. REPLACE its nav slot with: "Portfolio" — a previous-projects page. Owner is collecting
   project records now; build the page as a grid of project cards reading from a JSON/data
   file so entries can be added without touching layout. Ship it with 3 placeholder cards
   marked [PLACEHOLDER: project — title, work type, outcome, photo].
4. NAVIGATION: instant page switches — SPA-style routing or prefetched static pages so a
   visitor clicks and content appears with no full-page reload and no scrolling to find
   content. Each page's key content visible above the fold. Longer detail can exist below,
   but reaching it is the visitor's choice, not a requirement.
5. CONTACT: a "Send an enquiry" tab/button in the header and footer. It opens a small panel
   with two clearly labelled mailto links:
   - General: enquiries@billianobuiltdesigns.co.uk
   - Direct to the executive: Executive@billianobuiltdesigns.co.uk
   Also keep a Netlify Forms fallback form (data-netlify="true") for visitors whose devices
   have no mail client.
6. Fix or remove whatever loads `/_ds/organic-*` — zero console errors on any page is a
   completion requirement.

## BACKEND — ADMIN SYSTEM (mirror haraka-transport)

Password-protected admin area, deployed on Render, completely separate from the public site.
Owner-only by default, with role-based access for future partner users.

Data model (SQLite):
- projects: name, client, work type, status, start/end dates, notes
- financials per project: cost to company, quote to client, commission to company
- professionals: name, trade, certifications, assigned projects
- per-professional per-project: itemised expenditure, labour charge, inventory costs,
  receipt uploads (file attachments)
- users: owner (full access) + limited-role users who can ONLY add their own inventory
  costs and receipts on projects they are assigned to — no visibility of other
  professionals' rates, company margins, or commission figures

Auth: session-based login, bcrypt-hashed passwords, owner seeds the first account.
Roles enforced server-side, not just hidden in the UI.

## DEPLOY PIPELINE (set up, verify, document)

1. netlify.toml in repo root pinning build command and publish directory
2. Frontend: this repo → Netlify (production branch = master). Confirm the Netlify project
   that owns billianobuiltdesigns.co.uk builds FROM THIS REPO. If the domain is attached to
   the old drag-and-drop project, document the exact click-path for the owner to move it.
3. Backend: Render deploy from the same repo (subfolder or second service), environment
   variables documented in a .env.example, secrets never committed
4. README.md: plain-English instructions for the owner — how to add a portfolio project,
   how to update accreditation statuses from placeholder to real, how changes go live
   (edit → commit → merge → automatic deploy, nothing else to do)

## WORKING METHOD

- Branch per feature, PR to master, summary of every change in each PR description
- Do not invent content to fill gaps — placeholder per the honesty rule
- Finish with a FINAL CHECKLIST in the last PR: every placeholder remaining on the site,
  listed with its location, so the owner knows exactly what to replace and where

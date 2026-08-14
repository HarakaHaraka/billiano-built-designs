/*
 * Billiano Built Designs — public site application.
 * Lightweight SPA: instant client-side routing (History API), no full-page reloads.
 * Page content lives here as render functions; the portfolio reads from
 * /data/projects.json, the home hero rotation from /data/hero.json, and the
 * legal pages from markdown files in /content/docs/ — so all three update
 * without touching layout code.
 *
 * HONESTY RULE: nothing is presented as a real accreditation, insurance, project,
 * testimonial, statistic or client unless confirmed in the build brief. Everything
 * else is a clearly marked [PLACEHOLDER]. See ph() / tc() helpers.
 */

const BRAND = {
  name: 'Billiano Built Designs',
  strapline: 'Sustainable Building Services & Energy Design',
  emailGeneral: 'enquiries@billianobuiltdesigns.co.uk',
  emailExec: 'Executive@billianobuiltdesigns.co.uk',
  phone: '07849 549740',
  phoneHref: '+447849549740',
  whatsapp: 'https://wa.me/447943569024'
};

/* ----------------------------- small helpers ----------------------------- */

// Inline placeholder marker (honesty rule)
const ph = (text) => `<span class="placeholder">PLACEHOLDER: ${text}</span>`;
// "[to confirm]" marker for values that will become real (e.g. insurance figures)
const tc = () => `<span class="placeholder">to confirm</span>`;

const enquiryCta = (label = 'Send an enquiry') =>
  `<button type="button" class="btn-primary" data-enquiry-open>${label}</button>`;

const execCta = () =>
  `<a class="btn-secondary" href="mailto:${BRAND.emailExec}">Email the executive</a>`;

// Standard page hero (inner pages — clean canvas, no imagery)
const hero = ({ eyebrow, title, lead, actions }) => `
  <section class="relative overflow-hidden">
    <div class="container-content grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_.9fr]">
      <div>
        ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}
        <h1 class="mt-4 text-4xl leading-[1.05] sm:text-5xl">${title}</h1>
        <p class="mt-5 max-w-xl text-lg leading-relaxed text-muted">${lead}</p>
        <div class="mt-8 flex flex-wrap gap-3">${actions || enquiryCta()}</div>
      </div>
      <div class="hidden lg:block">
        <div class="relative rounded-xl2 border border-pine/10 bg-surface p-6 shadow-card">
          <div class="rounded-xl2 bg-gradient-to-br from-pine-600 to-pine-800 p-8 text-white">
            <p class="font-display text-2xl leading-snug">Design-led.<br />Evidence-led.<br />Honest by default.</p>
            <p class="mt-4 text-sm text-pine-100">
              Chartered-track engineering behind every heat pump, retrofit and energy-design decision.
            </p>
          </div>
          <dl class="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt class="text-muted">Qualification</dt>
              <dd class="font-semibold text-pine">BEng (Hons) Mech. Eng.</dd>
            </div>
            <div>
              <dt class="text-muted">Specialism</dt>
              <dd class="font-semibold text-pine">PG Cert Sustainable Eng.</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </section>`;

const section = ({ id, eyebrow, title, lead, body }) => `
  <section ${id ? `id="${id}"` : ''} class="container-content py-12 sm:py-16">
    <div class="max-w-2xl">
      ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}
      ${title ? `<h2 class="mt-3 text-2xl sm:text-3xl">${title}</h2>` : ''}
      ${lead ? `<p class="mt-4 text-lg text-muted">${lead}</p>` : ''}
    </div>
    ${body ? `<div class="mt-8">${body}</div>` : ''}
  </section>`;

const serviceCard = ({ href, title, blurb }) => `
  <a href="${href}" data-link class="card group flex flex-col hover:border-pine/30 hover:shadow-panel">
    <h3 class="text-xl">${title}</h3>
    <p class="mt-3 flex-1 text-sm leading-relaxed text-muted">${blurb}</p>
    <span class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-terracotta group-hover:gap-2">
      Learn more <span aria-hidden="true">→</span>
    </span>
  </a>`;

const stepList = (steps) => `
  <ol class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    ${steps
      .map(
        (s, i) => `
      <li class="card">
        <span class="grid h-9 w-9 place-items-center rounded-full bg-pine-100 font-display text-pine">${i + 1}</span>
        <h3 class="mt-4 text-lg">${s.t}</h3>
        <p class="mt-2 text-sm text-muted">${s.d}</p>
      </li>`
      )
      .join('')}
  </ol>`;

const featureList = (items) => `
  <ul class="grid gap-3 sm:grid-cols-2">
    ${items
      .map(
        (t) => `
      <li class="flex items-start gap-3 rounded-xl2 border border-pine/10 bg-surface p-4">
        <span class="mt-0.5 text-terracotta" aria-hidden="true">✓</span>
        <span class="text-sm text-ink">${t}</span>
      </li>`
      )
      .join('')}
  </ul>`;

/* ----------------------- accreditation register data ---------------------- */
/*
 * Colour-coded, filterable register (addendum §3):
 *   GREEN  = Attained · AMBER = In progress / near completion · GREY = Planned.
 * Partner-held entries are kept from the approved four-status structure.
 * HONESTY RULE: nothing shows Attained unless genuinely awarded.
 */
const REGISTER_STATUSES = {
  attained: { label: 'Attained', pill: 'status-attained', dot: 'bg-emerald-500' },
  progress: { label: 'In progress', pill: 'status-progress', dot: 'bg-amber-500' },
  planned: { label: 'Planned', pill: 'status-planned', dot: 'bg-stone-400' },
  partner: { label: 'Partner-held', pill: 'status-partner', dot: 'bg-sage-500' }
};

const REGISTER = [
  { status: 'attained', name: 'BEng (Hons) Mechanical Engineering', note: 'Verified qualification' },
  { status: 'attained', name: 'PG Cert Sustainable Engineering', note: 'Verified qualification' },
  { status: 'progress', name: 'ICO registration', note: 'Confirming imminently' },
  {
    status: 'progress',
    name: 'Insurances (public liability · professional indemnity · employers’)',
    note: 'Being purchased — see the table below'
  },
  { status: 'planned', name: ph('planned accreditation(s) — confirm names before listing'), note: '' },
  { status: 'partner', name: ph('partner-held accreditation(s) and partner name(s)'), note: '' }
];

const registerListHtml = (filter) => {
  const rows = REGISTER.filter((r) => filter === 'all' || r.status === filter);
  if (!rows.length) {
    return `<p class="py-8 text-center text-sm text-muted">Nothing in this category yet — honestly.</p>`;
  }
  return rows
    .map((r) => {
      const meta = REGISTER_STATUSES[r.status];
      return `
        <li class="flex flex-col gap-2 border-b border-pine/10 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <span class="status-pill ${meta.pill}">${meta.label}</span>
            <span class="text-sm font-medium text-ink">${r.name}</span>
          </div>
          ${r.note ? `<span class="text-sm text-muted">${r.note}</span>` : ''}
        </li>`;
    })
    .join('');
};

const registerTabsHtml = (active) => {
  const tabs = [
    ['all', 'All', 'bg-pine', 'reg-tab-all'],
    ['attained', 'Attained', 'bg-emerald-500', 'reg-tab-attained'],
    ['progress', 'In progress', 'bg-amber-500', 'reg-tab-progress'],
    ['planned', 'Planned', 'bg-stone-400', 'reg-tab-planned'],
    ['partner', 'Partner-held', 'bg-sage-500', 'reg-tab-partner']
  ];
  return tabs
    .map(
      ([key, label, dot, cls]) => `
      <button type="button" class="reg-tab ${cls}${key === active ? ' is-active' : ''}"
        data-reg-filter="${key}" aria-pressed="${key === active}">
        <span class="reg-dot ${dot}" aria-hidden="true"></span>${label}
      </button>`
    )
    .join('');
};

/* --------------------------------- views --------------------------------- */

const views = {
  home: () => `
    <!-- Full-viewport hero canvas (addendum §1). Imagery rotates via /data/hero.json;
         while no images are supplied, a brand gradient stands in. Rotation applies to
         the BACKGROUND only — content never moves without a click. -->
    <section class="relative isolate flex min-h-[600px] min-h-[88svh] overflow-hidden bg-pine-800">
      <div class="absolute inset-0 -z-20" data-hero-stage aria-hidden="true">
        <div class="absolute inset-0 bg-gradient-to-br from-pine-600 via-pine-800 to-ink"></div>
        <div class="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-sage-500/20 blur-3xl"></div>
        <div class="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-terracotta-500/15 blur-3xl"></div>
      </div>
      <!-- Dark gradient scrim keeps headline text legible over any image -->
      <div class="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-ink/45 to-ink/25" aria-hidden="true"></div>

      <div class="container-content relative flex flex-col justify-center py-20">
        <span class="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
          Sustainable building services
        </span>
        <h1 class="mt-5 max-w-3xl text-4xl leading-[1.04] text-white sm:text-6xl">
          Sustainable Building Services &amp; Energy Design
        </h1>
        <p class="mt-6 max-w-xl text-lg leading-relaxed text-pine-50/95">
          Heat pumps, retrofit and low-carbon energy design for homes and public-sector clients —
          engineered properly, and evidenced honestly.
        </p>
        <div class="mt-9 flex flex-wrap gap-3">
          ${enquiryCta('Get a quote')}
          <a class="btn border border-white/40 text-white hover:bg-white/10" href="/portfolio" data-link>View our work</a>
        </div>
        <p class="mt-10 text-sm text-pine-100/90">
          BEng (Hons) Mechanical Engineering · PG Cert Sustainable Engineering ·
          <a href="/accreditations" data-link class="underline decoration-white/40 underline-offset-4 hover:text-white">credentials published honestly</a>
        </p>
      </div>
    </section>

    ${section({
      eyebrow: 'What we do',
      title: 'Three ways we help you build better',
      lead: 'Clear scopes, sound engineering, and no jargon — pick the service that fits your project.',
      body: `
        <div class="grid gap-5 md:grid-cols-3">
          ${serviceCard({
            href: '/heat-pumps',
            title: 'Heat pumps',
            blurb:
              'System design and specification for air- and ground-source heat pumps — correctly sized, MCS-aware and built around your building fabric.'
          })}
          ${serviceCard({
            href: '/retrofit',
            title: 'Retrofit',
            blurb:
              'Fabric-first retrofit and energy design that cuts demand before it adds kit — planned, sequenced and evidenced.'
          })}
          ${serviceCard({
            href: '/public-sector',
            title: 'Public sector',
            blurb:
              'Transparent credentials and clear documentation for local authorities, housing providers and framework work.'
          })}
        </div>`
    })}

    ${section({
      eyebrow: 'Credentials you can check',
      title: 'Honest by default',
      lead:
        'We publish a live accreditation register showing exactly what is attained, in progress, planned and partner-held — because a false claim is worse than an honest gap.',
      body: `
        <div class="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div class="card">
            <h3 class="text-lg">On the register today</h3>
            <ul class="mt-4 space-y-3 text-sm">
              <li class="flex items-center gap-3">
                <span class="status-pill status-attained">Attained</span>
                BEng (Hons) Mechanical Engineering
              </li>
              <li class="flex items-center gap-3">
                <span class="status-pill status-attained">Attained</span>
                PG Cert Sustainable Engineering
              </li>
              <li class="flex items-center gap-3">
                <span class="status-pill status-progress">In progress</span>
                ICO registration — confirming imminently
              </li>
            </ul>
            <a href="/accreditations" data-link class="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-terracotta">
              See the full register <span aria-hidden="true">→</span>
            </a>
          </div>
          <div class="card bg-pine-50/60">
            <h3 class="text-lg">Ready to talk?</h3>
            <p class="mt-3 text-sm text-muted">
              Tell us about your building and what you want to achieve. We will tell you honestly what
              is involved.
            </p>
            <div class="mt-5 flex flex-col gap-2">
              ${enquiryCta()}
              ${execCta()}
            </div>
          </div>
        </div>`
    })}
  `,

  heatPumps: () => `
    ${hero({
      eyebrow: 'Service',
      title: 'Heat pump design &amp; specification',
      lead:
        'Air- and ground-source heat pump systems designed around your building — correctly sized, efficient at real operating temperatures, and documented for installers and assessors.',
      actions: `${enquiryCta('Enquire about a heat pump')} <a class="btn-secondary" href="/accreditations" data-link>Our credentials</a>`
    })}

    ${section({
      title: 'What the service covers',
      lead:
        'Getting a heat pump right is an engineering problem before it is a purchasing decision. We focus on the design so the installed system actually performs.',
      body: featureList([
        'Heat-loss assessment and correct system sizing (no rules-of-thumb oversizing)',
        'Air-source and ground-source options appraised against your site and fabric',
        'Low flow-temperature design for higher seasonal efficiency',
        'Emitter and hot-water strategy so radiators and cylinders match the system',
        'MCS-aware documentation to support a compliant installation',
        'Clear specification an installer can quote and build from'
      ])
    })}

    ${section({
      eyebrow: 'How it works',
      title: 'A simple, evidenced process',
      body: stepList([
        { t: 'Survey', d: 'We assess the building fabric, heat demand and existing system.' },
        { t: 'Design', d: 'We size the heat pump and design for low flow temperatures.' },
        { t: 'Specify', d: 'You receive a clear specification and supporting documentation.' },
        { t: 'Support', d: 'We support installation and commissioning questions as they arise.' }
      ])
    })}

    ${section({
      eyebrow: 'Evidence, not marketing',
      title: 'Performance figures',
      body: `
        <div class="card max-w-2xl">
          <p class="text-sm text-muted">
            Real seasonal performance depends on your building, so we will not publish generic
            efficiency claims. Project-specific performance figures and completed case studies will be
            added here as records are confirmed.
          </p>
          <p class="mt-4">${ph('heat pump case study — building type, design flow temp, measured/estimated SCOP, outcome')}</p>
        </div>`
    })}
  `,

  retrofit: () => `
    ${hero({
      eyebrow: 'Service',
      title: 'Retrofit &amp; energy design',
      lead:
        'Fabric-first retrofit that reduces energy demand before adding technology — planned as a whole, sequenced sensibly, and evidenced at every step.',
      actions: `${enquiryCta('Enquire about retrofit')} <a class="btn-secondary" href="/portfolio" data-link>See project examples</a>`
    })}

    ${section({
      title: 'A whole-building approach',
      lead:
        'Piecemeal measures can cause as many problems as they solve. We plan retrofit as a coordinated whole so improvements work together and avoid unintended consequences like condensation risk.',
      body: featureList([
        'Fabric-first: insulation, airtightness and ventilation considered together',
        'Whole-house retrofit planning and sensible measure sequencing',
        'Energy modelling to prioritise the measures that matter most',
        'Ventilation strategy to protect indoor air quality and the building fabric',
        'Integration with low-carbon heat (see our heat pump service)',
        'Documentation aligned with recognised retrofit standards'
      ])
    })}

    ${section({
      eyebrow: 'How it works',
      title: 'From assessment to plan',
      body: stepList([
        { t: 'Assess', d: 'Understand the building, its performance and your goals.' },
        { t: 'Model', d: 'Model options to find the best value carbon and comfort gains.' },
        { t: 'Plan', d: 'Produce a sequenced retrofit plan you can deliver in stages.' },
        { t: 'Evidence', d: 'Document decisions so quality can be checked and verified.' }
      ])
    })}

    ${section({
      eyebrow: 'Standards & frameworks',
      title: 'What we are accredited for',
      body: `
        <div class="card max-w-2xl">
          <p class="text-sm text-muted">
            We describe our work against recognised retrofit standards, but we only claim an
            accreditation once it is actually held. Any specific retrofit scheme membership is shown on
            the register with its true status.
          </p>
          <p class="mt-4">${ph('retrofit scheme accreditation (e.g. PAS 2035 / TrustMark) — confirm status before listing as attained')}</p>
          <a href="/accreditations" data-link class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-terracotta">
            View the accreditation register <span aria-hidden="true">→</span>
          </a>
        </div>`
    })}
  `,

  accreditations: () => {
    const insuranceRow = (type) => `
      <tr class="border-b border-pine/10 last:border-0">
        <td class="py-3 pr-4 text-sm font-medium text-ink">${type}</td>
        <td class="py-3 pr-4 text-sm">${tc()}</td>
        <td class="py-3 pr-4 text-sm">${tc()}</td>
        <td class="py-3 text-sm">${tc()}</td>
      </tr>`;

    return `
    ${hero({
      eyebrow: 'Transparency',
      title: 'Accreditation register',
      lead:
        'A live, honest record of our credentials — attained, in progress, planned and partner-held. We would rather show an honest gap than a false claim.',
      actions: `${enquiryCta()} <a class="btn-secondary" href="/public-sector" data-link>For public-sector buyers</a>`
    })}

    ${section({
      title: 'The register',
      lead:
        'Colour-coded and filterable: green = attained, amber = in progress or near completion, grey = planned. Nothing shows “Attained” unless genuinely awarded.',
      body: `
        <div class="card">
          <div class="flex flex-wrap gap-2" role="group" aria-label="Filter register by status" data-reg-tabs>
            ${registerTabsHtml('all')}
          </div>
          <ul class="mt-4" data-register-list>
            ${registerListHtml('all')}
          </ul>
        </div>`
    })}

    ${section({
      eyebrow: 'Company',
      title: 'Company &amp; registration',
      body: `
        <div class="card max-w-2xl">
          <dl class="grid gap-4 sm:grid-cols-2 text-sm">
            <div><dt class="text-muted">Legal entity</dt><dd class="font-medium text-ink">Billiano Built Designs Ltd (incorporated)</dd></div>
            <div><dt class="text-muted">Company number</dt><dd>${ph('company number')}</dd></div>
            <div><dt class="text-muted">Data protection (ICO)</dt><dd><span class="status-pill status-progress">In progress</span></dd></div>
            <div><dt class="text-muted">Registered qualifications</dt><dd class="font-medium text-ink">BEng (Hons); PG Cert</dd></div>
          </dl>
        </div>`
    })}

    ${section({
      eyebrow: 'Cover',
      title: 'Insurance',
      lead:
        'Insurances are being put in place. The table structure is fixed; every insurer, policy number and level of cover reads “to confirm” until the real values are supplied.',
      body: `
        <div class="card overflow-x-auto">
          <table class="w-full min-w-[640px] text-left">
            <thead>
              <tr class="border-b border-pine/20">
                <th class="py-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted">Cover</th>
                <th class="py-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted">Insurer</th>
                <th class="py-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted">Policy number</th>
                <th class="py-3 text-xs font-semibold uppercase tracking-wider text-muted">Level of cover</th>
              </tr>
            </thead>
            <tbody>
              ${insuranceRow('Public liability')}
              ${insuranceRow('Professional indemnity')}
              ${insuranceRow("Employers' liability")}
            </tbody>
          </table>
        </div>`
    })}
  `;
  },

  publicSector: () => `
    ${hero({
      eyebrow: 'For public-sector buyers',
      title: 'Built for public-sector scrutiny',
      lead:
        'Local authorities, housing providers and framework buyers need suppliers who can evidence what they claim. Our credentials are published, our gaps are honest, and our documentation is clear.',
      actions: `${enquiryCta()} ${execCta()}`
    })}

    ${section({
      title: 'Why transparency matters here',
      lead:
        'A single false accreditation claim can permanently disqualify a supplier from public tenders. We treat honesty as a compliance feature, not just a value.',
      body: featureList([
        'A live accreditation register — attained, in progress, planned, partner-held',
        'Chartered-track engineering leadership (BEng Hons; PG Cert)',
        'Clear, auditable documentation for every design decision',
        'Insurances being put in place, shown transparently as they are confirmed',
        'Data handling with ICO registration in progress',
        'Delivery-partner capabilities shown honestly, never overstated'
      ])
    })}

    ${section({
      eyebrow: 'Procurement',
      title: 'Frameworks &amp; past public contracts',
      body: `
        <div class="grid gap-5 lg:grid-cols-2">
          <div class="card">
            <h3 class="text-lg">Framework memberships</h3>
            <p class="mt-3 text-sm text-muted">We list a framework only once membership is confirmed.</p>
            <p class="mt-4">${ph('framework membership(s) — confirm before listing')}</p>
          </div>
          <div class="card">
            <h3 class="text-lg">Delivered public-sector work</h3>
            <p class="mt-3 text-sm text-muted">Completed contracts will appear here, and in the portfolio, as records are confirmed.</p>
            <p class="mt-4">${ph('public-sector project — client, scope, outcome')}</p>
          </div>
        </div>`
    })}

    ${section({
      body: `
        <div class="card bg-pine-50/60 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="text-xl">Preparing a tender or specification?</h3>
            <p class="mt-2 text-sm text-muted">Talk to us directly — we will answer credential questions honestly and in writing.</p>
          </div>
          <div class="flex flex-wrap gap-2">${enquiryCta()} ${execCta()}</div>
        </div>`
    })}
  `,

  portfolio: () => `
    ${hero({
      eyebrow: 'Our work',
      title: 'Portfolio',
      lead:
        'A record of completed projects. We are collecting and confirming project records now — entries below are placeholders and will be replaced with real work as it is verified.',
      actions: `${enquiryCta('Discuss your project')}`
    })}

    ${section({
      body: `
        <div class="mb-6 rounded-xl2 border border-dashed border-terracotta-300 bg-terracotta-50 p-4 text-sm text-terracotta-800">
          <strong>Owner note:</strong> new projects are added by editing
          <code class="rounded bg-white/70 px-1.5 py-0.5">/data/projects.json</code> — no layout changes needed.
          The cards below are placeholders until real records are confirmed.
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-portfolio-grid>
          <p class="text-sm text-muted">Loading projects…</p>
        </div>`
    })}
  `,

  // Company documents (Terms / Privacy / Complaints) rendered from markdown in
  // /content/docs/ so the owner can update text without touching layout code.
  docPage: (route) => `
    <section class="container-content py-12 sm:py-16">
      <div class="max-w-3xl">
        <span class="eyebrow">Company document</span>
        <article class="prose-doc mt-6" data-doc-target data-doc-file="${route.file}">
          <p class="text-sm text-muted">Loading document…</p>
        </article>
      </div>
    </section>
  `,

  notFound: () => `
    ${section({
      eyebrow: '404',
      title: 'Page not found',
      lead: 'That page does not exist. Try one of the sections in the menu, or head back home.',
      body: `<a href="/" data-link class="btn-primary">Back to home</a>`
    })}
  `
};

/* --------------------------------- routes -------------------------------- */

const routes = [
  { path: '/', label: 'Home', title: `${BRAND.name} — ${BRAND.strapline}`, view: 'home', nav: true },
  { path: '/heat-pumps', label: 'Heat pumps', title: `Heat pumps — ${BRAND.name}`, view: 'heatPumps', nav: true },
  { path: '/retrofit', label: 'Retrofit', title: `Retrofit — ${BRAND.name}`, view: 'retrofit', nav: true },
  { path: '/portfolio', label: 'Portfolio', title: `Portfolio — ${BRAND.name}`, view: 'portfolio', nav: true },
  { path: '/accreditations', label: 'Accreditations', title: `Accreditations — ${BRAND.name}`, view: 'accreditations', nav: true },
  { path: '/public-sector', label: 'Public sector', title: `Public sector — ${BRAND.name}`, view: 'publicSector', nav: true },
  { path: '/terms', label: 'Terms of Service', title: `Terms of Service — ${BRAND.name}`, view: 'docPage', legal: true, file: 'terms-of-service.md' },
  { path: '/privacy', label: 'Privacy Notice', title: `Privacy Notice — ${BRAND.name}`, view: 'docPage', legal: true, file: 'privacy-notice.md' },
  { path: '/complaints', label: 'Complaints Procedure', title: `Complaints Procedure — ${BRAND.name}`, view: 'docPage', legal: true, file: 'complaints-procedure.md' }
];

const routeFor = (path) => routes.find((r) => r.path === path);

/* ------------------------------ hero rotation ----------------------------- */

let heroTimer = null;

async function initHeroRotation() {
  const stage = document.querySelector('[data-hero-stage]');
  if (!stage) return;
  try {
    const res = await fetch('/data/hero.json', { cache: 'no-cache' });
    if (!res.ok) return; // keep gradient fallback
    const cfg = await res.json();
    const images = Array.isArray(cfg.images) ? cfg.images.filter((i) => i && i.src) : [];
    if (!images.length) return; // no imagery supplied yet — gradient fallback stays

    // Build the crossfade layers (background only — content never rotates).
    stage.innerHTML = images
      .map(
        (img, i) =>
          `<div class="hero-layer${i === 0 ? ' is-active' : ''}" style="background-image:url('${img.src}')"></div>`
      )
      .join('');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || images.length < 2) return; // static first image for reduced-motion users

    const layers = Array.from(stage.querySelectorAll('.hero-layer'));
    let idx = 0;
    heroTimer = setInterval(() => {
      idx = (idx + 1) % layers.length;
      layers.forEach((l, i) => l.classList.toggle('is-active', i === idx));
    }, 6000);
  } catch {
    /* gradient fallback stays */
  }
}

/* ------------------------------ portfolio data --------------------------- */

async function renderPortfolio() {
  const grid = document.querySelector('[data-portfolio-grid]');
  if (!grid) return;
  try {
    const res = await fetch('/data/projects.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();
    if (!Array.isArray(projects) || projects.length === 0) {
      grid.innerHTML = `<p class="text-sm text-muted">No projects to show yet.</p>`;
      return;
    }
    grid.innerHTML = projects
      .map((p) => {
        const isPlaceholder = p.placeholder === true;
        const title = p.title || 'Untitled project';
        const workType = p.workType || '';
        const outcome = p.outcome || '';
        const photo = p.photo
          ? `<img src="${p.photo}" alt="${title}" loading="lazy" class="h-44 w-full rounded-xl2 object-cover" />`
          : `<div class="flex h-44 w-full items-center justify-center rounded-xl2 bg-pine-100 text-sm text-pine-600">
               ${isPlaceholder ? '⚑ PLACEHOLDER: project photo' : 'Photo coming soon'}
             </div>`;
        return `
          <article class="card flex flex-col">
            ${photo}
            <div class="mt-4 flex items-center gap-2">
              ${workType ? `<span class="eyebrow">${workType}</span>` : ''}
              ${isPlaceholder ? `<span class="status-pill status-progress">Placeholder</span>` : ''}
            </div>
            <h3 class="mt-3 text-lg">${title}</h3>
            <p class="mt-2 flex-1 text-sm text-muted">${outcome}</p>
          </article>`;
      })
      .join('');
  } catch (err) {
    grid.innerHTML = `<p class="text-sm text-terracotta-700">Could not load projects (${err.message}). Please try again later.</p>`;
  }
}

/* ------------------------- markdown document pages ------------------------ */

// Minimal markdown → HTML for the /content/docs/ files (headings, bold, italic,
// links, unordered lists, paragraphs). [PLACEHOLDER: …] markers keep their
// unmissable flag styling per the honesty rule.
function mdToHtml(md) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = (s) =>
    esc(s)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[PLACEHOLDER:\s*([^\]]+)\]/g, '<span class="placeholder">PLACEHOLDER: $1</span>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  const lines = md.split(/\r?\n/);
  const out = [];
  let list = null;
  let para = [];

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inline(para.join(' '))}</p>`);
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      out.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`);
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      flushPara();
      flushList();
      out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`);
      continue;
    }
    if (/^-{3,}$/.test(line.trim())) {
      flushPara();
      flushList();
      out.push('<hr />');
      continue;
    }
    const li = line.match(/^\s*[-*]\s+(.*)$/);
    if (li) {
      flushPara();
      (list = list || []).push(li[1]);
      continue;
    }
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushPara();
  flushList();
  return out.join('\n');
}

async function renderDoc(route) {
  const target = document.querySelector('[data-doc-target]');
  if (!target) return;
  try {
    const res = await fetch(`/content/docs/${route.file}`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    target.innerHTML = mdToHtml(await res.text());
  } catch (err) {
    target.innerHTML = `<p class="text-sm text-terracotta-700">Could not load this document (${err.message}).
      Please email <a class="underline" href="mailto:${BRAND.emailGeneral}">${BRAND.emailGeneral}</a> for a copy.</p>`;
  }
}

/* -------------------------------- rendering ------------------------------ */

const outlet = document.querySelector('[data-outlet]');

function render(path) {
  if (heroTimer) {
    clearInterval(heroTimer);
    heroTimer = null;
  }
  const route = routeFor(path) || { title: `Page not found — ${BRAND.name}`, view: 'notFound' };
  document.title = route.title;
  outlet.innerHTML = views[route.view](route);
  window.scrollTo({ top: 0, behavior: 'auto' });
  updateActiveNav(path);
  if (route.view === 'portfolio') renderPortfolio();
  if (route.view === 'docPage') renderDoc(route);
  if (route.view === 'home') initHeroRotation();
  closeMobileMenu();
}

function navigate(path, replace = false) {
  if (replace) history.replaceState({}, '', path);
  else history.pushState({}, '', path);
  render(path);
}

/* --------------------------------- nav ----------------------------------- */

function buildNav() {
  const items = routes.filter((r) => r.nav);
  const legal = routes.filter((r) => r.legal);
  const linkHtml = (r, cls) =>
    `<a href="${r.path}" data-link class="${cls}" data-path="${r.path}">${r.label}</a>`;

  const primary = document.querySelector('[data-nav]');
  const mobile = document.querySelector('[data-mobile-nav]');
  const footer = document.querySelector('[data-footer-nav]');
  const legalNav = document.querySelector('[data-legal-nav]');

  if (primary) primary.innerHTML = items.map((r) => linkHtml(r, 'nav-link')).join('');
  if (mobile)
    mobile.innerHTML =
      items.map((r) => linkHtml(r, 'nav-link block')).join('') +
      `<button type="button" class="btn-primary mt-2 w-full" data-enquiry-open>Send an enquiry</button>`;
  if (footer) footer.innerHTML = items.map((r) => linkHtml(r, 'text-muted hover:text-pine')).join('');
  if (legalNav) legalNav.innerHTML = legal.map((r) => linkHtml(r, 'text-muted hover:text-pine')).join('');
}

function updateActiveNav(path) {
  document.querySelectorAll('[data-path]').forEach((a) => {
    if (a.getAttribute('data-path') === path) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

/* ----------------------------- mobile menu ------------------------------- */

function toggleMobileMenu(force) {
  const nav = document.querySelector('[data-mobile-nav]');
  const btn = document.querySelector('[data-menu-toggle]');
  if (!nav || !btn) return;
  const open = force !== undefined ? force : nav.classList.contains('hidden');
  nav.classList.toggle('hidden', !open);
  nav.classList.toggle('flex', open);
  btn.setAttribute('aria-expanded', String(open));
}
const closeMobileMenu = () => toggleMobileMenu(false);

/* ---------------------------- enquiry panel ------------------------------ */

let lastFocused = null;

function openEnquiry() {
  const panel = document.querySelector('[data-enquiry-panel]');
  if (!panel) return;
  lastFocused = document.activeElement;
  panel.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  const firstInput = panel.querySelector('input:not([type="hidden"]):not([name="bot-field"]), a, button');
  if (firstInput) firstInput.focus();
}

function closeEnquiry() {
  const panel = document.querySelector('[data-enquiry-panel]');
  if (!panel) return;
  panel.classList.add('hidden');
  document.body.style.overflow = '';
  // Reset to the form state for the next open.
  const success = panel.querySelector('[data-enquiry-success]');
  const body = panel.querySelector('[data-enquiry-body]');
  if (success) success.classList.add('hidden');
  if (success) success.classList.remove('flex');
  if (body) body.classList.remove('hidden');
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}

const encodeForm = (data) =>
  Object.keys(data)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&');

async function submitEnquiry(form) {
  const statusEl = form.querySelector('[data-enquiry-status]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(form).entries());
  statusEl.textContent = 'Sending…';
  statusEl.className = 'text-center text-sm text-muted';
  if (submitBtn) submitBtn.disabled = true;
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeForm({ 'form-name': 'enquiry', ...data })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    form.reset();
    statusEl.textContent = '';
    // Confirmation state (addendum §4): swap the panel body for the success view.
    const panel = document.querySelector('[data-enquiry-panel]');
    const success = panel.querySelector('[data-enquiry-success]');
    const body = panel.querySelector('[data-enquiry-body]');
    if (success && body) {
      body.classList.add('hidden');
      success.classList.remove('hidden');
      success.classList.add('flex');
      const closeBtn = success.querySelector('button');
      if (closeBtn) closeBtn.focus();
    }
  } catch (err) {
    statusEl.innerHTML = `We could not send the form here. Please email us directly at
      <a class="font-semibold text-terracotta underline" href="mailto:${BRAND.emailGeneral}">${BRAND.emailGeneral}</a>.`;
    statusEl.className = 'text-center text-sm text-terracotta-700';
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

/* ------------------------------ global events ---------------------------- */

document.addEventListener('click', (e) => {
  // SPA link interception
  const link = e.target.closest('a[data-link]');
  if (link) {
    const url = new URL(link.href);
    if (url.origin === window.location.origin) {
      e.preventDefault();
      if (url.pathname !== window.location.pathname) navigate(url.pathname);
      else closeMobileMenu();
      return;
    }
  }

  // Accreditation register filter tabs
  const tab = e.target.closest('[data-reg-filter]');
  if (tab) {
    const filter = tab.getAttribute('data-reg-filter');
    const tabsWrap = document.querySelector('[data-reg-tabs]');
    const listEl = document.querySelector('[data-register-list]');
    if (tabsWrap && listEl) {
      tabsWrap.innerHTML = registerTabsHtml(filter);
      listEl.innerHTML = registerListHtml(filter);
    }
    return;
  }

  if (e.target.closest('[data-enquiry-open]')) {
    e.preventDefault();
    openEnquiry();
    return;
  }
  if (e.target.closest('[data-enquiry-close]')) {
    e.preventDefault();
    closeEnquiry();
    return;
  }
  if (e.target.closest('[data-menu-toggle]')) {
    e.preventDefault();
    toggleMobileMenu();
    return;
  }
});

document.addEventListener('submit', (e) => {
  if (e.target.matches('[data-enquiry-form]')) {
    e.preventDefault();
    submitEnquiry(e.target);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeEnquiry();
    closeMobileMenu();
  }
});

window.addEventListener('popstate', () => render(window.location.pathname));

/* --------------------------------- init ---------------------------------- */

function init() {
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  buildNav();
  render(window.location.pathname);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

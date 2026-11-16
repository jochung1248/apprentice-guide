# Apprentice Guide (formerly "Tradie Numbers") — Apprentice Pay, Incentives & Pathways hub (MVP build plan)

Working name: **Apprentice Guide** (@apprenticeguide; renamed from the earlier placeholder on 17 Nov 2026; check domain + trademark before launch).
Owner: Joseph (Sydney). Market: NSW first. Date of plan: 17 Nov 2026 (FY 2026–27 rates apply, effective 1 July 2026).

## What it is
A free, SEO-led site of honest calculators and plain-English guides about trade apprenticeships:
what apprentices actually take home, the government payments, trade vs uni over time, and what an
apprentice really costs a small business. It earns from RTO/GTO enquiry leads, a newsletter sponsor
slot and (later) display ads, and it is the audience funnel for a later paid small-employer
apprentice-management tool (tested now with a fake-door waitlist).

Why: research (Nov 2026) found trade outcomes are strong (94.8% of trade completers employed, NCVER 2025)
but perception is weak; dissatisfaction with pay/conditions/workplace is the top reason trade
apprentices quit (27.7% of trade non-completers, NCVER 2025); and small employers are the biggest
completion lever.

## Audience
Parents of 15–17 year olds, careers advisers, adults 20–40 considering a career change, small trade
business owners. Not designed for collecting data from under-18s (no accounts, no personal data in
calculators; lead form asks for age band and states 18+ or parent/guardian).

## MVP scope (pages)
1. **Home** (`index.html`) — hook ("What does a first-year sparky actually take home?"), three calculator
   cards, featured guides, newsletter sign-up, "Find a pre-apprenticeship near you" enquiry CTA.
2. **Apprentice pay calculator** (`apprentice-pay.html`) — inputs: trade/award (Carpenter/Bricklayer/Tiler etc.
   under Building & Construction General On-site Award; Electrician under the Electrical, Electronic &
   Communications Contracting Award; Plumber under the Plumbing & Fire Sprinklers Award), apprentice year 1–4,
   junior vs adult apprentice, Year 12 completed (where the award distinguishes), ordinary hours/week.
   Outputs: award minimum hourly + weekly gross, annual gross, estimated income tax + Medicare levy,
   take-home weekly and fortnightly, plus the Key Apprenticeship Program payment timeline ($ and when) if
   the trade is eligible. Clear note: minimums only; many employers pay above award; allowances excluded;
   check the Fair Work Pay Calculator.
3. **Trade vs uni calculator** (`trade-vs-uni.html`) — compare two paths from age 17/18 to a chosen age
   (default 25, slider to 35): apprenticeship wages → qualified tradesperson wage; vs 3–4 year degree with
   part-time income → graduate salary. Includes HELP debt accrual, indexation and compulsory repayments
   (2026–27 rules), KAP payments, and shows cumulative after-tax earnings and net position (earnings minus
   outstanding HELP) on a simple chart. Every assumption visible and editable, labelled "illustrative".
4. **Employer cost calculator** (`employer-cost.html`) — "Can my business afford an apprentice?": apprentice
   award wage × hours, superannuation guarantee, workers comp (editable % estimate), minus employer
   incentives the business may be eligible for (first-year), net yearly + weekly cost; GTO option explained.
   Fake-door CTA: "Get the free Employer Apprentice Dashboard — join the waitlist".
5. **Guides** (`guides/*.html` + `guides/index.html`) — 5 seed articles (dated, sourced, ~700–1,000 words):
   - What first-year apprentices actually earn in NSW (2026–27)
   - The $10,000 Key Apprenticeship Program payment, explained
   - Trade vs uni: the honest numbers at 25
   - Why 4 in 10 construction apprentices don't finish — and what helps
   - Thinking of a trade at 28? A career-changer's guide to adult apprenticeships
6. **About the numbers** (`about-data.html`) — methodology, sources with links and effective dates,
   last-updated date, disclaimers (general information only, not financial/legal advice).

## Technical approach
- Plain static site: HTML + one CSS file + vanilla JS. No build step, no framework, no external network
  requests (optional Google Fonts only). Relative links only. Deploys anywhere (Cloudflare Pages/Netlify)
  later; must also run as a claude.ai artifact (strict CSP: no fetch, no remote images, no alert/confirm,
  forms must preventDefault and show in-page confirmation).
- `site/js/rates.js` — single source of truth for every figure: value, effective date, source URL, note.
- `site/js/calc.js` — pure calculation functions (UMD-style so Node can `require` it).
- `site/js/ui-*.js` — page wiring. Charts: inline SVG drawn by our own JS (no library).
- `tests/calc.test.js` — `node --test`; includes hand-checked worked examples.
- Mobile-first (390px) and desktop (1280px). Semantic HTML, labelled inputs, AA contrast.
- SEO basics: unique titles/meta descriptions, canonical placeholders, FAQ schema on guides.
- Demo forms (newsletter, enquiry, employer waitlist) are front-end only for the MVP and say so in code
  comments; later wire to Beehiiv/ConvertKit and Tally/Formspree.

## Data rules (non-negotiable)
- Every number shown to users comes from `rates.js` with a primary source (Fair Work pay guides /
  awards, ATO, DEWR/Australian Apprenticeships, Study Assist, NCVER, QILT) and effective date.
- If a figure cannot be verified from a primary source, do not invent it: mark it `verified:false`, show it
  as "illustrative / editable" in the UI, and list it in PROGRESS.md under Known issues.
- Australian English. No text copied from sources; paraphrase and link.

## Monetisation (post-MVP, not built now)
RTO/GTO pay-per-lead on the enquiry form; one newsletter sponsor slot; display ads once traffic exists;
fake-door waitlist validates the paid employer tool.

## Acceptance criteria for the MVP
1. All three calculators work and match hand-checked examples; `node --test` passes.
2. Every displayed figure traceable to `rates.js` with source + date; unverified ones clearly labelled.
3. Renders cleanly at 390px and 1280px with no console errors (checked with Playwright screenshots).
4. Works with zero network access other than optional Google Fonts.
5. Five guides + about-data page complete, accurate, plain-English, with disclaimers.
6. Newsletter, enquiry and waitlist forms show in-page confirmation; no alert/confirm/prompt.
7. An independent reviewer (fresh agent that did not build it) signs off against 1–6.

## Out of scope for MVP
Real email/lead backend, hosting/deploy, analytics, ads, accounts, other states' rules beyond what is
national (awards and tax are national; state-specific notes only where needed), the paid employer tool.

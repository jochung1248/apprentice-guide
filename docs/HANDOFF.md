# Workstream: Apprentice Guide (apprentice pay, incentives & pathways hub): handoff brief

Open a new chat in the Side Hustler project and say: "Read workstreams/apprentice-hub/HANDOFF.md and continue as the build lead." That chat should work only on this product.

## Role
You are the build lead. You may use sub-agents, test and iterate. Don't post to social media, contact anyone, spend money, buy a domain or deploy publicly without Joseph's say-so.

## Where things live
- **Code:** the private GitHub repo `jochung1248/tradie-numbers`, branch `main`. It holds a static site in `site/` (no build step), tests in `tests/`, docs in `docs/`, and design sources in `design/`.
  - Run locally: `cd site && python3 -m http.server`
  - Tests: `npm test` (24 tests)
  - Rates are updated every 1 July in `site/js/rates.js`; see `docs/README.md`.
- **Live demo (claude.ai page):** "Apprentice Guide — MVP demo"
- **Claude Design canvases:**
  - "Apprentice Guide — Brand theme & social board" (palette, type, motifs, website hero, 4 post templates). Source is in `design/brand-board/`.
  - "Apprentice Guide — Launch social posts" (59 artboards: 6 carousels, 6 tweet cards, 4 stat cards, 3 Reel covers, 3 fun posts). Source is in `design/social-posts/`. Captions, alt text, hashtags, Reel scripts and posting order are in `docs/social/POSTS.md`.
- **Docs:** `docs/BUILD_PLAN.md`, `BRAND.md`, `SOCIAL_CONTENT.md`, `DATA_SOURCES.md`, `PROGRESS.md`, `REVIEW-1.md` and `REVIEW-2.md` (independent review, signed off on 17 Nov 2026).

## Deploy
Run `tools/deploy-pages.sh` after changes to `site/`. It pushes `site/` to the `gh-pages` branch, which GitHub Pages serves (Settings → Pages → Deploy from branch: gh-pages, /root).

## Status (17 Nov 2026): v1.1 live
- **Live site:** https://jochung1248.github.io/tradie-numbers/ (GitHub Pages, served from the gh-pages branch). The Instagram handle @apprenticeguide is secured; there is no brand email yet.
- **v1.1 adds:**
  - 22 trades across 8 awards;
  - age at start (adult = 21+);
  - a state selector with verified per-state help panels (fee-free training, travel allowances, payroll tax, licensing bodies, and a WA state-system caveat);
  - a capital/regional toggle.
- **Review:** independent review round 3 is signed off (docs/REVIEW-3.md). Tests pass 32/32.
- **Not yet covered:** air-con/refrigeration mechanic (the award depends on the employer). Trade vs uni assumes 4-year apprenticeships and leaves out the training support payment.

### MVP (earlier the same day)
- **Pages:** 3 calculators (apprentice take-home pay, trade vs uni, employer cost), 5 guides, an about/data page, and front-end-only forms (newsletter, pre-apprenticeship enquiry, employer dashboard waitlist as a fake door).
- **Figures:** all award, tax, HELP and incentive figures for 2026–27 are verified against primary sources. Anything unverified is labelled "illustrative — edit to suit".

## Known issues and open items
- **Medicare low-income thresholds** are 2025–26 values. Update them when the ATO publishes 2026–27.
- **Social post placeholders:** `[1ST-YR … WEEKLY TAKE-HOME]` in carousel C1 and the trade-vs-uni Reel figures are still placeholders. Fill them from the live calculator once the thresholds are verified.
- **Incentive deadline:** the employer Key Apprenticeship Program incentive applies to apprentices starting by Dec 2026. Re-check it in Jan 2027.
- **Government payments** are not taxed in the calculators, because how they're taxed is unconfirmed.
- **HELP indexation** is applied in the year the debt is taken on, which slightly overstates the balance. This is disclosed on the about page.
- **Unchecked:** the name "Apprentice Guide" and handle @apprenticeguide. Check domain and trademark availability.

## Next milestone: "launch-ready"
1. Check the domain and handles. Deploy to Cloudflare Pages (free tier) with Joseph's OK.
2. Wire up the forms: Beehiiv or ConvertKit for the newsletter, and Tally or Formspree for the enquiry form and waitlist. Add Plausible or Cloudflare analytics with UTM tags.
3. Validate (30 days):
   - interview 10 tradies, 3 Group Training Organisations, 2 RTOs, 3 careers advisers and 5 parents;
   - run a $150–300 Meta/TikTok ad test (signal: more than 20% of landing-page visitors sign up);
   - count employer waitlist sign-ups.
4. Run the 2-week social launch sequence from `docs/social/POSTS.md`.
5. Expand from 5 to 20 guides; add other states' notes.

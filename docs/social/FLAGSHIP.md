# Flagship carousel: "10 things nobody tells you about apprentice pay" (12 slides, 1080×1350)

All figures come from `site/js/rates.js` (FY2026–27, effective 1 July 2026) or the calc.js output. The "Check" lines are for the builder and never appear on the slides.

**1. Cover**
- Kicker: APPRENTICE GUIDE · 2026–27 PAY GUIDE
- Title: 10 things nobody tells you about apprentice pay
- Pill: READ MORE ▸

**2. ONE**
- Headline: Your pay goes up 68% before you finish.
- Subhead: A first-year chippy starts on $654 a week. By fourth year it's $1,102, and $1,214 once qualified.
- Chart label: WEEKLY PAY, CARPENTRY APPRENTICE, BY YEAR
- Chart values: Y1 $654 · Y2 $766 · Y3 $934 · Y4 $1,102 · Qualified $1,214 (line or bars)
- Kicker: **Quitting in year two costs you the best years.** Years three and four add $168 a week each.
- Check: junior, no Year 12. 1102.13/654.49 = 1.684. Y2→Y3 = 167.87 and Y3→Y4 = 167.86.

**3. TWO**
- Headline: Finishing Year 12 is worth $5,800.
- Subhead: Building apprentices who finished Year 12 earn $56 a week more in their first two years.
- Chart label: WEEKLY PAY, CARPENTRY APPRENTICE, WITH AND WITHOUT YEAR 12
- Chart values (grouped bars):
  - Year 1: $654 vs $710
  - Year 2: $766 vs $822
  - Year 3: $934 vs $934
- Kicker: **From third year, it stops mattering.** Everyone's on the same rate.
- Check: 55.96 × 52 × 2 = $5,819.84.

**4. THREE**
- Headline: Start at 21 and your first year pays 69% more.
- Subhead: A 21-year-old first-year chippy earns $1,108 a week. A 17-year-old earns $654.
- Chart label: FIRST-YEAR WEEKLY PAY, UNDER 21 VS 21+
- Chart values (paired bars):

  | Trade | Under 21 | 21+ |
  |---|---|---|
  | Carpenter | 654 | 1,108 |
  | Electrician | 623 | 983 |
  | Plumber | 629 | 1,046 |
  | Mechanic | 560 | 895 |
  | Chef | 616 | 895 |
  | Hairdresser | 560 | 895 |

- Kicker: **That's $23,600 more in year one.** Career changers start ahead.
- Check: 1108.44/654.49 = 1.694, and (1108.44 − 654.49) × 52 = $23,605.

**5. FOUR**
- Headline: Chippies out-earn sparkies for four straight years.
- Subhead: A carpentry apprentice earns more than an electrical apprentice in every year of the apprenticeship.
- Chart label: WEEKLY PAY BY YEAR, CARPENTRY VS ELECTRICAL
- Chart values (two lines):
  - Carpentry: 654, 766, 934, 1,102, Q 1,214
  - Electrical: 623, 743, 863, 1,007, Q 1,223
- Kicker: **Then sparkies overtake.** Qualified electricians earn $1,223 a week, carpenters $1,214.

**6. FIVE**
- Headline: Same first year. Up to $95 a week apart.
- Subhead: Building trades pay first-year apprentices the most. Mechanics, hairdressers and fitters start lowest.
- Chart label: FIRST-YEAR WEEKLY PAY BY TRADE (UNDER 21)
- Chart values (horizontal bars, sorted): Carpenter 654 · Bricklayer 643 · Plumber 629 · Electrician 623 · Chef 616 · Concreter 613 · Cabinetmaker 602 · Mechanic 560 · Hairdresser 560
- Kicker: **That's nearly $5,000 a year** before you've picked up a tool.
- Check: 654.49 − 559.55 = 94.94, and × 52 = $4,937.

**7. SIX**
- Headline: The government pays you $10,000 to finish.
- Subhead: Housing construction apprentices get five $2,000 payments: at 6, 12, 24 and 36 months, and on completion.
- Chart label: KEY APPRENTICESHIP PROGRAM PAYMENTS
- Chart values (timeline): 6 mo $2K · 12 mo $2K · 24 mo $2K · 36 mo $2K · Completion $2K
- Kicker: **Drop out in year two and you leave $6,000 on the table.**

**8. SEVEN**
- Headline: Tax barely touches a first-year wage.
- Subhead: A first-year chippy earns $654 a week and takes home $611. Tax and Medicare take $44.
- Chart: a payslip-style breakdown (Gross $654 · Tax + Medicare −$44 · Take-home $611)
- Kicker: **That's $31,756 a year in your pocket at 17,** with no uni debt.
- Check: calc.apprenticePay gives carpenter, year 1, age 17, no Y12, 38 hrs: take-home $610.70 a week, $31,756 a year.

**9. EIGHT**
- Headline: Hiring you costs your boss about $700 a week.
- Subhead: Wages, super, workers comp, training and tools come to $41,279 in year one. A $5,000 incentive brings it to $36,279.
- Chart label: WHAT A FIRST-YEAR APPRENTICE COSTS A BUSINESS
- Chart values (bars): Wages $34,033 · Super $4,084 · Workers comp $1,361 · Training $1,000 · Tools $800 · Incentive −$5,000
- Kicker: **That's why small builders think twice.** And why the ones who hire you want you to stay.
- Check: calc.employerCost netWeekly is $697.67.

**10. NINE**
- Headline: 4 in 10 trade apprentices don't finish.
- Subhead: About 6 in 10 trade apprentices finish within six years. Electricians do best.
- Chart: VERIFY FIRST. Fetch NCVER "Apprentice and trainee completion rates 2025" (and the outcomes 2025 page for 15.6%). Use whichever verified six-year figures exist: trades overall, construction, electrotechnology. If only secondary figures are available (58.7% trades, about 72% electricians), use them, but mark them in POSTS.md.
- Kicker: **Most of them could have been kept.** Only [15.6% if verified] of those who quit say nothing would have changed their mind. Otherwise: "The top reason they give is pay, conditions or the workplace." (27.7%, verified)

**11. TEN**
- Headline: Finish, and you're almost guaranteed a job.
- Subhead: 94.8% of trade apprentices who finish are employed after training. Of those who leave early, 77% are.
- Chart: two bars (Finished 94.8% · Left early 77%)
- Kicker: **And Australia needs 116,700 more of you** to hit its housing target.

**12. Final slide**
- "If only there was a tool…"
- A calculator mockup in brand style: trade picker "Carpenter", year "1st", age "17", result "$611 / week take-home".
- "…that told you what you'd actually take home."
- "It's free. Link in bio." with the AG monogram
- Sources, small: Fair Work Ombudsman pay guides 2026–27 · ATO tax rates 2026–27 · DEWR Key Apprenticeship Program · NCVER 2025 · BuildSkills Australia 2025

**Caption**
> 10 things nobody tells you about apprentice pay in Australia (2026–27 rates)…
>
> Your pay goes up 68% before you finish. Finishing Year 12 is worth $5,800. Start at 21 and your first year pays 69% more.
>
> Free take-home pay calculator for 22 trades: link in bio.
>
> Fine print: national award minimums from 1 July 2026, full-time (38 hrs), apprentices who started after 1 Jan 2014; examples use carpentry (residential) unless stated; under-21 rates assume no Year 12 unless stated. The $10,000 Key Apprenticeship Program covers eligible housing construction apprentices who started from 1 July 2025. Employer costs include illustrative workers comp (4%), training ($1,000) and tools ($800). WA sole traders and partnerships use WA state awards. Sources: Fair Work Ombudsman, ATO, DEWR, NCVER, BuildSkills Australia.
>
> #apprenticeship #tradie #apprenticepay #careersadvice #australia

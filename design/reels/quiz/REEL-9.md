# Reel 9 — "Guess the Quote: Plumber edition (very hard)"

A quiz Reel. 70.4s, 1080×1920, in the dark explainer style. No audio is baked in, so add a ticking-clock or quiz track in Instagram. Files: `reel-9-guess-the-quote.mp4` and `reel-9-cover.png`. Source page: `../engine/quote.html`.

## Structure

| Time | Screen |
|---|---|
| 0.0–4.8 | Hook: "GUESS THE QUOTE · Plumber edition". A difficulty meter fills to **Very hard**. "Get all 5 right and you're basically a plumber." "5 jobs · 4 options · 5 seconds each" |
| 4.8–64.8 | 5 questions, 12s each:<br>• 0–1.4s: picture and job<br>• 1.4s: options A–D slide in<br>• 2.6–7.6s: 5-second countdown ring<br>• 7.6–12s: answer revealed, with the reason and source |
| 64.8–70.4 | "How many did you get?" Answer recap: 1B 2C 3D 4B 5C. "Comment your score 👇". "Cost guides 2026 + one real 2025 quote" |

## The questions

The options are deliberately tight, and the correct letter moves around (B, C, D, B, C). Q1, Q2 and Q4 prices include GST. The Q3 guide and the Q5 cartridge figure don't say whether GST is included; Q3's answer is D either way ($1,000, or $1,100 with GST added).

| # | Job (on screen) | Options | Answer | Why (on screen) | Source |
|---|---|---|---|---|---|
| 1 | Dripping kitchen tap. Weekday, Sydney, plumber comes out to fix the leak. "Typical price, all in?" | $90–$150 · **$150–$220** · $220–$300 · $300–$400 | B | Typical Sydney price for fixing a leaking tap: about $170 | What's The Damage Sydney plumber cost guide (whatsthedamage.com.au/plumber-cost-sydney/, updated Nov 2026): "Fix a leaking tap", typical about $170 |
| 2 | Hot water tank has died. New electric storage tank, supply + install, Sydney. "Typical price, fitted? (old tank removal extra)" | $900–$1,250 · $1,250–$1,550 · **$1,550–$1,900** · $1,900–$2,400 | C | Typical Sydney price: about $1,700 installed | What's The Damage Sydney hot water cost guide (whatsthedamage.com.au/hot-water-system-cost-sydney/, updated Nov 2026): electric storage, supply + install, typical about $1,700 |
| 3 | Pipe bursts, Saturday night. Emergency plumber, after hours, visit + repair. "Typical total for the call-out and the fix?" | $300–$500 · $500–$700 · $700–$850 · **$850–$1,300** | D | About $450 for the after-hours visit + about $550 for the repair ≈ $1,000 | What's The Damage emergency plumbing guide, national, 2026 (on screen: "What's The Damage (national), 2026"; whatsthedamage.com.au/plumber-cost/emergency-plumbing/): after-hours visit $250–$700 (typical $450); burst-pipe repair $200–$800 (typical $550); visit + repair $450–$1,500 (typical $1,000). There are no Sydney-specific emergency figures, so the screen says "(national)" |
| 4 | Tree roots in the sewer. 10 m of 100 mm pipe relined, no junctions, no digging | $5,000–$6,500 · **$6,500–$7,500** · $7,500–$9,000 · $9,000–$11,000 | B | $2,500 setup + $450 a metre × 10 m = $7,000 (incl. GST) | maida.com.au/pipe-relining-costs-sydney: Maida Plumbing's published price for a standard 100 mm line, all inc. GST; junctions $650 each extra |
| 5 | Leaky shower mixer. Just the cartridge inside the mixer needs replacing. "What was a real customer quoted?" | $200–$500 · $500–$900 · **$900–$1,500** · $1,500–$2,500 | C | $1,350 + GST = $1,485. Even after hours, a fair price is more like $400–$1,000 | Real quote: a ProductReview.com.au customer review, 2025, reviewer in VIC (productreview.com.au/listings/dans-plumbing): "$1350 +GST to fix the leaking shower tap… (Only Replace the internal cartridge…)". On screen: "Customer review (VIC), 2025". Fair range (an estimate, so the screen says "more like"): after-hours visit $290–$805 (What's The Damage Sydney guide) + cartridge replacement $100–$250 (thequoteyard.com.au, NSW leaking-tap costs) ≈ $400–$1,000 |

Notes:
- **Q1–Q3:** these come from one independent cost guide (What's The Damage), so the quiz is consistent. Q1–Q2 use its Sydney pages; Q3 uses its national emergency page. Its figures are compiled estimates, not official data, so the screen says "cost guide".
- **Q4:** this is one company's published formula. The screen says "A Sydney reliner's published prices" and doesn't name the company. Other Sydney relining companies use similar setup + per-metre pricing.
- **Q5:** a real quote from a public review (a Victorian customer), used as the twist. The business is not named anywhere on screen or in the caption. The review page shows only a relative date, so the screen says "2025" with no month or weekday. Before posting, screenshot the review and keep it in the project folder as a record. The "fair" range is an estimate built from two cost guides, and the screen says "more like". The fair range comes from Sydney and NSW guides, while the quote is Victorian; prices are broadly similar, but treat it as a ballpark.

## Caption

Guess the Quote: plumber edition 🔧 Difficulty: very hard.

5 common plumbing jobs. 5 seconds each. How many did you get? Comment your score 👇

Answers: 1B · 2C · 3D · 4B · 5C

Where the prices come from:
- Q1–2: typical Sydney prices from the What's The Damage cost guides (2026, incl. GST).
- Q3: typical national prices from the What's The Damage emergency plumbing guide (2026).
- Q4: a Sydney reliner's published prices (incl. GST).
- Q5: a real quote from a Victorian customer review (2025).

Your quote will depend on the job, your suburb and the time of day. Always get a written quote first.

#plumber #tradie #plumbing #sydney #guessthequote #apprentice #quiz

## Optional voiceover (the screen works without it)

- **Hook:** "Guess the quote. Plumber edition. Difficulty: very hard. Get all five and you're basically a plumber."
- **Each question:** read the job title, let the timer run, then read the answer letter and the one-line reason.
- **End:** "How many did you get? Comment your score."

## Photos

The pictures are drawn illustrations, so there's nothing to license or credit.

To use real photos instead:
1. Pass one photo per question: `setPhotos({q1:'photos/tap.jpg', … q5:…})` in `quote.html`.
2. Re-render.

The photo box is 880×500 (landscape, cropped to fill). Use your own photos or free-licence ones (Unsplash, Pexels). Suggested searches: "dripping kitchen tap", "hot water cylinder", "burst pipe water spray", "tree roots sewer pipe", "shower mixer tap".

# Apprentice Guide: brand theme v1 (17 Nov 2026)

**The idea: "Hi-vis meets payslip".** Honest numbers delivered with site-signage confidence. The look is warm concrete ground, charcoal ink, one loud safety-orange accent, blueprint blue for data, and a highlighter yellow used only to mark numbers. Big condensed numerals like site signage; clean sans for reading; mono labels like dimension callouts on a building plan. It should feel useful and a bit cheeky, never corporate, and never a cartoon of a tradie.

## Colour — Theme v2 (20 Nov 2026, replaces the orange accent)
Chosen from three schemes (brown/cream/baby blue, sage/off-white/tomato, charcoal/silver/yellow) after mocking each up on the site. Charcoal + safety yellow won: it reads as site signage, matches the dark Reel style, and passes the squint test (the yellow call to action is the thing that stands out).

| Role | Hex | Use |
|---|---|---|
| Charcoal | #282D31 | Page and Reel background |
| Card | #30363B / raised #3A4146 | Cards, rows, table heads |
| Night | #1F2327 | Header, footer, dark panels, logo square |
| Silver | #D9DADC | Body text; #A9AEB3 for secondary text |
| Safety yellow | #FFCB3C | Calls to action, current nav item, the one key number per screen. Nothing else. |
| Rule grey | #6B747B | Hazard stripes, side borders, decoration |
| Go green | #4CC38A (site) / #2FB36B (Reels) | Correct answer, positive change |
| Alert red | #FF6A5E | Warnings, "very hard" |

Links are white/silver and underlined, turning yellow on hover. Charts: trade = yellow, uni = #8FA8FF. All text meets WCAG AA. Reels use the same palette (see design/reels/engine/quote.html).

## Colour (v1, retired)
| Token | Hex | Role | Notes |
|---|---|---|---|
| `ink` | `#16181D` | Primary text, dark backgrounds (tweet cards, covers) | |
| `concrete` | `#F4F1EA` | Default ground | Warm off-white |
| `paper` | `#FFFFFF` | Cards on concrete | |
| `chalk` | `#E2DDD2` | Hairlines, dividers, input borders | |
| `steel` | `#5B616A` | Secondary text | 5.3:1 on concrete |
| `hivis` | `#FF6B1A` | THE accent: fills, big numbers on ink, buttons with ink text | Not for small text on light grounds (fails contrast) |
| `hivis-deep` | `#C2410C` | Orange text and links on light grounds | 4.9:1 on concrete |
| `blueprint` | `#2F5BEA` | Data series 2 (the "uni path"), info, links on dark | 4.9:1 on concrete; pair with orange in charts (colour-blind safe) |
| `blueprint-light` | `#8FA8FF` | Blueprint text on ink | |
| `highlighter` | `#FFE14D` | Marker swipe behind a key number only | Never as text |
| `go` | `#1F8A4C` | Positive deltas (+$) | Always paired with a +/− sign, never colour alone |

**Proportions:** about 70% concrete or ink ground, 20% ink or concrete type, 8% hi-vis, 2% highlighter/blueprint.
**Dark mode / dark posts:** ink ground, concrete text, hi-vis numbers, blueprint-light for the second series.

## Type (Google Fonts)
- **Display / numerals:** `Anton` (condensed, signage). Uppercase headlines and huge numbers. Line-height 0.95, tracking +0.5px.
- **Text / UI / tweet cards:** `Inter` 400/600/800. Body 16–18px (web), 34–40px (1080px social).
- **Labels / callouts / sources:** `JetBrains Mono` 500, uppercase, tracking +1px, like dimension labels.

## Shape and texture
- Radius: 6px for inputs and buttons, 14px for cards. Pills only for tags.
- Signature motifs:
  1. A hazard stripe: a thin 45° ink/hi-vis stripe band, used as a top or bottom edge only.
  2. A measuring-tape tick ruler along an edge.
  3. A "payslip" card: a white card with a dashed tear line and mono labels.
  4. A highlighter swipe behind a key number.
- No emoji, no gradient washes, no stock photos of hard hats. Icons are simple 2px stroke line icons.
- **Logo / avatar: the "AG" monogram.** An `ink` (#16181D) rounded square (radius 6 on a 40-unit square) with the letters "AG" in Anton, `hivis` (#FF6B1A), centred, about 58% of the square's height. On ink grounds (site header) add a 1.5px `steel` (#5B616A) outline so the square doesn't disappear. The wordmark beside it is "APPRENTICE GUIDE" in Anton: "APPRENTICE" in concrete (ink on light grounds) and "GUIDE" in hi-vis. The favicon is the same mark as an inline SVG data URI (no outline). No hard hats or tradie figures in the logo.

## Social formats (1080px base)
- **Carousel:** 1080×1350 (4:5). Cover = big Anton hook + hazard stripe; slides = 1 idea each; last slide = source + call to action ("Free calculator: link in bio").
- **Tweet/quote card:** 1080×1350 or 1080×1080, ink ground (or concrete for the light variant), brand avatar + "Apprentice Guide" + @apprenticeguide handle, Inter text. Our own account only. No X/Twitter logo or other platform UI.
- **Stat card:** 1080×1080, one huge Anton number in hi-vis, one-line context, mono source line.
- **Reel/TikTok cover:** 1080×1920, hook in the top third, safe zones clear of the platform UI (top 220px, bottom 420px).
- Every number carries a mono source line, e.g. `SOURCE: NCVER 2025 · 2019 COHORT`.

## Name and handle
**Apprentice Guide** (working name), handle **@apprenticeguide**. Renamed from the earlier working name on 17 Nov 2026.

## Voice
Tagline / voice line: **"Honest numbers for apprentices."**

Plain Australian English, short sentences, numbers first. Respectful of both tradies and uni grads. Light humour, never punching down. Say "award minimum", not "you'll earn".

# Apprentice Guide reel engine ("site board" format)

**Look:** a concrete background with hazard-stripe edges, a tape-measure progress bar, data drawn as measuring tapes, rubber-stamp numbers, payslip cards and sticker captions. The output is 1080×1920 at 30 fps, and the content stays clear of Instagram's top 220px and bottom 420px.

**Run:**
1. Copy the brand fonts into `fonts/` (anton, inter, and jetbrains-mono woff2).
2. Run `python3 -m http.server 8810` in this folder.
3. Run `python3 render2.py <reel-name>`. Use `preview` to render only the key frames.

Scripts live in `scripts.py`, one dict per reel. The scene types are `hook`, `tapes`, `stamp`, `payslip`, `timeline`, `round` (the scoreboard) and `end`. Every figure must come from `site/js/rates.js` or the verification log in `docs/social/POSTS.md`.

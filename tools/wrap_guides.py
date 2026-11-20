"""
One-off authoring helper: wraps guide article bodies (written as *.body.html with META/FAQ comments)
in the shared page shell and writes site/guides/*.html plus site/guides/index.html.
The output is plain static HTML — the site itself has no build step. After generation, edit the
HTML files directly (or edit the bodies and re-run: python3 tools/wrap_guides.py <bodies-dir>).
"""
import json, re, sys, os, html
SRC = sys.argv[1] if len(sys.argv) > 1 else '/tmp/guides'
OUT = os.path.join(os.path.dirname(__file__), '..', 'site', 'guides')
DATE_ISO, DATE = '2026-11-17', '17 November 2026'
ORDER = ['first-year-apprentice-pay-nsw', 'key-apprenticeship-program-10000', 'trade-vs-uni-at-25',
         'why-apprentices-dont-finish', 'career-change-adult-apprenticeship']

ICON = '<link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2040%2040%27%3E%3Crect%20width=%2740%27%20height=%2740%27%20rx=%276%27%20fill=%27%231F2327%27/%3E%3Ctext%20x=%2720%27%20y=%2729.5%27%20text-anchor=%27middle%27%20font-family=%27Anton,%20Impact,%20Arial%20Narrow%20Bold,%20sans-serif%27%20font-size=%2723%27%20fill=%27%23FFCB3C%27%3EAG%3C/text%3E%3C/svg%3E">'
FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Inter:wght@400;600;800&amp;family=JetBrains+Mono:wght@500&amp;display=swap">'

def head(title, desc, canon):
    return f'''<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="https://www.example.com/guides/{canon}">
{ICON}
{FONTS}
<link rel="stylesheet" href="../css/styles.css">
'''

HEADER = '''<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="stripe" aria-hidden="true"></div>
  <div class="wrap">
    <a class="brand" href="../index.html"><svg viewBox="0 0 40 40" aria-hidden="true"><rect x=".75" y=".75" width="38.5" height="38.5" rx="6" fill="#1F2327" stroke="#454C52" stroke-width="1.5"/><text x="20" y="29.5" text-anchor="middle" font-family="Anton, Impact, 'Arial Narrow Bold', sans-serif" font-size="23" letter-spacing=".5" fill="#FFCB3C">AG</text></svg><span>Apprentice <b>Guide</b></span></a>
    <nav class="site-nav" aria-label="Main">
      <ul>
        <li><a href="../pay-check.html">Pay check</a></li>
        <li><a href="../apprentice-pay.html">Apprentice pay</a></li>
        <li><a href="../trade-vs-uni.html">Trade vs uni</a></li>
        <li><a href="../employer-cost.html">Employer cost</a></li>
        <li><a href="index.html"{cur}>Guides</a></li>
        <li><a href="../about-data.html">About the numbers</a></li>
      </ul>
    </nav>
  </div>
</header>
'''

FOOTER = '''<footer class="site-footer">
  <div class="wrap">
    <nav aria-label="Footer">
      <ul>
        <li><a href="../pay-check.html">Pay check</a></li>
        <li><a href="../apprentice-pay.html">Apprentice pay</a></li>
        <li><a href="../trade-vs-uni.html">Trade vs uni</a></li>
        <li><a href="../employer-cost.html">Employer cost</a></li>
        <li><a href="index.html">Guides</a></li>
        <li><a href="../about-data.html">About the numbers</a></li>
        <li><a href="../index.html#enquire">Find a pre-apprenticeship</a></li>
      </ul>
    </nav>
    <p class="checked">Figures last checked: <span data-last-checked>17 November 2026</span> · <span data-fy>2026–27</span> rates</p>
    <p class="disclaimer">General information only — not financial, legal or tax advice. Pay figures are award minimums from Fair Work pay guides; many employers pay more, and overtime, penalty rates and most allowances aren't included. Check your exact entitlements with the <a data-fw-calc href="https://calculate.fairwork.gov.au/" target="_blank" rel="noopener">Fair Work Pay Calculator</a>. Government payments have eligibility rules and can change — confirm with your Apprentice Connect Australia provider.</p>
    <p class="disclaimer">Apprentice Guide (working name) is independent and not affiliated with any government agency.</p>
  </div>
</footer>
<script src="../js/rates.js"></script>
<script src="../js/ui-common.js"></script>
</body>
</html>
'''

DISCLAIMER = '''<div class="note mt-m"><p><strong>General information only.</strong> This guide explains the rules in general terms and isn't financial, legal or tax advice. Pay figures are award minimums; your employer may pay more. Check your exact entitlements with the <a data-fw-calc href="https://calculate.fairwork.gov.au/" target="_blank" rel="noopener">Fair Work Pay Calculator</a>, and confirm government payments with your Apprentice Connect Australia provider. Every figure here is listed with its source on our <a href="../about-data.html">About the numbers</a> page.</p></div>'''

def words(t):
    t = re.sub(r'<!--.*?-->', ' ', t, flags=re.S)
    return len(re.sub(r'<[^>]+>', ' ', t).split())

cards = []
for slug in ORDER:
    body = open(os.path.join(SRC, slug + '.body.html')).read()
    meta = json.loads(re.search(r'<!--META (.*?) -->', body, re.S).group(1))
    faq = json.loads(re.search(r'<!--FAQ (.*?) -->', body, re.S).group(1))
    body = re.sub(r'<!--(META|FAQ) .*? -->\n?', '', body, flags=re.S)
    n = words(body)
    mins = max(3, round(n / 220))
    callout = f'<div class="callout"><p><strong>Try it yourself.</strong> {html.escape(meta["calcLabel"])} — every figure updates live.</p><a class="btn" href="../{meta["calc"]}">Open the calculator</a></div>'
    # put the calculator callout right after the lede, and again before the FAQ
    body = body.replace('</p>\n', '</p>\n' + callout + '\n', 1)
    body = body.replace('<h2>Frequently asked questions</h2>', callout + '\n\n<h2>Frequently asked questions</h2>', 1)
    ld_faq = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]}
    ld_art = {"@context": "https://schema.org", "@type": "Article", "headline": meta['title'], "datePublished": DATE_ISO,
              "dateModified": DATE_ISO, "author": {"@type": "Organization", "name": "Apprentice Guide"}, "inLanguage": "en-AU"}
    page = head(meta['seo'], meta['desc'], meta['slug'])
    page += '<script type="application/ld+json">' + json.dumps(ld_art, ensure_ascii=False) + '</script>\n'
    page += '<script type="application/ld+json">' + json.dumps(ld_faq, ensure_ascii=False) + '</script>\n</head>\n'
    page += HEADER.replace('{cur}', '')
    page += f'''
<main id="main">
  <section class="hero">
    <div class="wrap">
      <span class="kicker">Guide · <span data-fy>2026–27</span></span>
      <h1>{html.escape(meta['title'])}</h1>
      <p class="meta">Published <time datetime="{DATE_ISO}">{DATE}</time> · Figures checked <time datetime="{DATE_ISO}">{DATE}</time> · {mins} min read</p>
    </div>
  </section>
  <article class="wrap article">
{body}
{DISCLAIMER}
    <p class="mt-m"><a href="index.html">← All guides</a></p>
  </article>
</main>

'''
    page += FOOTER
    open(os.path.join(OUT, meta['slug']), 'w').write(page)
    lede = re.search(r'<p class="lede">(.*?)</p>', body, re.S).group(1)
    cards.append((meta, lede, mins))
    print(slug, n, 'words')

# index
page = head('Guides — apprentice pay, incentives and trade vs uni | Apprentice Guide',
            'Plain-English guides to apprentice pay, the Key Apprenticeship Program, trade vs uni, apprentice completion and adult apprenticeships in Australia (2026–27).', 'index.html')
page += '</head>\n' + HEADER.replace('{cur}', ' aria-current="page"')
page += '''
<main id="main">
  <section class="hero">
    <div class="wrap">
      <span class="kicker">Guides · <span data-fy>2026–27</span></span>
      <h1>Guides</h1>
      <p class="lede">Plain-English explainers with the working shown. Every figure links back to its source, and each guide ends with a calculator so you can run your own numbers.</p>
    </div>
  </section>
  <section class="wrap">
    <div class="guide-list">
'''
for meta, lede, mins in cards:
    page += f'''      <article class="card">
        <p class="meta">{DATE} · {mins} min read</p>
        <h2 class="h3-size"><a href="{meta['slug']}">{html.escape(meta['title'])}</a></h2>
        <p>{lede}</p>
      </article>
'''
page += '''    </div>
  </section>
</main>

''' + FOOTER
open(os.path.join(OUT, 'index.html'), 'w').write(page)
print('index written')

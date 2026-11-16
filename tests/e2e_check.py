"""
Browser checks for Apprentice Guide (Playwright + Chrome).

Usage (from the project root):
    python3 -m http.server 8765 --directory site &      # serve the site
    python3 tests/e2e_check.py [--offline] [--shots DIR]

What it does:
  * loads every page at 390x844 and 1280x800, saves full-page screenshots
  * records console errors / page errors and every non-localhost request
  * --offline aborts all non-localhost requests (proves the site works with zero network;
    Google Fonts then falls back to system fonts)
  * exercises the three calculators and the three demo forms and prints results as JSON
Exit code 1 if any console/page error was seen or a functional check failed.
"""
import json, sys, os, argparse
from playwright.sync_api import sync_playwright

BASE = os.environ.get('TN_BASE', 'http://localhost:8765/')
PAGES = ['index.html', 'apprentice-pay.html', 'trade-vs-uni.html', 'employer-cost.html', 'about-data.html',
         'guides/index.html', 'guides/first-year-apprentice-pay-nsw.html', 'guides/key-apprenticeship-program-10000.html',
         'guides/trade-vs-uni-at-25.html', 'guides/why-apprentices-dont-finish.html', 'guides/career-change-adult-apprenticeship.html']
VIEWPORTS = {'mobile': (390, 844), 'desktop': (1280, 800)}

ap = argparse.ArgumentParser()
ap.add_argument('--offline', action='store_true')
ap.add_argument('--font-dir', default=os.environ.get('TN_FONT_DIR', ''),
                help='Folder with @fontsource packages (anton, inter, jetbrains-mono). If given, Google Fonts requests are '
                     'answered from these local files so screenshots show the real brand fonts in sandboxes without internet.')
ap.add_argument('--shots', default=os.path.join(os.path.dirname(__file__), '..', 'screenshots'))
args = ap.parse_args()
os.makedirs(args.shots, exist_ok=True)

problems, external, report = [], set(), {}

FONT_FILES = {
    'anton-400': 'anton/files/anton-latin-400-normal.woff2',
    'inter-400': 'inter/files/inter-latin-400-normal.woff2',
    'inter-600': 'inter/files/inter-latin-600-normal.woff2',
    'inter-800': 'inter/files/inter-latin-800-normal.woff2',
    'jbm-500': 'jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2',
}
FAMILIES = {'anton-400': ('Anton', 400), 'inter-400': ('Inter', 400), 'inter-600': ('Inter', 600), 'inter-800': ('Inter', 800), 'jbm-500': ('JetBrains Mono', 500)}

def font_stub(r):
    url = r.request.url
    if url.startswith('https://fonts.googleapis.com/'):
        css = ''.join("@font-face{font-family:'%s';font-weight:%d;font-style:normal;font-display:swap;src:url(https://fonts.gstatic.com/local/%s.woff2) format('woff2');}" % (f, w, k)
                      for k, (f, w) in FAMILIES.items())
        return r.fulfill(status=200, content_type='text/css', body=css)
    key = url.rsplit('/', 1)[-1].replace('.woff2', '')
    return r.fulfill(status=200, content_type='font/woff2', body=open(os.path.join(args.font_dir, 'node_modules', '@fontsource', FONT_FILES[key]), 'rb').read())


def chrome(p):
    exe = '/usr/bin/google-chrome'
    return p.chromium.launch(executable_path=exe if os.path.exists(exe) else None)

with sync_playwright() as p:
    browser = chrome(p)
    for vname, (w, h) in VIEWPORTS.items():
        ctx = browser.new_context(viewport={'width': w, 'height': h})
        def route(r):
            url = r.request.url
            if url.startswith(BASE) or url.startswith('data:'):
                return r.continue_()
            external.add(url.split('?')[0])
            if args.offline:
                return r.abort()
            if args.font_dir and (url.startswith('https://fonts.googleapis.com/') or url.startswith('https://fonts.gstatic.com/local/')):
                return font_stub(r)
            return r.continue_()
        ctx.route('**/*', route)
        for path in PAGES:
            page = ctx.new_page()
            errs = []
            page.on('console', lambda m, errs=errs: errs.append(m.text) if m.type == 'error' and 'fonts.g' not in m.text and 'ERR_FAILED' not in m.text else None)
            page.on('pageerror', lambda e, errs=errs: errs.append(str(e)))
            page.goto(BASE + path, wait_until='load')
            page.evaluate('document.fonts.ready')
            page.wait_for_timeout(300)
            # horizontal overflow check
            sw = page.evaluate('document.documentElement.scrollWidth')
            if sw > w + 1:
                problems.append(f'{vname} {path}: horizontal overflow scrollWidth={sw}')
            name = path.replace('/', '_').replace('.html', '')
            page.screenshot(path=os.path.join(args.shots, f'{name}-{vname}.png'), full_page=True)
            if errs:
                problems.append(f'{vname} {path}: console errors {errs}')
            page.close()
        ctx.close()

    # ---- functional checks (desktop) ----
    ctx = browser.new_context(viewport={'width': 1280, 'height': 800})
    if args.offline:
        ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith(BASE) else r.abort())
    elif args.font_dir:
        ctx.route('https://fonts.g*/**', font_stub)
    page = ctx.new_page()
    page.on('dialog', lambda d: problems.append('dialog opened: ' + d.message))

    page.goto(BASE + 'apprentice-pay.html')
    cases = []
    for trade, year, typ, y12, hours in [('carpenter', '1', 'junior', False, '38'), ('electrician', '4', 'junior', True, '38'),
                                         ('plumber', '2', 'adult', False, '30'), ('bricklayer', '1', 'junior', True, '38')]:
        page.select_option('#trade', trade)
        page.check(f'input[name=year][value="{year}"]', force=True)
        page.fill('#age', '25' if typ == 'adult' else '17')
        page.set_checked('#y12', y12)
        page.fill('#hours', hours)
        page.wait_for_timeout(50)
        cases.append({'in': [trade, year, typ, y12, hours], 'week': page.text_content('#out-week'),
                      'fortnight': page.text_content('#out-fortnight'), 'gross': page.text_content('#out-gross-year'),
                      'kap_items': page.locator('#kap-list li').count()})
    report['apprentice_pay'] = cases
    page.select_option('#trade', 'hairdresser'); page.fill('#age', '17'); page.set_checked('#y12', False); page.fill('#hours', '38')
    page.check('input[name=year][value="1"]', force=True); page.select_option('#state', 'WA'); page.check('input[name=location][value="regional"]', force=True)
    page.wait_for_timeout(50)
    report['v11_hairdresser_wa'] = {'week': page.text_content('#out-week'), 'kap_title': page.text_content('#kap-title'),
        'wa_notice': 'WA employers' in page.inner_html('#state-panel'), 'regional': 'Regional or remote' in page.inner_html('#state-panel'),
        'u18': page.is_visible('#u18-note'), 'optgroups': page.locator('#trade optgroup').count(), 'trades': page.locator('#trade option').count()}
    if not report['v11_hairdresser_wa']['wa_notice'] or report['v11_hairdresser_wa']['trades'] < 15:
        problems.append('v1.1 state panel / trade list check failed')

    page.goto(BASE + 'trade-vs-uni.html')
    tv = []
    for target, field, loading in [('25', 'business', '0'), ('35', 'engineering', '0'), ('30', 'science', '20')]:
        page.select_option('#field', field)
        page.fill('#loading', loading)
        page.locator('#target').fill(target)
        page.wait_for_timeout(80)
        tv.append({'in': [target, field, loading], 'hero': page.text_content('#hero-figure'), 'text': page.text_content('#hero-text'),
                   'trade': page.text_content('#s-trade'), 'uni': page.text_content('#s-uni'), 'help': page.text_content('#s-help'),
                   'paths': page.locator('#chart svg path').count(), 'rows': page.locator('#tvu-table tr').count()})
    page.hover('#chart svg rect')
    tv.append({'tooltip_visible': page.evaluate("document.getElementById('chart-tip').classList.contains('on')")})
    report['trade_vs_uni'] = tv

    page.goto(BASE + 'employer-cost.html')
    ec = []
    for trade, year, typ, comp, inc in [('carpenter', '1', 'junior', '4', 'kap'), ('electrician', '2', 'junior', '3', 'kap'), ('bricklayer', '1', 'adult', '5', 'phi')]:
        page.select_option('#trade', trade)
        page.check(f'input[name=year][value="{year}"]', force=True)
        page.fill('#age', '25' if typ == 'adult' else '17')
        page.fill('#comp', comp)
        page.select_option('#incentive', inc)
        page.wait_for_timeout(50)
        ec.append({'in': [trade, year, typ, comp, inc], 'week': page.text_content('#out-week'), 'year': page.text_content('#out-year'), 'gross': page.text_content('#out-gross')})
    report['employer_cost'] = ec

    # forms: submit empty (expect errors, no navigation), then valid (expect confirmation)
    forms = {}
    page.goto(BASE + 'index.html')
    page.click('#enquire button[type=submit]')
    forms['enquiry_errors_shown'] = page.locator('#enquire .error').count()
    page.fill('#enq-name', 'Test Parent'); page.fill('#enq-email', 'test@example.com'); page.fill('#enq-where', '2150')
    page.select_option('#enq-trade', 'Electrical'); page.select_option('#enq-age', 'parent'); page.check('#enq-consent')
    page.click('#enquire button[type=submit]')
    forms['enquiry_confirm'] = page.is_visible('#enq-confirm') and page.url.endswith('index.html')
    page.fill('#news-email', 'bad'); page.click('#news-h ~ form button')
    forms['newsletter_bad_email_error'] = page.locator('#news-h ~ form .error').count()
    page.fill('#news-email', 'ok@example.com'); page.click('#news-h ~ form button')
    forms['newsletter_confirm'] = page.is_visible('#news-confirm')
    page.goto(BASE + 'employer-cost.html')
    page.fill('#wl-name', 'Sam'); page.fill('#wl-email', 'sam@example.com'); page.select_option('#wl-count', '1')
    page.click('#waitlist button[type=submit]')
    forms['waitlist_confirm'] = page.is_visible('#wl-confirm')
    report['forms'] = forms
    for k, v in forms.items():
        if not v:
            problems.append('form check failed: ' + k)
    browser.close()

report['external_requests'] = sorted(external)
report['problems'] = problems
print(json.dumps(report, indent=1))
sys.exit(1 if problems else 0)

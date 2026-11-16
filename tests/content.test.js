// Content and constraint checks. Run with: node --test
// 1. Every dollar figure and percentage in the static HTML must be traceable to rates.js, either directly or
//    via a calc.js output for stated inputs (listed below). This keeps guides in sync with the calculators.
// 2. Artifact/CSP constraints: no fetch/XHR, no alert/confirm/prompt/print, no remote images, no root-absolute
//    links, no inline style attributes, the only external resource is Google Fonts.
// 3. Guide structure: date, FAQ with valid FAQPage JSON-LD, sources, disclaimer, calculator link.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const SITE = path.join(__dirname, '..', 'site');
const R = require(path.join(SITE, 'js', 'rates.js'));
const C = require(path.join(SITE, 'js', 'calc.js'));

const htmlFiles = (dir = SITE) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(d =>
  d.isDirectory() ? htmlFiles(path.join(dir, d.name)) : d.name.endsWith('.html') ? [path.join(dir, d.name)] : []);
const jsFiles = fs.readdirSync(path.join(SITE, 'js')).map(f => path.join(SITE, 'js', f));

/* ---------------- allowed figures ---------------- */
const allowed = new Set();
const addMoney = (n) => {
  if (!isFinite(n)) return;
  const r2 = Math.round(n * 100) / 100;
  allowed.add(r2.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  allowed.add(Math.round(n).toLocaleString('en-AU'));
  if (Number.isInteger(r2)) allowed.add(r2.toLocaleString('en-AU'));
};
const addPct = (p) => { allowed.add(String(+p.toFixed(2)) + '%'); };
(function walk(o) {
  if (typeof o === 'number') { addMoney(o); addPct(o); if (o < 1) addPct(o * 100); return; }
  if (o && typeof o === 'object') Object.values(o).forEach(walk);
})(R);

// calc.js outputs for every apprentice combination quoted in guides
for (const trade of Object.keys(R.trades)) for (const type of ['junior', 'adult']) for (const y12 of [false, true]) for (const year of [1, 2, 3, 4]) {
  const r = C.apprenticePay({ trade, year, type, y12, hours: 38 }, R);
  [r.weekly, r.hourly, r.annual, r.takeHomeAnnual, r.takeHomeWeekly, r.takeHomeFortnightly, r.tax.total, r.tax.incomeTax, r.tax.medicare, r.tax.bracketTax, r.tax.lito, r.tax.taxable].forEach(addMoney);
}
// Trade vs uni guide scenarios (inputs stated in the guide text)
const base = { trade: 'electrician', startAge: 17, targetAge: 25, y12: false, kapEligible: true, marketLoading: 0, payGrowth: 0.03,
  uniStartAge: 18, degreeYears: 3, contribution: R.help.contributions.value.commerce.amount, partTimeIncome: R.illustrative.partTimeStudyIncome.value,
  gradSalary: R.graduates.medianSalary.value.business, indexation: R.help.indexation.value };
const eng = { contribution: R.help.contributions.value.engineering.amount, gradSalary: R.graduates.medianSalary.value.engineering, degreeYears: 4 };
for (const o of [{}, { targetAge: 35 }, { ...eng, targetAge: 35 }, { marketLoading: 0.2, targetAge: 35 }]) {
  const s = C.tradeVsUni({ ...base, ...o }, R).summary;
  Object.values(s).forEach(v => typeof v === 'number' && addMoney(v));
}
// Explicitly derived figures used in prose:
addMoney(682.76 - 622.72);                         // Year 12 difference, 1st-year electrician = 60.04
addMoney(C.helpRepayment(74000, R));               // HELP on $74,000 = 670.80
addMoney(1108.44 * 52);                            // adult carpenter yearly = 57,638.88 (~$57,639)
addMoney(R.help.contributions.value.commerce.amount * 3); // total borrowed, 3-year business degree
['10,000', '5,000', '2,000', '1,000', '3,000', '2,500', '625', '15,000'].forEach(x => allowed.add(x)); // incentive instalments etc. (also in rates.js)
// Percentages that are rates.js values or plain arithmetic of them
['15%', '16%', '14%', '30%', '37%', '45%', '2%', '12%', '20%', '3%', '2.8%', '4.75%', '0%', '27.7%', '42%', '58.7%', '72%', '77%', '95%', '75.4%', '10%', '17%'].forEach(x => allowed.add(x));
// 16% and 14% are the 2025–26 and 2027–28 bottom rates named in rates.js notes; 20% = AASL completion discount and the guide's illustrative loading.

const textOf = (file) => fs.readFileSync(file, 'utf8')
  .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');

test('every $ and % figure in static HTML is traceable to rates.js or calc.js', () => {
  const bad = [];
  for (const f of htmlFiles()) {
    const t = textOf(f);
    for (const m of t.matchAll(/\$\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)(?![\d,]*\d)/g)) {
      if (!allowed.has(m[1])) bad.push(`${path.relative(SITE, f)}: $${m[1]}`);
    }
    for (const m of t.matchAll(/(\d+(?:\.\d+)?)\s?(?:%|per cent)/g)) {
      if (!allowed.has(m[1] + '%')) bad.push(`${path.relative(SITE, f)}: ${m[1]}%`);
    }
  }
  assert.deepEqual(bad, [], 'Untraceable figures:\n' + bad.join('\n'));
});

test('artifact/CSP constraints hold', () => {
  const issues = [];
  for (const f of [...htmlFiles(), ...jsFiles]) {
    const s = fs.readFileSync(f, 'utf8'), rel = path.relative(SITE, f);
    if (/\bfetch\s*\(|XMLHttpRequest|navigator\.sendBeacon|new\s+WebSocket/.test(s)) issues.push(rel + ': network call');
    if (/\b(alert|confirm|prompt)\s*\(|window\.print/.test(s.replace(/\/\/.*$/gm, ''))) issues.push(rel + ': blocking dialog');
    if (/<img[^>]+src=["']https?:/i.test(s)) issues.push(rel + ': remote image');
    if (/(href|src)=["']\/(?!\/)/.test(s)) issues.push(rel + ': root-absolute path');
    if (/\sstyle=["']/.test(s)) issues.push(rel + ': inline style attribute');
    if (/\sdownload(=|\s|>)/.test(s)) issues.push(rel + ': download link');
    for (const m of s.matchAll(/<(link|script)(?![^>]*rel="canonical")[^>]+(href|src)=["'](https?:[^"']+)/g)) {
      if (!m[3].startsWith('https://fonts.googleapis.com/')) issues.push(rel + ': external resource ' + m[3]);
    }
  }
  assert.deepEqual(issues, []);
});

test('every page has title, meta description, footer disclaimer and last-checked date', () => {
  for (const f of htmlFiles()) {
    const s = fs.readFileSync(f, 'utf8'), rel = path.relative(SITE, f);
    assert.match(s, /<title>[^<]{10,}<\/title>/, rel);
    assert.match(s, /<meta name="description" content="[^"]{50,}"/, rel);
    assert.match(s, /General information only/, rel);
    assert.match(s, /Figures last checked: <span data-last-checked>/, rel);
    assert.match(s, /<html lang="en-AU">/, rel);
  }
});

test('demo forms are front-end only and show an in-page confirmation', () => {
  for (const f of htmlFiles()) {
    const s = fs.readFileSync(f, 'utf8');
    for (const m of s.matchAll(/<form[^>]*data-demo-form[^>]*data-confirm="([^"]+)"/g)) {
      assert.match(s, new RegExp('id="' + m[1] + '"'), path.relative(SITE, f) + ' confirmation element');
    }
    assert.doesNotMatch(s, /<form[^>]+action=/, 'forms must not post anywhere');
  }
  const common = fs.readFileSync(path.join(SITE, 'js', 'ui-common.js'), 'utf8');
  assert.match(common, /preventDefault\(\)/);
  assert.match(common, /BACKEND PLUG-IN POINT/);
});

test('guides: five articles with date, FAQPage JSON-LD, sources, disclaimer and calculator link', () => {
  const guides = htmlFiles(path.join(SITE, 'guides')).filter(f => !f.endsWith('index.html'));
  assert.equal(guides.length, 5);
  for (const f of guides) {
    const s = fs.readFileSync(f, 'utf8'), rel = path.relative(SITE, f);
    assert.match(s, /<time datetime="2026-\d\d-\d\d">/, rel + ' date');
    const ld = [...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
    const faq = ld.find(x => x['@type'] === 'FAQPage');
    assert.ok(faq && faq.mainEntity.length >= 3, rel + ' FAQPage');
    for (const q of faq.mainEntity) assert.ok(s.includes(q.name.replace(/'/g, "'")), rel + ' FAQ visible: ' + q.name);
    assert.match(s, /<h2>Sources<\/h2>/, rel);
    assert.match(s, /General information only\.<\/strong> This guide/, rel);
    assert.match(s, /href="\.\.\/(apprentice-pay|trade-vs-uni|employer-cost)\.html"/, rel);
    const words = textOf(f).split(/\s+/).length;
    assert.ok(words > 700, rel + ' too short: ' + words);
  }
});

test('all relative links resolve to files', () => {
  const missing = [];
  for (const f of htmlFiles()) {
    const s = fs.readFileSync(f, 'utf8');
    for (const m of s.matchAll(/(?:href|src)="([^"#:?]+)(?:[?#][^"]*)?"/g)) {
      const target = path.resolve(path.dirname(f), m[1]);
      if (!fs.existsSync(target)) missing.push(path.relative(SITE, f) + ' -> ' + m[1]);
    }
  }
  assert.deepEqual(missing, []);
});

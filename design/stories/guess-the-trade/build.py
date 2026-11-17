O,I,C,M,Y,S='#FF6B1A','#16181D','#F4F1EA','#C9C5BC','#FFE14D','#5B616A'
st=f'stroke="{I}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"'
TOOLS={
'trowel':f'''<path d="M40 215 L255 118 Q318 185 262 238 Z" fill="{M}" {st}/><line x1="150" y1="190" x2="240" y2="150" stroke="{I}" stroke-width="5" opacity=".35"/><path d="M262 170 L292 118" fill="none" {st}/><rect x="282" y="58" width="44" height="88" rx="20" transform="rotate(32 304 102)" fill="{O}" {st}/>''',
'pipewrench':f'''<rect x="30" y="178" width="250" height="40" rx="20" fill="{O}" {st}/><rect x="268" y="150" width="62" height="96" rx="8" fill="{M}" {st}/><path d="M282 150 L282 62 L372 62 L372 104 L326 104 L326 150 Z" fill="{M}" {st}/><path d="M330 168 L384 168 L384 196 L330 196" fill="{M}" {st}/><ellipse cx="304" cy="128" rx="26" ry="12" fill="{Y}" {st}/>''',
'multimeter':f'''<rect x="120" y="22" width="160" height="236" rx="22" fill="{Y}" {st}/><rect x="142" y="44" width="116" height="62" rx="8" fill="{C}" {st}/><text x="200" y="88" font-family="JBM" font-weight="700" font-size="30" text-anchor="middle" fill="{I}">230V</text><circle cx="200" cy="168" r="42" fill="#fff" {st}/><line x1="200" y1="168" x2="226" y2="138" {st}/><circle cx="168" cy="232" r="9" fill="{I}"/><circle cx="232" cy="232" r="9" fill="{O}"/><path d="M168 240 C160 290 90 270 60 292" fill="none" stroke="{I}" stroke-width="9" stroke-linecap="round"/><path d="M232 240 C240 290 310 270 340 292" fill="none" stroke="{O}" stroke-width="9" stroke-linecap="round"/>''',
'ratchet':f'''<g transform="rotate(-22 200 150)"><rect x="40" y="132" width="230" height="40" rx="20" fill="{O}" {st}/><circle cx="300" cy="152" r="56" fill="{M}" {st}/><circle cx="300" cy="152" r="24" fill="{C}" {st}/><rect x="289" y="141" width="22" height="22" fill="{I}"/></g><rect x="70" y="214" width="66" height="70" rx="10" fill="{M}" {st}/><polygon points="103,226 121,236 121,256 103,266 85,256 85,236" fill="{C}" stroke="{I}" stroke-width="6"/>''',
'scissors':f'''<g><path d="M150 210 L330 60" stroke="{I}" stroke-width="22" stroke-linecap="round"/><path d="M150 210 L330 60" stroke="{M}" stroke-width="12" stroke-linecap="round"/><path d="M150 90 L330 240" stroke="{I}" stroke-width="22" stroke-linecap="round"/><path d="M150 90 L330 240" stroke="{M}" stroke-width="12" stroke-linecap="round"/><circle cx="240" cy="150" r="9" fill="{I}"/><circle cx="105" cy="232" r="40" fill="none" stroke="{I}" stroke-width="24"/><circle cx="105" cy="232" r="40" fill="none" stroke="{O}" stroke-width="13"/><circle cx="105" cy="68" r="40" fill="none" stroke="{I}" stroke-width="24"/><circle cx="105" cy="68" r="40" fill="none" stroke="{O}" stroke-width="13"/></g><g transform="translate(250 200) rotate(-8)"><rect x="0" y="0" width="140" height="26" rx="8" fill="{Y}" {st}/>'''+''.join(f'<line x1="{12+i*13}" y1="26" x2="{12+i*13}" y2="62" stroke="{I}" stroke-width="6" stroke-linecap="round"/>' for i in range(10))+'</g>',
}
ROUNDS=[('trowel','Bricklayer','Brick trowel',642.53,1202.08),('pipewrench','Plumber','Pipe wrench',629.23,1246.54),('multimeter','Electrician','Multimeter',622.72,1223.11),('ratchet','Mechanic','Ratchet and socket',559.55,1119.10),('scissors','Hairdresser','Scissors and comb',559.55,1119.10)]
HAT='<svg viewBox="0 0 200 130" width="54"><path d="M30 98 C30 52 58 30 100 30 C142 30 170 52 170 98 Z" fill="#FF6B1A" stroke="#16181D" stroke-width="9" stroke-linejoin="round"/><path d="M84 98 L84 40 C90 32 110 32 116 40 L116 98 Z" fill="#C2410C" stroke="#16181D" stroke-width="9" stroke-linejoin="round"/><rect x="10" y="94" width="180" height="22" rx="11" fill="#16181D"/></svg>'
FF='''@font-face{font-family:Anton;src:url(fonts/anton-latin-400-normal.woff2)}@font-face{font-family:Inter;font-weight:600;src:url(fonts/inter-latin-600-normal.woff2)}@font-face{font-family:Inter;font-weight:800;src:url(fonts/inter-latin-800-normal.woff2)}@font-face{font-family:JBM;font-weight:700;src:url(fonts/jetbrains-mono-latin-700-normal.woff2)}'''
def page(body,bg=C,fg=I):
    return f'''<!doctype html><html><head><meta charset="utf-8"><style>{FF}body{{margin:0}}.mono{{font-family:JBM;font-weight:700;letter-spacing:2px;text-transform:uppercase}}.s{{height:30px;background:repeating-linear-gradient(45deg,#16181D 0 22px,#FF6B1A 22px 44px)}}
.tape{{height:58px;border:4px solid #16181D;border-radius:6px;box-sizing:border-box;background-image:repeating-linear-gradient(90deg,rgba(22,24,29,.85) 0 3px,transparent 3px 24px);background-size:100% 18px;background-repeat:no-repeat}}</style></head>
<body><div style="width:1080px;height:1920px;background:{bg};color:{fg};font-family:Inter;position:relative;overflow:hidden">{body}</div></body></html>'''
def head(label,fg=I):
    return f'''<div style="position:absolute;left:84px;right:84px;top:270px;display:flex;align-items:center;gap:16px"><div style="width:68px;height:68px;border-radius:14px;background:#fff;border:3px solid #16181D;display:flex;align-items:center;justify-content:center">{HAT}</div><div class="mono" style="font-size:26px;color:{fg}">Apprentice Guide</div><div class="mono" style="margin-left:auto;font-size:26px;color:{O}">{label}</div></div>'''
def bottom(): return '<div class="s" style="position:absolute;left:0;right:0;bottom:0"></div><div class="s" style="position:absolute;left:0;right:0;top:0"></div>'
pages=[]
pages.append(('00-intro',page(bottom()+head('Story quiz')+f'''<div style="position:absolute;left:84px;right:84px;top:470px">
<div class="mono" style="font-size:30px;color:#C2410C">5 tools · 5 trades</div>
<div style="font-family:Anton;font-size:250px;line-height:.88;margin-top:26px">GUESS<br>THE<br><span style="color:{O}">TRADE</span></div>
<div style="font-size:60px;font-weight:800;line-height:1.12;margin-top:40px">One tool per round. Tap your answer.</div>
<div style="font-size:44px;font-weight:600;color:{S};margin-top:24px">Get 5/5 and you’re site-ready.</div></div>''')))
for n,(k,trade,tool,y1,q) in enumerate(ROUNDS,1):
    pages.append((f'{n:02d}a-{k}',page(bottom()+head(f'Round {n} of 5')+f'''<div style="position:absolute;left:84px;right:84px;top:420px">
<div style="font-size:72px;font-weight:800;line-height:1.05">Which trade uses this?</div>
<div style="margin-top:44px;background:#fff;border:4px solid {I};border-radius:28px;height:560px;display:flex;align-items:center;justify-content:center;box-shadow:12px 12px 0 {O}"><svg viewBox="0 0 400 300" width="720">{TOOLS[k]}</svg></div></div>''')))
    w1=y1/q*760
    pages.append((f'{n:02d}b-{k}-answer',page(bottom()+head(f'Round {n} · answer',C)+f'''<div style="position:absolute;left:84px;right:84px;top:420px">
<div class="mono" style="font-size:30px;color:#8A9099">It’s a…</div>
<div style="font-family:Anton;font-size:{190 if len(trade)<10 else 160}px;line-height:.9;color:{O};margin-top:14px">{trade.upper()}</div>
<div style="display:flex;align-items:center;gap:30px;margin-top:40px"><div style="background:#fff;border-radius:20px;width:220px;height:165px;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 400 300" width="190">{TOOLS[k]}</svg></div><div style="font-size:48px;font-weight:800">{tool}.</div></div>
<div class="mono" style="font-size:26px;color:#8A9099;margin-top:70px">What it pays a week</div>
<div style="margin-top:22px"><div class="mono" style="font-size:24px;color:#C9C5BC;margin-bottom:10px">1st-year apprentice</div><div style="display:flex;align-items:center;gap:20px"><div class="tape" style="width:{w1:.0f}px;background-color:{Y}"></div><div style="font-family:Anton;font-size:64px">${y1:,.0f}</div></div></div>
<div style="margin-top:30px"><div class="mono" style="font-size:24px;color:#C9C5BC;margin-bottom:10px">Qualified</div><div style="display:flex;align-items:center;gap:20px"><div class="tape" style="width:760px;background-color:{O}"></div></div><div style="font-family:Anton;font-size:64px;color:{O};margin-top:10px">${q:,.0f}</div></div>
<div class="mono" style="font-size:20px;color:#6E747D;margin-top:40px">2026–27 award minimum · under 21 · before tax</div></div>''',bg=I,fg=C)))
pages.append(('06-end',page(bottom()+head('Final score')+f'''<div style="position:absolute;left:84px;right:84px;top:440px">
<div style="font-size:84px;font-weight:800;line-height:1.05">How many did you get?</div>
<div style="margin-top:50px;display:flex;flex-direction:column;gap:22px;font-size:46px;font-weight:600">
<div><span style="font-family:Anton;font-size:64px;color:{O}">5/5</span>&nbsp; Site-ready.</div>
<div><span style="font-family:Anton;font-size:64px;color:{O}">3–4</span>&nbsp; Solid apprentice.</div>
<div><span style="font-family:Anton;font-size:64px;color:{O}">0–2</span>&nbsp; Smoko’s on you.</div></div>
<div style="font-size:52px;font-weight:800;line-height:1.15;margin-top:70px">What would your trade pay?</div>
<div style="font-size:42px;font-weight:600;color:{S};margin-top:14px">22 trades, free calculator ↓</div></div>''')))
import os; os.makedirs('html',exist_ok=True)
for name,h in pages: open(f'html/{name}.html','w').write(h)
print(len(pages))

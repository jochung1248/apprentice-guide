def hat(fill, ridge, brim, stroke='none', sw=0, w=200):
    s=f'stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"'
    return f'''<svg viewBox="0 0 200 130" width="{w}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<path d="M30 98 C30 52 58 30 100 30 C142 30 170 52 170 98 Z" fill="{fill}" {s}/>
<path d="M84 98 L84 40 C90 32 110 32 116 40 L116 98 Z" fill="{ridge}" {s}/>
<path d="M58 98 C58 70 64 52 74 42" fill="none" stroke="{ridge}" stroke-width="6" stroke-linecap="round"/>
<path d="M142 98 C142 70 136 52 126 42" fill="none" stroke="{ridge}" stroke-width="6" stroke-linecap="round"/>
<rect x="10" y="94" width="180" height="20" rx="10" fill="{brim}" {s}/>
</svg>'''
def line_hat(color, w=200):
    return f'''<svg viewBox="0 0 200 130" width="{w}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none" stroke="{color}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round">
<path d="M32 96 C32 52 60 32 100 32 C140 32 168 52 168 96"/>
<path d="M86 96 L86 42 C92 36 108 36 114 42 L114 96"/>
<rect x="12" y="96" width="176" height="18" rx="9"/>
</svg>'''

// simple house icon
function house(w,fill,stroke,op=1,win='#111317'){
 const h=w*0.9;
 return `<svg viewBox="0 0 100 90" width="${w}" height="${h}" style="opacity:${op};display:block"><path d="M50 4 L96 42 H86 V86 H14 V42 H4 Z" fill="${fill}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/><rect x="42" y="58" width="16" height="28" fill="${win}"/><rect x="22" y="50" width="14" height="12" fill="${win}"/><rect x="64" y="50" width="14" height="12" fill="${win}"/></svg>`;
}
const GHOST='#2A2D33', GSTROKE='#4A4F57';
function grid(lit,litT0,rowT0,rowGap){ let h='';
 for(let r=0;r<5;r++) for(let c=0;c<6;c++){ const i=r*6+c; const o=rowT0===null?1:k(rowT0+r*rowGap,0.4);
  const on=i<lit && LT>=litT0+i*0.18; const pop=on?k(litT0+i*0.18,0.3):0;
  h+=`<div class="abs" style="left:${150+c*135}px;top:${560+r*125}px;opacity:${o};transform:scale(${1+0.12*pop*(1-k(litT0+i*0.18+0.3,0.3))})">${house(110,on?OR:GHOST,on?'#0E0F12':GSTROKE,1,on?'#7A2E0C':'#1A1C20')}</div>`; }
 return h; }
const PIVOT=()=>{ const o=k(0.1,0.5);
  return `<div class="abs" style="inset:0;background:radial-gradient(circle at 50% 50%,rgba(255,107,26,${0.35*o}),rgba(17,19,23,0) 45%)"></div>
   <div class="hero" style="top:800px;font-size:64px;font-weight:600;color:${CON};opacity:${k(0,0.3)}">So, what</div>
   <div class="hero anton" style="top:880px;font-size:190px;color:#FFB27A;text-shadow:0 0 40px rgba(255,107,26,.8);opacity:${o};transform:scale(${0.94+0.06*o})">HAPPENED?</div>`; };
const SC0=[
 {d:5.4, r(){ const n=Math.round(1200000*inout((LT-1.2)/2.6));
  return `<div class="spot"></div><div class="floor"></div>${grid(0,99,0.2,0.4)}
   <div class="hero anton" style="top:1250px;font-size:170px;color:${OR};opacity:${k(1.2,0.4)}">${n.toLocaleString('en-AU')}</div>
   <div class="hero mono" style="top:1430px;font-size:26px;color:#8A9099;opacity:${k(1.6)}">new homes promised · by mid-2029</div>`; }},
 {d:2.0, r:PIVOT},
 {d:4.2, r(){ let h=''; const empty=[1,3,4,6,8];
  for(let i=0;i<10;i++){ const x=110+i*88, e=empty.includes(i), sw=e?Math.sin(LT*5+i)*10*(1-k(2.4,1.0)):0;
   h+=`<div class="abs" style="left:${x}px;top:720px;transform-origin:22px 0;transform:rotate(${sw}deg)"><svg width="60" height="140" viewBox="0 0 60 140"><path d="M22 0 V40 Q22 58 38 58" fill="none" stroke="#8A9099" stroke-width="5" stroke-linecap="round"/>${e?'':`<path d="M2 116 C2 82 14 66 30 66 C46 66 58 82 58 116 Z" fill="${OR}" stroke="#0E0F12" stroke-width="4"/><rect x="-4" y="112" width="68" height="10" rx="5" fill="#E2DDD2"/>`}</svg></div>`; }
  return `<div class="spot"></div><div class="floor"></div><div class="abs" style="left:90px;right:90px;top:712px;height:12px;background:#3A3F47;border-radius:6px"></div>${h}
   <div class="hero anton" style="top:1050px;font-size:170px;color:${OR};${fu(1.4)}">20,000</div>
   <div class="hero mono" style="top:1230px;font-size:26px;color:#8A9099;${fu(1.7)}">construction jobs unfilled</div>`; }},
 {d:6.3, r(){ const D=[['2022',105795],['2023',85965],['2024',79975],['2025',76585]], MAX=110000, H=500, BW=150, X0=150, G=60, BASE=1170; let h='';
  D.forEach(([y,v],i)=>{ const g=inout((LT-0.6-i*0.9)/0.9), bh=H*v/MAX*g, x=X0+i*(BW+G);
   h+=`<div class="abs" style="left:${x}px;top:${BASE-bh}px;width:${BW}px;height:${bh}px;background:${i===3?OR:'#3A3F47'};border-radius:10px 10px 0 0"></div>
     <div class="abs anton" style="left:${x-20}px;width:${BW+40}px;text-align:center;top:${BASE-bh-66}px;font-size:46px;color:${i===3?OR:'#C9C4B8'};opacity:${k(1.2+i*0.9,0.3)}">${Math.round(v/1000)}K</div>
     <div class="abs mono" style="left:${x}px;width:${BW}px;text-align:center;top:${BASE+20}px;font-size:26px;color:#8A9099">${y}</div>`; });
  return `<div class="spot"></div><div class="floor"></div>
   <div class="hero mono" style="top:470px;font-size:24px;color:#8A9099;opacity:${k(0.2)}">Trade apprentice starts · per year</div>
   <div class="abs" style="left:130px;right:130px;top:${BASE}px;height:5px;background:#5B616A"></div>${h}
   <div class="hero anton" style="top:1290px;font-size:100px;color:${OR};${fu(4.4)}">DOWN 3 YEARS IN A ROW</div>`; }},
 {d:7.5, r(){ const H=440, BASE=1130, MAX=56000, g=inout((LT-3.0)/2.0);
  const col=(x,label,v,c)=>{ const bh=H*v/MAX*g;
   return `<div class="abs" style="left:${x}px;top:${BASE-bh}px;width:240px;height:${bh}px;background:${c};border-radius:12px 12px 0 0"></div>
    <div class="abs anton" style="left:${x-40}px;width:320px;text-align:center;top:${BASE-bh-80}px;font-size:64px;color:${c};opacity:${k(4.6,0.4)}">${v.toLocaleString('en-AU')}</div>
    <div class="abs mono" style="left:${x-40}px;width:320px;text-align:center;top:${BASE+22}px;font-size:28px;color:#C9C4B8;opacity:${k(3.0,0.4)}">${label}</div>`; };
  return `<div class="spot"></div><div class="floor"></div>
   <div class="hero" style="top:440px;opacity:${k(0.1)}"><span class="anton" style="font-size:110px;color:${OR}">6 IN 10</span><div class="mono" style="font-size:22px;color:#8A9099;margin-top:6px">trade apprentices finish · 58.7%</div></div>
   <div class="abs" style="left:150px;right:150px;top:${BASE}px;height:5px;background:#5B616A;opacity:${k(3.0)}"></div>
   ${col(230,'Qualified',53390,'#FFE14D')}${col(610,'Quit',52380,RED)}
   <div class="hero mono" style="top:1220px;font-size:22px;color:#8A9099;opacity:${k(5.0)}">trade apprentices · 2025</div>`; }},
 {d:7.5, r(){ return `<div class="spot"></div><div class="floor"></div>${grid(8,1.6,null,0)}
   <div class="abs" style="left:150px;right:150px;top:1240px;display:flex;justify-content:space-between">
    <div style="${fu(2.4)}"><div class="anton" style="font-size:120px;color:${OR}">26%</div><div class="mono" style="font-size:22px;color:#8A9099;margin-top:6px">of homes built</div></div>
    <div style="text-align:right;${fu(4.4)}"><div class="anton" style="font-size:120px;color:#C9C4B8">35%</div><div class="mono" style="font-size:22px;color:#8A9099;margin-top:6px">of the time gone</div></div></div>
   <div class="hero mono" style="top:1440px;font-size:20px;color:#5B616A;opacity:${k(5.0)}">308,000 of 1.2M · 7 of 20 quarters</div>`; }},
 {d:6.3, r(){ const p=Math.round(51*inout((LT-2.6)/2.4)); const sw=Math.sin(LT*2.2)*3;
  return `<div class="spot"></div><div class="floor"></div>
   <div class="abs" style="left:300px;top:560px;opacity:${k(0,0.4)}">${house(420,'#E2DDD2','#0E0F12',1,'#3A3F47')}</div>
   <div class="abs" style="left:660px;top:760px;transform-origin:0 0;transform:rotate(${12+sw}deg);opacity:${k(0.6,0.4)}">
    <svg width="340" height="260" viewBox="0 0 340 260"><path d="M0 0 L80 120" stroke="#C9C4B8" stroke-width="4"/><path d="M70 110 L300 110 L320 185 L300 260 L70 260 Z" fill="${OR}" stroke="#0E0F12" stroke-width="5"/><circle cx="96" cy="185" r="12" fill="#111317"/></svg>
    <div class="anton" style="position:absolute;left:122px;top:148px;font-size:84px;color:#111317">+${p}%</div></div>
   <div class="hero mono" style="top:1230px;font-size:26px;color:#8A9099;${fu(2.8)}">house building costs vs pre-COVID</div>`; }},
 {d:7.1, r(){ const g=inout((LT-2.2)/2.6)*0.33, red=k(4.8,0.6);
  const col=`rgb(${Math.round(255+(229-255)*red)},${Math.round(225+(55-225)*red)},${Math.round(77+(43-77)*red)})`;
  return `<div class="spot"></div><div class="floor"></div>
   <div class="abs" style="left:160px;top:640px;width:760px;${fu(0,0.5,16)}"><div class="mono" style="font-size:24px;color:#8A9099;margin-bottom:16px">Household income</div>
    <div style="height:150px;border:5px solid #E2DDD2;border-radius:14px;overflow:hidden;display:flex;background:#24272D"><div style="width:${g*100}%;background:${col};display:flex;align-items:center;justify-content:center" class="anton"><span style="font-size:60px;color:#111317;opacity:${k(3.2,0.4)}">RENT</span></div><div style="flex:1"></div></div></div>
   <div class="hero anton" style="top:1000px;font-size:200px;color:${red>0.5?RED:'#FFE14D'};opacity:${k(2.6,0.4)}">${Math.round(g*100)}%</div>
   <div class="hero mono" style="top:1210px;font-size:26px;color:#8A9099;${fu(4.4)}">of income · new lease · all-time high</div>`; }},
 {d:5.0, r(){ const months=['JUN 2029','SEP 2029','DEC 2029','MAR 2030','JUN 2030','SEP 2030','DEC 2030'];
  const f=clamp((LT-0.9)/2.4)*(months.length-1); const i=Math.floor(f), fr=f-i; const cur=months[Math.min(i,6)], nxt=months[Math.min(i+1,6)];
  const page=(txt,rot,op,circ)=>`<div class="abs" style="left:290px;top:600px;width:500px;height:440px;background:${CON};border-radius:18px;color:#111317;transform-origin:50% 0;transform:rotateX(${rot}deg);opacity:${op};display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 30px 60px rgba(0,0,0,.5)"><div style="position:absolute;top:0;left:0;right:0;height:70px;background:${OR};border-radius:18px 18px 0 0"></div><div class="anton" style="font-size:130px;margin-top:40px">${txt.split(' ')[0]}</div><div class="mono" style="font-size:40px;margin-top:6px">${txt.split(' ')[1]}</div>${circ?`<svg class="abs" style="left:60px;top:110px" width="380" height="280"><ellipse cx="190" cy="140" rx="180" ry="125" fill="none" stroke="${RED}" stroke-width="8"/></svg>`:''}</div>`;
  const last=f>=6; let row=''; for(let c=0;c<6;c++) row+=`<div class="abs" style="left:${150+c*135}px;top:1300px;opacity:${c<2?0.5:0.18}">${house(110,c<2?OR:GHOST,c<2?'#0E0F12':GSTROKE,1,'#1A1C20')}</div>`;
  return `<div class="spot"></div><div class="floor"></div>${row}<div style="perspective:1400px">${page(nxt,0,1,false)}${last?'':page(cur,-fr*110,1-fr*0.6,cur==='JUN 2029')}</div>
   <div class="hero mono" style="top:520px;font-size:24px;color:#8A9099;opacity:${k(0.2)}">Target: June 2029</div>
   <div class="hero anton" style="top:1110px;font-size:120px;color:${OR};opacity:${k(3.4,0.4)}">18 MONTHS LATE</div>`; }},
];
const CLOSE={d:4.0, r(){
  const L=[['FEWER TRADIES.','#C9C4B8',0.2],['FEWER HOMES.','#C9C4B8',1.2],['HIGHER RENT.',RED,2.2]];
  return `<div class="spot"></div><div class="floor"></div>`+L.map(([t,c,t0],i)=>`<div class="hero anton" style="top:${700+i*190}px;font-size:150px;color:${c};${fu(t0,0.4,20)}">${t}</div>`).join(''); }};
const SC=[SC0[0],Object.assign({},SC0[5],{d:8.5}),SC0[8],SC0[1],SC0[2],SC0[3],SC0[4],SC0[6],SC0[7],CLOSE];
const CAPS=[[0,5.0,'Australia promised 1.2 million new homes by mid-2029.'],
 [5.0,7.3,'At this rate, we won’t get there.'],[7.3,13.5,'About a quarter are built, and 35% of the time is gone.'],
 [13.5,16.4,'On current pace, the target lands in late 2030.'],[16.4,18.5,'18 months late.'],
 [20.5,22.1,'There aren’t enough tradies.'],[22.1,24.7,'20,000 construction jobs sit empty.'],
 [24.7,26.5,'And fewer people are starting.'],[26.5,31.0,'Trade apprentice starts have fallen three years in a row.'],
 [31.0,34.5,'Of those who start, only about 6 in 10 finish.'],[34.5,38.5,'Last year, almost as many quit as qualified.'],
 [38.5,40.6,'Fewer hands, higher prices.'],[40.6,44.8,'Building a house costs 51% more than before COVID.'],
 [44.8,46.6,'And renters pay for it.'],[46.6,51.9,'A new lease now takes a record 33% of household income.'],
 [51.9,57.1,'Fewer tradies. Fewer homes. Higher rent.']];

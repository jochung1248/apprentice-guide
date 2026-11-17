W=[654.49*52,766.40*52,934.27*52,1102.13*52]
TOT=sum(W)
REELS={
'reel-1-chippy-four-years':{'series':'APPRENTICE PAY · 2026–27','scenes':[
 {'type':'hook','t0':0,'t1':3.6,'kicker':'Carpentry · award minimum','big':'4 YEARS','size':260,'sub':'What a chippy apprentice earns before they qualify.','cap':'Starts at 17. Paid from day one.'},
 {'type':'tapes','t0':3.6,'t1':11.5,'label':'Yearly pay, before tax','title':'Every year pays more.','stagger':1.3,'bars':[{'name':'Year 1','v':W[0]},{'name':'Year 2','v':W[1]},{'name':'Year 3','v':W[2]},{'name':'Year 4','v':W[3],'c':'#FF6B1A'}],'cap':'Year 4 pays <span class="hl">68% more</span> than year 1.'},
 {'type':'stamp','t0':11.5,'t1':15.5,'kicker':'Key Apprenticeship Program','big':'+$10,000','sub':'from the government, for finishing a housing trade.','cap':'Five payments of $2,000.'},
 {'type':'payslip','t0':15.5,'t1':22.5,'head':'Four years, added up','head2':'before tax','rows':[{'l':'Wages','v':'$179,779'},{'l':'Government payments','v':'$10,000','c':'#C2410C'},{'l':'Student debt','v':'$0'},{'l':'Total earned','v':'$189,779','total':True}],'cap':'No HECS. Paid the whole way.'},
 {'type':'tapes','t0':22.5,'t1':28.5,'label':'Same four years, two paths','title':'Earned vs owed.','stagger':1.2,'bars':[{'name':'Apprentice chippy · earned','v':TOT+10000,'c':'#FF6B1A','plus':True},{'name':'3-year commerce degree · HECS','v':-52197,'c':'#2F5BEA','tc':'#2F5BEA'}],'cap':'Uni fees: $17,399 a year.'},
 {'type':'end','t0':28.5,'t1':34,'kicker':'Qualified carpenter · from year 5','big':'$1,214','sub':'a week, award minimum.'},
]},
'reel-2-tafe-or-uni':{'series':'TAFE OR UNI? · 4 ROUNDS','scenes':[
 {'type':'hook','t0':0,'t1':3.4,'kicker':'Four rounds · real numbers','big':'TAFE<br>OR UNI?','size':230,'sub':'We scored both paths.','cap':'Keep score.'},
 {'type':'round','t0':3.4,'t1':9.4,'n':1,'label':'Cost to study','title':'What you pay each year.','trade':{'name':'NSW apprentice','v':0,'t':'$0'},'uni':{'name':'Business uni','v':17399,'t':'$17,399'},'winner':'TRADE','prev':[0,0],'score':[1,0],'cap':'NSW apprenticeship training is fee-free.'},
 {'type':'round','t0':9.4,'t1':15.4,'n':2,'label':'Paid while learning','title':'What you earn while you train.','trade':{'name':'Apprentice chippy, 4 yrs','v':TOT,'t':'$179,779'},'uni':{'name':'Uni study','v':0,'t':'$0'},'winner':'TRADE','prev':[1,0],'score':[2,0],'cap':'Uni students pay to learn.'},
 {'type':'round','t0':15.4,'t1':21.4,'n':3,'label':'Job after finishing','title':'Employed after you finish.','trade':{'name':'Trade apprentices','v':94.8,'t':'94.8%'},'uni':{'name':'New uni grads','v':89.2,'t':'89.2%'},'winner':'TRADE','prev':[2,0],'score':[3,0],'cap':'Close, but trade takes it.'},
 {'type':'round','t0':21.4,'t1':27.4,'n':4,'label':'Hourly pay','title':'Median pay per hour.','trade':{'name':'Technicians & trades','v':39.00,'t':'$39.00'},'uni':{'name':'Professionals','v':59.50,'t':'$59.50'},'winner':'UNI','prev':[3,0],'score':[3,1],'cap':'Uni wins this one. By $20.50 an hour.'},
 {'type':'end','t0':27.4,'t1':33,'kicker':'Final score','big':'3 – 1','sub':'Trade on points. Your call.','cta':'Run your own numbers · link in bio'},
]},
'reel-3-ten-thousand':{'series':'THE $10,000 PAYMENT','scenes':[
 {'type':'hook','t0':0,'t1':3.4,'kicker':'Key Apprenticeship Program','big':'$10,000','size':250,'sub':'for finishing your apprenticeship.','cap':'If you’re in a housing trade.'},
 {'type':'timeline','t0':3.4,'t1':11.5,'label':'When it lands','title':'Five payments. Four years.','step':1.2,'points':[{'x':0.12,'v':2000,'l':'6 MO'},{'x':0.25,'v':2000,'l':'12 MO'},{'x':0.5,'v':2000,'l':'24 MO'},{'x':0.75,'v':2000,'l':'36 MO'},{'x':1.0,'v':2000,'l':'FINISH'}],'cap':'$4,000 lands in year one.'},
 {'type':'stamp','t0':11.5,'t1':16,'kicker':'Drop out in year two','big':'−$6,000','c':'#2F5BEA','sub':'That’s what you leave on the table.','cap':'Three payments you never see.'},
 {'type':'end','t0':16,'t1':21.5,'kicker':'Housing & new energy apprentices','big':'$10,000','sub':'Check if your trade qualifies.','cta':'Free calculator · link in bio'},
]},
}

REELS['reel-4-tradies-wanted']={'series':'TRADIES WANTED · 2026','scenes':[
 {'type':'hook','t0':0,'t1':3.8,'kicker':'Australia · 2026','big':'TRADIES<br>WANTED','size':220,'sub':'Where the shortage is worst, and what it pays.','cap':'Every housing market is short.'},
 {'type':'stamp','t0':3.8,'t1':8.3,'kicker':'More tradies and builders needed','big':'116,700','sub':'to hit Australia’s 1.2 million homes target.','cap':'On top of normal hiring.'},
 {'type':'tapes','t0':8.3,'t1':15.5,'label':'Trades shortage score · Sept quarter 2026','title':'Where tradies are hardest to find.','stagger':0.8,'width':560,'compact':True,'bars':[
   {'name':'Regional Queensland','v':0.86,'t':'0.86','c':'#FF6B1A'},{'name':'Regional SA','v':0.83,'t':'0.83'},{'name':'Brisbane','v':0.76,'t':'0.76'},{'name':'Perth','v':0.76,'t':'0.76'},{'name':'Sydney','v':0.47,'t':'0.47'},{'name':'Melbourne','v':0.06,'t':'0.06'}],'cap':'Longer tape, harder to find a tradie.','capY':1395},
 {'type':'tapes','t0':15.5,'t1':21.5,'label':'Shortage score by trade · June quarter 2026','title':'The trades in shortest supply.','stagger':0.9,'width':620,'bars':[
   {'name':'Bricklayers','v':1.02,'t':'1.02','c':'#FF6B1A'},{'name':'Wall and floor tilers','v':0.96,'t':'0.96'},{'name':'Roof tilers','v':0.83,'t':'0.83'},{'name':'Carpenters','v':0.80,'t':'0.80'}],'cap':'Bricklayers top the list.'},
 {'type':'stamp','t0':21.5,'t1':26,'kicker':'Construction jobs unfilled','big':'21,600','sub':'across Australia in February 2026.','cap':'The work is there.'},
 {'type':'tapes','t0':26,'t1':31.5,'label':'Employed after training · trade apprentices','title':'Finish, and you’re almost guaranteed a job.','stagger':1.0,'bars':[
   {'name':'Finished their apprenticeship','v':94.8,'pct':True,'c':'#FF6B1A'},{'name':'Left early','v':80.8,'pct':True}],'cap':'Finishing is what counts.'},
 {'type':'tapes','t0':31.5,'t1':38,'label':'Qualified · weekly award minimum · 2026–27','title':'What qualified tradies earn, at minimum.','stagger':0.8,'max':1300,'bars':[
   {'name':'Plumber','v':1246.54,'c':'#FF6B1A'},{'name':'Electrician','v':1223.11},{'name':'Carpenter','v':1214.04},{'name':'Bricklayer','v':1202.08}],'cap':'That’s the floor, not the ceiling.'},
 {'type':'end','t0':38,'t1':43.5,'kicker':'Your trade · your numbers','big':'22 TRADES','size':150,'sub':'Free apprentice pay calculator.'},
]}

REELS['reel-5-hard-years-end']={'series':'AFTER YOU QUALIFY','scenes':[
 {'type':'hook','t0':0,'t1':3.8,'kicker':'Life after your apprenticeship','big':'THE HARD<br>YEARS END','size':200,'sub':'Here’s what’s on the other side.','cap':'First-year chippy: $654 a week.'},
 {'type':'tapes','t0':3.8,'t1':10.3,'label':'Weekly pay · 2026–27 award minimum','title':'Qualifying nearly doubles your pay.','stagger':0.9,'max':1300,'compact':True,'bars':[
   {'name':'Sparky · first year','v':622.72},{'name':'Sparky · qualified','v':1223.11,'c':'#FF6B1A'},{'name':'Chippy · first year','v':654.49},{'name':'Chippy · qualified','v':1214.04,'c':'#FF6B1A'}],'cap':'Same job. Almost double the pay.'},
 {'type':'tapes','t0':10.3,'t1':16.8,'label':'Typical full-time pay vs the legal minimum','title':'The award is the floor, not the ceiling.','stagger':0.9,'max':2100,'compact':True,'bars':[
   {'name':'Plumber · typical full-time','v':1990,'c':'#FF6B1A'},{'name':'Plumber · legal minimum','v':1246.54},{'name':'Carpenter · typical full-time','v':1760,'c':'#FF6B1A'},{'name':'Carpenter · legal minimum','v':1214.04}],'cap':'The typical plumber earns $743 above it.'},
 {'type':'stamp','t0':16.8,'t1':21.3,'kicker':'Work for themselves','big':'1 IN 5','sub':'construction workers are independent contractors.','cap':'Across all jobs, it’s 7.6%.'},
 {'type':'tapes','t0':21.3,'t1':26.8,'label':'Share working full-time hours · 2025','title':'Trade jobs are full-time jobs.','stagger':0.9,'bars':[
   {'name':'Plumbers','v':93,'t':'93%','c':'#FF6B1A'},{'name':'Carpenters','v':89,'t':'89%','c':'#FF6B1A'},{'name':'All jobs','v':69,'t':'69%'}],'cap':'And 3 in 4 stay in their trade.'},
 {'type':'stamp','t0':26.8,'t1':31.3,'kicker':'In shortage every year, 2021–2025','big':'71 OF 139','size':190,'sub':'occupations short every year since 2021 are trades.','cap':'Trade skills stay in demand.'},
 {'type':'end','t0':31.3,'t1':36.8,'kicker':'Qualified plumber · award minimum','big':'$1,247','sub':'a week. And that’s the floor.','cta':'See the climb, year by year · link in bio'},
]}

REELS['reel-6-case-study']={'series':'APPRENTICE TO BILLIONAIRE','scenes':[
 {'type':'hook','t0':0,'t1':3.4,'kicker':'Burnie, Tasmania · 1966','big':'AGE 15','size':250,'sub':'A diesel apprentice. Now an estimated billionaire.','cap':'Here’s every step.'},
 {'type':'years','t0':3.4,'t1':27.0,'kicker':'Dale Elphinstone · the journey','who':'Dale Elphinstone','items':[
   {'y':'1951','cap':'Born on a Tasmanian dairy farm','dur':1.8},
   {'y':'1966','cap':'Apprentice diesel mechanic at 15','dur':2.0},
   {'y':'1970','cap':'Qualified. Fixing machines at mine sites','dur':1.8},
   {'y':'1973','cap':'Works for a Cat dealer in Canada','dur':1.7},
   {'y':'1975','cap':'Starts his own business in his dad’s shed','dur':2.0},
   {'y':'1977','cap':'Sells his first underground truck','dur':1.5},
   {'y':'1987','cap':'Buys the dealer he did his apprenticeship with','dur':1.6},
   {'y':'1995','cap':'Joint venture with Caterpillar','dur':1.3},
   {'y':'2000','cap':'Sells it to Caterpillar','dur':1.3},
   {'y':'2016','cap':'Cat moves the factory to Thailand','dur':1.6,'setback':True},
   {'y':'2016','cap':'He buys his brand back','dur':1.5},
   {'y':'2019','cap':'Tasmania’s first billionaire, on rich-list estimates','dur':1.2},
   {'y':'2024','cap':'First non-American in the US Mining Hall of Fame','dur':1.3}],
  'end':'We did it because we didn’t know we couldn’t.'},
 {'type':'tapes','t0':27.0,'t1':33.0,'label':'Estimated wealth · BRW / AFR Rich List','title':'From the shed to $1.94 billion.','stagger':1.2,'max':2000000000,'bars':[
   {'name':'2010 · BRW Rich List','v':515000000,'t':'$515M'},
   {'name':'2025 · AFR Rich List','v':1940000000,'t':'$1.94B','c':'#FF6B1A'}],'cap':'Number 88 in Australia.'},
 {'type':'end','t0':33.0,'t1':38.5,'kicker':'First-year diesel apprentice · 2026–27','big':'$560','sub':'a week to start. Same trade he picked.','cta':'Work out your trade · link in bio'},
]}

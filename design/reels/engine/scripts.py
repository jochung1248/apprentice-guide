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

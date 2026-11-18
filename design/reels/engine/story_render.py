import subprocess,os,sys,glob
from playwright.sync_api import sync_playwright
FPS=30
import os as _o
PAGE=_o.environ.get('PAGE','story.html')
def photos():
    m={}
    for f in sorted(glob.glob('photos/p*.*')):
        n=os.path.basename(f)[1:].split('.')[0]
        if n.isdigit(): m[int(n)]=f
    return m
def run(preview=None,out=None):
    out=out or _o.environ.get('OUT','reel-6-story')
    with sync_playwright() as p:
        b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg=b.new_page(viewport={'width':1080,'height':1920}); pg.goto('http://localhost:8810/'+PAGE); pg.wait_for_timeout(600)
        pg.evaluate('p=>setPhotos(p)', photos())
        if preview:
            for t in preview:
                pg.evaluate(f'render({t})'); pg.wait_for_timeout(80); pg.screenshot(path=f'{out}-p{t}.jpg',type='jpeg',quality=80)
            b.close(); return
        sc=pg.evaluate('scenes()'); parts=[]
        for i,(a,z) in enumerate(sc):
            n=round((z-a)*FPS); tmp=f'{out}-s{i}.tmp.mp4'; o=f'{out}-s{i}.mp4'
            ff=subprocess.Popen(['ffmpeg','-v','error','-y','-f','image2pipe','-framerate',str(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-crf','18','-preset','veryfast','-pix_fmt','yuv420p','-r',str(FPS),tmp],stdin=subprocess.PIPE)
            for k in range(n):
                pg.evaluate(f'render({a+k/FPS})'); ff.stdin.write(pg.screenshot(type='jpeg',quality=92))
            ff.stdin.close()
            if ff.wait()==0: os.replace(tmp,o); parts.append(o)
        open(f'{out}.txt','w').write(''.join(f"file '{x}'\n" for x in parts))
        subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',f'{out}.txt','-c','copy','-movflags','+faststart',f'{out}.mp4'],check=True)
        b.close(); print('done',out)
if __name__=='__main__':
    if len(sys.argv)>1 and sys.argv[1]=='preview': run([float(x) for x in sys.argv[2:]])
    else: run()

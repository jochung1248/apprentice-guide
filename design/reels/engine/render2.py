import subprocess,os,sys,json
from playwright.sync_api import sync_playwright
sys.path.insert(0,'.'); from scripts import REELS
FPS=30
def run(names, preview=None):
    with sync_playwright() as p:
        b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg=b.new_page(viewport={'width':1080,'height':1920}); pg.goto('http://localhost:8810/engine.html'); pg.wait_for_timeout(600)
        for name in names:
            S=REELS[name]; pg.evaluate('s=>setScript(s)', S)
            if preview is not None:
                for t in preview[name]:
                    pg.evaluate(f'render({t})'); pg.screenshot(path=f'prev-{name}-{t}.jpg',type='jpeg',quality=80)
                continue
            parts=[]
            for i,sc in enumerate(S['scenes']):
                a,z=sc['t0'],sc['t1']; n=round((z-a)*FPS); tmp=f'{name}-s{i}.tmp.mp4'; out=f'{name}-s{i}.mp4'
                ff=subprocess.Popen(['ffmpeg','-v','error','-y','-f','image2pipe','-framerate',str(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-crf','18','-preset','veryfast','-pix_fmt','yuv420p','-r',str(FPS),tmp],stdin=subprocess.PIPE)
                for k in range(n):
                    pg.evaluate(f'render({a+k/FPS})'); ff.stdin.write(pg.screenshot(type='jpeg',quality=92))
                ff.stdin.close()
                if ff.wait()==0: os.replace(tmp,out); parts.append(out)
            open(f'{name}.txt','w').write(''.join(f"file '{x}'\n" for x in parts))
            subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',f'{name}.txt','-c','copy',f'{name}.mp4'],check=True)
            print('done',name,flush=True)
        b.close()
if __name__=='__main__':
    if sys.argv[1]=='preview':
        run(list(REELS), {'reel-1-chippy-four-years':[2.5,10.5,14,21.5,27.5,32.5],'reel-2-tafe-or-uni':[2.5,8.8,26.8,31.5],'reel-3-ten-thousand':[10.8,15]})
    else: run(sys.argv[1:])

import subprocess,os
from playwright.sync_api import sync_playwright
cuts=[0,4,8.5,12,15.5,19,23,29,35,40.5]; FPS=30
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    pg=b.new_page(viewport={'width':1080,'height':1920}); pg.goto('http://localhost:8810/reel.html'); pg.wait_for_timeout(600)
    for i in range(len(cuts)-1):
        a,z=cuts[i],cuts[i+1]; n=round((z-a)*FPS); tmp=f'scene{i:02d}.tmp.mp4'
        ff=subprocess.Popen(['ffmpeg','-v','error','-y','-f','image2pipe','-framerate',str(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-crf','18','-preset','veryfast','-pix_fmt','yuv420p','-r',str(FPS),tmp],stdin=subprocess.PIPE)
        for k in range(n):
            pg.evaluate(f'render({a+k/FPS})')
            ff.stdin.write(pg.screenshot(type='jpeg',quality=92))
        ff.stdin.close()
        if ff.wait()==0: os.replace(tmp,f'scene{i:02d}.mp4')
        print('scene',i,'done',flush=True)
    b.close()

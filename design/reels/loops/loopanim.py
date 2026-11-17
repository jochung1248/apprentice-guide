import subprocess,sys
from playwright.sync_api import sync_playwright
name,dur=sys.argv[1],float(sys.argv[2]); FPS=30
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome'); pg=b.new_page(viewport={'width':1080,'height':1920})
    pg.goto(f'http://localhost:8810/{name}.html'); pg.wait_for_timeout(800)
    tmp=f'reel-{name}.tmp.mp4'
    ff=subprocess.Popen(['ffmpeg','-v','error','-y','-f','image2pipe','-framerate',str(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-crf','18','-preset','veryfast','-pix_fmt','yuv420p','-r',str(FPS),'-movflags','+faststart',tmp],stdin=subprocess.PIPE)
    for i in range(round(dur*FPS)):
        pg.evaluate(f'render({i/FPS})'); ff.stdin.write(pg.locator('#stage').screenshot(type='jpeg',quality=92))
    ff.stdin.close(); assert ff.wait()==0
    b.close()
import os; os.replace(tmp,f'reel-{name}.mp4'); print('ok')

"""Run one finite, owned native-app visual check and wait for it to exit."""
import os
import pathlib
import subprocess
import sys
import time
root=pathlib.Path(__file__).resolve().parent.parent
mode=sys.argv[1]; evidence=root/'harness/evidence'; fixture=evidence/'application-fixture'
appid='org.thememe.'+mode.title()+'Check'
if mode=='foot':
    command=['/bin/bash',str(evidence/'terminal-fixture.sh')]
elif mode=='neovim':
    command=['nvim','-n','+lua vim.defer_fn(function() vim.cmd("qa!") end, 6000)',str(fixture/'theme-check.lua')]
elif mode=='yazi':
    command=['timeout','6s','yazi',str(fixture)]
elif mode=='btop':
    config=evidence/'btop-check.conf'
    config.write_text('color_theme = "current"\nshown_boxes = "cpu mem net"\ntheme_background = true\nupdate_ms = 500\n')
    command=['timeout','6s','btop','--config',str(config),'--themes-dir',str(pathlib.Path.home()/'.config/btop/themes')]
elif mode=='files':
    appid='org.gnome.Nautilus'
    command=['dbus-run-session','--','timeout','7s','nautilus','--new-window',str(fixture)]
else: raise SystemExit('Expected foot, neovim, yazi, btop or files')
if mode!='files': command=['foot','-o','colors-dark.alpha=1','--app-id',appid,'--title','Mega-City One '+mode+' check',*command]
env=os.environ.copy()
if mode=='files': env.update(GIO_USE_VFS='local',GTK_USE_PORTAL='0',GTK_A11Y='none',NO_AT_BRIDGE='1')
before={c['address'] for c in __import__('json').loads(subprocess.check_output(['hyprctl','clients','-j']))}
process=subprocess.Popen(command,env=env,start_new_session=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    time.sleep(2.5 if mode=='files' else 1.5)
    target=str(process.pid)
    if mode=='files':
        created=[c for c in __import__('json').loads(subprocess.check_output(['hyprctl','clients','-j'])) if c['address'] not in before and c.get('class')==appid and c.get('title')==fixture.name]
        if len(created)!=1: raise RuntimeError('Expected one new isolated fixture window')
        target='address:'+created[0]['address']
    subprocess.run([sys.executable,str(root/'scripts/capture-owned-window.py'),appid,str(evidence/('native-'+mode+'.png')),target],check=True)
    process.wait(timeout=8)
    print(mode+' native check window captured and exited',flush=True)
finally:
    if process.poll() is None:
        process.terminate()
        try: process.wait(timeout=2)
        except subprocess.TimeoutExpired: process.kill();process.wait()

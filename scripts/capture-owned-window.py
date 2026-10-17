"""Capture only a named disposable QA application's window."""
import os
import json
import pathlib
import subprocess
import sys
import time
appid, output = sys.argv[1:3]
selector_argument = sys.argv[3] if len(sys.argv)>3 else None
process_group = int(selector_argument) if selector_argument and not selector_argument.startswith('address:') else None
def clients(): return json.loads(subprocess.check_output(['hyprctl','clients','-j']))
owned = [c for c in clients() if c.get('class') == appid or c.get('initialClass') == appid]
if selector_argument and selector_argument.startswith('address:'):
    owned = [c for c in owned if 'address:'+c['address'] == selector_argument]
if process_group is not None:
    owned = [c for c in owned if os.getpgid(c['pid']) == process_group]
if len(owned) != 1: raise SystemExit('Expected exactly one owned check window')
window = owned[0]; selector = 'address:' + window['address']
def dispatch(code):
    result = subprocess.check_output(['hyprctl','dispatch',code],text=True)
    if result.strip() != 'ok': raise RuntimeError(result)
if window.get('fullscreen',0):
    fullscreen_mode='maximized' if window['fullscreen']==1 else 'fullscreen'
    dispatch('hl.dsp.window.fullscreen({ window = '+json.dumps(selector)+', mode = '+json.dumps(fullscreen_mode)+' })')
    window=next(c for c in clients() if c['address']==window['address'])
if not window['floating']: dispatch('hl.dsp.window.float({ window = '+json.dumps(selector)+', action = "toggle" })')
dispatch('hl.dsp.window.resize({ window = '+json.dumps(selector)+', x = 900, y = 600 })')
dispatch('hl.dsp.window.center({ window = '+json.dumps(selector)+' })')
dispatch('hl.dsp.window.alter_zorder({ window = '+json.dumps(selector)+', mode = "top" })')
dispatch('hl.dsp.focus({ window = '+json.dumps(selector)+' })')
time.sleep(.6)
dispatch('hl.dsp.window.alter_zorder({ window = '+json.dumps(selector)+', mode = "top" })')
dispatch('hl.dsp.focus({ window = '+json.dumps(selector)+' })')
time.sleep(.1)
active=json.loads(subprocess.check_output(['hyprctl','activewindow','-j']))
if active.get('address')!=window['address']: raise SystemExit('Owned check window lost focus to '+str(active.get('class'))+'; no screenshot')
window=next(c for c in clients() if c['address']==window['address'])
x,y=window['at'];w,h=window['size']
pathlib.Path(output).parent.mkdir(parents=True,exist_ok=True)
subprocess.run(['grim','-g',f'{x},{y} {w}x{h}',output],check=True)
print('Captured owned check window: '+appid)

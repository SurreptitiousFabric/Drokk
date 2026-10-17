import json
import pathlib
import subprocess
import sys
import time
root=pathlib.Path(__file__).resolve().parent.parent
fixture=root/'harness/evidence/application-fixture'
def clients(): return json.loads(subprocess.check_output(['hyprctl','clients','-j']))
previous={c['address'] for c in clients()}
subprocess.run(['nautilus','--new-window',str(fixture)],check=True,timeout=5)
time.sleep(2)
created=[c for c in clients() if c['address'] not in previous and c.get('class')=='org.gnome.Nautilus' and c.get('title')==fixture.name]
if len(created)!=1: raise SystemExit('Expected one new fixture Files window; leaving existing windows untouched')
selector='address:'+created[0]['address']
try:
    subprocess.run([sys.executable,str(root/'scripts/capture-owned-window.py'),'org.gnome.Nautilus',str(root/'harness/evidence/native-files.png'),selector],check=True)
finally:
    subprocess.run(['hyprctl','dispatch','hl.dsp.window.close({ window = '+json.dumps(selector)+' })'],check=True,stdout=subprocess.DEVNULL)
print('Captured and closed only the new sample-folder window')

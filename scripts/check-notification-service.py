"""Finite notification integration check on a private D-Bus, never the user's server."""
import json
import os
import pathlib
import subprocess
import sys
import tempfile
import time
sys.path.append('/usr/lib/python3.14/site-packages')
from gi.repository import Gio, GLib
root=pathlib.Path(__file__).resolve().parent.parent
if os.environ.get('MEGACITY_PRIVATE_NOTIFICATION_TEST')!='1':
    raise SystemExit('Run through the documented private-bus mise task')
with tempfile.TemporaryDirectory(prefix='mega-city-notification-service-') as temporary:
    base=pathlib.Path(temporary); home=base/'home';home.mkdir(); config=base/'shell';config.mkdir()
    for module in ['Commons','Ui']:(config/module).symlink_to('/usr/share/omarchy/shell/'+module)
    import shutil
    shutil.copytree(root/'dist/mega-city-one/plugins/megacity.notifications',config/'Notification')
    current=home/'.local/state/omarchy/current';current.mkdir(parents=True)
    (current/'theme').symlink_to(root/'dist/mega-city-one/theme')
    (config/'shell.qml').write_text('import Quickshell\nimport "Notification"\nShellRoot { Service { omarchyPath: "/usr/share/omarchy" } }\n')
    env=os.environ.copy();env['HOME']=str(home);env['FONTCONFIG_FILE']=str(root/'dist/mega-city-one/theme/fonts.conf')
    service=subprocess.Popen(['qs','-p',str(config)],env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    def ipc(method,*args):
        return subprocess.check_output(['qs','ipc','-n','-p',str(config),'call','--','notifications',method,*args],env=env,text=True,timeout=3).strip()
    def drain(seconds):
        loop=GLib.MainLoop();GLib.timeout_add(int(seconds*1000),lambda:(loop.quit(),False)[1]);loop.run()
    connection=Gio.bus_get_sync(Gio.BusType.SESSION,None);events=[]
    connection.signal_subscribe(None,'org.freedesktop.Notifications',None,'/org/freedesktop/Notifications',None,Gio.DBusSignalFlags.NONE,lambda _c,_s,_p,_i,name,params,_u:events.append((name,params.unpack())),None)
    def notify(summary,category='',actions=(),urgency=1):
        hints={'category':GLib.Variant('s',category),'urgency':GLib.Variant('y',urgency)}
        return connection.call_sync('org.freedesktop.Notifications','/org/freedesktop/Notifications','org.freedesktop.Notifications','Notify',GLib.Variant('(susssasa{sv}i)',('Theme QA',0,'',summary,'Controlled test content',list(actions),hints,1000)),GLib.VariantType.new('(u)'),Gio.DBusCallFlags.NONE,3000,None).unpack()[0]
    try:
        time.sleep(1.5)
        assert ipc('ping')=='ok'
        identifier=notify('QA explicit action','transfer.complete',['default','Open folder']);drain(.25)
        assert ipc('invokeLast')=='ok';drain(.3)
        assert any(name=='ActionInvoked' and values[0]==identifier and values[1]=='default' for name,values in events)
        print('PASS native default action invokes sender callback',flush=True)
        identifier=notify('QA dismiss');drain(.2);assert ipc('dismiss','QA dismiss')=='ok';drain(.2)
        assert any(name=='NotificationClosed' and values[0]==identifier for name,values in events)
        print('PASS native dismissal closes the owned notification',flush=True)
        assert ipc('setDnd','on')=='on'
        notify('QA silenced category','network.connected');drain(.35)
        history=home/'.local/state/omarchy/notifications/history'
        rows=[json.loads(p.read_text()) for p in history.glob('*.json')]
        assert any(r.get('summary')=='QA silenced category' and r.get('category')=='network.connected' for r in rows)
        assert ipc('setDnd','off')=='off'
        assert ipc('showHistory')=='ok';drain(.25)
        assert ipc('dismiss','QA silenced category')=='ok'
        ipc('dismissAll');drain(.2)
        print('PASS private DND, category persistence and history replay',flush=True)
        identifier=notify('QA expiry','device.battery.low',urgency=0);drain(5.4)
        assert any(name=='NotificationClosed' and values[0]==identifier for name,values in events)
        print('PASS native low-urgency timeout expires',flush=True)
    finally:
        service.terminate()
        try:service.wait(timeout=3)
        except subprocess.TimeoutExpired:service.kill();service.wait()

"""Finite native widget previews. Run with Mise Python 3.14.7 for distro GUI ABI."""
import json
import os
import pathlib
import subprocess
import sys
sys.path.append('/usr/lib/python3.14/site-packages')
root = pathlib.Path(__file__).resolve().parent.parent
out = root / 'harness/evidence'
out.mkdir(exist_ok=True)
mode = sys.argv[1]

def capture_window(title, filename):
    clients = json.loads(subprocess.check_output(['hyprctl', 'clients', '-j']))
    owned = [c for c in clients if c.get('title') == title]
    if len(owned) != 1:
        raise RuntimeError('Expected one owned preview window')
    c = owned[0]
    x, y = c['at']; w, h = c['size']
    subprocess.run(['grim', '-g', f'{x},{y} {w}x{h}', str(out / filename)], check=True)

if mode == 'qt':
    from PyQt6 import QtWidgets as W, QtGui, QtCore
    app = W.QApplication([])
    palette = app.palette()
    measured = {r: palette.color(getattr(QtGui.QPalette.ColorRole, r)).name() for r in ['Window', 'WindowText', 'Highlight', 'HighlightedText']}
    for actual, expected in [(measured['Window'], '#0e1822'), (measured['Highlight'], '#d1b472')]:
        assert all(abs(int(actual[i:i+2],16)-int(expected[i:i+2],16)) <= 1 for i in [1,3,5])
    window = W.QWidget(); window.setWindowTitle('Mega-City One Qt widgets check'); window.resize(760,480)
    layout = W.QVBoxLayout(window)
    layout.addWidget(W.QLabel('Mega-City One · Native Qt Widgets'))
    tabs = W.QTabWidget(); layout.addWidget(tabs)
    page = W.QWidget(); tabs.addTab(page, 'Controls'); tabs.addTab(W.QWidget(), 'Files')
    body = W.QVBoxLayout(page)
    edit = W.QLineEdit('Focused entry — cream text'); body.addWidget(edit)
    rows = W.QListWidget(); rows.addItems(['Home', 'Documents — selected', 'Downloads']); rows.setCurrentRow(1); body.addWidget(rows)
    check = W.QCheckBox('Enabled option'); check.setChecked(True); body.addWidget(check)
    disabled = W.QPushButton('Disabled'); disabled.setEnabled(False); body.addWidget(disabled)
    button = W.QPushButton('Default action'); button.setDefault(True); body.addWidget(button)
    progress = W.QProgressBar(); progress.setValue(64); body.addWidget(progress)
    def capture():
        window.grab().save(str(out / 'native-qt-widgets.png'))
        print(json.dumps({'qtPalette': measured, 'font': app.font().family(), 'style': app.style().objectName()}))
        app.quit()
    window.show(); edit.setFocus(); QtCore.QTimer.singleShot(1400, capture); QtCore.QTimer.singleShot(5000, app.quit)
    app.exec()
elif mode in ['gtk3','gtk4']:
    import gi
    version = '3.0' if mode=='gtk3' else '4.0'
    gi.require_version('Gtk', version)
    from gi.repository import Gtk, GLib
    if mode=='gtk3':
        window=Gtk.OffscreenWindow(); window.set_title('Mega-City One GTK3 widgets check')
    else:
        window=Gtk.Window(title='Mega-City One GTK4 widgets check')
    title=window.get_title(); window.set_default_size(760,480)
    box=Gtk.Box(orientation=Gtk.Orientation.VERTICAL,spacing=12)
    for side in ['top','bottom','start','end']: getattr(box,'set_margin_'+side)(18)
    def add(widget):
        if mode=='gtk3': box.pack_start(widget,False,False,0)
        else: box.append(widget)
    add(Gtk.Label(label='Mega-City One · Native '+mode.upper()+' controls'))
    entry=Gtk.Entry(); entry.set_text('Focused entry — cream text'); add(entry)
    rows=Gtk.ListBox()
    for name in ['Home','Documents — selected','Downloads']: rows.append(Gtk.Label(label=name,xalign=0)) if mode=='gtk4' else rows.add(Gtk.Label(label=name,xalign=0))
    rows.select_row(rows.get_row_at_index(1)); add(rows)
    check=Gtk.CheckButton(label='Enabled option'); check.set_active(True); add(check)
    disabled=Gtk.Button(label='Disabled'); disabled.set_sensitive(False); add(disabled)
    add(Gtk.Button(label='Default action'))
    progress=Gtk.ProgressBar(); progress.set_fraction(.64); add(progress)
    if mode=='gtk3': window.add(box); window.show_all()
    else: window.set_child(box); window.present()
    loop=GLib.MainLoop()
    def capture():
        try:
            if mode=='gtk3':
                window.get_pixbuf().savev(str(out/'native-gtk3-widgets.png'),'png',[],[])
            else:
                import ctypes as C
                gtk=C.CDLL('libgtk-4.so.1'); gobject=C.CDLL('libgobject-2.0.so.0')
                gtk.gtk_widget_paintable_new.argtypes=[C.c_void_p]; gtk.gtk_widget_paintable_new.restype=C.c_void_p
                gtk.gtk_snapshot_new.restype=C.c_void_p
                gtk.gdk_paintable_snapshot.argtypes=[C.c_void_p,C.c_void_p,C.c_double,C.c_double]
                gtk.gtk_snapshot_to_node.argtypes=[C.c_void_p]; gtk.gtk_snapshot_to_node.restype=C.c_void_p
                gtk.gsk_renderer_render_texture.argtypes=[C.c_void_p,C.c_void_p,C.c_void_p];gtk.gsk_renderer_render_texture.restype=C.c_void_p
                gtk.gdk_texture_save_to_png.argtypes=[C.c_void_p,C.c_char_p];gtk.gdk_texture_save_to_png.restype=C.c_int
                paintable=gtk.gtk_widget_paintable_new(hash(window)); snapshot=gtk.gtk_snapshot_new()
                gtk.gdk_paintable_snapshot(paintable,snapshot,window.get_width(),window.get_height())
                node=gtk.gtk_snapshot_to_node(snapshot)
                if not node: raise RuntimeError('GTK snapshot is empty')
                texture=gtk.gsk_renderer_render_texture(hash(window.get_renderer()),node,None)
                if not texture or not gtk.gdk_texture_save_to_png(texture,str(out/'native-gtk4-widgets.png').encode()): raise RuntimeError('GTK texture capture failed')
            print(mode+' native capture saved')
        finally: window.destroy(); loop.quit()
        return False
    GLib.timeout_add(1400,capture); GLib.timeout_add(5000,lambda:(loop.quit(),False)[1]); loop.run()
else: raise SystemExit('Expected qt, gtk3 or gtk4')

"""Check GTK CSS through its native provider, without creating a display/window."""
import ctypes as C
import json
import pathlib
import sys

class GError(C.Structure):
    _fields_ = [("domain", C.c_uint), ("code", C.c_int), ("message", C.c_char_p)]

if len(sys.argv) != 3 or sys.argv[1] not in {"3", "4"}:
    raise SystemExit("usage: check-gtk-css.py <3|4> <stylesheet>")
version, filename = sys.argv[1:]
css = pathlib.Path(filename).read_bytes()
gtk = C.CDLL("libgtk-4.so.1" if version == "4" else "libgtk-3.so.0")
gobject = C.CDLL("libgobject-2.0.so.0")
# Icon-source CSS needs an initialized display even though no window is created.
if version == "4":
    gtk.gtk_init_check.restype = C.c_int
    gtk.gtk_init_check()
else:
    gtk.gtk_init_check.argtypes = [C.c_void_p, C.c_void_p]
    gtk.gtk_init_check.restype = C.c_int
    gtk.gtk_init_check(None, None)
gtk.gtk_css_provider_new.restype = C.c_void_p
provider = gtk.gtk_css_provider_new()
errors = []
Callback = C.CFUNCTYPE(None, C.c_void_p, C.c_void_p, C.POINTER(GError), C.c_void_p)

@Callback
def parsing_error(_provider, _section, error, _data):
    errors.append(error.contents.message.decode("utf-8", "replace"))

gobject.g_signal_connect_data.argtypes = [C.c_void_p, C.c_char_p, Callback, C.c_void_p, C.c_void_p, C.c_int]
gobject.g_signal_connect_data.restype = C.c_ulong
gobject.g_signal_connect_data(provider, b"parsing-error", parsing_error, None, None, 0)
try:
    if version == "4":
        gtk.gtk_css_provider_load_from_string.argtypes = [C.c_void_p, C.c_char_p]
        gtk.gtk_css_provider_load_from_string.restype = None
        gtk.gtk_css_provider_load_from_string(provider, css)
    else:
        gtk.gtk_css_provider_load_from_data.argtypes = [C.c_void_p, C.c_char_p, C.c_ssize_t, C.c_void_p]
        gtk.gtk_css_provider_load_from_data.restype = C.c_int
        gtk.gtk_css_provider_load_from_data(provider, css, len(css), None)
finally:
    gobject.g_object_unref.argtypes = [C.c_void_p]
    gobject.g_object_unref(provider)
print(json.dumps({"gtk": version, "errors": errors, "windowCreated": False}))
raise SystemExit(1 if errors else 0)

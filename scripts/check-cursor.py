import ctypes as C
import json
import pathlib
class Image(C.Structure):
    _fields_=[(name,C.c_uint32) for name in ['version','size','width','height','xhot','yhot','delay']]+[('pixels',C.POINTER(C.c_uint32))]
class Images(C.Structure):
    _fields_=[('nimage',C.c_int),('images',C.POINTER(C.POINTER(Image))),('name',C.c_char_p)]
lib=C.CDLL('libXcursor.so.1')
lib.XcursorFilenameLoadImages.argtypes=[C.c_char_p,C.c_int];lib.XcursorFilenameLoadImages.restype=C.POINTER(Images)
lib.XcursorImagesDestroy.argtypes=[C.POINTER(Images)]
base=pathlib.Path(__file__).resolve().parent.parent/'dist/mega-city-one/theme/cursors/Mega-City-One'
states=json.loads((base/'states.json').read_text())
count=0
for name,metadata in states.items():
    for size in metadata['sizes']:
        images=lib.XcursorFilenameLoadImages(str(base/'cursors'/name).encode(),size)
        assert images and images.contents.nimage==metadata['frames'],name
        try:
            for i in range(images.contents.nimage):
                frame=images.contents.images[i].contents
                assert frame.width==size and frame.height==size
                assert frame.xhot<size and frame.yhot<size
                if metadata['frames']>1: assert frame.delay==80
        finally:lib.XcursorImagesDestroy(images)
        count+=1
print(f'Native Xcursor checked {count} state/size combinations, frame counts and hotspots')

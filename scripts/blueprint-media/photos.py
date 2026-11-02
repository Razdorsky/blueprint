# Builds Blueprint web photos: public/bp/img/<name>-<w>.webp plus a manifest.
import subprocess, sys, json, os, pathlib, concurrent.futures as cf
E = '/Users/nikitarazdorsky/Desktop/VESSYL everything'
ROOTS = {'AP': f'{E}/3 Photos/Approved Photos', 'RAW': f'{E}/3 Photos/Raw Photos/Deren_CR_RAW', 'LR': f'{E}/4 Videos/Approved Videos/STILL_EDITS/LR_MAINS'}
WIDTHS = [640, 1080, 1600, 2400]
out = pathlib.Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
rows = [l.rstrip('\n').split('\t') for l in open(sys.argv[1]) if l.strip()]
def run(row):
    name, root, rel = row
    src = f'{ROOTS[root]}/{rel}'
    w, h = map(int, subprocess.check_output(['magick', 'identify', '-format', '%w %h', src + '[0]']).split())
    o = subprocess.check_output(['magick', 'identify', '-format', '%[EXIF:Orientation]', src + '[0]']).decode().strip()
    if o in ('5', '6', '7', '8'): w, h = h, w
    widths = [x for x in WIDTHS if x < w] + ([min(w, 2400)] if w < 2400 else [])
    widths = sorted(set(widths))
    # one decode, several sizes
    args = ['magick', src, '-auto-orient', '-colorspace', 'sRGB', '-strip']
    for i, x in enumerate(widths):
        args += ['(', '+clone', '-resize', f'{x}x', '-quality', '80', '-define', 'webp:method=6', '-write', str(out / f'{name}-{x}.webp'), '+delete', ')']
    if not all((out / f'{name}-{x}.webp').exists() for x in widths):
        subprocess.check_call(args + ['null:'])
    color = subprocess.check_output(['magick', str(out / f'{name}-{widths[0]}.webp'), '-resize', '1x1!', '-format', '%[fx:int(255*r)],%[fx:int(255*g)],%[fx:int(255*b)]', 'info:']).decode().strip()
    rgb = [int(c) for c in color.split(',')]
    return name, {'w': w, 'h': h, 'widths': widths, 'color': '#%02x%02x%02x' % tuple(rgb), 'source': f'{root}/{rel}'}
res = {}
with cf.ThreadPoolExecutor(6) as ex:
    for name, meta in ex.map(run, rows):
        res[name] = meta; print(name, meta['w'], meta['h'], meta['widths'], meta['color'], flush=True)
json.dump(dict(sorted(res.items())), open(sys.argv[3], 'w'), indent=1)

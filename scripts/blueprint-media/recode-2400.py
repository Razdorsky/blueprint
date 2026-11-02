# Re-encode the 2400 px variants from the source masters at a lighter quality.
import json, subprocess, concurrent.futures as cf, os
E = '/Users/nikitarazdorsky/Desktop/VESSYL everything'
ROOTS = {'AP': f'{E}/3 Photos/Approved Photos', 'RAW': f'{E}/3 Photos/Raw Photos/Deren_CR_RAW', 'LR': f'{E}/4 Videos/Approved Videos/STILL_EDITS/LR_MAINS'}
photos = json.load(open('src/lib/blueprint/data/photos.json'))
def run(item):
    name, meta = item
    if 2400 not in meta['widths']: return name, None
    root, rel = meta['source'].split('/', 1)
    out = f'public/bp/img/{name}-2400.webp'
    before = os.path.getsize(out)
    subprocess.check_call(['magick', f'{ROOTS[root]}/{rel}', '-auto-orient', '-colorspace', 'sRGB', '-strip', '-resize', '2400x', '-quality', '70', '-define', 'webp:method=6', out])
    return name, (before, os.path.getsize(out))
with cf.ThreadPoolExecutor(6) as ex:
    total = [0, 0]
    for name, r in ex.map(run, photos.items()):
        if r: total[0] += r[0]; total[1] += r[1]
print('2400 variants', round(total[0]/1e6,1), 'MB ->', round(total[1]/1e6,1), 'MB')

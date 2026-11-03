#!/bin/zsh
# Silent previews for the films (2026-11-03 audit). A film plays quietly while it is on screen;
# that quiet play now uses a 12-second crossfaded preview, and the full film with sound loads only
# when someone taps it. This keeps a scroll past the film from downloading the whole film.
set -e
AV="/Users/nikitarazdorsky/Desktop/VESSYL everything/4 Videos/Approved Videos"
OUT="$1"; mkdir -p "$OUT"
HERO="$AV/VESSYL HERO/VESSYL.mp4"; EVT="$AV/Events Experience Reel_Vessyl.mp4"
X264=(-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -color_primaries bt709 -color_trc bt709 -colorspace bt709 -an)
calc() { python3 -I -c "print(round($1, 3))"; }
# src start dur name fade width crf
preview() {
  local W=$6 H=$(( $6 * 9 / 16 ))
  local SC="scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H},setsar=1"
  local s2=$(calc "$2 + $5") main=$(calc "$3 - $5") off=$(calc "$3 - 2 * $5")
  ffmpeg -loglevel error -y -ss $s2 -t $main -i "$1" -ss $2 -t $5 -i "$1" \
    -filter_complex "[0:v]$SC,fps=30,settb=AVTB[m];[1:v]$SC,fps=30,settb=AVTB[h];[m][h]xfade=transition=fade:duration=$5:offset=${off}[v]" \
    -map "[v]" $X264 -crf $7 -g 60 "$OUT/$4.mp4"
}
preview "$HERO" 0 12 film-vessyl-preview 1 1920 31
preview "$HERO" 0 12 film-vessyl-preview-m 1 960 31
preview "$EVT" 5.6 12 film-events-preview 1 1920 30
preview "$EVT" 5.6 12 film-events-preview-m 1 960 31
for f in "$OUT"/film-*-preview*.mp4; do print "$(basename $f) $(du -h $f | cut -f1)"; done

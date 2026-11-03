#!/bin/zsh
# Home page loops after the owner's review of 2026-11-03: the 4K pool recut as a crossfade loop,
# the Sky Tree House from the drone, and the main house made from the drone still (below). Each
# loop also gets a 1280 px copy for phones and a WebP poster.
set -e
AV="/Users/nikitarazdorsky/Desktop/VESSYL everything/4 Videos/Approved Videos"
OUT="$1"; mkdir -p "$OUT"
HERO="$AV/VESSYL HERO/VESSYL.mp4"; OVER="$AV/Hero_Vessyl_Property & Program Overview Reel_260618.mp4"
X264=(-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -color_primaries bt709 -color_trc bt709 -colorspace bt709 -an)
calc() { python3 -I -c "print(round($1, 3))"; }
# Crossfade loop: the last F seconds dissolve into the first F seconds, so the cut never shows.
# src start dur name fade width crf [slow]
xloop() {
  local W=$6 H=$(( $6 * 9 / 16 )) slow=${8:-1}
  local SC="scale=$W:$H:force_original_aspect_ratio=increase:flags=lanczos,crop=$W:$H,setsar=1"
  local MO=""; [ "$slow" != 1 ] && MO="setpts=$slow*PTS,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1,"
  local out=$(calc "$3 * $slow") ; local s2=$(calc "$2 + $5 / $slow") main=$(calc "$3 - $5 / $slow") off=$(calc "$3 * $slow - 2 * $5")
  ffmpeg -loglevel error -y -ss $s2 -t $main -i "$1" -ss $2 -t $(calc "$5 / $slow") -i "$1" \
    -filter_complex "[0:v]${MO}$SC,fps=30,settb=AVTB[m];[1:v]${MO}$SC,fps=30,settb=AVTB[h];[m][h]xfade=transition=fade:duration=$5:offset=${off}[v]" \
    -map "[v]" $X264 -crf $7 -g 60 "$OUT/$4.mp4"
}
poster() { # name time
  ffmpeg -loglevel error -y -ss $2 -i "$OUT/$1.mp4" -frames:v 1 -q:v 2 "$OUT/$1.tmp.jpg"
  magick "$OUT/$1.tmp.jpg" -resize 1920x -quality 78 -define webp:method=6 "$OUT/$1.webp" && rm "$OUT/$1.tmp.jpg"
}
# Usage: videos-home.sh <outdir> [house]. Without "house" it cuts the pool and treehouse loops.
if [ "${2:-}" != house ]; then
  xloop "$HERO" 54.5 6.0 loop-pool 1.0 2560 27; poster loop-pool 0.2
  xloop "$HERO" 54.5 6.0 loop-pool-m 1.0 1280 27
  xloop "$OVER" 80.6 2.1 loop-treehouse 0.8 1920 25 2; poster loop-treehouse 0.3
  xloop "$OVER" 80.6 2.1 loop-treehouse-m 0.8 1280 26 2
  for f in "$OUT"/loop-{pool,treehouse}*.mp4; do print "$(basename $f) $(du -h $f | cut -f1) $(ffprobe -v error -show_entries format=duration -of csv=p=0 $f)s"; done
fi

# 2026-11-03, after the home page audit: the drone clip of the main house was overcast and showed a
# metal shed, so the house loop is made from the sunny 45 MP drone still instead. The camera breathes:
# a slow eased push toward the house and pool, then back (6 s each way). The still is oversampled
# so the move stays smooth.
still() { # src width crf name
  local W=$2 H=$(( $2 * 9 / 16 ))
  ffmpeg -loglevel error -y -loop 1 -framerate 30 -t 6 -i "$1" -filter_complex \
    "[0:v]crop=5280:2970:0:640,scale=$(( W * 2 )):$(( H * 2 )):flags=lanczos,zoompan=z='1+0.07*(1-cos(PI*on/180))/2':x='(iw-iw/zoom)*0.6':y='(ih-ih/zoom)*0.55':d=1:s=$(( W * 2 ))x$(( H * 2 )):fps=30,scale=${W}:${H}:flags=lanczos,setsar=1,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]" \
    -map "[v]" $X264 -crf $3 -g 60 "$OUT/$4.mp4"
}
AERIAL="/Users/nikitarazdorsky/Desktop/VESSYL everything/3 Photos/Approved Photos/General/2_Drone_General Wides and Main_Stills_1.JPG"
if [ "${2:-}" = house ]; then
  still "$AERIAL" 1920 30 loop-house && poster loop-house 0.1
  still "$AERIAL" 1280 31 loop-house-m
  for f in "$OUT"/loop-house*.mp4; do print "$(basename $f) $(du -h $f | cut -f1)"; done
fi

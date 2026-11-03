#!/bin/zsh
# Opening loops for the pages that opened on a still (owner's review of 2026-11-03, point 9).
# Where the brand's footage shows the place, the loop is cut from it. Where it does not, the loop is
# made from the brand photograph itself: the camera breathes, an eased push toward the subject and
# back, from a 45 MP still oversampled so the move stays smooth. Nothing about a place is invented.
#   zsh loops-pages.sh <outdir>
set -e
E="/Users/nikitarazdorsky/Desktop/VESSYL everything"
AP="$E/3 Photos/Approved Photos"; RAW="$E/3 Photos/Raw Photos/Deren_CR_RAW"; AV="$E/4 Videos/Approved Videos"
HERO="$AV/VESSYL HERO/VESSYL.mp4"; OVER="$AV/Hero_Vessyl_Property & Program Overview Reel_260618.mp4"
OUT="$1"; mkdir -p "$OUT"
X264=(-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -color_primaries bt709 -color_trc bt709 -colorspace bt709 -an)
calc() { python3 -I -c "print(round($1, 3))"; }
poster() { # name time
  ffmpeg -loglevel error -y -ss $2 -i "$OUT/$1.mp4" -frames:v 1 -q:v 2 "$OUT/$1.tmp.jpg"
  magick "$OUT/$1.tmp.jpg" -resize 1600x -quality 70 -define webp:method=6 "$OUT/$1.webp" && rm "$OUT/$1.tmp.jpg"
}
# A photograph that breathes: src width crf name focusX focusY
breathe() {
  local W=$2 H=$(( $2 * 9 / 16 ))
  ffmpeg -loglevel error -y -loop 1 -framerate 30 -t 5 -i "$1" -filter_complex \
    "[0:v]crop=iw:iw*9/16:0:(ih-iw*9/16)*$6,scale=$(( W * 2 )):$(( H * 2 )):flags=lanczos,zoompan=z='1+0.06*(1-cos(PI*on/150))/2':x='(iw-iw/zoom)*$5':y='(ih-ih/zoom)*$6':d=1:s=$(( W * 2 ))x$(( H * 2 )):fps=30,scale=${W}:${H}:flags=lanczos,setsar=1,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]" \
    -map "[v]" $X264 -crf $3 -g 60 "$OUT/$4.mp4"
}
# Footage, slowed if short, crossfaded so the loop never shows its cut: src start dur name fade width crf slow
xloop() {
  local W=$6 H=$(( $6 * 9 / 16 )) slow=${8:-1}
  local SC="scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H},setsar=1"
  local MO=""; [ "$slow" != 1 ] && MO="setpts=$slow*PTS,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1,"
  local s2=$(calc "$2 + $5 / $slow") main=$(calc "$3 - $5 / $slow") off=$(calc "$3 * $slow - 2 * $5")
  ffmpeg -loglevel error -y -ss $s2 -t $main -i "$1" -ss $2 -t $(calc "$5 / $slow") -i "$1" \
    -filter_complex "[0:v]${MO}$SC,fps=30,settb=AVTB[m];[1:v]${MO}$SC,fps=30,settb=AVTB[h];[m][h]xfade=transition=fade:duration=$5:offset=${off}[v]" \
    -map "[v]" $X264 -crf $7 -g 60 "$OUT/$4.mp4"
}
still() { # name source focusX focusY
  breathe "$2" 1920 31 loop-$1 $3 $4 && poster loop-$1 0.1
  breathe "$2" 1280 31 loop-$1-m $3 $4
}
still villas "$AP/Rooms/Pulse/Pulse Villa/Vessyl_Pulse Villa_7.jpg" 0.5 0.55
still rates "$AP/Poolside/Vessyl_Poolside-23.jpg" 0.45 0.5
still sessions "$AP/Performance Dome/Vessyl_Performance_Dome-9.jpg" 0.6 0.5
still day "$AP/Poolside/Vessyl_Poolside-17.jpg" 0.5 0.5
still evening "$RAW/Z92_8400.jpg" 0.5 0.55
still listening "$AP/Vessyl_Inserts_Details-2.jpg" 0.5 0.5
still pasture "$AP/Horses/Vessyl_horses_general-3_edit.jpg" 0.5 0.6
# The glamping tents from the drone (VESSYL.mp4 0:24.1–0:26.9, 4K), and the Dome from inside with
# a forest projection and musicians (Overview 1:42.75–1:43.95, after a guest walks out of the frame).
xloop "$HERO" 24.2 2.6 loop-tents 0.8 2560 28 1.6 && poster loop-tents 0.3
xloop "$HERO" 24.2 2.6 loop-tents-m 0.8 1280 29 1.6
xloop "$OVER" 102.75 1.2 loop-inside 0.8 1920 27 2.5 && poster loop-inside 0.3
xloop "$OVER" 102.75 1.2 loop-inside-m 0.8 1280 28 2.5
for f in "$OUT"/loop-*.mp4; do print "$(basename $f) $(du -h $f | cut -f1) $(ffprobe -v error -show_entries format=duration -of csv=p=0 $f)s"; done

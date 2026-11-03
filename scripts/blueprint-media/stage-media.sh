#!/bin/zsh
# Media for the home page stage (2026-11-03): each place is a picture with a matte of its subject,
# so the place's word can stand between the subject and what is behind it.
#   zsh stage-media.sh <workdir> <outdir>
# Needs scripts/blueprint-media/matte.swift compiled to <workdir>/matte (swiftc -O -o matte matte.swift).
#
# The matte travels with its picture in one opaque file, so the two can never drift apart: films side
# by side (picture left, matte right); stills along their short side, so the file stays within the
# 4096-pixel texture limit of older phones (wide crops one above the other, upright crops side by
# side). Not in an alpha channel: Safari decodes alpha premultiplied, which blackens everything the
# matte leaves out.
# Each place also gets a flat picture and a cut-out for browsers without WebGL and for reduced motion.
set -e
W="$1"; OUT="$2"; mkdir -p "$W" "$OUT"
E="/Users/nikitarazdorsky/Desktop/VESSYL everything"
AV="$E/4 Videos/Approved Videos"; HERO="$AV/VESSYL HERO/VESSYL.mp4"
X264=(-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -color_primaries bt709 -color_trc bt709 -colorspace bt709 -an)
calc() { python3 -I -c "print(round($1, 3))"; }

# A crossfaded loop of the pool at first light, then a person matte for every frame.
# name crop(w:h:x:y of the 4K frame) width height crf [layers: no for the film alone]
pool() {
  local name=$1 crop=$2 w=$3 h=$4 crf=$5 layers=${6:-yes} F=1.0 start=54.5 dur=6.0
  local s2=$(calc "$start + $F") main=$(calc "$dur - $F") off=$(calc "$dur - 2 * $F")
  local SC="crop=${crop},scale=${w}:${h}:flags=lanczos,setsar=1"
  rm -rf "$W/$name"; mkdir -p "$W/$name/c" "$W/$name/m"
  ffmpeg -loglevel error -y -ss $s2 -t $main -i "$HERO" -ss $start -t $F -i "$HERO" \
    -filter_complex "[0:v]$SC,fps=30,format=rgb24,settb=AVTB[a];[1:v]$SC,fps=30,format=rgb24,settb=AVTB[b];[a][b]xfade=transition=fade:duration=$F:offset=$off,format=rgb24[v]" \
    -map "[v]" -start_number 0 "$W/$name/c/%04d.png"
  # The person matte has the finest hair but loses the head when the arms go up; the subject matte
  # keeps the whole figure with a coarser edge. The stronger of the two, every frame.
  mkdir -p "$W/$name/s"
  "$W/matte" frames "$W/$name/c" "$W/$name/m" person
  "$W/matte" frames "$W/$name/c" "$W/$name/s" subject
  # A solid interior and a soft edge: the hair highlight must not read as see-through.
  for f in "$W/$name/m"/*.png; do magick "$f" "$W/$name/s/$(basename $f)" -compose lighten -composite -level 4%,42% "$f"; done
  pool_encode $name $crf
  [ $layers = no ] && return
  # Fallback layers from the first frame.
  magick "$W/$name/c/0000.png" -quality 82 "$OUT/stage-$name.webp"
  magick "$W/$name/c/0000.png" "$W/$name/m/0000.png" -alpha off -compose CopyOpacity -composite -quality 85 -define webp:alpha-quality=90 "$OUT/stage-$name-cut.webp"
}

# The frames and their mattes side by side as one film. The matte is averaged over neighbouring
# frames, so its edge does not shimmer. The frames are RGB: they are converted to video with the
# BT.709 matrix the file is tagged with (the converter's default is BT.601, which shifts the colour).
pool_encode() {
  local name=$1 crf=$2
  ffmpeg -loglevel error -y -framerate 30 -i "$W/$name/c/%04d.png" -framerate 30 -i "$W/$name/m/%04d.png" \
    -filter_complex "[1:v]format=gray,tmix=frames=3:weights='1 2 1',format=rgb24[m];[0:v][m]hstack=inputs=2,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p[v]" -map "[v]" $X264 -crf $crf -g 60 "$OUT/stage-$name.mp4"
}

# A still place from a 45 MP master: the stacked file for the stage, the flat picture and the
# cut-out for the plain layers. name source crop(w:h:x:y) width height mode erode [defringe]
# erode: pixels the matte is drawn in by, so the sky caught along a hard edge goes with the sky (the
# stage dims everything behind the subject, and a caught edge would shine as an outline).
# defringe: the lens's colour fringe along that edge is taken out of the picture.
crop_still() {
  local name=$1 src=$2 crop=$3 w=$4 h=$5 mode=$6 erode=$7 defringe=$8
  local base="$W/$(basename "$src" | sed 's/\.[^.]*$//')"
  [ -f "$base-$mode.png" ] || "$W/matte" $mode "$src" "$base-$mode.png"
  local geo=$(echo $crop | awk -F: '{print $1"x"$2"+"$3"+"$4}')
  magick "$src" -auto-orient -crop $geo +repage -resize ${w}x${h}! "$W/$name-c.png"
  magick "$base-$mode.png" -crop $geo +repage -resize ${w}x${h}! -level 4%,42% -morphology Erode Disk:$erode "$W/$name-m.png"
  if [ -n "$defringe" ]; then
    magick "$W/$name-m.png" -morphology Edge Disk:2 -blur 0x1 "$W/$name-band.png"
    magick "$W/$name-c.png" \( +clone -modulate 100,20 \) "$W/$name-band.png" -composite "$W/$name-c.png"
  fi
}
# The picture and its matte in one file, along the short side.
pack_still() {
  local name=$1 join=-append
  [ $(magick identify -format '%h' "$W/$name-c.png") -gt $(magick identify -format '%w' "$W/$name-c.png") ] && join=+append
  magick "$W/$name-c.png" "$W/$name-m.png" -colorspace sRGB $join -quality 88 "$OUT/stage-$name-pack.webp"
}
still() {
  crop_still "$@"; local name=$1
  pack_still $name
  magick "$W/$name-c.png" -quality 84 "$OUT/stage-$name.webp"
  magick "$W/$name-c.png" "$W/$name-m.png" -alpha off -compose CopyOpacity -composite -quality 86 -define webp:alpha-quality=95 "$OUT/stage-$name-cut.webp"
}

DOME="$E/3 Photos/Approved Photos/Dome/Vessy_Dome_Extensions-13.jpg"
DINNER="$E/3 Photos/Raw Photos/Deren_CR_RAW/Z92_8400.jpg"

case "${3:-all}" in
  pool|all) pool arrival 3840:2160:0:0 1920 1080 24; pool arrival-m 1215:2160:640:0 720 1280 25 ;|
  encode) pool_encode arrival 24; pool_encode arrival-m 25 ;;
  dome|all) still sound "$DOME" 5504:3096:0:300 2560 1440 subject 3 defringe; still sound-m "$DOME" 3240:5760:1132:0 1080 1920 subject 2 defringe ;|
  # Larger upright crops for tablets held upright, where the phone's crop would be enlarged by half
  # or more: the stage's file only.
  large|all) pool arrival-l 1215:2160:640:0 1080 1920 28 no
    for args in "sound-l|$DOME|3240:5760:1132:0|1440|2560|subject|3|defringe" "table-l|$DINNER|3096:5504:1880:0|1440|2560|person|1|"; do
      crop_still ${(s:|:)args}; pack_still ${args%%|*}
    done ;|
  table|all) still table "$DINNER" 8256:4644:0:0 2560 1440 person 1; still table-m "$DINNER" 3096:5504:1880:0 1080 1920 person 1 ;|
esac
ls -la "$OUT" | awk '{print $5, $9}'

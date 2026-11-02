#!/bin/zsh
# Second pass: crossfade loops, lighter dome loop and films.
set -e
AV="/Users/nikitarazdorsky/Desktop/VESSYL everything/4 Videos/Approved Videos"
OUT="$1"
HERO="$AV/VESSYL HERO/VESSYL.mp4"; PROG="$AV/Programming video-- Amenities and Experiences.mp4"; OVER="$AV/Hero_Vessyl_Property & Program Overview Reel_260618.mp4"; EVT="$AV/Events Experience Reel_Vessyl.mp4"
X264=(-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -color_primaries bt709 -color_trc bt709 -colorspace bt709)
SC="scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1"
calc() { python3 -I -c "print(round($1, 3))"; }
poster() { ffmpeg -loglevel error -y -ss $2 -i "$OUT/$1.mp4" -frames:v 1 -q:v 2 "$OUT/$3.tmp.jpg"; magick "$OUT/$3.tmp.jpg" -resize 1600x -quality 78 -define webp:method=6 "$OUT/$3.webp"; rm "$OUT/$3.tmp.jpg"; }
xloop() { # src start dur name fade
  local s2=$(calc "$2 + $5") main=$(calc "$3 - $5") off=$(calc "$3 - 2 * $5")
  ffmpeg -loglevel error -y -ss $s2 -t $main -i "$1" -ss $2 -t $5 -i "$1" -filter_complex "[0:v]$SC,fps=30,settb=AVTB[m];[1:v]$SC,fps=30,settb=AVTB[h];[m][h]xfade=transition=fade:duration=$5:offset=${off}[v]" -map "[v]" -an $X264 -crf 27 -g 60 "$OUT/$4.mp4"
}
pingpong() { local sp=${5:-1}; ffmpeg -loglevel error -y -ss $2 -t $3 -i "$1" -filter_complex "[0:v]$SC,setpts=PTS/$sp,fps=30,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]" -map "[v]" -an $X264 -crf 28 -g 60 "$OUT/$4.mp4"; }
film() { ffmpeg -loglevel error -y -ss $2 -t $3 -i "$1" -vf "$SC" -af "loudnorm=I=-16:TP=-1:LRA=11" -c:a aac -b:a 128k -ar 48000 -ac 2 $X264 -crf 25 -maxrate 3000k -bufsize 6000k -g 48 "$OUT/$4.mp4"; }
# dome done
xloop "$HERO" 10.8 3.7 loop-hearth 0.9; poster loop-hearth 1.6 loop-hearth
xloop "$OVER" 41.5 3.3 loop-river 0.8; poster loop-river 0.1 loop-river
xloop "$OVER" 70.3 2.3 loop-violin 0.6; poster loop-violin 0.4 loop-violin
film "$HERO" 0 61 film-vessyl; poster film-vessyl 55.5 film-vessyl
film "$EVT" 5.6 50.2 film-events; poster film-events 33 film-events
rm -f "$OUT/film-programming.mp4" "$OUT/film-programming.webp"
for f in "$OUT"/*.mp4; do print "$(basename $f) $(du -h $f | cut -f1)"; done

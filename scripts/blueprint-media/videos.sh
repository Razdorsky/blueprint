#!/bin/zsh
# Blueprint video encodes: muted loops and films with sound, plus WebP posters.
set -e
AV="/Users/nikitarazdorsky/Desktop/VESSYL everything/4 Videos/Approved Videos"
OUT="$1"; mkdir -p "$OUT"
HERO="$AV/VESSYL HERO/VESSYL.mp4"; WEB="$AV/VESSYL HERO/vessyl-web.mp4"
PROG="$AV/Programming video-- Amenities and Experiences.mp4"; OVER="$AV/Hero_Vessyl_Property & Program Overview Reel_260618.mp4"; EVT="$AV/Events Experience Reel_Vessyl.mp4"
X264=(-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -color_primaries bt709 -color_trc bt709 -colorspace bt709)
SC="scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1"
# ping-pong loop: forward then backward
pingpong() { # src start dur name [speed]
  local sp=${5:-1}
  ffmpeg -loglevel error -y -ss $2 -t $3 -i "$1" -filter_complex "[0:v]$SC,setpts=PTS/$sp,fps=30,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]" -map "[v]" -an $X264 -crf 25 -g 60 "$OUT/$4.mp4"
}
# crossfade loop: the last F seconds dissolve into the first F seconds
xloop() { # src start dur name fade
  local F=$5; local main=$(( $3 - $5 )); local off=$(( $3 - 2 * $5 ))
  ffmpeg -loglevel error -y -ss $(( $2 + $F )) -t $main -i "$1" -ss $2 -t $F -i "$1" -filter_complex "[0:v]$SC,fps=30,settb=AVTB[m];[1:v]$SC,fps=30,settb=AVTB[h];[m][h]xfade=transition=fade:duration=$F:offset=$off[v]" -map "[v]" -an $X264 -crf 25 -g 60 "$OUT/$4.mp4"
}
plain() { # src start dur name
  ffmpeg -loglevel error -y -ss $2 -t $3 -i "$1" -vf "$SC,fps=30" -an $X264 -crf 26 -g 60 "$OUT/$4.mp4"
}
film() { # src start dur name
  ffmpeg -loglevel error -y -ss $2 -t $3 -i "$1" -vf "$SC" -af "loudnorm=I=-16:TP=-1:LRA=11" -c:a aac -b:a 160k -ar 48000 -ac 2 $X264 -crf 23 -maxrate 4500k -bufsize 9000k -g 48 "$OUT/$4.mp4"
}
poster() { # video time name
  ffmpeg -loglevel error -y -ss $2 -i "$OUT/$1.mp4" -frames:v 1 -q:v 2 "$OUT/$3.tmp.jpg"
  magick "$OUT/$3.tmp.jpg" -resize 1600x -quality 78 -define webp:method=6 "$OUT/$3.webp" && rm "$OUT/$3.tmp.jpg"
}
[ -f "$OUT/loop-pool.mp4" ] || pingpong "$HERO" 55.0 4.6 loop-pool; poster loop-pool 0.1 loop-pool
plain "$WEB" 0 25.4 loop-night && poster loop-night 2.4 loop-night
pingpong "$PROG" 63.8 5.6 loop-dome && poster loop-dome 0.1 loop-dome
xloop "$HERO" 10.8 3.7 loop-hearth 0.9 && poster loop-hearth 1.6 loop-hearth
xloop "$OVER" 41.5 3.3 loop-river 0.8 && poster loop-river 0.1 loop-river
pingpong "$WEB" 2.0 1.9 loop-stars 0.5 && poster loop-stars 0.1 loop-stars
xloop "$OVER" 70.3 2.3 loop-violin 0.6 && poster loop-violin 0.4 loop-violin
plain "$EVT" 19.0 5.4 loop-studio && poster loop-studio 0.3 loop-studio
film "$HERO" 0 61 film-vessyl && poster film-vessyl 55.5 film-vessyl
film "$EVT" 5.6 50.2 film-events && poster film-events 33 film-events
film "$PROG" 7.1 79.4 film-programming && poster film-programming 57 film-programming
ls -la "$OUT"

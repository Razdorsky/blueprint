#!/bin/zsh
# Figma Enhanced placement map (2026-11-08): silent loops for the openings and sections where the approved footage
# shows the same subject as the designer's photograph, and the two films whose scenes play with sound on click.
# Every range starts and ends inside one shot (cuts found with ffmpeg scene detection, checked frame by frame).
# Short shots are slowed with motion interpolation, then the end dissolves into the start. Nothing is invented.
# Usage: zsh scripts/blueprint-media/loops-map.sh public/bp/video
set -e
AV="/Users/nikitarazdorsky/Desktop/VESSYL everything/4 Videos/Approved Videos"
HERO="$AV/VESSYL HERO/VESSYL.mp4"; WEB="$AV/VESSYL HERO/vessyl-web.mp4"
PROG="$AV/Programming video-- Amenities and Experiences.mp4"; OVER="$AV/Hero_Vessyl_Property & Program Overview Reel_260618.mp4"
EVT="$AV/Events Experience Reel_Vessyl.mp4"
OUT="$1"; mkdir -p "$OUT"
X264=(-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -color_primaries bt709 -color_trc bt709 -colorspace bt709)
calc() { python3 -I -c "print(round($1, 3))"; }
poster() { # name time
  ffmpeg -nostdin -loglevel error -y -ss $2 -i "$OUT/$1.mp4" -frames:v 1 -q:v 2 "$OUT/$1.tmp.jpg"
  magick "$OUT/$1.tmp.jpg" -resize 1600x -quality 74 -define webp:method=6 "$OUT/$1.webp" && rm "$OUT/$1.tmp.jpg"
}
# src start dur name fade width crf [slow]: the last `fade` seconds dissolve into the first; slow > 1 stretches a
# short shot with motion interpolation.
xloop() {
  local W=$6 H=$(( $6 * 9 / 16 )) slow=${8:-1}
  local SC="scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H},setsar=1"
  local MO=""; [ "$slow" != 1 ] && MO="setpts=$slow*PTS,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1,"
  local s2=$(calc "$2 + $5 / $slow") main=$(calc "$3 - $5 / $slow") off=$(calc "$3 * $slow - 2 * $5")
  ffmpeg -nostdin -loglevel error -y -ss $s2 -t $main -i "$1" -ss $2 -t $(calc "$5 / $slow") -i "$1" \
    -filter_complex "[0:v]${MO}$SC,fps=30,settb=AVTB[m];[1:v]${MO}$SC,fps=30,settb=AVTB[h];[m][h]xfade=transition=fade:duration=$5:offset=${off}[v]" \
    -map "[v]" -an $X264 -crf $7 -g 60 "$OUT/$4.mp4"
}
hero() { xloop "$1" $2 $3 $4 $5 1920 26 $6 && poster $4 0.2; xloop "$1" $2 $3 $4-m $5 1280 27 $6; }
part() { xloop "$1" $2 $3 $4 $5 1440 26 $6 && poster $4 0.2; }
film() { # src start dur name
  ffmpeg -nostdin -loglevel error -y -ss $2 -t $3 -i "$1" -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1" \
    -af "loudnorm=I=-16:TP=-1:LRA=11" -c:a aac -b:a 160k -ar 48000 -ac 2 $X264 -crf 24 -maxrate 3800k -bufsize 7600k -g 48 "$OUT/$4.mp4"
}

# Openings
hero "$WEB"  23.45 1.85 loop-rancho-pool 0.6 2     # P08: El Rancho and the pool, Arenal beyond (no sound in this cut)
hero "$HERO" 6.5   2.45 loop-rancho      0.6 1.6   # P20: the table under El Rancho's roof, Arenal beyond the pool
hero "$PROG" 76.95 1.8  loop-retreat     0.6 2     # P23: a group on mats facing two teachers in the Dome
hero "$OVER" 25.15 1.95 loop-arenal      0.6 1.8   # P26: Arenal Volcano above the rainforest
hero "$OVER" 114.0 5.35 loop-estate      0.9       # P22: the main house and pool from the drone (replaces loop-house)
hero "$PROG" 73.85 1.8  loop-experiences 0.6 2     # P07 arch: the Dome inside, a forest projected on the ceiling
hero "$EVT"  38.4  5.1  loop-presents    0.8       # P13 arch: a violinist in the Dome under blue light
# Sections
part "$OVER" 120.05 2.2 loop-poolview    0.6 1.6   # P01 "Where you actually are": the pool deck, Arenal in cloud
part "$PROG" 29.45 1.9  loop-saddle      0.6 1.8   # P12 "A bond.": a saddled horse by the river
part "$PROG" 61.15 0.9  loop-plunge      0.5 2.5   # P15 "A minute in it is a long minute": the cold plunge
part "$HERO" 30.65 1.6  loop-yoga        0.6 2     # P16 callout: yoga on the terrace facing the volcano
part "$OVER" 69.25 1.0  loop-tuning      0.5 2.5   # P16 "It matters who is in the room": a tuning fork by her face
part "$PROG" 24.95 1.8  loop-halter      0.6 1.8   # P17 callout: the horseman with a horse in the stable
part "$PROG" 26.85 2.5  loop-swim        0.6 1.6   # P17 "Cold, deep enough to swim in": a swim beside a horse
part "$EVT"  10.05 4.8  loop-handpan     0.8       # P18: a musician at the handpan, lit in amber
part "$PROG" 55.85 1.85 loop-benches     0.5 2     # P15 "Heat first, then cold, then sound" (step 2.7): the Hearth's round room, its benches and speakers around the stones
# Films with sound: their scenes play when a loop is clicked (film time = source time - start).
film "$PROG" 7.1 79.4 film-programming          # Amenities and Experiences, without the opening and closing logo
film "$OVER" 0 140.1 film-overview              # Property & Program Overview Reel, whole
film "$EVT" 5.6 53.8 film-events                # Events reel to its end: Josh speaks until 57.8, over the closing logo (it used to stop at 55.8, mid-sentence)
for f in "$OUT"/loop-{rancho-pool,rancho,retreat,arenal,estate,experiences,presents,poolview,saddle,plunge,yoga,tuning,halter,swim,handpan,benches}*.mp4 "$OUT"/film-{programming,overview,events}.mp4; do print "$(basename $f) $(du -h $f | cut -f1)"; done

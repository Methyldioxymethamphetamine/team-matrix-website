# Achievements photos

Extracted from `ACHIEVEMENTS (1).pdf (1).pdf` (a 9-page Canva deck) on 2026-09-20. Each
photo's caption is in `captions.json` (`{ file, caption, note? }`), matched to the text
printed next to it in the source deck (or, where a prize cheque was visible in the photo
itself, to the exact text on the cheque — the more reliable source, see the note below).

Not wired into the site yet — these are just extracted + captioned for future use
(e.g. a future "Achievements" section or gallery on `/gallery`).

## Known caveat

On the Robotex "AIR 1" sumo-robot page of the source deck, the photo/label layout isn't
consistently adjacent — a "Line Follower" prize-cheque photo sits directly under an
"AIR 1 Autonomous Sumo 3kg" text label, for example. Prize cheques don't state a weight
class either. So `robotex-air1-sumorobo-1st-2nd.jpg` and `robotex-sumorobo-2nd.jpg` are
captioned with what's verifiably shown (position + prize) but **not** confidently
assigned a 3kg vs 5kg weight class — see the `note` field on those two entries in
`captions.json` before using them anywhere that claims a specific weight class.

## Regenerating

If the source PDF changes, re-extract with:
```
pdftoppm -r 200 -png -f <page> -l <page> "<pdf path>" page   # render a page to inspect
pdfimages -png "<pdf path>" out                               # extract embedded images
```
Note: `pdfimages` mis-renders the color on at least one embedded image in this specific
PDF (an ICC-profile issue — it comes out blue/gold duotone instead of true gold). If an
extracted image looks off, crop it from the `pdftoppm` page render instead, which
composites colors correctly.

# Our Stories — Image Directory

Drop `.jpg`, `.jpeg`, or `.png` images here and they will **automatically appear** in the "Our Stories" gallery on the website. No code changes needed.

## Naming convention (optional but recommended)

Use descriptive filenames — they become the card title (underscores → spaces, extension stripped):

```
techfest_iit_bombay_2024.jpg      →  "Techfest Iit Bombay 2024"
robotex_national_2024.png         →  "Robotex National 2024"
irocu_isro_challenge.jpg          →  "Irocu Isro Challenge"
```

## Supported formats
- `.jpg` / `.jpeg`
- `.png`
- `.webp`

## Notes
- Images are served directly from this folder at `/stories/filename.jpg`
- Restart the dev server after adding images (not required in production with ISR)
- Card height is auto-estimated from the image filename index (cycles 300–450px)

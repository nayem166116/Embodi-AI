# /videos folder

Drop production video files here using these exact names. The website
references them by filename, so replacing a file with the same name updates
the live section automatically — no HTML/CSS/JS changes required.

| Filename | Used in |
|---|---|
| hero-bg.mp4 | Hero header — autoplaying background loop behind the headline |
| hero.mp4 | Product video showcase — primary / line overview clip (also its own thumbnail preview) |
| robot-demo.mp4 | Product video showcase — precision pick & place clip (also its own thumbnail preview) |
| ai-training.mp4 | Product video showcase — learning from demonstration clip (also its own thumbnail preview) |
| industrial-automation.mp4 | Product video showcase — fleet / warehouse clip (also its own thumbnail preview) |

Guidelines:
- Keep each file under ~15MB (h.264 mp4, 1280x800 or 16:10) for fast loading. Keep `hero-bg.mp4` especially light since it autoplays immediately on page load.
- Every video on the site (hero background, primary showcase player, and all 4 showcase thumbnails) is set to autoplay, muted, and loop automatically — there is no play button or click-to-play thumbnail anymore.
- Until a real file is uploaded here, each video element gracefully falls back to its `poster` image (from `/images`) — visitors never see a broken player.
- Do not rename these files or edit index.html's `data-src`/`poster` attributes; the whole point of this folder is code-free replacement.

## WebM auto-use (best option — smaller & faster than mp4, still real video quality)

Every video tag on the site already includes a `.webm` source ahead of the `.mp4` one. If you
drop a `.webm` file with the exact same filename as any mp4 into this folder, browsers that
support WebM will load and play that instead automatically — no code changes needed. If no
matching `.webm` exists, the browser silently falls back to the `.mp4`. This is the recommended
fix for "mp4 feels slow": re-export the same clip as `.webm` (e.g. with the VP9 codec), which is
typically 30-50% smaller than an equivalent-quality mp4, while still looking like a real video
(unlike the GIF option below).

| Add this WebM | Auto-preferred over |
|---|---|
| hero-bg.webm | hero-bg.mp4 (hero background) |
| hero.webm | hero.mp4 (primary + thumbnail) |
| robot-demo.webm | robot-demo.mp4 (primary + thumbnail) |
| ai-training.webm | ai-training.mp4 (primary + thumbnail) |
| industrial-automation.webm | industrial-automation.mp4 (primary + thumbnail) |

Other formats (e.g. `.mov`, `.avi`, `.mkv`) are **not** wired up and will not show — only
`.mp4`, `.webm`, and `.gif` (below) are recognized by name.

## GIF auto-replace (for when mp4/webm still feels slow)

As an even lighter, instant-loading alternative (at the cost of video quality — GIFs have no
sound and lower color fidelity), you can drop a `.gif` with the exact same filename as any mp4
in this folder, and the site automatically detects it and displays the GIF instead — no
code changes needed:

| Add this GIF | Auto-replaces |
|---|---|
| hero-bg.gif | hero-bg.mp4 (hero background) |
| hero.gif | hero.mp4 (primary + thumbnail) |
| robot-demo.gif | robot-demo.mp4 (primary + thumbnail) |
| ai-training.gif | ai-training.mp4 (primary + thumbnail) |
| industrial-automation.gif | industrial-automation.mp4 (primary + thumbnail) |

How it works: on page load, the site checks whether a same-named `.gif` exists next to each
`.mp4`. If found, it swaps that spot to show the GIF (which loads instantly and loops on its
own) and pauses the mp4 underneath. If no matching GIF is present, the mp4 plays as normal —
so this is fully optional and safe to leave empty.

Tip: keep GIFs short (3-6s) and under ~2000px wide to keep file size small; large GIFs can end
up bigger than an equivalent mp4.

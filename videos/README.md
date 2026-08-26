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

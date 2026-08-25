# /videos folder

Drop production video files here using these exact names. The website
references them by filename, so replacing a file with the same name updates
the live section automatically — no HTML/CSS/JS changes required.

| Filename | Used in |
|---|---|
| hero.mp4 | Product video showcase — primary / line overview clip |
| robot-demo.mp4 | Product video showcase — precision pick & place clip |
| ai-training.mp4 | Product video showcase — learning from demonstration clip |
| industrial-automation.mp4 | Product video showcase — fleet / warehouse clip |

Guidelines:
- Keep each file under ~15MB (h.264 mp4, 1280x800 or 16:10) for fast loading.
- Videos are lazy-loaded (`preload="none"`) and only fetched when a viewer presses play or selects a clip from the list.
- Until a real file is uploaded here, the section gracefully falls back to the poster image in `/images` — visitors never see a broken player.
- Do not rename these files or edit index.html's `data-src` attributes; the whole point of this folder is code-free replacement.

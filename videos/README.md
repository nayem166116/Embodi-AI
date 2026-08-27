# Videos (drop-in real footage)

No video files ship with this template — only real footage should be used. Drop MP4 files into this
folder with these exact filenames and they'll be picked up automatically:

- `hero-bg.mp4` — looping background video behind the hero headline
- `robot-demo.mp4` — Pick & Place tab in the product showcase
- `ai-training.mp4` — Skill Training tab
- `industrial-automation.mp4` — Fleet View tab

Until a video is added, the hero shows a static image (`images/hero-robotics.jpg`) and each showcase
tab shows its poster image, so the site never looks broken.

## WebM auto-use
If you also add a same-named `.webm` file (e.g. `hero-bg.webm`), it's preferred over the `.mp4` for
browsers that support it — no code changes needed, both are wired up automatically.

## GIF auto-replace
If you add a same-named `.gif` (e.g. `hero-bg.gif`), it takes precedence over both `.mp4` and `.webm`
as the lightest-weight option and is swapped in automatically as a looping image instead of a video.

Precedence: `.gif` > `.webm` > `.mp4`.

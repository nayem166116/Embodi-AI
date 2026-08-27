# Logo (drop-in replace)

The navbar and footer logo on every page (`.brand`) ships with a hidden `<img class="logo-img">`
next to the default text/dot mark ("● EMBODI.AI"). On page load, the site checks for one of these
filenames in this folder, in order:

1. `logo.svg`
2. `logo.png`
3. `logo.webp`
4. `logo.jpg`

The first one found is used automatically as the site logo everywhere (nav + footer, all pages) —
no code changes needed. If none of these files exist, the default text/dot mark keeps showing.

Tips:
- SVG is recommended for crispness at any size.
- Recommended display height is ~28px, so keep the source reasonably wide (e.g. 140x28 or similar aspect ratio).
- Use a transparent background so it reads correctly on the dark navbar.

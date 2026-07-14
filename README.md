# Stone Rabbit Technologies LLC — Website

Marketing site for Stone Rabbit Technologies LLC (stonerabbittechnologies.com).
A one-person software studio run by Mason Lapine, building apps, websites, and
native programs — engineered with AI.

## Stack
Static site — no build step, no dependencies. Plain HTML, CSS, and vanilla JS.

```
index.html        # all page content
css/styles.css    # design system + responsive layout
js/main.js        # scroll reveals, mobile menu, stat counters, hero parallax
assets/logo.png   # logo (also drives favicon)
assets/favicon.png
```

## Design
- **Palette** (sampled from the logo): white background `#ffffff`, black text
  `#17171a`, red highlights `#e02828`. Change `--red` in `css/styles.css` to
  re-tint every accent at once.
- Fully responsive (desktop → tablet → mobile) with a hamburger menu under 720px.
- Animations: hero float + orbit rings, scroll-reveal on every section, animated
  stat counters, pointer parallax on the logo, hover states throughout. All
  animation respects `prefers-reduced-motion`.

## Run locally
Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy
Any static host works. Point the host at this folder / repo root:
- **GitHub Pages** — push and enable Pages on the branch root.
- **Netlify / Vercel / Cloudflare Pages** — no build command; publish directory is `.`.
Then map the `stonerabbittechnologies.com` domain in the host's DNS settings.

## Updating content
Everything is in `index.html` — services, skills, experience timeline, and
projects are plain HTML blocks. To swap the logo, replace `assets/logo.png`
(square PNG with transparent background) and regenerate `assets/favicon.png`.

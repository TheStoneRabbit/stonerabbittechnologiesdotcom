# Stone Rabbit Technologies LLC — Website

Marketing site for Stone Rabbit Technologies LLC (stonerabbittechnologies.com).
A one-person software studio run by Mason Lapine, building apps, websites, and
native programs — engineered with AI.

## Stack
Static site — no build step, no dependencies. Plain HTML, CSS, and vanilla JS.

```
index.html        # all page content
css/styles.css    # design system + responsive layout
js/main.js        # scroll reveals, mobile menu, stat counters
assets/logo.png   # logo (also drives favicon)
assets/favicon.png
```

## Design
- **Palette** (sampled from the logo): white background `#ffffff` with a warm
  bone `#faf7f5` for alternating bands, warm-charcoal text `#26212a`, red
  highlights `#e02828`. Change `--red` in `css/styles.css` to re-tint every
  accent at once; `--red-ink` is the darkened variant used for small text so it
  clears AA contrast on white.
- Fully responsive (desktop → tablet → mobile) with a hamburger menu under 720px.
- Backgrounds stay flat white / bone — no gradient washes or glows. Depth comes
  from soft shadows and hairline borders only.
- Animations: floating logo inside breathing orbit rings, scroll-reveal on every
  section, animated stat counters, and soft lift-on-hover throughout. All
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

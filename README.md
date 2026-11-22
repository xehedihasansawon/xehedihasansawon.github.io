# MD Mehedi Hasan Sawon — Portfolio

Live: https://xehedihasansawon.github.io/

A plain static site (HTML, CSS, JavaScript). No database, no login, no backend.
GitHub Pages serves the `main` branch as it is, so a push to `main` goes live in a minute or two.

## Pages

| Page | File |
| --- | --- |
| Homepage | `index.html` |
| SSFC case study | `ssfc.html` |
| Biporjoy 18 case study | `biporjoy.html` |
| MAAZ STUDIO case study | `maaz-studio.html` |
| Chowdhury Overseas case study | `chowdhury-overseas.html` |
| MIUW ERP case study | `miuw-erp.html` |
| Portfolio website case study | `portfolio.html` |
| Old `project.html?slug=…` links | `project.html` (redirects to the pages above) |
| Not found | `404.html` |

## Code

- `styles.css`: the only stylesheet, shared by every page. Colours and fonts are CSS variables at the top.
- `main.js`: the only script: mobile menu, active nav link, scroll reveal, image lightbox, copy email and the inquiry form.
- Every page carries the same header, footer and icon set. If you change one, change it on all pages.
- Intro loader: the `#loader` block at the top of every page, with the logo drawn in three parts (letters, dot, brush underline). The animation is in the "Intro loader" part of `styles.css`. It plays on every page load and refresh, it is skipped for visitors who turn on reduced motion, and it always ends by itself.

## Images

- Logo and favicons: `assets/brand/` and `assets/favicon.svg`. `mhs-logo.svg` is the red "Mhs." with the brush underline, used in the header, the footer and the hero background. There are also white and dark versions, and 2000 px PNGs.
- Hero photo: `assets/hero-current.webp`
- Project covers, case study artwork and showcase designs: `assets/work/`. Each cover (1484 × 1060) has an 800 px `-cover-sm.webp` copy that phones and the homepage cards load through `srcset`. When a cover changes, remake its `-sm` copy too.
- Tool logos: `assets/tool-*`
- Social share previews (Facebook, LinkedIn, WhatsApp), 1200 × 630 JPG: `assets/og-image.jpg` for the homepage and `assets/work/*-og.jpg` for each case study. Use JPG here, not WebP, because LinkedIn and some WhatsApp versions do not show WebP previews.

Use WebP for photos and artwork. About 1400–2000 px wide is enough for the site.

## Fonts

Inter, Anton and Caveat are served from `assets/fonts/` (latin subset, woff2), not from Google Fonts, so pages do not wait on another server. Every page preloads Inter and Anton. All three fonts use the SIL Open Font License.

## Contact form

The inquiry form has no server. When a visitor submits it, the message opens ready to send in
WhatsApp or their email app. The number and email address are at the top of `main.js`.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173/`.

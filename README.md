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

## Images

- Logo and favicons: `assets/brand/` (`mhs-logo.svg` is the one in the header and footer) and `assets/favicon.svg`
- Hero photo: `assets/hero-current.webp`
- Project covers, case study artwork and showcase designs: `assets/work/`
- Tool logos: `assets/tool-*`
- Social share preview (Facebook, LinkedIn, WhatsApp): `assets/og-image.jpg`, 1200 × 630

Use WebP for photos and artwork. About 1400–2000 px wide is enough for the site.

## Contact form

The inquiry form has no server. When a visitor submits it, the message opens ready to send in
WhatsApp or their email app. The number and email address are at the top of `main.js`.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173/`.

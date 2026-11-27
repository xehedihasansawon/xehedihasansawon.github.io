# MD Mehedi Hasan Sawon — Portfolio

Live: https://xehedihasansawon.github.io/

A static site (HTML, CSS, JavaScript) with a small optional backend on Cloudflare (see "Backend" below).
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
- `main.js`: the only script: language and theme buttons, mobile menu, active nav link, scroll motion, image lightbox, the showcase categories, copy email, the inquiry form and the calls to the backend.
- Every page carries the same header, footer and icon set. If you change one, change it on all pages.
- Intro loader: the `#loader` block at the top of every page, with the logo drawn in three parts (letters, dot, brush underline). The animation is in the "Intro loader" part of `styles.css`. It plays on every page load and refresh, it is skipped for visitors who turn on reduced motion, and it always ends by itself.

## Images

- Logo and favicons: `assets/brand/` and `assets/favicon.svg`. `mhs-logo.svg` is the red "Mhs." with the brush underline, used in the header, the footer and the hero background. There are also white and dark versions, and 2000 px PNGs.
- Hero photo: `assets/hero-current.webp`
- Project covers, case study artwork and showcase designs: `assets/work/`. Each cover (1484 × 1060) has an 800 px `-cover-sm.webp` copy that phones and the homepage cards load through `srcset`. When a cover changes, remake its `-sm` copy too.
- Website case studies (MAAZ STUDIO, Chowdhury Overseas, Portfolio): section screenshots of the live sites in `assets/work/*-web-*.webp`. Each one is 1600 px wide, with a 900 px `-sm` copy; the phone shots are 720 px. When a live site changes, take new screenshots and keep the same file names.
- Tool logos: `assets/tool-*`
- Social share previews (Facebook, LinkedIn, WhatsApp), 1200 × 630 JPG: `assets/og-image.jpg` for the homepage and `assets/work/*-og.jpg` for each case study. Use JPG here, not WebP, because LinkedIn and some WhatsApp versions do not show WebP previews.

Use WebP for photos and artwork. About 1400–2000 px wide is enough for the site.

## Fonts

Inter, Anton and Caveat are served from `assets/fonts/` (latin subset, woff2), not from Google Fonts, so pages do not wait on another server. Every page preloads Inter and Anton. Bangla uses Anek Bangla (`anek-bangla-400.woff2` and `-700.woff2`), cut down to the Bengali letters in `assets/i18n/bn.json`. The browser downloads it only when Bengali text is on screen. All four fonts use the SIL Open Font License.

## Light theme and Bangla

The header has an EN / বাং switch and a light/dark button. Both choices are saved in the visitor's browser. Dark is the default.

- Light theme: the `[data-theme="light"]` block in `styles.css` changes the colour variables, plus a few backgrounds that are not variables.
- Bangla: the pages stay in English. `assets/i18n/bn.json` maps each English text to its Bangla, and `main.js` swaps them when বাং is chosen.
  - A key is the exact English text, with runs of spaces collapsed to one. When a text mixes in tags like `<strong>` or `<span>`, the key is the element's inner HTML.
  - Alt text, `aria-label`, `placeholder`, `data-caption` and the page title are looked up the same way.
  - When you change English text on a page, update or add its entry in `bn.json` and bump `I18N_VERSION` in `main.js`. Text with no entry stays in English.
  - If the new Bangla uses a letter the font does not have yet, subset the font again.
  - Names (people, brands, tools) are left in English on purpose.

## Contact form

When a visitor submits the inquiry form, the message opens ready to send in WhatsApp or their email app. The number and email address are at the top of `main.js`.

## Backend (Cloudflare Worker + D1)

The site itself stays static. A small API at `https://xehedihasansawon-api.xehedi.workers.dev` adds four things:

- It saves a copy of each project brief.
- It takes client reviews. Approved ones appear in the "What clients say" section, which stays hidden while there are none.
- It counts page views without cookies.
- It runs the admin page at `/admin`: a personal task list, messages (with CSV download), reviews, visitors and a weekly summary. It can be installed on a phone as an app.

The brief and review forms use Cloudflare Turnstile to stop bots. Its script loads only when someone starts using a form, and it stays invisible unless Cloudflare needs a click. The site key is `TURNSTILE_SITEKEY` in `main.js`; the secret lives only in Cloudflare.

The code lives in a separate folder, `Desktop\xehedihasansawon-api`. `API_BASE` in `main.js` points to it. Everything is optional: if the API is down, the form still opens WhatsApp or email and nothing breaks.

The admin password is the `ADMIN_PASSWORD` secret in Cloudflare. It is never stored in this repo, and the admin page keeps only a login token that ends after 12 hours.

### Edit site (admin)

The admin's "Edit site" tab changes this repo through GitHub: add, edit, move or remove showcase designs and case study posts, edit the homepage text and contact details, add a new project page, and undo the last change. Every save is one commit on `main` whose message starts with "Admin:", so **run `git pull` before you change anything here by hand**. The editor reads the HTML as text, so keep the existing markup patterns (showcase cards, `format-feature` posts, chapters, the footer project list) when you edit by hand.

### Visitor counts

Page views and daily visitors are counted without cookies. The admin's "Open my site" link adds `?notrack=1` once, and from then on that browser's visits are not counted (`?notrack=0` turns counting back on).

## Run locally

```bash
npm install
npx vite --port 5180
```

Open `http://localhost:5180/`. Use port 5180: it is the local address the backend accepts, so the forms and reviews work in local tests too.

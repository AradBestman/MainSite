# Portfolio Redesign — Implementation Plan

**For:** the implementing agent (Sonnet)
**Repo:** `MainSite` — vanilla HTML/CSS/JS, no build step, no package manager.
**Constraint:** stays vanilla. No framework. No build tooling introduced.

Read this whole file before editing anything. Work phase by phase. Commit after each phase.

---

## 0. Scope — what you touch and what you must not

The repo has ~30 HTML files at the root. They fall into three groups. **Only two groups are in scope.**

### IN SCOPE — the portfolio shell (10 files)

| File | Role |
|---|---|
| `index.html` | The portfolio homepage. The main deliverable. |
| `TemplateLandHere&Now.html` | Project detail page — "Here And Now" |
| `ForwardBlueYellow.html` | Project detail page — "Move Forward" |
| `MoveForwardPink.html` | Project detail page — "Landing Page" (pink) |
| `PageLoaderTemplate.html` | Project detail page — "Html Load attributes" |
| `MathTemplate.html` | Project detail page — "Math Calculator" |
| `memorygameTemplate.html` | Project detail page — "Memory Game" |
| `TemplateXO.html` | Project detail page — "XO 1 V.S 1" |
| `TemplatePokedex.html` | Project detail page — "Pokemon Pokedex" |
| `TemplateHugeman.html` | Project detail page — "Huge Man" |

These 9 detail pages are near-identical: header + hero (title + "See project" / "Download Project" buttons) + the 11 tech icons + footer. They share `css/mainpage.css` + `css/globalTemplate.css`. Treat them as **one template rendered nine times** — build the shell once and apply it to all nine.

### IN SCOPE — stylesheets/scripts owned by the shell

`css/mainpage.css`, `css/globalTemplate.css`, `js/mainPage_js.js` (empty), `css/.footer-style.css` (unused), `css/cssPageLoader.css` (empty).

### OUT OF SCOPE — do not restyle

The actual project demos: `XO.html`, `Pokedex.html`, `PageLoader.html`, `Calculator.html`, `MemoryGame.html`, `hugmen.html`, `Weather.html`, `Weather From Scratch.html`, `rickNmorty.html`, `CoffeeLand.html`, `Coffee.html`, `GalleryLand.html`, `AdviceFree.html`, `FreeConsultation.html`, `LandPagePhotos.html`, `Landpage2LehovilKadima.html`, `ForwardPink.html`, `letUsTakeUFowords1.html`, `Template copy Boostrap.html`, `sass/landingHereNow.html`, and their CSS (`css/XO.css`, `css/pokadex.css`, …) and all of `js/*.js` except `mainPage_js.js`.

**These are the portfolio pieces themselves.** Restyling them destroys the work being showcased. Several load their own Bootstrap — leave that alone. The only thing you may change in these files is a broken path (see §1.9).

Also out of scope: `sass/` (legacy, unused by the shell), `zip/`, `images/`, `Audio/`.

---

## 1. Phase 1 — Audit findings

This section is the *result* of the audit; you do not need to redo it. Every item below is a defect to fix or a decision to honour.

### 1.1 Visual — what reads as dated
- **Hero** (`.bcontainer`): a 90° blue→cyan gradient (`#090979` → `#00d4ff`) with **10 white squares rotating and scaling on infinite loops** (`.box div`, `@keyframes animate`). This is the single most dated element on the site — it is exactly the "cheesy tech effect" to remove.
- **Tech icons** (`.icons`/`.icon`): 11 logos at `opacity: .3`, hover `scale(1.5) rotate(8deg)` with a triple cyan neon `box-shadow` (`#1ae0ec`) plus `drop-shadow`. Neon glow + oversized hover scale = dated.
- **Project thumbnails** (`.games`): `animation: spin 10000ms linear forwards` — a **ten-second** rotation from `border-radius:100%` to `25%` that plays on every page load. Remove entirely.
- **Send button** (`.btn2`): `@keyframes chitchat` cycles `content` through `#`, `^{`, `№:0`, `?{4@%`… as a hover effect. Remove.
- **`.btn1`**: neumorphic double box-shadow (`6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff`). A 2020 trend; remove.
- **Social bar** (`.photos`): the same blue→cyan gradient repeated, icons forced white via `filter: brightness(0) invert(1)`, cyan glow on hover.
- **Typography**: `* { font-family: "Fjalla One" }` — a **condensed display face applied to every element including body copy, labels and form inputs**. This alone accounts for much of the dated feel. Nav links separately override to `"Segoe UI", Tahoma, …`, so the site runs two unrelated typefaces with no hierarchy between them.
- Body copy sizes are unset (browser default 16px) while `#koteret` is a flat `4rem` — no scale, no responsive typography, no `clamp()` anywhere.

### 1.2 Architecture problems
- `css/mainpage.css` (502 lines) and `css/globalTemplate.css` (97 lines) are both loaded by all 9 detail pages and **conflict**: both declare a `*` reset, both declare `.footer2`. `globalTemplate.css` sets `body { color: #fff }`, which is why detail-page body text is white.
- **Bootstrap 5.3 is loaded on `index.html` for the grid and three `.card`s only.** The JS bundle is loaded too and is completely unused — `grep -c 'data-bs-'` on `index.html` returns **0**. That is ~230 KB CSS + ~80 KB JS for a three-column layout that is 12 lines of CSS Grid. Removing it is the biggest single performance win *and* removes the Bootstrap-template look the brief explicitly rejects.
- `js/mainPage_js.js` is empty and not referenced. `index.html` ships **no JavaScript of its own**.
- Zero CSS custom properties in the shell. Colors (`#1ae0ec`, `#2c2c2c`, `#3a3a3a`, `#f6f6f3`, `rgba(0,0,0,.16)`) and spacing are hardcoded and repeated.
- Dead files: `css/.footer-style.css` (unused), `css/cssPageLoader.css` (0 bytes), `js/mainPage_js.js` (0 bytes), `.html` (a dead RTL draft at repo root, references a nonexistent `MainPage.html`).

### 1.3 Responsive problems
- **Viewport units used for component heights**: `#hcontainer { height: 7vh }`, `.about { height: 40vh }`, `.FormContainer { height: 50vh }`, `.photos { height: 10vh }`. On a short laptop viewport the header collapses to ~42 px; the contact form's content overflows its 50vh box. Content-driven height + padding must replace all of these.
- **`width: 100vw` on `#koteret`, `.second-heading`, `.FormContainer`, `.photos`** — `100vw` includes the scrollbar, guaranteeing horizontal overflow on desktop. `body { overflow-x: hidden }` is currently masking it. Both must go.
- `.photos` has `height: 10vh` **and** `padding: 2.5rem` — the padding wins and the height is meaningless.
- `.games` is a fixed `18rem × 18rem`; `.card-img-top` is a fixed `286 × 169px` with no `aspect-ratio`, so images shift layout as they load.
- One breakpoint only (`max-width: 690px`). Nothing between 690px and desktop — tablet is unhandled.
- At ≤690px `.icons { flex-direction: column }` turns 11 tech logos into a vertical stack roughly 1200px tall that the user must scroll past.
- Mobile is a shrunk desktop, not a redesign — the brief asks for the opposite.

### 1.4 Navigation problems
- The nav carries `class="sticky"` but **no `.sticky` rule exists in `mainpage.css` or `globalTemplate.css`**. The header is not sticky on any in-scope page. (Three out-of-scope stylesheets define `.sticky`; that is coincidence.)
- Mobile menu is the checkbox hack (`#menu-toggle` + `<label class="hamburger">`). It has no `aria-expanded`, no `aria-controls`, is not keyboard-operable as a control, cannot be closed with Escape, and does not close when a link is tapped.
- At ≤690px the site name and logo are `display: none` — the mobile header has **no branding at all**.
- Nav hover is `transform: scale(1.2)` + cyan `text-shadow`. There is **no active-section state**.
- On `index.html`, "Home" is `href="#"`, which appends a bare `#` to the URL.

### 1.5 Accessibility problems
- **No `<main>`, `<header>`, `<section>`, or `<nav>` landmark structure on `index.html`** — it is entirely `<div>`s. (The 9 detail pages do have `<main>`.)
- **Heading hierarchy skips levels**: `h1` → `h3.second-heading` → `h5.card-title` → `h3.contact`. No `h2` exists on the page.
- **`<label for="content">` points at nothing** — the textarea input is `id="inputBigger"`. The field is unlabelled.
- The contact block is **not a `<form>`**: no `<form>`, no `name` attributes, no `action`, no `type` on the button. The Send button is inert — submitting is impossible.
- **No focus-visible styles anywhere.** No `:focus` or `:focus-visible` rule exists in the shell CSS.
- **No `prefers-reduced-motion` support anywhere in the repo** (`grep -rln` returns nothing), while the hero runs 10 infinite animations.
- The 6 JS-project thumbnails are bare `<a><img></a>` with no accessible name beyond the alt text and no visible title.
- IDs are swapped and misleading: the contact form is `id="footer"` and the actual `<footer>` is `id="contact"`. Nav "Contact" therefore targets the form, and `#contact` targets the copyright bar.
- `.card-text { text-align: right }` — an RTL leftover on an LTR page.
- Missing `<meta name="description">`, Open Graph tags, favicon, and `theme-color`.
- `<meta http-equiv="X-UA-Compatible" content="IE=edge">` on every page is a dead IE relic.

### 1.6 Content gaps (**do not invent facts**)
- **The About section contains no text.** `#aboutme` holds only the logo image and a "Download CV" button. The nav promises "About" and delivers nothing.
- **There is no experience/employment data anywhere in the repo.** The brief mentions an experience section; the source material for one does not exist.
- The 6 JS projects (`.games` thumbnails) have **no titles, no descriptions and no technology tags** in the markup — only `alt` text.
- The 3 landing-page cards have titles but the identical CTA label "Click to the landing page" three times.

**Rule: write no biographical claim, job, date, employer, client or metric that is not already in the repo.** Where the design needs copy that does not exist, write neutral placeholder text and mark it:
```html
<!-- TODO(arad): replace with real copy -->
```
Then list every TODO in your final report. See §6.2 for the experience-section decision.

### 1.7 Broken behaviour worth fixing while you are in there
- `.btn2` (Send) does nothing — no form, no handler.
- An `<audio controls>` element playing `/Audio/Replace KICKBASS IDO BEFORE MIX 4444 ARAD Touch Final .wav` sits **inside the contact form**, between the Send button and the form fields. It is unexplained and unrelated. **Do not delete the file.** Remove it from the contact form; if you want to keep it reachable, that is a question for the owner — flag it, default to removing it from the markup.
- The Facebook link points at `https://www.facebook.com/` (the site homepage, not a profile).
- The location icon is a non-interactive `<div>` with no text — it conveys nothing.
- WhatsApp: `https://wa.me/0546904554` — `wa.me` requires the full international number. Should be `https://wa.me/972546904554`.

### 1.8 Path fragility
Detail pages use **absolute** paths (`/images/img-JS.png`, `/css/mainpage.css`, `/zip/XO.zip`) while `index.html` uses **relative** ones (`images/…`, `./images/…`). Absolute paths break the moment the site is served from a subpath (GitHub Pages project sites, previews). **Normalise every in-scope page to relative paths.**

### 1.9 Genuinely broken links (fix these — the only permitted edits to out-of-scope files)
| Where | Problem | Fix |
|---|---|---|
| `TemplatePokedex.html` | links `pokedex.html`; the file is `Pokedex.html` | correct the case — 404s on case-sensitive hosting |
| `ForwardBlueYellow.html` | download links `Archive.zip` at root; file is `zip/Archive.zip` | `zip/Archive.zip` |
| `hugmen.html` | links `./css/hugmen.css` — **the file does not exist** | out of scope to restyle; just report it |
| `PageLoader.html` | links `cssPageLoader.css` at root; the file is `css/cssPageLoader.css` and is **0 bytes** | report it |
| `MathTemplate.html`, `memorygameTemplate.html`, `TemplateLandHere&Now.html` | all three "Download Project" buttons point at `/zip/sass.zip` | almost certainly wrong for at least two; report, do not guess a replacement |

Fix the first two. Report the rest — do not guess.

---

## 2. Phase 2 — Design system

### 2.1 Direction

Target: an **editorial / archive** portfolio. Warm paper ground, ink text, one restrained accent, monospace for metadata. Projects presented as a numbered index rather than a wall of identical cards.

Explicitly avoid (from the brief): huge centered gradient headline text, glowing blobs, glassmorphism panels, floating shapes, neon, identical rounded cards, dark-navy "developer" clichés.

The signature details that make this feel art-directed rather than generated:
1. **Monospace metadata** — project numbers (`01`–`09`), tech tags, and labels in a mono face at small size with letter-spacing. Sans for prose. Never mono for body copy.
2. **Hairline rules** — `1px` `--border` separators between project rows and section boundaries, instead of a card border on every element.
3. **A restrained accent used sparingly** — links, focus rings, one hero detail. Not on every button.
4. **Asymmetry** — section headings sit in a narrow left column with content in a wider right column on desktop (CSS Grid, `grid-template-columns: minmax(0, 14rem) 1fr`), stacking on mobile. This is the main thing that stops it reading as a template.

### 2.2 Typography

Two families, loaded from Google Fonts with `preconnect`:

- **Display / headings:** `Instrument Serif` (400, plus italic) — a high-contrast serif with real personality. Used only for `h1`, `h2` and pull quotes.
- **UI / body:** `Inter` (400, 500, 600) — variable, excellent at small sizes.
- **Metadata:** `ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace` — **system stack, no download.**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap">
```

Three weights of Inter plus two styles of Instrument Serif. Do not add more. `display=swap` is required. Set explicit `font-family` fallbacks so the page is readable before fonts land.

The existing `fonts/FlowCircular-Regular.ttf` is unused by the shell — leave the file, do not load it.

### 2.3 Tokens

Put these in `css/site.css` under a `TOKENS` banner. Every value in the redesign comes from here — no stray hex codes or pixel values in component rules.

```css
:root {
  /* Color — light (default) */
  --bg:            #faf9f7;   /* warm paper */
  --bg-subtle:     #f2f0ec;   /* alternating section band */
  --surface:       #ffffff;
  --text:          #16150f;   /* near-black ink, not #000 */
  --text-muted:    #6b675e;   /* ≥ 4.5:1 on --bg */
  --text-faint:    #9a958a;   /* metadata only, ≥ 3:1, never body copy */
  --accent:        #2f4bff;
  --accent-hover:  #1f36d6;
  --accent-soft:   #eceeff;
  --border:        #e2ded6;
  --border-strong: #cdc7bb;

  /* Spacing — 4px base */
  --space-1: .25rem;  --space-2: .5rem;   --space-3: .75rem;
  --space-4: 1rem;    --space-6: 1.5rem;  --space-8: 2rem;
  --space-12: 3rem;   --space-16: 4rem;   --space-24: 6rem;
  --section-y: clamp(4rem, 10vw, 8rem);   /* vertical rhythm between sections */

  /* Type scale — fluid */
  --text-xs:   .75rem;
  --text-sm:   .875rem;
  --text-base: 1rem;
  --text-lg:   clamp(1.0625rem, .4vw + 1rem,  1.1875rem);
  --text-xl:   clamp(1.25rem,  .6vw + 1.1rem, 1.5rem);
  --text-2xl:  clamp(1.75rem, 1.5vw + 1.3rem, 2.5rem);
  --text-3xl:  clamp(2.5rem,  4vw   + 1rem,   4.5rem);   /* hero h1 */
  --leading-tight: 1.1;
  --leading-snug:  1.3;
  --leading-body:  1.65;
  --tracking-mono: .06em;

  /* Radius — restrained */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;
  --radius-full: 999px;

  /* Shadow — soft and low, never a hard grey blur */
  --shadow-sm: 0 1px 2px rgb(22 21 15 / .04), 0 1px 1px rgb(22 21 15 / .03);
  --shadow-md: 0 4px 12px rgb(22 21 15 / .06), 0 1px 3px rgb(22 21 15 / .04);
  --shadow-lg: 0 12px 32px rgb(22 21 15 / .08), 0 2px 8px rgb(22 21 15 / .04);

  /* Motion */
  --dur-fast: 120ms;
  --dur-base: 220ms;
  --dur-slow: 420ms;
  --ease: cubic-bezier(.2, .6, .3, 1);

  /* Layout */
  --container: 1180px;
  --container-narrow: 68ch;   /* prose measure */
  --gutter: clamp(1.25rem, 4vw, 3rem);
  --header-h: 4rem;
}
```

**Dark mode is optional.** If you do it, use `@media (prefers-color-scheme: dark)` redefining only the color tokens, and verify contrast. Do not ship a half-done dark mode — a broken dark theme is worse than none. If you skip it, say so in the report.

### 2.4 Container

```css
.container {
  width: 100%;
  max-width: var(--container);
  margin-inline: auto;
  padding-inline: var(--gutter);
}
```
Every section uses this. No `100vw` anywhere in the new CSS.

---

## 3. Phase 3 — Refactor

### 3.1 File plan

**Create**
- `css/site.css` — the entire shell design system, one file, banner-commented in this order:
  `1 RESET · 2 TOKENS · 3 BASE TYPOGRAPHY · 4 LAYOUT/CONTAINER · 5 HEADER + NAV · 6 HERO · 7 ABOUT · 8 SKILLS · 9 PROJECTS · 10 CONTACT · 11 FOOTER · 12 COMPONENTS (buttons, tags, links) · 13 UTILITIES · 14 MOTION + REDUCED-MOTION · 15 ACCESSIBILITY`
- `js/site.js` — one small script, `defer`-loaded, guarded so it no-ops on pages missing an element.

**Delete after every page is migrated** (verify with `grep -rn` first, and note that out-of-scope pages must not depend on them):
- `css/mainpage.css`, `css/globalTemplate.css`, `css/.footer-style.css`, `css/cssPageLoader.css`, `js/mainPage_js.js`, and the root `.html` dotfile.

**Do not create** a `dist/`, `src/`, build script, `package.json`, or bundler.

### 3.2 `index.html` — new structure

```
<header class="site-header">           sticky, 4rem, hairline bottom border on scroll
<main>
  <section class="hero">               #top
  <section class="about">              #about
  <section class="skills">             #skills
  <section class="work">               #work   ← the projects, the centre of gravity
  <section class="contact">            #contact
</main>
<footer class="site-footer">
```

Fix the swapped IDs: `#about`, `#work`, `#contact` on the sections; nav links point at those. Keep `#aboutme` and `#cards` as **additional** ids or leave redirect-safe anchors if you find external references — a quick `grep -rn '#cards\|#aboutme\|#footer' *.html` will tell you. If nothing outside the shell references them, drop the old ids.

### 3.3 Header + navigation

- Sticky: `position: sticky; top: 0; z-index: 50`. Height `var(--header-h)`.
- Ground it with `background: color-mix(in srgb, var(--bg) 88%, transparent)` + `backdrop-filter: blur(10px)`. Add `@supports not (backdrop-filter: blur(1px))` fallback to solid `--bg`. This is the one place `backdrop-filter` earns its place.
- Border-bottom appears only once scrolled — JS toggles `.is-scrolled` on the header at `scrollY > 8`.
- **Branding stays visible on mobile.** Show the wordmark "Arad Ariel" at all sizes; the round logo image may drop below 640px.
- **Replace the checkbox hack** with a real control:
  ```html
  <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">
  ```
  JS toggles `aria-expanded` and a class. Animate the icon between hamburger and close with two spans and a transform — no icon library.
- Mobile menu: a full-width panel below the header (not a `100vh` overlay that fights mobile browser chrome). Large type, `min-height: 48px` per row, generous padding. Closes on link tap, on Escape, and on outside click. Move focus to the first link on open and back to the toggle on close.
- **Active-section highlighting** via `IntersectionObserver` — set `aria-current="true"` on the matching link and style it with a short underline in `--accent`. Never rely on hover-only affordances.
- Hover: color shift + a 1px underline that grows from the left over `--dur-fast`. No `scale()`, no glow.
- Keep `html { scroll-behavior: smooth }` but move it into `site.css` and wrap it:
  ```css
  @media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth } }
  ```
  Add `scroll-padding-top: calc(var(--header-h) + var(--space-4))` so anchors are not hidden under the sticky header.

### 3.4 Hero

Must answer: who I am · what I do · why it matters · one clear CTA.

Layout: asymmetric grid, not centred. Left column ~62%: an eyebrow line (mono, `--text-faint`, e.g. `Front-end developer · Israel` — **verify the location claim or omit it**), an `h1` in Instrument Serif at `--text-3xl` with `--leading-tight`, a one-paragraph positioning statement at `--text-lg` capped to `--container-narrow`, then two actions:
- Primary: "View work" → `#work` (solid `--accent`)
- Secondary: "Download CV" → `zip/CV- Arad_Ariel.pdf` (ghost/outline). This preserves the existing CV link — **keep it, it is real content.**

Right column: the existing `images/AradLogo.jpeg` portrait, or negative space. Do not fill it with decoration.

Motion: a single staggered fade-and-rise on load (eyebrow → h1 → paragraph → buttons), `--dur-slow`, `transform: translateY(12px)` → `0` plus opacity. `will-change: transform, opacity` only during the animation. Nothing infinite. Nothing that loops.

**Delete `.box` and its ten `<div>`s and `@keyframes animate` entirely.** Delete the gradient.

### 3.5 About

Currently empty. Build a two-column grid (`minmax(0,14rem) 1fr`): a mono section label `ABOUT` in the narrow column, prose in the wide column at `--container-narrow` measure, `--leading-body`.

Copy: write 2–3 short paragraphs using **only** what the repo supports (the technologies listed in the tech icons, the kinds of projects present — landing pages, browser games, API-driven apps). Mark anything you are unsure of with `<!-- TODO(arad) -->`. Do not state years of experience, employers, education, or availability.

### 3.6 Skills

Replace the 11 faded logos with a legible, honest list. Keep all 11 technologies — they are real content:
`NodeJS · React · API · TypeScript · ES6 · OOP · JavaScript · SASS · Bootstrap · CSS · HTML`

Presentation: a responsive grid of restrained chips or a mono-labelled list grouped by area (Languages / Frameworks & Libraries / Concepts). Keep the existing `images/img-*.png` logos at a modest 24–28px beside the label, at full opacity — **not** `opacity: .3`. Hover: subtle background shift only. No scale, no glow, no stagger-on-load loop.

```css
grid-template-columns: repeat(auto-fit, minmax(min(9rem, 100%), 1fr));
```

### 3.7 Work / projects — the most important section

All **nine** projects stay. Nothing is dropped.

**Featured (3)** — the landing pages, which have real images:

| Title | Image | Detail page |
|---|---|---|
| Here Now | `images/HereNow.png` | `TemplateLandHere&Now.html` |
| Move Forward | `images/להוביל אותך קדימה.jpeg` | `ForwardBlueYellow.html` |
| Bring You Forward | `images/PinkForward.png` | `MoveForwardPink.html` |

**Index (6)** — the JS applications:

| # | Title | Image | Detail page |
|---|---|---|---|
| 04 | Page Loader | `images/PageLoader.png` | `PageLoaderTemplate.html` |
| 05 | Calculator | `images/Calculator.png` | `MathTemplate.html` |
| 06 | Memory Game | `images/MemoryGame.png` | `memorygameTemplate.html` |
| 07 | Tic Tac Toe | `images/XO.png` | `TemplateXO.html` |
| 08 | Pokédex | `images/Pokedex.png` | `TemplatePokedex.html` |
| 09 | Huge Man | `images/HugeMan.png` | `TemplateHugeman.html` |

Two different treatments — this is how you satisfy "do not make every project look like an identical card":

- **Featured**: large image, `aspect-ratio: 16 / 10`, `object-fit: cover`, title in Instrument Serif at `--text-xl`, a one-line description, mono tech tags. Alternate the image between left and right on desktop (`:nth-child(even) { direction: rtl }` on the grid row, or an explicit `grid-template-areas` swap — prefer explicit).
- **Index**: a hairline-ruled list. Each row: `01`-style mono number · title · tech tags · a small thumbnail that only appears on hover/focus on desktop. On mobile the rows become compact cards with the thumbnail always visible.

Interaction:
- The **whole row/card is the link** — one `<a>` wrapping the content, not a nested link plus a button (nested interactive elements are invalid and break keyboard nav). Use `::after { position: absolute; inset: 0 }` on the title link if you need a stretched-link pattern; give it `position: relative` on the parent.
- Hover/focus: image `scale(1.03)` inside an `overflow: hidden` wrapper, background shifts to `--bg-subtle`, an arrow glyph slides `4px` right. `--dur-base`, `--ease`. That is all.
- Every project image needs a **descriptive** `alt` — "Here Now landing page — hero section with…", not "Here Now".
- Give every `<img>` explicit `width`/`height` attributes or a CSS `aspect-ratio` to eliminate layout shift, plus `loading="lazy"` on everything below the fold and `decoding="async"`.

Descriptions and tech tags do not currently exist. Write short, factual ones from what the code actually does (e.g. Pokédex: "Fetches and filters Pokémon from the PokéAPI" — verifiable in `js/Pokedex_js.js`). **Read the relevant `js/*.js` file before writing each description.** Where you cannot verify, mark TODO.

### 3.8 Contact

Make it a **real, working, accessible form**:
```html
<form class="contact-form" novalidate>
```
- Real `<label for>` bound to every field. Fix the orphaned `for="content"` → bind it to a `<textarea id="message" name="message">` (the current `#inputBigger` should become a textarea).
- `name`, `type`, `autocomplete` (`name`, `email`, `tel`), `required` where appropriate.
- `<button type="submit">`.
- Client-side validation in `js/site.js`: on submit, validate, show inline error text tied to the field via `aria-describedby`, set `aria-invalid`, move focus to the first invalid field, and announce status in a `role="status"` live region.
- **Submission:** the form currently has no backend and does nothing. Compose a `mailto:` to `rdrl20014@gmail.com` with the subject and body pre-filled from the fields — zero dependencies, works immediately, honest about what it does. Leave a clearly commented block showing where a Formspree/Web3Forms endpoint would go if the owner later wants real submissions. Do **not** silently pretend a message was sent.
- **Remove the `<audio>` element** from the form (§1.7). Leave the file on disk.
- Delete `.btn2` and `@keyframes chitchat`.

Layout: label above input, `--space-2` gap, fields at `--text-base` with **`font-size: 16px` minimum on mobile** (anything smaller triggers iOS zoom-on-focus). Inputs get a `1px solid var(--border)` bottom or full border, `--radius-sm`, and a clear `:focus-visible` ring. Not the current `border-radius: 30px` pill with a cyan underline.

### 3.9 Social links + footer

- Keep all five: Facebook, Location, LinkedIn, Email, WhatsApp.
- Drop the gradient band. Put them in the footer on `--bg-subtle` or `--bg` with a top hairline.
- Every link needs an accessible name: visible text, or `aria-label` + `aria-hidden="true"` on the icon.
- The **location** item is a `<div>` with no text — either give it a visible location string or remove it. Do not ship a decorative icon that claims to be information.
- Fix WhatsApp → `https://wa.me/972546904554`.
- Facebook currently points at `facebook.com` — either supply the real profile URL or remove the link. Flag as TODO; do not guess a URL.
- Icons: the existing SVGs are currently recoloured with `filter: brightness(0) invert(1)`. On the new light ground use `currentColor`-driven inline SVG, or keep the files and use a `filter` that produces `--text-muted`. Inline SVG is cleaner and removes 5 HTTP requests — prefer it.
- Footer: `© <span id="year"></span> Arad Ariel` (JS fills the year), plus the existing terms line. Keep it short.

### 3.10 The 9 project detail pages

Build one shell and apply it to all nine. Each page keeps its existing title, its "See project" link and its "Download Project" link — **all three are real content, none may be dropped.**

New structure per page:
```
<header>  (identical to index — nav links point back to index.html#work etc.)
<main>
  <a class="back-link" href="index.html#work">← Back to work</a>
  <h1>{project title}</h1>
  <p class="lede">{one-line description}</p>
  <ul class="tech-list">{the technologies actually used by that project}</ul>
  <div class="actions">
    <a class="btn btn--primary" href="{demo}">View live project</a>
    <a class="btn btn--ghost" href="{zip}" download>Download source</a>
  </div>
  <figure>{project screenshot — reuse the existing images/*.png}</figure>
</main>
<footer>
```

Notes:
- The current markup wraps `<a>` inside `<button>` (or `<button>` inside `<a>`) on most of these pages. **Both are invalid HTML and break keyboard interaction.** Use a single `<a class="btn">` styled as a button. Navigation is a link, never a button.
- Drop the 11-icon strip from the detail pages — replace it with a per-project tech list, which is more useful and more honest.
- Remove the `globalTemplate.css` `button { background: linear-gradient(to right, #0f0c29, #302b63, #24243e) }` gradient and the inherited `body { color: #fff }`.
- Convert all absolute paths (`/images/…`, `/css/…`, `/zip/…`) to relative.
- Give each page a real `<title>` — seven of them are currently just `Land`. E.g. `Pokédex — Arad Ariel`.
- Apply the §1.9 link fixes.

### 3.11 `js/site.js`

One file, `<script src="js/site.js" defer></script>`, roughly 100–140 lines. Everything guarded with early returns so the same file works on index and on detail pages.

```
initNav()          toggle, aria-expanded, Escape, outside-click, close-on-navigate, focus mgmt
initHeaderScroll() .is-scrolled class, passive scroll listener (or an IntersectionObserver sentinel — prefer the sentinel, zero scroll handlers)
initActiveLink()   IntersectionObserver over sections → aria-current on nav links
initReveal()       IntersectionObserver → .is-visible; unobserve after firing; skipped entirely under prefers-reduced-motion
initForm()         validation, mailto compose, live-region status
initYear()         footer year
```

Rules:
- No `scroll` handler without `{ passive: true }`. Prefer `IntersectionObserver` over scroll listeners throughout.
- Read the reduced-motion preference once: `const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches`. When true, add `.is-visible` to everything immediately and skip the observer.
- **Reveal must be fail-safe**: base state is visible. Add an `.js-reveal` class from JS on load, and only *that* class hides the element pre-reveal — so if JS fails, the content is still on screen. Never ship `opacity: 0` as a CSS default on content.
- No `innerHTML` with user-supplied strings.

---

## 4. Phase 4 — Responsive

Design mobile-first: base styles are the small-screen layout, `min-width` media queries add complexity upward.

Test at **360, 390, 430, 600, 768, 900, 1024, 1280, 1440, 1920** px.

Checklist:
- [ ] `document.documentElement.scrollWidth === document.documentElement.clientWidth` at every width — no horizontal overflow. Verify with `body { overflow-x: hidden }` **removed**; that property is a symptom-hider, not a fix, and must not survive into the final CSS.
- [ ] No `100vw` anywhere. No `vh` used for a component's height.
- [ ] Every interactive target ≥ 44×44 px on touch.
- [ ] Form inputs ≥ 16px font-size on mobile.
- [ ] Long strings (email address, project titles) wrap — `overflow-wrap: break-word` on prose containers.
- [ ] Images never exceed their container: a global `img, svg, video { max-width: 100%; height: auto; display: block }` in the reset.
- [ ] Prefer intrinsic layout (`auto-fit`/`minmax`, `clamp()`) over breakpoints. Use breakpoints only where the layout genuinely changes shape (nav, featured-project alternation, the two-column section grid).
- [ ] Mobile nav panel does not trap scroll or exceed the viewport.
- [ ] Tablet (768–1024) is deliberately designed, not left as a stretched phone layout.

---

## 5. Phase 5 — Polish

- Scroll reveal: `opacity 0 → 1`, `translateY(16px) → 0`, `--dur-slow`, `--ease`, staggered `60ms` per sibling **within a section only** — never a page-wide cascade. Fires once.
- Only ever animate `transform` and `opacity`. No animating `width`, `height`, `top`, `box-shadow`, or `background-position`.
- Hover states: `--dur-fast` in, `--dur-base` out. Subtle. If you can see it happening, it is too big.
- **Global focus ring**, applied once:
  ```css
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
  ```
  Never `outline: none` without a replacement.
- Add a skip link: `<a class="skip-link" href="#main">Skip to content</a>` as the first element in `<body>`, visually hidden until focused.
- `::selection` in `--accent-soft`.
- **Reduced motion**, at the very end of `site.css`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
- Head of every in-scope page: `<meta name="description">` (unique per page), `<meta name="theme-color" content="#faf9f7">`, Open Graph title/description/image (`images/AradLogo.jpeg`), a favicon, `<html lang="en">`. **Remove `X-UA-Compatible` from every in-scope page.**

---

## 6. Phase 6 — Cleanup and report

### 6.1 Cleanup
1. `grep -rn "mainpage.css\|globalTemplate.css" *.html sass/` — confirm zero references, then delete both files.
2. Delete `css/.footer-style.css`, `css/cssPageLoader.css`, `js/mainPage_js.js`, and the root `.html` dotfile.
3. Add `.DS_Store` is already in `.gitignore`; also `git rm --cached` any tracked `.DS_Store` files.
4. Read through `css/site.css` once and delete any rule you wrote that nothing uses.
5. Confirm no `!important` survives outside the reduced-motion block.
6. Confirm every color and space value in component rules is a `var(--…)`.

### 6.2 Decisions to surface, not to make alone
Put these at the top of your final report:
- **Experience section**: the repo contains no employment data. Recommend omitting the section rather than scaffolding an empty one. State clearly that you did not fabricate one.
- **The audio file** in the contact form — removed from markup, file kept. Confirm that is wanted.
- **Facebook URL** — currently points at facebook.com. Needs a real profile URL or removal.
- **Location** — needs a real string or the item goes.
- The three `/zip/sass.zip` download links (§1.9) that are probably wrong.
- `hugmen.html` → missing `css/hugmen.css`.
- Whether dark mode was shipped.
- Every `TODO(arad)` you left, as a list.

### 6.3 Verification before you report done
- [ ] Open all 10 in-scope pages. Every link resolves. Every image loads (check the console for 404s — several images have Hebrew filenames and spaces; verify they still resolve after any path change).
- [ ] Keyboard-only pass on `index.html`: Tab reaches every control in a sensible order, focus is always visible, the mobile menu opens/closes/traps correctly, the skip link works.
- [ ] Heading outline is `h1 → h2 → h3` with no skipped levels.
- [ ] Contrast: `--text-muted` on `--bg` ≥ 4.5:1, `--text-faint` used only for non-essential metadata at ≥ 3:1.
- [ ] `prefers-reduced-motion: reduce` set in devtools → nothing moves, everything is visible.
- [ ] JS disabled → all content is visible and all links work. Only the mobile menu and form submission degrade.
- [ ] No console errors or warnings on any page.
- [ ] `index.html` no longer loads Bootstrap. (Out-of-scope demo pages still may — that is correct.)

### 6.4 Commits
One commit per phase, on a branch — do not commit to `main` directly:
```
git switch -c redesign/2026
```
Suggested messages: `design: add token system and base stylesheet` · `feat(nav): accessible sticky header` · `feat(hero): rebuild hero section` · `feat(work): project index` · `feat(contact): working accessible form` · `refactor(pages): apply shell to 9 project pages` · `chore: remove bootstrap and dead css`.

---

## 7. Libraries — verdict

**Add nothing. Remove Bootstrap from `index.html`.**

| Considered | Verdict |
|---|---|
| Bootstrap 5.3 (currently on index) | **Remove.** Used only for a 3-column grid and 3 cards; the JS bundle is entirely unused (0 `data-bs-*` attributes). ~310 KB of blocking CSS+JS replaced by ~15 lines of CSS Grid. Also the direct cause of the "generic template" look the brief rejects. |
| GSAP / Framer / Motion One | **No.** Every animation in this plan is `transform` + `opacity` with `transition` or a short `@keyframes`. A tween engine buys nothing here and costs 25–70 KB. |
| AOS / ScrollReveal | **No.** `IntersectionObserver` is ~15 lines, is native, and handles reduced-motion correctly, which AOS does not by default. |
| Lenis / smooth-scroll libs | **No.** `scroll-behavior: smooth` is native and respects the OS reduced-motion setting. Hijacking scroll momentum breaks accessibility and feels worse on trackpads. |
| An icon library | **No.** Five social icons already exist as SVG files in `images/`. Inline them. |
| Google Fonts (2 families) | **Yes.** The only external dependency. Two families, five faces total, `display=swap`, with `preconnect`. Optional follow-up: self-host the woff2 files in `fonts/` to drop the third-party connection entirely — note it, do not do it in this pass. |

Net effect: `index.html` goes from ~310 KB of framework payload to one stylesheet, one small script, and two font families.

---

## 8. Hard rules

1. **Vanilla only.** No framework, no build step, no `package.json`.
2. **Nothing is deleted from the site's content.** All 9 projects, all 11 technologies, all 5 social links, the CV download, and every "See project" / "Download Project" link survive the redesign.
3. **Do not restyle the out-of-scope demo pages** (§0). They are the portfolio.
4. **Invent no facts** about the owner (§1.6). Placeholder + `TODO(arad)` + report it.
5. **Never trade accessibility for aesthetics.** If a design choice fails contrast or keyboard access, change the design.
6. Report honestly: if something is unfinished, broken, or you skipped it, say so plainly with the reason.

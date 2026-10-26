# Abdul Gaffar — Portfolio

An immersive personal portfolio built around one idea: **SIGNAL / SYSTEMS** — turning an idea into a working system. It has a real-time 3D "Signal Core", a scroll-driven horizontal gallery of selected work, case studies for each project, and a contact flow that never pretends a message was sent when it wasn't.

**Stack:** React 19 · TypeScript · Vite 8 · GSAP + ScrollTrigger · Lenis · three.js + React Three Fiber · React Router · Lucide icons · self-hosted Cinzel / Cormorant Garamond / Inter / Courier Prime.

**Look:** old-money palette (soot black, parchment ivory, antique gold, heritage green, ember), engraved display capitals, Garamond italics, typewriter labels, a gilded 3D core, film grain, a vignette and software icons drifting in the background. Colour tokens live in `src/styles/tokens.css`.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # serve dist/ at http://localhost:4173
```

Requires Node 20.19+ (developed on Node 24).

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | `tsc -b` then `vite build` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` / `npm run lint` | TypeScript and ESLint |
| `npm run qa` | End-to-end checks against the production build (see [QA](#qa)) |
| `npm run images` | Regenerate portrait sizes (original + background-removed cutout) and favicons |
| `python scripts/cutout-portrait.py` | Re-create `assets-src/portrait-cutout.png` from `assets-src/portrait.png` (Pillow, NumPy, SciPy). Run `npm run images` afterwards. The coordinates at the top of the script are specific to the current photo: adjust or replace them for a new one. |
| `npm run screenshots` | Re-capture live-site screenshots for the case studies |
| `npm run og` | Re-render the social preview image from the hero (`npm run build` first, and again after) |
| `npm run admin:credentials -- you@example.com` | Create or change the admin-panel login (see [Admin panel](#admin-panel-admin)) |

The `qa`, `screenshots` and `og` scripts drive an installed **Microsoft Edge** through `playwright-core` (no browser download). Set `BROWSER_CHANNEL=chrome` to use Chrome instead.

---

## Configuration checklist (before deploying)

Everything personal lives in **`src/data/profile.ts`**. Anything left `null` is hidden, so no dead links are rendered, but some features stay off until it's filled in.

| # | What | Where | Effect when missing |
| --- | --- | --- | --- |
| 1 | **Public email address** | `profile.email` | No email action or copy button. The contact form is hidden unless #5 is set. |
| 2 | **LinkedIn, GitHub, LeetCode URLs** | `profile.social[].href` | The links are not shown. |
| 3 | **Resume PDF** | Add `public/resume.pdf` | No download button. It's detected at build time, so rebuild (or restart `npm run dev`) after adding it. |
| 4 | **Production URL** | `VITE_SITE_URL` in `.env.local` or your host's env settings | No canonical URL, no absolute Open Graph URLs, no `sitemap.xml` (the build prints a warning). |
| 5 | **Form endpoint** (optional) | `VITE_CONTACT_ENDPOINT` | The form falls back to opening the visitor's email app (needs #1). |
| 6 | **SmartAutoFlex website** (optional) | `profile.smartAutoFlexUrl` | "Explore SmartAutoFlex" opens the SmartAutoFlex case study instead. |
| 7 | **DataFusion demo** | `src/data/projects.ts` → DataFusion `links[0].verified` | `https://datafusiondemo.netlify.app/` returned **Netlify 404 (site not found) on 25 Oct 2026**, so it's hidden. Set `verified: true` once it's live again. |
| 8 | **CGPA** | `profile.education.cgpa` | Shown as 8.05 / 10. Confirm it against your latest record, or set it to `null` to hide it. |
| 9 | **Your role on each project** | `contribution`, `role` and `lessons` in `projects.ts` | Written from features verified on the live sites. Check that they describe what *you* did. |
| 10 | **Availability line** (optional) | `profile.availability` | Not shown. Only set it if you'll keep it accurate. |

In development, dashed yellow "Dev note" boxes in the contact section list what's still missing. They never appear in production builds.

`.env.example` documents the environment variables.

### Contact form behaviour

- **`VITE_CONTACT_ENDPOINT` set:** sends a JSON `POST` (`name`, `email`, `topic`, `message`) to any service that accepts one (Formspree, Getform, your own function). Success is shown **only on a 2xx response**; failures show an honest error.
- **Only `email` set:** "Compose email" opens the visitor's email app with the message pre-filled, and the page says so rather than claiming it was sent.
- **Neither set:** the form is hidden and only the configured channels are shown.

All modes include validation, labelled fields, `aria-invalid` and linked error messages, focus on the first invalid field, and a hidden honeypot field.

---

## Admin panel (`/admin`)

A private page for changing the site without editing code. Changes go live as soon as they are saved, with no rebuild.

| Tab | What it changes |
| --- | --- |
| **Work** | Which projects are shown, and their order. Hidden projects disappear from the gallery, case files, stack section and journey links, and their case-study URL shows the 404 page. At least one project must stay visible. |
| **Links** | Profile links (LinkedIn, GitHub, LeetCode, Instagram, or any other `https://` URL) shown in the navigation, contact section and footer. |
| **Resume** | Upload a new PDF (up to 4 MB), or go back to the bundled `public/resume.pdf`. |

**How it works.** Two Netlify Functions (`netlify/functions/`) store the settings and the uploaded PDF in **Netlify Blobs**. On load, the site reads `GET /api/settings` (waiting at most 1.5 s) and applies it over the defaults in `src/data/`. If the request fails, the defaults are used. The defaults in `profile.ts` and `projects.ts` still matter: they are the starting point, and "Restore defaults" returns to them. The sitemap, JSON-LD and the `<noscript>` list are generated at build time from those defaults.

**Security.** The browser never receives the login details. The email and an **scrypt hash** of the password are stored as server-side environment variables. A successful login sets a signed, `HttpOnly`, `SameSite=Strict` session cookie that lasts 8 hours. Cross-origin writes are refused, and after 5 failed logins an IP address is locked out for 15 minutes. Changing the password signs out every session. `/admin` is `noindex` and listed under `Disallow` in robots.txt.

### Set up the login

```bash
npm run admin:credentials -- you@example.com   # prompts for the password (hidden)
```

This writes `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` to `.env` (gitignored) and prints them. **Add the same three values in Netlify → Site configuration → Environment variables** (they must be available to Functions). Run the command again to change the password.

### Local development

`npm run dev` runs the functions and a local Blobs store through `@netlify/vite-plugin`, so `/admin` works at http://localhost:5173/admin. Local data lives in `.netlify/` (gitignored) and is separate from production. `npm run preview` has no functions: the site falls back to the defaults, and the admin page reports that its API is unavailable.

### Hosting

The admin panel needs **Netlify** (Functions + Blobs). On Vercel or another static host the public site still works with the defaults, but `/admin` cannot save.

---

## Content accuracy

This portfolio deliberately avoids invented claims: no fake metrics, clients, awards, employment or launched-product status.

- **Rizan Jewellery** and **VKT Shopping Centre**: features and technology were verified against the live sites (October 2026), and the screenshots are real captures. The VKT shop page was **not** captured because it currently lists placeholder test products.
- **FormLaw**, **SmartAutoFlex**, **BusJao**, certifications and education: taken from your resume (`public/resume.pdf`, October 2026). FormLaw's link (`formlaw.vercel.app`) returned Vercel `DEPLOYMENT_NOT_FOUND` on 25 Oct 2026, so it's hidden (`verified: false`) until redeployed.
- **DataFusion**, **AI Ticketing Assistant**: described only from the scope you supplied. Statuses read *Demo project*, *Prototype* and *Founder initiative · early stage*, and SmartAutoFlex ideas are labelled *Concept*, *Exploring* or *Direction*.
- All project covers are **original illustrations**, labelled "Original artwork", never mock screenshots.
- Skill → project links in the Stack section (`src/data/skills.ts`) exist only where the connection is verifiable.
- The optional *Blockchain + AI firewall* project isn't included because no verifiable material was available. Add it to `projects.ts` when it is, with a clear status.

---

## Project structure

```
src/
  data/            ← all content: profile, projects, skills, narrative copy, navigation, site meta,
                   settings (admin-panel schema + validation)
  admin/           AdminPage (/admin, lazy-loaded) and its API client
  pages/           HomePage, ProjectPage (/work/:slug), NotFoundPage
  sections/        Intro, Hero, About, EngineeringPhilosophy, Capabilities, FounderSection,
                   Journey, CaseFiles, Contact, Closing
  components/
    layout/        Navigation (+ mobile menu), SectionProgress, Footer, Backdrop
    motion/        AnimatedText, Magnetic, Cursor
    scene/         SignalCore (R3F), HeroScene (lazy loader + fallback), SceneFallback (SVG)
    projects/      ProjectGallery (horizontal work), ProjectCard, ProjectDetail, ProjectCover + covers/
  hooks/           media queries, reduced motion, reveals, pointer tilt, document meta…
  lib/             gsap (registration + motion tokens), animations, scroll (Lenis), loading,
                   sections, device (WebGL checks), contact, clipboard
  styles/          tokens.css (design tokens), globals.css
netlify/           functions/ (admin + public settings API), lib/ (auth, Blobs storage)
scripts/           admin-credentials.mjs, qa.mjs, capture-project-screenshots.mjs, render-og-image.mjs, optimize-images.mjs
assets-src/        original portrait (source for `npm run images`)
public/            favicons, manifest, og-image.jpg, images/portrait, images/projects
```

### Adding or editing a project

1. Add an entry to `src/data/projects.ts` (the `Project` type in `src/data/types.ts` documents every field). Optional sections (visual direction, screenshots) are left out automatically, and section numbers close up.
2. Pick a `cover` key, or add a new cover component in `src/components/projects/covers/` and register it in `ProjectCover.tsx`.
3. The gallery, case files, routes and sitemap pick it up automatically. The `<noscript>` project list in `index.html` is maintained by hand.

---

## Motion, 3D and performance

- **One animation system.** GSAP handles timelines and ScrollTrigger choreography; CSS handles micro-interactions. Everything is created inside `useGSAP`, so it's reverted on unmount or route change. Motion tokens live in `src/lib/gsap.ts` and `tokens.css`.
- **Lenis** smooth scrolling runs only on fine pointers with motion allowed, synced to GSAP's ticker. Touch devices keep native scrolling.
- **Cinematic vs native.** The pinned horizontal gallery and the pinned system map run only on desktop with a mouse and motion allowed (`CINEMATIC` in `lib/gsap.ts`). Touch, tablet and reduced-motion users get a native scroll-snap carousel and a vertical system map. Neither mode traps scrolling.
- **Reveals animate `opacity`, never `visibility`**, so content that hasn't animated in yet stays in the tab order and the accessibility tree.
- **Signal Core**: procedural geometry only (no model or HDR downloads), with a PMREM environment built from a few emissive panels. It loads as a separate chunk after the page renders, caps the pixel ratio, drops resolution if the first second of frames is slow, pauses when off-screen or when the tab is hidden, and renders a single static frame under reduced motion.
- **Static fallback**: an SVG core (`SceneFallback`) shows while the 3D loads, and permanently when WebGL is unavailable, software-rendered (`failIfMajorPerformanceCaveat`), lost, or Save-Data is on.
- **Intro**: the counter follows real milestones (DOM, fonts, app mount, first 3D frame). It never waits more than about 1 s for 3D, has a 3 s hard cap, is shortened for repeat visits in the same session and under reduced motion, and the static boot screen in `index.html` fades out on its own if JavaScript fails.

### Dependency notes

- **three is pinned to `0.182.x`.** three r183+ deprecates `THREE.Clock`, which React Three Fiber 9.8 still uses, so every page load would print a console warning. Lift the pin once R3F moves to `THREE.Timer`.
- **TypeScript 6.0** rather than 7: `typescript-eslint` supports TypeScript < 6.1.

---

## Accessibility

Semantic landmarks and one `h1` per page; a skip link; visible focus outlines; a keyboard-reachable gallery (focusing a card scrolls it into view); a mobile menu with focus trap and Escape to close; labelled form fields with linked errors; alt text on every meaningful image (decorative artwork is `aria-hidden`); `prefers-reduced-motion` respected throughout; the custom cursor only on fine pointers, with the native cursor kept in text fields.

---

## SEO and sharing

Built from `src/data/site.ts` and `profile.ts` by a small plugin in `vite.config.ts`: `<title>`, description, Open Graph, Twitter card, theme colour, Person JSON-LD, and `robots.txt`. With `VITE_SITE_URL` it also adds canonical and absolute OG URLs and generates `sitemap.xml` (home plus every case study). Each route sets its own document title and description.

---

## Deployment

It's a single-page app, so unknown paths must serve `index.html` (direct visits to `/work/datafusion` depend on it).

- **Netlify:** `netlify.toml` is included (build command, publish dir, SPA redirect, asset caching).
- **Vercel:** `vercel.json` is included (rewrites and caching). Framework preset: Vite. The admin panel does not work on Vercel (see [Admin panel](#admin-panel-admin)).
- **Other static hosts:** publish `dist/` and configure an SPA fallback to `/index.html`.

Set `VITE_SITE_URL` (and optionally `VITE_CONTACT_ENDPOINT`) in the host's environment variables, plus the three `ADMIN_*` variables for the admin panel.

---

## QA

```bash
npm run build && npm run qa
```

This starts a preview server and runs 73 checks in Edge:
- every route renders with one `h1` and no console or network errors
- no horizontal overflow at 1440, 1280, 820, 390 and 320 px
- nav links scroll to and highlight their sections
- the desktop gallery moves with the wheel, `Next` works, and scrolling continues past it
- the mobile carousel responds to buttons and real touch swipes, and vertical swipes still scroll the page
- the mobile menu works, including Escape
- keyboard: skip link, focusing a gallery link, Enter to open, visible focus
- Back restores the home scroll position
- reduced motion leaves all content visible
- the WebGL fallback works
- links are real and external links are safe
- metadata is present

Screenshots and `results.json` are written to `qa-report/`.

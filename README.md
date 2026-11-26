# Progress

A phone-friendly fitness tracker: weekly workout plan with set logging, lift progress charts, body-weight log, progress photos and a before/after compare slider.

It is an installable web app (PWA). It works offline, and all data stays on the phone in the browser's storage. Nothing is uploaded.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The whole app (layout, styles and code) |
| `manifest.webmanifest` | App name, colours and icons used when installing |
| `sw.js` | Service worker that lets the app open without internet |
| `icons/` | Home-screen icons |

## Put it online (GitHub Pages, free)

1. On GitHub, open this repository → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
3. Pick the branch with these files (e.g. `main`) and the `/ (root)` folder, then **Save**.
4. After a minute the page shows your link, like `https://<your-username>.github.io/First-project-/`.

## Install it on your phone

- **iPhone (Safari):** open the link → tap **Share** → **Add to Home Screen**.
- **Android (Chrome):** open the link → tap **⋮** → **Install app** (or **Add to Home screen**).

It then opens full screen like a normal app, with its own icon.

## Updating the app

After changing any file, bump `VERSION` in `sw.js` (e.g. `progress-v2`) so phones download the new version.

> Data is stored per phone and per browser. Deleting the home-screen app or clearing Safari/Chrome website data erases it.

# Physiq — Project Handover

Nov 27, 2026

## Overview

Physiq is a phone-first fitness tracker. It is live at [ahmedwarwar8-oss.github.io/First-project-](https://ahmedwarwar8-oss.github.io/First-project-/) and installed on the owner's iPhone from Safari.

- **What it does:** logs workouts set by set, charts lift progress, tracks body weight, water intake and progress photos, and compares two photos side by side.
- **Who it is for:** one person training on a weekly split, in 12-week mesocycles with a deload week between them.
- **How it runs:** an installable web app (PWA) in a single HTML file. It works offline, and all data stays on the phone. There is no server, account or login.
- **Status:** working and in daily use. It started as a Claude artifact named "Progress Slider" and was turned into this app on 26–27 Nov 2026.

## Where everything lives

All code is in one GitHub repository and is served from one branch. There is no `main` branch with the app on it yet.

| What | Where | Notes |
| --- | --- | --- |
| Live app | [ahmedwarwar8-oss.github.io/First-project-](https://ahmedwarwar8-oss.github.io/First-project-/) | GitHub Pages, free tier |
| Code repository | [github.com/ahmedwarwar8-oss/First-project-](https://github.com/ahmedwarwar8-oss/First-project-) | Must stay **public** for free GitHub Pages |
| Working branch | `claude/beautiful-sagan-jrgtu9` | Pages deploys from this branch, `/ (root)` folder |
| Pages settings | [Settings → Pages](https://github.com/ahmedwarwar8-oss/First-project-/settings/pages) | Use "Request Desktop Website" in Safari to see this page |
| Original prototype | [Progress Slider artifact](https://claude.ai/artifact/9EKPpbuvzfsxd97aSzU2sT) | Old version, not updated; kept for reference |
| User data | The owner's iPhone only | Browser storage (IndexedDB) of the installed app |

## Features

The app has five tabs along the bottom, plus Settings, which opens from the gear on Home. The Physiq logo and name sit in the top-left corner on every page. All units are metric (kg, litres).

| Screen | What it does |
| --- | --- |
| Home | Greeting with today's date; today's workout with a Start or Continue button; water card; this week's sessions as day circles; stat cards for body weight, workouts done, photos and lifts tracked. The gear (Settings) shows only here. |
| Water card (on Home) | Daily intake in litres with a progress bar. Buttons: +600 ml, +1 L, and Undo (removes the last amount added). A Set goal button sets the daily goal in litres (0.25–10 L, default 3 L). Resets at local midnight. |
| Workouts | Week and day picker, labelled "Week N of 12" and "Mesocycle N". Each exercise shows sets, reps, RIR, tempo and rest, and has weight (kg) and reps boxes per set. Shows "Last time" from the previous training week. Running total of sets and volume. |
| Swap exercise | Searchable exercise library grouped by muscle, or type your own. Pinned header with a Back button. A swap applies from the current week onwards; earlier weeks keep their history. Reset to program undoes it from that week on. |
| + Set / − Set | Changes the number of sets for an exercise from the current week onwards. Hidden during deload weeks. |
| Mesocycles | 12 training weeks, then a deload week. Going past week 12 prompts the deload (half the sets, about 50–60% weight, RIR 4–5). After the deload, the next mesocycle offers "Set up a new plan" or "Keep my current plan". Each mesocycle keeps the plan it used. |
| Progress | Pick an exercise to see a chart and table of average volume per set (kg × reps) by week. Deload weeks are left out. |
| Weight | Log body weight by date, with a chart and a list showing the change between entries. |
| Photos | Gallery with + Add photos (resized to 1600 px JPEG). Tap a photo to edit its label and date or delete it. Select to compare: pick two photos, then Compare selected opens a before/after slider (older on the left), with Swap sides and Pick other photos. |
| Settings | Water goal, Set up your week, Edit exercises, Backup & restore, and a note that all data stays on the device. |
| First launch | A new user sees "Welcome to Physiq" with Set up my plan (two steps: training days, then exercises) or Use the default plan. |
| Backup & restore | Back up saves everything (photos included) to a `physiq-backup-YYYY-MM-DD.json` file through the iPhone share sheet (Save to Files). Restore loads a backup after a confirmation and replaces all current data. Shows when the last backup was made. |

## How it works

The whole app is one HTML file with plain JavaScript and CSS: no framework, no build step, no external libraries. A service worker caches it for offline use, and all data lives in the browser's IndexedDB on the phone.

**Files in the repository**

| File | Purpose |
| --- | --- |
| `index.html` | The entire app: layout, styles and code |
| `sw.js` | Service worker. Network first, falls back to cache when offline. Holds `VERSION` (now `progress-v34`) |
| `manifest.webmanifest` | App name (Physiq), colours (accent `#e8412c`), icons, standalone display |
| `icons/` | Home-screen icons: 180 px Apple icon, 192 and 512 px, and a 512 px maskable icon |
| `README.md` | Setup, hosting and install instructions |
| `HANDOVER.md` | This document |

**Data storage.** IndexedDB database `progress-photos` (the name is kept from the prototype so existing data still loads). It has two stores:

- `p` holds photos: `{id, date, label, data}`, where `data` is a JPEG data URL.
- `w` holds everything else as `{k, ...}` records, keyed by `k`.

| Key pattern | Holds |
| --- | --- |
| `<week>\|<day>\|<slot>` | Logged sets for one exercise in one week, e.g. `5\|TUE\|A1` |
| `sub\|<day>\|<slot>` | Exercise swap history: `h: [{w, v}]`, where week `w` onwards uses name `v` (`null` = back to program) |
| `sets\|<day>\|<slot>` | Set-count history in the same `h` format |
| `_hist\|<meso>` | Snapshot of the plan a past mesocycle used |
| `_plan`, `_sched` | Current exercises per session, and which session falls on which weekday |
| `_meta` | Current running week number |
| `bw\|<date>` | Body-weight entry in kg |
| `water\|<date>`, `_water` | Day's water total plus a list of additions (for Undo); the daily goal in ml |
| `_onb`, `_backup` | First-launch done flag; time of the last backup |

**Weeks and mesocycles.** The week is a single running counter. A mesocycle is 12 training weeks only; the deload week sits between mesocycles and is not counted as part of one. Internally the counter runs in 13-week cycles (12 training + 1 deload). Swaps and set changes are stored with the week they start from, so they carry forward without rewriting earlier weeks.

## Making and shipping changes

Every change follows the same five steps, and the version bump in step 2 is what makes phones pick it up.

1. Edit `index.html` (and any other file that needs it).
2. Bump `VERSION` in `sw.js`, e.g. `progress-v23` to `progress-v24`. Skipping this can leave phones on the old cached copy.
3. Commit with a clear message and push to `claude/beautiful-sagan-jrgtu9`.
4. Wait 1–2 minutes for GitHub Pages to publish.
5. On the phone, close the app fully, then reopen it once or twice. The first open downloads the update and the next one shows it.

**Keep these unchanged unless you plan a data migration:** the database name `progress-photos`, the store names `p` and `w`, and the key formats above. Changing them makes existing data look empty.

**Installing on a new phone:** open the live link in Safari, tap Share, then Add to Home Screen. To move data, back up on the old phone and restore on the new one.

**Before deleting the home-screen app:** back up first. On iPhone, deleting the app also deletes all its data.

## Change history

The app went through 23 updates over two days, from the original artifact to Physiq. Each row is one commit on the working branch, newest first.

| Date (2026) | Change |
| --- | --- |
| 27 Nov | First-time plan setup, and a new plan offered at each mesocycle |
| 27 Nov | 12-week mesocycles with a deload week |
| 27 Nov | Backup and restore in Settings |
| 27 Nov | Workout swaps and set changes carry forward from the week they are made |
| 27 Nov | Renamed to Physiq, with a logo and new app icons |
| 27 Nov | Settings button shown only on Home |
| 26 Nov | Photos: Compare switcher removed; Select to compare is the only way to compare |
| 26 Nov | Gallery: select two photos and compare them |
| 26 Nov | Fixed the Date and Weight boxes overlapping on iPhone |
| 26 Nov | Water tracker: 600 ml and 1 L buttons, Undo of the last add, goal set on Home |
| 26 Nov | Daily water tracker added to Home |
| 26 Nov | All emojis removed; line icons in the bottom bar and settings |
| 26 Nov | Back button at the top of the Swap and Add exercise screens |
| 26 Nov | "Everything stays on this device only" moved into Settings; header subtitle removed |
| 26 Nov | Header title changed to "Consistency is key" (later replaced by Physiq) |
| 26 Nov | Photos and Compare merged into one tab |
| 26 Nov | Profile section (name, age, height, gender) removed from Settings |
| 26 Nov | Week setup moved from Home into Settings |
| 26 Nov | Metric only: kg/lb switches removed |
| 26 Nov | Artifact turned into an installable phone web app: manifest, icons, offline support |

## Limitations and risks

The biggest risk is data loss: everything lives on one phone, and the only copy elsewhere is a backup file the owner saves by hand.

- **Data loss.** Deleting the home-screen app, clearing Safari website data or losing the phone erases all data. Regular backups to iCloud Drive are the only protection.
- **Not tested in a browser.** During the build, every change was checked for code errors, and the week and mesocycle logic was unit-tested on its own. No change was run in a browser here, because local servers were blocked. Real-phone testing has been done by the owner only. The newest features have not been tried yet: mesocycles, deload, new-plan setup, backup and restore, and the first-launch welcome.
- **Old home-screen icon.** The installed app may still show the old "Progress" icon and name. Reinstalling fixes it, but back up first.
- **Public code.** The repository is public so that free GitHub Pages works. The code is visible to anyone; personal data is not, because it never leaves the phone.
- **Working branch only.** The live site deploys from a `claude/...` branch, not `main`.
- **Plan edits are global within a mesocycle.** Editing exercises in Settings changes the current plan for every week of the live mesocycle, including weeks already done. Past mesocycles are protected by their snapshot. Swaps carry forward properly.
- **Backup size.** Backups include photos as images, so files grow by roughly 0.2–0.5 MB per photo.
- **Deload is fixed.** It always comes after week 12 and always halves the sets. The deload prompt can be postponed ("Stay on week 12") but not skipped.

## Next steps

The first three protect the data and the live site; the rest are optional improvements.

- [ ] Make a backup now, save it to iCloud Drive, and repeat weekly
- [ ] Test the newest features on the phone: backup and restore, the deload prompt, new-plan setup
- [ ] Reinstall the app to get the Physiq icon (back up first, then restore)
- [ ] Merge the working branch into `main` and point GitHub Pages at `main`
- [ ] Optional: weekly water intake chart (requested, then put on hold)
- [ ] Optional: backup reminder on Home if the last backup is more than 7 days old

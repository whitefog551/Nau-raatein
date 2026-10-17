# Nau Raatein, Ek Pyaari Si Dua

A self-contained static-site project (HTML/CSS/JS) for Laxmi Jii.

## Chapters / screens
1. Welcome cover
2. Rangoli, diya and Maa Durga
3. Nine Nights overview
4–12. Nine separate daily pages (one per Navadurga day)
13. Personal suggestion page
14. Portrait pencil-sketch animation
15. Colour reveal and replay controls
16. Envelope and final letter
17. Vijayadashami / extra surprise

Navigation is chapter-based, not a single long scrolling page. Use the on-screen buttons to move between chapters.

## Dates
Configured for Sharad Navratri 2026: 11–19 October, with Vijayadashami on 20 October. As of 17 October 2026, the date-based unlock should show days 1–7 available; day 8 opens 18 October at midnight IST, and day 9 opens 19 October at midnight IST. The portrait and finale are configured to open after all nine days.

## Files
- `index.html`: page shell
- `css/styles.css`: visual styling and responsive layouts
- `js/content.js`: all text and date configuration
- `js/unlock.js`: date-based unlocking in Asia/Kolkata
- `js/app.js`: chapter routing and interactions
- `js/portrait.js`: pencil sketch and colour reveal
- `js/petals.js`: decorative petal effects
- `js/music.js`: optional music toggle
- `assets/img/portrait-sketch.jpg`: sketch portrait
- `assets/img/portrait-colour.jpg`: colour portrait
- `assets/audio/navratri-ambient.wav`: optional ambient audio

## Preview all chapters
For testing, use the separate `nau-raatein-preview.html` file, which has the date gates disabled for preview. Do not send that preview file as the final surprise if you want the day-by-day locks.

## Deploy
Upload the contents of this folder to the root of a static hosting project such as GitHub Pages. Keep the `css`, `js`, and `assets` folders in their relative locations.

## Important limitation
Unlocking is client-side and uses the visitor's device clock; it is a gentle surprise lock, not a secure access-control system. Static hosting does not publish new content automatically; changes to content require updating and redeploying the files.

## Final check
The package includes all local image/audio assets. Test the full flow on the target Android phone before sharing; browser and device behaviour can vary.

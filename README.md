# Shubh Vivah: Wedding Invitation Website (final)

Painted Ganga storybook with the cartoon couple, a 3D mandap on the save-the-date scene, sun and moon.

## 1. Fill in your details: `wedding.json`
Everything you can change is in **one file: `wedding.json`**. Open it in any text editor (TextEdit works; VS Code is nicer) and replace the example text.

- Keep the `"quotes"`, `,` commas and `[ ] { }` brackets exactly as they are. Only change the words inside the quotes.
- Lines that start with `"_"` (like `"_4": "==== EVENTS ===="`) are notes for you. The website ignores them.
- If the site stops loading after an edit, paste the file into **https://jsonlint.com**. It points to the line with the missing comma or quote.

What's in it, top to bottom:

| Section | What you set |
|---|---|
| The couple | names (English + Hindi), full names, parents, home towns |
| Date & place | wedding date and time (drives the countdown), date text, city, hashtag |
| Invitation wording | mantra, shloka, blessings (grandparents), invite and closing lines |
| Events | every function: date, time, venue, address, Google Maps link, dress colour, groom/bride side |
| Things to know | weather, stay, travel, parking and similar notes |
| Families | each family's kids' line, "With best compliments from" names, and sender's address and phone numbers |
| **Music** | `"music": "assets/music/song.mp3"` is the path to your song |
| Website words | headings and buttons (rarely needed) |

## 2. Add your song (and optional event photos)
- Event photos (optional) → `assets/images/`, named as in each event's `image` (for example `event-tilak.jpg`).
- Song → `assets/music/` (for example `song.mp3`), then set `"music"` to `"assets/music/song.mp3"`. Use `""` for no music.
- Keep file names simple: no spaces, lowercase.

## 3. Preview on your Mac
Double-click **`preview.command`**. It opens the invitation in your browser. Edit `wedding.json`, save, and refresh to see the change.
(The first time, macOS may say it's from an unidentified developer: right-click the file → **Open** → **Open**.)

Double-clicking `index.html` directly also works: the browser will ask you to pick `wedding.json` (browsers don't let a page read files on its own).

## 4. Put it online and share
Upload the whole folder to any free static host, for example **Netlify Drop** (drag the folder onto app.netlify.com/drop), GitHub Pages, or Cloudflare Pages. Then share the link.

Handy link endings (they can be combined with `&`):
- `?guest=Sharma-Family` greets them by name on the first screen
- `?side=groom` / `?side=bride` shows only that side's events

## 5. WhatsApp preview
The title and picture that show when you paste the link in WhatsApp are at the top of `index.html` (`og:title`, `og:description`, `og:image`). Link crawlers don't read `wedding.json`, so change the names there too, and add a 1200×630 picture as `assets/images/share-cover.jpg`.

## Files
- `wedding.json`: **your details (edit this)**
- `index.html`, `css/style.css`, `js/*.js`: the website itself (no need to touch)
- `assets/images`, `assets/music`: your photos and song
- `preview.command`: local preview on Mac

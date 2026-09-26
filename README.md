# Daybreak Command Centre

Project Name: daybreak

Build a personal command centre web application called daybreak in a vintage Y2K desktop OS aesthetic based on the attached fashion website design.
Font: @import url('https://fonts.cdnfonts.com/css/bit-cell'); font-family: 'Bit Cell', sans-serif;

Design & architectural constraints:
- No cards
- No toast notifications
- No em dashes
- No dashboards
- Aesthetic: Pastel Cyber Y2K with soft pink/lilac gradient wallpaper, chrome beveled window bars, pixel art icons, and retro drop shadows.
- Built-in Display Properties window accessible from desktop to switch between vintage wallpapers (Pastel Cyber, Retro Tech Grid, Vintage Lavender, Pixel Clouds).
- Bottom Windows 98 style taskbar featuring active window buttons, sound mute toggle, and system tray.
- Tray clock formatted in 12-hour AM/PM time with date tooltip.
- Pinned desktop homescreen widget featuring a large retro 12-hour digital clock.
- Start button functions as a spotlight-style quick launcher and search menu. No Shut Down option.
- Double-click desktop icons to launch windows; single click selects.
- Windows 98 balloon tooltips and retro beveled modal dialogs for all system feedback (zero modern toasts).
- Recycle Bin on desktop with a retro crush/compact animation when items are deleted.
- Authentic retro sound effects (mechanical clicks, window swooshes, crumple sound) with an instant mute toggle in the system tray.
- Responsive mobile mode: switches to Pocket OS layout with full-screen retro windows and bottom tab navigation.

Authentication & Backend Setup:
- Implement authentication and cloud backend first.
- The sign in module must also be an "app" window with the exact vintage Y2K OS aesthetic (retro login dialog box with pixel inputs and classic beveled buttons).
- Ensure auth works properly with redirect URLs configured for localhost, daybreak.thekzbn.name.ng, and Vercel preview/production domains.
- Persist all user data (tasks, notes, stickies, budget logs, reading shelf) scoped per authenticated user in the cloud database.

Core Feature Windows:

1. Daily 3 Focus:
- Recommends 3 primary items for the day while allowing extra tasks if needed.
- Supports single active focus with a ticking timer, side-by-side checklist, and strict priority locking.
- Pixel victory modal dialog with 8-bit confetti animation and victory chime upon completing all three recommended items.

2. One Build in Progress:
- Kept on hold for now.

3. Build Focus Timer (Winamp Skin):
- Repurposed authentic Winamp player skin acting as the primary work timer.
- Dual mode: count-up stopwatch and 25/50 minute Pomodoro countdown blocks.
- Animated multi-band dancing LED spectrum analyzer and glowing green digital LED counter.
- Tactile retro controls for play, pause, and reset.

4. Quick Scratch Note (Notepad):
- Authentic Notepad window with pure plain text, Bit Cell font, character count in status bar, and word wrap (no line numbers).
- Ability to tear off pastel sticky notes and pin them freely across the desktop wallpaper.

5. Reading Queue (Wooden Bookshelf):
- Strict capped queue (maximum 5 items) displayed as a literal wooden bookshelf with pixel-art book spines.
- Clicking any empty wooden slot opens a prompt to place a new book with title, URL, and spine color.
- Clicking an existing book spine pulls it forward to display reading progress and open the link.

6. Midnight Archive & Clean Slate:
- Automatically archives the day at midnight so each morning starts clean.
- Monthly calendar logbook window where clicking any past date reveals that day's completed tasks, total focus time, notes, and spend log.
- Desktop 3.5-inch floppy disk icon to export and download the complete daily logbook as a clean text file.

7. Budgeting Ledger (Dual-Pane):
- Top pane: Daily burn allowance calculated from monthly surplus divided by remaining days, factoring in customizable saving goals and dynamic daily rollover (unspent rolls over, overspend reduces tomorrow).
- Bottom pane: Monthly spending categories with retro pixel icons, preset essential buckets, envelope budget pools, and retro progress fill bars.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/85be506b-c0e8-47c3-9d1c-4f416fb6d5e9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

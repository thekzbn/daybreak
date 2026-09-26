# Daybreak personal command centre

## Goal
Build Daybreak as a usable personal desktop inspired by the supplied fashion-site reference: pastel cyber wallpaper, thin black outlines, compact chrome title bars, pixel icons, beveled controls, and overlapping utility windows. The experience starts with authentication and keeps every person's data private.

## Foundation
- Enable email/password and Google sign-in through Lovable Cloud.
- Create private per-user storage for profiles, preferences, tasks, daily archives, scratch notes, desktop stickies, reading items, spending entries, budget categories, and saving goals.
- Auto-create a profile at signup with display name, avatar, wallpaper, sound setting, and desktop layout preferences.
- Protect all personal records so only their owner can view or change them.
- Use same-origin authentication returns so localhost, the custom domain, Lovable previews, and Vercel deployments work without hardcoded hostnames.
- Include password recovery and a public reset-password screen.

## Desktop experience
- Replace the placeholder with a real draggable desktop, not a dashboard and not a landing page.
- Add single-click selection and double-click launch for pixel-art desktop icons.
- Build reusable Y2K window chrome with focus, z-order, drag, minimize, maximize, close, active taskbar state, and restrained retro shadows.
- Add a Windows 98 style taskbar with Start launcher/search, active window buttons, mute control, and a live 12-hour tray clock with date tooltip.
- Add a pinned large digital clock, Display Properties wallpaper picker, Account app, Recycle Bin, floppy export icon, system balloon messages, and beveled confirmation/prompt dialogs.
- Generate mechanical click, window swoosh, victory, and crumple sounds in-browser, honoring the instant mute preference.
- On small screens, switch to Pocket OS: one full-screen app at a time with bottom tab navigation.

## Apps
- **Daily 3 Focus:** exactly three recommended priorities, optional extra tasks, one locked active focus, checklist, attached timer, completion state, and an 8-bit confetti victory dialog with chime.
- **Winamp Focus Timer:** count-up mode plus 25/50 minute countdown choices, green LED time, animated spectrum, and tactile play/pause/reset controls.
- **Notepad and Stickies:** plain text, Bit Cell font, word wrap, character count, autosave, and tear-off pastel notes positioned on the desktop.
- **Reading Queue:** a literal wooden five-slot shelf, add-book prompt with title/URL/spine color, progress controls, and safe external-link opening.
- **Archive and Clean Slate:** keep records grouped by the user's local calendar day; when the date changes, open a fresh day while previous dates remain in a monthly logbook. Past dates show completed tasks, focus time, notes, and spending.
- **Floppy export:** download the full archive as a clean text file.
- **Budget Ledger:** monthly income, fixed costs, saving goal, envelope categories, expenses, retro fill bars, and daily burn calculation. Daily allowance uses remaining monthly surplus plus accumulated rollover, divided by remaining days; overspending reduces the next day's available amount.
- Leave **One Build in Progress** absent, as requested.

## Visual system
- Load Bit Cell from the supplied CDN through the document head, never through a CSS URL import.
- Use semantic theme tokens for pastel pink, lilac, chrome, ink, teal, amber, wood, and LED green.
- Recreate the reference's airy wallpaper, compact windows, one-pixel borders, sharp labels, and icon-led desktop composition without copying the uploaded image into the app.
- Provide four distinct CSS-built wallpapers: Pastel Cyber, Retro Tech Grid, Vintage Lavender, and Pixel Clouds.
- Use no cards, no toast notifications, no em dashes, and no modern dashboard composition.

## Verification
- Verify account creation, confirmation messaging, sign-in, Google entry point, sign-out, and password recovery behavior.
- Verify private records are isolated between users and authenticated writes record the correct owner.
- Test the full task, timer, note, sticky, shelf, ledger, archive, export, wallpaper, sound, Start menu, taskbar, and recycle interactions.
- Check desktop and mobile layouts for overlap, clipped text, window controls, and working Pocket OS navigation.
- Run the database security checks and confirm the final app has no build or runtime errors.

<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history -- force pushing, or rebasing/amending/squashing commits
> that are already pushed -- as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Daybreak Agent & Contributor Guide

This file is the canonical source of truth for AI agents and human contributors working on the Daybreak Command Centre codebase. Read it in full before making any changes.

---

## Project Architecture

- Daybreak stores all personal records in Lovable Cloud tables protected by per-user RLS (Row-Level Security), because account data must remain strictly private.
- The desktop is a single interactive home route with internal window state, because the product behaves as an operating system rather than a conventional page hierarchy.
- Daily rollover is derived from each record's local date, because opening a new date must not require a fragile background task.

---

## Commit Message Convention

Every commit MUST include two clearly labelled sections:

```
<type>(<scope>): <short summary>

1. What this commit is for:
<Describe the user-visible goal or problem being solved.>

2. What exactly was changed to achieve it:
<List the files and specific modifications made.>
```

---

## Aesthetic & UI Design Rules

These rules apply to every screen, window, and component. They are non-negotiable.

### Core Aesthetic
- **Vintage Pastel Cyber Y2K Desktop OS**: think Windows 95/98 meets Y2K pastel cyber. Soft pink/lilac gradient wallpapers, chrome beveled window bars, retro drop shadows, pixel art everything.
- **Font**: Always and only `W95FA` -- `@import url('https://fonts.cdnfonts.com/css/w95fa'); font-family: 'W95FA', sans-serif;`. Never swap this for another font.

### What is Strictly Forbidden
- **No cards** or card-like UI containers.
- **No modern toast notifications**. Use retro Win98-style beveled dialog boxes or balloon tooltips.
- **No em dashes** (`--`) in text or code comments.
- **No dashboards** or dashboard-style layouts.
- **No emoji** anywhere in the UI, code, or comments. All visual indicators must be pixel art SVG icons or retro text symbols.
- **No smooth/fluid animations** that break the retro feel (e.g. no `cubic-bezier` bouncy springs on dock icons, no backdrop-filter glass blur on windows or dock).
- **No rounded corners** on windows, buttons, tooltips, or dock. `border-radius: 0` everywhere unless explicitly required for a specific pixel art shape.

### What is Required
- **Tactile beveled borders**: `inset 1px 1px 0 #ffffff` (highlight) and `inset -1px -1px 0 #9c968b` (shadow) on all interactive surfaces.
- **Pixel art SVG icons**: All icons must be custom, hand-crafted colored pixel art SVGs. Lucide icons, Heroicons, FontAwesome, or any icon library icons are banned. Emojis as icons are banned.
- **Retro pixel cursors**: Default and pointer cursors must use the `pixelarticons.com` pixel art cursor set.
- **Retro step-function hover states**: Hover effects must be instant or use very short linear transitions -- no spring physics, no scaling pop, no blur.
- **W95FA font at readable sizes**: Minimum 12px for all body text. Labels, titles, and system text must be visually clear at actual pixel-rendered sizes.

### Window Sizing Rules
- **App windows must have fixed dimensions** (explicit `width` AND `height` in CSS). Windows must NOT grow or shrink based on their content.
- The window body must be `overflow: auto` (scroll when needed), never pushing the window frame to expand.
- Each app has a dedicated CSS class `window-<id>` where fixed width and height are declared.
- Default open position of each window must be staggered so windows do not stack on top of one another at launch.

### App Design Standards
- Every app is a standalone desktop application, not a web page widget. Treat it accordingly.
- Internal app padding: `18px 20px` for the `window-body`.
- Sufficient whitespace between interactive elements: minimum `8px` gap between controls.
- Controls must have explicit dimensions. Buttons must never be undersized.
- Scrollable regions inside apps must use `overflow: auto` and never push their parent window to expand.

---

## Icon Rules

- All icons in this project are **custom pixel art SVGs**, designed specifically for Daybreak.
- **No emoji** anywhere -- not as icons, not as decorations, not in tooltips, not in code comments.
- **No third-party icon libraries** (no Lucide, Heroicons, FontAwesome, Bootstrap Icons, etc.).
- Icon colors must follow the Pastel Cyber Y2K palette: soft pinks, cyans, lavenders, warm yellows, sage greens against `#1a1a1a` outlines.
- SVG viewBox should be `0 0 32 32` for desktop icons, `0 0 16 16` for inline/small icons.
- Icon SVGs must use `fill` and `stroke` attributes directly on paths -- no CSS classes injected from external sources.

---

## Data & Backend Rules

- All Supabase queries must include a `user_id` filter matching `auth.uid()` to enforce RLS.
- Never expose or log Supabase service role keys or secret keys. Only the publishable/anon key is permitted client-side.
- Database tables: `tasks`, `reading_queue`, `notes`, `stickies`, `expenses`, `budget_categories`, `budget_settings`, `profiles`.
- Daily rollover logic must be computed from the local date on the client, not from a server cron job.

---

## File Ownership

| File | Purpose |
| :--- | :--- |
| `src/components/daybreak/DaybreakDesktop.tsx` | Core Desktop OS, Window Manager, all app windows |
| `src/styles.css` | All retro theming, window bevels, wallpapers, dock, cursors |
| `src/integrations/supabase/` | Supabase client, auth middleware, type definitions |
| `src/routes/` | TanStack Router route definitions |
| `supabase/migrations/` | SQL schemas and RLS policies |
| `AGENTS.md` | This file. Source of truth for agents and contributors. |

---

## Contact

Maintainer: Ayomide Deji-Adeyale
Portfolio: https://thekzbn.name.ng
Email: thekzbn@proton.me

# Contributing to Daybreak Command Centre

Thank you for your interest in contributing to **Daybreak Command Centre**! We welcome bug fixes, documentation improvements, retro asset additions, and feature enhancements that align with our aesthetic and architectural principles.

> [!IMPORTANT]
> Read this entire section before touching the UI. These rules are non-negotiable. Every PR that violates them will be sent back.

---

## Design and Architectural Principles

### Core Aesthetic

Daybreak is a **vintage Pastel Cyber Y2K Desktop OS**. Think Windows 95/98 crossed with early-2000s pastel internet aesthetics. Every pixel must serve that vision.

- **Font**: `W95FA` always and only. Import: `@import url('https://fonts.cdnfonts.com/css/w95fa'); font-family: 'W95FA', sans-serif;`. Never substitute another font.
- **Pixel cursors**: Default and pointer cursors use the `pixelarticons.com` pixel art cursor set.
- **Minimum font size**: 12px for all body and UI text. Text must be legible at pixel-rendered sizes.

### Strict Prohibitions

The following are banned across the entire codebase, in UI, code, comments, and documentation:

- **No cards** or card-like containers.
- **No modern toast notifications**. Feedback must use retro Win98-style beveled dialog boxes or balloon-style tooltips.
- **No em dashes** (`--` or the Unicode character).
- **No dashboards** or dashboard-style layouts.
- **No emoji** anywhere -- not in UI text, not in icon slots, not in code comments, not in documentation. All visual indicators must be pixel art SVG icons or plain retro text symbols.
- **No third-party icon libraries** (Lucide, Heroicons, FontAwesome, Bootstrap Icons, etc.).
- **No rounded corners** on windows, buttons, tooltips, dock, or any interactive surface. Use `border-radius: 0`.
- **No modern smooth animations** (no `cubic-bezier` spring physics on dock hover, no `backdrop-filter` glass blur on windows or panels).

### Required UI Patterns

- **Tactile beveled borders**: `inset 1px 1px 0 #ffffff` (light edge) and `inset -1px -1px 0 #9c968b` (dark edge) on all interactive surfaces.
- **Retro step-function hover states**: Hover effects must be instant or use very short linear transitions. No bounce, no scale pop, no blur.
- **Pixel art SVG icons**: All icons must be custom, hand-crafted colored pixel art SVGs built specifically for Daybreak. SVG `viewBox` must be `0 0 32 32` for desktop icons and `0 0 16 16` for small/inline icons.

### Window and App Sizing Rules

This is one of the most common sources of bugs. Follow it exactly:

- **App windows must have fixed `width` and `height`** declared in CSS per-app class (`window-<id>`). Windows must NEVER grow or shrink based on their content.
- The `.window-body` must be `overflow: auto` so content scrolls within the fixed frame.
- **Do not use `min-height`, `max-height`, or any height that depends on children** for the outer `.app-window` frame.
- Default open positions of windows must be staggered so windows do not stack identically at launch.

### App Design Standards

Every app is a standalone desktop application, not a web widget. Treat it as such:

- Internal app padding: `18px 20px` on `.window-body`.
- Minimum `8px` gap between interactive elements.
- Buttons must have explicit minimum dimensions. Never let them shrink to just their label.
- Scrollable sections inside apps must use `overflow: auto` within a fixed-height container -- they must not push the window frame outward.

### Data and Backend Rules

- All Supabase queries must include a `user_id` filter matching `auth.uid()` to enforce Row-Level Security.
- Never expose or commit Supabase service role keys or secret keys. Only the publishable/anon key is permitted client-side.

---

## Development Workflow

### 1. Fork & Clone

```bash
git clone https://github.com/your-username/daybreak-command-centre.git
cd daybreak-command-centre
git remote add upstream https://github.com/thekzbn/daybreak-command-centre.git
```

### 2. Create a Feature Branch

Create a branch with a descriptive name:

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Install Dependencies & Start Dev Server

```bash
npm install
npm run dev
```

### 4. Code Style & Formatting

Make sure your code adheres to ESLint and Prettier rules:

```bash
npm run lint
npm run format
```

### 5. Commit Guidelines

We recommend clear commit messages that explain:
1. **What this commit is for**
2. **What exactly was changed to achieve it**

Example:
```
feat(timer): add audible chime on pomodoro interval completion

1. What this commit is for:
Notify the user with a retro chime sound when a 25-minute Pomodoro timer concludes.

2. What was changed to achieve it:
- Added audio trigger in TimerWindow state when seconds reach zero.
- Checked sound mute state before playback.
```

---

## Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch.
3. Fill out the PR template completely (including screenshots or video if UI changes were made).
4. Ensure all CI checks pass.

---

## Community and Questions

If you have questions or want to discuss a new feature before building it, feel free to open a Discussion or an Issue on GitHub.

For direct contact, reach the maintainer at [thekzbn@proton.me](mailto:thekzbn@proton.me) or visit [thekzbn.name.ng](https://thekzbn.name.ng).

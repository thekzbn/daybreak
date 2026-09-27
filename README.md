# Daybreak

> A vintage Pastel Cyber Y2K Personal Command Centre Desktop OS designed for mindful daily productivity.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-1.168-orange)](https://tanstack.com/start)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3ecf8e?logo=supabase)](https://supabase.com/)

**Author**: Ayomide Deji-Adeyale &mdash; [thekzbn.name.ng](https://thekzbn.name.ng) &mdash; [thekzbn@proton.me](mailto:thekzbn@proton.me)

---

## Overview

**Daybreak** reimagines personal productivity as a tactile, nostalgic operating system from the turn of the millennium. Built with chrome beveled window bars, pixel art icons, W95FA typography, and pastel cyber wallpapers, Daybreak combines daily focus planning, time tracking, note taking, reading lists, and budget management into an immersive desktop experience.

---

## Features and Built-in Apps

| App | Description |
| :--- | :--- |
| **Daily 3 Focus** | Pick up to 3 high-impact priorities for the day. Includes side-by-side execution checklist, single-item focus mode with live timer, strict priority locking, and an 8-bit confetti victory screen upon completion. |
| **Focus Timer (Winamp)** | Repurposed vintage Winamp player skin acting as your primary timer. Features dual modes (Stopwatch and 25m/50m Pomodoro blocks), animated dancing LED spectrum analyzer, glowing green digits, and retro transport controls. |
| **Scratch Note and Stickies** | Pure plain-text Notepad with character counts and word wrap. Tear off pastel yellow/pink/cyan sticky notes and pin them anywhere freely across the desktop wallpaper. |
| **Reading Shelf** | A tactile wooden bookshelf capped at 5 active books. Click empty slots to add books with custom title, URL, and spine color. Click existing spines to pull them forward, view reading progress, or open external links. |
| **Budget Ledger** | Dual-pane envelope budgeting. Calculates daily burn allowance from monthly surplus with dynamic daily rollover (unspent rolls over, overspending reduces tomorrow's allowance). |
| **Midnight Archive (Logbook)** | Automatically derives day rollover so each morning starts clean. Features a monthly calendar where clicking past dates reveals tasks, focus time, notes, and spend logs. Download daily logs via the 3.5-inch floppy disk export. |
| **Display Properties** | Switch between vintage wallpaper themes: *Pastel Cyber*, *Retro Tech Grid*, *Vintage Lavender*, and *Pixel Clouds*. |
| **Desktop OS Environment** | Draggable desktop icons with lavender pill labels, right-click desktop context menu, retro macOS-style floating dock with active indicators, top system bar with live time, sound effects toggle, and custom pixel cursors. |

---

## Design and Aesthetic Guidelines

- **Typography**: Authentic vintage Windows 95 font [`W95FA`](https://fonts.cdnfonts.com/css/w95fa) across all interfaces.
- **Pixel Art Cursors**: Integrated retro pointer and default cursors from `pixelarticons.com`.
- **Zero Modern Clutter**: No cards, no modern toast notifications (uses retro beveled dialogs and balloon hints), no em dashes, no dashboards, no emoji.
- **Window Management**: Full windowing system with dragging, minimize, maximize/restore, and close controls.

---

## Architecture and Tech Stack

```
daybreak-command-centre/
+-- src/
|   +-- components/
|   |   +-- daybreak/
|   |   |   +-- DaybreakDesktop.tsx     # Core Desktop OS & Window Manager
|   |   +-- ui/                         # Base UI components
|   +-- integrations/
|   |   +-- supabase/                   # Supabase client & auth middleware
|   +-- routes/
|   |   +-- __root.tsx                  # Root layout & context providers
|   |   +-- index.tsx                   # Main Desktop route
|   |   +-- reset-password.tsx          # Password recovery flow
|   +-- styles.css                      # Retro themes, cursors, bevels & animations
|   +-- router.tsx                      # TanStack Router configuration
|   +-- start.ts                        # TanStack Start entrypoint
+-- supabase/
|   +-- config.toml                     # Supabase local configuration
|   +-- migrations/                     # SQL schemas & Row-Level Security (RLS)
+-- public/                             # Static assets, audio & icons
+-- package.json
```

- **Frontend Framework**: React 19 + TanStack Start / Vite
- **Styling**: Tailwind CSS v4 + Custom Retro CSS rules
- **Backend and Database**: Supabase (PostgreSQL with Row-Level Security)
- **Authentication**: Supabase Cloud Auth (Email / Password)

---

## Getting Started

### Prerequisites

- **Node.js**: `v20+` or **Bun**: `v1.1+`
- **npm** or **bun**

### 1. Clone the Repository

```bash
git clone https://github.com/thekzbn/daybreak-command-centre.git
cd daybreak-command-centre
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

### 3. Database Setup

Apply the database migrations located in `supabase/migrations/` to your Supabase project:
- Tables: `tasks`, `reading_queue`, `notes`, `stickies`, `expenses`, `budget_categories`, `budget_settings`, `profiles`.
- All tables are protected by Row-Level Security (`auth.uid() = user_id`).

### 4. Install Dependencies and Run

Using **npm**:
```bash
npm install
npm run dev
```

Or using **Bun**:
```bash
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to start your session.

---

## Available Scripts

- `npm run dev` / `bun run dev` - Start the local development server with HMR.
- `npm run build` / `bun run build` - Build production assets.
- `npm run preview` / `bun run preview` - Preview the production build locally.
- `npm run lint` / `bun run lint` - Run ESLint code checks.
- `npm run format` / `bun run format` - Format code using Prettier.

---

## Contributing

Contributions, issues, and feature requests are welcome!
Please review [CONTRIBUTING.md](CONTRIBUTING.md) and our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before opening pull requests.

---

## Security

If you discover a security vulnerability, please refer to [SECURITY.md](SECURITY.md) for reporting guidelines.

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

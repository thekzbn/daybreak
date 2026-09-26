# Contributing to Daybreak Command Centre

Thank you for your interest in contributing to **Daybreak Command Centre**! We welcome bug fixes, documentation improvements, retro asset additions, and feature enhancements that align with our aesthetic and architectural principles.

---

## 🎯 Design & Architectural Principles

Before contributing, please keep the following constraints in mind:

1. **Aesthetic Consistency**:
   - Vintage Y2K Desktop OS aesthetic (Pastel Cyber, Retro Windows 95/98 vibe).
   - Font: Always use `W95FA` font (`@import url('https://fonts.cdnfonts.com/css/w95fa')`).
   - Cursors: Retro pixel art cursors for standard interactions.
   - Icons: Crisp, colored pixel-art SVG icons.
2. **Zero Modern Clutter**:
   - **No cards** or modern card layouts.
   - **No toast notifications** (use vintage beveled dialogs or Win98-style balloon hints).
   - **No em dashes**.
   - **No modern dashboards**.
3. **Data Isolation & Security**:
   - All user data must be strictly scoped to the authenticated user via Supabase Row-Level Security (RLS).
4. **Standalone App Feel**:
   - Windows and apps should behave like real standalone desktop programs with proper internal padding, scrollbars, and tactile controls.

---

## 🛠️ Development Workflow

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

## 📬 Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch.
3. Fill out the PR template completely (including screenshots or video if UI changes were made).
4. Ensure all CI checks pass.

---

## 💬 Community & Questions

If you have questions or want to discuss a new feature before building it, feel free to open a Discussion or an Issue on GitHub.

For direct contact, reach the maintainer at [thekzbn@proton.me](mailto:thekzbn@proton.me) or visit [thekzbn.name.ng](https://thekzbn.name.ng).

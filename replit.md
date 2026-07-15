# TWH Academy — Technical White Hat Academy

**Cyberpunk-themed ethical hacking course website** for Afsar Ali (hiddeneyes99).  
Dark glassmorphism UI · Framer Motion animations · Hinglish course content · Next.js 16

---

## Project Overview

TWH Academy is a premium interactive course platform for ethical hacking. Students log in as one of three users (TWH / Prince / Ashish), navigate 5 chapters of Hinglish (Hindi + English) course material, complete topic-wise MCQs to unlock the next topic, take notes, and track their overall progress on a dashboard.

The visual identity is **cyberpunk** — dark backgrounds, cyan/purple glow, glassmorphism cards, particle rain effects, and Orbitron font. Think Netflix UX meets hacker terminal aesthetic.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.10 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first config, no tailwind.config.ts) |
| Animations | Framer Motion 12 |
| State | React 19 + localStorage (no external DB) |
| Fonts | Orbitron (headings), Inter (body) — Google Fonts |
| Markdown | react-markdown + remark-gfm |

---

## Running the Project

```bash
npm run dev        # starts on port 5000
```

The app is configured for Replit's proxied preview via `allowedDevOrigins: ["*"]` in `next.config.ts`.

---

## Project Structure

```
/
├── app/
│   ├── layout.tsx              # Root layout — fonts, global styles
│   ├── page.tsx                # Landing hero page
│   ├── globals.css             # Tailwind v4 @theme config + custom classes
│   ├── login/page.tsx          # 3-user login (no password)
│   ├── chapters/page.tsx       # Chapter selection dashboard
│   ├── chapter/[id]/page.tsx   # Dynamic chapter viewer
│   ├── dashboard/page.tsx      # User stats & progress overview
│   └── api/chapter/[id]/
│       └── route.ts            # Server API — returns chapter JSON
│
├── components/
│   ├── Navbar.tsx              # Top nav with user + progress
│   ├── ChapterViewer.tsx       # Core viewer: markdown + MCQ + tasks
│   ├── TopicSidebar.tsx        # In-chapter topic nav (locked/unlocked)
│   ├── MCQSection.tsx          # Interactive quiz with score tracking
│   ├── ReadingProgress.tsx     # Scroll progress bar
│   ├── NotesPanel.tsx          # Per-topic auto-saving notepad
│   ├── VideoSection.tsx        # Video placeholder UI
│   ├── BinaryRain.tsx          # Matrix-style background animation
│   └── ParticlesCanvas.tsx     # Floating particle background
│
├── lib/
│   ├── chapters.ts             # Chapter metadata + content loader
│   ├── storage.ts              # localStorage wrapper (progress, notes, MCQ scores)
│   ├── mcq-parser.ts           # Extracts MCQs from markdown
│   └── utils.ts                # Tailwind cn() helper
│
├── Chapter-1-Startup.md        # Chapter 1: Getting Started / Intro
├── Chapter-2-How-Computer-Works.md
├── Chapter-3-Networking.md
├── Chapter-4-Linux-CommandLine.md
├── Chapter-5-Kali-Linux.md
└── NEXT-AI-HANDOFF.md          # Original design brief / style guide
```

---

## Features — Current Status

### ✅ Complete & Working
- **Landing page** — Hero with cyberpunk animations, CTA to login
- **3-user login** — Glassmorphism cards (TWH / Prince / Ashish), no password
- **Chapters dashboard** — All 5 chapters listed with per-user progress bars
- **Chapter viewer** — Markdown rendered with custom `prose-twh` styles
- **Topic sidebar** — Topics list with lock/unlock state per user
- **MCQ system** — Questions parsed from markdown, answer tracking, score saved to localStorage
- **Topic unlocking** — Next topic unlocks only after passing current MCQ
- **Notes panel** — Per-topic notepad, auto-saves to localStorage
- **Progress tracking** — Topics completed, MCQ accuracy, stored per-user in localStorage
- **Dashboard** — Aggregate stats: topics done, accuracy, chapters started
- **Navbar** — User avatar, current chapter, overall progress indicator
- **Visual effects** — BinaryRain + ParticlesCanvas background, glassmorphism cards
- **Responsive UI** — Mobile sidebar toggle, fluid layouts
- **Auth guard** — `/chapters`, `/chapter/[id]`, `/dashboard` redirect to `/login` if no active user

### 🔶 Partial / Placeholder
- **Video section** — UI exists, shows placeholder; no actual videos embedded yet
- **Hands-on tasks** — Rendered as markdown text; no interactive terminal/sandbox

### ❌ Not Built Yet
- Real backend / database (everything is localStorage — no cross-device sync)
- Admin panel (add/edit content without touching markdown files)
- Certificate generation on course completion
- Video hosting integration (YouTube embed or self-hosted)
- Interactive terminal / hands-on lab environment

---

## Known Quirks & Important Notes

### Tailwind CSS v4 (no tailwind.config.ts)
- Config lives entirely in `app/globals.css` via `@theme {}` blocks
- PostCSS plugin is `@tailwindcss/postcss`, NOT `tailwindcss`
- Custom colors: `--color-cyan-*`, `--color-purple-*`, `--color-dark-*`
- **Critical**: Keyframe definitions must be **outside** `@theme {}` — putting them inside silently breaks all utility class generation

### Framer Motion + Next.js App Router SSR
- Even `"use client"` components are server-rendered first in App Router
- Any `motion` component with `initial={{ opacity: 0 }}` will be **invisible** until JS hydrates
- **Fix**: Use a `mounted` state + `useEffect`, then `initial={mounted ? { opacity: 0, ... } : false}`
- Applied in: `page.tsx`, `login/page.tsx`, `Navbar.tsx`, `chapters/page.tsx`, `chapter/[id]/page.tsx`

### Next.js 16 Async Route Params
- `params` in route handlers and page components is now a `Promise` — must be `await`ed
- `const { id } = await params;` — not `params.id` directly
- Applied in: `app/api/chapter/[id]/route.ts`

### HMR WebSocket noise in Replit
- Browser console shows WebSocket connection errors in dev mode — cosmetic only
- Replit's proxy layer blocks the HMR websocket; does NOT affect app functionality
- Safe to ignore

---

## Chapter Content (Markdown Files)

| File | Topic | Status |
|---|---|---|
| `Chapter-1-Startup.md` | Intro to ethical hacking, mindset, tools overview | Needs review |
| `Chapter-2-How-Computer-Works.md` | CPU, RAM, OS internals, binary basics | Needs review |
| `Chapter-3-Networking.md` | TCP/IP, DNS, ports, packet sniffing | Needs review |
| `Chapter-4-Linux-CommandLine.md` | Bash, file system, permissions, scripting | Needs review |
| `Chapter-5-Kali-Linux.md` | Kali setup, tools, first pentest workflow | Needs review |

All files are in **Hinglish** (Hindi written in English script + English technical terms).

---

## Next Checkpoints 🎯

### Checkpoint 1 — Content Audit & Completion (Task #3)
> Fill in any incomplete chapters so the full course has no gaps

- [ ] Read all 5 chapter markdown files end-to-end
- [ ] Identify missing sections, incomplete topics, topics with no MCQs
- [ ] Add MCQs to every topic (minimum 3 per topic, format: `## MCQ\n**Q.** ...`)
- [ ] Add "Hands-on Task" sections at end of practical topics
- [ ] Ensure each chapter has a logical flow: Theory → Demo → MCQ → Task
- [ ] Proofread Hinglish for clarity

### Checkpoint 2 — Video Integration
> Embed YouTube/video content into relevant chapters

- [ ] Decide hosting: YouTube embeds vs self-hosted
- [ ] Replace `VideoSection.tsx` placeholder with real `<iframe>` embeds
- [ ] Map video URLs to chapter/topic IDs in `lib/chapters.ts`

### Checkpoint 3 — Hands-on Lab / Terminal
> Give students an actual environment to practice commands

- [ ] Evaluate options: embedded xterm.js (fake terminal), iframe to LabEx/TryHackMe, or Replit-embedded shell
- [ ] Build `LabSection.tsx` component
- [ ] Integrate into `ChapterViewer.tsx` after task markdown

### Checkpoint 4 — Polish & UX Improvements
> Small quality-of-life upgrades

- [ ] Bookmark system (save a topic to revisit later) — `storage.ts` already has the hook
- [ ] Chapter completion certificate page (`/certificate/[user]`)
- [ ] "Continue where you left off" shortcut on `/chapters` dashboard
- [ ] Dark/light mode toggle (stretch goal)
- [ ] Mobile layout audit for chapter viewer sidebar

### Checkpoint 5 — Production Deployment
> Ship it live for real students

- [ ] Move user data from localStorage → a real DB (Supabase / PlanetScale / Neon)
- [ ] Add proper auth (Clerk or NextAuth) — currently anyone can enter any username
- [ ] Set `SESSION_SECRET` (already in Replit Secrets) for session management
- [ ] Deploy on Replit (`replit.app` domain) or custom domain
- [ ] Add basic analytics (which topics students get stuck on)
- [ ] SEO meta tags and OG image for sharing

---

## User Preferences

- Course language: Hinglish (Hindi + English mixed, technical terms in English)
- 3 fixed users: **TWH** (admin/creator), **Prince**, **Ashish**
- No external auth services unless explicitly requested
- Keep all UI dark — no light mode by default
- Animations should feel premium, not janky — always fix SSR flash issues

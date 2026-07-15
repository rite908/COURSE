---
name: Framer Motion SSR invisible content fix
description: Pattern to prevent Framer Motion initial:opacity-0 from hiding content during SSR
---

## The Problem

Next.js App Router SSR renders `"use client"` pages on the server. Framer Motion applies `initial={{ opacity: 0 }}` as inline styles at render time. The screenshot tool (and initial page load) captures the page before React hydration completes and animations run — showing a blank page.

## The Fix

Add `mounted` state and use `initial={mounted ? {...} : false}`:

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

// Then on each motion component:
<motion.div
  initial={mounted ? { opacity: 0, y: -20 } : false}
  animate={{ opacity: 1, y: 0 }}
>
```

When `initial={false}`, Framer Motion skips the initial animation and renders directly at the `animate` state (fully visible). After hydration, `mounted` becomes true and subsequent renders use the normal animation.

**Why:** `initial={false}` tells framer-motion "don't apply an initial state, just start at animate state". This makes SSR output visible while still allowing the animation to play after mount.

**How to apply:** Any page or component where above-the-fold content starts at opacity: 0 and must be visible during SSR. The Navbar is especially important since it renders on every page.

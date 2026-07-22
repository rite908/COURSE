---
name: Replit allowedDevOrigins
description: How to correctly configure Next.js allowedDevOrigins for Replit's proxied preview — wrong config silently breaks HMR and client hydration.
---

# Replit allowedDevOrigins

## The Rule
Use explicit wildcard domain patterns in `next.config.ts`. Never use `["*"]` — Next.js 16 does NOT treat it as a catch-all for `allowedDevOrigins`.

```ts
allowedDevOrigins: [
  "*.replit.dev",
  "*.sisko.replit.dev",
  "*.pike.replit.dev",
  "*.repl.co",
  "127.0.0.1",
],
```

**Why:** Next.js 16 blocks cross-origin HMR WebSocket connections by default. The `["*"]` wildcard silently does nothing — only explicit hostname patterns work. When HMR is blocked, the browser shows WebSocket errors and client-side JS never hydrates, which breaks:
- Dark mode (reads localStorage on mount)
- Any component that uses `mounted` state
- Any UI that depends on `useEffect` running (chapters list, user data, etc.)

**How to apply:** Any time you touch `next.config.ts` in this project, ensure the `allowedDevOrigins` array has these patterns. Do NOT consolidate back to `"*"`. Do NOT create a separate `next.config.js` — having both files causes a duplicate config conflict.

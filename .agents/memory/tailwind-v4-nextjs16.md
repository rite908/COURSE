---
name: Tailwind v4 + Next.js 16 setup
description: How to configure Tailwind CSS v4 with Next.js 16 on Replit
---

## Rules

1. Install `@tailwindcss/postcss` — not `tailwindcss` postcss plugin directly
2. `postcss.config.mjs` must use `"@tailwindcss/postcss": {}` (not `tailwindcss: {}`)
3. No `tailwind.config.ts` needed — config goes in CSS via `@theme {}`
4. `globals.css` starts with `@import "tailwindcss"` (single import, not three directives)
5. Custom colors in `@theme`: `--color-accent-cyan: #00E5FF` → generates `text-accent-cyan`, `bg-accent-cyan`, etc.
6. Keyframes must be defined as `@keyframes` rules OUTSIDE `@theme` — putting `--keyframes-*` inside `@theme` causes a CSS parse error that silently breaks all utility generation
7. `next.config.ts` uses `serverExternalPackages` (not `experimental.serverComponentsExternalPackages`)
8. `allowedDevOrigins: ["*"]` in next.config.ts allows Replit proxy cross-origin HMR

9. Route handler `params` must be typed as `Promise<{id: string}>` and awaited — `const { id } = await params;` — otherwise `params.id` is `undefined` and all lookups fail silently
10. Never put `"use client"` at the top of `lib/*.ts` utility files; it breaks tree-shaking and can cause subtle import issues in Next.js 16

**Why:** Next.js 14.2.5 was blocked by Replit's security firewall (Critical CVE), forcing upgrade to next@latest (16.x), which brought Tailwind v4 and React 19.

**How to apply:** Any time the TWH Academy project needs CSS config changes or package updates.

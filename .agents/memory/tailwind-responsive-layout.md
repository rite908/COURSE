---
name: Tailwind responsive classes unreliable for layout
description: sm:/lg: responsive variants silently fail for layout-critical properties in this project; the fix is JS viewport state + inline styles
---

## The rule
Never use Tailwind responsive prefixes (`sm:`, `lg:`) for layout-critical CSS properties in this project. Use a JS `useEffect` viewport-width tracker and apply inline styles conditionally instead.

**Why:** In this Tailwind v4 + Next.js 16 + Turbopack setup, responsive variants like `sm:grid-cols-4`, `lg:px-12`, `sm:flex-row` are silently dropped — the classes appear in JSX but the corresponding CSS rules are never applied. The root cause is unclear (likely Turbopack + Tailwind v4 CSS scanner interaction), but the effect is consistent: any responsive variant that controls layout (grid-template-columns, flex-direction, padding, display) is unreliable.

Non-responsive Tailwind classes (colors, borders, border-radius, font-weight, etc.) work fine.

**How to apply:** In any component that needs responsive layout:

```tsx
const [vw, setVw] = useState(1280);
useEffect(() => {
  const update = () => setVw(window.innerWidth);
  update();
  window.addEventListener("resize", update, { passive: true });
  return () => window.removeEventListener("resize", update);
}, []);

const isMd = vw >= 768;
const isLg = vw >= 1024;

// Then use isMd/isLg in inline styles:
<div style={{ display: "grid", gridTemplateColumns: isMd ? "repeat(4, 1fr)" : "repeat(2, 1fr)" }}>
```

Also use a shared `container` style object for consistent max-width + centering across sections:
```tsx
const container: React.CSSProperties = {
  maxWidth: 1280, margin: "0 auto", padding: "0 40px",
  width: "100%", boxSizing: "border-box",
};
```

**Already applied in:** `app/page.tsx` (full rewrite using this pattern).

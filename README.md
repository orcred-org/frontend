# Pruv — Next.js 14 + Tailwind + Framer Motion + Lenis

**The Standard for AI/ML Intelligence** — landing page converted from HTML to Next.js 14.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (with full custom design tokens from original)
- **Framer Motion** — scroll-triggered fade-ins, stagger reveals, hover animations
- **Lenis** (`@studio-freight/lenis`) — buttery smooth scroll

## Project Structure

```
pruv/
├── app/
│   ├── globals.css          # All custom CSS (glass-panel, text-3d, grain overlay…)
│   ├── layout.tsx           # Root layout with Lenis provider
│   └── page.tsx             # Page assembly
├── components/
│   ├── LenisProvider.tsx    # Smooth scroll (client component)
│   ├── Navbar.tsx           # Sticky glass nav
│   ├── HeroSection.tsx      # Dark hero with mouse-parallax stripe bg
│   ├── PlatformSection.tsx  # 3 editorial panels
│   ├── ProcessSection.tsx   # 3-step pipeline
│   ├── ScoresSection.tsx    # 4 score cards
│   ├── StandardSection.tsx  # Dark manifesto section
│   ├── ComparisonSection.tsx# Comparison table
│   ├── ReviewersSection.tsx # For senior engineers CTA
│   ├── CtaSection.tsx       # Email waitlist CTA
│   └── Footer.tsx           # Full footer
├── lib/
│   └── useFadeInView.ts     # Reusable scroll-inView hook
├── tailwind.config.ts       # Full design token mapping
├── postcss.config.js
├── next.config.js
└── tsconfig.json
```

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Animations

All animations match the original:

| Feature | Implementation |
|---|---|
| Mouse parallax on hero bg | `useEffect` + `requestAnimationFrame` (identical to original JS) |
| Smooth scroll | Lenis with `duration: 1.2` |
| Fade-in on scroll | `framer-motion` `useInView` + stagger |
| Hover scale/glow | `whileHover` on buttons and cards |
| Pulse ring (Panel 2) | `framer-motion` `animate` loop |
| Navbar entrance | `motion.header` with slide-down |
| Dark section lines | Staggered `whileInView` with alternating x offset |

## Notes

- `"use client"` is used only on interactive/animated components (correct App Router pattern).
- `page.tsx` and `layout.tsx` are server components.
- All Tailwind classes, spacing tokens, colors, and font definitions are 1:1 with the original.

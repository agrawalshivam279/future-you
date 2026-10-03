# 📄 Technical Specification: Project Scaffold & Next.js 14 Tooling

> **Step ID**: `0.1`  
> **Target Module**: Root / `src/app` / `src/components` / `src/lib` / `src/stores` / `src/types`  
> **Git Feature Branch**: `feat/step-0-1-project-scaffold`  
> **Status**: 📋 Draft / Ready for Implementation  
> **Created**: 2026-10-03  

---

## 1. Executive Summary

This specification defines the initialization of the **Future You** web application using Next.js 14 App Router, TypeScript strict mode, Tailwind CSS with customized dark design system tokens, Framer Motion, Zustand state management, and the OpenAI-compatible SDK. It establishes the initial directory structure, base layout with the mandatory persistent honesty disclaimer, and global CSS tokens.

---

## 2. Dependencies & Prerequisites

- **Depends on**: None (Initial codebase scaffold).
- **Blocked by**: None.
- **Locked Dependencies**:
  - `next`: `14.2.x` (App Router)
  - `react`: `^18.3.x`
  - `react-dom`: `^18.3.x`
  - `typescript`: `^5.x`
  - `tailwindcss`: `^3.4.x`
  - `framer-motion`: `^11.x`
  - `zustand`: `^4.5.x`
  - `openai`: `^4.x`
  - `clsx` & `tailwind-merge`: For utility classes
  - `lucide-react`: For lightweight, accessible icons

---

## 3. 🔒 Privacy, Storage & Disclaimer Impact

- [x] **Zero Cloud Storage**: No remote database or analytics libraries installed.
- [x] **LocalStorage Prefix Invariant**: Prepared for `future-you:` keys.
- [x] **Honesty Disclaimer**: Hardcoded in the persistent footer:
  > *"Future You is a reflection tool, not a prediction engine. Results are illustrative and based on your self-reported inputs."*
- [x] **Accessibility**: Minimum WCAG AA contrast ($\ge 4.5:1$), responsive layout (`< 768px` mobile stack support).

---

## 4. Architecture & Directory Blueprint

```
src/
├── app/
│   ├── layout.tsx         # Root layout with fonts, metadata, and persistent disclaimer footer
│   ├── page.tsx           # Initial clean landing placeholder
│   └── globals.css        # Tailwind directives + design token custom properties
├── components/
│   ├── ui/                # Directory placeholder for primitive components
│   └── layout/            # Header, Footer, DisclaimerModal placeholders
├── lib/
│   ├── ai/                # OpenAI client placeholder
│   ├── prompts/           # System prompt templates
│   ├── constants.ts       # App constants
│   └── utils.ts           # cn() class merge utility
├── stores/                # Zustand stores
└── types/                 # TypeScript interfaces
```

---

## 5. Design System Tokens (`tailwind.config.ts` & `globals.css`)

```css
:root {
  --bg-primary: #0A0A0B;
  --bg-secondary: #141416;
  --bg-tertiary: #1C1C1F;
  --bg-hover: #232328;

  --text-primary: #F5F5F7;
  --text-secondary: #A1A1AA;
  --text-tertiary: #71717A;
  --text-muted: #52525B;

  --border-primary: #27272A;
  --border-focus: #3F3F46;

  --accent-current: #F59E0B;
  --accent-improved: #10B981;
  --accent-info: #3B82F6;
  --accent-danger: #EF4444;
}
```

---

## 6. Step-by-Step Implementation Sequence

1. **Step 1: Manifest & Configuration Files**
   - Create `package.json` with locked scripts (`dev`, `build`, `start`, `lint`, `test`) and dependencies.
   - Create `tsconfig.json` with strict type checking, Next.js plugins, and `@/*` path aliases.
   - Create `next.config.js`, `postcss.config.js`, and `tailwind.config.ts`.
2. **Step 2: Install Node Dependencies**
   - Run `npm install` to populate `node_modules` and lockfile.
3. **Step 3: Core Utilities & Global Styling**
   - Create `src/lib/utils.ts` with `cn()` utility.
   - Create `src/app/globals.css` with dark theme canvas and custom property bindings.
4. **Step 4: Layout & Root Page**
   - Create `src/app/layout.tsx` using `function RootLayout` (App Router standard) with metadata, dark theme class, and persistent footer disclaimer.
   - Create `src/app/page.tsx` minimal starter landing view.

---

## 7. Verification & Acceptance Criteria

### Automated Compilation Check
```bash
npx tsc --noEmit
npm run lint
```

### Acceptance Checklist
- [ ] `npm run build` or `npx tsc --noEmit` succeeds with 0 errors.
- [ ] Root layout renders dark canvas (`#0A0A0B`) with no layout shift.
- [ ] Honesty disclaimer is visible in the footer.
- [ ] All components use `function` declarations and stay strictly $\le 300$ LOC.

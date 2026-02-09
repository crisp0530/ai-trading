# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hubble Terminal — an AI trading agent marketplace built with Next.js App Router. Users create and manage autonomous trading/research agents for DEX, CEX, and prediction markets. Features multi-chain wallet integration (BNB/BSC, Base) and multilingual support (en, zh, ja, ko, es, fr).

## Commands

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Production build
pnpm lint         # ESLint
pnpm start        # Run production server
```

No test framework is configured.

## Tech Stack

- **Next.js 16** with App Router, **React 19**, **TypeScript 5**
- **Tailwind CSS 4** (PostCSS plugin, OKLCH color space) with `tw-animate-css`
- **shadcn/ui** (new-york style) — 57 components in `components/ui/`
- **Radix UI** primitives, **Lucide React** icons
- **Recharts** + **Chart.js** for data visualization
- **React Hook Form** + **Zod** for forms/validation
- **pnpm** as package manager

## Architecture

### Global State (React Context)

Two providers wrap the entire app in `app/layout.tsx`:

- **WalletProvider** (`lib/wallet-context.tsx`) — wallet connection, address, chain selection (BNB/Base), persisted to localStorage
- **LanguageProvider** (`lib/language-context.tsx`) — i18n via `t(key)` function, translations are inline key-value maps per language

### Routing (App Router)

| Route | Purpose |
|---|---|
| `/` | Landing page with wallet connection |
| `/marketplace` | Browse/filter research agents |
| `/create-trading-agent` | Multi-step trading agent wizard |
| `/create-research-agent` | Research agent creation form |
| `/my-agents` | User's agents dashboard |
| `/leaderboard` | Agent performance rankings |
| `/research/[id]` | Research agent detail view |
| `/trading-terminal/[id]` | Full trading terminal UI (largest page ~3800 lines) |
| `/mobile/trading/[id]` | Mobile-optimized trading view |

All page components are client components (`"use client"`).

### Import Aliases

`@/*` maps to the project root (configured in `tsconfig.json`). Standard paths:

- `@/components/ui/*` — shadcn components
- `@/lib/*` — utilities and context providers
- `@/hooks/*` — custom React hooks (`use-mobile`, `use-toast`)
- `@/types/*` — TypeScript type definitions

### Styling

Terminal-themed dark UI using custom CSS variables in `app/globals.css`:

- `--terminal-darker` / `--terminal-dark` — background shades
- `--terminal-green` — success/bullish color
- `--terminal-accent` — cyan/blue primary accent
- `--terminal-muted` / `--terminal-border` — secondary UI elements

These map to shadcn's token system (`--background`, `--primary`, etc.). Use `cn()` from `@/lib/utils` for conditional class merging.

### Key Types

`types/decision.ts` defines the core trading data model:
- `ResearchSignal` — agent signals (Technical/Sentiment/Whale) with direction and confidence
- `DecisionDetail` — trading decisions with PnL, signals, and manager flow status

## Build Configuration Notes

- `next.config.mjs` has `typescript.ignoreBuildErrors: true` — TypeScript errors won't fail builds
- `images.unoptimized: true` — Next.js image optimization is disabled
- No backend API routes exist; the app is entirely frontend with mock/simulated data

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (Vite)
pnpm build        # Type-check (vue-tsc) then build
pnpm preview      # Preview production build
npx vue-tsc --noEmit  # Type-check only
```

No test runner or linter is currently configured.

## Project Overview

**取模助手 (Mod Helper)** — a browser-based tool that converts text and images into C byte arrays for embedded OLED/LCD displays (128×64 target). All computation is client-side via Canvas API; there is no backend.

## Architecture

Single-page app with one route (`/`). Layout: header → sidebar (config) + main area (preview + output).

```
src/
├── types/index.ts      # Shared types: ModMode, Polarity, FontConfig, ImageConfig, GenerateResult
├── store/mod.ts        # Pinia store (composition API): modType, fontConfig, imageConfig, generateResult
├── utils/mod.ts        # Core algorithms: text→dotMatrix, image→dotMatrix, dotMatrix→C array
├── components/
│   ├── SideNavBar.vue      # Left panel: font/image mode tabs + config fields + generate button
│   ├── DisplayPreview.vue  # Canvas-based 128×64 pixel preview with ResizeObserver scaling
│   └── CodeOutput.vue      # C array display + copy/download
├── views/home/index.vue   # Assembles sidebar + preview + output
└── layout/index.vue       # App shell: header bar + flex main slot
```

**Data flow:** User config in store → `handleGenerate()` in SideNavBar calls `utils/mod.ts` → writes `previewData` + `cArray` back to store → components react.

## Core Algorithm (utils/mod.ts)

Four scan modes, each produces a `number[]` of byte values from a `number[][]` (0/1) pixel matrix:

- **列行式 (column-row):** Column-major with 8-row pages; each byte = 8 vertical pixels, LSB=top. Matches SSD1306 OLED format.
- **行列式 (row-column):** Row-major with 8-column bytes; each byte = 8 horizontal pixels, MSB=left.
- **逐列式 (column-by-column):** Each column → one byte, MSB=top.
- **逐行式 (row-by-row):** Each row → one byte, MSB=left.

Binarization uses weighted gray: `0.299R + 0.587G + 0.114B` with configurable threshold. Polarity inverts which value maps to "on".

## Design System (SCSS variables in styles/index.scss)

Dark theme with cyan/green/blue accents. All colors exposed as CSS custom properties (`--bg-dark`, `--accent-cyan`, etc.). Element Plus components require `:deep()` overrides for dark theme — see existing patterns in SideNavBar.vue (`:deep(.dark-select)`, `:deep(.el-textarea__inner)`, etc.).

## Coding Conventions

- `<script setup lang="ts">` — always, with only one `<script setup>` block per SFC
- Component file order: `<script setup>` → `<template>` → `<style scoped lang="scss">`
- File naming: kebab-case (`side-nav-bar.vue`)
- Component naming: PascalCase (`SideNavBar`)
- Use `reactive` for complex config objects, `ref` for primitives
- JSDoc comments (`/** ... */`) for functions, not inline `//`
- `async/await` over `.then()` chains
- No `any`, no inline styles, no `console.log` in committed code
- Element Plus: auto-imported via `unplugin-auto-import` + `unplugin-vue-components` with `ElementPlusResolver`
- Path alias: `@` → `src/`

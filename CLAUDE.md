# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A donation lottery web app (in Russian). Users click cells on a 4x5 grid to reveal prizes. An admin page lets you manage prizes and assign them to cells. Built for stream/event use cases.

## Commands

- `yarn dev` — start dev server on port 3000
- `yarn build` — typecheck with `tsc -b` then build with Vite
- `yarn lint` — run ESLint

No test framework is configured.

## Tech Stack

- React 19, TypeScript, Vite 7
- Zustand (with `persist` middleware → localStorage) for state management
- Framer Motion for animations, Lottie for confetti
- React Router v6 (two routes: `/` and `/admin`)
- Package manager: Yarn 1 (Classic)

## Architecture

**State** — Single Zustand store (`src/store/Lotterystore.ts`) holds prizes, cell-to-prize assignments (`cellLots`), and opened cells. Prizes and cellLots are persisted to localStorage under key `lottery-storage`; openedCells reset on reload.

**Routes:**
- `/` — Main lottery grid (`App.tsx`). 4 rows (donate tiers: 100/200/500/1000) x 5 columns. Clicking a cell reveals the assigned prize (or a random one if unassigned) and opens `RewardDialog`.
- `/admin` — Admin panel (`src/pages/adminPage/Adminpage.tsx`). CRUD for prizes, click-to-assign prizes to grid cells, randomize/clear all assignments.

**Key pattern:** Grid cells are keyed as `"row-col"` strings (e.g. `"0-2"`) throughout the store and components.

## Notes

- UI text and comments are in Russian.
- Framer Motion's typed props cause TS issues — existing code uses `// @ts-ignore` on motion component className props. Follow this pattern when adding motion components.
- Animation variants are centralized in `src/assets/motion/constants.ts`.

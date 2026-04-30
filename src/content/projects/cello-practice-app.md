---
title: "Practice Cello"
subtitle: "A structured learning platform for cello students"
date: 2026-01-15
description: "A web-based practice companion with 140+ structured lessons, session planning, goal tracking, and audio tools including pitch detection and a metronome."
cardImage: ../../assets/blog/cello-practice-planner.png
status: "Active development. Took a significant detour on audio analysis of user recordings for intonation and vibrato, which has proven difficult to execute reliably with existing libraries. Next step is manual categorization of recordings to attempt a machine learning approach to analysis. Separately, 100+ comprehensive lessons have been created and the skills system was recently overhauled to support 518 individual skills with lesson relationships. Functionally, the next large piece is building out a teacher role to monitor and assign practices and study to multiple students."
---

A comprehensive web-based learning platform for cello students. It combines structured curriculum with practice tracking, goal management, and audio tools to provide a full practice companion.

<img src="/projects/cello-curriculum.png" alt="Curriculum library with structured lessons organized by skill level, progress tracking, and recent activity" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

## What It Does

**Curriculum** — A library of 143+ lessons across multiple skill levels with three content types: structured step-by-step lessons, comprehensive educational guides, and reference articles. Lessons are linked to a system of 518+ individual cello skills organized into 10 categories.

**Practice tracking** — Session management with recording capabilities and pitch detection. Progress monitoring shows what you've worked on and how consistently.

<img src="/projects/cello-practice-planner.png" alt="Practice planner with monthly calendar view showing scheduled and completed sessions" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

**Goals** — User-defined practice goals with tracking, reminders, and calendar integration (including Google Calendar sync).

<img src="/projects/cello-goals.png" alt="Goals and milestones view with active goals, progress tracking, and milestone checklists" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

**Audio** — Pitch detection for tuning and intonation feedback, audio recording and playback, and VexFlow music notation rendering.

<img src="/projects/cello-tools.png" alt="Practice tools including metronome with tempo control, time signatures, and common tempo presets" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

## Tech Stack

**Frontend**
- React 19 + TypeScript, Vite
- Tailwind CSS
- Lexical rich text editor
- Recharts for progress visualization
- VexFlow for music notation
- Pitch detection libraries (pitchfinder, pitchy)

**Backend**
- Node.js, Express, TypeScript
- SQLite (better-sqlite3)
- JWT + Google OAuth authentication
- Resend for transactional email


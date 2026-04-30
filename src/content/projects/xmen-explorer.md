---
title: "X-Men Explorer"
subtitle: "A comprehensive guide to the X-Men comic book universe"
date: 2026-04-14
description: "An interactive web app for browsing X-Men comics, characters, creators, and story arcs across 1,400+ series, 6,500+ issues, and 1,000+ collected editions."
cardImage: ../../assets/blog/xmen-home.png
status: "Live at xmen.sequentialreads.com. Currently going through significant UX improvements alongside planned features including a timeline/era browser, reading progress tracking, and mobile navigation."
---

A web application for exploring the X-Men comic book universe. Browse series, issues, characters, creators, teams, events, story arcs, creative runs, and collected editions across 1,400+ series and 6,500+ issues (deduped from 15,000+ issue variants), plus 1,000+ collected editions.

<img src="/projects/xmen-home.png" alt="X-Men Explorer home page with featured reading orders, defining eras, and character roll call" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

## What It Does

The site provides a structured way to navigate one of comics' most complex continuities. It tracks roughly 48,000 character appearances across 137 characters, with AI-generated descriptions for series and synopses for issues. Features include reading order guides, collected edition tracking with purchase links, and search across the full database.

<img src="/projects/xmen-characters.png" alt="Character gallery showing mutants, heroes, and villains from across the X-Men universe" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

<img src="/projects/xmen-character-detail.png" alt="Wolverine character detail page with appearance history, bio, and statistics" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

<img src="/projects/xmen-teams.png" alt="Factions and Families page listing X-Men teams from Xavier's original line to militant X-Force" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

The data pipeline pulls from multiple sources (Metron, Grand Comics Database, ComicVine, Marvel) and runs enrichment scripts for cover images, categorization, and content normalization.

<img src="/projects/xmen-issues.png" alt="Issues browser with cover art gallery across ongoing, limited, and one-shot series" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

<img src="/projects/xmen-series.png" alt="Series browser showing every X-Men family title from 1963 to today" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

<img src="/projects/xmen-editions.png" alt="Collected editions browser with trade paperbacks, omnibuses, and epic collections" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

<img src="/projects/xmen-stats.png" alt="Universe stats dashboard with publication trends, character appearances, and creator data" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

## Tech Stack

**Frontend**
- Astro + React, Tailwind CSS
- Server-side rendering via Node.js adapter
- PostHog analytics

**Backend**
- FastAPI (Python), async SQLAlchemy + PostgreSQL
- Celery + Redis for background tasks
- Alembic for database migrations

**Infrastructure**
- Hetzner VPS, Cloudflare CDN with edge caching
- ETL scripts for data enrichment from multiple comic databases


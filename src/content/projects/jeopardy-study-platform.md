---
title: "J! Study"
subtitle: "A Jeopardy study platform built on 550,000+ historical clues"
date: 2026-04-15
description: "An interactive study platform with spaced repetition flashcards, game board simulation, and data-driven study guides for Jeopardy preparation."
cardImage: ../../assets/blog/jeopardy-home.png
status: "Live at jstudyapp.com in active beta. Currently going through significant UX improvements alongside infrastructure hardening and expanding the study guide library."
---

A comprehensive Jeopardy study platform that combines a database of over 550,000 historical clues across 9,400+ archived games with spaced repetition algorithms, interactive game board simulation, and research tools for serious preparation.

<img src="/projects/jeopardy-practice.png" alt="Practice mode with spaced repetition flashcards, keyboard shortcuts, and topic filtering" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

## What It Does

The platform has several interconnected modes:

**Practice** uses the SM-2 spaced repetition algorithm to schedule flashcard review. Three study modes (Smart, Review, Random) adapt to how well you know the material. Per-clue and per-session tracking shows where you're strong and where you need work.

**Play** simulates full game boards with realistic Jeopardy formatting, Daily Doubles, and Final Jeopardy wagering logic. You can play through real archived games or custom boards.

<img src="/projects/jeopardy-play.png" alt="Play mode with Study Mode and Game Mode options, decade filtering" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

**Topics** breaks down the full clue database by subject, identifying gimmes vs. stumpers, tracking how category trends shift across eras, and surfacing evergreen topics. Each topic links to study guides and practice sessions.

<img src="/projects/jeopardy-topics.png" alt="Topics view showing clue counts, gimme percentages, and stumper rates across 372 topics" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

**Analytics** provides deep analysis across the full dataset: global statistics, topic frequency by era, winner vs. loser performance breakdowns, comeback probabilities by lead margin, and Daily Double / Final Jeopardy conversion rates.

<img src="/projects/jeopardy-analytics.png" alt="Analytics dashboard with global statistics across 560,000 clues, most-asked topics, and era breakdowns" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

**Champions** tracks detailed performance data for top players with head-to-head comparisons, skill breakdowns, and wagering analysis.

<img src="/projects/jeopardy-champions.png" alt="Ken Jennings champion profile with head-to-head comparison against James Holzhauer" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

**Progress** shows your personal study metrics: clues studied, accuracy by domain, and recommendations for what to study next.

<img src="/projects/jeopardy-progress.png" alt="Personal progress dashboard with accuracy by domain, clues studied, and study recommendations" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

**Study Guides** offer 130+ published subject guides organized by category with subtopic breakdowns, giving structured paths through the knowledge base.

<img src="/projects/jeopardy-guides.png" alt="Study guides organized by domain with clue counts and dates" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

## Tech Stack

- **Backend**: Python, Flask, SQLite (194MB database, WAL mode)
- **Frontend**: Jinja2 templates, JavaScript
- **Infrastructure**: Gunicorn behind Caddy on a Hetzner VPS
- **Auth**: Flask-Login + Google OAuth
- **Analytics**: PostHog, Sentry for error tracking
- **AI**: Claude API integration for content analysis


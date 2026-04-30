---
title: "Personal Intelligence Digest"
subtitle: "An AI-powered content pipeline that filters signal from noise"
date: 2026-04-12
description: "A daily digest system that aggregates content from dozens of sources, triages with local LLMs, and synthesizes insights with Claude."
cardImage: ../../assets/blog/digest-dashboard.png
status: "Running daily. The triage accuracy has improved significantly with interest weighting adjustments. Currently exploring ways to close the feedback loop so triage quality improves automatically based on which articles I actually read."
---

A personal content aggregation and analysis pipeline that fetches articles from RSS feeds, podcasts, Reddit, and manual sources, then intelligently triages and synthesizes them into daily and weekly intelligence digests tailored to my professional interests.

<img src="/projects/digest-dashboard.png" alt="Intelligence Digest dashboard showing pipeline status, quick actions, and recent activity across 8,800+ articles and 100+ sources" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

## The Problem

I follow dozens of sources across marketing technology, measurement, AI/ML, geopolitics, and business strategy. The volume is unmanageable without filtering, and most aggregation tools don't understand what I actually care about. I wanted something that could learn my interests at a granular level and surface only the content worth my time.

## How It Works

The system runs a three-stage pipeline:

1. **Fetch** — Pulls from RSS feeds, podcasts, and Reddit. Trafilatura handles text extraction. Whisper transcribes podcast audio.
2. **Triage** — A local Ollama model does fast first-pass filtering against a weighted interest profile. Core topics (measurement evolution, privacy-first analytics, attribution vs. MMM) get highest priority. Press releases and announcements get filtered out.
3. **Analysis** — Surviving articles go to Claude for deeper synthesis: extracting "why this matters" insights, connecting themes across sources, and generating the final digest.

<figure>
<svg viewBox="0 0 680 780" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A pipeline diagram showing the personal digest system: RSS and Reddit feed into fetch while podcasts go through a separate Whisper transcription pipeline, both merge into local LLM triage, then a file-based handoff to Claude Cowork for analysis, then scoring and digest assembly, ending with a daily email.">
<text x="340" y="22" font-family="Literata, Georgia, serif" font-size="15" fill="#1a1a1a" font-weight="600" text-anchor="middle" letter-spacing="-0.01em">Personal Digest Pipeline</text>

<!-- Sources -->
<rect x="60" y="46" width="160" height="42" rx="3" fill="#1a1a1a" opacity="0.025"/>
<line x1="60" y1="88" x2="220" y2="88" stroke="#e8e5e0" stroke-width="1"/>
<text x="140" y="65" font-family="Literata, Georgia, serif" font-size="13" fill="#1a1a1a" font-weight="600" text-anchor="middle">RSS Feeds</text>
<text x="140" y="80" font-family="Outfit, sans-serif" font-size="9" fill="#999" text-anchor="middle">YAML config</text>

<rect x="260" y="46" width="160" height="42" rx="3" fill="#1a1a1a" opacity="0.025"/>
<line x1="260" y1="88" x2="420" y2="88" stroke="#e8e5e0" stroke-width="1"/>
<text x="340" y="65" font-family="Literata, Georgia, serif" font-size="13" fill="#1a1a1a" font-weight="600" text-anchor="middle">Reddit</text>
<text x="340" y="80" font-family="Outfit, sans-serif" font-size="9" fill="#999" text-anchor="middle">subreddits</text>

<rect x="460" y="46" width="160" height="42" rx="3" fill="#1a1a1a" opacity="0.025"/>
<line x1="460" y1="88" x2="620" y2="88" stroke="#e8e5e0" stroke-width="1"/>
<text x="540" y="65" font-family="Literata, Georgia, serif" font-size="13" fill="#1a1a1a" font-weight="600" text-anchor="middle">Podcasts</text>
<text x="540" y="80" font-family="Outfit, sans-serif" font-size="9" fill="#999" text-anchor="middle">RSS feeds</text>

<!-- Arrows down from RSS + Reddit to Fetch -->
<line x1="140" y1="88" x2="140" y2="112" stroke="#ccc" stroke-width="0.8"/>
<polygon points="137,112 143,112 140,120" fill="#ccc"/>
<line x1="340" y1="88" x2="340" y2="112" stroke="#ccc" stroke-width="0.8"/>
<polygon points="337,112 343,112 340,120" fill="#ccc"/>

<!-- Arrow down from Podcasts to Podcast Pipeline -->
<line x1="540" y1="88" x2="540" y2="112" stroke="#ccc" stroke-width="0.8"/>
<polygon points="537,112 543,112 540,120" fill="#ccc"/>

<!-- Fetch (articles only - left/center) -->
<rect x="60" y="122" width="340" height="44" rx="3" fill="#1a1a1a" opacity="0.025"/>
<line x1="60" y1="166" x2="400" y2="166" stroke="#e8e5e0" stroke-width="1"/>
<text x="230" y="142" font-family="Literata, Georgia, serif" font-size="13" fill="#1a1a1a" font-weight="600" text-anchor="middle">Fetch + Deduplicate</text>
<text x="230" y="158" font-family="Outfit, sans-serif" font-size="9.5" fill="#999" text-anchor="middle">pull new items, skip known URLs, store in SQLite</text>

<!-- Podcast pipeline (right) -->
<rect x="420" y="122" width="200" height="44" rx="3" fill="#1a1a1a" opacity="0.025"/>
<line x1="420" y1="166" x2="620" y2="166" stroke="#e8e5e0" stroke-width="1"/>
<text x="520" y="142" font-family="Literata, Georgia, serif" font-size="13" fill="#1a1a1a" font-weight="600" text-anchor="middle">Podcast Pipeline</text>
<text x="520" y="158" font-family="Outfit, sans-serif" font-size="9.5" fill="#999" text-anchor="middle">download &#8594; Whisper &#8594; transcript</text>

<!-- Merge arrows into triage -->
<line x1="230" y1="166" x2="230" y2="188" stroke="#ccc" stroke-width="0.8"/>
<line x1="230" y1="188" x2="340" y2="202" stroke="#ccc" stroke-width="0.8"/>
<line x1="520" y1="166" x2="520" y2="188" stroke="#ccc" stroke-width="0.8"/>
<line x1="520" y1="188" x2="340" y2="202" stroke="#ccc" stroke-width="0.8"/>
<polygon points="337,202 343,202 340,208" fill="#ccc"/>

<!-- Triage - accent box -->
<rect x="100" y="210" width="480" height="62" rx="3" style="fill: var(--color-accent)" opacity="0.1"/>
<rect x="100" y="210" width="480" height="62" rx="3" fill="none" style="stroke: var(--color-accent)" stroke-width="1" opacity="0.4"/>
<text x="340" y="231" font-family="Literata, Georgia, serif" font-size="13" style="fill: var(--color-accent-text)" font-weight="600" text-anchor="middle">Triage &#8212; Local LLM</text>
<text x="340" y="248" font-family="Outfit, sans-serif" font-size="9.5" fill="#888" text-anchor="middle">llama3.1:8b via Ollama &#183; scores 1&#8211;5 relevance</text>
<text x="340" y="262" font-family="Outfit, sans-serif" font-size="9.5" fill="#888" text-anchor="middle">auto-rejects press releases, listicles, vendor content</text>

<!-- Arrow with label -->
<line x1="340" y1="272" x2="340" y2="304" stroke="#ccc" stroke-width="0.8"/>
<polygon points="337,304 343,304 340,312" fill="#ccc"/>
<text x="358" y="294" font-family="Outfit, sans-serif" font-size="8.5" fill="#bbb" font-style="italic">accepted items only</text>

<!-- Dashed handoff zone -->
<rect x="80" y="314" width="520" height="206" rx="4" fill="none" stroke="#d4cfc8" stroke-width="0.75" stroke-dasharray="5 4"/>
<text x="340" y="332" font-family="Outfit, sans-serif" font-size="8" fill="#bbb" text-anchor="middle" letter-spacing="0.08em" style="text-transform:uppercase">FILE-BASED HANDOFF</text>

<!-- Export -->
<rect x="200" y="342" width="280" height="34" rx="3" fill="#1a1a1a" opacity="0.025"/>
<text x="340" y="357" font-family="Outfit, sans-serif" font-size="10.5" fill="#555" text-anchor="middle">export pending-analysis.json</text>
<text x="340" y="370" font-family="Outfit, sans-serif" font-size="8.5" fill="#bbb" text-anchor="middle">written to disk by pipeline</text>

<line x1="340" y1="376" x2="340" y2="394" stroke="#ccc" stroke-width="0.8"/>
<polygon points="337,394 343,394 340,402" fill="#ccc"/>

<!-- Cowork analysis - accent box -->
<rect x="120" y="404" width="440" height="60" rx="3" style="fill: var(--color-accent)" opacity="0.1"/>
<rect x="120" y="404" width="440" height="60" rx="3" fill="none" style="stroke: var(--color-accent)" stroke-width="1" opacity="0.4"/>
<text x="340" y="424" font-family="Literata, Georgia, serif" font-size="13" style="fill: var(--color-accent-text)" font-weight="600" text-anchor="middle">Analysis &#8212; Cowork Scheduled Task</text>
<text x="340" y="440" font-family="Outfit, sans-serif" font-size="9.5" fill="#888" text-anchor="middle">summary, why it matters, contrarian flag, shelf-life estimate</text>
<text x="340" y="454" font-family="Outfit, sans-serif" font-size="8.5" style="fill: var(--color-accent-text)" text-anchor="middle" font-style="italic">no API cost &#8212; runs on Claude Pro subscription</text>

<line x1="340" y1="464" x2="340" y2="474" stroke="#ccc" stroke-width="0.8"/>
<polygon points="337,474 343,474 340,482" fill="#ccc"/>

<!-- Import -->
<rect x="200" y="484" width="280" height="24" rx="3" fill="#1a1a1a" opacity="0.025"/>
<text x="340" y="500" font-family="Outfit, sans-serif" font-size="10.5" fill="#555" text-anchor="middle">import analysis-results.json</text>

<!-- Arrow out of dashed zone -->
<line x1="340" y1="520" x2="340" y2="536" stroke="#ccc" stroke-width="0.8"/>
<polygon points="337,536 343,536 340,544" fill="#ccc"/>

<!-- Score + rank -->
<rect x="100" y="546" width="480" height="52" rx="3" fill="#1a1a1a" opacity="0.025"/>
<line x1="100" y1="598" x2="580" y2="598" stroke="#e8e5e0" stroke-width="1"/>
<text x="340" y="566" font-family="Literata, Georgia, serif" font-size="13" fill="#1a1a1a" font-weight="600" text-anchor="middle">Score + Rank</text>
<text x="340" y="582" font-family="Outfit, sans-serif" font-size="9.5" fill="#999" text-anchor="middle">quality signals, interest tiers, source diversity cap (max 2 per source), recency decay</text>

<line x1="340" y1="598" x2="340" y2="622" stroke="#ccc" stroke-width="0.8"/>
<polygon points="337,622 343,622 340,630" fill="#ccc"/>

<!-- Digest assembly -->
<rect x="100" y="632" width="480" height="56" rx="3" fill="#1a1a1a" opacity="0.025"/>
<line x1="100" y1="688" x2="580" y2="688" stroke="#e8e5e0" stroke-width="1"/>
<text x="340" y="652" font-family="Literata, Georgia, serif" font-size="13" fill="#1a1a1a" font-weight="600" text-anchor="middle">Digest Assembly</text>
<text x="340" y="668" font-family="Outfit, sans-serif" font-size="9.5" fill="#999" text-anchor="middle">professional articles &#183; personal articles &#183; podcast summaries</text>
<text x="340" y="682" font-family="Outfit, sans-serif" font-size="9" fill="#bbb" text-anchor="middle" font-style="italic">Saturday edition includes tier 3 long-form content</text>

<line x1="340" y1="688" x2="340" y2="712" stroke="#ccc" stroke-width="0.8"/>
<polygon points="337,712 343,712 340,720" fill="#ccc"/>

<!-- Email -->
<rect x="200" y="722" width="280" height="38" rx="3" fill="#1a1a1a" opacity="0.025"/>
<line x1="200" y1="760" x2="480" y2="760" stroke="#e8e5e0" stroke-width="1"/>
<text x="340" y="740" font-family="Literata, Georgia, serif" font-size="13" fill="#1a1a1a" font-weight="600" text-anchor="middle">Email via Resend</text>
<text x="340" y="754" font-family="Outfit, sans-serif" font-size="9" fill="#999" text-anchor="middle">HTML digest &#183; daily by 5 AM &#183; launchd scheduled</text>
</svg>
</figure>

The web dashboard (FastAPI + htmx) lets me manage sources, review triage decisions, browse past digests, and tune the interest weighting over time.

<img src="/projects/digest-activity.png" alt="Activity log showing pipeline operations: fetching, triaging, analyzing, and digest generation" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

<img src="/projects/digest-podcasts.png" alt="Podcasts manager showing 27 feeds with download, transcription, and analysis status" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

<img src="/projects/digest-books.png" alt="Book library with 103 books categorized by topic, with analysis status and shelf life ratings" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

## Tech Stack

- **Backend**: Python, FastAPI, SQLite
- **Content processing**: feedparser, trafilatura, OpenAI Whisper
- **Triage**: Ollama (local LLM for fast filtering)
- **Analysis**: Claude (detailed synthesis and digest generation)
- **Interface**: FastAPI + Jinja2 + htmx + Tailwind CSS
- **CLI**: Typer + Rich for automation workflows


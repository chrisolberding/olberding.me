---
title: "Quick Hit: AI for Fun and No Profit"
subtitle: "Building personal tools with LLMs when there's no product, no users, and no business case."
date: 2026-03-23
description: "Why make money when you can have fun? Quick post highlighting two personal tools I built for myself recently."
cardImage: ../../assets/blog/conference-tool-detail.png
---

Most of the chatter on LLM coding is focused on integrating those tools within existing companies/products or using them to vibe code a new startup. I've dabbled in those spaces myself but lately I've enjoyed a third path: building tools for myself, with no intention of expanding, packaging, or selling them.

This piece is a lot less in depth and heady than what I usually write but I thought it might be fun to showcase a couple of recent use cases.

## Building for a single user removes a lot of the (more boring) complexity

Obvious, but when your only user is yourself, a large category of complexity disappears. No authentication. No multi-tenancy. No load considerations. No error handling for edge cases you'll never hit. No accessibility requirements. No compliance review. The engineering concerns that make software hard aren't usually about functionality, they're about other people, and when there are no other people, you're just solving your own problem in whatever way is most direct.

## Quick note on my stack

Right now I'm using Claude (at the $100/month tier). Below I'll reference Claude Cowork and Claude Code. Claude Cowork is part of Claude's desktop app and can access your computer's file system (renaming files in a messy directory, creating and saving out spreadsheets, that kind of thing). Claude Code is a CLI tool that runs in your terminal also with file system access. If I need to make changes myself my IDE is Visual Studio Code, though in the use cases below that's been pretty rare.

Nothing here is particularly unique to Claude. Most coding LLM tools would handle this kind of small personal project fine.

## Disposable Software: Use Case One, Conference "Cheat Sheet"

I'm pretty bad at networking at conferences. Often I'll go with lofty intentions but once on the ground and without clear or actionable goals I'll slink off and end up working on my laptop or end up at the bar chatting with someone from the unrelated "realtor" conference at the same venue.

<div style="display:flex;gap:12px;justify-content:center;margin:1.5em 0;flex-wrap:wrap">
<img src="/conference-tool-list.png" alt="Conference tool list view showing tiered contacts with photos, tags, and scores" style="max-width:280px;width:45%;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.3)">
<img src="/conference-tool-detail.png" alt="Conference tool showing an expanded contact card with photo, tags, conversation hook, and mark-as-met button" style="max-width:280px;width:45%;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.3)">
</div>

Starting in Claude Cowork (a mistake I'll explain in a moment), I had Claude pull the attendee and speaker list from the conference website (authenticated), enrich each person with company data, LinkedIn profile, job title, and a photo pulled via Playwright automation, then rank and tier every contact against my stated goals for the event. The output is a single HTML file I can load on my phone: tap a card to see a conversation starter, mark someone as met for followups later, jot a note after talking to them.

Key features:

- **Tiered and tagged contacts** scored against my stated goals, so the highest-value conversations surface first
- **Tap-to-expand cards** with role context, company background, and a suggested conversation opener for each person
- **Profile photos** for recognition
- **Mark as met** so I know who to circle back with after the event
- **Quick notes** per contact after a conversation, what you talked about, any follow-up items
- **Search and filter** by name, company, tier, or met status

The whole thing is 250KB. No backend, no database. Using localStorage for the small amount of data collection, which obviously wouldn't work in most cases but I just need it on a single device for a week. I pushed it to a subdirectory on my personal site on GitHub Pages because it's basically just an HTML page.

I started this in Cowork because initially I had just planned on getting some help identifying the top few targets, but as the scope grew (photo scraping, company URL resolution, PWA manifest, filtering logic), I ended up moving it over to Claude Code, where I should have started the project anyway.

You can see a sanitized demo version at [olberding.me/conference-tool-example](/conference-tool-example) if you want to poke at it. Fake names, companies, and photos so I can share here, but the functionality is intact.

## Use Case Two: Personal Digest

Aggregating news and articles isn't novel. There are plenty of existing tools for this, but I wanted to customize a feed deeply and use an LLM for analysis in ways no off-the-shelf tool would let me.

Key features:

- **RSS feeds, subreddits, and podcasts** with per-source quality priors configured in YAML
- **Interest tiers** with explicit "covers / does not cover" boundaries and quality signals that boost practitioner content and penalize vendor marketing
- **Local LLM triage** (llama3.1:8b via Ollama) scoring each item 1–5 for relevance and auto-rejecting press releases, listicles, and vendor content before anything hits the analysis step
- **Each surviving article** gets an analytical summary, a "why it matters" note, a contrarian flag where relevant, and a shelf-life estimate
- **Podcasts** are auto-downloaded, transcribed locally via Whisper, and analyzed separately with a prompt tuned to extract key claims and surface contrarian takes
- **A source diversity cap** (max 2 items per source) so no single outlet dominates the digest
- **Weekly Saturday edition** that includes longer-form content that doesn't make the daily cut
- **A web interface** for editing sources, reviewing pipeline logs, and monitoring the pipeline visually (how many items were fetched, survived triage, completed analysis, and are queued for the digest) plus source quality indicators over time

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

The system monitors those sources, runs everything through the local LLM for initial scoring and filtering, and then passes surviving items to a scheduled Claude Cowork task for actual analysis. The output is an email that lands in my inbox by 5am: a curated set of articles and podcast summaries.

The podcast handling is the part I find most useful. Each episode gets auto-downloaded overnight and transcribed locally via Whisper. The analysis prompt is tuned specifically to surface contrarian viewpoints and extract the key claims, with the explicit goal of letting me decide whether the episode is worth an hour of my time or whether the summary is sufficient. Most of the time, the summary is sufficient.

The analysis step has a useful wrinkle: rather than calling the Claude API directly and incurring per-token costs, the pipeline exports pending items to a JSON file, a scheduled Cowork task picks them up, analyzes them, and writes results back to another JSON file that the next pipeline run imports. Frontier-model analysis at zero marginal cost, piggybacking on a subscription I'm already paying for.

## Building for yourself

This isn't a how-to guide. There are almost certainly better ways to approach both of these. But "better" in software usually means more maintainable, more scalable, more generalizable, and none of that applies when you're building for yourself. The hard decisions don't need to be made.

What AI coding tools have given me is the ability to build personal software that actually fits how I work, without the overhead of solving problems I don't have.

---
title: "Conference Networking Tool"
subtitle: "A disposable app for intentional conference networking"
date: 2026-02-15
description: "A lightweight tool that turns LinkedIn research into an actionable conference networking cheat sheet with tiered contacts, conversation hooks, and tracking."
cardImage: ../../assets/blog/conference-tool-list.png
status: "Built for Domopalooza 2026 and used successfully. The tool is intentionally disposable: the value is in the preparation process and the event itself, not in maintaining software afterward. The approach could be replicated for any conference with a known attendee list."
---

A lightweight, purpose-built tool for conference networking. It takes LinkedIn profile data for conference attendees, organizes contacts into priority tiers, and provides an interactive interface with photos, conversation hooks, and a way to track who you've met.

<div style="display:flex;gap:12px;justify-content:center;margin:1.5em 0;flex-wrap:wrap">
<img src="/conference-tool-list.png" alt="Conference tool list view showing tiered contacts with photos, tags, and scores" style="max-width:280px;width:45%;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.3)">
<img src="/conference-tool-detail.png" alt="Conference tool showing an expanded contact card with photo, tags, conversation hook, and mark-as-met button" style="max-width:280px;width:45%;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.3)">
</div>
<p style="text-align:center;margin-top:-0.5em;margin-bottom:1.5em;font-size:0.85em;color:#999;font-style:italic">Screenshots use simulated data</p>

## The Problem

I'm bad at networking at conferences. I'd go with lofty intentions but end up working on my laptop or chatting with someone from the unrelated realtor conference at the same venue. The issue wasn't willingness but a lack of actionable preparation: knowing who to look for, why I'd want to talk to them, and what to say.

## How It Works

A set of Python scripts automate the research phase: scraping LinkedIn profiles via Playwright, extracting professional details, downloading photos, and checking for geographic or professional connections. The output is a single HTML file (no server needed) that acts as a pocket cheat sheet during the event.

Contacts are organized into priority tiers (A through C) with photos, company info, relevant context, and suggested conversation hooks. During the conference, you can mark contacts as met and keep notes on each person for follow-ups.

## Tech Stack

- **Automation**: Python, Playwright (browser automation), asyncio
- **Data**: JSON for contact metadata and state
- **Interface**: Self-contained HTML file with embedded data (no server, works offline)


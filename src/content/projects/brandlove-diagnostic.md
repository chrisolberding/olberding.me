---
title: "BrandLove Diagnostic"
subtitle: "A brand health self-assessment tool for marketing leaders"
date: 2026-02-01
description: "An interactive quiz that scores brand health across five dimensions and generates a personalized PDF report, built for HDco."
cardImage: ../../assets/blog/brandlove-landing.png
status: "In development with the client. The quiz flow, scoring, PDF generation, and CRM integration are all functional. The architecture keeps it lightweight: one Docker container serves both the static Astro build and the Express API routes."
---

A self-assessment tool for marketing leaders built for HDco. The diagnostic presents 15 conversational questions across five dimensions of brand health, scores responses, and generates a personalized PDF report with actionable recommendations.

<img src="/projects/brandlove-landing.png" alt="BrandLove Diagnostic landing page with sample score card showing dimension breakdowns" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

## How It Works

The quiz covers five dimensions: brand clarity, audience alignment, marketing efficiency, competitive positioning, and marketing intelligence. Each dimension gets three questions with responses scored on a 1/3/5 scale.

<img src="/projects/brandlove-question.png" alt="Quiz interface showing a Brand Clarity question with three response options" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

After completing the assessment and providing contact information, users receive an immediate scored verdict (Brand Emergency, Brand Confused, or Brand Ready) with per-dimension breakdowns. A downloadable PDF report is generated server-side with detailed findings. The tool integrates with ActiveCampaign for CRM sync and lead tagging.

<img src="/projects/brandlove-results.png" alt="Results page showing a Brand Confused verdict with score breakdown and recommendations" style="border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.1);margin:1.5em 0">

## Tech Stack

- **Frontend**: Astro + Preact (interactive quiz island, static landing/results pages)
- **Backend**: Express 5 (Node.js, TypeScript)
- **Database**: SQLite (better-sqlite3, WAL mode)
- **PDF generation**: @react-pdf/renderer (server-side React)
- **Email**: Resend (transactional notifications)
- **CRM**: ActiveCampaign REST v3 (contact sync + tagging)
- **Analytics**: PostHog (funnel tracking across quiz stages)
- **Infrastructure**: Docker Compose + Caddy on Hetzner VPS


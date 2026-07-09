---
title: "The Keyword Portfolio: Audit and Rebuild"
order: 2
---

# The Keyword Portfolio

*Working document · exec view up front, full reasoning follows · July 8, 2026 · companion: AI visibility measurement standard*

*What the tracked keyword set in Conductor is telling us, what good looks like in the enterprise literature, and the audit and rebuild I propose. AEO/GEO measurement is covered in a companion document.*

**Contents**

1.  [Recommendation and summary](#1-recommendation-and-summary)
2.  [What a healthy portfolio looks like](#2-what-a-healthy-portfolio-looks-like)
3.  [What the 90/90 pattern signals](#3-what-the-9090-pattern-signals)
4.  [Conductor mechanics that shape every number](#4-conductor-mechanics-that-shape-every-number)
5.  [The audit and rebuild sequence](#5-the-audit-and-rebuild-sequence)
6.  [Why this matters beyond SEO](#6-why-this-matters-beyond-seo)
7.  [Next steps and open questions](#7-next-steps-and-open-questions)
8.  [Sources](#footnote-label)

## 1. Recommendation and summary

I recommend we rebuild the tracked keyword portfolio in Conductor, executed explicitly as an application of the vendor's own published best practices rather than a standard I am importing. The current portfolio (a couple thousand keywords, with whole groups roughly 90% unranked and other groups roughly 90% top-ranked, some containing hundreds of keywords) shows a pattern the independent literature treats as a red flag, and Conductor's own documentation supplies both the diagnosis rules and the cleanup workflow. Because the standard is the vendor's, the marketing and vendor teams can co-own the work and share the result.

Three findings carry the weight. First, the enterprise literature is consistent on portfolio composition: seoClarity's framework allocates roughly 30% to current winners, 30% to page-two optimization targets, 30% to deliberate competitive gaps, and 10% to experiments, while BrightEdge's rule of thumb caps branded terms at 1–2% of tracked quota.[^3][^4] Groups pinned near 0% or 100% ranked at scale fit neither shape. Second, Conductor's own docs contain the hygiene rules a healthy account runs on: deactivate keywords with zero search volume or no ranking in 6–12 months; segment brand from non-brand with smart groups; map preferred URLs; and note that their Content Opportunity Score deliberately weights toward positions 11–20, the striking-distance segment where effort converts to movement.[^1] Third, two structural mechanics in Conductor shape every reported number: a keyword tracked across multiple locations, devices, or engines counts as multiple tracked keywords (so group sizes may be partly context multiplication), and the market share metric uses the tracked list as its denominator, so a brand-heavy list mechanically manufactures dominant "market share."[^1][^2]

The rest of this document is the working detail, ending with the audit sequence and next steps.

## 2. What a healthy portfolio looks like

No credible source prescribes a fixed keyword count; the consistent expert position is that portfolio size derives from pages, topics, and business lines, constrained by what the team can act on. seoClarity's "BOBs" framework is the most explicit composition model in the enterprise-platform literature: Benchmark terms (roughly 30%, the keywords driving the majority of current non-brand clicks, pulled from Search Console), Optimize terms (roughly 30%, ranking but not page one), Build terms (roughly 30%, keywords where two or more competitors rank and we don't), and Special Projects (roughly 10%).[^3] Two implications worth stating. Even the aspirational bucket is only about a third of a well-designed portfolio, scoped as projects with owners rather than a dumping ground. And because platforms price by tracked keyword, dead entries burn paid quota; seoClarity recommends working only about 5% of deep-unranked keywords per cycle and rotating the tracked set rather than letting it accrete.[^3]

Conductor's own recommended segmentation dimensions match this: brand vs non-brand (smart groups with contains/excludes rules), product lines, search intent and buyer journey, campaigns, seasonal sets, and competitive-gap groups.[^1] On brand proportion, BrightEdge's guidance is the sharpest available benchmark: branded keywords should consume only about 1–2% of the account's tracked quota.[^4] The striking-distance literature (Clearscope and others) defines positions 11–20 as the highest improvement-per-effort segment on an established site, which is where a decision-useful portfolio concentrates its working middle.[^5]

## 3. What the 90/90 pattern signals

The independent literature reads whole groups at 90% unranked alongside whole groups at 90% top-ranked as the signature of a portfolio segmented by outcome rather than strategy. On the winning end, Wordtracker and SEOTesting both describe branded rankings inflating topline performance ("most brands perform relatively well for their own branded terms… making it look like you're doing better than you actually are"), and the practitioner literature has names for the broader genre: vanity keywords, trophy segments, optimization theater.[^4][^6] On the losing end, groups that have sat unranked past Conductor's own 6–12 month window are, by the vendor's standard, dead weight burning quota.[^1] Between them, the striking-distance middle where ROI lives is underrepresented.

Whether that reading applies to our setup is an open question the audit answers, and I want to hold it open rather than resolve it by inference. The charitable reading is live: Conductor's docs explicitly recommend competitive-gap groups (keywords where competitors rank and we don't), and a 90% unranked group can be a deliberate Build project. That said, a gap group without an owner and a content plan is a distinction without a difference, and per the BOBs proportions it should be roughly a third of the portfolio, not its dominant mode. There is also an innocent mechanical explanation to rule out first: context multiplication (Section 4) can inflate group sizes without anyone having chosen those keywords individually. Conductor's docs even sanction a quarantined "CEO's favorite keywords" group, an acknowledgment in the vendor's own materials of how these platforms get used in practice; the issue is never that trophy segments exist, it is when they are load-bearing in reporting.[^1]

> Verbal-only candidate, flagged per drafting standard: the sharper read of how the current composition came to be, and any implication about intent in past reporting. This document states the literature's interpretation and holds the local verdict open; the audit produces facts before anyone produces a story.

## 4. Conductor mechanics that shape every number

Four mechanics from Conductor's documentation matter for reading any report built on this account, all verified in their knowledge base.[^1][^2]

Tracked keyword definition: a tracked keyword is keyword + engine + location + device, and each combination consumes contract quota. One keyword tracked across five contexts appears as five tracked keywords in a group, so "hundreds of keywords" in a group may be partly context multiplication rather than editorial choice. Conductor recommends smartphone plus specific-location tracking as the primary measurement and calls country-level rank "directional."

Market share denominator: the market share report computes how often each web property appears in top 1/5/10 positions across our tracked keyword set. The denominator is the tracked list, so the metric is only as honest as the portfolio; a brand-heavy list mechanically produces dominant market share. The same logic applies to any visibility or share-of-voice number derived from the account.

Content Opportunity Score: a 1–100 score per keyword group, computed from monthly search volume and rank, weighted toward positions 11–20. A direct consequence for our case: a 90% unranked group and a 90% top-ranked group both score poorly on opportunity, and group composition games the score in both directions.

Hygiene workflow: Conductor's stated best practices are to deactivate keywords with zero search volume or no ranking in the last 6–12 months, use the bulk-update tool for mass changes, map preferred URLs from the highest-ranking-URL export ("enterprise organizations that consistently succeed in SEO and significantly increase revenue apply preferred URL management"), and use smart groups so brand/non-brand and intent segmentation self-maintains. Accounts are capped at 500 keyword groups, groups have no sub-groups (hierarchical naming instead), and deleting a group does not deactivate its keywords.

## 5. The audit and rebuild sequence

Assembled from Conductor's rules plus independent frameworks (HawkSEM's audit steps, Clearscope on striking distance, seoClarity's refresh loop), in order:[^1][^3][^5]

| Step | Action | Standard applied |
|----|----|----|
| 1 | Export the full tracked set with groups, volume, rank, and preferred URL (per-group XLSX export) | Conductor workflow |
| 2 | Dedupe context multiplication (same keyword across locations/devices/engines) so the editorial portfolio is visible | Conductor tracked-keyword model |
| 3 | Tag brand vs non-brand; quarantine brand into its own reporting line, target ~1–2% of quota | BrightEdge benchmark; Conductor smart groups |
| 4 | Classify intent and map keywords to target pages; set preferred URLs; surface cannibalization | Conductor preferred-URL guidance; HawkSEM |
| 5 | Apply the deactivation rule (zero volume, or unranked 6–12 months) to the unranked mass, unless a group is re-chartered as an explicit competitive-gap project with an owner and a content plan | Conductor best practices; seoClarity Build criteria |
| 6 | Rebalance toward striking distance (positions 11–20); let Content Opportunity Score surface candidates once composition is honest | Conductor COS; Clearscope |
| 7 | Rebuild share-of-voice and market share reporting on the non-brand set only; refresh the tracked set quarterly | Semrush cadence guidance; BOBs refresh loop |

The reporting payoff arrives quickly: non-brand share of voice becomes an honest number, market share stops being a function of list composition, and the opportunity score starts surfacing real work. HawkSEM's audit framework adds one discipline worth adopting permanently: examine rankings against traffic and conversions, not rank alone, because a high-ranking group that converts nothing is an intent misallocation the rank report will never show.[^7]

## 6. Why this matters beyond SEO

The strongest argument for doing this work now is that it is also AEO work. In Cyrus Shepard's meta-analysis of 54 studies, organic rank scored 9.4/10 as a predictor of AI citation, second only to URL accessibility, and Brainlabs reports 96% of AI Overview links come from top-10 organic results.[^8][^9] A keyword portfolio rebalanced toward winnable striking-distance terms in our actual product categories is the same asset that improves the odds of being cited by AI engines. And the honest non-brand baseline this audit produces is a required input to the Tier 1 executive reporting proposed in the companion measurement document; without it, the SEO line in that dashboard inherits the same inflation problem the AEO metrics have.

## 7. Next steps and open questions

Next steps: pull the full keyword export with groups, volume, rank, and preferred URLs; run the dedupe and brand/non-brand tagging to size the real editorial portfolio (my expectation is the couple-thousand figure shrinks meaningfully); then review the 90% unranked groups with their owners to determine which are deliberate gap projects and which are inheritance, before any deactivation happens.

Open questions I am holding rather than resolving by inference: whether the unranked groups were built as deliberate competitive-gap projects (the group owners can answer this in an hour); how much of the group inflation is context multiplication vs editorial choice (step 2 answers this); and the larger winnability question, which no portfolio audit answers: a site with structural issues and limited historical SEO investment tells you nothing about the size of the opportunity it was never equipped to pursue, and sizing that opportunity is separate work.

Method note: research conducted July 7, 2026 (12 searches, 6 primary sources fetched in full including four Conductor Knowledge Base articles, quoted verbatim where load-bearing). Vendor guidance and independent practitioner sources are distinguished in citations. Split from the combined July 8 draft; AEO/GEO measurement moved to the companion document.

[^1]: Conductor Knowledge Base, Keyword Tracking Best Practices, Keyword Group Setup, and Keyword Group FAQs (deactivation rules, tracked-keyword model, smart groups, Content Opportunity Score, preferred URLs; verified directly July 7, 2026). [Keyword tracking best practices](https://support.conductor.com/en_US/learning-library/keyword-tracking-best-practices); [Keyword group FAQs](https://support.conductor.com/en_US/intelligence-faqs-and-more/keyword-group-faqs); [Keyword group setup](https://support.conductor.com/en_US/intelligence-setup/keyword-group-setup)
[^2]: Conductor Knowledge Base, Market Share reporting (tracked-list denominator, top 1/5/10, weighted options). [support.conductor.com/en_US/conductor-intelligence/market-share](https://support.conductor.com/en_US/conductor-intelligence/market-share)
[^3]: seoClarity, "How to create the perfect keyword portfolio" (BOBs framework, quota economics, refresh loop). [seoclarity.net](https://www.seoclarity.net/blog/how-to-create-the-perfect-keyword-portfolio)
[^4]: BrightEdge, branded keyword monitoring (1–2% quota rule of thumb). [brightedge.com](https://www.brightedge.com/blog/how-to-monitor-branded-keywords-in-brightedge-in-5-simple-steps); Wordtracker, "How to identify and avoid SEO vanity metrics." [wordtracker.com](https://www.wordtracker.com/blog/seo/how-to-identify-and-avoid-seo-vanity-metrics); SEOTesting, brand vs non-brand reporting. [seotesting.com](https://seotesting.com/blog/brand-vs-non-brand/)
[^5]: Clearscope, striking-distance keywords. [clearscope.io](https://www.clearscope.io/blog/what-are-striking-distance-keywords)
[^6]: OXY Digital on pet/vanity keywords and prioritization. [oxy.digital](https://www.oxy.digital/how-we-actually-prioritize-keywords-and-why-most-agencies-get-it-wrong/); iBeam Consulting, SEO vanity metrics. [ibeamconsulting.com](https://www.ibeamconsulting.com/blog/seo-vanity-metrics/)
[^7]: HawkSEM, five-step keyword audit framework (rankings vs conversions, pausing unwinnable terms, cadence). [hawksem.com](https://hawksem.com/blog/keyword-audit/)
[^8]: Shepard meta-analysis of AI citation factors (54 studies), via ppc.land. [ppc.land](https://ppc.land/23-factors-that-actually-get-your-content-cited-by-ai-search-engines/)
[^9]: Brainlabs AI search report (AI Overview links vs top-10 organic), via ppc.land. [ppc.land](https://ppc.land/brainlabs-report-reveals-ai-search-fundamentally-changes-seo/); Semrush, share of voice measurement and set-refresh cadence. [semrush.com](https://www.semrush.com/blog/measure-seo-share-of-voice/)

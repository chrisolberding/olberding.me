---
title: "Measuring AI Visibility Responsibly"
order: 1
---

# Measuring AI Visibility Responsibly

*Working document · exec view up front, full reasoning follows · July 8, 2026 · companion: SEO keyword portfolio audit*

*What the evidence says about AEO/GEO measurement, what our Conductor setup is actually reporting, and the operating standard I propose we adopt. The SEO keyword portfolio is covered in a companion document.*

**Contents**

1.  [Recommendation and summary](#summary)
2.  [What the tools actually measure, and what my three observations mean](#mechanics)
3.  [The noise floor: why point deltas are not knowledge](#noise)
4.  [What responsible measurement looks like](#responsible)
5.  [A two-move program](#forward)
6.  [Open questions this does not resolve](#open)
7.  [Sources](#sources)

## 1. Recommendation and summary

I recommend we stop litigating whether the AEO numbers are right and instead own the standard by which any number gets reported. Two moves, detailed in Section 5: a calibration sprint that establishes our own noise floor and error rates (two to three weeks, roughly \$100–300 in API costs), and a tiered reporting standard with pre-committed rules for what counts as signal. A defensible measurement practice for AI visibility exists, it is cheap to stand up, and almost no one in B2B has built one yet. That is the opportunity.

Four findings from the research carry the weight. First, no AI visibility vendor publishes calibration or validation data for sentiment, none publishes alias-recall audits (the "D&B" vs "Dun & Bradstreet" problem), and no formal third-party audit of any platform exists; several of the sharpest caveats now come from the vendors' own documentation, with Semrush hedging its own product as "reliable directional signals" and Conductor refusing to sell prompt-volume estimates at all.<sup>[1](#s1),[2](#s2),[10](#s10)</sup> Second, the run-to-run randomness of AI answers is quantified: in SparkToro and Gumshoe's January 2026 study (~3,000 controlled runs), the chance that two runs of the same prompt return the same brand list is under 1 in 100, and the same ordered list under 1 in 1,000.<sup>[3](#s3)</sup> A week-over-week point delta like "citations down 3.4%" sits well inside that noise floor. Third, what survives statistically is visibility rate: the percentage of many repeated runs in which a brand appears, aggregated at topic level, reported per engine, compared against competitors on the same panel.<sup>[3](#s3),[4](#s4),[5](#s5)</sup> Fourth, replication is as cheap as I suspected: Julian Hooks published a working DIY tracker build in Search Engine Land at roughly \$80/month, and Ritner Digital estimates \$50–150/month for a 500-prompt weekly regime.<sup>[6](#s6),[7](#s7)</sup>

The rest of this document is the working detail behind those four sentences.

## 2. What the tools actually measure, and what my three observations mean

Three observations from my review of the current setup prompted this: a sentiment anecdote (responses mentioning risk scoring low, despite risk intelligence being a primary D&B offering), a mention count I could not reconcile by hand (the platform reported 5 mentions on a prompt where I counted 4 instances of "Dun & Bradstreet" and 12+ of "D&B"), and a weighting concern (a single prompt appearing able to contribute many mentions). Each resolves differently, and none resolves the way I first assumed.

### 2.1 How the answers are generated

Conductor states it collects responses through official APIs of the engines it supports (ChatGPT Auto and Search, Gemini, Google AI Mode and AI Overviews, Copilot, Perplexity, Grok), at a user-chosen cadence of daily, weekly, or monthly per topic, with prompts auto-generated from domain context (up to 100 per topic by default).<sup>[1](#s1)</sup> This is one of three collection philosophies in the market, and the vendors market them against each other: Profound captures from the browser and argues APIs don't reflect what users see; Ahrefs runs logged-out free web UIs and discloses it; Semrush explicitly does not use LLM APIs and builds from clickstream data.<sup>[2](#s2),[10](#s10),[11](#s11)</sup> No neutral evidence establishes which best represents real user answers, and none reproduces personalization, memory, or logged-in state. The practical consequence: numbers from different tools are structurally incomparable, and any tool's numbers describe its own panel, not the market.

The de facto industry standard is one run per prompt per engine per day. Hold that against the finding below that 60–100 runs are needed for a stable estimate of a single prompt's answer distribution, and the core measurement problem is visible before any other question gets asked.<sup>[3](#s3)</sup>

### 2.2 Counting rules, and the 5-vs-16 mention anecdote

Conductor's counting rules, verified directly in their knowledge base: a brand mentioned any number of times within a single response counts as one mention for that prompt ("counted as one unique brand mention for that prompt"); a website linked multiple times in one response counts each link as a separate citation; share of voice divides our mentions by all brand mentions across all responses, which Conductor itself warns runs much lower than the percentage of prompts where a brand appears.<sup>[1](#s1)</sup>

This mostly answers my weighting concern for mentions (a single gushing response cannot contribute dozens of mentions in Conductor), but it sharpens the anecdote. If one prompt showed "5 mentions," those are almost certainly five responses containing the brand: one prompt tracked across five engines, or across five collection days, each response counted once. My hand count of a single response (4 instances of "Dun & Bradstreet," 12+ of "D&B") would collapse to at most one counted mention for that response, and to zero if the alias was not matched. Conductor also infers product references as related brand mentions (their example: tracking "Nike" also counts "Air 3"), so a response mentioning only D-U-N-S or Hoovers may register as a brand mention with no literal brand string present.<sup>[1](#s1)</sup> The reconciliation exercise is worth doing precisely, because it tells us which of these regimes the team's numbers live in.

Counting rules differ by vendor in ways that silently change every downstream number. This is the single most useful table to keep on hand when anyone compares tools:

| Vendor | Mention counting | Visibility denominator | Watch-outs |
|----|----|----|----|
| Conductor | Once per response | SOV: all brand mentions across all responses; coverage (% of prompts) reported separately | Refuses to sell prompt-volume estimates; calls competitors' figures proxy-based<sup>[1](#s1)</sup> |
| Profound | Once per response | Excludes responses that mention no brand at all | Same data would read higher than Conductor's SOV<sup>[12](#s12)</sup> |
| Peec | Visibility once per response; SOV counts occurrences | All responses | A 12-occurrence response would inflate Peec SOV, not Conductor's<sup>[13](#s13)</sup> |
| Ahrefs Brand Radar | Literal string matches | Mention/citation share; impressions modeled from Google volume | Only vendor with a published limitations section<sup>[11](#s11)</sup> |
| Semrush | Coverage × consistency composite, position-weighted | Benchmarked to competitor medians | Hedges its own product as "reliable directional signals"<sup>[10](#s10)</sup> |

### 2.3 Entity resolution: the D&B problem is industry-wide and undocumented

No vendor publishes an audit of alias or abbreviation recall. Peec is the only one with visible alias machinery (name, regex, and alias fields per brand, with metric recalculation on change).<sup>[13](#s13)</sup> Conductor configures brand names and domains at the web property level and sub-brands per topic, but documents nothing about abbreviation handling.<sup>[1](#s1)</sup> Semrush claims a proprietary entity extraction system that handles variations but publishes no accuracy figures.<sup>[10](#s10)</sup> Third-party reviewers document the opposite failure too: Position Digital describes tools counting every appearance of generic brand names ("Pulse," "Scout") regardless of context.<sup>[14](#s14)</sup> For a company whose common name in the wild is a three-character abbreviation with an ampersand, alias recall is plausibly the largest single error term in our mention counts, it biases visibility down, and it is checkable in an afternoon: pull the raw responses Conductor stores, count "D&B" occurrences that produced no mention, and we get an alias-recall number no vendor will publish.

### 2.4 Sentiment: uncalibrated by design, and the risk anecdote is a documented failure class

Conductor's sentiment is a 1–10 score assigned by "Conductor's AI engine" (model unspecified): statements within each mention get numeric values that are aggregated and divided by total mentions, organized into fixed categories (Health, Quality, Price, User-friendliness, Popularity, Ethics, Service, Experience).<sup>[1](#s1)</sup> Nothing in that category list resembles risk management, credit, or compliance, the semantic neighborhood where D&B lives. No vendor in the category publishes calibration data, inter-rater agreement, or validation against human labels. Peec's own docs concede their scores compress into a 65–85 band, which means most of the scale is decorative.<sup>[13](#s13)</sup>

The anecdote that prompted this review fits a failure class the NLP literature has documented for years: generic sentiment models systematically misread domain language, which is the entire reason finance-tuned models like FinBERT exist. Words like "risk," "liability," and "credit" carry negative valence in general text and neutral-to-positive valence in financial services contexts, and Kirtac and Germano's work on financial sentiment finds different LLMs produce systematically different scores for the same text.<sup>[15](#s15),[16](#s16)</sup> The broader evidence on LLMs as judges (Zheng et al.) adds that even frontier models judging text agree with humans only around the 80% level, with known position and verbosity biases.<sup>[17](#s17)</sup> An uncalibrated LLM judge scoring risk-intelligence content for a risk intelligence company is exactly where that literature predicts failure. Conductor does surface the underlying statements behind each score in the UI, which makes a calibration audit practical: sample 100 scored statements, hand-label them, compute agreement. If agreement is poor on risk-adjacent content, the sentiment metric comes out of reporting until fixed, and that decision cites data rather than opinion.

## 3. The noise floor: why point deltas are not knowledge

### 3.1 The same prompt does not produce the same answer, even in principle

The strongest independent study to date is SparkToro and Gumshoe's January 2026 experiment: 600 volunteers, 12 prompts, ~2,961 runs across ChatGPT, Claude, and Google's AI surfaces, with the raw data published. Under 1-in-100 odds that two runs of one prompt return the same brand list; under 1-in-1,000 for the same list in the same order. Rank position within AI answers is, in Fishkin's words, not a legitimate metric. However, brand presence converged: top brands appeared in 55–77% of responses regardless of phrasing, and one hospital appeared in 69 of 71 ChatGPT answers while being listed first in only 25. Visibility percentage across 60–100+ runs is statistically defensible; nearly everything else marketed by the category is not.<sup>[3](#s3)</sup>

Vendors cannot patch this away; the cause is numerical. Thinking Machines Lab's work on inference non-determinism showed that even at temperature zero, 1,000 identical requests to a large model produced 80 distinct completions, because floating-point arithmetic under varying server batch loads is not associative.<sup>[18](#s18)</sup> Determinism is achievable only with specially built inference kernels that no consumer AI surface runs. Two arXiv papers now formalize the measurement consequence: visibility must be treated as a distribution estimated by repeated sampling, with bootstrap confidence intervals, and many apparent brand-vs-brand differences fall entirely within the noise floor.<sup>[4](#s4),[5](#s5)</sup> Anthropic's "Adding Error Bars to Evals" is the canonical reference for why any LLM-derived metric needs variance bounds.<sup>[19](#s19)</sup>

### 3.2 Engines do not agree with each other

Kevin Indig's analysis of 3.7M citations across 20,000 prompts found that only 2.37% of cited URLs appear in all three of ChatGPT, Perplexity, and Google AI Overviews for the same prompt; 91% appear in exactly one engine.<sup>[20](#s20)</sup> A single blended "AI visibility score" is therefore the wrong unit of measurement: a brand can look healthy in aggregate while being invisible in two of the three engines that matter. Everything should be reported per engine.

### 3.3 The metrics move violently for reasons that have nothing to do with marketing

Documented, dateable platform events that moved tracked visibility with no brand action involved:

| Event | Measured effect | Source |
|----|----|----|
| ChatGPT algorithm change, Dec 1, 2025 (46 days before ads announcement) | Citations per response +81%; 55.8% of 43 tracked brands lost visibility (p=0.009), on 206k responses | Seer Interactive<sup>[21](#s21)</sup> |
| ChatGPT ads launch and model update, Jan–Mar 2026 | Citations per answer on brand queries fell 41% in five weeks, then recovered to ~90% of baseline; source mix shifted durably | Jarred Smith, seoClarity<sup>[22](#s22)</sup> |
| ChatGPT branded link update, May 7, 2026 | Share of responses containing a URL jumped ~4.5% to 20–24% in one day; referrals roughly doubled | Profound, Avocadots<sup>[23](#s23)</sup> |
| ChatGPT answer-length doubling, Nov 2024 | Visibility scores rose with no change in human exposure: a pure metric artifact | Wil Reynolds<sup>[24](#s24)</sup> |
| No event at all (baseline randomness) | ~70% of answer content changes between repeated runs of the same query; normal WoW variance for SaaS categories estimated at ±15–25% | SparkToro, AICarma<sup>[3](#s3),[25](#s25)</sup> |

Any chart shown to leadership without an annotation layer for events like these invites false attribution in both directions: the team gets blamed for platform noise and credited for platform tailwinds. Neither builds durable credibility.

### 3.4 What "citations down 3.4% from last week" actually asserts

Given the above, that sentence asserts a precise point estimate from a system whose single-prompt reproducibility is under 1%, sampled once per day, on one collection method, across engines that disagree 97% of the time, during a period when platform-side changes routinely move the metric by 40–80%. The most direct published treatment of exactly this problem (Discovered Labs, written by an ex-fraud-detection engineer) proposes the standard the category should be held to: every snapshot carries a 95% credible interval sized by sample count; a change is reported as real only when the evidence strongly favors it over "no change"; and a shift must be sustained across three or more consecutive snapshots before it is called a trend.<sup>[7](#s7)</sup> This mirrors brand-tracking wave rules and statistical process control, the two mature disciplines for reporting noisy series to executives.<sup>[26](#s26)</sup> The same source documented a subtler inflation: all five client prompt sets it audited at onboarding contained brand-anchored prompts, and in the worst case a reported 10.8% mention rate collapsed to 1.9% on unanchored prompts.<sup>[7](#s7)</sup> Auditing Conductor's auto-generated panel for brand anchoring belongs on the sprint checklist.

## 4. What responsible measurement looks like

Independent practitioners, two arXiv papers, and the more candid vendor docs converge on the same handful of practices. Report visibility as a rate with a band, never as a rank and never as an exact delta. Aggregate at topic level; never react at individual prompt level. Report per engine, never blended. Compare competitor-relative within the same panel, model, and week; absolute numbers are not comparable across tools, categories, or time. Require a change to be sustained (the recurring rule is three consecutive periods) before treating it as signal, with one exception: a sudden drop above ~50% warrants immediate technical investigation. Annotate every known platform event on every chart. Cadence tiers: executives see 5–7 KPIs monthly or quarterly on rolling 30/90-day windows; practitioners work weekly.<sup>[3](#s3),[4](#s4),[7](#s7),[25](#s25),[27](#s27),[28](#s28)</sup>

Aleyda Solis adds the discipline most relevant to the separation I want between the measurement plane and the narrative plane: every business-impact number carries a confidence label from a four-layer scale, from observed (referral sessions in GA4, which now ships a native AI Assistant channel) through own proxies (branded search and direct lift, a one-question signup survey) and third-party proxies to modeled, and the layers are never collapsed into one "AI impact" figure.<sup>[29](#s29)</sup> Mike King's framing sets executive expectations correctly: AI search behaves more like a branding channel than a performance channel, so inputs (crawl activity, structured data, passage relevance) and channel metrics (visibility, citations) are reported as leading indicators while revenue-adjacent proof runs through the observed layer.<sup>[30](#s30)</sup> On the value question the evidence is encouraging but nuanced: AI referrals run around 1% of traffic for most sites but convert far better in B2B contexts (Ahrefs: 0.5% of traffic, 12.1% of signups; a Seer client: ChatGPT sessions converting at 15.9% vs 1.76% for organic), while peer-reviewed e-commerce data in Marketing Science shows a smaller and sometimes negative edge. The B2B numbers should be earned locally, not quoted.<sup>[31](#s31),[32](#s32)</sup> And the best-established leading indicator remains unglamorous: organic rank scored 9.4/10 as a predictor of AI citation in Cyrus Shepard's meta-analysis of 54 studies, second only to URL accessibility. The AEO story and the SEO fundamentals story are mostly the same story, which is one reason the keyword portfolio work in the companion document matters for this channel too.<sup>[33](#s33)</sup>

Context worth having: in Indig and Minuttia's survey of 599 marketers, unreliable measurement was the most-cited AEO challenge (40.6%), and Digiday now covers skepticism of the tool category openly.<sup>[34](#s34),[35](#s35)</sup> The skepticism I brought into this review is close to the forming consensus. The differentiator is arriving with the constructive version first.

## 5. A two-move program

The positioning matters as much as the substance. The work I am proposing is constructive by design: building the standard that protects the team's credibility before an executive stress-tests it, with the standard drawn wherever possible from the vendors' own published guidance rather than my opinion. Seer's playbook for the executive conversation opens with the observation that the CEO-asks-ChatGPT-and-we-don't-show-up moment arrives regardless; the only question is whether the team meets it with variance data or with improvisation.<sup>[24](#s24)</sup>

### Move 1: Calibration sprint (2–3 weeks, roughly \$100–300 in API costs)

A bounded project that answers the questions no vendor will: what is our noise floor, and how accurate are the counts? Stratified sample of ~30 prompts from Conductor's panel, run 20–60 times each across 3 engines via API; Julian Hooks' published build and Ritner Digital's estimates put comparable regimes at \$60–150/month.<sup>[6](#s6),[7](#s7)</sup> Four outputs: an alias-recall number (how often "D&B"-only responses are missed, measured against raw responses Conductor already stores); a mention agreement rate between Conductor and hand-counted truth; a sentiment agreement rate on 100 hand-labeled statements, oversampling risk-adjacent content; and our own run-to-run variance, which becomes the empirically derived band around every future number. The sprint also audits the auto-generated prompt panel for brand anchoring.<sup>[7](#s7)</sup> The deliverable is a calibration memo that either validates the tooling (a real win for the team that bought it) or scopes precisely what gets reported with what caveats. Either outcome is progress.

### Move 2: A measurement standard, pre-committed before the next bad number

A one-page charter, agreed with my manager and analytics, that specifies how AI visibility gets reported. The property that makes it work is pre-commitment: caveats negotiated in advance read as rigor; caveats raised after a bad number read as excuses.<sup>[27](#s27)</sup> Contents:

| Tier | Audience / cadence | Metrics | Rules |
|----|----|----|----|
| 1\. Executive | Monthly, 5–7 KPIs | Per-engine visibility rate with band (from Move 1's noise floor); competitor-relative share of voice on the same panel; observed AI referrals and their conversion rate (GA4 AI channel); non-brand SEO share of voice (the companion document covers the portfolio rebuild that makes this number honest) | Rolling 90-day windows; no week-over-week point deltas; platform events annotated on every chart; every number carries a confidence label (observed / proxy / modeled) |
| 2\. Practitioner | Weekly | Full panel detail, citation sources, crawler/agent log activity | Three consecutive periods outside the band before escalation; \>50% sudden drop investigated immediately as technical |
| 3\. Diagnostic | Quarterly | Panel composition review, methodology review, calibration re-run | Methodology changes create a new baseline; old and new reporting run in parallel one quarter |

Two additions matter specifically for D&B. Citation-source analysis stays in the standard, positioned consistent with the view I have been developing: a prioritization instrument (which third-party sources earn citations, therefore where partnership, PR, and reputation effort goes), not a KPI. And an ingestion track enters Tier 2: AI crawler activity from server logs, structured-data coverage, and eventually agent-facing data access. My assessment is that D&B's durable edge in this channel is being the trusted, structured data feed agents read, and ingestion is measurable today with none of the panel noise.<sup>[30](#s30),[36](#s36)</sup>

### What leadership gets

The pressure for AI visibility numbers is real and will not abate, and the answer is a better story rather than fewer numbers. The story this program supports: AI visibility is real, early, and noisy; we measure what can be measured, label what is modeled, and are one of few B2B brands with a calibrated noise floor and a validated panel. When our numbers move, we know it; when competitors quote theirs, we know what questions to ask. That position survives executive scrutiny better than false precision does.

> Verbal-only candidates, flagged per drafting standard and not for written circulation: any framing of executive FOMO dynamics or how the upward narrative gets managed; sequencing of who sees the calibration memo before wider circulation.

Next steps: scope the calibration sprint (prompt sample, engine list, run counts, cost ceiling) and confirm we can export raw stored responses from Conductor; draft the one-page charter for review with Jayme.

## 6. Open questions this does not resolve

Prompt panels remain synthetic: no one has real prompt-volume data, and vendor claims otherwise are unsubstantiated (Lily Ray's assessment: at best highly directional and greatly sampled<sup>[37](#s37)</sup>), though SparkToro's human-prompt data offers partial comfort that consideration sets converge even when phrasing varies wildly.<sup>[3](#s3)</sup> API responses are not consumer-surface responses, and the gap is unquantified; the calibration sprint measures our tool against ground truth we can hold, not against what every real user sees. Sentiment, even calibrated, may not be worth reporting at current maturity; retiring it from Tier 1 is a legitimate outcome. And no measurement program resolves what AI visibility is worth in pipeline; the observed layer (referrals, branded-search lift, a signup survey question) is the only defensible bridge for now, and it should be allowed to stay small until it is real.

## 7. Sources

1.  Conductor Knowledge Base, AI Search FAQs (counting rules, collection method, sentiment, brand configuration; verified directly July 7, 2026). [support.conductor.com/intelligence-faqs-and-more/ai-search-faqs](https://support.conductor.com/intelligence-faqs-and-more/ai-search-faqs)
2.  Profound, collection philosophy and Peec comparison. [tryprofound.com/blog/peec-ai-review](https://www.tryprofound.com/blog/peec-ai-review); Brainlabs, "AI visibility data accuracy." [brainlabsdigital.com/ai-visibility-data-accuracy](https://www.brainlabsdigital.com/ai-visibility-data-accuracy/)
3.  SparkToro / Gumshoe, "AIs are highly inconsistent when recommending brands," Jan 2026 (raw data published). [sparktoro.com](https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/)
4.  Sielinski, "Quantifying Uncertainty in AI Visibility," arXiv:2603.08924. [arxiv.org/abs/2603.08924](https://arxiv.org/abs/2603.08924)
5.  Schulte, Bleeker & Kaufmann, "Don't Measure Once: Measuring Visibility in AI Search (GEO)," arXiv:2604.07585 (abstract verified). [arxiv.org/abs/2604.07585](https://arxiv.org/abs/2604.07585)
6.  Hooks, "Build an AI search visibility tracker," Search Engine Land, Apr 2026 (~\$80/mo build). [searchengineland.com](https://searchengineland.com/build-ai-search-visibility-tracker-473178); Ritner Digital cost estimates. [ritnerdigital.com](https://www.ritnerdigital.com/blog/how-a-marketer-would-actually-build-their-own-ai-visibility-tracker-and-why-its-harder-than-it-sounds)
7.  Discovered Labs, "Why most AEO tools give you noise" (credible intervals, sustained-shift test, brand-anchoring audit). [discoveredlabs.com](https://discoveredlabs.com/blog/aeo-test-bed-noise-vs-signal)
8.  Semrush KB, AI Visibility data sources and methodology. [semrush.com/kb/1607](https://www.semrush.com/kb/1607-semrush-ai-visibility-data)
9.  Ahrefs, Brand Radar methodology (incl. transparency and limitations). [ahrefs.com/blog/brand-radar-methodology](https://ahrefs.com/blog/brand-radar-methodology/)
10. Profound Help, Answer Engine Insights overview (visibility and SOV definitions). [help.tryprofound.com](https://help.tryprofound.com/articles/3443229936-answer-engine-insights-overview)
11. Peec docs: visibility, share of voice, sentiment, brand aliases. [docs.peec.ai](https://docs.peec.ai/metrics/brand-metrics/visibility)
12. Position Digital, AI visibility tool review (entity-collision failures). [position.digital](https://www.position.digital/blog/best-ai-visibility-tracking-tools/)
13. FinBERT and financial-domain sentiment literature. [finbert.org](https://finbert.org/); [arxiv.org/pdf/2410.01987](https://arxiv.org/pdf/2410.01987)
14. Kirtac & Germano, "LLMs in finance: what is financial sentiment?" (cross-model score divergence). [SSRN 5166656](https://papers.ssrn.com/sol3/Delivery.cfm/5166656.pdf?abstractid=5166656&mirid=1)
15. Zheng et al., "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena" (agreement rates, position/verbosity bias). [arxiv.org/abs/2306.05685](https://arxiv.org/abs/2306.05685)
16. Thinking Machines Lab, "Defeating Nondeterminism in LLM Inference," Sept 2025. [thinkingmachines.ai](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/)
17. Anthropic, "Adding Error Bars to Evals," arXiv:2411.00640. [arxiv.org/abs/2411.00640](https://arxiv.org/abs/2411.00640)
18. Indig, "The Consensus Gap," Growth Memo, May 2026. [growth-memo.com/p/the-consensus-gap](https://www.growth-memo.com/p/the-consensus-gap)
19. Seer Interactive, "ChatGPT changed their algorithm 46 days before announcing ads." [seerinteractive.com](https://www.seerinteractive.com/insights/chatgpt-changed-their-algorithm-46-days-before-announcing-ads)
20. Smith, "Your AI citations disappeared in February; they came back different." [jarredsmith.com](https://www.jarredsmith.com/blog/your-ai-citations-disappeared-in-february-they-came-back-different); seoClarity citation decline analysis. [seoclarity.net](https://www.seoclarity.net/chatgpt-citation-decline-analysis)
21. Profound, ChatGPT branded-link referral change, May 2026. [tryprofound.com](https://www.tryprofound.com/blog/chatgpt-referrals-branded-links); Avocadots analysis. [avocadots.com](https://www.avocadots.com/post/chatgpt-update-brand-website-links)
22. Seer Interactive (Reynolds), "AI visibility is a vanity metric: prepare your execs," Feb 2026. [seerinteractive.com](https://www.seerinteractive.com/insights/ai-visibility-is-a-vanity-metric-prepare-your-execs)
23. AICarma, AI search volatility and category variance bands. [aicarma.com](https://aicarma.com/blog/ai-search-volatility/)
24. Brand-tracking wave rules and process behavior charts. [gallowayresearch.com](https://www.gallowayresearch.com/insights/brand-tracking-studies); [commoncog.com](https://commoncog.com/process-behaviour-charts-more-than-you-need/); Forrester, "Beware false precision in your analytics." [forrester.com](https://www.forrester.com/blogs/beware-false-precision-in-your-analytics/)
25. NAV43, four-layer executive dashboard framework for AI visibility. [nav43.com](https://nav43.com/blog/aeo-geo-dashboard-executive-framework-for-ai-search-visibility/)
26. Chasiotis, "Directional data is better than no data" and "The problem with prompt tracking," Growth Waves, Jun 2026. [growthwaves.com](https://www.growthwaves.com/p/ai-search-tracking)
27. Solis, "A 3-layer framework to measure AI presence, readiness, and business impact." [aleydasolis.com](https://www.aleydasolis.com/en/ai-search/a-3-layer-framework-to-measure-ai-presence-readiness-and-business-impact-redefining-metrics-for-the-ai-search-era/); GA4 AI Assistant channel. [searchengineland.com](https://searchengineland.com/google-analytics-ai-assistant-477544)
28. iPullRank (King), "From Clicks to Citations: AI search measurement." [ipullrank.com](https://ipullrank.com/ai-search-measurement)
29. Ahrefs, AI search traffic conversion studies. [ahrefs.com](https://ahrefs.com/blog/ai-search-traffic-conversions-ahrefs/); Seer client conversion case study. [seerinteractive.com](https://www.seerinteractive.com/insights/case-study-6-learnings-about-how-traffic-from-chatgpt-converts)
30. Marketing Science (INFORMS), ChatGPT referral conversion across 973 e-commerce sites. [pubsonline.informs.org](https://pubsonline.informs.org/doi/10.1287/mksc.2025.0489)
31. Shepard meta-analysis of AI citation factors (54 studies), via ppc.land. [ppc.land](https://ppc.land/23-factors-that-actually-get-your-content-cited-by-ai-search-engines/)
32. Indig & Minuttia, State of AEO survey (599 marketers). [growthwaves.com/p/state-of-aeo](https://www.growthwaves.com/p/state-of-aeo)
33. Digiday, "Marketers question expensive AI visibility tools." [digiday.com](https://digiday.com/marketing/marketers-question-expensive-ai-visibility-tools-as-inconsistent-results-fuel-skepticism/)
34. Cloudflare, AI crawler traffic studies. [blog.cloudflare.com](https://blog.cloudflare.com/from-googlebot-to-gptbot-whos-crawling-your-site-in-2025/)
35. Ray, "A reflection on SEO and AI search." [lilyraynyc.substack.com](https://lilyraynyc.substack.com/p/a-reflection-on-seo-and-ai-search)

Method note: research conducted July 7, 2026 via five parallel streams (~60 searches, ~40 sources fetched in full). Load-bearing claims verified against primary sources: Conductor's knowledge base fetched directly and quoted verbatim; arXiv abstracts confirmed; statistics repeated here required convergence across independent streams. Claims that could not be verified were dropped or flagged in text. One known documentation inconsistency: Conductor's FAQ both lists and disclaims Claude/Grok as trackable engines as of June 2026. Split from the combined July 8 draft; the SEO keyword portfolio discussion moved to the companion document.

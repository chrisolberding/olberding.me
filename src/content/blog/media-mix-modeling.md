---
title: "Making the Invisible Visible: A Practical Guide to Media Mix Modeling for Mid-Sized Companies"
subtitle: "Attribution models measure correlation. MMM estimates causation. That distinction is the entire reason it's worth the effort."
date: 2026-03-10
description: "A practical orientation to media mix modeling for mid-sized companies: what it does, when it makes sense, how it interacts with attribution and incrementality testing, and what your options look like for getting started."
---

The conversation plays out in marketing departments with uncomfortable regularity. Leadership reviews the channel performance report, sees that retargeting is delivering a 10:1 ROAS and paid search is at 8:1, and asks why any budget is going to CTV or programmatic prospecting when those channels can't show comparable numbers. The marketing leader explains that upper-funnel channels build awareness, create demand, and enable the bottom-funnel channels to perform, but without data connecting those claims to actual outcomes, it's an argument that depends entirely on the authority of the person making it. Sometimes that's enough. Often it isn't.

I spent the better part of two years in a version of this situation. The measurement framework we had was good at capturing what happened after someone clicked something, and nearly blind to the channels that drove people to click in the first place. Leadership, faced with competing demands on a finite budget, made the rational decision with the information available to them: pressure toward the channels with visible, attributable returns. The result was a media mix that skewed heavily toward bottom-funnel tactics, underinvested in brand and awareness, and gradually became more dependent on capturing existing demand rather than generating new demand. The channels that looked most efficient in the dashboard were, in several cases, taking credit for intent that other channels had created.

Media mix modeling is the measurement approach that can break this pattern. It's been around since the 1950s<sup class="cite-ref" data-ref="1" id="ref-1-back"><a href="#ref-1">1</a></sup> and was long the domain of large CPG companies and major broadcasters with data science teams and enough historical data to make the models work reliably. What's changed in the last five years is accessibility. Open-source frameworks from Meta and Google, combined with cloud computing and a generation of analysts who've grown up with Python, have brought MMM within reach of mid-sized companies in a way that simply wasn't true before. Most marketing leaders at companies spending $5 million to $50 million on media haven't fully registered this shift, or what it means for how they can approach the bottom-funnel pressure problem.

This is a practical orientation to what MMM is, when it makes sense to pursue it, the key concepts you need to understand, and what your options look like for getting started.

## What MMM Actually Does

At its core, a media mix model is a statistical regression that decomposes your business outcome (revenue, leads, account opens, whatever you're optimizing for) into contributions from marketing activity and everything else. The "everything else" matters: the model has to account for seasonality, macroeconomic conditions, competitor behavior, pricing changes, distribution expansions, and the baseline demand your brand would generate even if you ran no advertising at all. That baseline is often 50-70% of total outcomes,<sup class="cite-ref" data-ref="2" id="ref-2-back"><a href="#ref-2">2</a></sup> which is one of the more humbling things a first model run will tell you.

What's left after accounting for baseline and external factors is the portion of your outcome that marketing actually contributed, allocated across channels. The model produces estimates of each channel's incremental effect, not how many conversions it touched, but how many conversions it caused that wouldn't have happened otherwise. That distinction is the entire reason MMM is worth the effort. Attribution models (last-click, multi-touch, or otherwise) measure correlation between channel activity and conversion events. MMM, done properly, estimates causation. A channel that appears in every converting customer's journey can still have low incremental value if those customers would have converted anyway through other paths.

Two foundational concepts shape how these models work.

### Adstock: Advertising effects linger

Adstock is the way MMM represents the fact that advertising effects aren't instantaneous or short-lived. A CTV ad someone watched three weeks ago might still be influencing their decision to search your brand name today. The model represents this as a decay function: the effect of an ad flight diminishes over time at a rate that varies significantly by channel. Paid search effects decay in days; TV and CTV effects can carry for weeks. Getting those decay rates right has a meaningful effect on what the model says each channel is worth, and estimating them well requires enough variation in spending patterns over time that the model can actually observe the effect fading.

### Saturation: The diminishing returns problem

Saturation means diminishing returns. The tenth million dollars you put into a channel doesn't perform like the first million. MMM models the shape of that curve for each channel, and that curve is what drives budget optimization outputs. If your paid social saturation curve bends sharply at a certain spend level but your display curve is still climbing, the model is giving you specific, actionable guidance about where the next dollar should go. These curves are also among the harder things to estimate precisely, because you need meaningful variation in spend levels across time periods, both high-spending and low-spending periods, to map them with confidence.

## Is Your Business Ready for It?

MMM is not the right approach for every company at every stage. A few honest conditions worth working through before investing in it.

### The data requirements

You need at least two years of consistent data, and preferably three. The model needs enough history to separate channel effects from seasonality, observe enough spending variation to estimate saturation curves, and capture the time dynamics of adstock. Companies that have significantly changed their measurement infrastructure, rebranded, or restructured their channel mix partway through that window will have a more complicated dataset to work with, but that doesn't disqualify them. It means the model needs more careful specification around those transition periods.

You need enough outcome volume to model reliably. A company generating 50 conversions a week nationally has a noisy dependent variable, and the model will struggle to detect channel-level effects against that noise. The threshold varies with your channel mix and the statistical approach, but as a rough benchmark, if you're below a few hundred conversions a week, MMM will produce wide confidence intervals and should be supplemented with other evidence before informing major budget decisions.

Your channel mix needs real variation. If you've run essentially the same media mix at roughly the same spending levels for three years, the model has limited ability to separate channel contributions because they're all moving together. The more your spending has varied across channels and time periods, the better the model can estimate individual effects.

### The organizational requirement

The organizational condition is harder to meet than the data conditions. You need leadership willing to act on findings that may challenge existing assumptions. An MMM that shows your highest-ROAS channel in the attribution dashboard is generating weak incremental returns is not a comfortable result to present, especially when that channel has internal advocates who built their case on the dashboard numbers. If the answer to "what happens when the model contradicts the attribution report?" is "we ignore the model," the investment in building one isn't justified.

## Three Legs, Not One

It's common for marketing measurement conversations to treat MMM, platform attribution, and incrementality testing as competing methodologies, as if picking one means dismissing the others. That framing misses what each of them is actually built to answer.

### Leg one: Platform reporting and attribution

Platform reporting and last-click or multi-touch attribution (MTA) is your operational layer. It tells you, in near real time, which campaigns are running efficiently against their own benchmarks. CTR, CPA, ROAS as reported by the platform, this is what campaign managers use to make daily decisions about bids, creative rotation, and audience segmentation. It's fast, it's granular down to the ad level, and it's useful for in-flight optimization. What it doesn't tell you is whether any of that activity is driving incremental outcomes. Every platform grades its own homework, and last-click attribution in particular concentrates credit at the bottom of the funnel regardless of where the actual causal work happened. Retargeting routinely shows 10:1 or 12:1 ROAS in platform dashboards. Incrementality tests on the same channel regularly come back at 1.5:1 to 2:1,<sup class="cite-ref" data-ref="3" id="ref-3-back"><a href="#ref-3">3</a></sup> because most of those "conversions" were people already in the purchase journey who would have completed it through another path.

### Leg two: Media mix modeling

MMM is your strategic layer. It operates on a quarterly or annual cadence and answers a different question entirely: given everything that happened across all your channels over the past two-plus years, what is each channel actually contributing to business outcomes in aggregate? MMM sees the TV flight that generated no clicks but correlates with a measurable lift in baseline conversion rates for the following three weeks. It sees that paid social prospecting and CTV seem to amplify each other's effects when they run together. It sees that your highest-ROAS channel in the attribution dashboard is, net of cannibalization and base demand, contributing a fraction of what the dashboard suggests. It's slow, it's aggregated, and it doesn't help you decide which ad creative to pause on Thursday. But it's the closest thing available to a truthful accounting of what's actually working at the budget allocation level.

### Leg three: Incrementality testing

Incrementality testing (geo-holdout experiments, platform lift studies, time-series suppression tests) is the third leg, and the one that makes the other two more credible. A geo-holdout test on paid search involves suppressing the channel in a set of matched test markets while maintaining it in control markets, then measuring the difference in outcomes. That experiment produces a direct causal estimate of what the channel is actually driving, with no modeling assumptions sitting between you and the answer. Those results serve two purposes: they validate, or challenge, what both the attribution dashboard and the MMM are saying, and they feed back into the model as calibration anchors, called priors in Bayesian statistics, that help the model estimate channel effects more accurately where the observational data alone can't separate them.

### How the three interact

The three legs reinforce each other in a specific way. Attribution tells you what paths people took. MMM estimates what each channel caused. Incrementality tests give you controlled causal evidence for the channels you can test, which calibrates the MMM and provides a reality check on attribution. When all three point in the same direction for a channel, you can be reasonably confident. When they disagree, and they will disagree, the disagreement itself is information. If MMM says CTV delivers a 2:1 iROAS but incrementality testing suggests it's closer to 3:1, that's a specification issue worth investigating, not a reason to distrust both. If retargeting shows a 10:1 ROAS in platform reporting but your holdout test says 1.8:1, that tells you roughly 80% of retargeting's attributed value is cannibalization of organic conversions, a finding that should materially change how you budget that channel.

### Building channel translation factors

The most valuable analytical asset a marketing organization can build over time is a set of channel-level translation factors: how much to discount platform ROAS to approximate incremental ROAS, based on the best evidence available from testing and modeling. A channel that carries a 10:1 platform ROAS but a 1.5:1 incremental ROAS should be budgeted very differently than one where those numbers are 5:1 and 4:1. Most companies don't have those translation factors. The ones that do make materially better budget decisions, and they're considerably harder to push around by leadership who've seen an impressive dashboard number.

### A note on priors and intellectual honesty

The Bayesian MMM approach can be gamed, and it's worth being direct about how. A prior is a probabilistic statement of what you believe about a channel's effect before the model runs. The model combines that prior with the observational time series data to produce a posterior estimate. When the data is informative, it moves the estimate; when the data is weak, the prior dominates. This is valuable when the prior comes from a well-designed incrementality test. It's a liability when someone sets an aggressive prior because leadership likes a particular channel. The way to keep yourself honest is to examine how much each posterior estimate moved from the prior. Channels where the posterior barely budged are channels where you're mostly asserting an effect rather than measuring one. Responsible vendors and analysts should show you this movement as a standard part of the output. If they don't, ask for it.

## Do You Actually Need MMM to Solve This Problem?

Before getting into implementation options, there's a question worth sitting with directly: if we already know that last-click attribution systematically undercredits upper-funnel channels, and if industry benchmarks on healthy media mix ratios are reasonably well-established, why not just reallocate toward upper funnel and skip the modeling entirely?

For some companies, that's the right call.

### The case for skipping MMM entirely

A business spending $3 million a year on media, with a lean marketing team and no analyst capable of running a serious model, probably shouldn't pursue MMM. The investment in data infrastructure, tooling or vendor fees, and the analytical resources to interpret outputs honestly is unlikely to be proportionate to the budget decisions it's informing. The more pragmatic path is to get comfortable with the principle that bottom-funnel attribution is structurally biased, understand roughly what a balanced media mix looks like for your category, and make a reasoned judgment call.

### What the industry research actually says

Industry benchmarks are category-dependent enough to be somewhat loose as a guideline, but a few patterns are well-established. Most marketing science research suggests that for consumer brands, something in the range of 60/40 to 55/45 upper-funnel to lower-funnel is consistent with long-term growth optimization,<sup class="cite-ref" data-ref="4" id="ref-4-back"><a href="#ref-4">4</a></sup> a ratio that would alarm anyone reading the attribution dashboard at a company where retargeting and brand search have migrated toward 70% or more of total budget. LinkedIn's B2B Institute has published research supporting the 95/5 rule:<sup class="cite-ref" data-ref="5" id="ref-5-back"><a href="#ref-5">5</a></sup> roughly 95% of your potential market isn't in-market at any given time, which implies that a media mix skewed almost entirely toward bottom-funnel demand capture is misallocated if you care about long-term growth. The Ehrenberg-Bass Institute's work on mental availability<sup class="cite-ref" data-ref="6" id="ref-6-back"><a href="#ref-6">6</a></sup> points in the same direction. Brand-building investment has effects that compound over time in ways that pure performance measurement will never capture.

None of this is a substitute for measuring your own business. Your category, competitive position, product consideration cycle, and the relative strength of your brand equity all affect what the right ratio looks like for you specifically. But directionally, if your media mix is running at 80% or more bottom-funnel and leadership's objection to changing it is "the dashboard says these are our best channels," that's an information problem that can sometimes be addressed with the argument rather than the model.

### The $10 million threshold

The practical test for whether you need MMM: are the budget decisions you're making significant enough, and uncertain enough, that the cost of being wrong exceeds the cost of building the measurement capability? For a company spending $5 million annually, a 20% misallocation is a $1 million question. If proper MMM and incrementality testing costs $200,000 a year to run well, the math can justify it, but only if the organization will actually act on what the model says. A model that gets ignored because it's inconvenient is worth nothing.

### The middle path: platform lift studies

There's a middle path that smaller companies often underuse: platform-native lift studies. Meta's conversion lift, Google's brand lift, and similar tools available through major platforms aren't MMM, and they carry the caveat that the platform is running its own measurement, which creates obvious incentive problems. But a well-designed platform lift study is better than attribution at answering the incremental question for that specific channel, costs nothing beyond the test budget, and requires no modeling infrastructure. Running lift studies on your top two or three largest channels, and being appropriately skeptical of results that look suspiciously favorable to the platform, can give you enough directional evidence to defend a reallocation without a full MMM program. Imperfect evidence pointing in the right direction is more useful than precise evidence pointing the wrong way.

Companies with media budgets below roughly $10 million should seriously evaluate whether the industry-norms-plus-lift-tests path is sufficient before committing to MMM infrastructure. Companies above that threshold, especially those where the leadership pressure toward bottom-funnel spending is actively distorting the mix, are increasingly in the range where MMM's costs are justified by the decisions it enables.

## Your Options for Getting Started

The tooling picture has three distinct tiers, with meaningfully different tradeoffs on cost, flexibility, and required expertise.

### Open-source frameworks

Meta's Robyn and Google's Meridian are the two most prominent open-source options, with PyMC-Marketing as a more technically demanding alternative. All three are free and have been published with sufficient documentation to get a competent analyst started.

Robyn (which runs in R) uses a search-based approach: it evaluates thousands of candidate model configurations across different adstock and saturation parameter combinations, then presents a set of solutions representing different tradeoffs between statistical fit and business plausibility. The output is a "Pareto front" of models you evaluate and select among. It has a large user community, active ongoing development, and a built-in budget optimizer. The tradeoffs are real: you sacrifice some statistical rigor (you don't get true uncertainty quantification on your estimates, so you can't easily express how confident the model is in each channel's contribution), and someone still has to pick from the Pareto front, which reintroduces human subjectivity.

Meridian, Google's framework, is fully Bayesian and Python-native, designed specifically around geographic-level modeling using spend and outcome variation across DMAs or states rather than national weekly totals. The geo-level approach is methodologically superior when you have the data to support it, because it dramatically increases the number of observations available to the model and provides the kind of spending variation that helps with channel identification. The catch is that you need geo-level spend data for all your channels, which requires data infrastructure many mid-market companies don't have out of the box. Meridian is newer than Robyn, and the documentation and community are still maturing.

PyMC-Marketing, built on the PyMC probabilistic programming library, is the most flexible and most technically demanding option. It gives you building blocks rather than an opinionated framework, which means a skilled statistician can construct exactly the model the business situation calls for: custom adstock specifications, hierarchical structures across geographies, integrations with customer lifetime value models. Without that statistical depth on the team, the flexibility becomes a liability. You can build something that looks sophisticated and produces confidently wrong answers, and without prior MMM experience, you may not recognize the problem.

The critical point about all three: the software is free but the expertise to use it well is not. An implementation done carelessly, with wrong variable specification, no calibration against incrementality tests, and poorly specified base components, will produce numbers with false precision. The code ran, the model converged, the outputs look clean, and the estimates may be significantly wrong. This is the underappreciated risk of the open-source path for teams without prior MMM experience. You don't know what good looks like, so you can't tell when you have it.

### Self-serve vendor platforms

A growing category of SaaS products wraps MMM methodology in a more accessible interface. Companies like Recast, Northbeam, and Rockerbox (which occupies a space somewhere between multi-touch attribution and lightweight MMM) offer platforms where you connect your data sources and the software handles model specification and estimation behind the scenes. These lower the barrier to getting a first model running, and for companies without statistical staff, they offer a faster path to initial results.

The tradeoffs are real. You're trusting the vendor's specification choices, which you often can't inspect in detail. The models tend to be more standardized and less customizable than open-source frameworks. Calibration with incrementality tests is supported by some of these platforms and not others, worth asking specifically before committing, and worth testing their answer against what you actually see in the interface rather than taking the sales pitch at face value. Pricing varies widely; some are accessible for mid-market budgets on a subscription basis, others are sized for enterprise.

My assessment of self-serve platforms: they're a reasonable starting point for companies that want to develop internal intuition about MMM outputs before investing in a more rigorous approach, or for companies where the budget at stake doesn't justify deeper investment. Treat the outputs as directional rather than authoritative. Run incrementality tests on your top two or three channels to sanity-check the biggest findings, and don't use initial model outputs to drive dramatic budget reallocations until you've stress-tested the results against other measurement sources.

### Full-service consultants and managed MMM vendors

The top end of the market is occupied by firms like Analytic Partners, Ekimetrics, and Nielsen, along with boutique MMM specialists and the analytics practices of larger agencies. These firms handle everything from data preparation through model building, calibration, and business presentation. The value proposition is expertise, accountability, and the ability to handle complexity that self-serve tools can't.

A serious engagement with a quality firm typically starts in the $100,000 to $200,000 range for an initial build and runs higher for ongoing management and quarterly updates. For companies with sufficient media spend, generally $20 million or more annually, the budget allocation decisions justify the measurement investment. For smaller budgets, the economics are harder.

The thing to scrutinize with full-service vendors is the prior and calibration process. Ask specifically: what priors are used for each channel, where do they come from, and how much did the posterior estimates move from the priors in the last model run? Vendors who can answer those questions clearly and show you the prior-to-posterior movement for each channel are doing the work properly. Vendors who present polished output slides with confident ROI figures but can't explain the calibration methodology are, in my assessment, selling something closer to sophisticated attribution than true MMM, grading their own homework in ways that aren't obvious from the deliverable.

## What to Expect, Honestly

### The first model run is a diagnostic, not a deliverable

The first model run is almost never the actionable output people hope for. You'll discover that your data has gaps you didn't know about: spend data that doesn't reconcile across systems, conversion data with tracking breaks, external variables you wish you'd been capturing for the past three years. Some channel estimates will carry wide uncertainty ranges, which is the model telling you honestly that the data can't separate those effects cleanly. And you'll probably find at least one result that contradicts your existing assumptions strongly enough that you can't immediately tell whether the model is right or whether something is misspecified. Treat the first run as a data quality audit and a baseline, not a strategic recommendation.

### Set the right timeline with leadership

The output that genuinely changes how budget decisions are made tends to come 12 to 24 months in, after the data infrastructure has been cleaned up, the first incrementality tests have run and fed back as calibration, and you've built enough organizational familiarity with how the model works to interrogate its outputs rather than simply accept or reject them. This timeline is worth being explicit about with leadership when you propose the investment. "We need 18 months before this produces reliable budget guidance" is a harder sell than "we'll have answers by Q3," but it's accurate, and a model that overpromises and underdelivers poisons the well for the whole measurement program.

## Back to the Bottom-Funnel Problem

### Why leadership isn't wrong to ask the question

The measurement gap that creates leadership pressure toward bottom-funnel channels is a rational response to an information problem, not a failure of strategic thinking. Attribution dashboards show what's measurable, and what's measurable in click-level reporting is disproportionately the bottom of the funnel. Brand search looks efficient because it captures existing intent. Retargeting looks efficient because it reaches people already in the market. Upper-funnel channels that create that intent are largely invisible to click-based measurement, so they appear to underperform by comparison.

### What MMM can and can't fix

MMM doesn't fully solve this. The dark funnel, the portion of brand influence that resists any quantification, will always remain. But MMM shifts the ground significantly, because it estimates effects from the outcome backward rather than from the click forward. A CTV campaign that generated no trackable clicks but produced measurable lift in baseline conversion rates during and after the flight will show up in MMM where it's invisible to attribution. Organizations with mature MMM programs tend to carry meaningfully more balanced media mixes than those relying primarily on click-based attribution, and that's not coincidence.

The counterargument worth taking seriously: MMM estimates are not precise, the uncertainty ranges on upper-funnel channel effects are often wide, and "the model says it worked" is not always a satisfying answer to a CFO asking why $500,000 went to a channel that generated no trackable results. You're managing a fundamental tension between precision and completeness in measurement. Click-level attribution is precise but incomplete; MMM is more complete but less precise. Neither one alone is sufficient. The strongest measurement frameworks use both, understand what each is designed to answer, and are explicit about where the uncertainty lives.

The organizations that solve the bottom-funnel pressure problem aren't the ones that found a perfect measurement methodology. They built a system credible enough that leadership could see the upper-funnel contribution and trust what they were seeing. That requires time, incrementality testing, and the willingness to present uncertainty honestly rather than paper over it with confident-looking dashboards. The alternative, a media mix that optimizes entirely for what's measurable at the bottom of the funnel, has a well-documented end state.

## References

<ol class="references">
  <li id="ref-1">Borden, N. H. (1964). "The Concept of the Marketing Mix." <em>Journal of Advertising Research</em>, 4(2), 2–7. Borden first used the term "marketing mix" in his 1953 AMA presidential address; econometric marketing mix modeling as a quantitative discipline emerged in the 1960s with Palda, K. S. (1964). <em>The Measurement of Cumulative Advertising Effects</em>. Prentice-Hall — the first use of distributed lag models to measure advertising carryover effects on sales. <a href="#ref-1-back" class="cite-back" aria-label="Back to reference 1">↩</a></li>
  <li id="ref-2">Analytic Partners, ROI Genome (analysis of 750+ brands across 45 countries). Industry MMM findings consistently show that 40–70% of business outcomes are driven by baseline demand — factors like brand equity, distribution, seasonality, and organic behavior that persist in the absence of advertising. Established brands with strong market presence typically fall in the 50–70% range. <a href="#ref-2-back" class="cite-back" aria-label="Back to reference 2">↩</a></li>
  <li id="ref-3">Blake, T., Nosko, C., & Tadelis, S. (2015). "Consumer Heterogeneity and Paid Search Effectiveness: A Large-Scale Field Experiment." <em>Econometrica</em>, 83(1), 155–174. This eBay field experiment found that brand keyword advertising had "no measurable short-term benefits" — the vast majority of attributed conversions came from buyers who would have purchased anyway. See also Johnson, G. A., Lewis, R. A., & Nubbemeyer, E. I. (2017). "Ghost Ads: Improving the Economics of Measuring Online Ad Effectiveness." <em>Journal of Marketing Research</em>, 54(6), 867–884, which found retargeting campaigns increased purchases by only 10.5–12.0% incrementally. <a href="#ref-3-back" class="cite-back" aria-label="Back to reference 3">↩</a></li>
  <li id="ref-4">Binet, L., & Field, P. (2013). <em>The Long and the Short of It: Balancing Short and Long-Term Marketing Strategies</em>. IPA. Analysis of the IPA Databank found the optimal budget split for most consumer brands is approximately 60% brand-building to 40% sales activation. Updated in <em>Effectiveness in Context</em> (IPA, 2018), which refined the ratio to 62:38 and provided category-specific guidance. As Binet has noted, the ratio is not an iron rule — it varies by brand size, category, and competitive position. <a href="#ref-4-back" class="cite-back" aria-label="Back to reference 4">↩</a></li>
  <li id="ref-5">Dawes, J. (2021). "Advertising Effectiveness and the 95-5 Rule: Most B2B Buyers Are Not in the Market Right Now." LinkedIn B2B Institute / Ehrenberg-Bass Institute for Marketing Science. The research found that up to 95% of business buyers are not in the market for a given product or service at any given time, implying that advertising's primary function is building and refreshing memory links so the brand comes to mind when buyers do enter the market. <a href="#ref-5-back" class="cite-back" aria-label="Back to reference 5">↩</a></li>
  <li id="ref-6">Sharp, B. (2010). <em>How Brands Grow: What Marketers Don't Know</em>. Oxford University Press. Sharp's research demonstrates that brands grow primarily by increasing mental availability — the propensity of a brand to come to mind in buying situations — through broad-reach advertising that builds and refreshes memory structures. These structures accumulate and persist over time, creating durable brand equity that performance measurement rarely captures. <a href="#ref-6-back" class="cite-back" aria-label="Back to reference 6">↩</a></li>
</ol>

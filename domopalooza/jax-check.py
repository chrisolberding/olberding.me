#!/usr/bin/env python3
"""
Check LinkedIn profiles for personal Jacksonville/NE Florida connections.
Visits each person's profile and searches page text for Jax references.
"""

import asyncio
import json
import random
import re
from pathlib import Path

BROWSER_DIR = Path(__file__).parent / ".browser-data"

# All 81 people - check everyone, not just Jax-company people
PEOPLE = [
    {"n": "Danielle Rodier", "slug": "danielle-rodier", "c": "Lee Enterprises", "li": "https://www.linkedin.com/search/results/people/?keywords=Danielle%20Rodier%20Lee%20Enterprises"},
    {"n": "Rebecca Jacobi", "slug": "rebecca-jacobi", "c": "U.S. Bank", "li": "https://www.linkedin.com/search/results/people/?keywords=Rebecca%20Jacobi%20U.S.%20Bank"},
    {"n": "Renee Tarnutzer", "slug": "renee-tarnutzer", "c": "Kerry", "li": "https://www.linkedin.com/search/results/people/?keywords=Renee%20Tarnutzer%20Kerry"},
    {"n": "Gagan Chahal", "slug": "gagan-chahal", "c": "Regions Bank", "li": "https://www.linkedin.com/search/results/people/?keywords=Gagan%20Chahal%20Regions%20Bank"},
    {"n": "Michael Kravec", "slug": "michael-kravec", "c": "BlueYeti", "li": "https://www.linkedin.com/search/results/people/?keywords=Michael%20Kravec%20BlueYeti"},
    {"n": "Bridget Fowers", "slug": "bridget-fowers", "c": "Cox Automotive", "li": "https://www.linkedin.com/search/results/people/?keywords=Bridget%20Fowers%20Cox%20Automotive"},
    {"n": "Matthew Sadowski", "slug": "matthew-sadowski", "c": "Kelso Industries", "li": "https://www.linkedin.com/search/results/people/?keywords=Matthew%20Sadowski%20Kelso%20Industries"},
    {"n": "Nick Christensen", "slug": "nick-christensen", "c": "First Colony Mortgage", "li": "https://www.linkedin.com/search/results/people/?keywords=Nick%20Christensen%20First%20Colony%20Mortgage"},
    {"n": "Barry Quinn", "slug": "barry-quinn", "c": "Nine Entertainment", "li": "https://www.linkedin.com/search/results/people/?keywords=Barry%20Quinn%20Nine%20Entertainment"},
    {"n": "Senthil Raman", "slug": "senthil-raman", "c": "O'Reilly Auto Parts", "li": "https://www.linkedin.com/search/results/people/?keywords=Senthil%20Raman%20O'Reilly%20Auto%20Parts"},
    {"n": "Kimberly Parker", "slug": "kimberly-parker", "c": "Graham Media Group Inc.", "li": "https://www.linkedin.com/search/results/people/?keywords=Kimberly%20Parker%20Graham%20Media%20Group%20Inc."},
    {"n": "Sam Lisker", "slug": "sam-lisker", "c": "American Bankers Association", "li": "https://www.linkedin.com/search/results/people/?keywords=Sam%20Lisker%20American%20Bankers%20Association"},
    {"n": "Evelyn Cone", "slug": "evelyn-cone", "c": "Crescent Communities", "li": "https://www.linkedin.com/search/results/people/?keywords=Evelyn%20Cone%20Crescent%20Communities"},
    {"n": "Lee Durham", "slug": "lee-durham", "c": "durhamlane", "li": "https://www.linkedin.com/search/results/people/?keywords=Lee%20Durham%20durhamlane"},
    {"n": "Ryan Draughn", "slug": "ryan-draughn", "c": "NLC Mutual Insurance Company", "li": "https://www.linkedin.com/search/results/people/?keywords=Ryan%20Draughn%20NLC%20Mutual%20Insurance%20Company"},
    {"n": "Allen Whitaker", "slug": "allen-whitaker", "c": "Moroch Partners", "li": "https://www.linkedin.com/search/results/people/?keywords=Allen%20Whitaker%20Moroch%20Partners"},
    {"n": "Apryle Krause", "slug": "apryle-krause", "c": "Kerry", "li": "https://www.linkedin.com/search/results/people/?keywords=Apryle%20Krause%20Kerry"},
    {"n": "Marty Hortick", "slug": "marty-hortick", "c": "GRT Financial", "li": "https://www.linkedin.com/search/results/people/?keywords=Marty%20Hortick%20GRT%20Financial"},
    {"n": "Nick Simha", "slug": "nick-simha", "c": "AWS", "li": "https://www.linkedin.com/search/results/people/?keywords=Nick%20Simha%20AWS"},
    {"n": "Ashli Moore", "slug": "ashli-moore", "c": "Beacon Credit Union", "li": "https://www.linkedin.com/search/results/people/?keywords=Ashli%20Moore%20Beacon%20Credit%20Union"},
    {"n": "Joe Beckner", "slug": "joe-beckner", "c": "Georgia's Own Credit Union", "li": "https://www.linkedin.com/search/results/people/?keywords=Joe%20Beckner%20Georgia's%20Own%20Credit%20Union"},
    {"n": "Justin Knowles", "slug": "justin-knowles", "c": "Texas Tech Credit Union", "li": "https://www.linkedin.com/search/results/people/?keywords=Justin%20Knowles%20Texas%20Tech%20Credit%20Union"},
    {"n": "Kimberly Smith", "slug": "kimberly-smith", "c": "American Bankers Association", "li": "https://www.linkedin.com/search/results/people/?keywords=Kimberly%20Smith%20American%20Bankers%20Association"},
    {"n": "Benjamin Ellis", "slug": "benjamin-ellis", "c": "Mauldin & Jenkins", "li": "https://www.linkedin.com/search/results/people/?keywords=Benjamin%20Ellis%20Mauldin%20%26%20Jenkins"},
    {"n": "Britney Byars", "slug": "britney-byars", "c": "Regional One Health", "li": "https://www.linkedin.com/search/results/people/?keywords=Britney%20Byars%20Regional%20One%20Health"},
    {"n": "Robert Hierak", "slug": "robert-hierak", "c": "MCR Health", "li": "https://www.linkedin.com/search/results/people/?keywords=Robert%20Hierak%20MCR%20Health"},
    {"n": "Zach Ehasz", "slug": "zach-ehasz", "c": "Healthgrades - RVO Health", "li": "https://www.linkedin.com/search/results/people/?keywords=Zach%20Ehasz%20Healthgrades%20-%20RVO%20Health"},
    {"n": "Dan Owens", "slug": "dan-owens", "c": "Maxio", "li": "https://www.linkedin.com/search/results/people/?keywords=Dan%20Owens%20Maxio"},
    {"n": "Matt Welykholowa", "slug": "matt-welykholowa", "c": "Sandbox Mutual Insurance", "li": "https://www.linkedin.com/search/results/people/?keywords=Matt%20Welykholowa%20Sandbox%20Mutual%20Insurance"},
    {"n": "Mike Zierhut", "slug": "mike-zierhut", "c": "Allied Universal", "li": "https://www.linkedin.com/search/results/people/?keywords=Mike%20Zierhut%20Allied%20Universal"},
    {"n": "DJ Schofield", "slug": "dj-schofield", "c": "Briggs & Stratton", "li": "https://www.linkedin.com/search/results/people/?keywords=DJ%20Schofield%20Briggs%20%26%20Stratton"},
    {"n": "Graham Power", "slug": "graham-power", "c": "Cvent", "li": "https://www.linkedin.com/search/results/people/?keywords=Graham%20Power%20Cvent"},
    {"n": "Max Isley", "slug": "max-isley", "c": "Live Nation", "li": "https://www.linkedin.com/search/results/people/?keywords=Max%20Isley%20Live%20Nation"},
    {"n": "Shaun Schweitzer", "slug": "shaun-schweitzer", "c": "Absolute Dental", "li": "https://www.linkedin.com/search/results/people/?keywords=Shaun%20Schweitzer%20Absolute%20Dental"},
    {"n": "Kelli Moser", "slug": "kelli-moser", "c": "SageSure", "li": "https://www.linkedin.com/search/results/people/?keywords=Kelli%20Moser%20SageSure"},
    {"n": "Cindy Heston", "slug": "cindy-heston", "c": "Elevance Health", "li": "https://www.linkedin.com/search/results/people/?keywords=Cindy%20Heston%20Elevance%20Health"},
    {"n": "Joshua Van Otten", "slug": "joshua-van-otten", "c": "Robert Half", "li": "https://www.linkedin.com/search/results/people/?keywords=Joshua%20Van%20Otten%20Robert%20Half"},
    {"n": "Vishal Chugani", "slug": "vishal-chugani", "c": "Kay's Fine Jewelry", "li": "https://www.linkedin.com/search/results/people/?keywords=Vishal%20Chugani%20Kay's%20Fine%20Jewelry"},
    {"n": "Brad Davis", "slug": "brad-davis", "c": "Sanctuary Wealth", "li": "https://www.linkedin.com/search/results/people/?keywords=Brad%20Davis%20Sanctuary%20Wealth"},
    {"n": "Mike Ivy", "slug": "mike-ivy", "c": "O'Reilly Auto", "li": "https://www.linkedin.com/search/results/people/?keywords=Mike%20Ivy%20O'Reilly%20Auto"},
    {"n": "Sean Thompson", "slug": "sean-thompson", "c": "Freddy's Frozen Custard & Steakburgers", "li": "https://www.linkedin.com/search/results/people/?keywords=Sean%20Thompson%20Freddy's%20Frozen%20Custard%20%26%20Steakburgers"},
    {"n": "Kristi Iannucci", "slug": "kristi-iannucci", "c": "TeleSpecialists", "li": "https://www.linkedin.com/search/results/people/?keywords=Kristi%20Iannucci%20TeleSpecialists"},
    {"n": "Richard Salinas", "slug": "richard-salinas", "c": "Kaufman Rossin", "li": "https://www.linkedin.com/search/results/people/?keywords=Richard%20Salinas%20Kaufman%20Rossin"},
    {"n": "Erin Cartland", "slug": "erin-cartland", "c": "Ingo Payments", "li": "https://www.linkedin.com/search/results/people/?keywords=Erin%20Cartland%20Ingo%20Payments"},
    {"n": "Lalitha Selvam", "slug": "lalitha-selvam", "c": "Oreilly Auto Parts", "li": "https://www.linkedin.com/search/results/people/?keywords=Lalitha%20Selvam%20Oreilly%20Auto%20Parts"},
    {"n": "Michael Gordon", "slug": "michael-gordon", "c": "Sanctuary Wealth", "li": "https://www.linkedin.com/search/results/people/?keywords=Michael%20Gordon%20Sanctuary%20Wealth"},
    {"n": "Michelle Connolly", "slug": "michelle-connolly", "c": "ARCH Medical Solutions Corp.", "li": "https://www.linkedin.com/search/results/people/?keywords=Michelle%20Connolly%20ARCH%20Medical%20Solutions%20Corp."},
    {"n": "Pedro Robles", "slug": "pedro-robles", "c": "Texas Tech Federal Credit Union", "li": "https://www.linkedin.com/search/results/people/?keywords=Pedro%20Robles%20Texas%20Tech%20Federal%20Credit%20Union"},
    {"n": "Andrea De Marco", "slug": "andrea-de-marco", "c": "BitBang", "li": "https://www.linkedin.com/search/results/people/?keywords=Andrea%20De%20Marco%20BitBang"},
    {"n": "Bill Roese", "slug": "bill-roese", "c": "Ingo Money", "li": "https://www.linkedin.com/search/results/people/?keywords=Bill%20Roese%20Ingo%20Money"},
    {"n": "Chuck Stratton", "slug": "chuck-stratton", "c": "CESeNet", "li": "https://www.linkedin.com/search/results/people/?keywords=Chuck%20Stratton%20CESeNet"},
    {"n": "Dan Dan Rex", "slug": "dan-dan-rex", "c": "Ingo Payments", "li": "https://www.linkedin.com/search/results/people/?keywords=Dan%20Dan%20Rex%20Ingo%20Payments"},
    {"n": "Rodrigo Cabanas", "slug": "rodrigo-cabanas", "c": "Bring IT", "li": "https://www.linkedin.com/search/results/people/?keywords=Rodrigo%20Cabanas%20Bring%20IT"},
    {"n": "Sarah Davies", "slug": "sarah-davies", "c": "Indelible", "li": "https://www.linkedin.com/search/results/people/?keywords=Sarah%20Davies%20Indelible"},
    {"n": "Valerie Doyon", "slug": "valerie-doyon", "c": "Hydra-Power Systems", "li": "https://www.linkedin.com/search/results/people/?keywords=Valerie%20Doyon%20Hydra-Power%20Systems"},
    {"n": "James Dann", "slug": "james-dann", "c": "The SEER Group", "li": "https://www.linkedin.com/search/results/people/?keywords=James%20Dann%20The%20SEER%20Group"},
    {"n": "Jan Menhart", "slug": "jan-menhart", "c": "Sandbox Mutual Insurance", "li": "https://www.linkedin.com/search/results/people/?keywords=Jan%20Menhart%20Sandbox%20Mutual%20Insurance"},
    {"n": "Michael Ardito", "slug": "michael-ardito", "c": "Massman Companies", "li": "https://www.linkedin.com/search/results/people/?keywords=Michael%20Ardito%20Massman%20Companies"},
    {"n": "Tim Anderson", "slug": "tim-anderson", "c": "PMI", "li": "https://www.linkedin.com/search/results/people/?keywords=Tim%20Anderson%20PMI"},
    {"n": "Spencer Ray", "slug": "spencer-ray", "c": "O'Reilly Auto Parts", "li": "https://www.linkedin.com/search/results/people/?keywords=Spencer%20Ray%20O'Reilly%20Auto%20Parts"},
    {"n": "Selam Beyene", "slug": "selam-beyene", "c": "American Bankers Association", "li": "https://www.linkedin.com/search/results/people/?keywords=Selam%20Beyene%20American%20Bankers%20Association"},
    {"n": "Ernest Luk", "slug": "ernest-luk", "c": "Professional Contractor Supply", "li": "https://www.linkedin.com/search/results/people/?keywords=Ernest%20Luk%20Professional%20Contractor%20Supply"},
    {"n": "Jack McMahon", "slug": "jack-mcmahon", "c": "RJ Young", "li": "https://www.linkedin.com/search/results/people/?keywords=Jack%20McMahon%20RJ%20Young"},
    {"n": "Leo Goncalves", "slug": "leo-goncalves", "c": "Yale Appliance", "li": "https://www.linkedin.com/search/results/people/?keywords=Leo%20Goncalves%20Yale%20Appliance"},
    {"n": "Steven Smith", "slug": "steven-smith", "c": "LLC DBA BUDDYS HOME FURNISHINGS", "li": "https://www.linkedin.com/search/results/people/?keywords=steven%20smith%20BUDDYS%20HOME%20FURNISHINGS"},
    {"n": "Nicholas Hutchens", "slug": "nicholas-hutchens", "c": "good2grow LLC", "li": "https://www.linkedin.com/search/results/people/?keywords=Nicholas%20Hutchens%20good2grow%20LLC"},
    {"n": "Rebecca Thomas", "slug": "rebecca-thomas", "c": "Securitas Critical Infrastructure Services", "li": "https://www.linkedin.com/search/results/people/?keywords=Rebecca%20Thomas%20Securitas%20Critical%20Infrastructure"},
    {"n": "Simon Marshall", "slug": "simon-marshall", "c": "", "li": "https://www.linkedin.com/search/results/people/?keywords=Simon%20Marshall%20Senior%20Marketing%20Manager"},
    {"n": "Chris Clarke", "slug": "chris-clarke", "c": "CLV Group Inc.", "li": "https://www.linkedin.com/search/results/people/?keywords=Chris%20Clarke%20CLV%20Group%20Inc."},
    {"n": "Craig Gibbons", "slug": "craig-gibbons", "c": "District Management Group", "li": "https://www.linkedin.com/search/results/people/?keywords=Craig%20Gibbons%20District%20Management%20Group"},
    {"n": "Grant Smith", "slug": "grant-smith", "c": "Gordon Data Group", "li": "https://www.linkedin.com/search/results/people/?keywords=Grant%20Smith%20Gordon%20Data%20Group"},
    {"n": "Hayden Taylor", "slug": "hayden-taylor", "c": "Black Cliffs Partners", "li": "https://www.linkedin.com/search/results/people/?keywords=Hayden%20Taylor%20Black%20Cliffs%20Partners"},
    {"n": "Jacob Ferrell", "slug": "jacob-ferrell", "c": "Linked Accounting Alliance", "li": "https://www.linkedin.com/search/results/people/?keywords=Jacob%20Ferrell%20Linked%20Accounting%20Alliance"},
    {"n": "Renee Grey", "slug": "renee-grey", "c": "RJ Young", "li": "https://www.linkedin.com/search/results/people/?keywords=Renee%20Grey%20RJ%20Young"},
    {"n": "Robin Liong", "slug": "robin-liong", "c": "AWS", "li": "https://www.linkedin.com/search/results/people/?keywords=Robin%20Liong%20AWS"},
    {"n": "Tim Wisner", "slug": "tim-wisner", "c": "Add3", "li": "https://www.linkedin.com/search/results/people/?keywords=Tim%20Wisner%20Add3"},
    {"n": "Maria Motta", "slug": "maria-motta", "c": "Kaufman Rossin", "li": "https://www.linkedin.com/search/results/people/?keywords=Maria%20Motta%20Kaufman%20Rossin"},
    {"n": "Meg Williams", "slug": "meg-williams", "c": "Lee Enterprises", "li": "https://www.linkedin.com/search/results/people/?keywords=Meg%20Williams%20Lee%20Enterprises"},
    {"n": "Preeth John", "slug": "preeth-john", "c": "Microbiologics", "li": "https://www.linkedin.com/search/results/people/?keywords=Preeth%20John%20Microbiologics"},
    {"n": "Ryan Doherty", "slug": "ryan-doherty", "c": "Briggs & Stratton", "li": "https://www.linkedin.com/search/results/people/?keywords=Ryan%20Doherty%20Briggs%20%26%20Stratton"},
    {"n": "Tom Lenarz", "slug": "tom-lenarz", "c": "GRT Financial", "li": "https://www.linkedin.com/search/results/people/?keywords=Tom%20Lenarz%20GRT%20Financial"},
]

JAX_TERMS = [
    'jacksonville', 'jax', 'ponte vedra', 'st. augustine', 'saint augustine',
    'fernandina', 'amelia island', 'neptune beach', 'atlantic beach',
    'orange park', 'fleming island', 'mandarin', 'san marco',
    'university of north florida', 'unf', 'jacksonville university',
    'edward waters', 'flagler college',
]


async def main():
    from playwright.async_api import async_playwright

    async with async_playwright() as p:
        context = await p.chromium.launch_persistent_context(
            str(BROWSER_DIR),
            headless=False,
            viewport={"width": 1280, "height": 900},
            args=["--disable-blink-features=AutomationControlled"],
        )

        page = context.pages[0] if context.pages else await context.new_page()

        # Check login
        await page.goto("https://www.linkedin.com/feed/", wait_until="domcontentloaded")
        await page.wait_for_timeout(3000)
        if "login" in page.url or "authwall" in page.url:
            print("Please log in to LinkedIn in the browser...")
            for _ in range(300):
                await page.wait_for_timeout(1000)
                if "feed" in page.url:
                    break
            print("Logged in!")

        hits = []
        total = len(PEOPLE)

        for i, person in enumerate(PEOPLE):
            name = person["n"]
            print(f"[{i+1}/{total}] Checking {name}...", end="", flush=True)

            try:
                # Search for the person
                await page.goto(person["li"], wait_until="domcontentloaded")
                await page.wait_for_timeout(2500 + random.uniform(500, 1500))

                # Find first profile link
                profile_url = await page.evaluate("""
                    () => {
                        const links = document.querySelectorAll('a[href*="/in/"]');
                        for (const a of links) {
                            if (a.href.includes('/in/') && !a.href.includes('/in/YOU'))
                                return a.href;
                        }
                        return null;
                    }
                """)

                if not profile_url:
                    print(" no profile found")
                    continue

                # Visit profile
                await page.goto(profile_url, wait_until="domcontentloaded")
                await page.wait_for_timeout(3000 + random.uniform(500, 1500))

                # Scroll down to load more content
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight / 2)")
                await page.wait_for_timeout(1500)
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await page.wait_for_timeout(1500)

                # Get all page text
                page_text = await page.evaluate("document.body.innerText.toLowerCase()")

                # Search for Jax terms
                found_terms = []
                for term in JAX_TERMS:
                    if term in page_text:
                        found_terms.append(term)

                if found_terms:
                    # Try to get context around the match
                    contexts = []
                    for term in found_terms:
                        idx = page_text.find(term)
                        if idx >= 0:
                            start = max(0, idx - 80)
                            end = min(len(page_text), idx + len(term) + 80)
                            snippet = page_text[start:end].replace('\n', ' ').strip()
                            contexts.append(f'  ...{snippet}...')

                    print(f" ** JAX HIT: {', '.join(found_terms)}")
                    for ctx in contexts[:3]:
                        print(ctx)
                    hits.append({
                        "name": name,
                        "company": person["c"],
                        "slug": person["slug"],
                        "profile": profile_url.split("?")[0],
                        "terms": found_terms,
                        "contexts": contexts[:3],
                    })
                else:
                    print(" no jax connection")

                # Polite delay
                await page.wait_for_timeout(random.uniform(2000, 4000))

            except Exception as e:
                print(f" error: {e}")

        print(f"\n{'='*60}")
        print(f"RESULTS: {len(hits)} people with Jacksonville connections\n")
        for h in hits:
            print(f"  {h['name']} ({h['company']})")
            print(f"    Profile: {h['profile']}")
            print(f"    Matched: {', '.join(h['terms'])}")
            for ctx in h['contexts']:
                print(f"  {ctx}")
            print()

        # Save results
        results_path = Path(__file__).parent / "jax-connections.json"
        results_path.write_text(json.dumps(hits, indent=2))
        print(f"Saved to {results_path}")

        await context.close()


asyncio.run(main())

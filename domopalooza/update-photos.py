#!/usr/bin/env python3
"""
Scans the photos/ folder for new images and updates domopalooza_lookup.html
to add img/img_lg references for any person whose slug matches a photo file.

Usage:
    python3 update-photos.py          # dry run (shows what would change)
    python3 update-photos.py --apply  # actually update the HTML
"""

import json
import os
import re
import sys

PHOTO_DIR = os.path.join(os.path.dirname(__file__), "photos")
HTML_FILE = os.path.join(os.path.dirname(__file__), "domopalooza_lookup.html")


def slugify(name):
    """Convert a name to a slug, stripping honorifics and suffixes."""
    name = re.sub(r"^(Mr\.?|Mrs?\.?|Ms\.?|Dr\.?|Miss)\s+", "", name, flags=re.I)
    name = re.sub(r",?\s*(MBA|PMP|CPA|Jr\.?|Sr\.?|III|II|IV)$", "", name, flags=re.I)
    return name.strip().lower().replace(" ", "-").replace(".", "")


def get_photo_slugs():
    """Get set of slugs that have photos (non-lg versions)."""
    slugs = set()
    for f in os.listdir(PHOTO_DIR):
        if f.endswith(("-lg.jpg", "-lg.png", "-lg.jpeg", "-lg.webp")):
            continue
        name, ext = os.path.splitext(f)
        slugs.add((name, f))
    return slugs


def main():
    apply = "--apply" in sys.argv

    with open(HTML_FILE, "r") as f:
        content = f.read()

    # Extract data array
    idx = content.index("const D=[")
    start = idx + len("const D=")
    bc = 0
    end = start
    for i in range(start, len(content)):
        if content[i] == "[":
            bc += 1
        elif content[i] == "]":
            bc -= 1
            if bc == 0:
                end = i + 1
                break

    data = json.loads(content[start:end])
    photo_files = {name: fname for name, fname in get_photo_slugs()}

    updated = 0
    already = 0
    for person in data:
        if "img" in person:
            already += 1
            continue

        slug = slugify(person["n"])
        if slug in photo_files:
            ext = os.path.splitext(photo_files[slug])[1]
            person["img"] = f"photos/{slug}{ext}"
            # Check for lg version
            lg_candidates = [f"photos/{slug}-lg{e}" for e in [".jpg", ".png", ".jpeg", ".webp"]]
            for lg in lg_candidates:
                if os.path.exists(os.path.join(os.path.dirname(PHOTO_DIR), lg)):
                    person["img_lg"] = lg
                    break
            else:
                person["img_lg"] = person["img"]  # fallback to regular size
            updated += 1
            print(f"  + {person['n']} -> {person['img']}")

    print()
    print(f"Already had photos: {already}")
    print(f"New photos found:   {updated}")
    print(f"Still missing:      {len(data) - already - updated}")

    if updated == 0:
        print("\nNo new photos to add.")
        return

    if not apply:
        print("\nDry run - no changes made. Run with --apply to update the HTML.")
        return

    # Rebuild the HTML with updated data
    new_data = json.dumps(data, ensure_ascii=False)
    new_content = content[:start] + new_data + content[end:]

    with open(HTML_FILE, "w") as f:
        f.write(new_content)

    print(f"\nUpdated {HTML_FILE} with {updated} new photos.")


if __name__ == "__main__":
    main()

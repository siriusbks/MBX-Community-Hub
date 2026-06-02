import requests
import json
import math
import time
import os

BASE_URL = "https://api.minebox.co/items"
LOCALES = ["en", "pl", "fr", "es", "de"]

OUTPUT_FILE = "minebox_items.json"
items = {}

def fetch_page(page, locale):
    try:
        r = requests.get(
            BASE_URL,
            params={"page": page, "locale": locale},
            timeout=30
        )

        print(f"[{locale}] page {page} -> {r.status_code}")

        r.raise_for_status()

        data = r.json()

        if "items" not in data:
            print(f"[ERROR] No items in response: {data}")
            return {}

        return {
            item["id"]: item
            for item in data["items"]
        }

    except Exception as e:
        print(f"[ERROR] page={page} locale={locale}: {e}")
        return {}

# test pierwszej strony
first = fetch_page(1, "en")

if not first:
    print("API not working or blocked. Stop.")
    exit()

# pobierz meta
r = requests.get(BASE_URL, params={"page": 1, "locale": "en"})
data = r.json()

total = data.get("total", 0)
page_size = data.get("pageSize", 50)
pages = math.ceil(total / page_size)

print(f"Total: {total}, pages: {pages}")

for page in range(1, pages + 1):
    print(f"\n=== PAGE {page}/{pages} ===")

    page_data = {}

    for locale in LOCALES:
        page_data[locale] = fetch_page(page, locale)
        time.sleep(1.2)  # limit API

    if not page_data["en"]:
        print(f"Skipping page {page} (no EN data)")
        continue

    for item_id, en_item in page_data["en"].items():
        items[item_id] = {
            "name": {
                "en": en_item.get("name"),
                "pl": page_data["pl"].get(item_id, {}).get("name"),
                "fr": page_data["fr"].get(item_id, {}).get("name"),
                "es": page_data["es"].get(item_id, {}).get("name"),
                "de": page_data["de"].get(item_id, {}).get("name"),
            },
            "image": en_item.get("image"),
            "rarity": en_item.get("rarity"),
        }

    print(f"Collected so far: {len(items)} items")

# zapis (FIX: zawsze zapis do src/components/museum/itemDataFromApi)

OUTPUT_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__))
)

os.makedirs(OUTPUT_DIR, exist_ok=True)

OUTPUT_PATH = os.path.join(OUTPUT_DIR, OUTPUT_FILE)

try:
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"\nDONE -> saved {len(items)} items to {OUTPUT_PATH}")

except Exception as e:
    print(f"[WRITE ERROR] {e}")
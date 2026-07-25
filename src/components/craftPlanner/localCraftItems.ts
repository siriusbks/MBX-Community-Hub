import localItemsRaw from "@const/APIPreload/items.json";
import { rarities } from "@const/rarities";

interface LocalItemEntry {
    name?: Record<string, string>;
    image?: string;
    rarity?: string;
}

const LOCAL_ITEMS = localItemsRaw as Record<string, LocalItemEntry>;

export function getLocalItemName(itemId: string, locale = "en"): string {
    const name = LOCAL_ITEMS[itemId]?.name;
    if (!name) return itemId;
    return name[locale] || name.en || itemId;
}

export function getLocalItemRarity(itemId: string): string {
    return LOCAL_ITEMS[itemId]?.rarity?.toLowerCase() ?? "common";
}

const RARITY_ORDER: Record<string, number> = Object.fromEntries(rarities.map((r) => [r.id, r.order]));

/** Sorts item ids by rarity (rarest first), then by localized name. */
export function sortItemIdsByRarityThenName(ids: string[], locale = "en"): string[] {
    return [...ids].sort((a, b) => {
        const orderA = RARITY_ORDER[getLocalItemRarity(a)] ?? -999;
        const orderB = RARITY_ORDER[getLocalItemRarity(b)] ?? -999;

        if (orderA !== orderB) return orderB - orderA;

        return getLocalItemName(a, locale).localeCompare(getLocalItemName(b, locale), locale, {
            sensitivity: "base",
        });
    });
}

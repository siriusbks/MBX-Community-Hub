import { useState, useEffect } from "react";
import type { Equipment } from "types/equipment";

type Locale = "en" | "fr" | "pl";

const EQUIPMENT_CATEGORIES = [
    "RING",
    "NECKLACE",
    "BACK",
    "BELT",
    "GLOVES",
    "HELMET",
    "CHESTPLATE",
    "LEGGINGS",
    "BOOTS",
    "PET",
    //"CLASS",
] as const;

const API_BASE = "https://api.minebox.co/items";
const PAGE_SIZE = 50;

const toApiLocale = (locale: Locale): string => locale;


const normalizeItem = (raw: any): Equipment => {
    const id = String(raw.id ?? raw.mbxId ?? crypto.randomUUID());
    const image = typeof raw.image === "string" ? raw.image.trim() : "";

    return {
        id,
        name: raw.name ?? raw.displayName ?? id,
        category: (raw.type ?? raw.category ?? "UNKNOWN").toUpperCase(),
        rarity: (raw.rarity ?? "COMMON").toUpperCase(),
        image,
        stats: raw.stats ?? undefined,
        level: typeof raw.level === "number" ? raw.level : undefined,
        set: raw.set ? raw.set : undefined,
    };
};

async function fetchCategory(
    category: string,
    locale: string,
    signal: AbortSignal
): Promise<Equipment[]> {
    const items: Equipment[] = [];
    let page = 1;

    while (true) {
        const url = new URL(API_BASE);
        url.searchParams.set("locale", locale);
        url.searchParams.set("page", String(page));
        url.searchParams.set("pageSize", String(PAGE_SIZE));
        url.searchParams.set("sort", "level");
        url.searchParams.set("categories", category);
        url.searchParams.set("levelMin", "0");
        url.searchParams.set("levelMax", "100");

        const res = await fetch(url.toString(), { signal, cache: "no-store" });

        if (!res.ok) {
            throw new Error(
                `HTTP ${res.status} for category ${category} (page ${page})`
            );
        }

        const data = await res.json();

        const rawItems: any[] = Array.isArray(data)
            ? data
            : Array.isArray(data.items)
            ? data.items
            : Array.isArray(data.data)
            ? data.data
            : [];

        if (rawItems.length === 0) break;

        items.push(...rawItems.map(normalizeItem));

        if (rawItems.length < PAGE_SIZE) break;

        const totalItems: number = data.total ?? data.totalCount ?? Infinity;
        const totalPages = totalItems === Infinity
            ? Infinity
            : Math.ceil(totalItems / PAGE_SIZE);
        if (page >= totalPages) break;

        page++;
    }

    return items;
}

export const useEquipment = (locale: Locale = "en") => {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchAll = async () => {
            try {
                setLoading(true);
                setError(null);

                const apiLocale = toApiLocale(locale);

                const results = await Promise.all(
                    EQUIPMENT_CATEGORIES.map((cat) =>
                        fetchCategory(cat, apiLocale, controller.signal)
                    )
                );

                const all = results.flat();

                const seen = new Set<string>();
                const deduped = all.filter((it) => {
                    const key = it.id || `${it.name}:${it.category}`;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });

                deduped.sort(
                    (a, b) =>
                        (a.level ?? 0) - (b.level ?? 0) ||
                        a.name.localeCompare(b.name)
                );

                setEquipment(deduped);
            } catch (err: any) {
                if (err?.name === "AbortError") return;
                console.error("[useEquipment] Error:", err);
                setError(
                    err instanceof Error ? err.message : "Unknown error occurred"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
        return () => controller.abort();
    }, [locale]);

    return { equipment, loading, error };
};

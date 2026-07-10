
import { useEffect, useRef, useState } from "react";

// ─── New API base ────────────────────────────────────────────────────────────
// The old endpoint was https://api.mineboxcommunity.com/items/{locale}/{id}
// The new endpoint is  https://api.minebox.co/items/{id}?locale={locale}
const API_BASE = "https://api.minebox.co/items";

export interface ItemDetails {
    id: string;
    name: string;
    /** The new API exposes this as "type"; normalised to "category" here. */
    category: string;
    rarity?: string;
    image?: string;
    level?: number;
    description?: string;
    lore?: string;
    stats?: Record<string, number[]>;
    recipe?: {
        job?: string;
        ingredients?: Ingredient[];
    };
}

export type Ingredient =
    | { type: "custom"; id?: string; item?: ItemDetails; amount?: number }
    | { type: "vanilla"; id: string; amount?: number }
    | { [key: string]: any };

// Simple in-memory cache keyed by "locale:id"
const cache = new Map<string, ItemDetails>();

/** Normalise a raw API response so downstream code always sees `category`. */
function normalizeDetails(raw: any): ItemDetails {
    return {
        ...raw,
        // The new API field is "type", old code expects "category"
        category: raw.category ?? raw.type ?? "UNKNOWN",
    };
}

export function useItemDetails(
    id?: string | null,
    locale: "en" | "fr" | "pl" = "en"
) {
    const [data, setData] = useState<ItemDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const lastKey = useRef<string>("");

    useEffect(() => {
        if (!id) {
            setData(null);
            setError(null);
            setLoading(false);
            return;
        }

        const key = `${locale}:${id}`;
        if (lastKey.current === key && data) return;
        lastKey.current = key;

        const fromCache = cache.get(key);
        if (fromCache) {
            setData(fromCache);
            setLoading(false);
            setError(null);
            return;
        }

        const controller = new AbortController();
        (async () => {
            try {
                setLoading(true);
                setError(null);

                // New API: GET /items/{id}?locale={locale}
                const url = new URL(`${API_BASE}/${encodeURIComponent(id)}`);
                url.searchParams.set("locale", locale);

                const res = await fetch(url.toString(), {
                    signal: controller.signal,
                    cache: "no-store",
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = normalizeDetails(await res.json());
                cache.set(key, json);
                setData(json);
            } catch (e: any) {
                if (e?.name === "AbortError") return;
                setError(e?.message || "Failed to load item details");
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [id, locale]);

    return { data, loading, error };
}
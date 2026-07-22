import { useEffect, useRef, useState } from "react";

// ─── API base (przez proxy) ──────────────────────────────────────────────────
// Docelowe API:   https://api.minebox.co/items/{id}?locale={locale}
// Wywoływane przez proxy: https://mineboxadditions.bartier.me/proxy?url=<encoded minebox url>
const MINEBOX_API_BASE = "https://api.minebox.co/items";
const PROXY_BASE = "https://mineboxadditions.bartier.me/proxy";

export interface ItemDetails {
    id: string;
    name: string;
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

const cache = new Map<string, ItemDetails>();

function normalizeDetails(raw: any): ItemDetails {
    return {
        ...raw,
        category: raw.category ?? raw.type ?? "UNKNOWN",
    };
}

function buildProxyUrl(id: string, locale: string): string {
    // 1. Budujemy docelowy URL do Minebox API
    const mineboxUrl = new URL(`${MINEBOX_API_BASE}/${encodeURIComponent(id)}`);
    mineboxUrl.searchParams.set("locale", locale);

    // 2. Owijamy go w proxy, jako zakodowany parametr "url"
    const proxyParams = new URLSearchParams({ url: mineboxUrl.toString() });

    return `${PROXY_BASE}?${proxyParams.toString()}`;
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

                const url = buildProxyUrl(id, locale);

                const res = await fetch(url, {
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
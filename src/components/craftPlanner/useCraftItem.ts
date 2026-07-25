import { useEffect, useState } from "react";
import type { CraftItem } from "./craftPlannerTypes";

const API_BASE = "https://api.minebox.co/item";

const cache = new Map<string, Promise<CraftItem>>();

export function fetchCraftItem(id: string, locale: "en" | "fr" | "pl" = "en"): Promise<CraftItem> {
    const key = `${locale}:${id}`;
    const cached = cache.get(key);
    if (cached) return cached;

    const promise = (async () => {
        const url = new URL(`${API_BASE}/${encodeURIComponent(id)}`);
        url.searchParams.set("locale", locale);

        const res = await fetch(url.toString(), { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as CraftItem;
    })();

    cache.set(key, promise);
    promise.catch(() => cache.delete(key));
    return promise;
}

export function useCraftItem(id: string | null | undefined, locale: "en" | "fr" | "pl" = "en") {
    const [data, setData] = useState<CraftItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            queueMicrotask(() => {
                setData(null);
                setError(null);
                setLoading(false);
            });
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        fetchCraftItem(id, locale)
            .then((item) => {
                if (!cancelled) setData(item);
            })
            .catch((err) => {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load item");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [id, locale]);

    return { data, loading, error };
}

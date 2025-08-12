/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { useEffect, useRef, useState } from "react";

const API_BASE = "https://api.mineboxcommunity.com";

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

export function useItemDetails(
    id?: string | null,
    locale: "us" | "fr" | "pl" = "us"
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
                const res = await fetch(
                    `${API_BASE}/items/${locale}/${encodeURIComponent(id)}`,
                    { signal: controller.signal, cache: "no-store" }
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = (await res.json()) as ItemDetails;
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

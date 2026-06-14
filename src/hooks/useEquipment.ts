/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { useState, useEffect } from "react";
import { Equipment } from "@t/equip";

type Locale = "en" | "fr" | "pl";

/**
 * All equipment categories available in the new API.
 * The RING category covers both ring slots (ring1 & ring2).
 */
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
] as const;

const API_BASE = "https://api.minebox.co/items";
const PAGE_SIZE = 50;

/**
 * Maps the new API locale codes to the hook's locale param.
 * The old API used "us", the new one uses "en".
 */
const toApiLocale = (locale: Locale): string => locale;

/**
 * Normalises one raw item from api.minebox.co into our internal Equipment type.
 */
const normalizeItem = (raw: any): Equipment => {
    const id = String(raw.id ?? raw.mbxId ?? crypto.randomUUID());
    const image = typeof raw.image === "string" ? raw.image.trim() : "";

    return {
        id,
        name: raw.name ?? raw.displayName ?? id,
        // The new API uses "type" for the equipment category (e.g. "HELMET").
        // Fall back to "category" for forward-compatibility.
        category: (raw.type ?? raw.category ?? "UNKNOWN").toUpperCase(),
        rarity: (raw.rarity ?? "COMMON").toUpperCase(),
        image,
        stats: raw.stats ?? undefined,
        level: typeof raw.level === "number" ? raw.level : undefined,
        set: raw.set ? raw.set : undefined,
    };
};

/**
 * Fetches all pages for a single category.
 */
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
        url.searchParams.set("levelMax", "10000");

        const res = await fetch(url.toString(), { signal, cache: "no-store" });

        if (!res.ok) {
            throw new Error(
                `HTTP ${res.status} for category ${category} (page ${page})`
            );
        }

        const data = await res.json();

        // The API can return { items: [...], total: N } or a bare array.
        const rawItems: any[] = Array.isArray(data)
            ? data
            : Array.isArray(data.items)
            ? data.items
            : Array.isArray(data.data)
            ? data.data
            : [];

        if (rawItems.length === 0) break;

        items.push(...rawItems.map(normalizeItem));

        // If we got fewer than PAGE_SIZE we've reached the last page.
        if (rawItems.length < PAGE_SIZE) break;

        // Safety: derive totalPages from the 'total' item count the API provides.
        const totalItems: number = data.total ?? data.totalCount ?? Infinity;
        const totalPages = totalItems === Infinity
            ? Infinity
            : Math.ceil(totalItems / PAGE_SIZE);
        if (page >= totalPages) break;

        page++;
    }

    return items;
}

/**
 * useEquipment — fetches every equipment category from api.minebox.co in
 * parallel, deduplicates, and sorts by level then name.
 *
 * @param locale  "en" | "fr" | "pl"  (default "en")
 */
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

                // Fetch all categories in parallel.
                const results = await Promise.all(
                    EQUIPMENT_CATEGORIES.map((cat) =>
                        fetchCategory(cat, apiLocale, controller.signal)
                    )
                );

                const all = results.flat();

                // Deduplicate by id, then by name:category as fallback.
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

                console.log(
                    `[useEquipment] locale=${locale} -> raw=${all.length}, unique=${deduped.length}`
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
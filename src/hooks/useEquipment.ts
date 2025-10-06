/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { useState, useEffect } from "react";
import { Equipment } from "@t/equip";

type Locale = "us" | "fr" | "pl";
// futur feature to support locales with i18n (API)
export const useEquipment = (locale: Locale = "us") => {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const looksLikeItem = (obj: any) => {
            if (!obj || typeof obj !== "object") return false;
            const hasName = "name" in obj || "displayName" in obj;
            const hasCategory = "category" in obj;
            const hasRarity = "rarity" in obj;
            return hasName && hasCategory && hasRarity;
        };

const normalizeItem = (raw: any, idFromPath?: string): Equipment => {
    const id = String(raw.id ?? idFromPath ?? crypto.randomUUID());
    let image = typeof raw.image === "string" ? raw.image.trim() : "";

    return {
        id,
        name: raw.name ?? raw.displayName ?? id,
        category: raw.category ?? "UNKNOWN",
        rarity: raw.rarity ?? "COMMON",
        image,
        stats: raw.stats ?? undefined,
        level: typeof raw.level === "number" ? raw.level : undefined,
    };
};


        const extractItems = (
            node: any,
            path: string[] = [],
            out: Equipment[] = []
        ) => {
            if (node == null) return out;

            if (Array.isArray(node)) {
                for (const el of node) extractItems(el, path, out);
                return out;
            }

            if (typeof node === "object") {
                if (looksLikeItem(node)) {
                    const lastKey = path[path.length - 1];
                    out.push(normalizeItem(node, lastKey));
                    return out;
                }

                for (const [k, v] of Object.entries(node)) {
                    extractItems(v, [...path, k], out);
                }
                return out;
            }

            return out;
        };

        const fetchEquipment = async () => {
            try {
                setLoading(true);
                setError(null);

                const apiUrl = `https://api.mineboxcommunity.com/items/${locale}`;
                const res = await fetch(apiUrl, {
                    signal: controller.signal,
                    cache: "no-store",
                });
                if (!res.ok)
                    throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();

                const extracted: Equipment[] = extractItems(data);

                const seen = new Set<string>();
                const deduped = extracted.filter((it) => {
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
                    `[useEquipment] locale=${locale} -> raw=${extracted.length}, unique=${deduped.length}`
                );

                setEquipment(deduped);
            } catch (err: any) {
                if (err?.name === "AbortError") return;
                console.error("Error fetching equipment:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unknown error occurred"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
        return () => controller.abort();
    }, [locale]);

    return { equipment, loading, error };
};

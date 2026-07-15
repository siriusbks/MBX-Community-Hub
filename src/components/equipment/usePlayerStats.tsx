/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 *
 * Fetches the connected player's own base stats (ATTRIBUTED_STATS.base +
 * ATTRIBUTED_STATS.scrolls) from api.minebox.co/data/{nick}, so they can be
 * added to the equipment build's stat total — the "nick" comes from the
 * same localStorage key ("minebox_nick") used by Navbar/Profile/Collections.
 */

import { useEffect, useState } from "react";

const API_BASE = "https://api.minebox.co/data";

export const usePlayerStats = () => {
    const [playerStats, setPlayerStats] = useState<Record<string, number>>({});
    const [loadingPlayerStats, setLoading] = useState(true);
    const [errorPlayerStats, setError] = useState<string | null>(null);

    useEffect(() => {
        let nick: string | null;
        try {
            nick = localStorage.getItem("minebox_nick");
        } catch {
            nick = null;
        }

        if (!nick) {
            // Resolve via a microtask so this setState happens inside a
            // .then callback rather than synchronously in the effect body,
            // same as every other setState in this hook.
            Promise.resolve().then(() => setLoading(false));
            return;
        }

        const controller = new AbortController();

        fetch(`${API_BASE}/${encodeURIComponent(nick)}`, {
            signal: controller.signal,
            cache: "no-store",
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((json) => {
                const base: Record<string, number> = json?.data?.ATTRIBUTED_STATS?.base ?? {};
                const scrolls: Record<string, number> = json?.data?.ATTRIBUTED_STATS?.scrolls ?? {};

                const summed: Record<string, number> = {};
                for (const [stat, value] of Object.entries(base)) {
                    summed[stat.toUpperCase()] = (summed[stat.toUpperCase()] ?? 0) + (value || 0);
                }
                for (const [stat, value] of Object.entries(scrolls)) {
                    summed[stat.toUpperCase()] = (summed[stat.toUpperCase()] ?? 0) + (value || 0);
                }

                setPlayerStats(summed);
            })
            .catch((err) => {
                if (err?.name === "AbortError") return;
                setError(err instanceof Error ? err.message : "Unknown error occurred");
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, []);

    return { playerStats, loadingPlayerStats, errorPlayerStats };
};
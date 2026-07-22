import { useEffect, useState } from "react";

const API_BASE = "https://api.minebox.co/data";
const PROXY_BASE = "https://mineboxadditions.bartier.me/proxy";

function buildProxyUrl(nick: string): string {
    // 1. Budujemy docelowy URL do Minebox API
    const mineboxUrl = `${API_BASE}/${encodeURIComponent(nick)}`;

    // 2. Owijamy go w proxy jako zakodowany parametr "url"
    const proxyParams = new URLSearchParams({ url: mineboxUrl });

    return `${PROXY_BASE}?${proxyParams.toString()}`;
}

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
            Promise.resolve().then(() => setLoading(false));
            return;
        }

        const controller = new AbortController();

        fetch(buildProxyUrl(nick), {
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
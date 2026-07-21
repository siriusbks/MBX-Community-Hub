import { useState, useEffect } from "react";
import type { MineboxClass } from "types/class";

const API_URL = "https://api.minebox.co/classes";

export const useClasses = (locale: "en" | "fr" | "pl" = "en") => {
    const [classes, setClasses] = useState<MineboxClass[]>([]);
    const [loadingClasses, setLoading] = useState(true);
    const [errorClasses, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        fetch(`${API_URL}?locale=${locale}`, { signal: controller.signal, cache: "no-store" })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setClasses(Array.isArray(data?.classes) ? data.classes : []);
            })
            .catch((err) => {
                if (err?.name === "AbortError") return;
                setError(err instanceof Error ? err.message : "Unknown error occurred");
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [locale]);

    return { classes, loadingClasses, errorClasses };
};
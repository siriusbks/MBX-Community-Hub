/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { useState, useEffect } from "react";
import type { MineboxClass } from "types/class";

const API_URL = "https://api.minebox.co/classes";

/**
 * useClasses — fetches the class catalog from api.minebox.co/classes.
 * This is intentionally NOT part of useEquipment: classes live on a
 * different endpoint with a different shape (tiers instead of
 * min/max stats, base64 image instead of URL, no pagination).
 */
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
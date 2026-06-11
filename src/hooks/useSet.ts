/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { useEffect, useState, useMemo } from "react";
import { Equipment } from "@t/equip";

export interface SetBonus {
    id: string;
    name: string;
    bonuses: Record<string, Record<string, number>>; // Palier => {stat: value}
}

export interface SetWithBonus {
    id: string;
    name: string;
    count: number;
    bestLevel: number;
    bonuses: Record<string, number>;
}

/**
 * Loads the sets and provides tools to find and apply bonuses
 */
export function useSets(locale: "en" | "fr" | "pl" = "en") {
    const [sets, setSets] = useState<SetBonus[]>([]);
    const [loadingSets, setLoading] = useState(true);
    const [errorSets, setError] = useState<string | null>(null);

    useEffect(() => {
        let aborted = false;
        setLoading(true);
        setError(null);

        fetch(`https://api.minebox.co/sets?locale=${locale}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => {
            if (aborted) return;
            setSets(data.sets || []);
        })
        .catch(e => {
            if (aborted) return;
            setError(e?.message || "Error loading sets");
        })
        .finally(() => {
            if (!aborted) setLoading(false);
        });

        return () => {
        aborted = true;
        };
    }, [locale]);

    // Index (id or name => set)
    const setsById = useMemo(
        () =>
        sets.reduce<{ [id: string]: SetBonus }>(
            (acc, set) => {
            acc[set.id] = set;
            if (set.name) acc[set.name] = set;
            return acc;
            },
            {}
        ),
        [sets]
    );

    /**
     * Returns a list of active sets (with their level-based (tier-based) bonuses for the current equipped items)
     * Returns an array: [{id, name, count, bestLevel, bonuses}]
     */
    function getActiveSets(equippedItems: { [key: string]: Equipment | null }): SetWithBonus[] {
        const setCounts: Record<string, number> = {};
        Object.values(equippedItems).forEach(item => {
            if (item?.set) setCounts[item.set] = (setCounts[item.set] || 0) + 1;
        });

        return Object.entries(setCounts).map(([setName, count]) => {
            if (count < 2) return null; // Bonus de set actif qu’à partir de 2
            const setData = setsById[setName];
            if (!setData || !setData.bonuses) return null;

            const levels = Object.keys(setData.bonuses).map(Number).filter(n => n <= count);
            if (levels.length === 0) return null;
            const bestLevel = Math.max(...levels);
            const bonuses = setData.bonuses[bestLevel.toString()];
            if (!bonuses) return null;

            return {
                id: setData.id,
                name: setData.name,
                count,
                bestLevel,
                bonuses,
            };
        }).filter(Boolean) as SetWithBonus[];
    }


    /**
     * Fusionne les bonus de tous les sets actifs pour un equippedItems
     * (pour injecter dans calcul stats globaux)
     */
    function getTotalSetBonus(equippedItems: { [key: string]: Equipment | null }): Record<string, number> {
        const setCounts: Record<string, number> = {};
        Object.values(equippedItems).forEach(item => {
            if (item?.set) setCounts[item.set] = (setCounts[item.set] || 0) + 1;
        });

        const total: Record<string, number> = {};

        Object.entries(setCounts).forEach(([setName, count]) => {
            if (count < 2) return; // we don't take bonuses below 2
            const setData = setsById[setName];
            if (!setData) return;

            const levels = Object.keys(setData.bonuses).map(Number).filter(n => n <= count);
            if (levels.length === 0) return; // none of the tier match
            const bestLevel = Math.max(...levels);
            const bonuses = setData.bonuses[bestLevel.toString()];
            if (!bonuses) return;

            Object.entries(bonuses).forEach(([stat, value]) => {
            total[stat] = (total[stat] || 0) + value;
            });
        });

        return total;
    }

    return {
        sets,
        loadingSets,
        errorSets,
        getActiveSets,
        getTotalSetBonus,
        setsById,
    };
}
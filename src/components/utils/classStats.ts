/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import type { MineboxClass } from "types/class";

/** True if the class has at least one numbered tier (1-5) with stats. */
export function hasClassTiers(cls: MineboxClass): boolean {
    if (!cls.tiers) return false;
    return [1, 2, 3, 4, 5].some((n) => !!cls.tiers[String(n)]?.stats);
}

/**
 * Active tier's stat entries, including the "all" tier's stats but only
 * when tier 1 is selected (tiers 2-5 already define their own value for
 * anything "all" would otherwise duplicate/conflict with).
 */
export function getClassStatEntries(
    cls: MineboxClass | null,
    tier: number
): Array<[string, number | string]> {
    if (!cls?.tiers) return [];
    const tierData = cls.tiers[String(tier)];
    const allData = cls.tiers.all;

    const entries: Array<[string, number | string]> = [];
    if (tierData?.stats) entries.push(...Object.entries(tierData.stats));
    if (tier === 1 && allData?.stats) entries.push(...Object.entries(allData.stats));
    return entries;
}

/**
 * Only the numeric stats of the active tier (percentage strings like
 * "-70%" can't be summed linearly into the main stats total, so they're
 * excluded here and only shown informationally in the Class section).
 */
export function getClassNumericStats(cls: MineboxClass | null, tier: number): Record<string, number> {
    const out: Record<string, number> = {};
    for (const [stat, value] of getClassStatEntries(cls, tier)) {
        if (typeof value === "number") out[stat] = value;
    }
    return out;
}

/**
 * Tier 1 -> Tier 5 value range for every stat the class has, used to
 * preview a class before picking a tier (same idea as an item's min/max
 * stat range). Falls back to the "all" tier's value when tier 1 or 5
 * doesn't define that stat itself.
 */
export function getClassTier1To5Range(
    cls: MineboxClass
): Array<[string, number | string | undefined, number | string | undefined]> {
    if (!cls.tiers) return [];
    const tier1 = cls.tiers["1"]?.stats ?? {};
    const tier5 = cls.tiers["5"]?.stats ?? {};
    const allStats = cls.tiers.all?.stats ?? {};

    const statKeys = Array.from(new Set([...Object.keys(tier1), ...Object.keys(tier5)]));
    return statKeys.map((stat) => [stat, tier1[stat] ?? allStats[stat], tier5[stat] ?? allStats[stat]]);
}

/** Formats a tier1-tier5 range, handling missing sides and percentage strings. */
export function formatClassStatRange(from?: number | string, to?: number | string): string {
    if (from === undefined && to === undefined) return "-";
    if (from === undefined) return String(to);
    if (to === undefined) return String(from);
    return from === to ? String(from) : `${from} - ${to}`;
}
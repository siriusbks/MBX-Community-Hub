/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import type { TFunction } from "i18next";

export type StatKey =
    | "AGILITY"
    | "HEALTH"
    | "LUCK"
    | "WISDOM"
    | "STRENGTH"
    | "FORTUNE"
    | "DEFENSE"
    | "INTELLIGENCE";

export type StatMap = Partial<Record<StatKey, number>>;

export type Skull = {
    id: string;
    name: string;
    icon?: string;
    stats: StatMap;
};

export const SKULLS: Skull[] = [
    {
        id: "basic",
        name: "Basic skull",
        icon: "assets/media/skulls/basic.png",
        stats: { WISDOM: 25, HEALTH: 25 },
    },
    {
        id: "pineapple",
        name: "Pineapple skull",
        icon: "assets/media/skulls/pineapple.png",
        stats: { LUCK: 50, HEALTH: 25 },
    },
    {
        id: "chad",
        name: "Chad skull",
        icon: "assets/media/skulls/chad.png",
        stats: { STRENGTH: 250 },
    },
    {
        id: "thunder",
        name: "Thunder skull",
        icon: "assets/media/skulls/thunder.png",
        stats: { LUCK: 100, INTELLIGENCE: 100 },
    },
    {
        id: "opal",
        name: "Opal skull",
        icon: "assets/media/skulls/opal.png",
        stats: { LUCK: 200, INTELLIGENCE: 200, AGILITY: 200, STRENGTH: 200 },
    },
    {
        id: "grumpy",
        name: "Grumpy skull",
        icon: "assets/media/skulls/grumpy.png",
        stats: { INTELLIGENCE: 100, STRENGTH: 100 },
    },
    {
        id: "crimson",
        name: "Crimson skull",
        icon: "assets/media/skulls/crimson.png",
        stats: { INTELLIGENCE: 250, AGILITY: 250, DEFENSE: 100 },
    },
    {
        id: "jackpot",
        name: "Jackpot skull",
        icon: "assets/media/skulls/jackpot.png",
        stats: { FORTUNE: 250 },
    },
    {
        id: "sage",
        name: "Sage skull",
        icon: "assets/media/skulls/sage.png",
        stats: { WISDOM: 80 },
    },
    {
        id: "abyss",
        name: "Abyss skull",
        icon: "assets/media/skulls/abyss.png",
        stats: { WISDOM: 250, LUCK: 250 },
    },
];

export function sumSkullStats(ids: string[]): StatMap {
    const out: StatMap = {};
    for (const id of ids) {
        const s = SKULLS.find((k) => k.id === id);
        if (!s) continue;
        for (const [stat, val] of Object.entries(s.stats) as Array<
            [StatKey, number]
        >) {
            out[stat] = (out[stat] ?? 0) + (val ?? 0);
        }
    }
    return out;
}

export function getSkullLabel(id: string, t: TFunction<"skulls">): string {
    const fallback = SKULLS.find((s) => s.id === id)?.name ?? id;
    return t(`skulls.names.${id}`, { defaultValue: fallback });
}

export function getStatLabel(stat: StatKey, t: TFunction<"common">): string {
    return t(`common:stats.${stat}`, { defaultValue: stat });
}

/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export type Skull = {
    id: string;
    name: string;
    stats: Record<string, number>;
};

export const SKULLS: Skull[] = [
    {
        id: "basic",
        name: "Basic skull",
        stats: { WISDOM: 25, HEALTH: 25 },
    },
    {
        id: "pineapple",
        name: "Pineapple skull",
        stats: { LUCK: 50, HEALTH: 25 },
    },
    {
        id: "chad",
        name: "Chad skull",
        stats: { STRENGTH: 250 },
    },
    {
        id: "thunder",
        name: "Thunder skull",
        stats: { LUCK: 100, INTELLIGENCE: 100 },
    },
    {
        id: "opal",
        name: "Opal skull",
        stats: { LUCK: 200, INTELLIGENCE: 200, AGILITY: 200, STRENGTH: 200 },
    },
    {
        id: "grumpy",
        name: "Grumpy skull",
        stats: { INTELLIGENCE: 100, STRENGTH: 100 },
    },
    {
        id: "crimson",
        name: "Crimson skull",
        stats: { INTELLIGENCE: 250, AGILITY: 250, DEFENSE: 100 },
    },
    {
        id: "jackpot",
        name: "Jackpot skull",
        stats: { FORTUNE: 250 },
    },
    {
        id: "sage",
        name: "Sage skull",
        stats: { WISDOM: 80 },
    },
    {
        id: "abyss",
        name: "Abyss skull",
        stats: { WISDOM: 250, LUCK: 250 },
    },
];

export function sumSkullStats(ids: string[]): Record<string, number> {
    const out: Record<string, number> = {};
    for (const id of ids) {
        const s = SKULLS.find((k) => k.id === id);
        if (!s) continue;
        for (const [stat, val] of Object.entries(s.stats)) {
            out[stat] = (out[stat] ?? 0) + (val ?? 0);
        }
    }
    return out;
}

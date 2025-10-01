/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { create } from "zustand";
import background_default from "/assets/media/profile/background/mineboxcover.webp";
import { ProfileState, Profession } from "@t/index";

// Static professions data
const STATIC_PROFESSIONS: Omit<Profession, "level" | "currentXP">[] = [
    { id: "alchemy", name: "Alchemist", maxXP: 75, enabled: true },
    { id: "blacksmithing", name: "Blacksmith", maxXP: 75, enabled: true },
    { id: "cooking", name: "Cook", maxXP: 75, enabled: true },
    { id: "farming", name: "Farmer", maxXP: 75, enabled: true },
    { id: "fishing", name: "Fisherman", maxXP: 75, enabled: true },
    { id: "hunting", name: "Hunter", maxXP: 75, enabled: true },
    { id: "jeweling", name: "Jeweler", maxXP: 75, enabled: true },
    { id: "lumberjack", name: "Lumberjack", maxXP: 75, enabled: true },
    { id: "mining", name: "Miner", maxXP: 75, enabled: true },
    { id: "shoemaking", name: "Shoemaker", maxXP: 75, enabled: true },
    { id: "tailoring", name: "Tailor", maxXP: 75, enabled: true },
    { id: "tinkering", name: "Tinkerer", maxXP: 75, enabled: true },
    { id: "runeforging", name: "Runeforger", maxXP: 75, enabled: true },
];

const staticMap = Object.fromEntries(STATIC_PROFESSIONS.map((p) => [p.id, p]));

const defaultDynamic = Object.keys(staticMap).map((id) => ({
    id,
    level: 1,
    currentXP: 0,
}));

function mergeProfession(dynamic: {
    id: string;
    level: number;
    currentXP: number;
}): Profession {
    const staticData = staticMap[dynamic.id];
    return { ...dynamic, ...staticData };
}

export const useProfileStore = create<ProfileState>()((set, get) => ({
    username: "6rius",
    uuid: "1ffb3a0d4c5d47089bf626cbe70023eb",
    level: 1,
    background: background_default,
    professions: defaultDynamic.map(mergeProfession),

    setUsername: (username) => set({ username }),
    setUUID: (uuid) => set({ uuid }),
    setLevel: (value) =>
        set((state) => ({
            level: typeof value === "function" ? value(state.level) : value,
        })),
    setBackground: (background) => set({ background }),

    updateProfession: (id, updates) => {
        const updated = get().professions.map((prof) =>
            prof.id === id ? { ...prof, ...updates } : prof
        );
        set({ professions: updated });
    },
}));

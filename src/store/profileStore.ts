/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

import background_default from "/assets/media/profile/background/mineboxcover.webp";
import { ProfileState, Profession } from "../types";
// Static professions data
// This data is used to initialize the professions in the profile store
const STATIC_PROFESSIONS: Omit<Profession, "level" | "currentXP">[] = [
    {
        id: "alchemy",
        name: "Alchemist",
        maxXP: 75,
        priority: true,
        enabled: true,
    },
    {
        id: "blacksmithing",
        name: "Blacksmith",
        maxXP: 75,
        priority: false,
        enabled: true,
    },
    {
        id: "cooking",
        name: "Cook",
        maxXP: 75,
        priority: false,
        enabled: true,
    },
    {
        id: "farming",
        name: "Farmer",
        maxXP: 75,
        priority: false,
        enabled: true,
    },
    {
        id: "fishing",
        name: "Fisherman",
        maxXP: 75,
        priority: true,
        enabled: true,
    },
    {
        id: "hunting",
        name: "Hunter",
        maxXP: 75,
        priority: false,
        enabled: true,
    },
    {
        id: "jeweling",
        name: "Jeweler",
        maxXP: 75,
        priority: false,
        enabled: true,
    },
    {
        id: "lumberjack",
        name: "Lumberjack",
        maxXP: 75,
        priority: true,
        enabled: true,
    },
    {
        id: "mining",
        name: "Miner",
        maxXP: 75,
        priority: true,
        enabled: true,
    },
    {
        id: "shoemaking",
        name: "Shoemaker",
        maxXP: 75,
        priority: false,
        enabled: true,
    },
    {
        id: "tailoring",
        name: "Tailor",
        maxXP: 75,
        priority: false,
        enabled: true,
    },
    {
        id: "tinkering",
        name: "Tinkerer",
        maxXP: 75,
        priority: false,
        enabled: true,
    },
    {
        id: "runeforging",
        name: "Runeforger",
        maxXP: 75,
        priority: false,
        enabled: true,
    },
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
    return {
        ...dynamic,
        ...staticData,
    };
}

export const useProfileStore = create<ProfileState>()(
    persist(
        (set, get) => ({
            username: "6rius",
            uuid: "1ffb3a0d4c5d47089bf626cbe70023eb",
            level: 1,
            playtime: 0,
            daily: 0,
            weekly: 0,
            museum: 0,
            relics: [],
            background: background_default,
            professions: defaultDynamic.map(mergeProfession),

            setUsername: (username) => set({ username }),
            setUUID: (uuid) => set({ uuid }),
            setLevel: (value) =>
                set((state) => ({
                    level:
                        typeof value === "function"
                            ? value(state.level)
                            : value,
                })),
            setPlaytime: (value) =>
                set((state) => ({
                    playtime:
                        typeof value === "function"
                            ? value(state.playtime)
                            : value,
                })),
            setDaily: (value) =>
                set((state) => ({
                    daily:
                        typeof value === "function"
                            ? value(state.daily)
                            : value,
                })),
            setWeekly: (value) =>
                set((state) => ({
                    weekly:
                        typeof value === "function"
                            ? value(state.weekly)
                            : value,
                })),
            setMuseum: (value) =>
                set((state) => ({
                    museum:
                        typeof value === "function"
                            ? value(state.museum)
                            : value,
                })),
            setRelics: (value) =>
                set((state) => ({
                    relics:
                        typeof value === "function"
                            ? value(state.relics)
                            : value,
                })),
            setBackground: (background) => set({ background }),

            updateProfession: (id, updates) => {
                const updated = get().professions.map((prof) =>
                    prof.id === id ? { ...prof, ...updates } : prof
                );
                set({ professions: updated });
            },
        }),
        {
            name: "profileData",
            partialize: (state) => ({
                username: state.username,
                uuid: state.uuid,
                level: state.level,
                playtime: state.playtime,
                daily: state.daily,
                weekly: state.weekly,
                museum: state.museum,
                background: state.background,
                professions: state.professions.map(
                    ({ id, level, currentXP }) => ({
                        id,
                        level,
                        currentXP,
                    })
                ),
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.professions = state.professions.map(mergeProfession);
                }
            },
        }
    )
);

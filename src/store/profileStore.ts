/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import background_default from "/assets/media/profile/background/dftvvfnv.bmp";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Profession, ProfileState } from "../types";

const DEFAULT_PROFESSIONS: Profession[] = [
    {
        id: "alchemy",
        name: "Alchemist",
        level: 1,
        currentXP: 0,
        maxXP: 75,
        icon: "⚗️",
        enabled: true,
    },
    {
        id: "blacksmithing",
        name: "Blacksmith",
        level: 1,
        currentXP: 0,
        maxXP: 75,
        icon: "🔨",
        enabled: true,
    },
    {
        id: "cooking",
        name: "Cook",
        level: 1,
        currentXP: 0,
        maxXP: 75,
        icon: "🍳",
        enabled: true,
    },
    {
        id: "farming",
        name: "Farmer",
        level: 1,
        currentXP: 0,
        maxXP: 75,
        icon: "🌾",
        enabled: true,
    },
    {
        id: "fishing",
        name: "Fisherman",
        level: 1,
        currentXP: 0,
        maxXP: 75,
        icon: "🎣",
        enabled: true,
    },
    {
        id: "hunting",
        name: "Hunter",
        level: 1,
        currentXP: 0,
        maxXP: 75,
        icon: "🏹",
        enabled: true,
    },
    {
        id: "jeweling",
        name: "Jeweler",
        level: 1,
        currentXP: 0,
        maxXP: 75,
        icon: "💎",
        enabled: true,
    },
    {
        id: "lumberjack",
        name: "Lumberjack",
        level: 1,
        currentXP: 0,
        maxXP: 75,
        icon: "🪓",
        enabled: true,
    },
    {
        id: "mining",
        name: "Miner",
        level: 1,
        currentXP: 0,
        maxXP: 75,
        icon: "⛏️",
        enabled: true,
    },
    {
        id: "shoemaking",
        name: "Shoemaker",
        level: 1,
        currentXP: 0,
        maxXP: 75,
        icon: "👢",
        enabled: true,
    },
    {
        id: "tailoring",
        name: "Tailor",
        level: 1,
        currentXP: 0,
        maxXP: 75,
        icon: "🧵",
        enabled: true,
    },
    {
        id: "tinkering",
        name: "Tinkerer",
        level: 1,
        currentXP: 0,
        maxXP: 75,
        icon: "⚙️",
        enabled: true,
    },
];

const defaultProfileState = {
    username: "SiriusB_",
    uuid: "1ffb3a0d4c5d47089bf626cbe70023eb",
    level: 1,
    background: background_default,
    professions: DEFAULT_PROFESSIONS,
};

export const useProfileStore = create<ProfileState>()(
    persist(
        (set, get) => ({
            ...defaultProfileState,

            setUsername: (username) => {
                set({ username });
            },

            setUUID: (uuid) => {
                set({ uuid });
            },

            setLevel: (value) => {
                set((state) => {
                    if (typeof value === "function") {
                        return { ...state, level: value(state.level) };
                    }
                    return { ...state, level: value };
                });
            },

            setBackground: (background) => {
                set({ background });
            },

            updateProfession: (id, updates) => {
                const { professions } = get();
                const newProfessions = professions.map((prof) =>
                    prof.id === id ? { ...prof, ...updates } : prof
                );
                set({ professions: newProfessions });
            },
        }),
        {
            name: "profileData",
        }
    )
);

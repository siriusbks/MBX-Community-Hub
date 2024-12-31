/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { create } from "zustand";

import background_default from "../assets/media/dftvvfnv.bmp";
import { ProfileState } from "../types";
const DEFAULT_PROFESSIONS = [
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

// Load saved data from localStorage or use defaults
const loadFromStorage = () => {
    try {
        const savedData = localStorage.getItem("profileData");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            return {
                username: parsed.username || "",
                uuid: parsed.uuid || "",
                level: parsed.level || 1,
                background: parsed.background || background_default,
                professions: parsed.professions || DEFAULT_PROFESSIONS,
            };
        }
    } catch (error) {
        console.error("Error loading from localStorage:", error);
    }
    return null;
};

// Save state to localStorage
const saveToStorage = (state: Partial<ProfileState>) => {
    try {
        localStorage.setItem("profileData", JSON.stringify(state));
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
};

// Initialize state with saved data or defaults
const initialState = loadFromStorage() || {
    username: "",
    uuid: "",
    level: 1,
    background: background_default,
    professions: DEFAULT_PROFESSIONS,
};

export const useProfileStore = create<ProfileState>((set) => ({
    ...initialState,

    setUsername: (username) =>
        set((state) => {
            const newState = { ...state, username };
            saveToStorage(newState);
            return newState;
        }),

    setUUID: (uuid) =>
        set((state) => {
            const newState = { ...state, uuid };
            saveToStorage(newState);
            return newState;
        }),

    setLevel: (level) =>
        set((state) => {
            const newState = { ...state, level };
            saveToStorage(newState);
            return newState;
        }),

    setBackground: (background) =>
        set((state) => {
            const newState = { ...state, background };
            saveToStorage(newState);
            return newState;
        }),

    updateProfession: (id, updates) =>
        set((state) => {
            const newState = {
                ...state,
                professions: state.professions.map((prof) =>
                    prof.id === id ? { ...prof, ...updates } : prof
                ),
            };
            saveToStorage(newState);
            return newState;
        }),
}));

/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import type { BoxClickerProgress } from "../types/boxClicker";

const STORAGE_KEY = "mbx_box_clicker_progress";

export const defaultBoxProgress: BoxClickerProgress = {
    openings: 0,
    inventory: {},
    lastDropId: null,
};

export const loadBoxProgress = (): BoxClickerProgress => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return defaultBoxProgress;
        }

        const parsed = JSON.parse(raw);

        return {
            openings: typeof parsed.openings === "number" ? parsed.openings : 0,
            inventory:
                parsed.inventory && typeof parsed.inventory === "object"
                    ? parsed.inventory
                    : {},
            lastDropId:
                typeof parsed.lastDropId === "string"
                    ? parsed.lastDropId
                    : null,
        };
    } catch (error) {
        console.warn("Could not load box clicker progress", error);
        return defaultBoxProgress;
    }
};

export const saveBoxProgress = (progress: BoxClickerProgress) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
        console.warn("Could not save box clicker progress", error);
    }
};

export const clearBoxProgress = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.warn("Could not clear box clicker progress", error);
    }
};

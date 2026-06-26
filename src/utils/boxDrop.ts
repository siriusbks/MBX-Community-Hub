/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import type { BoxItem } from "../types/boxClicker";

export const pickWeightedDrop = (items: BoxItem[]): BoxItem | null => {
    if (!items.length) return null;

    const totalWeight = items.reduce((sum, item) => sum + item.dropRate, 0);

    if (totalWeight <= 0) return null;

    const roll = Math.random() * totalWeight;

    let currentWeight = 0;

    for (const item of items) {
        currentWeight += item.dropRate;

        if (roll <= currentWeight) {
            return item;
        }
    }

    return items[items.length - 1];
};
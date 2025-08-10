/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Equipment, PlayerStats } from "@t/equip";

export const calculateTotalStats = (equippedItems: {
    [key: string]: Equipment | null;
}): PlayerStats => {
    const total: PlayerStats = {};
    Object.values(equippedItems).forEach((item) => {
        if (!item?.stats) return;
        for (const [name, range] of Object.entries(item.stats)) {
            total[name] ??= [0, 0];
            total[name][0] += range[0] || 0;
            total[name][1] += range[1] ?? range[0] ?? 0;
        }
    });
    return total;
};

export const formatStatRange = (range: number[]): string =>
    range[0] === range[1] ? `${range[0]}` : `${range[0]} - ${range[1]}`;

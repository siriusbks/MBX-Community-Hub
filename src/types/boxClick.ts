/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export interface BoxItem {
    id: string;

    /**
     * IMPORTANT:
     * 0.1510 = 15.10%
     * 0.0034 = 0.34%
     */
    dropRate: number;
}

export interface BoxConfig {
    box: string;
    price: number;
    image: string;
    items: BoxItem[];
}

export interface BoxClickerProgress {
    openings: number;
    inventory: Record<string, number>;
    lastDropId: string | null;
}

export interface MineboxItemDetails {
    id: string;
    type?: string;
    rarity?: string;
    image?: string;
    level?: number;
    name?: string;
    lore?: string;
    description?: string;
    stats?: unknown;
    damages?: unknown;
    used_in_recipes?: unknown;
}

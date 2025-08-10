/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export interface Equipment {
    id: string;
    name: string;
    category: string;
    rarity: string;
    image: string;
    stats?: { [key: string]: number[] };
    level?: number;
}

export interface EquipmentSlot {
    image: string;
    id: string;
    name: string;
    category: string;
    position: { top: string; left: string };
}

export interface PlayerStats {
    [key: string]: number[];
}

export interface EquippedItems {
    [key: string]: Equipment | null;
}

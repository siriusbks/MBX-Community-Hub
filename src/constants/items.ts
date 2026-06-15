/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

export const NO_DECOMPOSE_PREFIXES = [
    "transformed_",
    "bag_",
    "crate_",
    "barrel_",
    "enchanted_b",
    "enchanted_c",
    "enchanted_k",
    "enchanted_m",
    "enchanted_n",
    "enchanted_p",
    "enchanted_s",
    "enchanted_w",
];

// Rarity order mapping (higher number = rarer)
export const rarityOrder: Record<string, number> = {
    prototype: 1,
    contraband: 1,
    trash: 0,
    common: -1,
    uncommon: -2,
    rare: -3,
    epic: -4,
    legendary: -5,
    mythic: -6,
};
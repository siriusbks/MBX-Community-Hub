/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { EquipmentSlot } from "@t/equip";

/**
 * Layout: 3 columns × 4 rows (approx) in a container 350×520px
 *
 *  Col L (20%)   Col C (50%)   Col R (80%)
 *  ─────────────────────────────────────────
 *  necklace      helmet        ring1         row 1  top ~8%
 *  backpack      chestplate    ring2         row 2  top ~28%
 *  belt          leggings      gloves        row 3  top ~48%
 *  pet           boots         (–)           row 4  top ~68%
 */
export const EQUIPMENT_SLOTS: EquipmentSlot[] = [
    // Row 1
    {
        id: "necklace",
        name: "Necklace",
        category: "NECKLACE",
        image: "",
        position: { top: "8%", left: "20%" },
    },
    {
        id: "helmet",
        name: "Helmet",
        category: "HELMET",
        image: "",
        position: { top: "8%", left: "50%" },
    },
    {
        id: "ring1",
        name: "Ring 1",
        category: "RING",
        image: "",
        position: { top: "8%", left: "80%" },
    },
 
    // Row 2
    {
        id: "backpack",
        name: "Backpack",
        category: "BACK",
        image: "",
        position: { top: "28%", left: "20%" },
    },
    {
        id: "chestplate",
        name: "Chestplate",
        category: "CHESTPLATE",
        image: "",
        position: { top: "28%", left: "50%" },
    },
    {
        id: "ring2",
        name: "Ring 2",
        category: "RING",
        image: "",
        position: { top: "28%", left: "80%" },
    },
 
    // Row 3
    {
        id: "belt",
        name: "Belt",
        category: "BELT",
        image: "",
        position: { top: "48%", left: "20%" },
    },
    {
        id: "leggings",
        name: "Leggings",
        category: "LEGGINGS",
        image: "",
        position: { top: "48%", left: "50%" },
    },
    {
        id: "gloves",
        name: "Gloves",
        category: "GLOVES",
        image: "",
        position: { top: "48%", left: "80%" },
    },
 
    // Row 4
    {
        id: "pet",
        name: "Pet",
        category: "PET",
        image: "",
        position: { top: "68%", left: "20%" },
    },
    {
        id: "boots",
        name: "Boots",
        category: "BOOTS",
        image: "",
        position: { top: "68%", left: "50%" },
    },
];

export const getRarityColor = (rarity: string): string => {
    const map: Record<string, string> = {
        TRASH: "border-TRASH bg-TRASH-50",
        COMMON: "border-COMMON bg-COMMON-50",
        UNCOMMON: "border-UNCOMMON bg-UNCOMMON-50",
        RARE: "border-RARE bg-RARE-50",
        EPIC: "border-EPIC bg-EPIC-50",
        LEGENDARY: "border-LEGENDARY bg-LEGENDARY-50",
        MYTHIC: "border-MYTHIC bg-MYTHIC-50",
        CONTRABAND: "border-CONTRABAND bg-CONTRABAND-50",
    };
    return `border ${map[rarity] ?? map.COMMON}`;
};
export const getRarityBadge = (rarity: string): string => {
    const map: Record<string, string> = {
        TRASH: "bg-TRASH",
        COMMON: "bg-COMMON",
        UNCOMMON: "bg-UNCOMMON",
        RARE: "bg-RARE",
        EPIC: "bg-EPIC",
        LEGENDARY: "bg-LEGENDARY",
        MYTHIC: "bg-MYTHIC",
        CONTRABAND: "bg-CONTRABAND",
    };
    return ` ${map[rarity] ?? map.COMMON}`;
};

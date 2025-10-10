/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { EquipmentSlot } from "@t/equip";

export const EQUIPMENT_SLOTS: EquipmentSlot[] = [
    {
        id: "necklace",
        name: "Necklace",
        category: "NECKLACE",
        image: "",
        position: { top: "5%", left: "20%" },
    },
    {
        id: "helmet",
        name: "Helmet",
        category: "HELMET",
        image: "",
        position: { top: "5%", left: "50%" },
    },
    {
        id: "ring1",
        name: "Ring 1",
        category: "RING",
        image: "",
        position: { top: "5%", left: "80%" },
    },
    {
        id: "backpack",
        name: "Backpack",
        category: "BACK",
        image: "",
        position: { top: "25%", left: "20%" },
    },
    {
        id: "chestplate",
        name: "Chestplate",
        category: "CHESTPLATE",
        image: "",
        position: { top: "25%", left: "50%" },
    },
    {
        id: "ring2",
        name: "Ring 2",
        category: "RING",
        image: "",
        position: { top: "25%", left: "80%" },
    },
    {
        id: "belt",
        name: "Belt",
        category: "BELT",
        image: "",
        position: { top: "45%", left: "20%" },
    },
    {
        id: "leggings",
        name: "Leggings",
        category: "LEGGINGS",
        image: "",
        position: { top: "45%", left: "50%" },
    },
    {
        id: "boots",
        name: "Boots",
        category: "BOOTS",
        image: "",
        position: { top: "65%", left: "50%" },
    },
    {
        id: "pet",
        name: "Pet",
        category: "PET",
        image: "",
        position: { top: "65%", left: "20%" },
    },
];

export const getRarityColor = (rarity: string): string => {
    const map: Record<string, string> = {
        COMMON: "border-COMMON bg-COMMON-50",
        UNCOMMON: "border-UNCOMMON bg-UNCOMMON-50",
        RARE: "border-RARE bg-RARE-50",
        EPIC: "border-EPIC bg-EPIC-50",
        LEGENDARY: "border-LEGENDARY bg-LEGENDARY-50",
        MYTHIC: "border-MYTHIC bg-MYTHIC-50",
    };
    return `border ${map[rarity] ?? map.COMMON}`;
};
export const getRarityBadge = (rarity: string): string => {
    const map: Record<string, string> = {
        COMMON: "bg-COMMON",
        UNCOMMON: "bg-UNCOMMON",
        RARE: "bg-RARE",
        EPIC: "bg-EPIC",
        LEGENDARY: "bg-LEGENDARY",
        MYTHIC: "bg-MYTHIC",
    };
    return ` ${map[rarity] ?? map.COMMON}`;
};

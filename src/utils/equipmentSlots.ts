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
        COMMON: "border-gray-500 bg-gray-700/50",
        UNCOMMON: "border-green-500 bg-green-900/20",
        RARE: "border-blue-500 bg-blue-900/20",
        EPIC: "border-purple-500 bg-purple-900/20",
        LEGENDARY: "border-orange-500 bg-orange-900/20",
        MYTHIC: "border-red-500 bg-red-900/20",
    };
    return `border ${map[rarity] ?? map.COMMON}`;
};
export const getRarityBadge = (rarity: string): string => {
    const map: Record<string, string> = {
        COMMON: "bg-gray-500",
        UNCOMMON: "bg-green-500",
        RARE: "bg-blue-500",
        EPIC: "bg-purple-500",
        LEGENDARY: "bg-orange-500",
        MYTHIC: "bg-red-500",
    };
    return ` ${map[rarity] ?? map.COMMON}`;
};

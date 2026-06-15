/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { rarityOrder } from "../constants/items";

type ItemName = string | Record<string, string>;

interface Details {
    [key: string]: {
        id: string;
        image?: string;
        rarity?: string;
        name?: ItemName;
        recipe?: any;
    };
}

type SortIdsByRarityThenNameOptions = {
    ids?: string[];
    detailsIndex: Details | null;
    missingRarity?: Record<string, string>;
    language?: string;
};

const getItemName = (
    itemId: string,
    detailsIndex: Details,
    language: string
): string => {
    const name = detailsIndex[itemId]?.name;

    if (!name) return itemId;

    if (typeof name === "string") {
        return name;
    }

    return name[language] || name.en || itemId;
};

export const sortIdsByRarityThenName = ({
    ids = [],
    detailsIndex,
    missingRarity = {},
    language = "en",
}: SortIdsByRarityThenNameOptions): string[] => {
    if (!detailsIndex) return [...ids];

    return [...ids].sort((a, b) => {
        const ra = (
            detailsIndex[a]?.rarity ||
            missingRarity[a] ||
            ""
        )
            .toString()
            .toLowerCase();

        const rb = (
            detailsIndex[b]?.rarity ||
            missingRarity[b] ||
            ""
        )
            .toString()
            .toLowerCase();

        const oa = rarityOrder[ra] ?? -999;
        const ob = rarityOrder[rb] ?? -999;

        // Highest rarity first
        if (oa !== ob) return ob - oa;

        // Fallback : localized name, then id
        const na = getItemName(a, detailsIndex, language);
        const nb = getItemName(b, detailsIndex, language);

        return na.localeCompare(nb, language || "en", {
            sensitivity: "base",
        });
    });
};
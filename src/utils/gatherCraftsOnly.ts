/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { NO_DECOMPOSE_PREFIXES } from "../constants/items";

interface Details {
    [key: string]: {
        id: string;
        image?: string;
        rarity?: string;
        name?: string;
        recipe?: any;
    };
}

// Utility function to filter out items that should not be broken down
function shouldDecompose(id: string): boolean {
    if (!id) return true;
    return !NO_DECOMPOSE_PREFIXES.some(prefix => id.startsWith(prefix));
}

/**
 * Function to retrieve (recursively) ONLY the crafted items required for a recipe,
 * while excluding items that match NO_DECOMPOSE_PREFIXES.
 */
export function gatherCraftsOnly(
    recipeObj: any,
    detailsIndex: Details
): Record<string, number> {
    const total: Record<string, number> = {};

    if (!recipeObj || !Array.isArray(recipeObj.ingredients)) return total;

    for (const ingr of recipeObj.ingredients) {
        const ingrId = ingr.id;
        const ingrAmount = ingr.amount || ingr.quantity || 1;

        // Check: Does this ingredient need to be broken down, and is there a sub-recipe?
        if (
            ingrId &&
            shouldDecompose(ingrId) &&
            ((ingr.item && ingr.item.recipe) || (detailsIndex[ingrId] && detailsIndex[ingrId].recipe))
        ) {
            // This is a crafted item: add it at the current level
            total[ingrId] = (total[ingrId] || 0) + ingrAmount;

            // Then we RECURSIVELY iterate through its sub-recipe
            const subRecipe =
                ingr.item && ingr.item.recipe
                    ? ingr.item.recipe
                    : detailsIndex[ingrId]?.recipe;
            const subCrafts = gatherCraftsOnly(subRecipe, detailsIndex);

            for (const [subId, subQty] of Object.entries(subCrafts)) {
                total[subId] = (total[subId] || 0) + subQty * ingrAmount;
          }
        }
        // Otherwise, if it's not a craftable item or one to ignore (a basic resource or one matched by one of the prefixes), we move on
    }

    return total;
}
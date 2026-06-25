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

function shouldDecompose(id: string): boolean {
  if (!id) return true;
  return !NO_DECOMPOSE_PREFIXES.some(prefix => id.startsWith(prefix));
}

/**
 * Function to (recursively) group the basic resources required for a recipe
 */
export function gatherResources(
    recipeObj: any,
    detailsIndex: Details
): Record<string, number> {
    const total: Record<string, number> = {};

    if (!recipeObj || !Array.isArray(recipeObj.ingredients)) return total;

    for (const ingr of recipeObj.ingredients) {
        const ingrId = ingr.id;
        const ingrAmount = ingr.amount || ingr.quantity || 1;

        if (
            ingrId &&
            shouldDecompose(ingrId) &&
            ((ingr.item && ingr.item.recipe) || (detailsIndex[ingrId] && detailsIndex[ingrId].recipe))
        ) {
            const subRecipe =
                ingr.item && ingr.item.recipe
                    ? ingr.item.recipe
                    : detailsIndex[ingrId]?.recipe;
            const subRes = gatherResources(subRecipe, detailsIndex);
            for (const [subId, subQty] of Object.entries(subRes)) {
                total[subId] = (total[subId] || 0) + subQty * ingrAmount;
            }
        } else if (ingrId) {
            total[ingrId] = (total[ingrId] || 0) + ingrAmount;
        }
    }

    return total;
}
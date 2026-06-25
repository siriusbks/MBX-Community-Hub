/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { gatherCraftsOnly } from "./gatherCraftsOnly";
import { gatherResources } from "./gatherResources";

interface Group {
    category: string;
    items: string[];
}
interface Details {
    [key: string]: {
        id: string;
        image?: string;
        rarity?: string;
        name?: string;
        recipe?: any;
    };
}

interface HandleCopyCSVOptions {
    groupedItems: Group[] | null;
    detailsIndex: Details | null;
    missingSelection: Record<string, boolean>;
    showBasicSection: boolean;
    showCraftSection: boolean;
    t: (key: string) => string;
}

export async function handleCopyCSV({
    groupedItems,
    detailsIndex,
    missingSelection,
    showBasicSection,
    showCraftSection,
    t,
}: HandleCopyCSVOptions) {
    if (!groupedItems || !detailsIndex) return;

    if (!showBasicSection && !showCraftSection) {
        alert(t("museum.copyCSV.alert.noSectionSelected"));
        return;
    }

    const totalResources: { [key: string]: number } = {};

    groupedItems.forEach((group) => {
        const missingItems = group.items.filter(
            (item) => missingSelection[item]
        );
        missingItems.forEach((itemId) => {
            if (detailsIndex[itemId] && detailsIndex[itemId].recipe) {
                const resourcesForThisItem: Record<string, number> = {};
                if (showCraftSection) {
                    const craftResources = gatherCraftsOnly(
                        detailsIndex[itemId].recipe,
                        detailsIndex
                    );
                    Object.entries(craftResources).forEach(([resId, qty]) => {
                        resourcesForThisItem[resId] = (resourcesForThisItem[resId] || 0) + qty;
                    });
                }
                if (showBasicSection) {
                    const basicResources = gatherResources(
                        detailsIndex[itemId].recipe,
                        detailsIndex
                    );
                    Object.entries(basicResources).forEach(([resId, qty]) => {
                        resourcesForThisItem[resId] = (resourcesForThisItem[resId] || 0) + qty;
                    });
                }
                
                Object.entries(resourcesForThisItem).forEach(([resId, qty]) => {
                    totalResources[resId] = (totalResources[resId] || 0) + qty;
                });
            }
        });
    });

    // Next: Convert totalResources to CSV, then copy it to the clipboard
    let csv = "Resources,Quantity\n";
    Object.entries(totalResources).forEach(([resId, qty]) => {
        csv += `${resId},${qty}\n`;
    });

    try {
        await navigator.clipboard.writeText(csv);
        alert(t("museum.copyCSV.alert.copied"));
    } catch (err) {
        console.error("Copy CSV failed:", err);
    }
}
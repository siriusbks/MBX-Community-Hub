/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { useTranslation } from "react-i18next";
import MuseumItemImage from "./MuseumItemImage";
import ItemTranslation from "../ItemTranslation";
import { gatherCraftsOnly } from "@utils/gatherCraftsOnly";

type Translation = "museum" | "craftPlanner";

type Group = { 
    category: string; 
    items: string[] 
};

interface Details {
    [key: string]: {
        id: string;
        image?: string;
        rarity?: string;
        name?: string;
        recipe?: any;
    };
}

type CraftsOnlyContentProps = {
    groupedItems: Group[] | null;
    detailsIndex: Details | null;
    museumItems: string[];

    missingSelection: Record<string, boolean>;

    setCategory: (id: string) => string;

    translation: Translation;
};

const getItemsRecapTranslationKeys = (translation: Translation) => {
    if (translation === "craftPlanner") {
        return {
            noResourceRquired: "craftPlanner:craftPlanner.noResourceRquired",
        };
    }

    return {
        noResourceRquired: "museum.noResourceRquired",
    };
};

export const CraftsOnlyContent: React.FC<CraftsOnlyContentProps> = ({
    groupedItems,
    detailsIndex,
    museumItems,
    missingSelection,
    setCategory,
    translation,
}) => {
    const { t } = useTranslation(["museum", "craftPlanner", "common"]);

    const translationKey = getItemsRecapTranslationKeys(translation);

    if (!groupedItems || !detailsIndex || !museumItems) {
        return <p>{t("museum.noDataLoaded")}</p>;
    }

    const totalCrafts: Record<string, number> = {};

    groupedItems.forEach((group) => {
        const missingItems = group.items.filter(
            (itemId) => !museumItems.includes(itemId) && missingSelection[itemId],
        );

        missingItems.forEach((itemId) => {
            const recipe = detailsIndex[itemId]?.recipe;
            if (!recipe) return;

            const crafts = gatherCraftsOnly(recipe, detailsIndex);
            for (const craftId in crafts) {
                totalCrafts[craftId] = (totalCrafts[craftId] || 0) + crafts[craftId];
            }
        });
    });

    const sortedCraftIds = Object.keys(totalCrafts).sort((a, b) =>
        a.localeCompare(b, "en", { sensitivity: "base" }),
    );

    if (sortedCraftIds.length === 0) {
        return <p>{t(translationKey.noResourceRquired)}</p>;
    }

    return (
        <span>
            <span className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {sortedCraftIds.map((craftId) => (
                    <li key={craftId} className="block bg-gray-700 p-2 rounded-lg">
                        <div className="flex items-center">
                            <MuseumItemImage
                                groupCategory={setCategory(craftId)}
                                itemId={craftId}
                                detailsIndex={detailsIndex as any}
                                className="w-8 h-8 mr-2 rounded"
                                style={{ imageRendering: "pixelated" }}
                            />
                            <span className="font-bold text-sm">
                                <ItemTranslation
                                    mbxId={craftId}
                                    category={setCategory(craftId)}
                                    type="name"
                                />
                            </span>

                            <span className="ml-auto text-sm font-bold bg-green-600 bg-opacity-30 w-16 py-1 rounded flex items-center justify-center">
                                {totalCrafts[craftId].toLocaleString("fr-FR")}
                            </span>
                        </div>
                    </li>
                ))}
            </span>
        </span>
    );
};

export default CraftsOnlyContent;

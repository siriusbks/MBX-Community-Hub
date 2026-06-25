/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { useTranslation } from "react-i18next";
import MuseumItemImage from "./MuseumItemImage";
import ItemTranslation from "../ItemTranslation";
import { gatherResources } from "@utils/gatherResources";

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

type BasicResourcesContentProps = {
    groupedItems: Group[] | null;
    detailsIndex: Details | null;
    museumItems: string[];
    missingSelection: Record<string, boolean>;
    setCategory: (itemId: string) => string;
};

export const BasicResourcesContent: React.FC<BasicResourcesContentProps> = ({
    groupedItems,
    detailsIndex,
    museumItems,
    missingSelection,
    setCategory,
}) => {
    const { t } = useTranslation(["museum", "common"]);

    if (!groupedItems || !detailsIndex || !museumItems) {
        return <p>{t("museum.noDataLoaded")}</p>;
    }

    const totalResources: Record<string, number> = {};

    groupedItems.forEach((group) => {
        const missingItems = group.items.filter(
            (item) => !museumItems.includes(item) && missingSelection[item]
        );

        missingItems.forEach((itemId) => {
            if (detailsIndex[itemId] && detailsIndex[itemId].recipe) {
                const itemResources = gatherResources(
                    detailsIndex[itemId].recipe,
                    detailsIndex
                );

                for (const resId in itemResources) {
                    totalResources[resId] =
                        (totalResources[resId] || 0) + itemResources[resId];
                }
            }
        });
    });

    const sortedResourceIds = Object.keys(totalResources).sort();

    if (sortedResourceIds.length === 0) {
        return <p>{t("museum.noResourceRquired")}</p>;
    }

    return (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {sortedResourceIds.map((resId) => {
                const category = setCategory(resId);

                return (
                    <li
                        key={resId}
                        className="block bg-gray-700 p-2 rounded-lg"
                    >
                        <div className="flex items-center">
                            <MuseumItemImage
                                groupCategory={category}
                                itemId={resId}
                                detailsIndex={detailsIndex}
                                className="w-8 h-8 mr-2 rounded"
                                style={{ imageRendering: "pixelated" }}
                            />

                            <span className="font-bold text-sm">
                                <ItemTranslation
                                    mbxId={resId}
                                    category={category}
                                    type="name"
                                />
                            </span>

                            <span className="ml-auto text-sm font-bold bg-green-600 bg-opacity-30 w-16 py-1 rounded flex items-center justify-center">
                                {totalResources[resId].toLocaleString("fr-FR")}
                            </span>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default BasicResourcesContent;
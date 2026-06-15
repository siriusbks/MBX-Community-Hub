/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { useTranslation } from "react-i18next";
import MuseumItemImage from "./MuseumItemImage";
import ItemTranslation from "../ItemTranslation";
import i18next from "i18next";
import { sortIdsByRarityThenName } from "@utils/sortIdsByRarityThenName";

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

type MissingItemsRecapContentProps = {
    groupedItems: Group[] | null;
    detailsIndex: Details | null;
    museumItems: string[];
    missingSelection: Record<string, boolean>;
    toggleMissingSelection: (itemId: string) => void;
    missingRarity: Record<string, string>;
};

// Function that returns the content of the missing items recap
export const MissingItemsRecapContent: React.FC<MissingItemsRecapContentProps> = ({
    groupedItems,
    detailsIndex,
    museumItems,
    missingSelection,
    toggleMissingSelection,
    missingRarity,
}) => {
    const { t } = useTranslation(["museum", "common"]);

    if (!groupedItems || !detailsIndex || !museumItems) {
        return <p>{t("museum.noDataLoaded")}</p>;
    }

    return (
        <div>
            <div className="mb-4 flex items-center"></div>

            {groupedItems.map((group, index) => {
                const missingItems = group.items.filter(
                    (item) => !museumItems.includes(item)
                );

                if (missingItems.length === 0) return null;

                const sortedMissing = sortIdsByRarityThenName({
                    ids: missingItems,
                    detailsIndex,
                    missingRarity,
                    language: i18next.language,
                });

                return (
                    <div key={index} className="mb-4">
                        <div className="text-2xl font-bold">
                            <ItemTranslation
                                mbxId="null"
                                category={group.category}
                                type="name"
                            />
                        </div>

                        <ul className="list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                            {sortedMissing.map((itemId) => (
                                <li
                                    key={itemId}
                                    className="flex items-center bg-gray-700 p-2 rounded-lg"
                                >
                                    <input
                                        type="checkbox"
                                        checked={!!missingSelection[itemId]}
                                        onChange={() =>
                                            toggleMissingSelection(itemId)
                                        }
                                        className="mr-2"
                                    />

                                    <MuseumItemImage
                                        groupCategory={group.category}
                                        itemId={itemId}
                                        detailsIndex={detailsIndex}
                                        className="w-8 h-8 mr-2"
                                        style={{
                                            imageRendering: "pixelated",
                                        }}
                                    />

                                    <span className="text-sm font-semibold">
                                        <ItemTranslation
                                            mbxId={itemId}
                                            category={group.category}
                                            type="name"
                                        />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

export default MissingItemsRecapContent;
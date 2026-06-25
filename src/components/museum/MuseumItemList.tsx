/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import { Minus, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MuseumItemCard from "./MuseumItemCard";
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

type Props = {
    groupedItems: Group[] | null;
    detailsIndex: Details | null;
    museumItems: string[];
    showDonated: boolean;
    setCraftModalItem: React.Dispatch<React.SetStateAction<string | null>>
    setCraftModalCategory: React.Dispatch<React.SetStateAction<string | null>>
};

// Function that returns the display of the items grid and the category navigation bar
export const MuseumItemList: React.FC<Props> = ({
  groupedItems,
  detailsIndex,
  museumItems,
  showDonated,
  setCraftModalItem,
  setCraftModalCategory,
}) => {
    const { t } = useTranslation(["museum", "common"]);
    // FIX: items-unobtainable.json loading 1.5K times :)
    const [unobtainable] = useState<string[]>([]);
    const [missingRarity, setMissingRarity] = useState<Record<string, string>>(
        {}
    );
    useEffect(() => {
        fetch("/assets/data/items-missing-rarity.json")
            .then((res) => res.json())
            .then((data) => setMissingRarity(data || {}))
            .catch((err) => console.error("Error loading JSON:", err));
    }, []);

    // Function that is executed when clicking on an unowned item to open the craft modal
    const openCraftModal = (itemId: string, category: string) => {
        setCraftModalItem(itemId);
        setCraftModalCategory(category);
    };

    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const toggleGroup = (category: string) => {
        setExpandedGroups(prev => ({
        ...prev,
        [category]: !prev[category],
        }));
    };

    useEffect(() => {
        if (groupedItems) {
        const allExpanded: Record<string, boolean> = {};
        groupedItems.forEach((group) => {
            allExpanded[group.category] = true;
        });
        setExpandedGroups(allExpanded);
        }
    }, [groupedItems]);

    if (!groupedItems || !detailsIndex) return null;

    return (
        <>
        {groupedItems.map((group, index) => {
            const ownedCount = group.items.filter((item) =>
            museumItems.includes(item)
            ).length;
            const categoryId =
            "cat-" + group.category.toLowerCase().replace(/\s+/g, "-");
            const isExpanded = expandedGroups[group.category];
            return (
                <div key={index} className="category w-full" id={categoryId}>
                    <div
                        className="titreCategory text-2xl font-bold flex flex-row gap-2 items-center mb-2 cursor-pointer select-none"
                        onClick={() => toggleGroup(group.category)}
                    >
                        <img
                            src={`assets/media/museum/${group.category.toUpperCase()}/${group.category.toUpperCase()}.png`}
                            alt={group.category}
                            className="h-8 w-8 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                            style={{
                                imageRendering: "pixelated",
                            }}
                        />
                        <span className="flex items-center">
                            {isExpanded ? (
                                <Minus className="p-0.5 opacity-70" />
                            ) : (
                                <Plus className="p-0.5 opacity-70" />
                            )}
                            {/*
                            <ItemTranslation
                                mbxId="null"
                                category={group.category}
                                type="name"
                            />*/}
                            {t(`museum.category.${group.category.toUpperCase()}`)}
                        </span>
                        <p className=" opacity-40 text-sm">
                            [{ownedCount} / {group.items.length}]
                        </p>
                    </div>

                    <div
                        className={`groupItem grid grid-cols-2 xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-4 justify-between overflow-hidden ${
                            isExpanded ? "opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                        {(() => {
                            const sortedItems= sortIdsByRarityThenName({
                                ids: group.items,
                                detailsIndex,
                                missingRarity,
                                language: i18next.language,
                            });
                            return sortedItems.map((itemId) => {
                            const isOwned = museumItems.includes(itemId);
                            const imageSrc =
                                detailsIndex[itemId] &&
                                detailsIndex[itemId].image
                                    ? "data:image/png;base64," +
                                        detailsIndex[itemId].image
                                    : `assets/media/museum/${group.category}/${itemId}.png`;
                            const rarity =
                                detailsIndex[itemId] &&
                                detailsIndex[itemId].rarity
                                    ? detailsIndex[itemId].rarity
                                    : "UNKNOWN";
                            if (showDonated || !isOwned) {
                                return (
                                    <MuseumItemCard
                                        key={itemId}
                                        itemId={itemId}
                                        imageSrc={imageSrc} // we can use MuseumItemImage but I think, we will have to rewrite the code
                                        isOwned={isOwned}
                                        rarity={rarity}
                                        label={detailsIndex[itemId]?.name}
                                        category={group.category}
                                        unobtainable={unobtainable}
                                        missingRarity={missingRarity}
                                        craftModalOpener={() =>
                                            openCraftModal(
                                                itemId,
                                                group.category
                                            )
                                        }
                                    />
                                );
                            }
                            return null;
                            });
                        })()}
                    </div>
                </div>
            );
        })}
        </>
    );
};
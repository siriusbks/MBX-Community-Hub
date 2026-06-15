/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { List, ListTodo } from "lucide-react";
import ItemsRecapModal from "@components/museum/ItemsRecapModal";
import ResourcesRecapModal from "@components/museum/ResourcesRecapModal";
import MissingItemsRecapContent from "@components/museum/MissingItemsRecapContent";
import BasicResourcesContent from "@components/museum/BasicResourcesContent";
import MuseumItemList from "@components/museum/MuseumItemList";
import CraftModal from "@components/museum/CraftModal";

interface Group {
    category: string;
    items: string[];
}

interface Details {
    [key: string]: {
        id: string;
        image?: string;
        rarity?: string;
        name?: any;
        recipe?: any;
    };
}

type CraftPlannerContentProps = {
    preselectedItems?: string[];
    defaultOpenResourcesModal?: boolean;
};

const EXCLUDED_CATEGORIES: string[] = [
    "art", 
    "treasure", 
    "ship", 
    "scroll", 
    "rune",
    "mount", 
    "jelly", 
    "spawner", 
    "soul", 
    "pet",
    "class", 
    "candy"
];

const CraftPlannerContent: React.FC<CraftPlannerContentProps> = ({
    preselectedItems = [],
    defaultOpenResourcesModal = false,
}) => {
    const { t, i18n } = useTranslation(["craftPlanner", "museum", "common"]);

    const [groupedItems, setGroupedItems] = useState<Group[] | null>(null);
    const [detailsIndex, setDetailsIndex] = useState<Details | null>(null);
    const [museumItems] = useState<string[]>([]);

    const [missingSelection, setMissingSelection] = useState<Record<string, boolean>>({});
    const [selectedItems, setSelectedItems] = useState(false);

    const [missingRarity, setMissingRarity] = useState<Record<string, string>>({});

    const [showItemsModal, setShowItemsModal] = useState(false);
    const [showResourcesModal, setShowResourcesModal] = useState(defaultOpenResourcesModal);

    const [showBasicSection, setShowBasicSection] = useState(true);
    const [showCraftSection, setShowCraftSection] = useState(false);

    const [craftModalItem, setCraftModalItem] = useState<string | null>(null);
    const [craftModalCategory, setCraftModalCategory] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const [museumResponse, itemsResponse, noRecipeResponse, missingRarityResponse] =
                    await Promise.all([
                        fetch("https://api.minebox.co/museum"),
                        fetch("/assets/data/items.json"),
                        fetch("/assets/data/items-no-in-MBapi.json"),
                        fetch("/assets/data/items-missing-rarity.json"),
                    ]);

                const museumRaw = await museumResponse.json();
                const itemsData = await itemsResponse.json();

                const itemsNoRecipeData = noRecipeResponse.ok
                    ? await noRecipeResponse.json()
                    : [];

                const missingRarityData = missingRarityResponse.ok
                    ? await missingRarityResponse.json()
                    : {};

                const groups: Group[] = Object.keys(museumRaw)
                    .filter((category) => !EXCLUDED_CATEGORIES.includes(category))
                    .map((category) => ({
                        category,
                        items: museumRaw[category] || [],
                    }));

                const details: Details = {};

                itemsData.forEach((item: any) => {
                    details[item.id] = item;
                });

                itemsNoRecipeData.forEach((item: any) => {
                    if (!details[item.id]) {
                        details[item.id] = item;
                        return;
                    }

                    details[item.id] = {
                        ...details[item.id],
                        recipe: details[item.id].recipe ?? item.recipe,
                    };
                });

                // Prefer local minebox_items.json for display fields (name, image, rarity)
                try {
                    const mb = await import("@components/museum/itemDataFromApi/minebox_items.json");
                    const mineboxItems: Record<string, any> = (mb?.default ?? mb) as any;

                    if (mineboxItems && typeof mineboxItems === "object") {
                        Object.keys(mineboxItems).forEach((id) => {
                            details[id] = details[id] || ({ id } as any);
                            const src = mineboxItems[id];

                            if (src) {
                                (details[id] as any).name =
                                    typeof src.name === "string"
                                        ? src.name
                                        : src.name?.[i18n.language] ??
                                          src.name?.en ??
                                          (details[id] as any).name;

                                if (src.image) {
                                    (details[id] as any).image = src.image;
                                }

                                if (src.rarity) {
                                    (details[id] as any).rarity = src.rarity;
                                }
                            }
                        });
                    }
                } catch (e) {
                    console.warn("Could not load minebox_items.json", e);
                }

                setGroupedItems(groups);
                setDetailsIndex(details);
                setMissingRarity(missingRarityData || {});

                const preselectedSet = new Set(preselectedItems);
                const hasPreselectedItems = preselectedItems.length > 0;

                const initialSelection: Record<string, boolean> = {};

                groups.forEach((group) => {
                    group.items.forEach((itemId) => {
                        initialSelection[itemId] = hasPreselectedItems
                            ? preselectedSet.has(itemId)
                            : false;
                    });
                });

                setMissingSelection(initialSelection);
                setSelectedItems(
                    Object.values(initialSelection).length > 0 &&
                    Object.values(initialSelection).every(Boolean)
                );
            } catch (err) {
                console.error(err);
                setErrorMsg(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [preselectedItems, i18n.language]);

    const selectedGroupedItems = groupedItems
        ? groupedItems
              .map((group) => ({
                  ...group,
                  items: group.items.filter((itemId) => missingSelection[itemId]),
              }))
              .filter((group) => group.items.length > 0)
        : null;

    const selectedCraftsCount = useMemo(() => {
        return Object.values(missingSelection).filter(Boolean).length;
    }, [missingSelection]);

    const setCategory = (itemId: string): string => {
        if (!groupedItems) return "";

        const found = groupedItems.find((group) => group.items.includes(itemId));
        return found?.category || "";
    };

    const toggleMissingSelection = (itemId: string) => {
        setMissingSelection((prev) => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };

    const toggleSelectAllMissing = () => {
        if (!groupedItems) return;

        const nextValue = !selectedItems;
        const nextSelection: Record<string, boolean> = {};

        groupedItems.forEach((group) => {
            group.items.forEach((itemId) => {
                nextSelection[itemId] = nextValue;
            });
        });

        setMissingSelection(nextSelection);
        setSelectedItems(nextValue);
    };

    if (loading) {
        return <div className="text-gray-300">Chargement...</div>;
    }

    if (errorMsg) {
        return (
            <div className="rounded border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                {errorMsg}
            </div>
        );
    }

    return (
        <>
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg flex gap-3 flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="text-base sm:text-lg font-semibold opacity-80">
                    {selectedCraftsCount} {t("craftPlanner.selectedItems.sentence")}
                </p>

                <div className="flex gap-2 flex-col sm:flex-row sm:justify-end">
                    <button
                        className="flex font-medium flex-row gap-2 text-sm bg-green-600 text-white rounded-lg py-2 px-4 transition-colors hover:bg-green-700 items-center justify-center"
                        onClick={() => setShowItemsModal(true)}
                    >
                        <ListTodo />
                        {t("craftPlanner.selectItems.show")}
                    </button>

                    <button
                        className="flex text-sm font-medium flex-row gap-2 bg-green-600 text-white rounded-lg py-2 px-4 transition-colors hover:bg-green-700 items-center justify-center"
                        onClick={() => setShowResourcesModal(true)}
                    >
                        <List />
                        {t("craftPlanner.requiredResources.show")}
                    </button>
                </div>
            </div>

            <div className="mt-4 rounded-lg bg-gray-800/50 p-4">
                <div className="text-xl font-bold mb-3">
                    {t("craftPlanner.selectedItems.title")}
                </div>

                <MuseumItemList
                    groupedItems={selectedGroupedItems}
                    detailsIndex={detailsIndex}
                    museumItems={museumItems}
                    showDonated={true}
                    setCraftModalItem={setCraftModalItem}
                    setCraftModalCategory={setCraftModalCategory}
                    showCategoryProgress={false}
                    emptyMessage={
                        <div className="text-center text-gray-400 bg-gray-700 rounded-lg p-4">
                            {t("craftPlanner.noItems")}
                        </div>
                    }
                />
            </div>

            <ItemsRecapModal
                show={showItemsModal}
                onClose={() => setShowItemsModal(false)}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                toggleSelectAllMissing={toggleSelectAllMissing}
                renderRecapContent={() => (
                    <MissingItemsRecapContent
                        groupedItems={groupedItems}
                        detailsIndex={detailsIndex}
                        museumItems={museumItems}
                        missingSelection={missingSelection}
                        toggleMissingSelection={toggleMissingSelection}
                        missingRarity={missingRarity}
                    />
                )}
                translation="craftPlanner"
            />

            <ResourcesRecapModal
                show={showResourcesModal}
                onClose={() => setShowResourcesModal(false)}
                showCraftSection={showCraftSection}
                setShowCraftSection={setShowCraftSection}
                showBasicSection={showBasicSection}
                setShowBasicSection={setShowBasicSection}
                setCategory={setCategory}
                renderBasicResourcesContent={() => (
                    <BasicResourcesContent
                        groupedItems={groupedItems}
                        detailsIndex={detailsIndex}
                        museumItems={museumItems}
                        missingSelection={missingSelection}
                        setCategory={setCategory}

                        translation="craftPlanner"
                    />
                )}

                // handleCopyCSV
                groupedItems={groupedItems}
                detailsIndex={detailsIndex}
                museumItems={museumItems}
                missingSelection={missingSelection}

                translation="craftPlanner"
            />

            {craftModalItem && craftModalCategory && (
                <CraftModal
                    craftModalItem={craftModalItem}
                    craftModalCategory={craftModalCategory}
                    detailsIndex={detailsIndex}
                    onClose={() => {
                        setCraftModalItem(null);
                        setCraftModalCategory(null);
                    }}
                    setCategory={setCategory}
                />
            )}
        </>
    );
};

export default CraftPlannerContent;

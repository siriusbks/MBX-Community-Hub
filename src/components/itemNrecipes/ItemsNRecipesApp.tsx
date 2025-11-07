/*
 * Copyright (c) 2025 LupusArctos4 SPDX-License-Identifier: MIT
 */

import React, { FC, useEffect, useState, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import INRItemCard from "./INRItemCard";
import INRItemImage from "./INRItemImage";
import {
    AlertTriangle,
    ArrowUpFromLine,
    Boxes,
    Calculator,
    ClipboardCopy,
    Eye,
    EyeOff,
    Minus,
    Plus,
    X,
} from "lucide-react";

// Definition of interfaces
interface Group {
    category: string;
    items: string[];
}

interface Details {
    [key: string]: {
        id: string;
        image?: string;
        rarity?: string;
        recipe?: any;
        used_in_recipes?: any;
        category?: string;
    };
}

interface RecipeTreeProps {
    recipe: any;
    detailsIndex: Details;
    initialExpanded: boolean;
    multiplier: number;
}

interface RecipeNodeProps {
    ing: any;
    detailsIndex: Details;
    initialExpanded: boolean;
    multiplier: number;
}

// RecipeTree: Renders a list of RecipeNode components based on the recipe object
const RecipeTree: FC<RecipeTreeProps> = ({
    recipe,
    detailsIndex,
    initialExpanded,
    multiplier,
}) => {
    if (!recipe || !recipe.ingredients) return <></>;
    return (
        <ul>
            {recipe.ingredients.map((ing: any, i: number) => (
                <RecipeNode
                    key={i}
                    ing={ing}
                    detailsIndex={detailsIndex}
                    initialExpanded={initialExpanded}
                    multiplier={multiplier}
                />
            ))}
        </ul>
    );
};

// RecipeNode: Renders an individual ingredient with potential sub-recipes
const RecipeNode: FC<RecipeNodeProps> = ({
    ing,
    detailsIndex,
    initialExpanded,
    multiplier,
}) => {
    // Use initialExpanded only at mounting; thereafter, each node is togglable
    const [isExpanded, setIsExpanded] = useState(initialExpanded);

    const hasSubRecipe =
        detailsIndex && detailsIndex[ing.id] && detailsIndex[ing.id].recipe;

    let summary: JSX.Element | null = null;
    if (detailsIndex && detailsIndex[ing.id] && detailsIndex[ing.id].recipe) {
        // Calculate aggregated resources for the sub-recipe
        const subResources = gatherResources(
            detailsIndex[ing.id].recipe,
            detailsIndex,
            multiplier
        );
    }

    return (
        <li className="mb-2 bg-gray-500 p-2 rounded-lg bg-opacity-20 border border-gray-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {hasSubRecipe && (
                        <button
                            // Toggle node expansion without propagating the click event
                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                setIsExpanded((prev) => !prev);
                            }}
                            className="mr-1 text-xs text-gray-300 hover:text-white focus:outline-none"
                        >
                            {isExpanded ? (
                                <Minus className="h-4 w-4" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                        </button>
                    )}
                    <INRItemImage
                        itemId={ing.id}
                        detailsIndex={detailsIndex}
                        className="w-8 h-8 mr-1 align-middle"
                        style={{ imageRendering: "pixelated" }}
                    />
                    <span className="font-bold text-sm">
                        {ing.amount}x {ing.id}
                    </span>
                </div>
                {summary}
            </div>
            {hasSubRecipe && isExpanded && (
                <div className="ml-6 pl-2 mt-2">
                    <RecipeTree
                        recipe={detailsIndex[ing.id].recipe}
                        detailsIndex={detailsIndex}
                        initialExpanded={initialExpanded}
                        multiplier={multiplier}
                    />
                </div>
            )}
        </li>
    );
};

// Modified recursive function to multiply ingredient amounts by the given multiplier
const gatherResources = (
    recipe: any,
    detailsIndex: Details,
    multiplier: number = 1
): { [key: string]: number } => {
    const resources: { [key: string]: number } = {};
    recipe.ingredients.forEach((ing: any) => {
        const currentAmount = ing.amount * multiplier;
        if (
            detailsIndex &&
            detailsIndex[ing.id] &&
            detailsIndex[ing.id].recipe &&
            detailsIndex[ing.id].recipe.job !== "FARMER"
        ) {
            const subResources = gatherResources(
                detailsIndex[ing.id].recipe,
                detailsIndex,
                currentAmount
            );
            for (const resId in subResources) {
                resources[resId] =
                    (resources[resId] || 0) + subResources[resId];
            }
        } else {
            resources[ing.id] = (resources[ing.id] || 0) + currentAmount;
        }
    });
    return resources;
};

// ----------------- Main Component ----------------------

// ItemsNRecipesApp: Main component handling the display of items, modals and recipe details.
const ItemsNRecipesApp: FC = () => {
    const { t } = useTranslation(["itemsNrecipes", "items", "museum"]);

    // States for storing API and JSON data
    const [groupedItems, setGroupedItems] = useState<Group[] | null>(null);
    const [detailsIndex, setDetailsIndex] = useState<Details | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    // States for controlling modals
    const [craftModalItem, setCraftModalItem] = useState<string | null>(null);
    const [craftModalCategory, setCraftModalCategory] = useState<string | null>(
        null
    );

    // State to filter items by selected category
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    // Multi-select categories for the "All" view: which categories should be shown
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Initialize selectedCategories to all categories once groupedItems loads
    useEffect(() => {
        if (groupedItems && selectedCategories.length === 0) {
            setSelectedCategories(groupedItems.map((g) => g.category));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupedItems]);

    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
        // ensure we're in the combined (All) view when toggling checkboxes
        setSelectedCategory(null);
    };

    const toggleAllCategories = () => {
        if (!groupedItems) return;
        if (selectedCategories.length === groupedItems.length) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(groupedItems.map((g) => g.category));
        }
        // show combined view
        setSelectedCategory(null);
    };

    // States for global collapse/expand (for re-mounting RecipeTree)
    const [globalExpanded, setGlobalExpanded] = useState<boolean>(false);
    const [globalToggleVersion, setGlobalToggleVersion] = useState<number>(0);

    // State for craft quantity (default = 1) and temporary input
    const [craftQuantity, setCraftQuantity] = useState<number>(1);
    const [tempQuantity, setTempQuantity] = useState<string>("1");

    // State to control the display of the recap panel
    const [showRecap, setShowRecap] = useState<boolean>(false);

    // State to store missing rarity information as a mapping where the key is the item ID and the value is the rarity string
    const [missingRarity, setMissingRarity] = useState<Record<string, string>>(
        {}
    );

    // Asynchronous function to load data (API and JSON)
    const loadData = async () => {
        try {
            const itemsGroupedResponse = await fetch(
                "/assets/data/all_items_grouped_by_category.json"
            );
            const itemsGrouped: Group[] = await itemsGroupedResponse.json();

            const itemsDetailsResponse = await fetch(
                "https://cdn2.minebox.co/data/items.json"
            );
            const itemsDetails = await itemsDetailsResponse.json();
            const details: Details = {};
            itemsDetails.forEach((item: any) => {
                details[item.id] = item;
            });

            const itemsNoRecipeResponse = await fetch(
                "/assets/data/items-no-in-MBapi.json"
            );
            const itemsNoRecipeData = await itemsNoRecipeResponse.json();
            itemsNoRecipeData.forEach((item: any) => {
                if (!details[item.id] || !details[item.id].recipe) {
                    details[item.id] = item;
                }
            });

            setGroupedItems(itemsGrouped);
            setDetailsIndex(details);
            setErrorMsg("");
        } catch (error) {
            setErrorMsg(
                error instanceof Error ? error.message : "Unknown error"
            );
        }
    };

    // Effect to fetch missing rarity data from the JSON file on component mount
    useEffect(() => {
        fetch("/assets/data/items-missing-rarity.json")
            .then((res) => res.json())
            .then((data) => setMissingRarity(data || {}))
            .catch((err) => console.error("Error loading JSON:", err));
    }, []);

    // On mount, read URL query params to pre-select category and/or open the craft modal
    useEffect(() => {
        loadData();
        const params = new URLSearchParams(window.location.search);
        const categoryParam = params.get("category");
        const itemParam = params.get("item");
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
        if (categoryParam && itemParam) {
            setCraftModalItem(itemParam);
            setCraftModalCategory(categoryParam);
        }
    }, []);

    // Update URL when selectedCategory changes
    useEffect(() => {
        if (selectedCategory) {
            const params = new URLSearchParams(window.location.search);
            params.set("category", selectedCategory);
            window.history.pushState({}, "", "?" + params.toString());
        }
    }, [selectedCategory]);

    // Functions to open and close the craft modal with URL update
    const openCraftModal = (itemId: string, category: string) => {
        setCraftModalItem(itemId);
        setCraftModalCategory(category);
        const params = new URLSearchParams(window.location.search);
        params.set("category", category);
        params.set("item", itemId);
        window.history.pushState({}, "", "?" + params.toString());
    };

    // Side panel state: when an item is clicked we show a right-side panel instead of directly opening modal
    const [panelItem, setPanelItem] = useState<string | null>(null);
    const [panelCategory, setPanelCategory] = useState<string | null>(null);

    // Lore fetched from external API for the panel (some items are not present in the API)
    const [panelLore, setPanelLore] = useState<string | null>(null);
    const [panelLoreLoading, setPanelLoreLoading] = useState<boolean>(false);
    const [panelLoreError, setPanelLoreError] = useState<string | null>(null);

    // Info panel state: displays full recipe/info in the `#infoPanel` element
    const [infoPanelItem, setInfoPanelItem] = useState<string | null>(null);
    const [infoPanelCategory, setInfoPanelCategory] = useState<string | null>(
        null
    );

    const openSidePanel = (itemId: string, category: string) => {
        setPanelItem(itemId);
        setPanelCategory(category);
    };

    // Fetch lore from external API when a panel item is selected
    useEffect(() => {
        let cancelled = false;
        if (!panelItem) {
            setPanelLore(null);
            setPanelLoreError(null);
            setPanelLoreLoading(false);
            return;
        }

        setPanelLoreLoading(true);
        setPanelLore(null);
        setPanelLoreError(null);

        (async () => {
            // try to get current locale from react-i18next if available,
            // fallback to navigator.language and finally "en"
            let locale = "en";
            try {
            const i18nModule = await import("i18next");
            locale =
                i18nModule?.default?.language ||
                navigator.language?.split("-")[0] ||
                "en";
            } catch {
            locale = navigator.language?.split("-")[0] || "en";
            }

            fetch(
            `https://api.minebox.co/item/${encodeURIComponent(
                panelItem!
            )}?locale=${encodeURIComponent(locale)}`
            )
            .then((res) => {
                if (!res.ok) throw new Error(`API ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if (cancelled) return;
                // prefer `lore`, fall back to `description` if available
                setPanelLore(data?.lore ?? data?.description ?? null);
            })
            .catch((err) => {
                if (cancelled) return;
                setPanelLore(null);
                setPanelLoreError(
                err instanceof Error ? err.message : String(err)
                );
            })
            .finally(() => {
                if (!cancelled) setPanelLoreLoading(false);
            });
        })();

        return () => {
            cancelled = true;
        };
    }, [panelItem]);

    const openInfoPanel = (itemId: string, category: string) => {
        // populate the left info panel and close the temporary side panel
        setInfoPanelItem(itemId);
        setInfoPanelCategory(category);
        setPanelItem(null);
        setPanelCategory(null);
        // optionally scroll infoPanel into view
        setTimeout(() => {
            const el = document.getElementById("infoPanel");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
    };

    const closeSidePanel = () => {
        setPanelItem(null);
        setPanelCategory(null);
    };

    // Function to close the craft modal and remove the "item" parameter from the URL
    const closeCraftModal = () => {
        setCraftModalItem(null);
        setCraftModalCategory(null);
        const params = new URLSearchParams(window.location.search);
        params.delete("item");
        window.history.pushState({}, "", "?" + params.toString());
    };

    // Function to render the resource recap for a given item (defaults to craftModalItem)
    const renderResourcesContent = (itemId?: string) => {
        const target = itemId || craftModalItem;
        if (!target || !detailsIndex) {
            return <p>{t("itemsNrecipes.noDataLoaded")}</p>;
        }
        // Compute resources using current craftQuantity multiplier
        const totalResources = detailsIndex[target].recipe
            ? gatherResources(
                  detailsIndex[target].recipe,
                  detailsIndex,
                  craftQuantity
              )
            : {};

        const sortedResourceIds = Object.keys(totalResources).sort();
        if (sortedResourceIds.length === 0) {
            return <p>{t("itemsNrecipes.resourcesRequired.title.no")}</p>;
        }
        return (
            <div className="mt-4 mb-2 p-2 bg-blue-700 bg-opacity-20 rounded-lg border border-blue-500">
                <div className="text-lg font-semibold mb-2">
                    {t("itemsNrecipes.resourcesRequired.title.yes")}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {sortedResourceIds.map((resId) => (
                        <div key={resId} className="bg-gray-700 p-2 rounded-lg">
                            <div className="flex items-center">
                                <INRItemImage
                                    itemId={resId}
                                    detailsIndex={detailsIndex}
                                    className="w-8 h-8 mr-2 rounded"
                                    style={{ imageRendering: "pixelated" }}
                                />
                                <span className="font-bold text-sm">
                                    {resId}
                                </span>
                                <span className="ml-auto text-sm font-bold bg-green-600 bg-opacity-30 w-16 py-1 rounded flex items-center justify-center">
                                    {totalResources[resId].toLocaleString(
                                        "fr-FR"
                                    )}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Function to render the "Used in recipes" footer using the new property "used_in_recipes"
    const renderUsedInRecipesFooter = (itemId?: string) => {
        const target = itemId || craftModalItem;
        if (!target || !detailsIndex) return null;
        // used_in_recipes is expected to be an array of objects { type, id, amount }
        const usedInList = detailsIndex[target].used_in_recipes || [];
        if (usedInList.length === 0) {
            return (
                <p className="text-sm text-gray-300">
                    {t("itemsNrecipes.usedInRecipes.no")}
                </p>
            );
        }
        return (
            <div className="flex flex-col w-full">
                <div className="text-lg font-semibold mb-2">
                    {t("itemsNrecipes.usedInRecipes.yes")}
                </div>
                <div className="flex flex-wrap gap-2">
                    {usedInList.map(
                        (item: {
                            type: string;
                            id: string;
                            amount: number;
                        }) => {
                            const itemDetails = detailsIndex[item.id];
                            const category = itemDetails?.category || "default";
                            const url = `${
                                window.location.origin
                            }/itemsNrecipes?category=${encodeURIComponent(
                                category
                            )}&item=${encodeURIComponent(item.id)}`;
                            return (
                                <a
                                    key={item.id}
                                    href={url}
                                    target="_self"
                                    rel="noopener noreferrer"
                                    className="text-sm bg-gray-800 px-2 py-1 rounded border border-gray-600 hover:bg-gray-700"
                                >
                                    {item.id}
                                </a>
                            );
                        }
                    )}
                </div>
            </div>
        );
    };

    // Render items for the selected category only
    const renderItems = () => {
        if (!groupedItems || !detailsIndex) return null;
        // If no specific category is selected, render all categories stacked vertically
        if (!selectedCategory) {
            // Flatten selected groups into a single list and render in one responsive grid (no category titles)
            const categoriesToShow = selectedCategories; // if empty, show no categories
            const allItems = groupedItems.flatMap((group) =>
                categoriesToShow.includes(group.category)
                    ? group.items.map((id) => ({
                          id,
                          category: group.category,
                      }))
                    : []
            );
            return (
                <div className="category w-full mb-6">
                    <div className="groupItem grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-0">
                        {allItems.map(({ id: itemId, category }) => {
                            const rarity =
                                detailsIndex[itemId]?.rarity ?? "UNKNOWN";
                            return (
                                <INRItemCard
                                    key={itemId}
                                    itemId={itemId}
                                    rarity={rarity}
                                    level={
                                        (detailsIndex[itemId] as any)?.level ??
                                        0
                                    }
                                    category={category}
                                    craftModalOpener={() =>
                                        openSidePanel(itemId, category)
                                    }
                                    missingRarity={missingRarity}
                                />
                            );
                        })}
                    </div>
                </div>
            );
        }

        // Otherwise render single chosen category
        const group = groupedItems.find((g) => g.category === selectedCategory);
        if (!group) return null;
        const categoryId =
            "cat-" + group.category.toLowerCase().replace(/\s+/g, "-");
        return (
            <div
                key={group.category}
                className="category w-full"
                id={categoryId}
            >
                <div className="titreCategory text-2xl font-bold flex flex-row gap-2 items-center mb-2">
                    <INRItemImage
                        groupCategory={group.category}
                        itemId={group.category}
                        detailsIndex={detailsIndex}
                        className="h-8 w-8"
                        style={{ imageRendering: "pixelated" }}
                    />
                    {group.category.toUpperCase().replace("_", " ")}
                </div>
                <div className="groupItem grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1 justify-between">
                    {group.items.map((itemId) => {
                        const rarity =
                            detailsIndex[itemId] && detailsIndex[itemId].rarity
                                ? detailsIndex[itemId].rarity
                                : "UNKNOWN";
                        return (
                            <INRItemCard
                                key={itemId}
                                itemId={itemId}
                                rarity={rarity}
                                level={
                                    (detailsIndex[itemId] as any)?.level ?? 0
                                }
                                category={group.category}
                                craftModalOpener={() =>
                                    openSidePanel(itemId, group.category)
                                }
                                missingRarity={missingRarity}
                            />
                        );
                    })}
                </div>
            </div>
        );
    };

    // "Back to Top" button management
    useEffect(() => {
        const backToTopBtn = document.getElementById("backToTop");
        const handleScroll = () => {
            if (backToTopBtn) {
                backToTopBtn.style.display =
                    window.pageYOffset > 300 ? "block" : "none";
            }
        };
        const handleBackToTop = () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        };
        window.addEventListener("scroll", handleScroll);
        backToTopBtn?.addEventListener("click", handleBackToTop);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            backToTopBtn?.removeEventListener("click", handleBackToTop);
        };
    }, [craftModalItem]);

    // Function to copy resource recap as CSV to clipboard
    const handleCopyCSV = async () => {
        if (!detailsIndex || !craftModalItem) return;
        const recap = gatherResources(
            detailsIndex[craftModalItem].recipe,
            detailsIndex,
            craftQuantity
        );
        const csvLines = Object.keys(recap).map(
            (key) => `${recap[key]},${key}`
        );
        const csvText = csvLines.join("\n");
        navigator.clipboard.writeText(csvText);
        try {
            await navigator.clipboard.writeText(csvText);
            alert(t("itemsNrecipes.copyCSV.alert"));
        } catch (err) {
            console.error("Copy CSV failed:", err);
        }
        
    };
    const usedInList = detailsIndex?.[panelItem!]?.used_in_recipes || [];
    const noRecipeAvailable = !detailsIndex?.[panelItem!]?.recipe;

    return (
        <div className="items-&-recipes-page">
            <section
                className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4"
                role="alert"
                aria-live="assertive"
            >
                <div className="flex items-start gap-3">
                    <AlertTriangle
                        className="text-yellow-500 flex-shrink-0 mt-0.5"
                        size={20}
                        aria-hidden="true"
                    />
                    <div className="text-sm text-yellow-200/90">
                        <p className="font-medium mb-1">
                            {t("itemsNrecipes.beta.title")}
                        </p>
                        <p className="text-yellow-200/70">
                            {t("itemsNrecipes.beta.description")}{" "}
                            <a
                                className="underline"
                                href="https://discord.com/channels/318496737067270146/1324109110693597315"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                [EN]
                            </a>{" "}
                            <a
                                className="underline"
                                href="https://discord.com/channels/318496737067270146/1324392188607467551"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                [FR]
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </section>

            {/* Navigation bar displaying item categories */}

            <div className="flex flex-row h-[calc(100vh-340px)]">
                <nav
                    id="categoryNav"
                    className="w-[400px] custom-scrollbar bg-gray-800 bg-opacity-50 p-4 rounded-lg overflow-auto max-h-[calc(100vh-200px)]"
                >
                    <ul className="flex flex-col gap-2 p-0 m-0 grid grid-cols-2 ">
                        <li className="w-full">
                            <label
                                className={`flex items-center gap-2 p-2 rounded mb-2 w-full cursor-pointer ${
                                    selectedCategories.length ===
                                    (groupedItems?.length ?? 0)
                                        ? "bg-green-600 text-black"
                                        : "bg-gray-700 text-white"
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={
                                        groupedItems
                                            ? selectedCategories.length ===
                                              groupedItems.length
                                            : false
                                    }
                                    onChange={() => toggleAllCategories()}
                                    className="form-checkbox h-4 w-4"
                                />
                                <span className="font-medium">
                                    {t("itemsNrecipes.allCategories") ?? "All"}
                                </span>
                            </label>
                        </li>
                        {groupedItems &&
                            groupedItems.map((group) => (
                                <li key={group.category} className="w-full">
                                    <label
                                        className={`flex items-center gap-2 p-2 rounded bg-gray-700 text-white hover:bg-gray-600 cursor-pointer ${
                                            selectedCategories.includes(
                                                group.category
                                            )
                                                ? "border-2 border-green-600"
                                                : "border border-transparent"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(
                                                group.category
                                            )}
                                            onChange={() =>
                                                toggleCategory(group.category)
                                            }
                                            className="sr-only"
                                            aria-hidden="false"
                                        />
                                        <span className="flex flex-row items-center gap-1.5">
                                            <INRItemImage
                                                groupCategory={group.category}
                                                itemId={group.category}
                                                detailsIndex={detailsIndex}
                                                className="h-8 w-8 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                                style={{
                                                    imageRendering: "pixelated",
                                                }}
                                            />
                                            <span className="flex flex-col items-start leading-none">
                                                <span className="font-semibold text-xs leading-none">
                                                    {t(`museum.category.${group.category}`, {
                                            ns: "museum",
                                            defaultValue: group.category
                                                .toUpperCase()
                                                        .replace("_", " "),
                                        })}
                                                </span>
                                            </span>
                                        </span>
                                    </label>
                                </li>
                            ))}
                    </ul>
                </nav>

                {/* Display of the items list (single category or all categories) */}
                <div
                    id="itemsContainer"
                    className="w-[calc(100%-400px)] custom-scrollbar  flex flex-wrap gap-4 justify-start p-4 overflow-auto max-h-[calc(100vh-200px)]"
                >
                    {renderItems()}
                </div>

                {/* Right-side item panel: appears when an item is clicked instead of opening the modal immediately */}
                {panelItem && detailsIndex && (
                    <aside className="w-[32rem] bg-gray-800 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col max-h-[calc(100vh-200px)]">
                        <div className="overflow-auto">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-lg font-bold">
                                        {t(`item.${panelItem}`, {
                                            ns: "items",
                                            defaultValue: panelItem.replace(
                                                /_/g,
                                                " "
                                            ),
                                        })}
                                    </div>
                                    <div className="text-lg font-bold">
                                        {detailsIndex?.[panelItem!]?.rarity ??
                                            "UNKNOWN"}
                                    </div>
                                    <div className="text-lg font-bold">
                                        lvl.{" "}
                                        {(detailsIndex?.[panelItem!] as any)
                                            ?.level ?? "??"}
                                    </div>
                                    <div className="text-xs">
                                        {panelLoreLoading ? (
                                            <div className="text-gray-400">Loading...</div>
                                        ) : panelLore ? (
                                            <div className="text-sm text-gray-200 whitespace-pre-line">{panelLore}</div>
                                        ) : panelLoreError ? (
                                            <div className="text-sm text-gray-400">{panelLoreError}</div>
                                        ) : (detailsIndex?.[panelItem!] as any)?.description ? (
                                            <div className="text-sm text-gray-200 whitespace-pre-line">{(detailsIndex[panelItem!] as any).description}</div>
                                        ) : (
                                            <div className="text-xs font-bold">No Description</div>
                                        )}
                                    </div>
                                <div className="flex flex-col">
                                        <span className="w-full text-xs">STAT 00 - 00</span> 
                                </div>
                                <div className="flex flex-col">
                                        <span className="w-full text-xs">DAMAGE 00 - 00</span> 
                                </div>
                                </div>
                                <div className="ml-2">
                                    <button
                                        onClick={closeSidePanel}
                                        className="text-gray-200 hover:text-white bg-gray-700 p-1 rounded"
                                        aria-label={t("itemsNrecipes.closePanel")}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4">
                                <INRItemImage
                                    itemId={panelItem}
                                    detailsIndex={detailsIndex}
                                    className="w-24 h-24"
                                    style={{ imageRendering: "pixelated" }}
                                />
                            </div>
                            <div className={`mt-4 flex gap-2 ${(usedInList.length === 0 || noRecipeAvailable) ? 'opacity-60' : ''}`}>
                                <button
                                    onClick={() => {
                                        // Prevent opening when item is used in other recipes or no recipe exists
                                        if (usedInList.length === 0 || noRecipeAvailable) return;
                                        if (panelItem && panelCategory) openCraftModal(panelItem, panelCategory);
                                    }}
                                    disabled={usedInList.length === 0 || noRecipeAvailable}
                                    aria-disabled={usedInList.length === 0 || noRecipeAvailable}
                                    title={
                                        noRecipeAvailable
                                            ? t("itemsNrecipes.noRecipeAvailable")
                                            : usedInList.length > 0
                                            ? t("itemsNrecipes.usedInRecipes.no")
                                            : t("itemsNrecipes.openRecipes")
                                    }
                                    className={`flex-1 bg-green-600 hover:bg-green-500 text-black font-bold py-2 px-3 rounded ${(usedInList.length === 0 || noRecipeAvailable) ? 'cursor-not-allowed' : ''}`}
                                >
                                    {noRecipeAvailable ? t("itemsNrecipes.noRecipeAvailable") : t("itemsNrecipes.openRecipes")}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col w-full bg-gray-700 rounded mt-auto p-2 ">
                            <div className="text-sm font-semibold mb-2 text-center">
                                {t("itemsNrecipes.usedInRecipes.yes")}
                            </div>
                            {usedInList.length === 0 ? (
                                <p className="text-sm text-gray-300 mt-auto text-center">
                                    {t("itemsNrecipes.usedInRecipes.no")}
                                </p>
                            ) : null}
                            <div className="flex flex-wrap gap-0.5 justify-center">
                                {usedInList.map(
                                    (item: {
                                        type: string;
                                        id: string;
                                        amount: number;
                                    }) => {
                                        const itemDetails =
                                            detailsIndex[item.id];
                                        const category =
                                            itemDetails?.category || "default";
                                        const url = `${
                                            window.location.origin
                                        }/itemsNrecipes?category=${encodeURIComponent(
                                            category
                                        )}&item=${encodeURIComponent(item.id)}`;
                                        return (
                                            <a
                                                key={item.id}
                                                //href={url}
                                                target="_self"
                                                rel="noopener noreferrer"
                                                className="text-sm bg-gray-800 p-1 rounded border border-gray-600 hover:bg-gray-700"
                                            >
                                                <INRItemImage
                                                    itemId={item.id}
                                                    detailsIndex={detailsIndex}
                                                    className={`w-7 h-7 inline-block align-middle drop-shadow-[0_0px_2px_theme(colors.${
                                                        detailsIndex[item.id]
                                                            .rarity
                                                    }.DEFAULT)]`}
                                                    style={{
                                                        imageRendering:
                                                            "pixelated",
                                                    }}
                                                />
                                            </a>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </aside>
                )}
                
            </div>

            {/* "Back to Top" button */}
            <button
                id="backToTop"
                className="fixed bottom-5 right-5 py-2 px-4 bg-gray-800 text-white rounded-lg text-xs shadow flex flex-col items-center justify-center gap-1 text-center"
            >
                <ArrowUpFromLine className="h-4 w-4 mx-auto" />
                <span>{t("itemsNrecipes.backToTop.button")}</span>
            </button>

            {/* Craft modal */}
            {craftModalItem && detailsIndex && (
                <>
                    {detailsIndex[craftModalItem] &&
                    detailsIndex[craftModalItem].recipe ? (
                        <>
                            <div
                                className="modal fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-60 p-[2.49%]"
                                id="craftModal"
                                onClick={(e) => {
                                    // Clicking outside closes the modal
                                    if (e.currentTarget === e.target) {
                                        closeCraftModal();
                                    }
                                }}
                            >
                                <div className="modal-content flex flex-col bg-[rgb(31,41,55)] text-white rounded-lg max-w-[90%] max-h-[90vh] mx-auto shadow-2xl relative overflow-hidden">
                                    <div
                                        id="craftDetails"
                                        className="flex flex-col flex-1 max-h-[90vh]"
                                    >
                                        {/* Header 1: Item image and title */}
                                        <div className="bg-gray-700 text-white p-4 flex flex-row gap-3 items-center shadow-md">
                                            <INRItemImage
                                                groupCategory={
                                                    craftModalCategory!
                                                }
                                                itemId={craftModalItem}
                                                detailsIndex={detailsIndex}
                                                className="h-16 w-16 drop-shadow"
                                                style={{
                                                    imageRendering: "pixelated",
                                                }}
                                            />
                                            <div className="flex flex-col">
                                                <div className="text-2xl font-bold">
                                                    {t(
                                                        "itemsNrecipes.craftFor"
                                                    )}{" "}
                                                    {t(
                                                        `item.${craftModalItem}`,
                                                        {
                                                            ns: "items",
                                                            defaultValue:
                                                                craftModalItem
                                                                    .replace(
                                                                        /_/g,
                                                                        " "
                                                                    )
                                                                    .split(" ")
                                                                    .map(
                                                                        (
                                                                            word: string
                                                                        ) =>
                                                                            word
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase() +
                                                                            word
                                                                                .slice(
                                                                                    1
                                                                                )
                                                                                .toLowerCase()
                                                                    )
                                                                    .join(" "),
                                                        }
                                                    )}
                                                </div>
                                                <p className="text-sm opacity-60">
                                                    {t(
                                                        "itemsNrecipes.jobRequired"
                                                    )}{" "}
                                                    {
                                                        detailsIndex[
                                                            craftModalItem
                                                        ].recipe.job
                                                    }
                                                </p>
                                            </div>
                                            <div className="ml-auto flex items-center gap-2">
                                                {/* Left: Global collapse/expand button */}
                                                {/* Center: Quantity selection */}
                                                <div className="flex items-center gap-0 ml-2">
                                                    <label
                                                        className="text-sm font-bold mr-1"
                                                        htmlFor="craftQuantity"
                                                    >
                                                        x
                                                    </label>
                                                    <input
                                                        id="craftQuantity"
                                                        type="number"
                                                        min="1"
                                                        className="w-12 p-1 text-white rounded-l text-center bg-gray-600"
                                                        value={tempQuantity}
                                                        onChange={(e) =>
                                                            setTempQuantity(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        className="text-xs flex font-medium flex-row gap-2 bg-gray-500 hover:bg-gray-400 transition text-white p-1.5 rounded-r text-sm"
                                                        onClick={() => {
                                                            const qty =
                                                                parseInt(
                                                                    tempQuantity,
                                                                    10
                                                                );
                                                            if (
                                                                !isNaN(qty) &&
                                                                qty > 0
                                                            ) {
                                                                setCraftQuantity(
                                                                    qty
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <Calculator className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center">
                                                    <button
                                                        className="flex font-medium flex-row gap-2 bg-gray-600 hover:bg-gray-500 transition text-white py-1.5 px-2 rounded text-xs"
                                                        onClick={() => {
                                                            setGlobalExpanded(
                                                                !globalExpanded
                                                            );
                                                            setGlobalToggleVersion(
                                                                (prev) =>
                                                                    prev + 1
                                                            );
                                                        }}
                                                    >
                                                        {globalExpanded ? (
                                                            <>
                                                                <Minus className="w-4 h-4" />{" "}
                                                                {t(
                                                                    "itemsNrecipes.collapseAll.button"
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Plus className="w-4 h-4" />{" "}
                                                                {t(
                                                                    "itemsNrecipes.expandAll.button"
                                                                )}
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                                {/* Right: Recap toggle and CSV copy button */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="flex font-medium flex-row gap-2 bg-gray-600 hover:bg-gray-500 transition text-white py-1.5 px-2 rounded text-xs"
                                                        onClick={() =>
                                                            setShowRecap(
                                                                (prev) => !prev
                                                            )
                                                        }
                                                    >
                                                        {showRecap ? (
                                                            <>
                                                                <EyeOff className="w-4 h-4" />{" "}
                                                                {t(
                                                                    "itemsNrecipes.resourcesRequired.button.hide"
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Eye className="w-4 h-4" />{" "}
                                                                {t(
                                                                    "itemsNrecipes.resourcesRequired.button.show"
                                                                )}
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        className="flex font-medium flex-row gap-2 bg-gray-600 hover:bg-gray-500 transition text-white py-1.5 px-2 rounded text-xs"
                                                        onClick={handleCopyCSV}
                                                    >
                                                        <ClipboardCopy className="w-4 h-4" />{" "}
                                                        {t(
                                                            "itemsNrecipes.copyCSV.button"
                                                        )}
                                                    </button>
                                                </div>
                                                <a
                                                    href={`https://minebox.co/universe/items?id=${craftModalItem}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center h-8 w-8 rounded transition hover:text-white text-gray-200 hover:bg-gray-600"
                                                >
                                                    ?
                                                </a>
                                                <button
                                                    onClick={closeCraftModal}
                                                    className="flex items-center justify-center h-8 w-8 rounded transition hover:text-white text-gray-200 hover:bg-gray-600"
                                                >
                                                    <X
                                                        strokeWidth={3}
                                                        className="h-5 w-5"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                        {/* Content area scrollable */}
                                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                                            <div className="p-4">
                                                <RecipeTree
                                                    key={globalToggleVersion}
                                                    recipe={
                                                        detailsIndex[
                                                            craftModalItem
                                                        ].recipe
                                                    }
                                                    detailsIndex={detailsIndex}
                                                    initialExpanded={
                                                        globalExpanded
                                                    }
                                                    multiplier={craftQuantity}
                                                />
                                                {/* Content resources recap */}
                                                {showRecap &&
                                                    renderResourcesContent()}
                                            </div>
                                            {/* Footer: Used in recipes info */}
                                            <div className="bg-gray-700 text-white p-4 rounded-b-lg flex flex-col gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                                                {renderUsedInRecipesFooter()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className="modal fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-60 p-[2.49%]"
                                id="craftModal"
                                onClick={(e) => {
                                    if (e.currentTarget === e.target) {
                                        closeCraftModal();
                                    }
                                }}
                            >
                                <div className="modal-content flex flex-col bg-[rgb(31,41,55)] text-white rounded-lg max-w-[90%] max-h-[90vh] mx-auto shadow-2xl relative overflow-hidden">
                                    <div
                                        id="craftDetails"
                                        className="flex flex-col flex-1 max-h-[90vh]"
                                    >
                                        {/* Header 1: Item image and title */}
                                        <div className="bg-gray-700 text-white p-4 flex flex-row gap-3 items-center shadow-md">
                                            <INRItemImage
                                                groupCategory={
                                                    craftModalCategory!
                                                }
                                                itemId={craftModalItem}
                                                detailsIndex={detailsIndex}
                                                className="h-16 w-16 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                                style={{
                                                    imageRendering: "pixelated",
                                                }}
                                            />
                                            <div className="flex flex-col">
                                                <div className="text-2xl font-bold">
                                                    {t(
                                                        "itemsNrecipes.craftFor"
                                                    )}{" "}
                                                    {t(
                                                        `item.${craftModalItem}`,
                                                        {
                                                            ns: "items",
                                                            defaultValue:
                                                                craftModalItem
                                                                    .replace(
                                                                        /_/g,
                                                                        " "
                                                                    )
                                                                    .split(" ")
                                                                    .map(
                                                                        (
                                                                            word: string
                                                                        ) =>
                                                                            word
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase() +
                                                                            word
                                                                                .slice(
                                                                                    1
                                                                                )
                                                                                .toLowerCase()
                                                                    )
                                                                    .join(" "),
                                                        }
                                                    )}
                                                </div>
                                                <p className="text-sm opacity-60">
                                                    {t(
                                                        "itemsNrecipes.recipe.no"
                                                    )}
                                                </p>
                                            </div>
                                            <div className="ml-auto flex items-center gap-2">
                                                <a
                                                    href={`https://minebox.co/universe/items?id=${craftModalItem}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center h-8 w-8 rounded transition hover:text-white text-gray-200 hover:bg-gray-600"
                                                >
                                                    ?
                                                </a>
                                                <button
                                                    onClick={closeCraftModal}
                                                    className="flex items-center justify-center h-8 w-8 rounded transition hover:text-white text-gray-200 hover:bg-gray-600"
                                                >
                                                    <X
                                                        strokeWidth={3}
                                                        className="h-5 w-5"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                        {/* Footer: Used in recipes info */}
                                        <div className="mt-auto bg-gray-700 text-white p-4 rounded-b-lg flex flex-col gap-3 shadow-md custom-scrollbar">
                                            {renderUsedInRecipesFooter()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ItemsNRecipesApp;

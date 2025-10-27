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
    ClipboardCopy,
    Eye,
    EyeOff,
    Minus,
    Plus,
    X
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
    multiplier
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
    multiplier
}) => {
    // Use initialExpanded only at mounting; thereafter, each node is togglable
    const [isExpanded, setIsExpanded] = useState(initialExpanded);

    const hasSubRecipe =
        detailsIndex &&
        detailsIndex[ing.id] &&
        detailsIndex[ing.id].recipe &&
        detailsIndex[ing.id].recipe.job !== "FARMER";

    let summary: JSX.Element | null = null;
    if (
        detailsIndex &&
        detailsIndex[ing.id] &&
        detailsIndex[ing.id].recipe
    ) {
        // Calculate aggregated resources for the sub-recipe
        const subResources = gatherResources(
            detailsIndex[ing.id].recipe,
            detailsIndex,
            multiplier
        );
        summary = (
            <span className="max-w-[80%] ml-auto bg-gray-500 bg-opacity-20 border border-gray-500 rounded p-0.5 px-2">
                {Object.keys(subResources).map((key, index, arr) => (
                    <span key={key} className="inline-flex items-center mr-1 text-xs">
                        <span>{subResources[key].toLocaleString("fr-FR")}</span> x
                        <INRItemImage
                            itemId={key}
                            detailsIndex={detailsIndex}
                            className="h-4 w-4 ml-0.5"
                            style={{ imageRendering: "pixelated" }}
                        />
                        {index < arr.length - 1 && <span className="ml-0.5"> </span>}
                    </span>
                ))}
            </span>
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
                            {isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
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
                resources[resId] = (resources[resId] || 0) + subResources[resId];
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
    const { t } = useTranslation("itemsNrecipes");

    // States for storing API and JSON data
    const [groupedItems, setGroupedItems] = useState<Group[] | null>(null);
    const [detailsIndex, setDetailsIndex] = useState<Details | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    // States for controlling modals
    const [craftModalItem, setCraftModalItem] = useState<string | null>(null);
    const [craftModalCategory, setCraftModalCategory] = useState<string | null>(null);

    // State to filter items by selected category
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // States for global collapse/expand (for re-mounting RecipeTree)
    const [globalExpanded, setGlobalExpanded] = useState<boolean>(false);
    const [globalToggleVersion, setGlobalToggleVersion] = useState<number>(0);

    // State for craft quantity (default = 1) and temporary input
    const [craftQuantity, setCraftQuantity] = useState<number>(1);
    const [tempQuantity, setTempQuantity] = useState<string>("1");

    // State to control the display of the recap panel
    const [showRecap, setShowRecap] = useState<boolean>(false);

    // Asynchronous function to load data (API and JSON)
    const loadData = async () => {
        try {
            const itemsGroupedResponse = await fetch("/assets/data/all_items_grouped_by_category.json");
            const itemsGrouped: Group[] = await itemsGroupedResponse.json();

            const itemsDetailsResponse = await fetch("https://cdn2.minebox.co/data/items.json");
            const itemsDetails = await itemsDetailsResponse.json();
            const details: Details = {};
            itemsDetails.forEach((item: any) => {
                details[item.id] = item;
            });

            const itemsNoRecipeResponse = await fetch("/assets/data/items-no-in-MBapi.json");
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
            setErrorMsg(error instanceof Error ? error.message : "Unknown error");
        }
    };

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

    // Function to close the craft modal and remove the "item" parameter from the URL
    const closeCraftModal = () => {
        setCraftModalItem(null);
        setCraftModalCategory(null);
        const params = new URLSearchParams(window.location.search);
        params.delete("item");
        window.history.pushState({}, "", "?" + params.toString());
    };

    // Function to render the resource recap for the current craft recipe
    const renderResourcesContent = () => {
        if (!craftModalItem || !detailsIndex) {
            return <p>{t("itemsNrecipes.noDataLoaded")}</p>;
        }
        // Compute resources using current craftQuantity multiplier
        const totalResources = detailsIndex[craftModalItem].recipe
            ? gatherResources(detailsIndex[craftModalItem].recipe, detailsIndex, craftQuantity)
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
                                <span className="font-bold text-sm">{resId}</span>
                                <span className="ml-auto text-sm font-bold bg-green-600 bg-opacity-30 w-16 py-1 rounded flex items-center justify-center">
                                    {totalResources[resId].toLocaleString("fr-FR")}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Function to render the "Used in recipes" footer using the new property "used_in_recipes"
    const renderUsedInRecipesFooter = () => {
        if (!craftModalItem || !detailsIndex) return null;
        // used_in_recipes is expected to be an array of objects { type, id, amount }
        const usedInList = detailsIndex[craftModalItem].used_in_recipes || [];
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
                        (item: { type: string; id: string; amount: number }) => {
                            const itemDetails = detailsIndex[item.id];
                            const category = itemDetails?.category || "default";
                            const url = `${window.location.origin}/itemsNrecipes?category=${encodeURIComponent(
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
        if (!selectedCategory)
            return (
                <div className="p-4 text-center text-gray-400">
                    {t("itemsNrecipes.selectCategory")}
                </div>
            );
        const group = groupedItems.find((g) => g.category === selectedCategory);
        if (!group) return null;
        const categoryId = "cat-" + group.category.toLowerCase().replace(/\s+/g, "-");
        return (
            <div key={group.category} className="category w-full" id={categoryId}>
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
                <div className="groupItem grid grid-cols-2 xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-4 justify-between">
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
                                category={group.category}
                                craftModalOpener={() => openCraftModal(itemId, group.category)}
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
                backToTopBtn.style.display = window.pageYOffset > 300 ? "block" : "none";
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
    const handleCopyCSV = () => {
        if (!detailsIndex || !craftModalItem) return;
        const recap = gatherResources(
            detailsIndex[craftModalItem].recipe,
            detailsIndex,
            craftQuantity
        );
        const csvLines = Object.keys(recap).map((key) => `${recap[key]},${key}`);
        const csvText = csvLines.join("\n");
        navigator.clipboard.writeText(csvText);
        alert(t("itemsNrecipes.copyCSV.alert"));
    };

    return (
        <div className="items-&-recipes-page">
            <section
                className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4"
                role="alert"
                aria-live="assertive"
            >
                <div className="flex items-start gap-3">
                    <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
                    <div className="text-sm text-yellow-200/90">
                        <p className="font-medium mb-1">{t("itemsNrecipes.beta.title")}</p>
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
                            </a>.
                        </p>
                    </div>
                </div>
            </section>

            {/* Navigation bar displaying item categories */}
            <nav id="categoryNav" className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                <ul className="grid grid-cols-2 xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-4 gap-2 p-0 m-0">
                    {groupedItems &&
                        groupedItems.map((group) => (
                            <li key={group.category} className="w-full">
                                <button
                                    onClick={() => setSelectedCategory(group.category)}
                                    className="block w-full bg-gray-700 text-white p-2 rounded transition-colors hover:bg-gray-600 whitespace-nowrap text-center"
                                >
                                    <span className="flex flex-row items-center gap-2">
                                        <INRItemImage
                                            groupCategory={group.category}
                                            itemId={group.category}
                                            detailsIndex={detailsIndex}
                                            className="h-8 w-8 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                            style={{ imageRendering: "pixelated" }}
                                        />
                                        <span className="flex flex-col items-start leading-tight">
                                            <span className="font-bold text-sm">
                                                {group.category.toUpperCase().replace("_", " ")}
                                            </span>
                                        </span>
                                    </span>
                                </button>
                            </li>
                        ))}
                </ul>
            </nav>

            {/* Display of the items list (only for selected category) */}
            <div id="itemsContainer" className="flex flex-wrap gap-4 justify-start p-4">
                {renderItems()}
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
                    {detailsIndex[craftModalItem] && detailsIndex[craftModalItem].recipe ? (
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
                                    <div id="craftDetails" className="flex flex-col flex-1 max-h-[90vh]">
                                        {/* Header 1: Item image and title */}
                                        <div className="bg-gray-700 text-white p-4 flex flex-row gap-3 items-center shadow-md">
                                            <INRItemImage
                                                groupCategory={craftModalCategory!}
                                                itemId={craftModalItem}
                                                detailsIndex={detailsIndex}
                                                className="h-16 w-16 drop-shadow"
                                                style={{ imageRendering: "pixelated" }}
                                            />
                                            <div className="flex flex-col">
                                                <div className="text-2xl font-bold">
                                                    {t("itemsNrecipes.craftFor")}{" "}
                                                    {t(`item.${craftModalItem}`, {
                                                        ns: "items",
                                                        defaultValue: craftModalItem
                                                            .replace(/_/g, " ")
                                                            .split(" ")
                                                            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                                            .join(" "),
                                                    })}
                                                </div>
                                                <p className="text-sm opacity-60">
                                                    {t("itemsNrecipes.jobRequired")}{" "}
                                                    {detailsIndex[craftModalItem].recipe.job}
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
                                                    <X strokeWidth={3} className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                        {/* Header 2: Controls */}
                                        <div className="bg-gray-700 text-white p-4 flex flex-row items-center justify-between shadow-md">
                                            {/* Left: Global collapse/expand button */}
                                            <div className="flex items-center">
                                                <button
                                                    className="flex font-medium flex-row gap-2 bg-gray-600 hover:bg-gray-500 text-white py-1 px-3 rounded text-sm"
                                                    onClick={() => {
                                                        setGlobalExpanded(!globalExpanded);
                                                        setGlobalToggleVersion((prev) => prev + 1);
                                                    }}
                                                >
                                                    {globalExpanded ? (
                                                        <>
                                                            <Minus /> {t("itemsNrecipes.collapseAll.button")}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus /> {t("itemsNrecipes.expandAll.button")}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            {/* Center: Quantity selection */}
                                            <div className="flex items-center gap-2">
                                                <label className="text-sm font-bold" htmlFor="craftQuantity">
                                                    {t("itemsNrecipes.quantity.title")}
                                                </label>
                                                <input
                                                    id="craftQuantity"
                                                    type="number"
                                                    min="1"
                                                    className="w-16 p-1 text-black rounded text-center"
                                                    value={tempQuantity}
                                                    onChange={(e) => setTempQuantity(e.target.value)}
                                                />
                                                <button
                                                    className="flex font-medium flex-row gap-2 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm"
                                                    onClick={() => {
                                                        const qty = parseInt(tempQuantity, 10);
                                                        if (!isNaN(qty) && qty > 0) {
                                                            setCraftQuantity(qty);
                                                        }
                                                    }}
                                                >
                                                    <Boxes /> {t("itemsNrecipes.quantity.button")}
                                                </button>
                                            </div>
                                            {/* Right: Recap toggle and CSV copy button */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="flex font-medium flex-row gap-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                                                    onClick={() => setShowRecap((prev) => !prev)}
                                                >
                                                    {showRecap ? (
                                                        <>
                                                            <EyeOff /> {t("itemsNrecipes.resourcesRequired.button.hide")}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye /> {t("itemsNrecipes.resourcesRequired.button.show")}
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    className="flex font-medium flex-row gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded text-sm"
                                                    onClick={handleCopyCSV}
                                                >
                                                    <ClipboardCopy /> {t("itemsNrecipes.copyCSV.button")}
                                                </button>
                                            </div>
                                        </div>
                                        {/* Content area scrollable */}
                                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                                            <div className="p-4">
                                                <RecipeTree
                                                    key={globalToggleVersion}
                                                    recipe={detailsIndex[craftModalItem].recipe}
                                                    detailsIndex={detailsIndex}
                                                    initialExpanded={globalExpanded}
                                                    multiplier={craftQuantity}
                                                />
                                                {/* Content resources recap */}
                                                {showRecap && renderResourcesContent()}
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
                                    <div id="craftDetails" className="flex flex-col flex-1 max-h-[90vh]">
                                        {/* Header 1: Item image and title */}
                                        <div className="bg-gray-700 text-white p-4 flex flex-row gap-3 items-center shadow-md">
                                            <INRItemImage
                                                groupCategory={craftModalCategory!}
                                                itemId={craftModalItem}
                                                detailsIndex={detailsIndex}
                                                className="h-16 w-16 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                                style={{ imageRendering: "pixelated" }}
                                            />
                                            <div className="flex flex-col">
                                                <div className="text-2xl font-bold">
                                                    {t("itemsNrecipes.craftFor")}{" "}
                                                    {t(`item.${craftModalItem}`, {
                                                        ns: "items",
                                                        defaultValue: craftModalItem
                                                            .replace(/_/g, " ")
                                                            .split(" ")
                                                            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                                            .join(" "),
                                                    })}
                                                </div>
                                                <p className="text-sm opacity-60">
                                                    {t("itemsNrecipes.recipe.no")}
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
                                                    <X strokeWidth={3} className="h-5 w-5" />
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

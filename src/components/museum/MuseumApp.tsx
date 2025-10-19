/*
 * Copyright (c) 2025 LupusArctos4 SPDX-License-Identifier: MIT
 */

import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    User,
    Import,
    Eye,
    EyeOff,
    ArrowUpFromLine,
    AlertTriangle,
    Plus,
    Minus,
    List,
    ListTodo,
    X,
    Globe,
} from "lucide-react";
import MuseumItemCard from "./MuseumItemCard";
import { useProfileStore } from "@store/profileStore";
import MuseumItemImage from "./MuseumItemImage"; // Nouvelle importation

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
    };
}

export const MuseumApp: FC = () => {
    const { t } = useTranslation("museum");
    const { username, setUsername } = useProfileStore();

    // States for storing data from the API and JSON files
    const [groupedItems, setGroupedItems] = useState<Group[] | null>(null);
    const [detailsIndex, setDetailsIndex] = useState<Details | null>(null);
    const [museumItems, setMuseumItems] = useState<string[]>([]);
    const [error] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    // States for controlling the display of the modals
    const [craftModalItem, setCraftModalItem] = useState<string | null>(null);
    const [craftModalCategory, setCraftModalCategory] = useState<string | null>(
        null
    );
    const [showRecapModal, setShowRecapModal] = useState(false);
    const [showResourcesModal, setShowResourcesModal] = useState(false);

    const [showDonated, setShowDonated] = useState(true);

    const totalStats =
        groupedItems && Array.isArray(groupedItems)
            ? {
                  owned: groupedItems.reduce(
                      (sum, group) =>
                          sum +
                          group.items.filter((item) =>
                              museumItems.includes(item)
                          ).length,
                      0
                  ),
                  total: groupedItems.reduce(
                      (sum, group) => sum + group.items.length,
                      0
                  ),
              }
            : { owned: 0, total: 0 };

    const completionPercent =
        totalStats.total > 0
            ? ((totalStats.owned / totalStats.total) * 100).toFixed(1)
            : "0.0";

    // Asynchronous function to load data (API and JSON)
    const loadData = async (pseudo: string) => {
        try {
            const apiResponse = await fetch(
                `https://api.minebox.co/data/${pseudo}`
            );
            if (!apiResponse.ok) {
                // If response is not OK, throw an error with the status and text
                throw new Error(
                    `HTTP ${apiResponse.status}: ${await apiResponse.text()}`
                );
            }
            const apiData = await apiResponse.json();

            if (
                !apiData.data ||
                !apiData.data.OBJECTIVES ||
                !apiData.data.OBJECTIVES.museum
            ) {
                throw new Error(
                    `HTTP 401: {"error":"User does not allow API requests"}`
                );
            }

            let museumItemsFetched: string[] =
                apiData.data.OBJECTIVES.museum || [];
            museumItemsFetched = museumItemsFetched.map((item) => {
                if (item.startsWith("transformed_material-"))
                    return item.replace(
                        "transformed_material-",
                        "transformed_"
                    );
                else if (item.startsWith("bag_material-"))
                    return item.replace("bag_material-", "bag_");
                else if (item.startsWith("crate_material-"))
                    return item.replace("crate_material-", "crate_");
                else if (item.startsWith("barrel_material-"))
                    return item.replace("barrel_material-", "barrel_");
                else if (item.startsWith("enchanted_material-"))
                    return item.replace("enchanted_material-", "enchanted_");
                return item;
            });
            setMuseumItems(museumItemsFetched);

            const itemsGroupedResponse = await fetch(
                "/assets/data/items_museum_grouped_by_category.json"
            );
            const itemsGrouped: Group[] = await itemsGroupedResponse.json();

            const itemsDetailsResponse = await fetch(
                "https://cdn2.minebox.co/data/items.json"
            );
            const itemsDetails = await itemsDetailsResponse.json();
            const details: Details = {};
            itemsDetails.forEach((item: any) => {
                details[item.id] = item;
                details[item.rarity] = item.rarity;
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

            // Clear any previous error message
            setErrorMsg("");
        } catch (error) {
            // Set the error message in the state: if the error is 401, use the formatted message
            setErrorMsg(
                error instanceof Error ? error.message : "Unknown error"
            );
        }
    };

    // Recursive function to aggregate the required resources from a given recipe
    const gatherResources = (recipe: any): { [key: string]: number } => {
        const resources: { [key: string]: number } = {};
        recipe.ingredients.forEach((ing: any) => {
            if (
                detailsIndex &&
                detailsIndex[ing.id] &&
                detailsIndex[ing.id].recipe &&
                detailsIndex[ing.id].recipe.job !== "FARMER"
            ) {
                const subResources = gatherResources(
                    detailsIndex[ing.id].recipe
                );
                for (const resId in subResources) {
                    resources[resId] =
                        (resources[resId] || 0) +
                        subResources[resId] * ing.amount;
                }
            } else {
                resources[ing.id] = (resources[ing.id] || 0) + ing.amount;
            }
        });
        return resources;
    };

    // Small component that renders the full recipe tree. We split nodes into
    // a separate component so each node can use hooks safely (one hook call per
    // component instance) and to avoid calling hooks inside loops.
    const RecipeTree: FC<{ recipe: any; detailsIndex: any }> = ({
        recipe,
        detailsIndex,
    }) => {
        if (!recipe || !recipe.ingredients) return <></>;
        return (
            <ul>
                {recipe.ingredients.map((ing: any, i: number) => (
                    <RecipeNode key={i} ing={ing} detailsIndex={detailsIndex} />
                ))}
            </ul>
        );
    };

    const RecipeNode: FC<{ ing: any; detailsIndex: any }> = ({
        ing,
        detailsIndex,
    }) => {
        const [isExpanded, setIsExpanded] = useState(false);

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
            const subResources = gatherResources(detailsIndex[ing.id].recipe);
            summary = (
                <span className="max-w-[80%] ml-auto bg-gray-500 bg-opacity-20 border-2 border-gray-500 border-opacity-30 rounded p-0.5 px-2">
                    {Object.keys(subResources).map((key, index, arr) => {
                        const globalAmount = subResources[key] * ing.amount;
                        return (
                            <span
                                key={key}
                                className="inline-flex items-center mr-1 text-xs align-baseline"
                            >
                                <span>
                                    {globalAmount.toLocaleString("fr-FR")}
                                </span>
                                x
                                <MuseumItemImage
                                    itemId={key}
                                    detailsIndex={detailsIndex}
                                    className="h-4 w-4 ml-0.5"
                                    style={{ imageRendering: "pixelated" }}
                                />
                                <span className="ml-0.5">
                                    {index < arr.length - 1 && " "}
                                </span>
                            </span>
                        );
                    })}
                </span>
            );
        }

        return (
            <li className="mb-2 bg-gray-500 p-2 rounded-lg bg-opacity-20 border-2 border-gray-500 border-opacity-30">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center">
                        <MuseumItemImage
                            itemId={ing.id}
                            detailsIndex={detailsIndex}
                            style={{
                                width: "35px",
                                height: "35px",
                                marginRight: "5px",
                                verticalAlign: "middle",
                                imageRendering: "pixelated",
                            }}
                            onClick={() => setIsExpanded(!isExpanded)}
                        />

                        <span className="font-bold text-sm flex flex-col">
                            <span
                                className="flex items-center mr-2 whitespace-nowrap"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {/* Przycisk zwijania/rozwijania */}
                                {hasSubRecipe && (
                                    <button className="mr-0.5 text-xs text-gray-300 hover:text-white focus:outline-none">
                                        {isExpanded ? (
                                            <Minus className="h-4 w-4" />
                                        ) : (
                                            <Plus className="h-4 w-4" />
                                        )}
                                    </button>
                                )}
                                {ing.amount}x {ing.id}
                            </span>

                            {detailsIndex &&
                                detailsIndex[ing.id] &&
                                detailsIndex[ing.id].recipe &&
                                detailsIndex[ing.id].recipe.job && (
                                    <span className="text-xs font-normal text-green-500">
                                        {detailsIndex[ing.id].recipe.job}
                                    </span>
                                )}
                        </span>
                    </div>
                    {summary}
                </div>

                {/* Renderuj poddrzewo tylko jeśli rozwinięte */}
                {hasSubRecipe && isExpanded && (
                    <div
                        style={{
                            marginLeft: "25px",
                            paddingLeft: "10px",
                            marginTop: "5px",
                        }}
                    >
                        <RecipeTree
                            recipe={detailsIndex[ing.id].recipe}
                            detailsIndex={detailsIndex}
                        />
                    </div>
                )}
            </li>
        );
    };

    // Function that is executed when clicking on an unowned item to open the craft modal
    const openCraftModal = (itemId: string, category: string) => {
        setCraftModalItem(itemId);
        setCraftModalCategory(category);
    };

    // Function that returns the content of the missing items recap
    const renderRecapContent = () => {
        if (!groupedItems || !detailsIndex || !museumItems) {
            return <p>{t("museum.noDataLoaded")}</p>;
        }

        return (
            <div>
                {groupedItems.map((group, index) => {
                    const missingItems = group.items.filter(
                        (item) => !museumItems.includes(item)
                    );
                    if (missingItems.length === 0) return null;

                    return (
                        <div key={index} className="mb-4">
                            <div className="text-2xl font-bold">
                                {group.category}
                            </div>

                            <ul className="list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                                {missingItems.map((itemId) => {
                                    return (
                                        <li
                                            key={itemId}
                                            className="flex items-center bg-gray-700 p-2 rounded-lg"
                                        >
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
                                                {itemId}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Function that returns the content of the missing resources
    const renderResourcesContent = () => {
        if (!groupedItems || !detailsIndex || !museumItems) {
            return <p>{t("museum.noDataLoaded")}</p>;
        }
        const totalResources: { [key: string]: number } = {};
        groupedItems.forEach((group) => {
            const missingItems = group.items.filter(
                (item) => !museumItems.includes(item)
            );
            missingItems.forEach((itemId) => {
                if (detailsIndex[itemId] && detailsIndex[itemId].recipe) {
                    const itemResources = gatherResources(
                        detailsIndex[itemId].recipe
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
            <span>
                <span className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {sortedResourceIds.map((resId) => {
                        return (
                            <li
                                key={resId}
                                className="block bg-gray-700 p-2 rounded-lg"
                            >
                                <div className="flex items-center">
                                    <MuseumItemImage
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
                            </li>
                        );
                    })}
                </span>
            </span>
        );
    };

    // Function that returns the display of the items grid and the category navigation bar
    const renderItems = () => {
        if (!groupedItems || !detailsIndex) return null;
        return groupedItems.map((group, index) => {
            const ownedCount = group.items.filter((item) =>
                museumItems.includes(item)
            ).length;
            const categoryId =
                "cat-" + group.category.toLowerCase().replace(/\s+/g, "-");
            return (
                <div key={index} className="category w-full" id={categoryId}>
                    {/* Category Title with icon and owned count */}
                    <div className="titreCategory text-2xl font-bold flex flex-row gap-2 items-center mb-2">
                        <MuseumItemImage
                            groupCategory={group.category}
                            itemId={group.category}
                            detailsIndex={detailsIndex}
                            className="h-8 w-8"
                            style={{ imageRendering: "pixelated" }}
                        />
                        {group.category}
                        <p className="opacity-40 text-sm">
                            [{ownedCount} / {group.items.length}]
                        </p>
                    </div>
                    {/* Grid of items */}
                    <div className="groupItem grid grid-cols-2 xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-4 justify-between">
                        {group.items.map((itemId) => {
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
                                        imageSrc={imageSrc}
                                        isOwned={isOwned}
                                        rarity={rarity}
                                        category={group.category}
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
                        })}
                    </div>
                </div>
            );
        });
    };

    // useEffect hook to handle the "Back to Top" button using a scroll listener
    useEffect(() => {
        const backToTopBtn = document.getElementById("backToTop");

        const handleScroll = () => {
            if (backToTopBtn) {
                if (window.pageYOffset > 300) {
                    backToTopBtn.style.display = "block";
                } else {
                    backToTopBtn.style.display = "none";
                }
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

        if (craftModalItem || showRecapModal || showResourcesModal) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
    }, []);

    // Handling the form for entering the username
    const handleUsernameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (username.length >= 3) {
            loadData(username);
        }
    };

    return (
        <div className="museum-page">
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
                            {t("museum.beta.title")}
                        </p>
                        <p className="text-yellow-200/70">
                            {t("museum.beta.description")}{" "}
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

            {/* Form for entering the username */}
            <span className="flex flex-col md:flex-row mb-2 gap-2">
                <form
                    id="pseudoForm"
                    onSubmit={handleUsernameSubmit}
                    className="w-full"
                >
                    <div>
                        <div className="w-full p-0 flex justify-around items-center bg-gray-800 bg-opacity-50 rounded-md h-24">
                            <div className="m-4">
                                <label
                                    htmlFor="minecraft-username"
                                    className="block text-sm font-medium text-gray-200"
                                >
                                    {t("museum.minecraftUsername")}
                                </label>
                            </div>
                            <div className="bg-gray-800 bg-opacity-30 rounded-full max-w-[500px] mx-auto w-full relative">
                                <input
                                    type="text"
                                    id="pseudo"
                                    placeholder={t("museum.minecraftUsername")}
                                    value={username}
                                    minLength={3}
                                    maxLength={16}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                    className={`w-full bg-gray-700 rounded-lg px-4 py-2 pl-10 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                        error
                                            ? "focus:ring-red-500 border border-red-500/50"
                                            : "focus:ring-green-500"
                                    }`}
                                />
                                <User
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={16}
                                    aria-hidden="true"
                                />
                            </div>
                            <button
                                id="importPseudoButton"
                                className="bg-green-600 text-white border-0 rounded-lg py-2 px-4 cursor-pointer text-base transition-colors hover:bg-green-700 whitespace-nowrap m-4"
                                type="submit"
                            >
                                <span className="flex flex-row items-center gap-2">
                                    <Import className="h-4 w-4" />{" "}
                                    {t("museum.importMuseum.button")}
                                </span>
                            </button>
                        </div>
                        {/* Display error message if exists */}
                        {errorMsg && (
                            <p className="text-red-400 text-center mt-2">
                                {errorMsg}
                            </p>
                        )}
                    </div>
                </form>
                <span className="flex h-24 w-full md:w-96 bg-gray-800 bg-opacity-50 rounded-md p-4 items-center justify-center gap-6">
                    <span>
                        <h3 className="text-lg font-bold">
                            {t("museum.completion")}
                        </h3>
                        <span className="flex flex-row justify-between gap-2">
                            <p className="text-sm opacity-50">
                                [{totalStats.owned.toString()} /{" "}
                                {totalStats.total.toString()}]
                            </p>
                            <p className="text-sm text-green-600">
                                [{completionPercent}%]
                            </p>
                        </span>
                    </span>
                    <img
                        src="assets/media/icons/museum.png"
                        className="h-12 w-12"
                        alt="museum icon"
                    />
                </span>
            </span>

            {/* Navigation bar displaying item categories */}
            <nav
                id="categoryNav"
                className="bg-gray-800 bg-opacity-50 p-4 rounded-lg"
            >
                <ul className="grid grid-cols-2 xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-4 gap-2 p-0 m-0">
                    {groupedItems &&
                        groupedItems.map((group, i) => {
                            const ownedCount = group.items.filter((item) =>
                                museumItems.includes(item)
                            ).length;
                            const categoryId =
                                "cat-" +
                                group.category
                                    .toLowerCase()
                                    .replace(/\s+/g, "-");
                            return (
                                <li key={group.category} className="w-full">
                                    <a
                                        key={i}
                                        href={"#" + categoryId}
                                        className="block w-full bg-gray-700 text-white p-2 rounded transition-colors hover:bg-gray-600 whitespace-nowrap text-center"
                                    >
                                        <span className="flex flex-row items-center gap-2">
                                            <MuseumItemImage
                                                groupCategory={group.category}
                                                itemId={group.category}
                                                detailsIndex={detailsIndex}
                                                className="h-8 w-8 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                                style={{
                                                    imageRendering: "pixelated",
                                                }}
                                            />
                                            <span className="flex flex-col items-start leading-tight">
                                                <span className="font-bold text-sm">
                                                    {group.category}
                                                </span>
                                                <span className="text-xs opacity-50">
                                                    [{ownedCount} /{" "}
                                                    {group.items.length}]
                                                </span>
                                            </span>
                                        </span>
                                    </a>
                                </li>
                            );
                        })}
                </ul>
            </nav>

            {/* Buttons to display the missing items and resources modals */}
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg recap-buttons-container flex justify-between gap-4 mt-2">
                <span className="flex flex-row gap-2 items-center text-sm font-medium text-gray-200">
                    {t("museum.options")}
                </span>
                <span className="flex gap-2">
                    <button
                        id="hideDonated"
                        className="flex font-medium flex-row gap-2 text-sm bg-green-600 text-white rounded-lg py-2 px-4 transition-colors hover:bg-green-700 whitespace-nowrap items-center"
                        onClick={() => setShowDonated(!showDonated)}
                    >
                        {showDonated ? (
                            <>
                                <EyeOff /> {t("museum.hideDonated.button")}
                            </>
                        ) : (
                            <>
                                <Eye /> {t("museum.showDonated.button")}
                            </>
                        )}
                    </button>
                    <button
                        id="recapButton"
                        className="flex font-medium flex-row gap-2 text-sm bg-green-600 text-white rounded-lg py-2 px-4 transition-colors hover:bg-green-700 whitespace-nowrap items-center"
                        onClick={() => setShowRecapModal(true)}
                    >
                        <ListTodo /> {t("museum.recapMuseum.button")}
                    </button>
                    <button
                        id="resourcesButton"
                        className="flex text-sm font-medium flex-row gap-2 bg-green-600 text-white rounded-lg py-2 px-4 transition-colors hover:bg-green-700 whitespace-nowrap items-center"
                        onClick={() => setShowResourcesModal(true)}
                    >
                        <List /> {t("museum.resourceMuseum.button")}
                    </button>
                </span>
            </div>

            {/* Display of the items list */}
            <div
                id="itemsContainer"
                className="flex flex-wrap gap-4 justify-start p-4"
            >
                {renderItems()}
            </div>

            {/* "Back to Top" button */}
            <button
                id="backToTop"
                className="fixed bottom-5 right-5 py-2 px-4 bg-gray-800 text-white rounded-lg text-xs shadow flex flex-col items-center justify-center gap-1 text-center"
            >
                <ArrowUpFromLine className="h-4 w-4 mx-auto" />
                <span>{t("museum.backToTop.button")}</span>
            </button>

            {/* Craft modal */}
            {craftModalItem && detailsIndex && (
                <div
                    className="modal fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-60 overflow-y-auto p-[2.49%]"
                    id="craftModal"
                    onClick={(e) => {
                        if (e.target === e.currentTarget)
                            setCraftModalItem(null);
                        setCraftModalCategory(null);
                    }}
                >
                    <div className="modal-content flex flex-col bg-[rgb(31,41,55)] text-white rounded-lg max-w-[90%] max-h-[90vh] mx-auto shadow-2xl relative">
                        <span
                            className="close absolute top-2 right-4 text-2xl font-bold text-white cursor-pointer hover:text-emerald-500"
                            onClick={() => {
                                setCraftModalItem(null);
                                setCraftModalCategory(null);
                            }}
                        >
                            &times;
                        </span>
                        <div
                            id="craftDetails"
                            className="flex flex-col flex-1 max-h-[90vh]" // <--- ważne
                        >
                            {detailsIndex[craftModalItem] &&
                            detailsIndex[craftModalItem].recipe ? (
                                <>
                                    <div className="bg-gray-700 text-white p-4 rounded-t-lg flex flex-row gap-3 items-center shadow-[0_4px_16px_rgba(0,0,0,0.25)] z-10">
                                        <MuseumItemImage
                                            groupCategory={craftModalCategory!}
                                            itemId={craftModalItem}
                                            detailsIndex={detailsIndex}
                                            className="h-16 w-16 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                            style={{
                                                imageRendering: "pixelated",
                                            }}
                                        />
                                        <span className="flex flex-col">
                                            <div className="text-2xl font-bold mb-0">
                                                {t("museum.craftFor")}{" "}
                                                {craftModalItem}
                                            </div>
                                            <p className="text-sm opacity-60">
                                                {t("museum.jobRequired")}{" "}
                                                {
                                                    detailsIndex[craftModalItem]
                                                        .recipe.job
                                                }
                                            </p>
                                        </span>
                                        <a
                                            className="ml-auto"
                                            href={`https://minebox.co/universe/items?id=${craftModalItem}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <span className="close flex items-center justify-center text-xl font-semibold cursor-pointer h-8 w-8 rounded transition hover:text-white text-gray-200 hover:bg-gray-600">
                                                ?
                                            </span>
                                        </a>
                                        <span
                                            className="close flex items-center justify-center text-2xl font-bold cursor-pointer h-8 w-8 mr-1 rounded transition hover:text-white text-gray-200 hover:bg-gray-600"
                                            onClick={() =>
                                                setCraftModalItem(null)
                                            }
                                        >
                                            <X
                                                strokeWidth={3}
                                                className="h-5 w-5"
                                            />
                                        </span>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 pb-3 custom-scrollbar">
                                        <RecipeTree
                                            recipe={
                                                detailsIndex[craftModalItem]
                                                    .recipe
                                            }
                                            detailsIndex={detailsIndex}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-gray-700 text-white p-4 rounded-lg flex flex-row gap-3 items-center shadow-[0_4px_16px_rgba(0,0,0,0.25)] z-10">
                                        <MuseumItemImage
                                            groupCategory={craftModalCategory!}
                                            itemId={craftModalItem}
                                            detailsIndex={detailsIndex}
                                            className="h-16 w-16 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                            style={{
                                                imageRendering: "pixelated",
                                            }}
                                        />
                                        <span className="flex flex-col">
                                            <div className="text-2xl font-bold mb-0">
                                                {t("museum.craftFor")}{" "}
                                                {craftModalItem}
                                            </div>
                                            <p className="text-sm opacity-60">
                                                {t("museum.noRecipe")}
                                            </p>
                                        </span>
                                        <a
                                            className="ml-auto"
                                            href={`https://minebox.co/universe/items?id=${craftModalItem}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <span className="close flex items-center justify-center text-xl font-semibold cursor-pointer h-8 w-8 rounded transition hover:text-white text-gray-200 hover:bg-gray-600">
                                                ?
                                            </span>
                                        </a>
                                        <span
                                            className="close flex items-center justify-center text-2xl font-bold cursor-pointer h-8 w-8 mr-1 rounded transition hover:text-white text-gray-200 hover:bg-gray-600"
                                            onClick={() =>
                                                setCraftModalItem(null)
                                            }
                                        >
                                            <X
                                                strokeWidth={3}
                                                className="h-5 w-5"
                                            />
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Missing items recap modal */}
            {showRecapModal && (
                <div
                    className="modal fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-60 overflow-y-auto p-[2.49%]"
                    id="recapModal"
                    onClick={(e) => {
                        if (e.target === e.currentTarget)
                            setShowRecapModal(false);
                    }}
                >
                    <div className="modal-content flex flex-col bg-[rgb(31,41,55)] text-white rounded-lg max-w-[90%] max-h-[90vh] mx-auto shadow-2xl relative">
                        <div className="bg-gray-700 text-white p-4 rounded-t-lg flex flex-row gap-3 items-center align-middle shadow-[0_4px_16px_rgba(0,0,0,0.25)] relative z-10">
                            <ListTodo
                                strokeWidth={2.4}
                                className="text-green-400 h-12 w-12 p-2 bg-green-500 rounded bg-opacity-10"
                            />
                            <span className="flex flex-col">
                                <div className="text-2xl font-bold">
                                    {t("museum.recapMuseum.title")}
                                </div>
                                <div className="text-sm font-normal opacity-60">
                                    {t("museum.recapMuseum.description")}
                                </div>
                            </span>
                            <span
                                className="ml-auto close flex items-center justify-center text-2xl font-bold cursor-pointer h-8 w-8 mr-1 rounded transition hover:text-white text-gray-200 hover:bg-gray-600"
                                onClick={() => setShowRecapModal(false)}
                            >
                                <X strokeWidth={3} className="h-5 w-5" />
                            </span>
                        </div>

                        <div
                            id="recapContent"
                            className="flex-1 overflow-y-auto custom-scrollbar p-4 relative z-0"
                        >
                            {renderRecapContent()}
                        </div>
                    </div>
                </div>
            )}
            {showResourcesModal && (
                <div
                    className="modal fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-60 overflow-y-auto p-[2.49%]"
                    id="resourcesModal"
                    onClick={(e) => {
                        if (e.target === e.currentTarget)
                            setShowResourcesModal(false);
                    }}
                >
                    <div className="modal-content flex flex-col bg-[rgb(31,41,55)] text-white rounded-lg max-w-[90%] max-h-[90vh] mx-auto shadow-2xl relative">
                        <div className="bg-gray-700 text-white p-4 rounded-t-lg flex flex-row gap-3 items-center align-middle shadow-[0_4px_16px_rgba(0,0,0,0.25)] relative z-10">
                            <List
                                strokeWidth={2.4}
                                className="text-green-400 h-12 w-12 p-2 bg-green-500 rounded bg-opacity-10"
                            />
                            <span className="flex flex-col">
                                <div className="text-2xl font-bold">
                                    {t("museum.resourceMuseum.title")}
                                </div>
                                <div className="text-sm font-normal opacity-60">
                                    {t("museum.resourceMuseum.description")}
                                </div>
                            </span>

                            <span
                                className="ml-auto close flex items-center justify-center text-2xl font-bold cursor-pointer h-8 w-8 mr-1 rounded transition hover:text-white text-gray-200 hover:bg-gray-600"
                                onClick={() => setShowResourcesModal(false)}
                            >
                                <X strokeWidth={3} className="h-5 w-5" />
                            </span>
                        </div>

                        <div
                            id="resourcesContent"
                            className="flex-1 overflow-y-auto custom-scrollbar p-4 relative z-0"
                        >
                            {renderResourcesContent()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MuseumApp;

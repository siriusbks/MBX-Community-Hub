/*
 * Copyright (c) 2025 LupusArctos4 SPDX-License-Identifier: MIT
 */

import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Import, Eye } from "lucide-react";
import MuseumItemCard from "./MuseumItemCard";

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

    // States for storing data from the API and JSON files
    const [groupedItems, setGroupedItems] = useState<Group[] | null>(null);
    const [detailsIndex, setDetailsIndex] = useState<Details | null>(null);
    const [museumItems, setMuseumItems] = useState<string[]>([]);
    const [username, setUsername] = useState("");
    const [error] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    // States for controlling the display of the modals
    const [craftModalItem, setCraftModalItem] = useState<string | null>(null);
    const [showRecapModal, setShowRecapModal] = useState(false);
    const [showResourcesModal, setShowResourcesModal] = useState(false);

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

    // Recursive function that returns a JSX tree representing a recipe
    const buildRecipeTree = (recipe: any): JSX.Element => {
        return (
            <ul>
                {recipe.ingredients.map((ing: any, i: number) => {
                    const imageSrc =
                        detailsIndex &&
                        detailsIndex[ing.id] &&
                        detailsIndex[ing.id].image
                            ? "data:image/png;base64," +
                              detailsIndex[ing.id].image
                            : `assets/media/item/textures/${ing.id}.png`;

                    let summary: JSX.Element | null = null;
                    if (
                        detailsIndex &&
                        detailsIndex[ing.id] &&
                        detailsIndex[ing.id].recipe
                    ) {
                        const subResources = gatherResources(
                            detailsIndex[ing.id].recipe
                        );
                        summary = (
                            <span
                                style={{
                                    marginLeft: "5px",
                                    backgroundColor: "rgb(55,65,81)",
                                    padding: "0.5rem",
                                    borderRadius: "0.5rem",
                                }}
                            >
                                {Object.keys(subResources).map(
                                    (key, index, arr) => {
                                        const globalAmount =
                                            subResources[key] * ing.amount;
                                        return (
                                            // Each span represents a resource (with its icon and quantity)
                                            <span
                                                key={key}
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    marginRight: "5px",
                                                }}
                                            >
                                                <img
                                                    style={{
                                                        width: "20px",
                                                        height: "20px",
                                                        marginRight: "2px",
                                                    }}
                                                    src={
                                                        detailsIndex &&
                                                        detailsIndex[key] &&
                                                        detailsIndex[key].image
                                                            ? "data:image/png;base64," +
                                                              detailsIndex[key]
                                                                  .image
                                                            : `assets/media/item/textures/${key}.png`
                                                    }
                                                    alt={key}
                                                    onError={(e) =>
                                                        ((
                                                            e.target as HTMLImageElement
                                                        ).style.display =
                                                            "none")
                                                    }
                                                />
                                                {globalAmount.toLocaleString(
                                                    "fr-FR"
                                                )}
                                                x {key}
                                                {index < arr.length - 1 && ", "}
                                            </span>
                                        );
                                    }
                                )}
                            </span>
                        );
                    }

                    // Render each ingredient in an <li>
                    return (
                        <li key={i} style={{ marginBottom: "8px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <img
                                    style={{
                                        width: "35px",
                                        height: "35px",
                                        marginRight: "5px",
                                        verticalAlign: "middle",
                                    }}
                                    src={imageSrc}
                                    alt={ing.id}
                                    onError={(e) =>
                                        ((
                                            e.target as HTMLImageElement
                                        ).style.display = "none")
                                    }
                                />
                                <span>
                                    {ing.amount}x {ing.id}
                                </span>
                                {summary}
                            </div>
                            {/* If the ingredient has a recipe and its job is not "FARMER", render the sub-recipe */}
                            {detailsIndex &&
                                detailsIndex[ing.id] &&
                                detailsIndex[ing.id].recipe &&
                                detailsIndex[ing.id].recipe.job !==
                                    "FARMER" && (
                                    <div
                                        style={{
                                            marginLeft: "25px",
                                            borderLeft: "2px solid #ddd",
                                            paddingLeft: "10px",
                                            marginTop: "5px",
                                        }}
                                    >
                                        {buildRecipeTree(
                                            detailsIndex[ing.id].recipe
                                        )}
                                    </div>
                                )}
                        </li>
                    );
                })}
            </ul>
        );
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

    // Function that is executed when clicking on an unowned item to open the craft modal
    const openCraftModal = (itemId: string) => {
        setCraftModalItem(itemId);
    };

    // Function that returns the content of the missing items recap
    const renderRecapContent = () => {
        if (!groupedItems || !detailsIndex || !museumItems) {
            return <p>{t("museum.noDataLoaded")}</p>;
        }
        return groupedItems.map((group, index) => {
            // Filter to obtain only the missing items
            const missingItems = group.items.filter(
                (item) => !museumItems.includes(item)
            );
            if (missingItems.length === 0) return null;
            return (
                <div key={index} className="mb-4">
                    {/* Display the category */}
                    <div className="text-2xl font-bold">{group.category}</div>
                    <ul className="list-none flex flex-wrap gap-4">
                        {missingItems.map((itemId) => {
                            const imageSrc =
                                detailsIndex &&
                                detailsIndex[itemId] &&
                                detailsIndex[itemId].image
                                    ? "data:image/png;base64," +
                                      detailsIndex[itemId].image
                                    : `assets/media/item/textures/${itemId}.png`;
                            return (
                                <li key={itemId} className="flex items-center">
                                    <img
                                        className="w-8 h-8 mr-2"
                                        src={imageSrc}
                                        alt={itemId}
                                        onError={(e) =>
                                            ((
                                                e.target as HTMLImageElement
                                            ).style.display = "none")
                                        }
                                    />
                                    {itemId}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );
        });
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
            <ul className="list-none">
                {sortedResourceIds.map((resId) => {
                    const imageSrc =
                        detailsIndex &&
                        detailsIndex[resId] &&
                        detailsIndex[resId].image
                            ? "data:image/png;base64," +
                              detailsIndex[resId].image
                            : `assets/media/item/textures/${resId}.png`;
                    return (
                        <li key={resId} className="block mb-2 text-2xl">
                            <div className="flex items-center">
                                <img
                                    className="w-12 h-12 mr-2"
                                    src={imageSrc}
                                    alt={resId}
                                    onError={(e) =>
                                        ((
                                            e.target as HTMLImageElement
                                        ).style.display = "none")
                                    }
                                />
                                {resId} :{" "}
                                {totalResources[resId].toLocaleString("fr-FR")}
                            </div>
                        </li>
                    );
                })}
            </ul>
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
                <div key={index} className="category" id={categoryId}>
                    {/* Category Title with icon and owned count */}
                    <div className="titreCategory text-2xl font-bold flex flex-row gap-2 items-center mb-2">
                        <img
                            src={`assets/media/museum/${group.category}.png`}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src =
                                    "assets/media/museum/not-found.png";
                            }}
                            className="h-8 w-8"
                        />
                        {group.category}
                        <p className="opacity-40 text-sm">
                            [{ownedCount} / {group.items.length}]
                        </p>
                    </div>
                    {/* Grid of items */}
                    <div className="groupItem grid grid-cols-8 justify-between">
                        {group.items.map((itemId) => {
                            const isOwned = museumItems.includes(itemId);
                            const imageSrc =
                                detailsIndex[itemId] &&
                                detailsIndex[itemId].image
                                    ? "data:image/png;base64," +
                                      detailsIndex[itemId].image
                                    : `assets/media/item/textures/${itemId}.png`;
                            const rarity =
                                detailsIndex[itemId] &&
                                detailsIndex[itemId].rarity
                                    ? detailsIndex[itemId].rarity
                                    : "UNKNOWN";
                            return (
                                <MuseumItemCard
                                    key={itemId}
                                    itemId={itemId}
                                    imageSrc={imageSrc}
                                    isOwned={isOwned}
                                    rarity={rarity}
                                    craftModalOpener={() =>
                                        openCraftModal(itemId)
                                    }
                                />
                            );
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
            {/* Form for entering the username */}
            <span className="flex flex-row md:mb-2 gap-2">
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
                                className="bg-green-600 text-white border-0  rounded-lg py-2 px-4 cursor-pointer text-base transition-colors hover:bg-green-700 whitespace-nowrap m-4"
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
                <span className="flex h-24 w-96 bg-gray-800 bg-opacity-50 rounded-md p-4 items-center justify-center  gap-6">
                    <span>
                        <h3 className="text-lg font-bold">{t("museum.completion")}</h3>
                        <span className="flex flex-row justify-between gap-2">
                            <p className="text-sm opacity-50">[0000 / 0000]</p>
                            <p className="text-sm text-green-600">[00.0%]</p>
                        </span>
                    </span>
                    <img
                        src="assets/media/icons/museum.png"
                        className="h-12 w-12"
                    />
                </span>
            </span>
            {/* Navigation bar displaying item categories */}
            <nav
                id="categoryNav"
                className="bg-gray-800 bg-opacity-50 p-4 rounded-lg "
            >
                <ul className="grid grid-cols-8 gap-2 p-0 m-0">
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
                                            {/* Category Icon */}
                                            <img
                                                src={`assets/media/museum/${group.category}.png`}
                                                onError={(e) => {
                                                    e.currentTarget.onerror =
                                                        null;
                                                    e.currentTarget.src =
                                                        "assets/media/museum/not-found.png";
                                                }}
                                                className="h-8 w-8"
                                            />
                                            <span className="flex flex-col items-start leading-tight">
                                                <span className="font-bold text-sm">
                                                    {group.category}
                                                </span>
                                                <span className="text-xs opacity-50">
                                                    [{ownedCount}
                                                    {" / "}
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
                        id="recapButton"
                        className="flex font-medium flex-row gap-2 text-sm bg-green-600 text-white rounded-lg py-2 px-4 transition-colors hover:bg-green-700 whitespace-nowrap"
                        onClick={() => setShowRecapModal(true)}
                    >
                        <Eye /> {t("museum.recapMuseum.button")}
                    </button>
                    <button
                        id="resourcesButton"
                        className="flex font-medium flex-row gap-2 text-sm bg-green-600 text-white rounded-lg py-2 px-4 transition-colors hover:bg-green-700 whitespace-nowrap"
                        onClick={() => setShowResourcesModal(true)}
                    >
                        <Eye /> {t("museum.resourceMuseum.button")}
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
                className="fixed bottom-5 right-5 py-2 px-4 bg-gray-800 text-white rounded shadow hidden"
            >
                {t("museum.backToTop.button")}
            </button>

            {/* Craft modal */}
            {craftModalItem && detailsIndex && (
                <div
                    className="modal fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-60 overflow-y-auto p-8"
                    id="craftModal"
                    onClick={(e) => {
                        if (e.target === e.currentTarget)
                            setCraftModalItem(null);
                    }}
                >
                    <div className="modal-content bg-[rgb(31,41,55)] text-white p-6 rounded-lg max-w-[90%] max-h-[80vh] mx-auto shadow-lg overflow-y-auto relative">
                        <span
                            className="close absolute top-2 right-4 text-2xl font-bold text-white cursor-pointer hover:text-emerald-500"
                            onClick={() => setCraftModalItem(null)}
                        >
                            &times;
                        </span>
                        <div id="craftDetails">
                            {detailsIndex[craftModalItem] &&
                            detailsIndex[craftModalItem].recipe ? (
                                <>
                                    <div style={{ fontSize: "20px" }}>
                                        {t("museum.craftFor")} {craftModalItem}
                                    </div>
                                    <p style={{ fontSize: "16px" }}>
                                        {t("museum.jobRequired")}{" "}
                                        {
                                            detailsIndex[craftModalItem].recipe
                                                .job
                                        }
                                    </p>
                                    {buildRecipeTree(
                                        detailsIndex[craftModalItem].recipe
                                    )}
                                </>
                            ) : (
                                <p>{t("museum.noRecipe")}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Missing items recap modal */}
            {showRecapModal && (
                <div
                    className="modal fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-60 overflow-y-auto p-8"
                    id="recapModal"
                    onClick={(e) => {
                        if (e.target === e.currentTarget)
                            setShowRecapModal(false);
                    }}
                >
                    <div className="modal-content bg-[rgb(31,41,55)] text-white p-6 rounded-lg max-w-[90%] max-h-[80vh] mx-auto shadow-lg overflow-y-auto relative">
                        <span
                            className="close absolute top-2 right-4 text-2xl font-bold text-white cursor-pointer hover:text-emerald-500"
                            onClick={() => setShowRecapModal(false)}
                        >
                            &times;
                        </span>
                        <div id="recapContent">{renderRecapContent()}</div>
                    </div>
                </div>
            )}

            {/* Missing resources modal */}
            {showResourcesModal && (
                <div
                    className="modal fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-60 overflow-y-auto p-8"
                    id="resourcesModal"
                    onClick={(e) => {
                        if (e.target === e.currentTarget)
                            setShowResourcesModal(false);
                    }}
                >
                    <div className="modal-content bg-[rgb(31,41,55)] text-white p-6 rounded-lg max-w-[90%] max-h-[80vh] mx-auto shadow-lg overflow-y-auto relative">
                        <span
                            className="close absolute top-2 right-4 text-2xl font-bold text-white cursor-pointer hover:text-emerald-500"
                            onClick={() => setShowResourcesModal(false)}
                        >
                            &times;
                        </span>
                        <div id="resourcesContent">
                            {renderResourcesContent()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MuseumApp;

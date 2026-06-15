/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
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
    List,
    ListTodo,
} from "lucide-react";
import { useProfileStore } from "@store/profileStore";
import ResourcesRecapModal from "./ResourcesRecapModal";
import ItemsRecapModal from "./ItemsRecapModal";
import CraftModal from "./CraftModal";
import i18next from "i18next";
import { MuseumItemList } from "./MuseumItemList";
import MissingItemsRecapContent from "./MissingItemsRecapContent";
import BasicResourcesContent from "./BasicResourcesContent";


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
        name?: string;
        recipe?: any;
    };
}

export const MuseumApp: FC = () => {
    const { t } = useTranslation(["museum", "common"]);
    const { username, setUsername } = useProfileStore();

    // States for storing data from the API and JSON files
    const [groupedItems, setGroupedItems] = useState<Group[] | null>(null);
    const [detailsIndex, setDetailsIndex] = useState<Details | null>(null);
    const [museumItems, setMuseumItems] = useState<string[]>([]);
    // used_in_recipes fetching is disabled to avoid extra API calls
    const [error] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    // State for the missing items filter in the missing items summary
    const [missingSelection, setMissingSelection] = useState<
        Record<string, boolean>
    >({});
    const [selectedItems, setSelectedItems] = useState(true);

    // State for the Category
    /* const [computedCategory, setComputedCategory] = useState<string | null>(null); */

    // State for the grouped Items to find the category of any items
    const [groupedItemsForResearch, setGroupedItemsForResearch] = useState<
        Group[] | null
    >(null);

    // States for controlling the display of the modals
    const [craftModalItem, setCraftModalItem] = useState<string | null>(null);
    const [craftModalCategory, setCraftModalCategory] = useState<string | null>(null);
    const [showRecapModal, setShowRecapModal] = useState(false);
    const [showResourcesModal, setShowResourcesModal] = useState(false);
    const [showBasicSection, setShowBasicSection] = useState(false);
    const [showCraftSection, setShowCraftSection] = useState(false);

    const [showDonated, setShowDonated] = useState(true);

    // States for fetching `used_in_recipes` for the craft modal item
    const [itemUsedInRecipes, setItemUsedInRecipes] = useState<string[] | null>(
        null,
    );
    const [itemUsedLoading, setItemUsedLoading] = useState(false);
    const [itemUsedError, setItemUsedError] = useState<string | null>(null);

    const [missingRarity, setMissingRarity] = useState<Record<string, string>>(
        {}
    );
    useEffect(() => {
        fetch("/assets/data/items-missing-rarity.json")
            .then((res) => res.json())
            .then((data) => setMissingRarity(data || {}))
            .catch((err) => console.error("Error loading JSON:", err));
    }, []);

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

    // Initialization of the filter for missing items, mark it as seleted by default
    useEffect(() => {
        if (groupedItems && museumItems) {
            const newSelection: Record<string, boolean> = {};
            groupedItems.forEach((group) => {
                group.items.forEach((item) => {
                    if (!museumItems.includes(item)) {
                        newSelection[item] = true;
                    }
                });
            });
            setMissingSelection(newSelection);
        }
    }, [groupedItems, museumItems]);

    // Function to toggle the selection of a missing item
    const toggleMissingSelection = (itemId: string) => {
        setMissingSelection((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
    };

    // Button to select/unselect all missing items
    const toggleSelectAllMissing = () => {
        const allSelected = Object.values(missingSelection).every((val) => val);
        const newSelection = Object.keys(missingSelection).reduce(
            (acc, key) => {
                acc[key] = !allSelected;
                return acc;
            },
            {} as Record<string, boolean>
        );
        setMissingSelection(newSelection);
    };

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
                "https://api.minebox.co/museum"
            );
            const itemsGroupedRaw = await itemsGroupedResponse.json();
            const itemsGrouped: Group[] = Object.keys(itemsGroupedRaw).map(
                (category) => ({ category, items: itemsGroupedRaw[category] || [] })
            );

            /* const itemsDetailsResponse = await fetch(
                "https://cdn2.minebox.co/data/items.json"
            ); */
            const itemsDetailsResponse = await fetch("assets/data/items.json");
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

            // Prefer local minebox_items.json for display fields (name, image, rarity)
            try {
                const mb = await import("./itemDataFromApi/minebox_items.json");
                const mineboxItems: Record<string, any> = (mb?.default ?? mb) as any;
                if (mineboxItems && typeof mineboxItems === "object") {
                    Object.keys(mineboxItems).forEach((id) => {
                        details[id] = details[id] || ({ id } as any);
                        const src = mineboxItems[id];
                        if (src) {
                            // name: prefer english when available
                            (details[id] as any).name =
                                src.name?.[i18next.language] ??
                                src.name?.en ??
                                (details[id] as any).name;
                            // image: store raw base64 (rendering code will prefix)
                            if (src.image) (details[id] as any).image = src.image;
                            // rarity
                            if (src.rarity) (details[id] as any).rarity = src.rarity;
                        }
                    });
                }
            } catch (e) {
                // ignore if import fails
                console.warn("Could not load minebox_items.json", e);
            }

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

    // When a craft modal opens, fetch the item's details from the API to get
    // its `used_in_recipes` array (we show the ids in the summary).
    useEffect(() => {
        if (!craftModalItem) {
            setItemUsedInRecipes(null);
            setItemUsedError(null);
            setItemUsedLoading(false);
            return;
        }

        let active = true;
        const controller = new AbortController();

        setItemUsedLoading(true);
        setItemUsedError(null);
        setItemUsedInRecipes(null);

        fetch(
            `https://api.minebox.co/item/${encodeURIComponent(
                craftModalItem,
            )}?locale=${i18next.language}`,
            { signal: controller.signal },
        )
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if (!active) return;
                // API shape varies; try a few common paths
                const used = data?.used_in_recipes ?? data?.item?.used_in_recipes ?? [];
                const ids: string[] = Array.isArray(used)
                    ? used.map((u: any) => u?.id || u?.item?.id).filter(Boolean)
                    : [];
                setItemUsedInRecipes(Array.from(new Set(ids)));
                // Prefer recipe from API when available and merge into detailsIndex
                const apiRecipe = data?.recipe ?? data?.item?.recipe ?? null;
                const apiName = data?.name ?? data?.item?.name ?? null;
                const apiImageRaw = data?.image ?? data?.item?.image ?? null;
                const apiImage = apiImageRaw
                    ? apiImageRaw.startsWith("data:")
                        ? apiImageRaw
                        : `data:image/png;base64,${apiImageRaw}`
                    : null;
                if (apiRecipe || apiName || apiImage) {
                    setDetailsIndex((prev) => {
                        if (!prev) return prev;
                        const copy: any = { ...prev };
                        copy[craftModalItem] = {
                            ...(copy[craftModalItem] || { id: craftModalItem }),
                            ...copy[craftModalItem],
                            // API-provided fields override local when present
                            ...(apiRecipe ? { recipe: apiRecipe } : {}),
                            ...(apiName ? { apiName } : {}),
                            ...(apiImage ? { apiImage } : {}),
                        };
                        return copy;
                    });
                }
            })
            .catch((err: any) => {
                if (!active) return;
                if (err.name === "AbortError") return;
                setItemUsedError(err?.message ?? "Error fetching item data");
            })
            .finally(() => {
                if (active) setItemUsedLoading(false);
            });

        return () => {
            active = false;
            controller.abort();
        };
    }, [craftModalItem]);

    // Function to find the category of any items
    useEffect(() => {
        fetch("https://api.minebox.co/museum")
            .then((res) => res.json())
            .then((raw) => {
                const groups: Group[] = Object.keys(raw).map((category) => ({
                    category,
                    items: raw[category] || [],
                }));
                setGroupedItemsForResearch(groups);
            })
            .catch(() => {
                setGroupedItemsForResearch([]);
            });
    }, []);
    const setCategory = (itemId: string): string => {
        if (groupedItemsForResearch) {
            const found = groupedItemsForResearch.find((group) =>
                group.items.includes(itemId)
            );
            const category = found ? found.category : "";
            return category;
        }
        return "";
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
                <span
                    className={`${
                        totalStats.total < 1 ? "hidden" : ""
                    } flex h-24 w-full md:w-96 bg-gray-800 bg-opacity-50 rounded-md p-4 items-center justify-center gap-6`}
                >
                    <span>
                        <h3 className="text-lg font-bold leading-none">
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
                <ul className="grid grid-cols-2 xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-4 gap-2 p-0 m-0">
                    {groupedItems &&
                        groupedItems
                        .filter((group) => group.category !== "spell")
                        .map((group, i) => {
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
                                        className="block w-full bg-gray-700 text-white p-2 rounded-t transition-colors hover:bg-gray-600 whitespace-nowrap text-center"
                                    >
                                        <span className="flex flex-row items-center gap-2">
                                            <img
                                                src={`assets/media/museum/${group.category.toUpperCase()}/${group.category.toUpperCase()}.png`}
                                                alt={group.category}
                                                className="h-8 w-8 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                                style={{
                                                    imageRendering: "pixelated",
                                                }}
                                            />
                                            <span className="flex flex-col items-start leading-tight">
                                                <span className="font-bold text-sm">
                                                    {t(
                                                        `museum.category.${(group.category).toUpperCase()}`
                                                    )}
                                                </span>
                                                <span className="text-xs opacity-50">
                                                    [{ownedCount} /{" "}
                                                    {group.items.length}]
                                                </span>
                                            </span>
                                        </span>
                                    </a>
                                    {/* Progress bar */}
                                    <div className="w-full bg-gray-600 rounded-b h-1 overflow-hidden">
                                        <div
                                            className="bg-gray-500 h-full transition-all duration-300"
                                            style={{
                                                width: `${
                                                    (ownedCount /
                                                        group.items.length) *
                                                    100
                                                }%`,
                                            }}
                                        ></div>
                                    </div>
                                </li>
                            );
                        })}
                </ul>
            </nav>

            {/* Buttons to display the missing items and resources modals */}
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg recap-buttons-container flex justify-between gap-4 mt-2 flex-col sm:flex-row">
                <span className="flex flex-row gap-2 items-center text-sm font-medium text-gray-200">
                    {t("museum.options")}
                </span>
                <span className="flex gap-2 md:flex-row flex-col">
                    <button
                        id="hideDonated"
                        className="flex font-medium flex-row gap-2 text-sm bg-green-600 text-white rounded-lg py-2 px-4 transition-colors hover:bg-green-700 leading-none  items-center"
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
                        className="flex font-medium flex-row gap-2 text-sm bg-green-600 text-white rounded-lg py-2 px-4 transition-colors hover:bg-green-700 leading-none items-center"
                        onClick={() => setShowRecapModal(true)}
                    >
                        <ListTodo /> {t("museum.recapMuseum.button")}
                    </button>
                    <button
                        id="resourcesButton"
                        className="flex text-sm font-medium flex-row gap-2 bg-green-600 text-white rounded-lg py-2 px-4 transition-colors hover:bg-green-700 leading-none items-center"
                        onClick={() => setShowResourcesModal(true)}
                    >
                        <List /> {t("museum.resourcesMuseum.button")}
                    </button>
                </span>
            </div>

            {/* Display of the items list */}
            <div
                id="itemsContainer"
                className="flex flex-wrap gap-4 justify-start p-4"
            >
                <MuseumItemList
                    groupedItems={groupedItems}
                    detailsIndex={detailsIndex}
                    museumItems={museumItems}
                    showDonated={showDonated}
                    setCraftModalItem={setCraftModalItem}
                    setCraftModalCategory={setCraftModalCategory}
                />
            </div>

            {/* "Back to Top" button */}
            <button
                id="backToTop"
                className="fixed bottom-5 right-5 py-2 px-4 bg-gray-800 text-white rounded-lg text-xs shadow flex flex-col items-center justify-center gap-1 text-center"
            >
                <ArrowUpFromLine className="h-4 w-4 mx-auto" />
                <span>{t("museum.backToTop.button")}</span>
            </button>

            {/* Craft modal with RecipeTree/RecipeNode */}
            <CraftModal
                craftModalItem={craftModalItem}
                craftModalCategory={craftModalCategory}
                detailsIndex={detailsIndex}
                onClose={() => setCraftModalItem(null)}
                setCategory={setCategory}
            />

            {/* Missing items recap modal with MissingItemsRecapContent */}
            <ItemsRecapModal
                show={showRecapModal}
                onClose={() => setShowRecapModal(false)}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                toggleSelectAllMissing={toggleSelectAllMissing}
                renderRecapContent={() =>(
                    <MissingItemsRecapContent
                        groupedItems={groupedItems}
                        detailsIndex={detailsIndex}
                        museumItems={museumItems}
                        missingSelection={missingSelection}
                        toggleMissingSelection={toggleMissingSelection}
                        missingRarity={missingRarity}
                    />
                )}
                translation="museum"
            />

            {/* Resources recap modal with CraftsOnlyContent && BasicResourcesContent */}
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

                        translation="museum"
                    />
                )}

                // handleCopyCSV
                groupedItems={groupedItems}
                detailsIndex={detailsIndex}
                museumItems={museumItems}
                missingSelection={missingSelection}

                translation="museum"
	        />
        </div>
    );
};

export default MuseumApp;
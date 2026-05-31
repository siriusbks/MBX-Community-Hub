/*
 * Copyright (c) 2025 LupusArctos4 SPDX-License-Identifier: MIT
 */

import { FC, useEffect, useState, MouseEvent, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import { useTranslation } from "react-i18next";
import INRItemCard from "./INRItemCard";
import ItemImage from "../ItemImage";
import ItemTranslation from "../ItemTranslation";
import {
    AlertTriangle,
    ArrowUpFromLine,
    Calculator,
    ClipboardCopy,
    Eye,
    EyeOff,
    LoaderCircleIcon,
    Minus,
    Plus,
    SeparatorHorizontal,
    SeparatorVertical,
    X,
} from "lucide-react";
import { getRarityBadge, getRarityColor } from "@utils/equipmentSlots";
import i18next from "i18next";
import {
    getStatLabel,
    getStatColor,
    getStatIconURL,
    getRarityStyle,
} from "@components/stats";

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

export const itemTypes = [
    "BACK",

    "BAG",

    "BASKET_SEEDS",

    "BELT",

    "BLOCK_STICK",

    "BLOWER",

    "BOOTS",

    "BOW",

    "BUCKET",

    "CANDY",

    "CHESTPLATE",

    "CHRISTMAS_PRESENT",

    "CLASS",

    "COMPACTOR",

    "CONSUMABLE",

    "DAGGER",

    "DIVORCE_POTION",

    "EDIBLE",

    "EGG_INCUBATOR",

    "EXPERIENCE_TOME",

    "FISHING_ROD",

    "GHOST_VACUUM",

    "GLOVES",

    "GUN",

    "HAMMER",

    "HARVESTER",

    "HELMET",

    "INFINITE_BAG",

    "INFINITE_BAG_MODULE",

    "INFINITE_CHEST",

    "INGREDIENT",

    "JELLY",

    "JUKEBOX",

    "JUMP_PAD",

    "KIBBLE",

    "LABORER",

    "LEGGINGS",

    "LONG_SWORD",

    "LUNAR_ENVELOPE",

    "MOUNT",

    "MUSIC_DISC",

    "NECKLACE",

    "OWNER_REMOVER",

    "PET",

    "PROFILE_ATTRIBUTE",

    "RING",

    "RUNE",

    "SCROLL",

    "SHIP",

    "SHIP_COMPONENT",

    "SKILL_EXPERIENCE_TOME",

    "SOUL",

    "SPAWNER",

    "SPELL",

    "SPONGE",

    "STAFF",

    "SUBSCRIPTION",

    "SWORD",

    "TELEPORTER",

    "VANILLA_TOOL",

    "VEIN",

    "VILLAGE",

    "WATERING_CAN",
] as const;

// ItemsNRecipesApp: Main component handling the display of items, modals and recipe details.
const ItemsNRecipesApp: FC = () => {
    const { t } = useTranslation(["itemsNrecipes", "items", "museum", "mbx"]);

    // States for storing API and JSON data
    const [groupedItems, setGroupedItems] = useState<Group[] | null>(null);
    const [detailsIndex, setDetailsIndex] = useState<Details | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    // States for controlling modals
    const [craftModalItem, setCraftModalItem] = useState<string | null>(null);
    const [craftModalCategory, setCraftModalCategory] = useState<string | null>(
        null,
    );

    // State of side panel: when an item is clicked we show a right-side panel instead of directly opening modal
    const [panelItem, setPanelItem] = useState<string | null>(null);
    const [panelCategory, setPanelCategory] = useState<string | null>(null);

    // State of info panel: displays full recipe/info in the `#infoPanel` element
    const [infoPanelItem, setInfoPanelItem] = useState<string | null>(null);
    const [infoPanelCategory, setInfoPanelCategory] = useState<string | null>(
        null,
    );

    // State for the grouped Items to find the category of any items
    const [groupedItemsForResearch, setGroupedItemsForResearch] = useState<
        Group[] | null
    >(null);

    // State to filter items by selected category
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    );

    // State of multi-select categories for the "All" view: which categories should be shown
    // State for the Category
    const [computedCategory, setComputedCategory] = useState<string | null>(
        null,
    );

    // Multi-select categories for the "All" view: which categories should be shown
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Initialize selectedCategories to all categories once groupedItems loads
    // LupusArctos : I don’t want this, it takes too long to load the page
    /* useEffect(() => {
        if (groupedItems && selectedCategories.length === 0) {
            setSelectedCategories(groupedItems.map((g) => g.category));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupedItems]); */

    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category],
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
        {},
    );

    // API items pagination (auto-sequential load)
    const [apiItems, setApiItems] = useState<any[]>([]);
    const [apiItemsPage, setApiItemsPage] = useState(1);
    const apiItemsPageSize = 48;
    const [apiItemsTotal, setApiItemsTotal] = useState<number | null>(null);
    const [apiItemsLoading, setApiItemsLoading] = useState(false);
    const [apiItemsError, setApiItemsError] = useState<string | null>(null);
    const apiItemsContainerRef = useRef<HTMLDivElement | null>(null);
    const apiItemsSentinelRef = useRef<HTMLDivElement | null>(null);
    const apiItemsFetchingRef = useRef(false);
    const apiItemsObserverEnabledRef = useRef(true);
    const itemDetailsControllerRef = useRef<AbortController | null>(null);
    const [detailItemId, setDetailItemId] = useState<string | null>(null);
    const [itemDetailsData, setItemDetailsData] = useState<any | null>(null);
    const [itemDetailsLoading, setItemDetailsLoading] = useState(false);
    const [itemDetailsError, setItemDetailsError] = useState<string | null>(
        null,
    );

    // Asynchronous function to load data (API and JSON)
    const loadData = async () => {
        try {
            const itemsGroupedResponse = await fetch(
                "/assets/data/all_items_grouped_by_category.json",
            );
            const itemsGrouped: Group[] = await itemsGroupedResponse.json();

            /* const itemsDetailsResponse = await fetch(
                "https://cdn2.minebox.co/data/items.json"
            ); */
            const itemsDetailsResponse = await fetch("assets/data/items.json");
            const itemsDetails = await itemsDetailsResponse.json();
            const details: Details = {};
            itemsDetails.forEach((item: any) => {
                details[item.id] = item;
            });

            const itemsNoRecipeResponse = await fetch(
                "/assets/data/items-no-in-MBapi.json",
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
                error instanceof Error ? error.message : "Unknown error",
            );
        }
    };

    // Function to find the category of any items
    useEffect(() => {
        fetch("/assets/data/all_items_grouped_by_category.json")
            .then((res) => res.json())
            .then((groups: Group[]) => {
                setGroupedItemsForResearch(groups);
            })
            .catch(() => {
                setGroupedItemsForResearch([]);
            });
    }, []);
    const setCategory = (itemId: string): string => {
        if (groupedItemsForResearch) {
            const found = groupedItemsForResearch.find((group) =>
                group.items.includes(itemId),
            );
            const category = found ? found.category : "";
            return category;
        }
        return "";
    };

    // Recursive function to multiply ingredient amounts by the given multiplier
    const gatherResources = (
        recipe: any,
        detailsIndex: Details,
        multiplier: number = 1,
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
                    currentAmount,
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
        if (
            detailsIndex &&
            detailsIndex[ing.id] &&
            detailsIndex[ing.id].recipe
        ) {
            // Calculate aggregated resources for the sub-recipe
            const subResources = gatherResources(
                detailsIndex[ing.id].recipe,
                detailsIndex,
                multiplier,
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
                        <ItemImage
                            groupCategory={setCategory(ing.id)}
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

    // Effect to fetch missing rarity data from the JSON file on component mount
    useEffect(() => {
        fetch("/assets/data/items-missing-rarity.json")
            .then((res) => res.json())
            .then((data) => setMissingRarity(data || {}))
            .catch((err) => console.error("Error loading JSON:", err));
    }, []);

    // Sequentially load `/items` API pages. After a page finishes loading,
    // automatically request the next page until all items are fetched.
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setApiItemsLoading(true);
            setApiItemsError(null);
            try {
                const baseUrl = `https://api.minebox.co/items?page=${apiItemsPage}&pageSize=${apiItemsPageSize}&locale=${i18next.language}`;
                const url = selectedCategory
                    ? `${baseUrl}&category=${encodeURIComponent(selectedCategory)}`
                    : baseUrl;
                const res = await fetch(url);
                if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
                const json = await res.json();
                const items = Array.isArray(json.items)
                    ? json.items
                    : Array.isArray(json.results)
                      ? json.results
                      : [];
                if (!mounted) return;
                setApiItems((prev) =>
                    apiItemsPage === 1 ? items : [...prev, ...items],
                );
                const total =
                    typeof json.total === "number" ? json.total : null;
                setApiItemsTotal(total);

                if (total !== null) {
                    const fetchedSoFar =
                        (apiItemsPage - 1) * apiItemsPageSize + items.length;
                    // don't auto-increment pages here; rely on user scroll or Load more button
                    // just set the total so the UI/observer can decide if more pages exist
                    // (we intentionally avoid automatic cascading requests)
                }
            } catch (e: any) {
                if (!mounted) return;
                setApiItemsError(e?.message ?? "Failed to load items");
            } finally {
                if (mounted) setApiItemsLoading(false);
                // reset fetching flag so observer can trigger next page
                apiItemsFetchingRef.current = false;
                apiItemsObserverEnabledRef.current = true;
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, [apiItemsPage, selectedCategory]);

    // Observe the sentinel inside the items container and load next page when visible
    useEffect(() => {
        const container = apiItemsContainerRef.current;
        const sentinel = apiItemsSentinelRef.current;
        if (!container || !sentinel) return;

        const obs = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        // only trigger when observer is enabled, not already fetching, and more to load
                        if (
                            apiItemsObserverEnabledRef.current &&
                            !apiItemsFetchingRef.current &&
                            apiItemsTotal !== null &&
                            apiItems.length < apiItemsTotal
                        ) {
                            apiItemsObserverEnabledRef.current = false; // disable until load finishes
                            apiItemsFetchingRef.current = true;
                            setApiItemsPage((p) => p + 1);
                        }
                    }
                }
            },
            {
                root: container,
                rootMargin: "200px",
                threshold: 0.1,
            },
        );

        obs.observe(sentinel);
        return () => obs.disconnect();
        // we intentionally depend on loading/total/items to react to changes
    }, [apiItemsLoading, apiItemsTotal, apiItems.length]);

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

    // Fetch item details for right-side panel
    const fetchItemDetails = async (id: string) => {
        try {
            // abort previous
            if (itemDetailsControllerRef.current) {
                itemDetailsControllerRef.current.abort();
            }
            const controller = new AbortController();
            itemDetailsControllerRef.current = controller;
            setDetailItemId(id);
            setItemDetailsLoading(true);
            setItemDetailsError(null);
            setItemDetailsData(null);

            const res = await fetch(
                `https://api.minebox.co/item/${encodeURIComponent(id)}?locale=${i18next.language}`,
                { signal: controller.signal },
            );
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            const json = await res.json();
            setItemDetailsData(json);
        } catch (e: any) {
            if (e?.name === "AbortError") return;
            setItemDetailsError(e?.message ?? "Failed to load item details");
        } finally {
            setItemDetailsLoading(false);
            itemDetailsControllerRef.current = null;
        }
    };

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

    const openSidePanel = (itemId: string, category: string) => {
        setPanelItem(itemId);
        setPanelCategory(category);
    };

    /* const openInfoPanel = (itemId: string, category: string) => {
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
    }; */

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
                  craftQuantity,
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
                                <ItemImage
                                    groupCategory={setCategory(resId)}
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
                                        "fr-FR",
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
                                category,
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
                        },
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
                    : [],
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
                    <ItemImage
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
            craftQuantity,
        );
        const csvLines = Object.keys(recap).map((itemId) => {
            const quantity = recap[itemId];
            const labelMarkup = ReactDOMServer.renderToStaticMarkup(
                <ItemTranslation
                    mbxId={itemId}
                    category={setCategory(itemId)}
                    type="name"
                />,
            );
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = labelMarkup;
            const labelText = tempDiv.textContent || tempDiv.innerText || "";
            //return `${quantity},${labelText},${itemId}`; // For debugging
            return `${quantity},${labelText}`;
        });
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

            <div className="flex flex-row h-[calc(100vh-340px)] gap-4 ">
                <div className="w-1/6 bg-gray-800 p-4 rounded-lg overflow-y-auto custom-scrollbar">
                    {/* Clear filter button when a category is selected */}
                    {selectedCategory && (
                        <div className="w-full flex">
                            <button
                                className="mb-2 w-full text-sm text-gray-200 bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded transition-colors"
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setApiItemsPage(1);
                                    setApiItems([]);
                                    setApiItemsTotal(null);
                                }}
                            >
                                {t("itemsNrecipes.clearFilter") ||
                                    "Clear filter"}
                            </button>
                        </div>
                    )}

                    <span className="grid grid-cols-1 gap-1">
                        {itemTypes.map((type) => (
                            <div
                                key={type}
                                className={`text-xs cursor-pointer px-2 py-1 rounded transition-colors ${selectedCategory === type ? "text-white bg-gray-700 font-semibold" : "text-gray-300 hover:text-white"}`}
                                onClick={() => {
                                    // single-category filter: set selected category and reset pagination
                                    if (selectedCategory === type) {
                                        // toggle off if clicking the same category
                                        setSelectedCategory(null);
                                        setApiItemsPage(1);
                                        setApiItems([]);
                                        setApiItemsTotal(null);
                                    } else {
                                        setSelectedCategory(type);
                                        setApiItemsPage(1);
                                        setApiItems([]);
                                        setApiItemsTotal(null);
                                    }
                                }}
                            >
                                <img
                                    src={`/assets/media/museum/not-found.png`}
                                    alt={type}
                                    className="inline w-5 h-5 mr-1"
                                />
                                {type}
                            </div>
                        ))}
                    </span>
                </div>

                <div
                    ref={apiItemsContainerRef}
                    className="w-3/6 rounded-lg overflow-y-auto custom-scrollbar p-2 grid grid-cols-3 gap-x-4 gap-y-4 content-start auto-rows-max"
                >
                    {apiItemsError && (
                        <div className="col-span-4 text-red-400 text-sm">
                            {apiItemsError}
                        </div>
                    )}
                    {apiItemsLoading && apiItems.length === 0 && (
                        <div className="col-span-4 text-center text-gray-300">
                            Loading items...
                        </div>
                    )}

                    {apiItems.map((it) => (
                        <div
                            key={it.id ?? `${it}`}
                            className={`relative rounded h-fit w-full text-xs flex flex-row p-2 items-center cursor-pointer ${getRarityStyle(
                                it.rarity ?? "UNKNOWN",
                            )}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                const id = it.id ?? it.name ?? String(it);
                                fetchItemDetails(id);
                            }}
                        >
                            <img
                                src={
                                    it.image
                                        ? `data:image/png;base64,${it.image}`
                                        : "/assets/media/item/placeholder.png"
                                }
                                alt={it.name}
                                className="size-16"
                            />
                            <span className="flex flex-col w-full items-start justify-start ml-2">
                                <span className="flex flex-row gap-1 items-center justify-between w-full mb-1">
                                    <div
                                        className={`text-xs mt-1 rounded px-1 py-0.25 ${getRarityBadge(it.rarity ?? "UNKNOWN")}`}
                                    >
                                        {t(
                                            "rarity." +
                                                (
                                                    it.rarity ??
                                                    detailsIndex?.[
                                                        it.id ?? it.name
                                                    ]?.rarity ??
                                                    "UNKNOWN"
                                                ).toLowerCase(),
                                        ).toUpperCase()}
                                    </div>
                                    <div className="text-xs opacity-70">
                                        Lvl {it.level}
                                    </div>
                                </span>

                                <div className="font-bold text-sm break-words leading-none">
                                    {it.name ?? it.id ?? "-"}
                                </div>
                            </span>
                        </div>
                    ))}

                    {/* sentinel observed to trigger auto-load when visible */}
                    <div ref={apiItemsSentinelRef} className="col-span-3 h-1" />

                    {!apiItemsLoading &&
                        apiItemsTotal !== null &&
                        apiItems.length < apiItemsTotal && (
                            <div className="col-span-3 text-center mt-2">
                                <button
                                    onClick={() => {
                                        if (!apiItemsFetchingRef.current) {
                                            apiItemsFetchingRef.current = true;
                                            apiItemsObserverEnabledRef.current = false;
                                            setApiItemsPage((p) => p + 1);
                                        }
                                    }}
                                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                                >
                                    Load more
                                </button>
                            </div>
                        )}
                </div>

                <div
                    id="itemDetails"
                    className={`w-2/6  rounded-lg  overflow-y-auto custom-scrollbar`}
                >
                    {itemDetailsLoading ? (
                        <div className="w-full flex flex-col items-center justify-center py-8 gap-3 text-center text-gray-400">
                            <LoaderCircleIcon
                                className="mx-auto mb-2 animate-spin"
                                size={24}
                            />
                            <p className="text-lg font-semibold text-gray-200">
                                Loading item details...
                            </p>
                            <p className="text-sm max-w-xs">
                                Data is fetched from the API when you click an
                                item on the left. If it takes too long, it might
                                be due to a slow network or API issues. You can
                                try again by clicking another item or refreshing
                                the page.
                            </p>
                        </div>
                    ) : itemDetailsError ? (
                        <div className="text-red-400">{itemDetailsError}</div>
                    ) : itemDetailsData ? (
                        <div className="flex flex-col gap-2 items-center">
                            {/* BASE SEGMENT */}
                            <div
                                className={`flex w-full  items-center pb-4 ${getRarityStyle(itemDetailsData.rarity ?? "UNKNOWN")} rounded-lg p-2 flex-col`}
                            >
                                <span className="flex flex-row items-center justify-center w-full gap-4 pl-2 pt-2">
                                    <div className="w-1/3 items-center justify-center flex flex-col">
                                        <img
                                            src={
                                                itemDetailsData.image
                                                    ? `data:image/png;base64,${itemDetailsData.image}`
                                                    : "/assets/media/item/placeholder.png"
                                            }
                                            className="aspect-square  border-gray-600"
                                        />
                                    </div>

                                    <span className="flex flex-col items-start justify-start w-full">
                                        <h2
                                            className={`text-xl font-bold text-${itemDetailsData.rarity ?? "UNKNOWN"} mb-1 tracking-extra text-center`}
                                        >
                                            {itemDetailsData.name ??
                                                itemDetailsData.id}
                                        </h2>
                                        <div className="flex gap-2 items-center text-xs text-white ">
                                            <div
                                                className={`px-1 py-0.5 font-bold bg-${itemDetailsData.rarity} rounded`}
                                            >
                                                {t(
                                                    "rarity." +
                                                        (
                                                            itemDetailsData.rarity ??
                                                            "UNKNOWN"
                                                        ).toLowerCase(),
                                                ).toUpperCase()}
                                            </div>
                                            <div>
                                                Lvl{" "}
                                                {itemDetailsData.level ?? "-"}
                                            </div>
                                            {itemDetailsData.mount?.flyable && (
                                                <p className="font-bold text-LEGENDARY">
                                                    FLYABLE
                                                </p>
                                            )}
                                        </div>
                                        {itemDetailsData.lore && (
                                            <div className="text-sm text-gray-300 mt-2 w-full">
                                                <p className="text-gray-300 text-xs">
                                                    {itemDetailsData.lore ||
                                                        "No lore available."}
                                                </p>
                                            </div>
                                        )}
                                    </span>
                                </span>

                                {itemDetailsData.description && (
                                    <div className="text-sm text-gray-300 mt-2 w-full px-2 text-center">
                                        <p className="text-gray-300 text-xs">
                                            {itemDetailsData.description ||
                                                "No description available."}
                                        </p>
                                    </div>
                                )}

                                {itemDetailsData.stats && (
                                    <div className="text-sm text-gray-300 mt-2 w-full px-4">
                                        <p className="font-bold">Stats</p>
                                        <ul className="list-disc list-inside">
                                            {Array.isArray(
                                                itemDetailsData.stats,
                                            )
                                                ? itemDetailsData.stats.map(
                                                      (
                                                          stat: any,
                                                          index: number,
                                                      ) => (
                                                          <p>
                                                              {stat.type}:{" "}
                                                              {stat.value}
                                                          </p>
                                                      ),
                                                  )
                                                : Object.entries(
                                                      itemDetailsData.stats,
                                                  ).map(
                                                      ([statKey, statVal]) => (
                                                          <span
                                                              className="flex flex-row gap-1 justify-between"
                                                              key={statKey}
                                                          >
                                                              <p
                                                                  className={`flex items-center justify-center leading-none font-semibold text-shadow-sm `}
                                                              >
                                                                  <img
                                                                      src={getStatIconURL(
                                                                          statKey,
                                                                      )}
                                                                      alt={
                                                                          statKey
                                                                      }
                                                                      className="inline w-4 h-4 mr-1 drop-shadow-sm"
                                                                  />
                                                                  {getStatLabel(
                                                                      statKey,
                                                                      t,
                                                                  )}
                                                              </p>
                                                              <p>
                                                                  {Array.isArray(
                                                                      statVal,
                                                                  )
                                                                      ? `${statVal[0]} to ${statVal[1]}`
                                                                      : String(
                                                                            statVal,
                                                                        )}
                                                              </p>
                                                          </span>
                                                      ),
                                                  )}
                                        </ul>
                                    </div>
                                )}
                                {itemDetailsData.damages && (
                                    <div className="text-sm text-gray-300 mt-2 w-full px-4">
                                        <p className="font-bold">Damage</p>
                                        <ul className="list-disc list-inside">
                                            {Array.isArray(
                                                itemDetailsData.damages,
                                            )
                                                ? itemDetailsData.damages.map(
                                                      (
                                                          stat: any,
                                                          index: number,
                                                      ) => (
                                                          <p>
                                                              {stat.type}:{" "}
                                                              {stat.value}
                                                          </p>
                                                      ),
                                                  )
                                                : Object.entries(
                                                      itemDetailsData.damages,
                                                  ).map(
                                                      ([statKey, statVal]) => (
                                                          <span
                                                              className="flex flex-row gap-1 justify-between"
                                                              key={statKey}
                                                          >
                                                              <p>{statKey}</p>
                                                              <p>
                                                                  {Array.isArray(
                                                                      statVal,
                                                                  )
                                                                      ? `${statVal[0]} to ${statVal[1]}`
                                                                      : String(
                                                                            statVal,
                                                                        )}
                                                              </p>
                                                          </span>
                                                      ),
                                                  )}
                                        </ul>
                                    </div>
                                )}

                                

                            {itemDetailsData.mount && (
                                <div className="text-sm text-gray-300 mt-2 w-full">
                                    <p className="flex flex-row justify-between px-4">
                                        <p className="font-bold">Movement Speed</p>
                                        <p>{itemDetailsData.mount.speed*100}%</p>
                                    </p>
                                    <p className="flex flex-row justify-between px-4">
                                        <p className="font-bold">Jump Height</p>
                                        <p>{itemDetailsData.mount.jump_height} block's</p>
                                    </p>
                                </div>
                            )}
                            </div>

                            {itemDetailsData.recipe && (
                                <div className="text-sm text-gray-300 mt-2 w-full  ">
                                    <span className="flex justify-between">
                                        <p className="font-bold">Recipe</p>
                                        <p className="">
                                            {itemDetailsData.recipe.job}
                                        </p>
                                    </span>
                                    <div className="grid grid-cols-7 gap-2 mt-2">
                                        {Array.isArray(
                                            itemDetailsData.recipe.ingredients,
                                        ) &&
                                            itemDetailsData.recipe.ingredients.map(
                                                (ing: any) => (
                                                    <div
                                                        key={ing.id}
                                                        className="flex flex-col items-center"
                                                    >
                                                        <img
                                                            src={
                                                                ing?.item?.image
                                                                    ? `data:image/png;base64,${ing.item.image}`
                                                                    : "/assets/media/item/placeholder.png"
                                                            }
                                                            alt={
                                                                ing?.item
                                                                    ?.name ??
                                                                ing.id
                                                            }
                                                            className={`p-1 flex rounded aspect-square ${getRarityStyle(ing.item?.rarity ?? "UNKNOWN")} m-1`}
                                                        />
                                                        <div className="text-xs font-semibold -mt-1">
                                                            x{ing.amount ?? 1}
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                    </div>
                                </div>
                            )}

                            {itemDetailsData.used_in_recipes && (
                                <div className="text-sm text-gray-300 mt-2 w-full  ">
                                    <p className="font-bold">Used in Recipes</p>
                                    <div className="grid grid-cols-7 gap-2 mt-2">
                                        {(Array.isArray(
                                            itemDetailsData.used_in_recipes,
                                        )
                                            ? itemDetailsData.used_in_recipes
                                            : Array.isArray(
                                                    itemDetailsData
                                                        .used_in_recipes
                                                        ?.ingredients,
                                                )
                                              ? itemDetailsData.used_in_recipes
                                                    .ingredients
                                              : []
                                        ).map((ing: any) => (
                                            <div
                                                key={ing.id}
                                                className="relative flex flex-col items-center"
                                                title={`${ing?.item?.name ?? ing.id}${ing?.item?.recipe?.job ? ` — ${ing.item.recipe.job}` : ""}`}
                                            >
                                                <img
                                                    src={
                                                        ing?.item?.image
                                                            ? `data:image/png;base64,${ing.item.image}`
                                                            : "/assets/media/item/placeholder.png"
                                                    }
                                                    alt={
                                                        ing?.item?.name ??
                                                        ing.id
                                                    }
                                                    className={`flex rounded aspect-square  ${getRarityStyle(
                                                        ing.item?.rarity ??
                                                            "UNKNOWN",
                                                    )} p-1`}
                                                />
                                                <div className="text-xs font-semibold">
                                                    x{ing.amount ?? 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {itemDetailsData.dropped_by && (
                                <>
                                    <div className="text-sm text-gray-300 mt-2 w-full  ">
                                        <p className="font-bold">Dropped By</p>
                                        <div className="grid grid-cols-6 gap-2 mt-2">
                                            {(Array.isArray(
                                                itemDetailsData.dropped_by,
                                            )
                                                ? itemDetailsData.dropped_by
                                                : []
                                            ).map((d: any) => (
                                                <div
                                                    key={
                                                        d.creature_id ?? d.name
                                                    }
                                                    className={`relative flex flex-col items-center rounded p-1 aspect-square ${getRarityStyle("UNKNOWN")}`}
                                                    title={
                                                        d.name ?? d.creature_id
                                                    }
                                                >
                                                    <img
                                                        src={
                                                            d.image ??
                                                            "/assets/media/item/placeholder.png"
                                                        }
                                                        alt={
                                                            d.name ??
                                                            d.creature_id
                                                        }
                                                        className="w-12 h-12 object-contain rounded m-1"
                                                    ></img>

                                                    <div className="absolute top-1 left-1 text-xs mt-auto">
                                                        {typeof d.chance ===
                                                        "number"
                                                            ? `${Number(((d.chance || 0) * 100).toFixed(6))}%`
                                                            : String(d.chance)}
                                                    </div>
                                                    <div className="absolute bottom-1 right-2 text-xl font-extrabold mt-auto">
                                                        {d.amount[0] !==
                                                        d.amount[1]
                                                            ? `${d.amount[0]}-${d.amount[1]}`
                                                            : d.amount[0]}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {itemDetailsData.extra_image && (
                            <img
                                src={
                                    itemDetailsData.extra_image
                                        ? `${itemDetailsData.extra_image}`
                                        : "/assets/media/item/placeholder.png"
                                }
                                alt={itemDetailsData.name}
                                className="aspect-square w-1/2"
                            />
                            )}
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center py-8 gap-3 text-center text-gray-400">
                            <p className="text-lg font-semibold text-gray-200">
                                No item selected
                            </p>
                            <p className="text-sm max-w-xs">
                                Click an item on the left to see its details,
                                recipe, drops and where it's used.
                            </p>
                        </div>
                    )}
                </div>
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
                                            <ItemImage
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
                                                        "itemsNrecipes.craftFor",
                                                    )}{" "}
                                                    <ItemTranslation
                                                        mbxId={craftModalItem}
                                                        category={
                                                            craftModalCategory!
                                                        }
                                                        type="name"
                                                    />
                                                </div>
                                                <p className="text-sm opacity-60">
                                                    {t(
                                                        "itemsNrecipes.jobRequired",
                                                    )}{" "}
                                                    <ItemTranslation
                                                        mbxId={
                                                            detailsIndex[
                                                                craftModalItem
                                                            ].recipe.job
                                                        }
                                                        category={"SKILL"}
                                                        type="name"
                                                    />
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
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        className="text-xs flex font-medium flex-row gap-2 bg-gray-500 hover:bg-gray-400 transition text-white p-1.5 rounded-r text-sm"
                                                        onClick={() => {
                                                            const qty =
                                                                parseInt(
                                                                    tempQuantity,
                                                                    10,
                                                                );
                                                            if (
                                                                !isNaN(qty) &&
                                                                qty > 0
                                                            ) {
                                                                setCraftQuantity(
                                                                    qty,
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
                                                                !globalExpanded,
                                                            );
                                                            setGlobalToggleVersion(
                                                                (prev) =>
                                                                    prev + 1,
                                                            );
                                                        }}
                                                    >
                                                        {globalExpanded ? (
                                                            <>
                                                                <Minus className="w-4 h-4" />{" "}
                                                                {t(
                                                                    "itemsNrecipes.collapseAll.button",
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Plus className="w-4 h-4" />{" "}
                                                                {t(
                                                                    "itemsNrecipes.expandAll.button",
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
                                                                (prev) => !prev,
                                                            )
                                                        }
                                                    >
                                                        {showRecap ? (
                                                            <>
                                                                <EyeOff className="w-4 h-4" />{" "}
                                                                {t(
                                                                    "itemsNrecipes.resourcesRequired.button.hide",
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Eye className="w-4 h-4" />{" "}
                                                                {t(
                                                                    "itemsNrecipes.resourcesRequired.button.show",
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
                                                            "itemsNrecipes.copyCSV.button",
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
                                            <ItemImage
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
                                                        "itemsNrecipes.craftFor",
                                                    )}{" "}
                                                    <ItemTranslation
                                                        mbxId={craftModalItem}
                                                        category={
                                                            craftModalCategory
                                                        }
                                                        type="name"
                                                    />
                                                </div>
                                                <p className="text-sm opacity-60">
                                                    {t(
                                                        "itemsNrecipes.recipe.no",
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

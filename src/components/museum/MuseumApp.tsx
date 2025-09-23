/*
 * Copyright (c) 2025 LupusArctos4 SPDX-License-Identifier: MIT
*/

import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User } from "lucide-react";

// Definition of interfaces
interface Group {
    category: string;
    items: string[];
}
interface Details {
    [key: string]: {
        id: string;
        image?: string;
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
            const apiResponse = await fetch(`https://api.minebox.co/data/${pseudo}`);
            if (!apiResponse.ok) {
                // If response is not OK, throw an error with the status and text
                throw new Error(`HTTP ${apiResponse.status}: ${await apiResponse.text()}`);
            }
            const apiData = await apiResponse.json();

            if (!apiData.data || !apiData.data.OBJECTIVES || !apiData.data.OBJECTIVES.museum) {
                throw new Error(`HTTP 401: {"error":"User does not allow API requests"}`);
            }

            let museumItemsFetched: string[] = apiData.data.OBJECTIVES.museum || [];
            museumItemsFetched = museumItemsFetched.map((item) => {
                if (item.startsWith("transformed_material-"))
                    return item.replace("transformed_material-", "transformed_");
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

            const itemsGroupedResponse = await fetch("/assets/data/items_museum_grouped_by_category.json");
            const itemsGrouped: Group[] = await itemsGroupedResponse.json();

            const itemsDetailsResponse = await fetch("https://cdn2.minebox.co/data/items.json");
            const itemsDetails = await itemsDetailsResponse.json();
            const details: Details = {};
            itemsDetails.forEach((item: any) => {
            details[item.id] = item;
            });

            setGroupedItems(itemsGrouped);
            setDetailsIndex(details);

            // Clear any previous error message
            setErrorMsg("");
        } catch (error) {
            // Set the error message in the state: if the error is 401, use the formatted message
            setErrorMsg(error instanceof Error ? error.message : "Unknown error");
        }
    };

    // Recursive function that returns a JSX tree representing a recipe
    const buildRecipeTree = (recipe: any): JSX.Element => {
        return (
            <ul>
                {recipe.ingredients.map((ing: any, i: number) => {
                    const imageSrc =
                        detailsIndex && detailsIndex[ing.id] && detailsIndex[ing.id].image
                            ? "data:image/png;base64," + detailsIndex[ing.id].image
                            : `assets/media/item/textures/${ing.id}.png`;

                    let summary: JSX.Element | null = null;
                    if (detailsIndex && detailsIndex[ing.id] && detailsIndex[ing.id].recipe) {
                        const subResources = gatherResources(detailsIndex[ing.id].recipe);
                        summary = (
                            <span
                                style={{
                                    marginLeft: "5px",
                                    backgroundColor: "rgb(55,65,81)",
                                    padding: "0.5rem",
                                    borderRadius: "0.5rem",
                                }}
                            >
                                {Object.keys(subResources).map((key, index, arr) => {
                                    const globalAmount = subResources[key] * ing.amount;
                                    return (
                                        // Each span represents a resource (with its icon and quantity)
                                        <span key={key} style={{ display: "inline-flex", alignItems: "center", marginRight: "5px" }}>
                                            <img
                                                style={{ width: "20px", height: "20px", marginRight: "2px" }}
                                                src={
                                                    detailsIndex && detailsIndex[key] && detailsIndex[key].image
                                                        ? "data:image/png;base64," + detailsIndex[key].image
                                                        : `assets/media/item/textures/${key}.png`
                                                }
                                                alt={key}
                                                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                                            />
                                            {globalAmount.toLocaleString("fr-FR")}x {key}
                                            {index < arr.length - 1 && ", "}
                                        </span>
                                    );
                                })}
                            </span>
                        );
                    }

                    // Render each ingredient in an <li>
                    return (
                        <li key={i} style={{ marginBottom: "8px" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <img
                                    style={{ width: "35px", height: "35px", marginRight: "5px", verticalAlign: "middle" }}
                                    src={imageSrc}
                                    alt={ing.id}
                                    onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
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
                                detailsIndex[ing.id].recipe.job !== "FARMER" && (
                                    <div style={{ marginLeft: "25px", borderLeft: "2px solid #ddd", paddingLeft: "10px", marginTop: "5px" }}>
                                        {buildRecipeTree(detailsIndex[ing.id].recipe)}
                                    </div>
                                )
                            }
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
                const subResources = gatherResources(detailsIndex[ing.id].recipe);
                for (const resId in subResources) {
                    resources[resId] = (resources[resId] || 0) + subResources[resId] * ing.amount;
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
            const missingItems = group.items.filter(item => !museumItems.includes(item));
            if (missingItems.length === 0) return null;
            return (
                <div key={index} style={{ marginBottom: "15px" }}>
                    {/* Display the category */}
                    <div style={{ fontSize: "20px" }}>{group.category}</div>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {missingItems.map(itemId => {
                            const imageSrc =
                                detailsIndex && detailsIndex[itemId] && detailsIndex[itemId].image
                                    ? "data:image/png;base64," + detailsIndex[itemId].image
                                    : `assets/media/item/textures/${itemId}.png`;
                            return (
                                <li key={itemId} style={{ display: "flex", alignItems: "center" }}>
                                    <img
                                        style={{ width: "30px", height: "30px", marginRight: "5px" }}
                                        src={imageSrc}
                                        alt={itemId}
                                        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
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
        groupedItems.forEach(group => {
            const missingItems = group.items.filter(item => !museumItems.includes(item));
            missingItems.forEach(itemId => {
                if (detailsIndex[itemId] && detailsIndex[itemId].recipe) {
                    const itemResources = gatherResources(detailsIndex[itemId].recipe);
                    for (const resId in itemResources) {
                        totalResources[resId] = (totalResources[resId] || 0) + itemResources[resId];
                    }
                }
            });
        });
        const sortedResourceIds = Object.keys(totalResources).sort();
        if (sortedResourceIds.length === 0) {
            return <p>{t("museum.noResourceRquired")}</p>;
        }
        return (
            <ul style={{ listStyle: "none", padding: 0 }}>
                {sortedResourceIds.map(resId => {
                    const imageSrc =
                        detailsIndex && detailsIndex[resId] && detailsIndex[resId].image
                            ? "data:image/png;base64," + detailsIndex[resId].image
                            : `assets/media/item/textures/${resId}.png`;
                    return (
                        <li key={resId} style={{ display: "block", marginBottom: "10px", fontSize: "20px" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <img
                                    style={{ width: "50px", height: "50px", marginRight: "5px" }}
                                    src={imageSrc}
                                    alt={resId}
                                    onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                                />
                                {resId} : {totalResources[resId].toLocaleString("fr-FR")}
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
            const ownedCount = group.items.filter(item => museumItems.includes(item)).length;
            const categoryId = "cat-" + group.category.toLowerCase().replace(/\s+/g, "-");
            return (
                <div key={index} className="category" id={categoryId}>
                    <div className="titreCategory">
                        {group.category} ({ownedCount} / {group.items.length})
                    </div>
                    <div className="groupItem" style={{ display: "flex", flexWrap: "wrap" }}>
                        {group.items.map(itemId => {
                            const isOwned = museumItems.includes(itemId);
                            const imageSrc =
                                detailsIndex[itemId] && detailsIndex[itemId].image
                                    ? "data:image/png;base64," + detailsIndex[itemId].image
                                    : `assets/media/item/textures/${itemId}.png`;
                            return (
                                <div
                                    key={itemId}
                                    className={`item ${isOwned ? "museum" : ""}`}
                                    style={{ cursor: !isOwned ? "pointer" : "default", margin: "5px" }}
                                    // When clicking on an unowned item, open the corresponding modal
                                    onClick={() => { if (!isOwned) openCraftModal(itemId); }}
                                >
                                    <img
                                        src={imageSrc}
                                        alt={itemId}
                                        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                                    />
                                    <span>{itemId}</span>
                                </div>
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
      <form id="pseudoForm" onSubmit={handleUsernameSubmit}>
        <div>
            <div className="pseudo-box">
                <div className="pseudo-box-left-text">
                <label
                    htmlFor="minecraft-username"
                    className="block text-sm font-medium text-gray-200"
                >
                    {t("museum.minecraftUsername")}
                </label>
                </div>
                <div className="pseudo-input-container relative">
                    <input
                    type="text"
                    id="pseudo"
                    placeholder={t("museum.minecraftUsername")}
                    value={username}
                    minLength={3}
                    maxLength={16}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className={`base-class ${error ? "error" : "success"}`}
                    />
                    <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                        aria-hidden="true"
                    />
                </div>
                <button id="importPseudoButton" type="submit">
                {t("museum.importMuseum.button")}
                </button>
            </div>
            {/* Display error message if exists */}
            {errorMsg && (
                <p style={{ color: "red", textAlign: "center", marginTop: "0.5rem" }}>
                    {errorMsg}
                </p>
            )}
        </div>
      </form>

      {/* Navigation bar displaying item categories */}
      <nav id="categoryNav">
        <ul>
            {groupedItems &&
            groupedItems.map((group, i) => {
                const ownedCount = group.items.filter(item => museumItems.includes(item)).length;
                const categoryId = "cat-" + group.category.toLowerCase().replace(/\s+/g, "-");
                return (
                    <li key={group.category}>
                        <a key={i} href={"#" + categoryId} style={{ marginRight: "10px" }}>
                            {group.category} ({ownedCount} / {group.items.length})
                        </a>
                    </li>
                );
            })}
        </ul>
      </nav>

      {/* Buttons to display the missing items and resources modals */}
      <div className="recap-buttons-container">
        <button id="recapButton" onClick={() => setShowRecapModal(true)}>{t("museum.recapMuseum.button")}</button>
        <button id="resourcesButton" onClick={() => setShowResourcesModal(true)}>{t("museum.resourceMuseum.button")}</button>
      </div>

      {/* Display of the items list */}
      <div id="itemsContainer">{renderItems()}</div>

      {/* "Back to Top" button */}
      <button id="backToTop" style={{ display: "none" }}>
        {t("museum.backToTop.button")}
      </button>

      {/* Craft modal */}
      {craftModalItem && detailsIndex && (
        <div className="modal" id="craftModal"
          onClick={(e) => {if (e.target === e.currentTarget) setCraftModalItem(null);}}>
          <div className="modal-content">
            <span className="close" onClick={() => setCraftModalItem(null)}>&times;</span>
            <div id="craftDetails">
              {detailsIndex[craftModalItem] && detailsIndex[craftModalItem].recipe ? (
                <>
                  <div style={{ fontSize: "20px" }}>{t("museum.craftFor")} {craftModalItem}</div>
                  <p style={{ fontSize: "16px" }}>{t("museum.jobRequired")} {detailsIndex[craftModalItem].recipe.job}</p>
                  {buildRecipeTree(detailsIndex[craftModalItem].recipe)}
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
        <div className="modal" id="recapModal"
          onClick={(e) => {if (e.target === e.currentTarget) setShowRecapModal(false);}}>
          <div className="modal-content">
            <span className="close" onClick={() => setShowRecapModal(false)}>&times;</span>
            <div id="recapContent">{renderRecapContent()}</div>
          </div>
        </div>
      )}

      {/* Missing resources modal */}
      {showResourcesModal && (
        <div className="modal" id="resourcesModal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowResourcesModal(false);}}>
          <div className="modal-content">
            <span className="close" onClick={() => setShowResourcesModal(false)}>&times;</span>
            <div id="resourcesContent">{renderResourcesContent()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MuseumApp;

/*
 * Copyright (c) 2025 LupusArctos4 SPDX-License-Identifier: MIT
*/

import React, { FC, useEffect, useState } from "react"; // Import de React, des hooks et du type FC (Function Component)
import { useTranslation } from "react-i18next"; // Import pour la gestion des traductions
import { User } from "lucide-react"; // Import d'une icône utilisateur depuis lucide-react

// Définition d'interface pour représenter un groupe d'items par catégorie
interface Group {
    category: string;
    items: string[];
}

// Définition d'une interface générique pour stocker les détails d'un item (image, recette, etc.)
interface Details {
    [key: string]: {
        id: string;
        image?: string;
        recipe?: any;
        // ... autres propriétés éventuelles
    };
}

export const MuseumApp: FC = () => {
    // Récupération de la fonction de traduction 't'
    const { t } = useTranslation("museum");

    // États pour stocker les données provenant de l'API et des fichiers JSON
    const [groupedItems, setGroupedItems] = useState<Group[] | null>(null);
    const [detailsIndex, setDetailsIndex] = useState<Details | null>(null);
    const [museumItems, setMuseumItems] = useState<string[]>([]);
    const [username, setUsername] = useState("");
    const [error] = useState<string | null>(null);

    // États pour contrôler l'affichage des modals
    const [craftModalItem, setCraftModalItem] = useState<string | null>(null);
    const [showRecapModal, setShowRecapModal] = useState(false);
    const [showResourcesModal, setShowResourcesModal] = useState(false);

    // Fonction asynchrone pour charger les données (API et JSON)
    const chargerDonnees = async (pseudo: string) => {
        try {
            // Appel à l'API avec le pseudo fourni
            const apiResponse = await fetch(`https://api.minebox.co/data/${pseudo}`);
            const apiData = await apiResponse.json();

            // Récupération des items du musée dans la réponse API
            let museumItemsFetched: string[] = apiData.data.OBJECTIVES.museum || [];
            // Correction des noms d’items (remplacement de prefixes)
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
            // Mise à jour de l'état museumItems avec la liste corrigée
            setMuseumItems(museumItemsFetched);

            // Chargement du fichier JSON avec les items groupés par catégorie
            const itemsGroupedResponse = await fetch("/assets/data/items_museum_grouped_by_category.json");
            const itemsGrouped: Group[] = await itemsGroupedResponse.json();

            // Chargement du fichier JSON avec les détails de chaque item
            const itemsDetailsResponse = await fetch("https://cdn2.minebox.co/data/items.json");
            const itemsDetails = await itemsDetailsResponse.json();
            const details: Details = {};
            itemsDetails.forEach((item: any) => {
            // Stockage de chaque item dans l'objet details avec la clé correspondante
            details[item.id] = item;
            });
            
            // Mise à jour des états pour groupedItems et detailsIndex
            setGroupedItems(itemsGrouped);
            setDetailsIndex(details);
        } catch (error) {
            // Affichage en console de l'erreur de chargement
            console.error("Errer loading data :", error);
        }
    };

    // Fonction récursive qui retourne une arborescence JSX représentant une recette
    const buildRecipeTree = (recipe: any): JSX.Element => {
        return (
            <ul>
            {recipe.ingredients.map((ing: any, i: number) => {
                // Définition de l'URL de l'image de l'ingrédient
                const imageSrc =
                detailsIndex && detailsIndex[ing.id] && detailsIndex[ing.id].image
                    ? "data:image/png;base64," + detailsIndex[ing.id].image
                    : `assets/media/missing-items/${ing.id}.png`;

                // Initialisation de summary qui contiendra un résumé si l'ingrédient possède une sous-recette
                let summary: JSX.Element | null = null;
                if (detailsIndex && detailsIndex[ing.id] && detailsIndex[ing.id].recipe) {
                // Appel de la fonction gatherResources pour obtenir les ressources nécessaires
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
                        // Calcul du montant total nécessaire pour cette ressource
                        const globalAmount = subResources[key] * ing.amount;
                        return (
                        // Chaque span représente une ressource (avec son icône et sa quantité)
                        <span key={key} style={{ display: "inline-flex", alignItems: "center", marginRight: "5px" }}>
                            <img
                            style={{ width: "20px", height: "20px", marginRight: "2px" }}
                            src={
                                detailsIndex && detailsIndex[key] && detailsIndex[key].image
                                ? "data:image/png;base64," + detailsIndex[key].image
                                : `assets/media/missing-items/${key}.png`
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

                // Rendu de chaque ingrédient dans un <li>
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
                    {/* Si l'ingrédient possède une recette et que le job n'est pas "FARMER", on imprime la sous-recette */}
                    {detailsIndex &&
                    detailsIndex[ing.id] &&
                    detailsIndex[ing.id].recipe &&
                    detailsIndex[ing.id].recipe.job !== "FARMER" && (
                        <div style={{ marginLeft: "25px", borderLeft: "2px solid #ddd", paddingLeft: "10px", marginTop: "5px" }}>
                        {buildRecipeTree(detailsIndex[ing.id].recipe)}
                        </div>
                    )}
                </li>
                );
            })}
            </ul>
        );
    };

    // Fonction récursive pour agréger les ressources nécessaires d'une recette donnée
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

    // Fonction qui s'exécute lors du clic sur un item non possédé pour ouvrir la modal de craft
    const openCraftModal = (itemId: string) => {
        console.log("Open modal item : " + itemId); // Log dans la console pour vérifier l'ouverture du modal
        setCraftModalItem(itemId); // Mise à jour de l'état pour afficher le modal correspondant
    };

    // Fonction qui retourne le contenu du récapitulatif des items manquants
    const renderRecapContent = () => {
        if (!groupedItems || !detailsIndex || !museumItems) {
            return <p>{t("museum.noDataLoaded")}</p>;
        }
        return groupedItems.map((group, index) => {
            // Filtre pour obtenir les items manquants
            const missingItems = group.items.filter(item => !museumItems.includes(item));
            if (missingItems.length === 0) return null;
            return (
            <div key={index} style={{ marginBottom: "15px" }}>
                {/* Affichage de la catégorie avec une taille de police de 20px */}
                <div style={{ fontSize: "20px" }}>{group.category}</div>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {missingItems.map(itemId => {
                    const imageSrc =
                    detailsIndex[itemId] && detailsIndex[itemId].image
                        ? "data:image/png;base64," + detailsIndex[itemId].image
                        : `assets/media/missing-items/${itemId}.png`;
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

    // Fonction qui retourne le contenu des ressources manquantes
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
                    : `assets/media/missing-items/${resId}.png`;
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

    // Fonction qui retourne l'affichage de la grille d'items et de la barre de navigation par catégorie
    const renderItems = () => {
        if (!groupedItems || !detailsIndex) return null;
        return groupedItems.map((group, index) => {
            // Calcul du nombre d'items possédés dans la catégorie
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
                        : `assets/media/missing-items/${itemId}.png`;
                    return (
                    <div
                        key={itemId}
                        className={`item ${isOwned ? "museum" : ""}`}
                        style={{ cursor: !isOwned ? "pointer" : "default", margin: "5px" }}
                        // Dès qu'on clique sur un item non possédé, on ouvre la modal correspondante
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

    // Hook useEffect pour gérer le bouton "Remonter en haut" via l'écoute du scroll
    useEffect(() => {
        // Récupération de l'élément bouton par son id
        const backToTopBtn = document.getElementById("backToTop");
        // Fonction qui affiche ou masque le bouton en fonction du défilement
        const handleScroll = () => {
            if (backToTopBtn) {
                if (window.pageYOffset > 300) {
                    backToTopBtn.style.display = "block";
                } else {
                    backToTopBtn.style.display = "none";
                }
            }
        };

        // Fonction qui remonte la page en douceur
        const handleBackToTop = () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        // Ajout des écouteurs sur l'événement scroll et sur le clic du bouton
        window.addEventListener("scroll", handleScroll);
        backToTopBtn?.addEventListener("click", handleBackToTop);

        // Cleanup: suppression des écouteurs lors du démontage du composant
        return () => {
            window.removeEventListener("scroll", handleScroll);
            backToTopBtn?.removeEventListener("click", handleBackToTop);
        };
    }, []);

    // Gestion du formulaire pour saisir le pseudo (username)
    const handleUsernameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Affichage du pseudo dans la console pour vérification
        console.log("Username :", username);
        if (username.length >= 3) {
            chargerDonnees(username); // Appel à la fonction pour charger les données
        }
    }

  return (
    <div className="museum-page">
      {/* Formulaire pour saisir le pseudo */}
      <form id="pseudoForm" onSubmit={handleUsernameSubmit}>
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
      </form>

      {/* Barre de navigation affichant les catégories d'items */}
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

      {/* Boutons pour afficher les modals du récapitulatif et des ressources */}
      <div className="recap-buttons-container">
        <button id="recapButton" onClick={() => setShowRecapModal(true)}>{t("museum.recapMuseum.button")}</button>
        <button id="resourcesButton" onClick={() => setShowResourcesModal(true)}>{t("museum.resourceMuseum.button")}</button>
      </div>

      {/* Affichage de la liste des items */}
      <div id="itemsContainer">{renderItems()}</div>

      {/* Bouton "Remonter en haut" */}
      <button id="backToTop" style={{ display: "none" }}>
        {t("museum.backToTop.button")}
      </button>

      {/* Modal de craft : s'affiche si un item est sélectionné et que les détails sont chargés */}
      {craftModalItem && detailsIndex && (
        <div className="modal" id="craftModal"
          onClick={(e) => {if (e.target === e.currentTarget) setCraftModalItem(null);}}>
          <div className="modal-content">
            <span className="close" onClick={() => setCraftModalItem(null)}>&times;</span>
            <div id="craftDetails">
              {detailsIndex[craftModalItem] && detailsIndex[craftModalItem].recipe ? (
                <>
                  {/* Titre de la modal avec taille de police 20px */}
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

      {/* Modal du récapitulatif des items manquants */}
      {showRecapModal && (
        <div className="modal" id="recapModal"
          onClick={(e) => {if (e.target === e.currentTarget) setShowRecapModal(false);}}>
          <div className="modal-content">
            <span className="close" onClick={() => setShowRecapModal(false)}>&times;</span>
            <div id="recapContent">{renderRecapContent()}</div>
          </div>
        </div>
      )}

      {/* Modal des ressources manquantes */}
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

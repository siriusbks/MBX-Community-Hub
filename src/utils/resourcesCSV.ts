// src/utils/resourcesCSV.ts
import React from "react";
import ReactDOMServer from "react-dom/server";
import ItemTranslation from "../components/ItemTranslation";

// Types minimaux (compatibles avec ton MuseumApp)
export type Group = { category: string; items: string[] };
export type DetailsIndex = Record<string, { recipe?: any }>;

/**
 * Construit le CSV (une ligne par ressource) au format: "quantité,label"
 * - Utilise ItemTranslation pour produire le label traduit en texte.
 * - Nécessite un environnement browser (document) à cause de l'extraction de texte.
 */
export function buildResourcesCsvText(params: {
  groupedItems: Group[];
  detailsIndex: DetailsIndex;
  museumItems: string[];
  missingSelection: Record<string, boolean>;

  showBasicSection: boolean;
  showCraftSection: boolean;

  gatherCraftsOnly: (recipe: any, detailsIndex: DetailsIndex) => Record<string, number>;
  gatherResources: (recipe: any, detailsIndex: DetailsIndex) => Record<string, number>;

  setCategory: (id: string) => string;
  localeForNumber?: string; // optionnel si tu veux toLocaleString plus tard
}): string {
  const {
    groupedItems,
    detailsIndex,
    museumItems,
    missingSelection,
    showBasicSection,
    showCraftSection,
    gatherCraftsOnly,
    gatherResources,
    setCategory,
  } = params;

  const totalResources: Record<string, number> = {};

  for (const group of groupedItems) {
    const missingItems = group.items.filter(
      (item) => !museumItems.includes(item) && missingSelection[item],
    );

    for (const itemId of missingItems) {
      const recipe = detailsIndex[itemId]?.recipe;
      if (!recipe) continue;

      const resourcesForThisItem: Record<string, number> = {};

      if (showCraftSection) {
        const craftResources = gatherCraftsOnly(recipe, detailsIndex);
        for (const [resId, qty] of Object.entries(craftResources)) {
          resourcesForThisItem[resId] = (resourcesForThisItem[resId] || 0) + qty;
        }
      }

      if (showBasicSection) {
        const basicResources = gatherResources(recipe, detailsIndex);
        for (const [resId, qty] of Object.entries(basicResources)) {
          resourcesForThisItem[resId] = (resourcesForThisItem[resId] || 0) + qty;
        }
      }

      for (const [resId, qty] of Object.entries(resourcesForThisItem)) {
        totalResources[resId] = (totalResources[resId] || 0) + qty;
      }
    }
  }

  const sortedResourceIds = Object.keys(totalResources).sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" }),
  );

  const csvLines = sortedResourceIds.map((resId) => {
    const quantity = totalResources[resId];

    // Rend ItemTranslation en HTML statique puis extrait le texte
    const labelMarkup = ReactDOMServer.renderToStaticMarkup(
      <ItemTranslation mbxId={resId} category={setCategory(resId)} type="name" />
    );
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = labelMarkup;
    const labelText = tempDiv.textContent || tempDiv.innerText || "";

    // NOTE: Si labelText peut contenir des virgules/guillemets, on peut échapper CSV
    return `${quantity},${labelText}`;
  });

  return csvLines.join("\n");
}

/**
 * Construit le CSV puis le copie dans le presse-papier.
 */
export async function copyResourcesCsvToClipboard(params: Parameters<typeof buildResourcesCsvText>[0]) {
  const csvText = buildResourcesCsvText(params);
  await navigator.clipboard.writeText(csvText);
  return csvText;
}
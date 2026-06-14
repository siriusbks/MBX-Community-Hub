// src/components/museum/RecipeNode.tsx
import React, { FC, useState } from "react";
import { Minus, Plus } from "lucide-react";
import MuseumItemImage from "./MuseumItemImage";
import ItemTranslation from "../ItemTranslation";

type RecipeNodeProps = {
  ing: any;
  detailsIndex: any;

  // Dépendances extraites du MuseumApp
  gatherResources: (recipe: any, detailsIndex: any) => Record<string, number>;
  setCategory: (id: string) => string;
  NO_DECOMPOSE_PREFIXES: string[];

  // Pour la récursivité (le parent fournit RecipeTree)
  RecipeTree: FC<{ recipe: any; detailsIndex: any }>;
};

export const RecipeNode: FC<RecipeNodeProps> = ({
  ing,
  detailsIndex,
  gatherResources,
  setCategory,
  NO_DECOMPOSE_PREFIXES,
  RecipeTree,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasSubRecipe =
    detailsIndex &&
    detailsIndex[ing.id] &&
    detailsIndex[ing.id].recipe &&
    !NO_DECOMPOSE_PREFIXES.some((p) => ing.id.startsWith(p));

  let summary: JSX.Element | null = null;

  if (detailsIndex && detailsIndex[ing.id] && detailsIndex[ing.id].recipe) {
    const subResources = gatherResources(detailsIndex[ing.id].recipe, detailsIndex);
    summary = (
      <span className="max-w-[80%] ml-auto bg-gray-500 bg-opacity-20 border-2 border-gray-500 border-opacity-30 rounded p-0.5 px-2">
        {Object.keys(subResources).map((key, index, arr) => {
          const globalAmount = subResources[key] * ing.amount;
          return (
            <span
              key={key}
              className="inline-flex items-center mr-1 text-xs align-baseline"
            >
              <span>{globalAmount.toLocaleString("fr-FR")}</span>x
              <MuseumItemImage
                groupCategory={setCategory(key)}
                itemId={key}
                detailsIndex={detailsIndex}
                className="h-4 w-4 ml-0.5"
                style={{ imageRendering: "pixelated" }}
              />
              <span className="ml-0.5">{index < arr.length - 1 && " "}</span>
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
            groupCategory={setCategory(ing.id)}
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
              {hasSubRecipe && (
                <button className="mr-0.5 text-xs text-gray-300 hover:text-white focus:outline-none">
                  {isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button>
              )}
              {ing.amount}x{" "}
              <ItemTranslation mbxId={ing.id} category={setCategory(ing.id)!} type="name" />
            </span>

            {detailsIndex &&
              detailsIndex[ing.id] &&
              detailsIndex[ing.id].recipe &&
              detailsIndex[ing.id].recipe.job && (
                <span className="text-xs font-normal text-green-500">
                  <ItemTranslation
                    mbxId={detailsIndex[ing.id].recipe.job}
                    category={"SKILL"}
                    type="name"
                  />
                </span>
              )}
          </span>
        </div>
        {summary}
      </div>

      {hasSubRecipe && isExpanded && (
        <div style={{ marginLeft: "25px", paddingLeft: "10px", marginTop: "5px" }}>
          <RecipeTree recipe={detailsIndex[ing.id].recipe} detailsIndex={detailsIndex} />
        </div>
      )}
    </li>
  );
};

export default RecipeNode;
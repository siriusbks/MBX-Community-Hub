/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

import MuseumItemImage from "./MuseumItemImage";
import ItemTranslation from "../ItemTranslation";
import RecipeTree from "./RecipeTree";

type DetailsIndex = Record<
    string,
    {
        recipe?: any;
        apiImage?: string;
        apiName?: string;
    }
>;

type CraftModalProps = {
    craftModalItem: string | null;
    craftModalCategory: string | null;
    detailsIndex: DetailsIndex | null;

    onClose: () => void;

    // Need for RecipeTree/RecipeNode
    setCategory: (id: string) => string;
};

/*
 * Craft Modal with RecipeTree/RecipeNode
*/
export const CraftModal: React.FC<CraftModalProps> = ({
    craftModalItem,
    craftModalCategory,
    detailsIndex,
    onClose,
    setCategory,
}) => {
    const { t } = useTranslation(["museum", "common"]);

    if (!craftModalItem || !detailsIndex) return null;

    const itemDetails = detailsIndex[craftModalItem];
    const hasRecipe = !!itemDetails && !!itemDetails.recipe;

    // Function that returns the content of link of the wiki
    const moreInformation = () => {
      if (!craftModalItem || !craftModalCategory) return null;
      const url = `${
            window.location.origin
        }/itemsNrecipes?category=${encodeURIComponent(
            craftModalCategory
        ).toUpperCase()}&item=${encodeURIComponent(craftModalItem)}`;
        return (
            <a
                key={craftModalItem}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-400 h-8 w-8 flex items-center justify-center rounded bg-opacity-20"
            >
                ?
            </a>
      );
    };

    return (
        <div
          className="modal backdrop-blur-sm fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-60 overflow-y-auto p-[2.49%]"
          id="craftModal"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
            <div className="modal-content flex flex-col bg-[rgb(31,41,55)] text-white rounded-lg max-w-[90%] max-h-[90vh] mx-auto shadow-2xl relative">
                <div id="craftDetails" className="flex flex-col flex-1 max-h-[90vh]">
                    {hasRecipe ? (
                        <>
                          {/* HEADER WITH RECIPE */}
                          <div className="bg-gray-700 text-white p-4 rounded-t-lg flex flex-row gap-3 items-center shadow-[0_4px_16px_rgba(0,0,0,0.25)] z-10">
                              {itemDetails?.apiImage ? (
                                  <img
                                      src={itemDetails.apiImage}
                                      alt={itemDetails.apiName || craftModalItem}
                                      className="h-16 w-16 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)] rounded"
                                      style={{ imageRendering: "pixelated" }}
                                  />
                              ) : (
                                  <MuseumItemImage
                                      groupCategory={craftModalCategory!}
                                      itemId={craftModalItem}
                                      detailsIndex={detailsIndex as any}
                                      className="h-16 w-16 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                      style={{ imageRendering: "pixelated" }}
                                  />
                              )}

                              <span className="flex flex-col">
                                  <div className="text-2xl font-bold mb-0">
                                      {t("museum.craftFor")}{" "}
                                      {itemDetails?.apiName ? (
                                        <span>{itemDetails.apiName}</span>
                                      ) : (
                                          <ItemTranslation
                                              mbxId={craftModalItem}
                                              category={craftModalCategory!}
                                              type="name"
                                          />
                                      )}
                                  </div>

                                  <p className="text-sm opacity-60">
                                        {t("museum.jobRequired")}{" "}
                                        <ItemTranslation
                                            mbxId={itemDetails.recipe.job}
                                            category={"SKILL"}
                                            type="name"
                                        />
                                  </p>
                              </span>

                              <span className="ml-auto">{moreInformation()}</span>

                              <span
                                  className="close flex items-center justify-center text-2xl font-bold cursor-pointer h-8 w-8 mr-1 rounded transition hover:text-white text-gray-200 hover:bg-gray-600"
                                  onClick={onClose}
                              >
                                  <X strokeWidth={3} className="h-5 w-5" />
                              </span>
                          </div>

                          {/* BODY WITH RECIPE */}
                          <div className="flex-1 overflow-y-auto p-4 pb-3 custom-scrollbar">
                              <RecipeTree
                                  recipe={itemDetails.recipe}
                                  detailsIndex={detailsIndex as any}
                                  setCategory={setCategory}
                              />
                          </div>
                        </>
                    ) : (
                        <>
                          {/* NO RECIPE HEADER */}
                          <div className="bg-gray-700 text-white p-4 rounded-lg flex flex-row gap-3 items-center shadow-[0_4px_16px_rgba(0,0,0,0.25)] z-10">
                              {itemDetails?.apiImage ? (
                                  <img
                                      src={itemDetails.apiImage}
                                      alt={itemDetails.apiName || craftModalItem}
                                      className="h-16 w-16 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)] rounded"
                                      style={{ imageRendering: "pixelated" }}
                                  />
                                ) : (
                                    <MuseumItemImage
                                        groupCategory={craftModalCategory!}
                                        itemId={craftModalItem}
                                        detailsIndex={detailsIndex as any}
                                        className="h-16 w-16 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                                        style={{ imageRendering: "pixelated" }}
                                    />
                                )}

                                <span className="flex flex-col">
                                    <div className="text-2xl font-bold mb-0">
                                        {t("museum.craftFor")}{" "}
                                        {itemDetails?.apiName ? (
                                            <span>{itemDetails.apiName}</span>
                                        ) : (
                                            <ItemTranslation
                                                mbxId={craftModalItem}
                                                category={craftModalCategory!}
                                                type="name"
                                            />
                                        )}
                                    </div>

                                    <p className="text-sm opacity-60">
                                        {t("common:infos.recipeNotFound")}
                                    </p>
                                </span>

                                <span className="ml-auto">{moreInformation()}</span>

                                <span
                                    className="close flex items-center justify-center text-2xl font-bold cursor-pointer h-8 w-8 mr-1 rounded transition hover:text-white text-gray-200 hover:bg-gray-600"
                                    onClick={onClose}
                                >
                                    <X strokeWidth={3} className="h-5 w-5" />
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CraftModal;
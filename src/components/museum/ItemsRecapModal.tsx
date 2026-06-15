/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { ListTodo, Square, SquareAsterisk, X } from "lucide-react";

type Translation = "museum" | "craftPlanner";

type ItemsRecapModalProps = {
    show: boolean;
    onClose: () => void;

    selectedItems: boolean;
    setSelectedItems: React.Dispatch<React.SetStateAction<boolean>>;
    toggleSelectAllMissing: () => void;

    renderRecapContent: () => React.ReactNode;

    translation: Translation;
};

const getItemsRecapTranslationKeys = (translation: Translation) => {
    if (translation === "craftPlanner") {
        return {
            title: "craftPlanner:craftPlanner.selectItems.title",
            description: "craftPlanner:craftPlanner.selectItems.description",
        };
    }

    return {
        title: "museum.recapMuseum.title",
        description: "museum.recapMuseum.description",
    };
};

/*
 * Missing items recap modal with MissingItemsRecapContent
*/
export const ItemsRecapModal: React.FC<ItemsRecapModalProps> = (props) => {
    const { t } = useTranslation(["museum", "craftPlanner", "common"]);

    const {
        show,
        onClose,
        selectedItems,
        setSelectedItems,
        toggleSelectAllMissing,
        renderRecapContent,
        translation,
    } = props;

    const translationKeys = getItemsRecapTranslationKeys(translation);

    if (!show) return null;

    return (
        <div
            className="modal backdrop-blur-sm fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-60 overflow-y-auto p-[2.49%]"
            id="recapModal"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
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
                            {t(translationKeys.title)}
                        </div>
                        <div className="text-sm font-normal opacity-60">
                            {t(translationKeys.description)}
                        </div>
                    </span>

                    <div className="ml-auto flex items-center">
                        <button
                            id="selectedItems"
                            className="flex font-medium flex-row gap-2 bg-gray-600 hover:bg-gray-500 transition text-white py-1.5 px-2 rounded text-sm"
                            onClick={() => {
                                setSelectedItems(!selectedItems);
                                toggleSelectAllMissing();
                            }}
                        >
                            {selectedItems ? (
                              <>
                                  <SquareAsterisk className="w-5 h-5" />{" "}
                                  {t("museum.filterRecapItems.selectAll")}
                              </>
                            ) : (
                              <>
                                  <Square className="w-5 h-5" />{" "}
                                  {t("museum.filterRecapItems.unselectAll")}
                              </>
                            )}
                        </button>
                    </div>

                    <span
                        className="ml-1 close flex items-center justify-center text-2xl font-bold cursor-pointer h-8 w-8 mr-1 rounded transition hover:text-white text-gray-200 hover:bg-gray-600"
                        onClick={onClose}
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
    );
};

export default ItemsRecapModal;
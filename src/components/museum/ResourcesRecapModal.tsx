// src/components/museum/ResourcesRecapModal.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { ClipboardCopy, List, Square, SquareAsterisk, X } from "lucide-react";

type ResourcesRecapModalProps = {
  show: boolean;
  onClose: () => void;

  showCraftSection: boolean;
  setShowCraftSection: React.Dispatch<React.SetStateAction<boolean>>;

  showBasicSection: boolean;
  setShowBasicSection: React.Dispatch<React.SetStateAction<boolean>>;

  handleCopyCSV: () => void;

  renderCraftsOnlyContent: () => React.ReactNode;
  renderBasicResourcesContent: () => React.ReactNode;
};

export const ResourcesRecapModal: React.FC<ResourcesRecapModalProps> = ({
  show,
  onClose,
  showCraftSection,
  setShowCraftSection,
  showBasicSection,
  setShowBasicSection,
  handleCopyCSV,
  renderCraftsOnlyContent,
  renderBasicResourcesContent,
}) => {
  const { t } = useTranslation(["museum", "common"]);

  if (!show) return null;

  return (
    <div
      className="modal  backdrop-blur-sm fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-60 overflow-y-auto p-[2.49%]"
      id="resourcesModal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content flex flex-col bg-[rgb(31,41,55)] text-white rounded-lg max-w-[90%] max-h-[90vh] mx-auto shadow-2xl relative">
        {/* HEADER */}
        <div className="bg-gray-700 text-white p-4 rounded-t-lg flex flex-row gap-3 items-center align-middle shadow-[0_4px_16px_rgba(0,0,0,0.25)] relative z-10">
          <List
            strokeWidth={2.4}
            className="text-green-400 h-12 w-12 p-2 bg-green-500 rounded bg-opacity-10"
          />
          <span className="flex flex-col">
            <div className="text-2xl font-bold">
              {t("museum.resourcesMuseum.title")}
            </div>
            <div className="text-sm font-normal opacity-60">
              {t("museum.resourcesMuseum.description")}
            </div>
          </span>

          {/* TOGGLES */}
          <div className="ml-auto flex items-center">
            <button
              className="flex font-medium flex-row gap-2 bg-gray-600 hover:bg-gray-500 transition text-white py-1.5 px-2 rounded text-sm"
              onClick={() => setShowCraftSection(!showCraftSection)}
            >
              {showCraftSection ? (
                <SquareAsterisk className="w-5 h-5" />
              ) : (
                <Square className="w-5 h-5" />
              )}
              {t("museum.craftingResourcesMuseum.title")}
            </button>

            <button
              className="ml-4 flex font-medium flex-row gap-2 bg-gray-600 hover:bg-gray-500 transition text-white py-1.5 px-2 rounded text-sm"
              onClick={() => setShowBasicSection(!showBasicSection)}
            >
              {showBasicSection ? (
                <SquareAsterisk className="w-5 h-5" />
              ) : (
                <Square className="w-5 h-5" />
              )}
              {t("museum.basicResourcesMuseum.title")}
            </button>
          </div>

          {/* CSV copy button */}
          <button
            className="ml-1 flex font-medium flex-row gap-2 bg-gray-600 hover:bg-gray-500 transition text-white py-1.5 px-2 rounded text-sm"
            onClick={handleCopyCSV}
          >
            <ClipboardCopy className="w-5 h-5" />{" "}
            {t("museum.copyCSV.button")}
          </button>

          <span
            className="close flex items-center justify-center text-2xl font-bold cursor-pointer h-8 w-8 mr-1 rounded transition hover:text-white text-gray-200 hover:bg-gray-600"
            onClick={onClose}
          >
            <X strokeWidth={3} className="w-5 h-5" />
          </span>
        </div>

        {/* CONTENT */}
        <div
          id="resourcesContent"
          className="flex-1 overflow-y-auto p-4 custom-scrollbar"
        >
          {showCraftSection && (
            <>
              <div className="text-lg font-semibold mb-2">
                {t("museum.craftingResourcesMuseum.title")}
              </div>
              {renderCraftsOnlyContent()}
            </>
          )}

          {showBasicSection && (
            <>
              <div className="text-lg font-semibold mt-4 mb-2">
                {t("museum.resourcesMuseum.title")}
              </div>
              {renderBasicResourcesContent()}
            </>
          )}

          {!showCraftSection && !showBasicSection && (
            <div className="text-center opacity-50">
              {t("museum.resourcesMuseum.noSectionSelected")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcesRecapModal;
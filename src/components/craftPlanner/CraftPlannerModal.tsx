import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import CraftPlannerContent from "./CraftPlannerContent";
import { useTranslation } from "react-i18next";

type CraftPlannerModalProps = {
    open: boolean;
    onClose: () => void;
    preselectedItems?: string[];
    locale?: "en" | "fr" | "pl";
    classImages?: Record<string, string>;
};

const CraftPlannerModal: React.FC<CraftPlannerModalProps> = ({
    open,
    onClose,
    preselectedItems = [],
    locale = "en",
    classImages = {},
}) => {
    const { t } = useTranslation("craftPlanner");
    const [itemIds, setItemIds] = useState<string[]>(preselectedItems);

    useEffect(() => {
        if (open) queueMicrotask(() => setItemIds(preselectedItems));
    }, [open]);

    if (!open) return null;

    const onRemoveItem = (id: string) => {
        setItemIds((prev) => prev.filter((itemId) => itemId !== id));
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative h-[calc(100vh-2rem)] w-full max-w-[1800px] rounded-lg bg-gray-900 text-white shadow-2xl border border-gray-700 flex flex-col overflow-hidden">
                <div className="shrink-0 flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-3">
                    <h2 className="text-lg font-bold">{t("craftPlanner.title")}</h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-700"
                        aria-label="Close Craft Planner"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <CraftPlannerContent
                        itemIds={itemIds}
                        onRemoveItem={onRemoveItem}
                        locale={locale}
                        classImages={classImages}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CraftPlannerModal;
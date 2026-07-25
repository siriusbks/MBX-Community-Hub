import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { List, X, ClipboardCopy, Check, Loader2, Square, SquareAsterisk } from "lucide-react";
import { useCraftResources } from "./useCraftResources";
import { copyResourcesAsCSV } from "./copyResourcesAsCSV";
import { getLocalItemName } from "./localCraftItems";
import { ItemImage } from "@const/elements";

type CraftPlannerContentProps = {
    itemIds: string[];
    onRemoveItem: (id: string) => void;
    locale?: "en" | "fr" | "pl";
    classImages?: Record<string, string>;
};

const ResourceList: React.FC<{
    resources: Record<string, number>;
    locale: string;
    emptyKey: string;
    classImages: Record<string, string>;
}> = ({ resources, locale, emptyKey, classImages }) => {
    const { t } = useTranslation("craftPlanner");
    const entries = Object.entries(resources).sort(([, a], [, b]) => b - a);

    if (entries.length === 0) {
        return <p className="text-sm text-gray-400">{t(emptyKey, { defaultValue: "No resources required." })}</p>;
    }

    return (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {entries.map(([id, qty]) => (
                <li key={id} className="flex items-center gap-2 bg-gray-700/60 p-2 rounded-lg text-sm">
                    {id in classImages ? (
                        <img
                            src={classImages[id] || "/media/missingClass.png"}
                            alt=""
                            className="h-6 w-6 shrink-0 [image-rendering:pixelated] rounded"
                        />
                    ) : (
                        <ItemImage 
                            itemId={id} 
                            className="h-6 w-6 shrink-0 rounded" 
                        />
                    )}
                    <span className="truncate flex-1">{getLocalItemName(id, locale)}</span>
                    <span className="shrink-0 text-xs font-bold bg-primary/20 text-primary px-2 py-1 rounded">
                        {qty.toLocaleString()}
                    </span>
                </li>
            ))}
        </ul>
    );
};

const CraftPlannerContent: React.FC<CraftPlannerContentProps> = ({
    itemIds,
    onRemoveItem,
    locale = "en",
    classImages = {},
}) => {
    const { t } = useTranslation("craftPlanner");
    const { basicResources, craftsOnly, loading, error } = useCraftResources(itemIds, locale);

    const [showBasic, setShowBasic] = useState(true);
    const [showCrafts, setShowCrafts] = useState(false);
    const [copied, setCopied] = useState(false);

    const sortedItemIds = useMemo(
        () => [...itemIds].sort((a, b) => getLocalItemName(a, locale).localeCompare(getLocalItemName(b, locale))),
        [itemIds, locale]
    );

    const onCopyCSV = async () => {
        const ok = await copyResourcesAsCSV(basicResources, craftsOnly, showBasic, showCrafts, locale);
        if (ok) {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Selected items */}
            <div className="rounded-lg bg-gray-800/50 p-4">
                <div className="text-lg font-bold mb-3">
                    {itemIds.length} {t("craftPlanner.selectedItems.sentence")}
                </div>

                {sortedItemIds.length === 0 ? (
                    <p className="text-sm text-gray-400">{t("craftPlanner.noItems")}</p>
                ) : (
                   <ul className="flex flex-wrap gap-2">
                        {sortedItemIds.map((id) => (
                            <li
                                key={id}
                                className="flex items-center gap-2 bg-gray-700 rounded-lg pl-2 pr-1 py-1 text-sm"
                            >
                                {id in classImages ? (
                                    <img
                                        src={classImages[id] || "/media/missingClass.png"}
                                        alt=""
                                        className="h-6 w-6 shrink-0 [image-rendering:pixelated] rounded"
                                    />
                                ) : (
                                    <ItemImage 
                                        itemId={id} 
                                        className="h-6 w-6 shrink-0 rounded" 
                                    />
                                )}
                                <span>{getLocalItemName(id, locale)}</span>
                                <button
                                    onClick={() => onRemoveItem(id)}
                                    className="p-1 rounded hover:bg-gray-600"
                                    aria-label="Remove"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Required resources */}
            <div className="rounded-lg bg-gray-800/50 p-4">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <List className="text-primary h-8 w-8 p-1.5 bg-primary/10 rounded shrink-0" />
                    <span className="flex flex-col">
                        <span className="text-lg font-bold">{t("craftPlanner.requiredResources.title")}</span>
                        <span className="text-xs opacity-60">{t("craftPlanner.requiredResources.description")}</span>
                    </span>

                    <div className="ml-auto flex items-center gap-2">
                        <button
                            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 transition text-white py-1.5 px-2 rounded text-sm"
                            onClick={() => setShowCrafts((v) => !v)}
                        >
                            {showCrafts ? <SquareAsterisk className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                            {t("craftPlanner.craftedResources.title", { defaultValue: "Crafted resources" })}
                        </button>

                        <button
                            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 transition text-white py-1.5 px-2 rounded text-sm"
                            onClick={() => setShowBasic((v) => !v)}
                        >
                            {showBasic ? <SquareAsterisk className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                            {t("craftPlanner.basicResources.title", { defaultValue: "Basic resources" })}
                        </button>

                        <button
                            disabled={loading || (!showBasic && !showCrafts)}
                            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition text-white py-1.5 px-2 rounded text-sm"
                            onClick={onCopyCSV}
                        >
                            {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
                            {t("craftPlanner.copyCSV.button", { defaultValue: "Copy CSV" })}
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t("craftPlanner.resolving", { defaultValue: "Loading recipes…" })}
                    </div>
                )}

                {error && <p className="text-sm text-red-300">{error}</p>}

                {!loading && !error && (
                    <div className="space-y-4">
                        {showCrafts && (
                            <div>
                                <div className="text-sm font-semibold mb-2">
                                    {t("craftPlanner.craftedResources.title", { defaultValue: "Crafted resources" })}
                                </div>
                                <ResourceList
                                    resources={craftsOnly}
                                    locale={locale}
                                    emptyKey="craftPlanner.noResourceRquired"
                                    classImages={classImages}
                                />
                            </div>
                        )}

                        {showBasic && (
                            <div>
                                <div className="text-sm font-semibold mb-2">
                                    {t("craftPlanner.basicResources.title", { defaultValue: "Basic resources" })}
                                </div>
                                <ResourceList
                                    resources={basicResources}
                                    locale={locale}
                                    emptyKey="craftPlanner.noResourceRquired"
                                    classImages={classImages}
                                />
                            </div>
                        )}

                        {!showBasic && !showCrafts && (
                            <p className="text-center opacity-50 text-sm py-4">
                                {t("craftPlanner.requiredResources.noSelected")}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CraftPlannerContent;

import React from "react";
import { useTranslation } from "react-i18next";
import INRItemImage from "../ItemImage";
import ItemTranslation from "../ItemTranslation";

interface ItemCardProps {
    itemId: string;
    category?: string;
    rarity: string;
    level: number;
    craftModalOpener?: (itemId: string) => void;
    missingRarity: Record<string, string>;
}

const INRItemCard: React.FC<ItemCardProps> = ({
    itemId,
    category,
    rarity,
    level,
    craftModalOpener,
    missingRarity,
}) => {
    let adjustedRarity = rarity;
    if (
        (adjustedRarity === "UNKNOWN" || adjustedRarity === "COMMON") &&
        missingRarity[itemId]
    ) {
        adjustedRarity = missingRarity[itemId];
    }

    // const { t } = useTranslation(["itemsNrecipes"]);

    const TMPBorderColorClass =
        {
            COMMON: "border-COMMON-BORDER",
            UNCOMMON: "border-UNCOMMON",
            RARE: "border-RARE",
            EPIC: "border-EPIC",
            LEGENDARY: "border-LEGENDARY",
            MYTHIC: "border-MYTHIC",
        }[adjustedRarity] || "border-UNKNOWN";

    const TMPBackgroundColorClass =
        {
            COMMON: "bg-COMMON",
            UNCOMMON: "bg-UNCOMMON",
            RARE: "bg-RARE",
            EPIC: "bg-EPIC",
            LEGENDARY: "bg-LEGENDARY",
            MYTHIC: "bg-MYTHIC",
        }[adjustedRarity] || "bg-UNKNOWN";

    const TMPShadowClass =
        {
            // inner vertical band on the left only — use zero blur/spread so it doesn't bleed top/right/bottom
            COMMON: "shadow-[inset_6px_0_0_theme(colors.COMMON.BORDER)]",
            UNCOMMON: "shadow-[inset_8px_0_0_theme(colors.UNCOMMON.DEFAULT)]",
            RARE: "shadow-[inset_8px_0_0_theme(colors.RARE.DEFAULT)]",
            EPIC: "shadow-[inset_10px_0_0_theme(colors.EPIC.DEFAULT)]",
            LEGENDARY:
                "shadow-[inset_12px_0_0_theme(colors.LEGENDARY.DEFAULT)]",
            MYTHIC: "shadow-[inset_14px_0_0_theme(colors.MYTHIC.DEFAULT)]",
        }[adjustedRarity] ||
        "shadow-[inset_8px_0_0_theme(colors.UNKNOWN.DEFAULT)]";

    return (
        <div
            key={itemId}
            className={`text-regal-blue min-h-16 item relative flex flex-row gap-2 items-center bg-gray-700 border-l-8 ${TMPBorderColorClass} p-2 rounded-lg text-center transition-transform hover:scale-105 m-2 cursor-pointer`}
            onClick={() => {
                if (craftModalOpener) craftModalOpener(itemId);
            }}
        >
            <INRItemImage
                groupCategory={category}
                itemId={itemId}
                detailsIndex={null}
                className="w-12 h-12 mb-1 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
                style={{ imageRendering: "pixelated" }}
                alt={itemId}
            />

            <span className="flex flex-col w-full">
                <span className="font-bold text-left leading-none mt-auto mb-1">
                    <ItemTranslation
                        mbxId={itemId}
                        category={category!}
                        type="name"
                    />
                </span>
                <span className="flex flex-row justify-between align-center justify-center">
                    <RarityBadge
                        rarity={adjustedRarity}
                        color={TMPBackgroundColorClass}
                    />
                    <div className="text-xs text-gray-300 my-auto mr-2">
                        lvl. {level == 0 ? "??" : level}
                    </div>
                </span>
            </span>
        </div>
    );
};

const RarityBadge: React.FC<{ rarity: string; color: string }> = ({
    rarity,
    color,
}) => {
    const { t } = useTranslation(["itemsNrecipes", "common"]);
    return (
        // prevent the badge from stretching horizontally inside the parent flex column
        <span
            className={`mt-auto text-xs py-0.5 px-2 rounded font-bold ${color} self-start`}
        >
            {t(`common:${rarity.toUpperCase()}`)}
        </span>
    );
};

export default INRItemCard;

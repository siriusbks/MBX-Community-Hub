import React from "react";
import { useTranslation } from "react-i18next";
import INRItemImage from "./INRItemImage";

interface ItemCardProps {
  itemId: string;
  category?: string;
  rarity: string;
  craftModalOpener?: (itemId: string) => void;
}

const INRItemCard: React.FC<ItemCardProps> = ({
    itemId,
    category,
    rarity,
    craftModalOpener,
    }) => {
    let adjustedRarity = rarity;

    if (itemId.startsWith("bag_") || itemId.startsWith("scroll_small_")) {
        adjustedRarity = "UNCOMMON";
    } else if (
        itemId.startsWith("candy_enchanted_fly") ||
        itemId.startsWith("candy_enchanted_crafting")
    ) {
        adjustedRarity = "MYTHIC";
    } else if (
        itemId.startsWith("barrel_") ||
        itemId.startsWith("rune_enchanted_") ||
        itemId.startsWith("scroll_enchanted_") ||
        itemId.startsWith("candy_enchanted_")
    ) {
        adjustedRarity = "EPIC";
    } else if (
        itemId.startsWith("enchanted_") ||
        itemId.startsWith("candy_fly") ||
        itemId.startsWith("candy_crafting")
    ) {
        adjustedRarity = "LEGENDARY";
    } else if (
        itemId.startsWith("crate_") ||
        itemId.startsWith("rune_big_") ||
        itemId.startsWith("scroll_big_") ||
        itemId.startsWith("candy_")
    ) {
        adjustedRarity = "RARE";
    }

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
        COMMON: "shadow-[inset_0_0_4px_theme(colors.COMMON.BORDER)]",
        UNCOMMON: "shadow-[inset_0_0_8px_theme(colors.UNCOMMON.DEFAULT)]",
        RARE: "shadow-[inset_0_0_8px_theme(colors.RARE.DEFAULT)]",
        EPIC: "shadow-[inset_0_0_8px_theme(colors.EPIC.DEFAULT)]",
        LEGENDARY: "shadow-[inset_0_0_12px_theme(colors.LEGENDARY.DEFAULT)]",
        MYTHIC: "shadow-[inset_0_0_16px_theme(colors.MYTHIC.DEFAULT)]",
        }[adjustedRarity] || "shadow-[inset_0_0_8px_theme(colors.UNKNOWN.DEFAULT)]";

    return (
        <div
        key={itemId}
        className={`text-regal-blue min-h-40 item relative flex flex-col items-center bg-gray-700 border-4 ${TMPBorderColorClass} p-2 rounded-lg text-center transition-transform hover:scale-105 m-2 cursor-pointer ${TMPShadowClass}`}
        onClick={() => {
            if (craftModalOpener) craftModalOpener(itemId);
        }}
        >
        <INRItemImage
            groupCategory={category}
            itemId={itemId}
            detailsIndex={null}
            className="w-16 h-16 mb-1 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]"
            style={{ imageRendering: "pixelated" }}
            alt={itemId}
        />

        <span className="font-bold leading-none mt-auto">
            {itemId
            .replace(/_/g, " ")
            .split(" ")
            .map(
                (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ")}
        </span>

        <RarityBadge
            rarity={adjustedRarity}
            color={TMPBackgroundColorClass}
        />
        </div>
    );
};

const RarityBadge: React.FC<{ rarity: string; color: string }> = ({
    rarity,
    color,
    }) => {
    const { t } = useTranslation("itemsNrecipes");
    return (
        <span className={`mt-auto text-xs py-0.5 px-2 rounded font-bold ${color}`}>
        {t(`itemsNrecipes.rarity.${rarity.toUpperCase()}`)}
        </span>
    );
};

export default INRItemCard;

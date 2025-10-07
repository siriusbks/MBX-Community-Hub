import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface MuseumCard {
    itemId: string;
    imageSrc: string;
    isOwned: boolean;
    category?: string;
    rarity: string;
    craftModalOpener?: (itemId: string) => void;
}

const MuseumItemCard: React.FC<MuseumCard> = ({
    itemId,
    imageSrc,
    isOwned,
    rarity,
    category,
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
            COMMON: "border-gray-500",
            UNCOMMON: "border-green-500",
            RARE: "border-blue-500",
            EPIC: "border-purple-500",
            LEGENDARY: "border-orange-500",
            MYTHIC: "border-red-500",
        }[adjustedRarity] || "border-pink-500";
    const TMPBackgroundColorClass =
        {
            COMMON: "bg-gray-500",
            UNCOMMON: "bg-green-500",
            RARE: "bg-blue-500",
            EPIC: "bg-purple-500",
            LEGENDARY: "bg-orange-500",
            MYTHIC: "bg-red-500",
        }[adjustedRarity] || "bg-pink-500";
    const TMPShadowClass =
        {
            COMMON: "shadow-[inset_0_0_8px_theme(colors.gray.500)]",
            UNCOMMON: "shadow-[inset_0_0_8px_theme(colors.green.500)]",
            RARE: "shadow-[inset_0_0_8px_theme(colors.blue.500)]",
            EPIC: "shadow-[inset_0_0_8px_theme(colors.purple.500)]",
            LEGENDARY: "shadow-[inset_0_0_8px_theme(colors.orange.500)]",
            MYTHIC: "shadow-[inset_0_0_8px_theme(colors.red.500)]",
        }[adjustedRarity] || "shadow-[inset_0_0_8px_theme(colors.pink.500)]";

    const { t } = useTranslation("museum");

    const [src, setSrc] = useState(
        `/assets/media/museum/${category}/${itemId}.png`
    );

    useEffect(() => {
        const mainSrc = `/assets/media/museum/${category}/${itemId}.png`;

        const testImg = new Image();
        testImg.onload = () => {
            setSrc(mainSrc);
        };
        testImg.onerror = () => {
            if (imageSrc) {
                const backupImg = new Image();
                backupImg.onload = () => setSrc(imageSrc);
                backupImg.onerror = () => {
                    setSrc("/assets/media/museum/not-found.png");
                };
                backupImg.src = imageSrc;
            } else {
                setSrc("/assets/media/museum/not-found.png");
            }
        };
        testImg.src = mainSrc;
    }, [category, itemId, imageSrc]);

    return (
        <div
            key={itemId}
            className={`min-h-40 item relative flex flex-col items-center bg-gray-700 border-4 ${TMPBorderColorClass} p-2 rounded-lg text-center transition-transform hover:scale-105 m-2 ${
                isOwned
                    ? "bg-green-600 bg-opacity-20 border-4 cursor-default !border-green-600 shadow-[inset_0_0_4px_theme(colors.green.600)]"
                    : `cursor-pointer ${TMPShadowClass}`
            }`}
            onClick={() => {
                if (!isOwned && craftModalOpener) craftModalOpener(itemId);
            }}
        >
            <img
                style={{ imageRendering: "pixelated" }}
                className={`${category == "UTILITY_BLOCK" ? "object-scale-down" : ""} w-16 h-16 mb-1 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)] ${
                    isOwned ? "grayscale" : ""
                }`}
                src={src}
                alt={itemId}
            />

            <span
                className={`font-bold leading-none mt-auto ${
                    isOwned ? "opacity-80 text-green-300" : ""
                }`}
            >
                {itemId
                    .replace(/_/g, " ")
                    .split(" ")
                    .map(
                        (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                    )
                    .join(" ")}
            </span>

            {isOwned && (
                <span className="absolute font-bold top-0 right-0 text-xs bg-green-600 py-0.5 px-2 rounded-bl shadow-[0_0_8px_theme(colors.green.600)]">
                    {t(`museum.donated`)}
                </span>
            )}

            {adjustedRarity && (
                <RarityBadge
                    rarity={adjustedRarity}
                    color={TMPBackgroundColorClass}
                />
            )}
        </div>
    );
};

const RarityBadge: React.FC<{ rarity: string; color: string }> = ({
    rarity,
    color,
}) => {
    const { t } = useTranslation("museum");
    return (
        <span
            className={`mt-auto text-xs py-0.5 px-2 rounded font-bold ${color}`}
        >
            {t(`museum.rarity.${rarity.toUpperCase()}`)}
        </span>
    );
};

export default MuseumItemCard;

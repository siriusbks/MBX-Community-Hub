import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface MuseumCard {
    itemId: string;
    imageSrc: string;
    isOwned: boolean;
    category?: string;
    rarity: string;
    unobtainable: string[];
    craftModalOpener?: (itemId: string) => void;
}

const MuseumItemCard: React.FC<MuseumCard> = ({
    itemId,
    imageSrc,
    isOwned,
    rarity,
    category,
    unobtainable,
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
            LEGENDARY:
                "shadow-[inset_0_0_12px_theme(colors.LEGENDARY.DEFAULT)]",
            MYTHIC: "shadow-[inset_0_0_16px_theme(colors.MYTHIC.DEFAULT)]",
        }[adjustedRarity] ||
        "shadow-[inset_0_0_8px_theme(colors.UNKNOWN.DEFAULT)]";

    const { t } = useTranslation(["museum", "items"]);

    const [src, setSrc] = useState(
        `/assets/media/museum/${category}/${itemId}.png`
    );

    const isUnobtainable =
        Array.isArray(unobtainable) && unobtainable.includes(itemId);

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
            className={`text-regal-blue min-h-40 item relative flex flex-col items-center bg-gray-700 border-4 ${TMPBorderColorClass} p-2 rounded-lg text-center transition-transform hover:scale-105 m-2 ${
                isOwned
                    ? "bg-green-600 bg-opacity-20 border-4 cursor-default !border-green-600 shadow-[inset_0_0_4px_theme(colors.green.600)]"
                    : isUnobtainable
                    ? "bg-red-600 bg-opacity-20 border-4 cursor-default !border-red-600 shadow-[inset_0_0_4px_theme(colors.red.600)]"
                    : `cursor-pointer ${TMPShadowClass}`
            }`}
            onClick={() => {
                if (!isOwned && craftModalOpener) craftModalOpener(itemId);
            }}
        >
            <img
                style={{ imageRendering: "pixelated" }}
                className={`w-16 h-16 mb-1  drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)] ${
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
                {t(`item.${itemId}`, {
                    ns: "items",
                    defaultValue: itemId
                    .replace(/_/g, " ")
                    .split(" ")
                    .map(
                        (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                    )
                    .join(" "),
                })}
                {/*{itemId
                    .replace(/_/g, " ")
                    .split(" ")
                    .map(
                        (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                    )
                    .join(" ")}*/}
            </span>

            {isOwned && (
                <span className="absolute font-bold top-0 right-0 text-xs bg-green-600 py-0.5 px-2 rounded-bl shadow-[0_0_8px_theme(colors.green.600)]">
                    {t(`museum.donated`)}
                </span>
            )}

            {isUnobtainable && (
                <span className="absolute font-bold top-0 right-0 text-xs bg-red-600 py-0.5 px-2 rounded-bl shadow-[0_0_8px_theme(colors.red.600)]">
                    {t(`museum.unobtainable`)}
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

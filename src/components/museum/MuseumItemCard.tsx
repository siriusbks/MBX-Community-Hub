import React from "react";
import { useTranslation } from "react-i18next";

interface MuseumCard {
    itemId: string;
    imageSrc: string;
    isOwned: boolean;
    rarity: string;
    craftModalOpener?: (itemId: string) => void;
}

const MuseumItemCard: React.FC<MuseumCard> = ({
    itemId,
    imageSrc,
    isOwned,
    rarity,
    craftModalOpener,
}) => {
    const TMPColorClass =
        {
            COMMON: "gray-500",
            UNCOMMON: "green-500",
            RARE: "blue-500",
            EPIC: "purple-500",
            LEGENDARY: "orange-500",
            MYTHIC: "red-500",
        }[rarity] || "pink-500";
    const TMPShadowClass =
        {
            COMMON: "shadow-[inset_0_0_8px_theme(colors.gray.500)]",
            UNCOMMON: "shadow-[inset_0_0_8px_theme(colors.green.500)]",
            RARE: "shadow-[inset_0_0_8px_theme(colors.blue.500)]",
            EPIC: "shadow-[inset_0_0_8px_theme(colors.purple.500)]",
            LEGENDARY: "shadow-[inset_0_0_8px_theme(colors.orange.500)]",
            MYTHIC: "shadow-[inset_0_0_8px_theme(colors.red.500)]",
        }[rarity] || "shadow-[inset_0_0_8px_theme(colors.pink.500)]";

    const { t } = useTranslation("museum");
    return (
        <div
            key={itemId}
            className={`min-h-40 item relative flex flex-col items-center bg-gray-700 border-4 border-${TMPColorClass} p-2 rounded-lg text-center transition-transform hover:scale-105 m-2 ${
                isOwned
                    ? "bg-green-600 bg-opacity-20 border-4  cursor-default !border-green-600 shadow-[inset_0_0_4px_theme(colors.green.600)]" // jeśli item jest posiadany, box jest przygaszony
                    : `cursor-pointer ${TMPShadowClass}`
            }`}
            // When clicking on an unowned item, open the corresponding modal
            onClick={() => {
                if (!isOwned && craftModalOpener) craftModalOpener(itemId);
            }}
        >
            <img
                className={`w-16 h-16 mb-1 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]  ${
                    isOwned ? "grayscale" : ""
                }`}
                src={imageSrc}
                alt={itemId}
                /* NEW: If the image fails to load, replace it with a "not found" image */
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "assets/media/museum/not-found.png";
                }}
            />
            {/* Temporary convert item ID to a more
                                    readable format */}
            <span
                className={`font-bold leading-none mt-auto ${
                    isOwned ? "opacity-80 text-green-300" : ""
                }`}
            >
                {" "}
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
            {rarity && <RarityBadge rarity={rarity} color={TMPColorClass} />}
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
            className={`mt-auto text-xs  py-0.5 px-2 rounded font-bold bg-${color}
            `}
        >
            {t(`museum.rarity.${rarity.toUpperCase()}`)}
        </span>
    );
};

export default MuseumItemCard;

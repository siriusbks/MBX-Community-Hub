/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from "react";
import { Equipment } from "@t/equip";
import { getRarityColor, getRarityBadge } from "@utils/equipmentSlots";
import { Search, X, Trash2, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const imgFromB64 = (b64: string) =>
    `data:image/png;base64,${b64.replace(/\s/g, "")}`;

const ALL_RARITIES = [
    "COMMON",
    "UNCOMMON",
    "RARE",
    "EPIC",
    "LEGENDARY",
    "MYTHIC",
];

interface Props {
    equipment: Equipment[];
    category: string;
    onSelect: (item: Equipment | null) => void;
    onRemove: () => void;
    onClose: () => void;
    equippedItems: { [key: string]: Equipment | null };
    selectedSlotId: string;
}

export const EquipmentSelector: React.FC<Props> = ({
    equipment,
    category,
    onSelect,
    onRemove,
    onClose,
    equippedItems,
    selectedSlotId,
}) => {
    const [q, setQ] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
    const { t } = useTranslation("equipment");

    const toggleRarity = (rarity: string) => {
        setSelectedRarities((prev) =>
            prev.includes(rarity)
                ? prev.filter((r) => r !== rarity)
                : [...prev, rarity]
        );
    };

    const filtered = equipment.filter(
        (it) =>
            it.category === category &&
            it.name.toLowerCase().includes(q.toLowerCase()) &&
            (selectedRarities.length === 0 ||
                selectedRarities.includes(it.rarity))
    );

    const isRingSlot = selectedSlotId === "ring1" || selectedSlotId === "ring2";
    const otherRingId = selectedSlotId === "ring1" ? "ring2" : "ring1";
    const otherRingItemId = equippedItems[otherRingId]?.id;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden text-white">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold capitalize">
                        {t("equip.selector.title", { category })}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-800 rounded"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search + Filter row */}
                <div className="custom-scrollbar p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        {/* Search input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder={t("equip.selector.search")}
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded focus:ring-2 focus:ring-green-400 focus:border-transparent"
                            />
                        </div>

                        {/* Filter button */}
                        <div className="relative">
                            <button
                                onClick={() => setFilterOpen((o) => !o)}
                                className="flex items-center gap-1 text-sm text-gray-300 hover:text-white px-2 py-2 rounded hover:bg-gray-800"
                            >
                                <span>{t("equip.selector.filterRarity")}</span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${
                                        filterOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {filterOpen && (
                                <div className="absolute right-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg w-44 max-h-48 overflow-y-auto z-20">
                                    {ALL_RARITIES.map((rarity) => (
                                        <label
                                            key={rarity}
                                            className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-700"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedRarities.includes(
                                                    rarity
                                                )}
                                                onChange={() =>
                                                    toggleRarity(rarity)
                                                }
                                                className="mr-2 accent-green-500"
                                            />
                                            {t(`equip.rarity.${rarity}`, {
                                                defaultValue: rarity,
                                            })}
                                        </label>
                                    ))}

                                    {selectedRarities.length > 0 && (
                                        <button
                                            onClick={() =>
                                                setSelectedRarities([])
                                            }
                                            className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700"
                                        >
                                            {t("equip.selector.clearFilters")}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Items list */}
                <div className="p-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filtered.map((item) => {
                            const isEquippedSameRing =
                                isRingSlot &&
                                !!item.id &&
                                !!otherRingItemId &&
                                item.id === otherRingItemId;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (isEquippedSameRing) return;
                                        onSelect(item);
                                    }}
                                    className={`text-left p-4 rounded-lg items-start ${getRarityColor(
                                        item.rarity
                                    )} transition-all ${
                                        isEquippedSameRing
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:scale-[1.01]"
                                    }`}
                                    title={
                                        isEquippedSameRing
                                            ? t(
                                                  "equip.alreadyEquippedOnOtherRing"
                                              )
                                            : ""
                                    }
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            style={{
                                                imageRendering: "pixelated",
                                            }}
                                            src={`/assets/media/museum/${category}/${item.id}.png`}
                                            alt={item.name}
                                            className="w-12 h-12"
                                            onError={(e) => {
                                                const img =
                                                    e.target as HTMLImageElement;

                                                if (!img.dataset.fallback) {
                                                    img.dataset.fallback = "1";

                                                    img.src =
                                                        item.image.startsWith(
                                                            "data:"
                                                        )
                                                            ? item.image
                                                            : imgFromB64(
                                                                  item.image
                                                              );
                                                    return;
                                                }

                                                if (
                                                    img.dataset.fallback === "1"
                                                ) {
                                                    img.dataset.fallback = "2";
                                                    img.src =
                                                        "/assets/media/museum/not-found.png";
                                                    return;
                                                }

                                                console.warn(
                                                    `Image failed to load for item: ${item.name}`
                                                );
                                            }}
                                        />

                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-white truncate">
                                                {item.name}
                                            </h3>{" "}
                                            <span className="flex flex-row gap-1 items-center align-center">
                                                <p
                                                    className={`${getRarityBadge(
                                                        item.rarity
                                                    )} text-xs text-white font-bold capitalize px-1 rounded`}
                                                >
                                                    {t(
                                                        `equip.rarity.${item.rarity}`,
                                                        {
                                                            defaultValue:
                                                                item.rarity,
                                                        }
                                                    )}
                                                </p>

                                                {item.level != null && (
                                                    <p className="text-xs text-gray-400">
                                                        {" | "}Level{" "}
                                                        {item.level}
                                                    </p>
                                                )}
                                            </span>
                                            {isEquippedSameRing && (
                                                <p className="text-[11px] text-yellow-400 mt-1">
                                                    {t(
                                                        "equip.otherRingEquipped"
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {item.stats && (
                                        <div className="mt-3 text-xs text-gray-300">
                                            {Object.entries(item.stats).map(
                                                ([stat, range]) => (
                                                    <div
                                                        key={stat}
                                                        className="flex justify-between"
                                                    >
                                                        {t(
                                                            `equip.stats.names.${stat}`,
                                                            {
                                                                defaultValue:
                                                                    stat,
                                                            }
                                                        )}
                                                        <span>
                                                            {range[0] ===
                                                            range[1]
                                                                ? range[0]
                                                                : `${range[0]} / ${range[1]}`}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
                    <button
                        onClick={onRemove}
                        className="flex items-center gap-2 px-4 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-300 rounded border border-red-700/50"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>{t("equip.buttons.removeEquipped")}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from "react";
import { Equipment } from "@t/equip";
import { getRarityColor } from "@utils/equipmentSlots";
import { Search, X, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const imgFromB64 = (b64: string) =>
    `data:image/png;base64,${b64.replace(/\s/g, "")}`;

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
    const { t } = useTranslation("equipment");

    const filtered = equipment.filter(
        (it) =>
            it.category === category &&
            it.name.toLowerCase().includes(q.toLowerCase())
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

                <div className="p-4 border-b border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={t("equip.selector.search")}
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded focus:ring-2 focus:ring-green-400 focus:border-transparent"
                        />
                    </div>
                </div>

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
                                    className={`text-left p-4 rounded-lg ${getRarityColor(
                                        item.rarity
                                    )} transition-all ${
                                        isEquippedSameRing
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:scale-[1.01]"
                                    }`}
                                    title={
                                        isEquippedSameRing
                                            ? "Already equipped on the other ring"
                                            : ""
                                    }
                                >
                                    <div className="flex items-center gap-3">
                                        {!!item.image && (
                                            <img
                                                src={
                                                    item.image.startsWith(
                                                        "data:"
                                                    )
                                                        ? item.image
                                                        : imgFromB64(item.image)
                                                }
                                                alt={item.name}
                                                className="w-12 h-12 object-contain"
                                                onError={(e) =>
                                                    ((
                                                        e.target as HTMLImageElement
                                                    ).style.display = "none")
                                                }
                                            />
                                        )}
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-white truncate">
                                                {item.name}
                                            </h3>
                                            <p className="text-xs text-gray-300 capitalize">
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
                                                    Level {item.level}
                                                </p>
                                            )}
                                            {isEquippedSameRing && (
                                                <p className="text-[11px] text-yellow-400 mt-1">
                                                    Equipped on other ring
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
                                                        <span>{stat}</span>
                                                        <span>
                                                            {range[0] ===
                                                            range[1]
                                                                ? range[0]
                                                                : `${range[0]}-${range[1]}`}
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

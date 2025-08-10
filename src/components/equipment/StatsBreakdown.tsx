/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from "react";
import { Equipment } from "@t/equip";
import { EQUIPMENT_SLOTS } from "@utils/equipmentSlots";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const statColors: Record<string, string> = {
    HEALTH: "text-red-400",
    AGILITY: "text-green-400",
    STRENGTH: "text-orange-400",
    INTELLIGENCE: "text-blue-400",
    WISDOM: "text-purple-400",
    LUCK: "text-yellow-400",
    POWER: "text-pink-400",
};

interface Props {
    equippedItems: { [key: string]: Equipment | null };
}

export const StatsBreakdown: React.FC<Props> = ({ equippedItems }) => {
    const [open, setOpen] = useState<Record<string, boolean>>({});
    const { t } = useTranslation("equipment");

    return (
        <div className="space-y-3 mt-6">
            <h3 className="text-sm font-semibold text-gray-200">
                {t("equip.stats.breakdownTitle")}
            </h3>

            {EQUIPMENT_SLOTS.map((slot) => {
                const item = equippedItems[slot.id];
                if (!item?.stats) return null;

                const isOpen = !!open[slot.id];

                return (
                    <div
                        key={slot.id}
                        className="border border-gray-700 rounded bg-gray-800"
                    >
                        <button
                            onClick={() =>
                                setOpen((p) => ({
                                    ...p,
                                    [slot.id]: !p[slot.id],
                                }))
                            }
                            className="w-full flex items-center justify-between px-4 py-2 text-left text-sm font-medium text-gray-100 hover:bg-gray-700/60"
                        >
                            <span>
                                {slot.name}
                                {item?.name && ` – ${item.name}`}
                            </span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                    isOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {isOpen && (
                            <ul className="px-5 pb-3 text-sm text-gray-300 space-y-1">
                                {Object.entries(item.stats).map(
                                    ([stat, values]) => (
                                        <li
                                            key={stat}
                                            className="flex justify-between"
                                        >
                                            <span
                                                className={`font-medium ${
                                                    statColors[stat] ||
                                                    "text-gray-600"
                                                }`}
                                            >
                                                {t(
                                                    `equip.stats.names.${stat}`,
                                                    { defaultValue: stat }
                                                )}
                                            </span>
                                            <span>
                                                {values[0] === values[1]
                                                    ? values[0]
                                                    : `${values[0]}–${values[1]}`}
                                            </span>
                                        </li>
                                    )
                                )}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

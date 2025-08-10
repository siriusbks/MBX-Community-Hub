/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { Equipment, PlayerStats } from "@t/equip";
import { StatsBreakdown } from "./StatsBreakdown";
import { formatStatRange } from "@utils/statsCalculator";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
    stats: PlayerStats;
    equippedItems: { [key: string]: Equipment | null };
}

export const StatsPanel: React.FC<Props> = ({ stats, equippedItems }) => {
    const { t } = useTranslation("equipment");

    const color: Record<string, string> = {
        HEALTH: "text-red-400",
        AGILITY: "text-green-400",
        STRENGTH: "text-orange-400",
        INTELLIGENCE: "text-blue-400",
        WISDOM: "text-purple-400",
        LUCK: "text-yellow-400",
        POWER: "text-pink-400",
    };

    const allZero = Object.values(stats).every(([a, b]) => a + b === 0);

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-bold text-white">
                    {t("equip.stats.title")}
                </h2>
            </div>

            {/* Main Stats */}
            {!allZero && (
                <div className="space-y-3">
                    {Object.entries(stats).map(([name, range]) => {
                        if (range[0] + range[1] === 0) return null;
                        return (
                            <div
                                key={name}
                                className="flex items-center justify-between py-1 border-b border-gray-700/60"
                            >
                                <span
                                    className={`font-medium ${
                                        color[name] ?? "text-gray-300"
                                    }`}
                                >
                                    {t(`equip.stats.names.${name}`, {
                                        defaultValue: name,
                                    })}
                                </span>
                                <span className="font-bold text-white">
                                    {formatStatRange(range)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            {allZero && (
                <div className="text-center py-8 text-gray-400">
                    <p>{t("equip.stats.emptyTitle")}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {t("equip.stats.emptySubtitle")}
                    </p>
                </div>
            )}

            <div className="mt-auto max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                <StatsBreakdown equippedItems={equippedItems} />
            </div>
        </div>
    );
};

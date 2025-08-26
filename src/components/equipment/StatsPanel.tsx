/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useMemo } from "react";
import { Equipment, PlayerStats } from "@t/equip";
import { formatStatRange } from "@utils/statsCalculator";
import { TrendingUp, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SKULLS } from "../../constants/skulls";

interface Props {
    stats: PlayerStats;
    equippedItems: { [key: string]: Equipment | null };
    skullIds?: string[];
    skullNames?: string[];
    onOpenSkulls?: () => void;
}

export const StatsPanel: React.FC<Props> = ({
    stats,
    skullIds,
    skullNames = [],
    onOpenSkulls,
}) => {
    const { t: tEquip } = useTranslation("equipment");
    const { t: tSkulls } = useTranslation("skulls", {
        keyPrefix: "skulls.names",
    });

    const color: Record<string, string> = {
        HEALTH: "#e02044",
        AGILITY: "#85c062",
        STRENGTH: "#58350b",
        INTELLIGENCE: "#df3f29",
        WISDOM: "#846cf0",
        LUCK: "#7ccbf9",
        FORTUNE: "#f1903e",
        DEFENSE: "#0045cd",
    };

    const iconMap: Record<string, string> = {
        HEALTH: "/assets/media/elemental/health.png",
        AGILITY: "/assets/media/elemental/agility.png",
        STRENGTH: "/assets/media/elemental/strength.png",
        INTELLIGENCE: "/assets/media/elemental/intelligence.png",
        WISDOM: "/assets/media/elemental/wisdom.png",
        LUCK: "/assets/media/elemental/luck.png",
        FORTUNE: "/assets/media/elemental/fortune.png",
        DEFENSE: "/assets/media/elemental/defense.png",
    };

    const selectedSkullLabels = useMemo(() => {
        if (skullIds?.length) {
            return skullIds.map((id) =>
                tSkulls(id, {
                    defaultValue: SKULLS.find((s) => s.id === id)?.name ?? id,
                })
            );
        }
        if (skullNames.length) {
            return skullNames.map((raw) => {
                const tryAsId = tSkulls(raw, { defaultValue: "" });
                if (tryAsId) return tryAsId;

                const match = SKULLS.find(
                    (s) => s.name.toLowerCase() === raw.toLowerCase()
                );
                return tSkulls(match?.id ?? raw, { defaultValue: raw });
            });
        }
        return [];
    }, [skullIds, skullNames, tSkulls]);

    const allZero = Object.values(stats).every(([a, b]) => a + b === 0);

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <h2 className="text-xs font-bold text-white">
                        {tEquip("equip.stats.title")}
                    </h2>
                </div>

                {onOpenSkulls && (
                    <button
                        onClick={onOpenSkulls}
                        className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs rounded border border-yellow-600/40 bg-yellow-900/30 text-yellow-300 hover:bg-yellow-900/50 transition"
                        title={tEquip("equip.stats.addSkulls", {
                            defaultValue: "Add skull bonuses",
                        })}
                    >
                        <Plus className="w-4 h-4" />
                        {tEquip("equip.buttons.skulls")}
                    </button>
                )}
            </div>

            {selectedSkullLabels.length > 0 && (
                <div className="mb-3 -mt-1">
                    {selectedSkullLabels.map((label) => (
                        <span
                            key={label}
                            className="inline-block text-[10px] mr-2 mb-2 px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-200"
                        >
                            {label}
                        </span>
                    ))}
                </div>
            )}

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
                                    className="flex items-center gap-2 font-medium"
                                    style={{ color: color[name] ?? "#ccc" }}
                                >
                                    {iconMap[name] && (
                                        <img
                                            src={iconMap[name]}
                                            alt={name}
                                            className="w-5 h-5"
                                        />
                                    )}
                                    {tEquip(`equip.stats.names.${name}`, {
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
                    <p>{tEquip("equip.stats.emptyTitle")}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {tEquip("equip.stats.emptySubtitle")}
                    </p>
                </div>
            )}
        </div>
    );
};

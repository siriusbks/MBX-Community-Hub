/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useMemo, useState } from "react";
import { X, Check, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SKULLS } from "../../constants/skulls";

interface Props {
    open: boolean;
    selected: string[];
    onChange: (ids: string[]) => void;
    onClose: () => void;
}

export const SkullSelector: React.FC<Props> = ({
    open,
    selected,
    onChange,
    onClose,
}) => {
    const { t } = useTranslation(["equipment", "skulls"]);
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return SKULLS;

        return SKULLS.filter((k) => {
            const label = t(`skulls.names.${k.id}`, {
                ns: "skulls",
                defaultValue: k.name,
            });
            return (
                label.toLowerCase().includes(s) ||
                k.name.toLowerCase().includes(s)
            );
        });
    }, [q, t]);

    if (!open) return null;

    const toggle = (id: string) => {
        if (selected.includes(id)) onChange(selected.filter((x) => x !== id));
        else onChange([...selected, id]);
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

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-lg overflow-hidden text-white">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="font-semibold">
                        {t("equipment:equip.selector.skulls")}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-800 rounded"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 py-3 border-b border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder={t("equipment:equip.search.skulls")}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-9 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {filtered.map((sk) => {
                        const active = selected.includes(sk.id);
                        const skullLabel = t(`skulls.names.${sk.id}`, {
                            ns: "skulls",
                            defaultValue: sk.name,
                        });

                        return (
                            <button
                                key={sk.id}
                                onClick={() => toggle(sk.id)}
                                className={`w-full text-left bg-gray-800/60 border border-gray-700 hover:border-green-500 rounded p-3 flex items-start justify-between gap-3 transition ${
                                    active ? "ring-1 ring-green-500/60" : ""
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        style={{
                                            imageRendering: "pixelated",
                                        }}
                                        src={sk.icon}
                                        alt={sk.name}
                                        className="w-12 h-12"
                                    />
                                    <span>
                                        <div className="font-bold text-xl">
                                            {skullLabel}
                                        </div>
                                        <div className="text-xs text-gray-300 mb-0.5">
                                            {Object.entries(sk.stats).map(
                                                ([stat, val]) => (
                                                    <span
                                                        key={stat}
                                                        className={`inline-block mr-2  rounded px-1`}
                                                    >
                                                        +{val}{" "}
                                                        <img
                                                            src={iconMap[stat]}
                                                            alt={stat}
                                                            className="inline-block w-3 h-3 mb-[2px] mr-0.5"
                                                        />
                                                        {t(
                                                            `equipment:equip.stats.names.${stat}`,
                                                            {
                                                                defaultValue:
                                                                    stat,
                                                            }
                                                        )}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </span>
                                </div>
                                {active && (
                                    <Check className="w-5 h-5 text-green-400 shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                        {t("equipment:equip.skulls.selected", {
                            count: selected.length,
                        })}
                    </span>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-green-900/40 hover:bg-green-900/60 border border-green-700/50 rounded text-green-200"
                    >
                        {t("equipment:equip.buttons.skulls.close")}
                    </button>
                </div>
            </div>
        </div>
    );
};

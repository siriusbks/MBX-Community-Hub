
/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BoxConfig, MineboxItemDetails } from "@types/boxClicker";
import {
    formatDropRate,
    formatPercent,
    getDroppedAtLeastOnceProbability,
    getNotDroppedProbability,
} from "@utils/boxProbability";


type ProbabilityModalProps = {
    show: boolean;
    onClose: () => void;
    boxConfig: BoxConfig | null;
    itemDetails: Record<string, MineboxItemDetails>;
    defaultOpenings: number;
};

const ProbabilityModal: React.FC<ProbabilityModalProps> = ({
    show,
    onClose,
    boxConfig,
    itemDetails,
    defaultOpenings,
}) => {
	const { t } = useTranslation(["boxClicker"]);
    const [selectedItemId, setSelectedItemId] = useState("");
    const [openings, setOpenings] = useState(Math.max(defaultOpenings, 100));

    const selectedItem = useMemo(() => {
        if (!boxConfig) return null;

        return (
            boxConfig.items.find((item) => item.id === selectedItemId) ||
            boxConfig.items[0] ||
            null
        );
    }, [boxConfig, selectedItemId]);

    const notDroppedProbability = selectedItem
        ? getNotDroppedProbability(selectedItem.dropRate, openings)
        : 0;

    const droppedProbability = selectedItem
        ? getDroppedAtLeastOnceProbability(selectedItem.dropRate, openings)
        : 0;

    const curvePoints = useMemo(() => {
        if (!selectedItem) return "";

        const maxX = Math.max(openings, 1);
        const width = 600;
        const height = 180;

        const points: string[] = [];

        for (let i = 0; i <= 60; i++) {
            const xOpenings = Math.round((i / 60) * maxX);
            const probability = getNotDroppedProbability(
                selectedItem.dropRate,
                xOpenings
            );

            const x = (i / 60) * width;
            const y = height - probability * height;

            points.push(`${x},${y}`);
        }

        return points.join(" ");
    }, [selectedItem, openings]);

    if (!show) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm overflow-y-auto p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative mx-auto w-full max-w-4xl rounded-lg bg-gray-900 text-white shadow-2xl border border-gray-700 flex flex-col">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-3 rounded-t-lg">
                    <h2 className="text-lg font-bold">
                        {t("boxClicker.probability.modalTitle")}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-700"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4 custom-scrollbar overflow-y-auto">
                    {!boxConfig || !selectedItem ? (
                        <div className="text-gray-300">Loading...</div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="block">
                                    <span className="text-sm text-gray-300">
                                        {t("boxClicker.modal.item")}
                                    </span>

                                    <select
                                        className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white"
                                        value={selectedItem.id}
                                        onChange={(e) => setSelectedItemId(e.target.value)}
                                    >
                                        {boxConfig.items.map((item) => {
                                            const details = itemDetails[item.id];

                                            return (
                                                <option key={item.id} value={item.id}>
                                                    {details?.name || item.id} -{" "}
                                                    {formatDropRate(item.dropRate, 2)}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="text-sm text-gray-300">
                                        {t("boxClicker.openings")}
                                    </span>

                                    <input
                                        type="number"
                                        min={0}
                                        className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white"
                                        value={openings}
                                        onChange={(e) =>
                                            setOpenings(
                                                Math.max(0, Number(e.target.value) || 0)
                                            )
                                        }
                                    />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-4">
                                    <div className="text-sm text-gray-400">
                                        {t("boxClicker.drops.modalTitle")}
                                    </div>
                                    <div className="text-xl font-bold text-green-400">
                                        {formatDropRate(selectedItem.dropRate, 2)}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-4">
                                    <div className="text-sm text-gray-400">
                                        {t("boxClicker.probability.chance.no")}
                                    </div>
                                    <div className="text-xl font-bold text-red-400">
                                        {formatPercent(notDroppedProbability, 2)}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-4">
                                    <div className="text-sm text-gray-400">
                                        {t("boxClicker.probability.chance.once")}
                                    </div>
                                    <div className="text-xl font-bold text-green-400">
                                        {formatPercent(droppedProbability, 2)}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-4">
                                <div className="mb-3">
                                    <div className="text-base font-semibold">
                                        {t("boxClicker.probability.graph.title")}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {t("boxClicker.probability.graph.description")}
                                    </div>
                                </div>

                                <div className="w-full overflow-x-auto">
                                    <svg
                                        viewBox="0 0 600 180"
                                        className="w-full min-w-[600px] h-[220px] rounded bg-gray-900 border border-gray-700"
                                    >
                                        <line
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="180"
                                            stroke="#4b5563"
                                        />
                                        <line
                                            x1="0"
                                            y1="180"
                                            x2="600"
                                            y2="180"
                                            stroke="#4b5563"
                                        />

                                        <polyline
                                            fill="none"
                                            stroke="#22c55e"
                                            strokeWidth="3"
                                            points={curvePoints}
                                        />

                                        <text
                                            x="8"
                                            y="16"
                                            fill="#9ca3af"
                                            fontSize="12"
                                        >
                                            100%
                                        </text>

                                        <text
                                            x="8"
                                            y="174"
                                            fill="#9ca3af"
                                            fontSize="12"
                                        >
                                            0%
                                        </text>

                                        <text
                                            x="500"
                                            y="174"
                                            fill="#9ca3af"
                                            fontSize="12"
                                        >
                                            {openings} {t("boxClicker.opening")}
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ProbabilityModal;